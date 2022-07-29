import { decode, encode } from "@thi.ng/rle-pack";
import Konva from "konva";
import { Point2D } from "../../Core/Point2D";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { DisabledMaskHostZIndex, EnabledMaskHostZIndex } from "../../Core/Utils/constants";
import { ZoomManager } from "../../Core/ZoomManager";
import { IBrushSize, IMask, IMaskManagerCallbacks, IRegionEdge, MaskSelectorMode } from "../../Interface/IMask";
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

    /**
     * Reference to the host div element.
     */
    private editorDiv: HTMLDivElement;

    private maskSelectionMode: MaskSelectorMode;

    private brushSize: IBrushSize;

    /**
     * Reference to the konva layer element that contains only the masks drawn
     */
    private canvasLayer: Konva.Layer;

    /**
     * Reference to the konva layer element that contains the masks and polygon drawn.
     * shows expected preview at any point
     */
    private previewCanvasLayer: Konva.Layer;

    /**
     * If true, displays the preview layer
     */
    private previewLayerEnabled: boolean;

    private callbacks: IMaskManagerCallbacks;

    private tagsList: TagsDescriptor[];

    constructor(editorDiv: HTMLDivElement, konvaDivHostElement: HTMLDivElement, callbacks: IMaskManagerCallbacks) {
        this.callbacks = callbacks;
        this.tagsList = [];
        this.maskSelectionMode = SelectionMode.BRUSH;
        this.brushSize = {
            brush: 30,
            erase: 30
        };
        this.editorDiv = editorDiv;
        this.konvaContainerHostElement = konvaDivHostElement;
        this.konvaContainerHostElement.style["z-index"] = DisabledMaskHostZIndex;
        this.buildUIElements();
        this.previewLayerEnabled = false;
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
     * toggles preview layer
     */
     public togglePreview() {
        this.previewLayerEnabled = !this.previewLayerEnabled;
        this.callbacks.onToggleMaskPreview(this.previewLayerEnabled);
        if (this.previewLayerEnabled) {
            this.getAndLoadMasks(this.previewCanvasLayer);
            this.convertRegionsToMask(this.previewCanvasLayer);
            this.previewCanvasLayer.show();
            this.canvasLayer.hide();
        } else {
            this.previewCanvasLayer.destroyChildren();
            this.previewCanvasLayer.hide();
            this.canvasLayer.show();
        }
    }

    /**
     * gets all the masks drawn on the canvas. returns a binary mask with tags
     */
     public getAllMasks(): IMask[] {
        const zoom = ZoomManager.getInstance().getZoomData().currentZoomScale;
        const allMasks: IMask[] = [];
        const style = getComputedStyle(this.editorDiv);
        const currentDimensions = {
            width: parseInt(style.width, undefined) / zoom,
            height: parseInt(style.height, undefined) / zoom
        };

        const width = this.konvaStage.width();
        const height = this.konvaStage.height();
        const scaleX = this.konvaStage.scaleX();
        const scaleY = this.konvaStage.scaleY();
        
        const targetlayer = this.konvaStage.getChildren()[0];
        if (targetlayer) {
            this.konvaStage
                .width(currentDimensions.width)
                .height(currentDimensions.height)
                .scaleX(1)
                .scaleY(1);

            const canvas = this.canvasLayer?.toCanvas();
            const ctx = canvas?.getContext("2d");
            const data: ImageData = ctx.getImageData(0, 0, currentDimensions.width, currentDimensions.height);

            this.konvaStage
                .width(width)
                .height(height)
                .scaleX(scaleX)
                .scaleY(scaleY);
            // remove antialiasing/smoothening ?
            // create an edge pixel matrix
            const edgeArray: number[] = [];
            for (let i = 0; i <= data.data.length - 1 ; i = i + 4) {
                let edgePixel = true;
                edgeArray[i/4] = 0;
                const r = data.data[i];
                const g = data.data[i + 1];
                const b = data.data[i + 2];
                const a = data.data[i + 3];
                if (r !== 0 && g !== 0 && b !== 0) {
                    this.tagsList.forEach((tags: TagsDescriptor) => {
                        const [r1, g1, b1] = tags.primary.srgbColor.to255();
                        if (r === r1 && g === g1 && b === b1) {
                            edgePixel = false;
                        }
                    });
                    if (edgePixel) {
                        edgeArray[i/4] = 1;
                    }
                }
            }

            // remove antialiasing/smoothening ?
            for (let i = 0; i <= edgeArray.length - 1; i++) {
                if (edgeArray[i] === 1) {
                    const topLeft =
                            i - currentDimensions.width - 1 < 0 ? 0 : i - currentDimensions.width - 1;
                    const top = i - currentDimensions.width < 0 ? 0 : i - currentDimensions.width;
                    const topRight =
                        i - currentDimensions.width + 1 < 0 ? 0 : i - currentDimensions.width + 1;
                    const current = i;
                    const previous = i - 1 < 0 ? 0 : i - 1;
                    const next = i + 1 > edgeArray.length - 1 ? edgeArray.length - 1 : i + 1;
                    const bottomLeft =
                        i + currentDimensions.width - 1 > edgeArray.length - 1 ?
                        edgeArray.length - 1 : i + currentDimensions.width - 1;
                    const bottom = i + currentDimensions.width > edgeArray.length - 1  ?
                        edgeArray.length - 1  : i + currentDimensions.width;
                    const bottomRight =
                            i + currentDimensions.width + 1 > edgeArray.length - 1  ?
                            edgeArray.length - 1  : i + currentDimensions.width + 1;

                    const neighboringPixels = [];
                    neighboringPixels.push(topLeft, top, topRight, previous, next, bottomLeft, bottom, bottomRight);
                    const index = neighboringPixels.findIndex(j => edgeArray[j] === 0);
                    if (index >= 0) {
                        const pixel = neighboringPixels[index] * 4;
                        data.data[current * 4] = data.data[pixel];
                        data.data[current * 4 + 1] = data.data[pixel + 1];
                        data.data[current * 4 + 2] = data.data[pixel + 2];
                        data.data[current * 4 + 3] = data.data[pixel + 3];
                    }
                }
            }

            this.tagsList.forEach((tags: TagsDescriptor) => {
                const [r, g, b] = tags.primary.srgbColor.to255();
                const newData: ImageData = ctx.createImageData(currentDimensions.width, currentDimensions.height);

                for (let i = 0; i <= data.data.length - 1 ; i = i + 4) {
                    if (
                        data.data[i] === r &&
                        data.data[i + 1] === g &&
                        data.data[i + 2] === b &&
                        data.data[i + 3] === 255
                    ) {
                        newData.data[i] = 1;
                        newData.data[i + 1] = 1;
                        newData.data[i + 2] = 1;
                        newData.data[i + 3] = 1;
                    }
                }

                allMasks.push({
                    tags,
                    imageData: encode(newData.data, newData.data.length)
                });

                ctx.clearRect(0, 0, currentDimensions.width, currentDimensions.height);
            });  
        }
        console.log(allMasks);
        return allMasks;
    }

    /**
     * draws all the masks on the canvas
     * @param allMasks - all masks data to be drawn on canvas
     */
     public loadAllMasks(allMasks: IMask[]): void {
        this.loadMasksInternal(allMasks, this.canvasLayer);
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
                y: zoom
            });
        }
    }

    private convertRegionsToMask(layer?: Konva.Layer) {
        const regions =  this.callbacks.getAllRegions();
        regions.forEach((polygon: { id: string, tags: TagsDescriptor, regionData: RegionData }) => {
            const tags: TagsDescriptor = polygon.tags;
            const points = polygon.regionData.points;
            const bezierPoints = polygon.regionData.bezierControls;
            const polygonPoints: IRegionEdge[]  = [];
            points.forEach((point: Point2D, index: number) => {
                const nextIndex = index + 1 === points.length ? 0 : index + 1;
                const edge: IRegionEdge = {
                    start: {
                        x: point.x,
                        y: point.y
                    },
                    end: {
                        x: points[nextIndex].x,
                        y: points[nextIndex].y
                    }
                };
                if (bezierPoints[index] !== undefined) {
                    edge.controlPoint = bezierPoints.toJSON()[index];
                }
                polygonPoints.push(edge);
            });
            console.log(polygonPoints);

            const bezierLineDestinationOut = new Konva.Shape({
                globalCompositeOperation: "destination-out",
                stroke: "black",
                fill: "black",
                strokeWidth: 1,
                closed: true,
                listening: false,
                opacity: 1,
                name: "eraserLine",
                sceneFunc: (ctx, shape) => {
                  ctx.beginPath();
                  ctx.moveTo(polygonPoints[0].start.x, polygonPoints[0].start.y);
                  polygonPoints.forEach((edge: IRegionEdge) => {
                    if (edge.controlPoint) {
                        ctx.bezierCurveTo(
                            edge.controlPoint.c1.x,
                            edge.controlPoint.c1.y,
                            edge.controlPoint.c2.x,
                            edge.controlPoint.c2.y,
                            edge.end.x,
                            edge.end.y
                        );
                    } else {
                        ctx.lineTo(edge.end.x, edge.end.y)
                    }
                  });
                  ctx.closePath();
                  ctx.fillStrokeShape(shape);
                }
              });

              const bezierLineSourceOver = new Konva.Shape({
                globalCompositeOperation: "source-over",
                fill: tags.primary.color,
                stroke: tags.primary.color,
                fillEnabled: true,
                strokeWidth: 1,
                closed: true,
                listening: false,
                opacity: 1,
                name: tags.primary.color,
                sceneFunc: (ctx, shape) => {
                    ctx.beginPath();
                    ctx.moveTo(polygonPoints[0].start.x, polygonPoints[0].start.y);
                  polygonPoints.forEach((edge: IRegionEdge) => {
                    if (edge.controlPoint) {
                        ctx.bezierCurveTo(
                            edge.controlPoint.c1.x,
                            edge.controlPoint.c1.y,
                            edge.controlPoint.c2.x,
                            edge.controlPoint.c2.y,
                            edge.end.x,
                            edge.end.y
                        );
                    } else {
                        ctx.lineTo(edge.end.x, edge.end.y)
                    }
                  });
                  ctx.closePath();
                  ctx.fillStrokeShape(shape);
                }
              });

              if (layer) {
                layer.add(bezierLineDestinationOut);
                layer.add(bezierLineSourceOver);
              }
        });
    }

    /**
     * Gets the masks drawn on canvas layer and draws them on layer passed as param
     */
    private getAndLoadMasks(layer: Konva.Layer): void {
        const allMasks = this.getAllMasks();
        this.loadMasksInternal(allMasks, layer);
    }

    private loadMasksInternal(allMasks: IMask[], layer: Konva.Layer) {
        const zoom = ZoomManager.getInstance().getZoomData().currentZoomScale;
        const style = getComputedStyle(this.editorDiv);
        const currentDimensions = {
            width: parseInt(style.width, undefined) / zoom,
            height: parseInt(style.height, undefined) / zoom
        };

        const width = this.konvaStage.width();
        const height = this.konvaStage.height();
        const scaleX = this.konvaStage.scaleX();
        const scaleY = this.konvaStage.scaleY();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = currentDimensions.width;
        canvas.height = currentDimensions.height;

        const newdata = ctx.createImageData(currentDimensions.width, currentDimensions.height); 
        const imageDataAll = newdata.data;
        let imgData;
        allMasks.forEach((mask: IMask) => {
            imgData = decode(mask.imageData);
            const [r, g, b] = mask.tags.primary.srgbColor.to255();
            for (let i = 0; i <= imgData.length - 1 ; i = i + 4) {
                if (imgData[i] === 1) {
                    imageDataAll[i] = r;
                    imageDataAll[i + 1] = g;
                    imageDataAll[i + 2] = b;
                    imageDataAll[i + 3] = 255;
                }
            }
        });

        newdata.data.set(imageDataAll);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.putImageData(newdata, 0, 0);
        const new_image = new Image();
        new_image.src = canvas.toDataURL();

        this.konvaStage
                .width(currentDimensions.width)
                .height(currentDimensions.height)
                .scaleX(1)
                .scaleY(1);
        layer.imageSmoothingEnabled(true);
        layer.add(new Konva.Image({
            image: new_image,
            lineCap: "round",
            lineJoin: "round"
        }));

        this.konvaStage
                .width(width)
                .height(height)
                .scaleX(scaleX)
                .scaleY(scaleY);
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
        let currentLine: Konva.Line;
        let previousLine: Konva.Line ;
        let zoom;

        this.konvaStage.on('mousedown', (e: Konva.KonvaEventObject<MouseEvent>) => {
            zoom = ZoomManager.getInstance().getZoomData().currentZoomScale;
            const position = this.konvaStage.getPointerPosition();
            const scaledPosition = { x: position.x / zoom, y: position.y / zoom};
            isPaint = true;
            tag = this.getTagsDescriptor();
            // delete any exisitng line/shape
            previousLine =  new Konva.Line({
              globalCompositeOperation: "destination-out",
              strokeWidth: this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase,
              lineCap: 'round',
              lineJoin: 'round',
              tension: 0,
              listening: false,
              points: [scaledPosition.x, scaledPosition.y],
              opacity: 1,
              perfectDrawEnabled: false,
              name: "eraserLine"
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
              listening: false,
              tension: 0,
              points: [scaledPosition.x, scaledPosition.y],
              perfectDrawEnabled: false,
              name: tag.primary.name
            });

            this.canvasLayer.add(currentLine);
            e.cancelBubble = false;
            e.evt.preventDefault();
          });
    
          this.konvaStage.on('mouseup', (e: Konva.KonvaEventObject<MouseEvent>) => {
            isPaint = false;
            if (currentLine && currentLine.points().length < 3) {
                currentLine.destroy();
            }
            e.cancelBubble = true;
            e.evt.preventDefault();
          });

          this.konvaStage.on('mousemove', (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (!isPaint) {
              return;
            }
            const zoomScale = zoom;
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

    private getTagsDescriptor(): TagsDescriptor {
        const tag = this.callbacks.onMaskDrawingBegin();
        const primaryTagName = tag?.primary?.name;
        if(!this.tagsList.find((tagObject: TagsDescriptor) => tagObject?.primary?.name === primaryTagName)) {
            this.tagsList.push(tag);
        }
        return tag;
    }

    private resetKonvaLayer(): void {
        this.canvasLayer.destroy();
        this.previewCanvasLayer.destroy();
        this.canvasLayer = new Konva.Layer({});
        this.previewCanvasLayer = new Konva.Layer({});
        this.konvaStage.add(this.canvasLayer);
        this.konvaStage.add(this.previewCanvasLayer);
        this.setKonvaCursor();
        this.addListeners();
    }

    private buildUIElements(): void {
        const style = getComputedStyle(this.editorDiv);
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

        this.previewCanvasLayer = new Konva.Layer({});
        stage.add(this.previewCanvasLayer);

        this.konvaStage = stage;

        this.setKonvaCursor();
        this.addListeners();
    }
}