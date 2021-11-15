import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData, RegionDataType } from "../../Core/RegionData";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

import { CrossElement } from "../Component/CrossElement";
import { Selector } from "./Selector";
import { ConfigurationManager } from "../../Core/ConfigurationManager";

/**
 * The selector to define a polygon-region.
 */
export class PolygonSelector extends Selector {
    /**
     * Default radius for the point element. Can be redefined through css styles.
     */
    private static DEFAULT_POINT_RADIUS: number = 3;

    /**
     * Default radius for the point element. Can be redefined through css styles.
     */
    private static DEFAULT_SELECTOR_RADIUS: number = 6;

    /**
     * The `CrossElement` to define point position
     */
    private crossA: CrossElement;

    /**
     * The element to add a new point.
     */
    private nextPoint: Snap.Element;

    /**
     * The line segment to add a new point.
     */
    private nextSegment: Snap.Element;

    /**
     * The line to the new point from the first point.
     */
    private nextL1: Snap.Element;

    /**
     * The line to the new point from the last point.
     */
    private nextLN: Snap.Element;

    /**
     * The grouping element for polyline points.
     */
    private pointsGroup: Snap.Element;

    /**
     * The polygon element.
     */
    private polygon: Snap.Element;

    /**
     * Collection of points composing polyline data.
     */
    private points: Point2D[];

    /**
     * The last point.
     */
    private lastPoint: Point2D;

    /**
     * Current state of selector.
     */
    private isCapturing: boolean = false;

    /**
     * When undo is called, those points are pushed into this queue.
     * If new points are added the redo queue is cleared.
     */
    private redoQueue: Point2D[];

    /**
     * Creates new `PolygonSelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(parent, paper, boundRect, callbacks);
        this.redoQueue = [];

        this.buildUIElements();
        this.reset();
        this.hide();
    }

    /**
     * Resizes the selector to specified `width` and `height`.
     * @param newWidth - The new `width`.
     * @param newHeight - The new `height`.
     * @param oldWidth - The previous `width` before the resize.
     * @param oldHeight - The previous `height` before the resize.
     */
    public resize(newWidth: number, newHeight: number, oldWidth?: number, oldHeight?: number) {
        const [xScale, yScale] = [newWidth / oldWidth, newHeight / oldHeight];

        super.resize(newWidth, newHeight);
        this.crossA.resize(newWidth, newHeight);
        if (oldWidth !== undefined || oldHeight !== undefined) {
            if (this.lastPoint != null) {
                this.lastPoint.x = Math.round(this.lastPoint.x * xScale);
                this.lastPoint.y = Math.round(this.lastPoint.y * yScale);
            }

            this.points = this.points.map((p) => new Point2D(Math.round(p.x * xScale), Math.round(p.y * yScale)));
            this.redrawPoints();
        }
    }

    /**
     * Hides the selector.
     */
    public hide() {
        super.hide();
        this.hideAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }

    /**
     * Shows the selector.
     */
    public show() {
        super.show();
        this.showAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }

    /**
     * Undo the last point drawn, if there is something to undo
     */
    public undo() {
        if (this.canUndo()) {
            const pointToUndo = this.points.pop();
            this.pointsGroup.children().pop().remove();
            this.lastPoint = this.points[this.points.length - 1];

            this.redoQueue.push(pointToUndo);

            this.redrawPoints();
        }
    }

    /**
     * Redo the last point that was undone
     */
    public redo() {
        if (this.canRedo()) {
            const pointToRedo = this.redoQueue.pop();
            this.addPoint(pointToRedo.x, pointToRedo.y);
        }
    }

    public canRedo(): boolean {
        return this.redoQueue.length > 0;
    }

    public canUndo(): boolean {
        return this.points.length > 1;
    }

    /**
     * Disables and hides this selector.
     */
    public disable() {
        super.disable();
        this.reset();
    }

    /**
     * Resets the selector.
     */
    public reset(): void {
        this.points = new Array<Point2D>();
        this.lastPoint = null;
        let ps = this.pointsGroup.children();
        while (ps.length > 0) {
            ps[0].remove();
            ps = this.pointsGroup.children();
        }

        this.polygon.attr({
            points: "",
        });

        if (this.isCapturing) {
            this.isCapturing = false;
        }
    }

    /**
     * Builds selector's UI.
     */
    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("polygonSelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.nextPoint = this.paper.circle(0, 0, PolygonSelector.DEFAULT_SELECTOR_RADIUS);
        this.nextPoint.addClass("nextPointStyle");

        this.nextSegment = this.paper.g();
        this.nextL1 = this.paper.line(0, 0, 0, 0);
        this.nextLN = this.paper.line(0, 0, 0, 0);
        this.nextL1.addClass("nextSegmentStyle");
        this.nextLN.addClass("nextSegmentStyle");
        this.nextSegment.add(this.nextL1);
        this.nextSegment.add(this.nextLN);

        this.pointsGroup = this.paper.g();
        this.pointsGroup.addClass("polygonGroupStyle");

        this.polygon = this.paper.polygon([]);
        this.polygon.addClass("polygonStyle");

        this.node.add(this.polygon);
        this.node.add(this.pointsGroup);
        this.node.add(this.crossA.node);
        this.node.add(this.nextSegment);
        this.node.add(this.nextPoint);

        const listeners: EventListeners = [
            {
                event: "pointerenter",
                base: this.parentNode,
                listener: () => this.show(),
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.parentNode,
                listener: (e: PointerEvent) => {
                    if (!this.isCapturing) {
                       this.hide();
                    } else {
                        const rect = this.parentNode.getClientRects();
                        const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.nextPoint, p);
                    }
                },
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.parentNode,
                listener: (e: PointerEvent) => {
                    if (!this.isCapturing) {
                        this.isCapturing = true;

                        if (typeof this.callbacks.onSelectionBegin === "function") {
                            this.callbacks.onSelectionBegin();
                        }
                    }
                },
                bypass: false,
            },
            {
                event: "click",
                base: this.parentNode,
                listener: (e: MouseEvent) => {
                    if (e.detail <= 1 && this.isCapturing) {
                        window.requestAnimationFrame(() => {
                            const p = new Point2D(this.crossA.x, this.crossA.y);
                            this.addPoint(p.x, p.y);
                            this.lastPoint = p;
                            this.redoQueue = [];
                        });

                        if (typeof this.callbacks.onNextSelectionPoint === "function") {
                            this.callbacks.onNextSelectionPoint(new Point2D(this.crossA.x, this.crossA.y));
                        }
                    }
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.parentNode,
                listener: (e: PointerEvent) => {
                    window.requestAnimationFrame(() => {
                        const rect = this.parentNode.getClientRects();
                        const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.nextPoint, p);
                        if (this.lastPoint != null) {
                            this.moveLine(this.nextLN, this.lastPoint, p);
                            this.moveLine(this.nextL1, this.points[0], p);
                        } else {
                            this.moveLine(this.nextLN, p, p);
                            this.moveLine(this.nextL1, p, p);
                        }
                    });
                    e.preventDefault();
                },
                bypass: false,
            },
            {
                event: "dblclick",
                base: this.parentNode,
                listener: () => this.submitPolygon(),
                bypass: false,
            },
            {
                event: "keyup",
                base: window,
                listener: (e: KeyboardEvent) => {
                    if (e.code === "Escape") {
                        this.submitPolygon();
                    }
                },
                bypass: true,
            },
        ];

        this.subscribeToEvents(listeners);
    }

    /**
     * Adds a new point to polygon at specified coordinates
     * @param x - x-coordinate of the new point.
     * @param y - y-coordinate of the new point.
     */
    private addPoint(x: number, y: number) {
        this.points.push(new Point2D(x, y));

        const point = this.paper.circle(x, y, PolygonSelector.DEFAULT_POINT_RADIUS);
        point.addClass("polygonPointStyle");

        this.pointsGroup.add(point);

        this.redrawPoints();
    }

    private redrawPoints() {
        this.polygon.attr({
            points: this.points.map((p) => `${p.x},${p.y}`).join(","),
        });
        this.pointsGroup.children().forEach((child, index) => {
            if (this.points[index]) {
                child.attr({ cx: this.points[index].x, cy: this.points[index].y });
            }
        });
    }

    /**
     * Submits the new polygon region to the callback function.
     */
    private submitPolygon() {
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const box = this.polygon.getBBox();

            const regionType = (ConfigurationManager.isPathRegionEnabled) ? RegionDataType.Path : RegionDataType.Polygon;
            this.callbacks.onSelectionEnd(new RegionData(box.x, box.y, box.width, box.height,
                                          this.points.map((p) => p.copy()), regionType));
        }
        this.reset();
    }
}
