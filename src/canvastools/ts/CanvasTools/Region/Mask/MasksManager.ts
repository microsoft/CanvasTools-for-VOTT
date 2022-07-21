import Konva from "konva";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { DisabledMaskHostZIndex, EnabledMaskHostZIndex } from "../../Core/Utils/constants";
import { ZoomManager } from "../../Core/ZoomManager";
import { IBrushSize, IMaskManagerCallbacks, MaskSelectorMode } from "../../Interface/IMask";
import { SelectionMode } from "../../Interface/ISelectorSettings";

export class MasksManager {
    /**
     * Reference to the host konva stage element.
     */
    private konvaStage: Konva.Stage;

    /**
     * Reference to the host konva div element.
     */
    private konvaContainerHostElement: HTMLDivElement;

    private maskSelectionMode: MaskSelectorMode;

    private brushSize: IBrushSize;

    private canvasLayer: Konva.Layer;

    private callbacks: IMaskManagerCallbacks;

    constructor(konvaDivHostElement: HTMLDivElement, callbacks: IMaskManagerCallbacks) {
        this.callbacks = callbacks;
        this.maskSelectionMode = SelectionMode.BRUSH;
        this.brushSize = {
            brush: 10,
            erase: 5
        };
        this.konvaContainerHostElement = konvaDivHostElement;
        this.konvaContainerHostElement.style["z-index"] = DisabledMaskHostZIndex;
        this.buildUIElements();
    }

    /**
     * enables and disables the masks manager with selected mask mode
     * @param enabled - indicates if mask selection is enabled
     * @param mode - optional. sets the mode of mask selection to either brush or eraser
     */
     public setSelection(enabled: boolean, mode?: MaskSelectorMode) {
        // explain these zIndex numbers
        if (enabled) {
            this.konvaContainerHostElement.style["z-index"] = EnabledMaskHostZIndex;
            this.maskSelectionMode = mode;
        } else {
            this.konvaContainerHostElement.style["z-index"] = DisabledMaskHostZIndex;
        }
    }

    /**
     * enables and disables the masks manager with selected mask mode
     * @param enabled - indicates if mask selection is enabled
     * @param mode - optional. sets the mode of mask selection to either brush or eraser
     */
     public setBrushSize(size: IBrushSize) {
        this.brushSize = size;
        this.setKonvaCursor();
    }

    /**
     * Resizes the manager to specified `width` and `height`.
     * @param width - The new manager width.
     * @param height - The new manager height.
     */
    public resize(width: number, height: number) {
        if (this.konvaStage) {
            this.konvaStage.width(width);
            this.konvaStage.height(height);
            this.canvasLayer.width(width);
            this.canvasLayer.height(height);
            const zoom = ZoomManager.getInstance().getZoomData().currentZoomScale;
            this.konvaStage.scale({
                x: zoom,
                y: zoom
            });
        }
    }

    private setKonvaCursor(): void {
        const size = this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase;
        // cursor stuff
        const base64 = this.base64EncodedMaskCursor(size);
        const cursor = [
            "url('", base64, "')",
            " ",
            Math.floor(size / 2) + 4,
            " ",
            Math.floor(size / 2) + 4,
            ",auto"
        ];

        this.konvaStage.container().style.cursor = cursor.join("");
    }

    private base64EncodedMaskCursor(size): string {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
      
        canvas.width = size * 4 + 8;
        canvas.height = size * 4 + 8;
      
        ctx.beginPath();
        ctx.arc(size / 2 + 4, size / 2 + 4, size / 2, 0, 2 * Math.PI, false);
      
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
      
        return canvas.toDataURL();
    }

    private addListeners(): void {
        let tag: TagsDescriptor;
        let isPaint = false;
        let currentLine;
        let previousLine;

        this.konvaStage.on('mousedown', (e: Konva.KonvaEventObject<MouseEvent>) => {
            isPaint = true;
            tag = this.callbacks.onMaskDrawingBegin();
            // delete any exisitng line/shape
            previousLine =  new Konva.Line({
              globalCompositeOperation: "destination-out",
              stroke: "white",
              strokeWidth: this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase,
              lineCap: 'round',
              lineJoin: 'round',
              tension: 2,
              listening: false,
              points: [],
              opacity: 1,
              name: "black"
            });

            this.canvasLayer.add(previousLine);

            // add the new line
            currentLine = new Konva.Line({
              opacity: 1,
              stroke: tag.primary.color,
              strokeWidth: this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase,
              globalCompositeOperation:
                this.maskSelectionMode === "brush" ? 'source-over' : 'destination-out',
              lineCap: 'round',
              lineJoin: 'round',
              tension: 2,
              points: [],
              name: tag.primary.name
            });

            this.canvasLayer.add(currentLine);
            e.cancelBubble = true;
            e.evt.preventDefault();
          });
    
          this.konvaStage.on('mouseup', (e: Konva.KonvaEventObject<MouseEvent>) => {
            isPaint = false;
            e.cancelBubble = true;
            e.evt.preventDefault();
          });

          this.konvaStage.on('mousemove', (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (!isPaint) {
              return;
            }
            const zoomScale = ZoomManager.getInstance().getZoomData().currentZoomScale;
            const position = this.konvaStage.getPointerPosition();
            const scaledPosition = { x: position.x / zoomScale, y: position.y / zoomScale};
            // delete
            const newPointsToRemove = previousLine.points().concat([scaledPosition.x, scaledPosition.y]);
            previousLine.points(newPointsToRemove);

            // add
            const newPoints = currentLine.points().concat([scaledPosition.x, scaledPosition.y]);
            currentLine.points(newPoints);

            e.cancelBubble = true;
            e.evt.preventDefault();
          });
    }

    private buildUIElements(): void {
        const style = getComputedStyle(this.konvaContainerHostElement);
        const currentDimensions = {
            width: parseInt(style.width, undefined),
            height: parseInt(style.height, undefined)
        };
        const stage = new Konva.Stage({
            container: "konvaContainer", // id should be a constant
            width: currentDimensions.width,
            height: currentDimensions.height
        });

        this.canvasLayer = new Konva.Layer({});
        stage.add(this.canvasLayer);
        this.konvaStage = stage;

        this.setKonvaCursor();
        this.addListeners();
    }
}