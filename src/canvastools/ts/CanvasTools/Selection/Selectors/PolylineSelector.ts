import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData, RegionDataType } from "../../Core/RegionData";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { IMovable } from "../../Interface/IMovable";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

import { IPoint2D } from "../../Interface/IPoint2D";
import { CrossElement } from "../Component/CrossElement";
import { Selector } from "./Selector";

/**
 * The selector to define a polyline-region.
 */
export class PolylineSelector extends Selector {
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
     * The grouping element for polyline points.
     */
    private pointsGroup: Snap.Element;

    /**
     * The polyline element.
     */
    private polyline: Snap.Element;

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
     * Creates new `PolylineSelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(parent, paper, boundRect, callbacks);

        this.buildUIElements();
        this.reset();
        this.hide();
    }

    /**
     * Resizes the selector to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    public resize(width: number, height: number) {
        super.resize(width, height);
        this.crossA.resize(width, height);
    }

    /**
     * Hides the selector.
     */
    public hide() {
        super.hide();
        this.crossA.hide();
        this.nextPoint.node.setAttribute("visibility", "hidden");
        this.nextSegment.node.setAttribute("visibility", "hidden");
        this.polyline.node.setAttribute("visibility", "hidden");
        this.pointsGroup.node.setAttribute("visibility", "hidden");
    }

    /**
     * Shows the selector.
     */
    public show() {
        super.show();
        this.crossA.show();
        this.nextPoint.node.setAttribute("visibility", "visible");
        this.nextSegment.node.setAttribute("visibility", "visible");
        this.polyline.node.setAttribute("visibility", "visible");
        this.pointsGroup.node.setAttribute("visibility", "visible");
    }

    /**
     * Disables and hides this selector.
     */
    public disable() {
        this.reset();
        super.disable();
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

        this.polyline.attr({
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
        this.node.addClass("polylineSelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.nextPoint = this.paper.circle(0, 0, PolylineSelector.DEFAULT_SELECTOR_RADIUS);
        this.nextPoint.addClass("nextPointStyle");

        this.nextSegment = this.paper.line(0, 0, 0, 0);
        this.nextSegment.addClass("nextSegmentStyle");

        this.pointsGroup = this.paper.g();
        this.pointsGroup.addClass("polylineGroupStyle");

        this.polyline = this.paper.polyline([]);
        this.polyline.addClass("polylineStyle");

        this.node.add(this.polyline);
        this.node.add(this.pointsGroup);
        this.node.add(this.crossA.node);
        this.node.add(this.nextSegment);
        this.node.add(this.nextPoint);

        const listeners: EventListeners = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "click", listener: this.onClick, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "dblclick", listener: this.onDoubleClick, base: this.parentNode, bypass: false },
            { event: "keyup", listener: this.onKeyUp, base: window, bypass: true },
        ];

        this.subscribeToEvents(listeners);
    }

    /**
     * Adds a new point to polyline at specified coordinates
     * @param x - x-coordinate of the new point.
     * @param y - y-coordinate of the new point.
     */
    private addPoint(x: number, y: number) {
        this.points.push(new Point2D(x, y));

        const point = this.paper.circle(x, y, PolylineSelector.DEFAULT_POINT_RADIUS);
        point.addClass("polylinePointStyle");

        this.pointsGroup.add(point);

        let pointsStr = "";
        this.points.forEach((p) => {
            pointsStr += `${p.x},${p.y},`;
        });

        this.polyline.attr({
            points: pointsStr.substr(0, pointsStr.length - 1),
        });
    }

    /**
     * Listener for the pointer enter event.
     * @param e PointerEvent
     */
    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.show();
        });
    }

    /**
     * Listener for the pointer leave event.
     * @param e PointerEvent
     */
    private onPointerLeave(e: PointerEvent) {
        if (!this.isCapturing) {
            window.requestAnimationFrame(() => {
                this.hide();
            });
        } else {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            this.moveCross(this.crossA, p);
            this.movePoint(this.nextPoint, p);
        }
    }

    /**
     * Listener for the pointer down event.
     * @param e PointerEvent
     */
    private onPointerDown(e: PointerEvent) {
        if (!this.isCapturing) {
            this.isCapturing = true;

            if (typeof this.callbacks.onSelectionBegin === "function") {
                this.callbacks.onSelectionBegin();
            }
        }
    }

    /**
     * Listener for the mouse click event.
     * @param e MouseEvent
     */
    private onClick(e: MouseEvent) {
        if (e.detail <= 1) {
            window.requestAnimationFrame(() => {
                const p = new Point2D(this.crossA.x, this.crossA.y);
                this.addPoint(p.x, p.y);

                this.lastPoint = p;
            });
        }
    }

    /**
     * Listener for the pointer move event.
     * @param e PointerEvent
     */
    private onPointerMove(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            this.show();
            this.moveCross(this.crossA, p);
            this.movePoint(this.nextPoint, p);

            if (this.lastPoint != null) {
                this.moveLine(this.nextSegment, this.lastPoint, p);
            } else {
                this.moveLine(this.nextSegment, p, p);
            }
        });

        e.preventDefault();
    }

    /**
     * Listener for the mouse double click event.
     * @param e MouseEvent
     */
    private onDoubleClick(e: MouseEvent) {
        this.submitPolyline();
    }

    /**
     * Submits the new polygon region to the callback function.
     */
    private submitPolyline() {
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const points = this.getPolylinePoints();
            if (points.length <= 0) {
                return;
            }
            const box = this.polyline.getBBox();

            this.callbacks.onSelectionEnd(new RegionData(box.x, box.y, box.width, box.height,
                                          this.getPolylinePoints(), RegionDataType.Polyline));
        }
        this.reset();
    }

    /**
     * Returns the polyline points, closes it if required.
     * @param close - A flag to "close" the polyline if last point is near to the first one.
     * @param threshold - The threshold to calculate what is "near".
     */
    private getPolylinePoints(close: boolean = true, threshold: number = 5) {
        const points = this.points.map((p) => p.copy());

        if (points.length >= 3 && close) {
            const fp = points[0];
            const lp = points[points.length - 1];

            const distanceSquare = (fp.x - lp.x) * (fp.x - lp.x) + (fp.y - lp.y) * (fp.y - lp.y);
            if (distanceSquare <= threshold * threshold) {
                points[points.length - 1] = fp.copy();
            }
        }

        return points;
    }

    /**
     * Listener for the key up event.
     * @param e KeyboardEvent
     */
    private onKeyUp(e: KeyboardEvent) {
        // Holding shift key enable square drawing mode
        if (e.code === "Escape") {
            this.submitPolyline();
        }
    }
}
