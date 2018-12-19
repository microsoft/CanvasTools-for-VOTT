import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";
import { RegionData, RegionDataType } from "../Core/RegionData";

import { IEventDescriptor } from "../Interface/IEventDescriptor";
import { IHideable } from "../Interface/IHideadble";
import { IMovable } from "../Interface/IMovable";
import { IResizable } from "../Interface/IResizable";
import { ISelectorCallbacks } from "../Interface/ISelectorCallbacks";

import { CrossElement } from "./CrossElement";
import { ElementPart } from "./ElementPart";
import { MaskElement } from "./MaskElement";
import { RectElement } from "./RectElement";
import { Selector } from "./Selector";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export class PointSelector extends Selector {
    private parentNode: SVGSVGElement;

    private crossA: CrossElement;
    private point: Snap.Element;

    private pointRadius: number = 6;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(paper, boundRect, callbacks);
        this.parentNode = parent;
        this.buildUIElements();
        this.hide();
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.crossA.resize(width, height);
    }

    public hide() {
        super.hide();
        this.crossA.hide();
        this.point.node.setAttribute("visibility", "hidden");
    }

    public show() {
        super.show();
        this.crossA.show();
        this.point.node.setAttribute("visibility", "visible");
    }

    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("pointSelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.point = this.paper.circle(0, 0, this.pointRadius);
        this.point.addClass("pointStyle");

        this.node.add(this.crossA.node);
        this.node.add(this.point);

        const listeners: IEventDescriptor[] = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
        ];

        this.subscribeToEvents(listeners);
    }

    private moveCross(cross: CrossElement, p: IMovable, square: boolean = false, refCross: IMovable = null) {
        cross.moveCross(p, this.boundRect, square, refCross);
    }

    private movePoint(point: Snap.Element, crossA: CrossElement) {
        point.attr({
            cx: crossA.x,
            cy: crossA.y,
        });
    }

    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.show();
        });
    }

    private onPointerLeave(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.hide();
        });
    }

    private onPointerDown(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.show();
            this.movePoint(this.point, this.crossA);
            if (typeof this.callbacks.onSelectionBegin === "function") {
                this.callbacks.onSelectionBegin();
            }
        });
    }

    private onPointerUp(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            if (typeof this.callbacks.onSelectionEnd === "function") {
                this.callbacks.onSelectionEnd(RegionData.BuildPointRegionData(this.crossA.x, this.crossA.y));
            }
        });
    }

    private onPointerMove(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            this.show();
            this.moveCross(this.crossA, p);
            this.movePoint(this.point, this.crossA);
        });

        e.preventDefault();
    }
}
