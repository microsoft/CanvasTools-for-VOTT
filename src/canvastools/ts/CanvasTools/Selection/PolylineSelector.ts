import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";
import { RegionData, RegionDataType } from "../Core/RegionData";

import { IEventDescriptor } from "../Interface/IEventDescriptor";
import { IMovable } from "../Interface/IMovable";
import { ISelectorCallbacks } from "../Interface/ISelectorCallbacks";

import { CrossElement } from "./CrossElement";
import { Selector } from "./Selector";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export class PolylineSelector extends Selector {
    private parentNode: SVGSVGElement;

    private crossA: CrossElement;
    private nextPoint: Snap.Element;
    private nextSegment: Snap.Element;

    private pointsGroup: Snap.Element;
    private polyline: Snap.Element;

    private points: Point2D[];
    private lastPoint: Point2D;

    private pointRadius: number = 3;

    private isCapturing: boolean = false;
    private capturePointerId: number;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(paper, boundRect, callbacks);
        this.parentNode = parent;

        this.buildUIElements();
        this.reset();
        this.hide();
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.crossA.resize(width, height);
    }

    public hide() {
        super.hide();
        this.crossA.hide();
        this.nextPoint.node.setAttribute("visibility", "hidden");
        this.nextSegment.node.setAttribute("visibility", "hidden");
        this.polyline.node.setAttribute("visibility", "hidden");
        this.pointsGroup.node.setAttribute("visibility", "hidden");
    }

    public show() {
        super.show();
        this.crossA.show();
        this.nextPoint.node.setAttribute("visibility", "visible");
        this.nextSegment.node.setAttribute("visibility", "visible");
        this.polyline.node.setAttribute("visibility", "visible");
        this.pointsGroup.node.setAttribute("visibility", "visible");
    }

    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("polylineSelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.nextPoint = this.paper.circle(0, 0, this.pointRadius);
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

        const listeners: IEventDescriptor[] = [
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

    private reset() {
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

    private moveCross(cross: CrossElement, pointTo: IMovable, square: boolean = false, refCross: IMovable = null) {
        cross.moveCross(pointTo, this.boundRect, square, refCross);
    }

    private movePoint(element: Snap.Element, pointTo: Point2D) {
        element.attr({
            cx: pointTo.x,
            cy: pointTo.y,
        });
    }

    private moveLine(element: Snap.Element, pointFrom: Point2D, pointTo: Point2D) {
        element.attr({
            x1: pointFrom.x,
            x2: pointTo.x,
            y1: pointFrom.y,
            y2: pointTo.y,
        });
    }

    private addPoint(x: number, y: number) {
        this.points.push(new Point2D(x, y));

        const point = this.paper.circle(x, y, this.pointRadius);
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

    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.show();
        });
    }

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

    private onPointerDown(e: PointerEvent) {
        if (!this.isCapturing) {
            this.isCapturing = true;

            if (typeof this.callbacks.onSelectionBegin === "function") {
                this.callbacks.onSelectionBegin();
            }
        }
    }

    private onClick(e: MouseEvent) {
        if (e.detail <= 1) {
            window.requestAnimationFrame(() => {
                const p = new Point2D(this.crossA.x, this.crossA.y);
                this.addPoint(p.x, p.y);

                this.lastPoint = p;
            });
        }
    }

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

    private onDoubleClick(e: MouseEvent) {
        this.submitPolyline();
    }

    private submitPolyline() {
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const box = this.polyline.getBBox();

            this.callbacks.onSelectionEnd(new RegionData(box.x, box.y, box.width, box.height,
                                          this.getPolylinePoints(), RegionDataType.Polyline));
        }
        this.reset();
    }

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

    private onKeyUp(e: KeyboardEvent) {
        // Holding shift key enable square drawing mode
        if (e.code === "Escape") {
            this.submitPolyline();
        }
    }

    public disable() {
        this.reset();
        super.disable();
    }
}
