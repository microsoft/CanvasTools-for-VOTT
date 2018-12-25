import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";
import { RegionData } from "../Core/RegionData";

import { IEventDescriptor } from "../Interface/IEventDescriptor";
import { IMovable } from "../Interface/IMovable";
import { ISelectorCallbacks } from "../Interface/ISelectorCallbacks";

import { CrossElement } from "./CrossElement";
import { RectElement } from "./RectElement";
import { Selector } from "./Selector";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export class RectCopySelector extends Selector {
    private parentNode: SVGSVGElement;

    private copyRect: Rect;

    private crossA: CrossElement;
    private copyRectEl: RectElement;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, copyRect: Rect,
                callbacks?: ISelectorCallbacks) {
        super(paper, boundRect, callbacks);
        this.parentNode = parent;
        this.copyRect = copyRect;
        this.buildUIElements();
        this.hide();
    }

    public setTemplate(copyRect: Rect) {
        this.copyRect = copyRect;

        this.copyRectEl.resize(copyRect.width, copyRect.height);
        this.moveCopyRect(this.copyRectEl, this.crossA);
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.crossA.resize(width, height);
    }

    public hide() {
        super.hide();
        this.hideAll([this.crossA, this.copyRectEl]);
    }

    public show() {
        super.show();
        this.showAll([this.crossA, this.copyRectEl]);
    }

    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectCopySelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.copyRectEl = new RectElement(this.paper, this.boundRect, this.copyRect);
        this.copyRectEl.node.addClass("copyRectStyle");

        this.node.add(this.crossA.node);
        this.node.add(this.copyRectEl.node);

        const listeners: IEventDescriptor[] = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "wheel", listener: this.onWheel, base: this.parentNode, bypass: false },
        ];

        this.subscribeToEvents(listeners);
    }

    private moveCross(cross: CrossElement, p: IMovable, square: boolean = false, refCross: IMovable = null) {
        cross.moveCross(p, this.boundRect, square, refCross);
    }

    private moveCopyRect(copyRect: RectElement, crossA: CrossElement) {
        const x = crossA.x - copyRect.rect.width / 2;
        const y = crossA.y - copyRect.rect.height / 2;
        copyRect.move(new Point2D(x, y));
    }

    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.crossA.show();
            this.copyRectEl.show();
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
            this.moveCopyRect(this.copyRectEl, this.crossA);
            if (typeof this.callbacks.onSelectionBegin === "function") {
                this.callbacks.onSelectionBegin();
            }
        });
    }

    private onPointerUp(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            if (typeof this.callbacks.onSelectionEnd === "function") {
                let p1 = new Point2D(this.crossA.x - this.copyRect.width / 2, this.crossA.y - this.copyRect.height / 2);
                let p2 = new Point2D(this.crossA.x + this.copyRect.width / 2, this.crossA.y + this.copyRect.height / 2);
                p1 = p1.boundToRect(this.boundRect);
                p2 = p2.boundToRect(this.boundRect);

                this.callbacks.onSelectionEnd(
                    RegionData.BuildRectRegionData(p1.x, p1.y, this.copyRect.width, this.copyRect.height));
            }
        });
    }

    private onPointerMove(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            this.crossA.show();

            this.copyRectEl.show();
            this.moveCross(this.crossA, p);
            this.moveCopyRect(this.copyRectEl, this.crossA);
        });

        e.preventDefault();
    }

    private onWheel(e: WheelEvent) {
        let width = this.copyRect.width;
        let height = this.copyRect.height;

        const k = height / width;

        if (e.shiftKey) {
            if (e.deltaY > 0) {
                width *= 1.1;
                height *= 1.1;
            } else {
                width /= 1.1;
                height /= 1.1;
            }
        } else {
            if (e.deltaY > 0) {
                width += 1.0;
                height += k;
            } else {
                width -= 1.0;
                height -= k;
            }
        }

        if (width < 1.0) {
            width = 1.0;
            height = k;
        }
        if (height < 1.0) {
            height = 1.0;
            width = 1.0 / k;
        }

        window.requestAnimationFrame(() => {
            this.copyRect.resize(width, height);
            this.copyRectEl.resize(width, height);
            this.moveCopyRect(this.copyRectEl, this.crossA);
        });
    }
}
