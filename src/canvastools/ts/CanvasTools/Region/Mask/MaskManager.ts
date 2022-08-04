import { decode, encode } from "@thi.ng/rle-pack";
import Konva from "konva";
import { LayerManager } from "../../Core/LayerManager";
import { Point2D } from "../../Core/Point2D";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { DisabledMaskHostZIndex, EnabledMaskHostZIndex, KonvaContainerId } from "../../Core/Utils/constants";
import { ZoomManager } from "../../Core/ZoomManager";
import {
    IBrushSize,
    IDimension,
    IMask,
    IMaskManagerCallbacks,
    IRegionEdge,
    MaskSelectorMode,
} from "../../Interface/IMask";
import { SelectionMode } from "../../Interface/ISelectorSettings";

export type LineJoin = "round" | "bevel" | "miter";
export type LineCap = "butt" | "round" | "square";

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
     * Reference to the konva layer element that contains the masks and polygon drawn.
     * shows expected preview at any point
     */
    private previewCanvasLayer: Konva.Layer;

    /**
     * If true, displays the preview layer
     */
    private previewLayerEnabled: boolean;

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
        this.previewLayerEnabled = false;
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

    /**
     * toggles preview canvas layer
     */
    public togglePreview() {
        this.previewLayerEnabled = !this.previewLayerEnabled;
        this.callbacks.onToggleMaskPreview(this.previewLayerEnabled);
        if (this.previewLayerEnabled) {
            this.setKonvaCursorToDefault();
            this.removeEventListeners();
            this.getMaskPreview();
            this.previewCanvasLayer.show();
            this.canvasLayer.hide();
        } else {
            this.addListeners();
            this.setKonvaCursor();
            this.previewCanvasLayer.destroyChildren();
            this.previewCanvasLayer.hide();
            this.canvasLayer.show();
        }
    }

    /**
     * gets all the masks drawn on the canvas. returns a binary mask with tags
     * @param layerNumber gets masks from shapes in this layer
     */
    public getAllMasks(layerNumber?: number): IMask[] {
        const allMasks: IMask[] = [];
        const currentDimensions = this.getCurrentDimension();

        const width = this.konvaStage.width();
        const height = this.konvaStage.height();
        const scaleX = this.konvaStage.scaleX();
        const scaleY = this.konvaStage.scaleY();

        const targetlayer = this.konvaStage.getChildren()[0];
        if (targetlayer) {
            // The konva stage is scaled back to zoom = 1 before extracting image data out of canvas
            // post that, the konvaStage is scaled back to its original dimensions
            this.konvaStage.width(currentDimensions.width).height(currentDimensions.height).scaleX(1).scaleY(1);
            let canvas: HTMLCanvasElement;
            let tempCanvasLayer: Konva.Layer;
            if (layerNumber) {
                const shapes = targetlayer.getChildren();
                const filteredLayerShapes = shapes.filter((shape) => {
                    return shape.attrs.layerNumber === layerNumber;
                });
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = currentDimensions.width;
                tempCanvas.height = currentDimensions.height;
                tempCanvasLayer = new Konva.Layer({});
                this.konvaStage.add(tempCanvasLayer);
                filteredLayerShapes.forEach((shape) => {
                    tempCanvasLayer.add(shape.clone());
                });
                canvas = tempCanvasLayer?.toCanvas();
            } else {
                canvas = this.canvasLayer?.toCanvas();
            }

            const ctx = canvas?.getContext("2d");
            const data: ImageData = ctx.getImageData(0, 0, currentDimensions.width, currentDimensions.height);

            this.konvaStage.width(width).height(height).scaleX(scaleX).scaleY(scaleY);

            if (tempCanvasLayer) {
                tempCanvasLayer.destroy();
            }

            // create an edge pixel matrix
            const edgeArray = this.getEdgePixelArray(data.data);

            // remove antialiasing/smoothening ?
            const imgData = this.unSmoothenImageData(edgeArray, currentDimensions, data.data);

            // create a list of binary masks with tag object
            this.tagsList.forEach((tags: TagsDescriptor) => {
                const [r, g, b] = tags.primary.srgbColor.to255();
                const newData: ImageData = ctx.createImageData(currentDimensions.width, currentDimensions.height);

                // converting the unit8clamped array to a binary matrix
                for (let i = 0; i <= data.data.length - 1; i = i + 4) {
                    if (imgData[i] === r && imgData[i + 1] === g && imgData[i + 2] === b && imgData[i + 3] === 255) {
                        newData.data[i] = 1;
                        newData.data[i + 1] = 1;
                        newData.data[i + 2] = 1;
                        newData.data[i + 3] = 1;
                    }
                }

                // run length encoding is done here
                allMasks.push({
                    tags,
                    imageData: encode(newData.data, newData.data.length),
                });

                ctx.clearRect(0, 0, currentDimensions.width, currentDimensions.height);
            });
        }
        return allMasks;
    }

    /**
     * Draws all the masks on the canvas
     * @param allMasks - all masks data to be drawn on canvas
     */
    public loadAllMasks(allMasks: IMask[]): void {
        this.loadMasksInternal(allMasks, this.canvasLayer);
    }

    /**
     * Removes antialiasing or smoothening from image data.
     * When drawing a shape on the canvas with smoothening on, the shape's edge has mixed pixel value
     * hence it looks curved. But when extracting image data out of canvas, we need each pixel to belong
     * to either of our tag colors. Hence if a pixel is on edge (its color value does not match any of the tag colors),
     * we look for the pixel value of its neighbouring 8 pixels to determine if we can assign the neighbours pixel value
     * to this pixel starting from topLeft pixel and going clockwise.
     */
    private unSmoothenImageData(
        edgeArray: number[],
        currentDimensions: IDimension,
        imgData: Uint8ClampedArray
    ): Uint8ClampedArray {
        for (let i = 0; i <= edgeArray.length - 1; i++) {
            if (edgeArray[i] === 1) {
                const topLeft = i - currentDimensions.width - 1 < 0 ? 0 : i - currentDimensions.width - 1;
                const top = i - currentDimensions.width < 0 ? 0 : i - currentDimensions.width;
                const topRight = i - currentDimensions.width + 1 < 0 ? 0 : i - currentDimensions.width + 1;
                const current = i;
                const previous = i - 1 < 0 ? 0 : i - 1;
                const next = i + 1 > edgeArray.length - 1 ? edgeArray.length - 1 : i + 1;
                const bottomLeft =
                    i + currentDimensions.width - 1 > edgeArray.length - 1
                        ? edgeArray.length - 1
                        : i + currentDimensions.width - 1;
                const bottom =
                    i + currentDimensions.width > edgeArray.length - 1
                        ? edgeArray.length - 1
                        : i + currentDimensions.width;
                const bottomRight =
                    i + currentDimensions.width + 1 > edgeArray.length - 1
                        ? edgeArray.length - 1
                        : i + currentDimensions.width + 1;

                const neighboringPixels = [];
                neighboringPixels.push(topLeft, top, topRight, previous, next, bottomLeft, bottom, bottomRight);
                const index = neighboringPixels.findIndex((j) => edgeArray[j] === 0);
                if (index >= 0) {
                    const pixel = neighboringPixels[index] * 4;
                    imgData[current * 4] = imgData[pixel];
                    imgData[current * 4 + 1] = imgData[pixel + 1];
                    imgData[current * 4 + 2] = imgData[pixel + 2];
                    imgData[current * 4 + 3] = imgData[pixel + 3];
                }
            }
        }

        return imgData;
    }

    /**
     * gets the pixels from the imageData that do not match any tag color. Hence they are edge pixels
     */
    private getEdgePixelArray(imageData: Uint8ClampedArray): number[] {
        const edgeArray: number[] = [];
        for (let i = 0; i <= imageData.length - 1; i = i + 4) {
            let edgePixel = true;
            edgeArray[i / 4] = 0;
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            if (r !== 0 && g !== 0 && b !== 0) {
                this.tagsList.forEach((tags: TagsDescriptor) => {
                    const [r1, g1, b1] = tags.primary.srgbColor.to255();
                    if (r === r1 && g === g1 && b === b1) {
                        edgePixel = false;
                    }
                });
                if (edgePixel) {
                    edgeArray[i / 4] = 1;
                }
            }
        }
        return edgeArray;
    }

    private getMaskPreview(): void {
        // TODO: figure out what is in layer 1? Is it regions or mask
        const isRegionsFirst = true;
        const maxLayerCount = this.getCurrentLayerNumber();

        for (let i = 1; i <= maxLayerCount; i++) {
            if (isRegionsFirst) {
                if (i % 2 === 0) {
                    this.getAndLoadMasks(this.previewCanvasLayer, i);
                } else {
                    this.convertRegionsToMask(this.previewCanvasLayer, i);
                }
            } else {
                if (i % 2 !== 0) {
                    this.getAndLoadMasks(this.previewCanvasLayer, i);
                } else {
                    this.convertRegionsToMask(this.previewCanvasLayer, i);
                }
            }
        }
    }

    private convertRegionsToMask(layer: Konva.Layer, layerNumber: number) {
        const allRegions = this.callbacks.getAllRegionsWithLayer();
        const regions = allRegions.filter((region) => {
            return region.layerNumber === layerNumber;
        });
        regions.forEach((polygon: { id: string; tags: TagsDescriptor; regionData: RegionData }) => {
            const tags: TagsDescriptor = polygon.tags;
            const points = polygon.regionData.points;
            const bezierPoints = polygon.regionData.bezierControls;
            const polygonPoints: IRegionEdge[] = [];
            points.forEach((point: Point2D, index: number) => {
                const nextIndex = index + 1 === points.length ? 0 : index + 1;
                const edge: IRegionEdge = {
                    start: {
                        x: point.x,
                        y: point.y,
                    },
                    end: {
                        x: points[nextIndex].x,
                        y: points[nextIndex].y,
                    },
                };
                if (bezierPoints[index] !== undefined) {
                    edge.controlPoint = bezierPoints.toJSON()[index];
                }
                polygonPoints.push(edge);
            });

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
                            ctx.lineTo(edge.end.x, edge.end.y);
                        }
                    });
                    ctx.closePath();
                    ctx.fillStrokeShape(shape);
                },
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
                            ctx.lineTo(edge.end.x, edge.end.y);
                        }
                    });
                    ctx.closePath();
                    ctx.fillStrokeShape(shape);
                },
            });

            if (layer) {
                layer.add(bezierLineDestinationOut);
                layer.add(bezierLineSourceOver);
            }
        });
    }

    /**
     * Gets the masks drawn on canvas layer and draws them on layer passed as parameter
     */
    private getAndLoadMasks(layer: Konva.Layer, layerNumber: number): void {
        const allMasks = this.getAllMasks(layerNumber);
        this.loadMasksInternal(allMasks, layer);
    }

    private loadMasksInternal(allMasks: IMask[], layer: Konva.Layer) {
        const currentDimensions = this.getCurrentDimension();

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
        // look through all the colored mask. each tag has its own binary mask
        // decode from rle to binary matrix and then convert it to a unit8clamped array of imageData
        allMasks.forEach((mask: IMask) => {
            imgData = decode(mask.imageData);
            const [r, g, b] = mask.tags.primary.srgbColor.to255();
            for (let i = 0; i <= imgData.length - 1; i = i + 4) {
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

        // draw the masks at scale = 1 and then scale the konvaStage to desired dimensions
        this.konvaStage.width(currentDimensions.width).height(currentDimensions.height).scaleX(1).scaleY(1);
        layer.imageSmoothingEnabled(true);
        const newKonvaImg = new Konva.Image({
            image: new_image,
            lineCap: "round",
            lineJoin: "round",
        });
        newKonvaImg.setAttr("layerNumber", this.getCurrentLayerNumber());
        layer.add(newKonvaImg);

        this.konvaStage.width(width).height(height).scaleX(scaleX).scaleY(scaleY);
    }

    private setKonvaCursor(): void {
        const size = this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase;
        const base64 = this.base64EncodedMaskCursor(size);
        const cursor = ["url('", base64, "')", " ", Math.floor(size / 2) + 4, " ", Math.floor(size / 2) + 4, ",auto"];

        this.konvaStage.container().style.cursor = cursor.join("");
    }

    private setKonvaCursorToDefault(): void {
        this.konvaStage.container().style.cursor = "default";
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

    private getCurrentLayerNumber(): number {
        return LayerManager.getInstance().getCurrentLayerNumber();
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
                ...this.getLineShapeAttributes(),
            });
            previousLine.setAttr("layerNumber", this.getCurrentLayerNumber());

            this.canvasLayer.add(previousLine);

            // add the new line
            currentLine = new Konva.Line({
                stroke: tag.primary.color,
                strokeWidth:
                    this.maskSelectionMode === SelectionMode.BRUSH ? this.brushSize.brush : this.brushSize.erase,
                globalCompositeOperation:
                    this.maskSelectionMode === SelectionMode.BRUSH ? "source-over" : "destination-out",
                points: [scaledPosition.x, scaledPosition.y],
                name: tag.primary.name,
                ...this.getLineShapeAttributes(),
            });
            currentLine.setAttr("layerNumber", this.getCurrentLayerNumber());

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
            opacity: 1,
        };
    }

    private removeEventListeners(): void {
        this.konvaStage.off("mousemove mousedown mouseup");
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
        this.previewCanvasLayer.destroy();
        this.canvasLayer = new Konva.Layer({});
        this.previewCanvasLayer = new Konva.Layer({});
        this.konvaStage.add(this.canvasLayer);
        this.konvaStage.add(this.previewCanvasLayer);
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

        this.previewCanvasLayer = new Konva.Layer({});
        stage.add(this.previewCanvasLayer);

        this.konvaStage = stage;
        this.setKonvaCursor();
        this.addListeners();
    }
}
