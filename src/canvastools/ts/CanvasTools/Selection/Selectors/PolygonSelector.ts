import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData, RegionDataType } from "../../Core/RegionData";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IMovable } from "../../Interface/IMovable";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

import { CrossElement } from "../Component/CrossElement";
import { Selector } from "./Selector";
import { IPoint2D } from "../../Interface/IPoint2D";

/**
 * The selector to define a polygon region.
 */
export class PolygonSelector extends Selector {
    private crossA: CrossElement;
    private nextPoint: Snap.Element;
    private nextL1: Snap.Element;
    private nextLN: Snap.Element;
    private nextSegment: Snap.Element;

    private pointsGroup: Snap.Element;
    private polygon: Snap.Element;

    private points: Point2D[];
    private lastPoint: Point2D;

    private pointRadius: number = 3;

    private isCapturing: boolean = false;
    private capturePointerId: number;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(parent, paper, boundRect, callbacks);

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
        this.hideAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }

    public show() {
        super.show();
        this.showAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }

    public disable() {
        this.reset();
        super.disable();
    }

    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("polygonSelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.nextPoint = this.paper.circle(0, 0, this.pointRadius);
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

        const listeners: IEventDescriptor[] = [
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
                    if (e.detail <= 1) {
                        window.requestAnimationFrame(() => {
                            const p = new Point2D(this.crossA.x, this.crossA.y);
                            this.addPoint(p.x, p.y);
                            this.lastPoint = p;
                        });
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
                        this.show();
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
                listener: () => this.submitPolyline(),
                bypass: false,
            },
            {
                event: "keyup",
                base: window,
                listener: (e: KeyboardEvent) => {
                    if (e.code === "Escape") {
                        this.submitPolyline();
                    }
                },
                bypass: true,
            },
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

        this.polygon.attr({
            points: "",
        });

        if (this.isCapturing) {
            this.isCapturing = false;
        }
    }

    private addPoint(x: number, y: number) {
        this.points.push(new Point2D(x, y));

        const point = this.paper.circle(x, y, this.pointRadius);
        point.addClass("polygonPointStyle");

        this.pointsGroup.add(point);

        let pointsStr = "";
        this.points.forEach((p) => {
            pointsStr += `${p.x},${p.y},`;
        });

        this.polygon.attr({
            points: pointsStr.substr(0, pointsStr.length - 1),
        });
    }

    private submitPolyline() {
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const box = this.polygon.getBBox();

            this.callbacks.onSelectionEnd(new RegionData(box.x, box.y, box.width, box.height,
                                          this.points.map((p) => p.copy()), RegionDataType.Polygon));
        }
        this.reset();
    }
}
