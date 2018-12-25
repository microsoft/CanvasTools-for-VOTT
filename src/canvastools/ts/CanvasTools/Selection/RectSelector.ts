import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";
import { RegionData } from "../Core/RegionData";

import { IEventDescriptor } from "../Interface/IEventDescriptor";
import { IMovable } from "../Interface/IMovable";
import { ISelectorCallbacks } from "../Interface/ISelectorCallbacks";

import { CrossElement } from "./CrossElement";
import { MaskElement } from "./MaskElement";
import { RectElement } from "./RectElement";
import { Selector } from "./Selector";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export enum SelectionModificator { RECT, SQUARE }

export class RectSelector extends Selector {
    private parentNode: SVGSVGElement;
    private crossA: CrossElement;
    private crossB: CrossElement;
    private selectionBox: RectElement;
    private mask: MaskElement;

    private capturingState: boolean = false;
    private isTwoPoints: boolean = false;

    private selectionModificator: SelectionModificator = SelectionModificator.RECT;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(paper, boundRect, callbacks);
        this.parentNode = parent;
        this.buildUIElements();
        this.hide();
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.resizeAll([this.mask, this.crossA, this.crossB]);
    }

    public hide() {
        super.hide();
        this.hideAll([this.crossA, this.crossB, this.mask]);
    }

    public show() {
        super.show();
        this.crossA.show();
    }

    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectSelector");
        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.crossB = new CrossElement(this.paper, this.boundRect);
        this.selectionBox = new RectElement(this.paper, this.boundRect, new Rect(0, 0));
        this.selectionBox.node.addClass("selectionBoxStyle");

        this.mask = new MaskElement(this.paper, this.boundRect, this.selectionBox);

        this.node.add(this.mask.node);
        this.node.add(this.crossA.node);
        this.node.add(this.crossB.node);

        const listeners: IEventDescriptor[] = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "keydown", listener: this.onKeyDown, base: window, bypass: false },
            { event: "keyup", listener: this.onKeyUp, base: window, bypass: true },
        ];

        this.subscribeToEvents(listeners);
    }

    private moveCross(cross: CrossElement, p: IMovable, square: boolean = false, refCross: CrossElement = null) {
        cross.moveCross(p, this.boundRect, square, refCross);
    }

    private moveSelectionBox(box: RectElement, crossA: CrossElement, crossB: CrossElement) {
        const x = (crossA.x < crossB.x) ? crossA.x : crossB.x;
        const y = (crossA.y < crossB.y) ? crossA.y : crossB.y;
        const w = Math.abs(crossA.x - crossB.x);
        const h = Math.abs(crossA.y - crossB.y);

        box.move(new Point2D(x, y));
        box.resize(w, h);
    }

    // Events
    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.crossA.show();
        });
    }

    private onPointerLeave(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            if (!this.capturingState) {
                this.hideAll([this.crossA, this.crossB, this.selectionBox]);
            } else if (this.isTwoPoints && this.capturingState) {
                this.moveCross(this.crossB, p);
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
            }
        });

    }

    private onPointerDown(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            if (!this.isTwoPoints) {
                this.capturingState = true;

                this.parentNode.setPointerCapture(e.pointerId);
                this.moveCross(this.crossB, this.crossA);
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);

                this.showAll([this.mask, this.crossB, this.selectionBox]);

                if (typeof this.callbacks.onSelectionBegin === "function") {
                    this.callbacks.onSelectionBegin();
                }
            }
        });
    }

    private onPointerUp(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            if (!this.isTwoPoints) {
                this.capturingState = false;
                this.parentNode.releasePointerCapture(e.pointerId);
                this.hideAll([this.crossB, this.mask]);

                if (typeof this.callbacks.onSelectionEnd === "function") {
                    const x = Math.min(this.crossA.x, this.crossB.x);
                    const y = Math.min(this.crossA.y, this.crossB.y);
                    const w = Math.abs(this.crossA.x - this.crossB.x);
                    const h = Math.abs(this.crossA.y - this.crossB.y);

                    this.callbacks.onSelectionEnd(RegionData.BuildRectRegionData(x, y, w, h));
                }
            } else {
                if (this.capturingState) {
                    this.capturingState = false;
                    this.hideAll([this.crossB, this.mask]);

                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        const x = Math.min(this.crossA.x, this.crossB.x);
                        const y = Math.min(this.crossA.y, this.crossB.y);
                        const w = Math.abs(this.crossA.x - this.crossB.x);
                        const h = Math.abs(this.crossA.y - this.crossB.y);

                        this.callbacks.onSelectionEnd(RegionData.BuildRectRegionData(x, y, w, h));
                    }
                    this.moveCross(this.crossA, p);
                    this.moveCross(this.crossB, p);
                } else {
                    this.capturingState = true;
                    this.moveCross(this.crossB, p);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                    this.showAll([this.crossA, this.crossB, this.selectionBox, this.mask]);

                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                }
            }
        });
    }

    private onPointerMove(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            this.crossA.show();

            if (!this.isTwoPoints) {
                if (this.capturingState) {
                    this.moveCross(this.crossB, p,
                                   this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                } else {
                    this.moveCross(this.crossA, p);
                }
            } else {
                if (this.capturingState) {
                    this.moveCross(this.crossB, p,
                                   this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                } else {
                    this.moveCross(this.crossA, p);
                    this.moveCross(this.crossB, p);
                }
            }
        });

        e.preventDefault();
    }

    private onKeyDown(e: KeyboardEvent) {
        // Holding shift key enable square drawing mode
        if (e.shiftKey) {
            this.selectionModificator = SelectionModificator.SQUARE;
        }

        if (e.ctrlKey && !this.capturingState) {
            this.isTwoPoints = true;
        }
    }

    private onKeyUp(e: KeyboardEvent) {
        // Holding shift key enable square drawing mode
        if (!e.shiftKey) {
            this.selectionModificator = SelectionModificator.RECT;
        }

        // Holding Ctrl key to enable two point selection mode
        if (!e.ctrlKey && this.isTwoPoints) {
            this.isTwoPoints = false;
            this.capturingState = false;
            this.moveCross(this.crossA, this.crossB);
            this.hideAll([this.crossB, this.selectionBox, this.mask]);
        }
    }
}
