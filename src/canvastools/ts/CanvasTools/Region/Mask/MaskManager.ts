import Konva from "konva";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { DisabledMaskHostZIndex, EnabledMaskHostZIndex, KonvaContainerId } from "../../Core/Utils/constants";
import { ZoomManager } from "../../Core/ZoomManager";
import {
    IBrushSize,
    IDimension,
    IMaskManagerCallbacks,
    MaskSelectorMode,
} from "../../Interface/IMask";
import { SelectionMode } from "../../Interface/ISelectorSettings";

export type LineJoin = 'round' | 'bevel' | 'miter';
export type LineCap = 'butt' | 'round' | 'square';

export class MasksManager {
    /**
     * Reference to the host konva stage element.
     */
    public konvaStage: Konva.Stage;

    /**
     * The current selected mode for mask. Brush or Eraser
     */
    public maskSelectionMode: MaskSelectorMode;

    /**
     * The brush and eraser size
     */
    public brushSize: IBrushSize;

    /**
     * Reference to the host konva div element.
     */
    public konvaContainerHostElement: HTMLDivElement;

    /**
     * Reference to the host div element.
     */
    private editorDiv: HTMLDivElement;

    /**
     * Reference to the konva layer element that contains only the masks drawn
     */
    private canvasLayer: Konva.Layer;

    /**
     * The list of callbacks needed for mask manager
     */
    private callbacks: IMaskManagerCallbacks;

    /**
     * The list of tags used to draw masks
     */
    private tagsList: TagsDescriptor[];

    constructor(editorDiv: HTMLDivElement, konvaDivHostElement: HTMLDivElement, callbacks: IMaskManagerCallbacks) {
        this.callbacks = callbacks;
        this.tagsList = [];
        this.maskSelectionMode = SelectionMode.BRUSH;
        this.brushSize = {
            brush: 30,
            erase: 30,
        };
        this.editorDiv = editorDiv;
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
        if (enabled) {
            this.konvaContainerHostElement.style["z-index"] = EnabledMaskHostZIndex;
            this.maskSelectionMode = mode;
        } else {
            this.konvaContainerHostElement.style["z-index"] = DisabledMaskHostZIndex;
        }
    }

    /**
     * sets the brush size
     * @param size - brush size
     */
    public setBrushSize(size: IBrushSize) {
        this.brushSize = size;
        this.setKonvaCursor();
    }

    /**
     * removes all masks and resets konva
     */
    public eraseAllMasks() {
        this.resetKonvaLayer();
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
            const zoom = ZoomManager.getInstance().getZoomData().currentZoomScale;
            this.konvaStage.scale({
                x: zoom,
                y: zoom,
            });
        }
    }

    private setKonvaCursor(): void {
        const size = this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase;
        const base64 = this.base64EncodedMaskCursor(size);
        const cursor = ["url('", base64, "')", " ", Math.floor(size / 2) + 4, " ", Math.floor(size / 2) + 4, ",auto"];

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
        let currentLine: Konva.Line;
        let previousLine: Konva.Line;
        let zoom;

        this.konvaStage.on("mousedown", (e: Konva.KonvaEventObject<MouseEvent>) => {
            zoom = ZoomManager.getInstance().getZoomData().currentZoomScale;
            const position = this.konvaStage.getPointerPosition();
            const scaledPosition = { x: position.x / zoom, y: position.y / zoom };
            isPaint = true;
            tag = this.getTagsDescriptor();

            // delete any exisitng line/shape
            previousLine = new Konva.Line({
                globalCompositeOperation: "destination-out",
                strokeWidth:
                    this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase,
                points: [scaledPosition.x, scaledPosition.y],
                name: "eraserLine",
                ...this.getLineShapeAttributes()
            });

            this.canvasLayer.add(previousLine);

            // add the new line
            currentLine = new Konva.Line({
                stroke: tag.primary.color,
                strokeWidth:
                    this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase,
                globalCompositeOperation: this.maskSelectionMode === SelectionMode.BRUSH ? "source-over" : "destination-out",
                points: [scaledPosition.x, scaledPosition.y],
                name: tag.primary.name,
                ...this.getLineShapeAttributes()
            });

            this.canvasLayer.add(currentLine);
        });

        this.konvaStage.on("mouseup", (_e: Konva.KonvaEventObject<MouseEvent>) => {
            isPaint = false;
            if (currentLine && currentLine.points().length < 3) {
                currentLine.destroy();
            }
        });

        this.konvaStage.on("mousemove", (_e: Konva.KonvaEventObject<MouseEvent>) => {
            if (!isPaint) {
                return;
            }
            const zoomScale = zoom;
            const position = this.konvaStage.getPointerPosition();
            const scaledPosition = { x: position.x / zoomScale, y: position.y / zoomScale };
            // delete
            const newPointsToRemove = previousLine.points().concat([scaledPosition.x, scaledPosition.y]);
            previousLine.points(newPointsToRemove);

            // add
            const newPoints = currentLine.points().concat([scaledPosition.x, scaledPosition.y]);
            currentLine.points(newPoints);
        });
    }

    private getCurrentDimension(): IDimension {
        const zoom = ZoomManager.getInstance().getZoomData().currentZoomScale;
        const style = getComputedStyle(this.editorDiv);
        return {
            width: parseInt(style.width, undefined) / zoom,
            height: parseInt(style.height, undefined) / zoom,
        };
    }

    private getLineShapeAttributes() {
        return {
            lineCap: "round" as LineCap,
            lineJoin: "round" as LineJoin,
            listening: false,
            tension: 0,
            perfectDrawEnabled: false,
            opacity: 1
        }
    }

    private getTagsDescriptor(): TagsDescriptor {
        const tag = this.callbacks.onMaskDrawingBegin();
        const primaryTagName = tag?.primary?.name;
        if (!this.tagsList.find((tagObject: TagsDescriptor) => tagObject?.primary?.name === primaryTagName)) {
            this.tagsList.push(tag);
        }
        return tag;
    }

    private resetKonvaLayer(): void {
        this.canvasLayer.destroy();
        this.canvasLayer = new Konva.Layer({});
        this.konvaStage.add(this.canvasLayer);
        this.setKonvaCursor();
        this.addListeners();
    }

    private buildUIElements(): void {
        const currentDimensions = this.getCurrentDimension();
        const stage = new Konva.Stage({
            container: KonvaContainerId,
            width: currentDimensions.width,
            height: currentDimensions.height,
        });

        this.canvasLayer = new Konva.Layer({});
        stage.add(this.canvasLayer);
        this.konvaStage = stage;
        this.setKonvaCursor();
        this.addListeners();
    }
}
