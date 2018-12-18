import { IHideable } from "./Interface/IHideadble";
import { IResizable } from "./Interface/IResizable";
import { IRect } from "./Interface/IRect";
import { IPoint2D } from "./Interface/IPoint2D";
import { Point2D } from "./Core/CanvasTools.Point2D";
import { Rect } from "./Core/CanvasTools.Rect";
import { EventDescriptor } from "./Core/CanvasTools.EventDescriptor";

import * as Snap from "snapsvg-cjs";

abstract class ElementPrototype implements IHideable, IResizable {
    protected paper: Snap.Paper;
    protected boundRect: IRect;
    public node: Snap.Element;

    protected isVisible: boolean = true;

    constructor(paper: Snap.Paper, boundRect: IRect) {
        this.paper = paper;
        this.boundRect = boundRect;
    }

    public hide() {
        this.node.node.setAttribute("visibility", "hidden");
        this.isVisible = false;
    }

    public show() {
        this.node.node.setAttribute("visibility", "visible");
        this.isVisible = true;
    }

    public resize(width: number, height: number) {
        this.boundRect.resize(width, height);
    }
}


class CrossElement extends ElementPrototype implements IPoint2D {
    private hl: Snap.Element;
    private vl: Snap.Element;
    public x: number;
    public y: number;

    constructor(paper: Snap.Paper, boundRect: IRect) {
        super(paper, boundRect);
        this.buildUIElements();
        this.hide();
    }

    private buildUIElements() {
        let verticalLine: Snap.Element = this.paper.line(0, 0, 0, this.boundRect.height);
        let horizontalLine: Snap.Element = this.paper.line(0, 0, this.boundRect.width, 0);

        this.node = this.paper.g();
        this.node.addClass("crossStyle");
        this.node.add(verticalLine);
        this.node.add(horizontalLine);

        this.hl = horizontalLine;
        this.vl = verticalLine;
        this.x = 0;
        this.y = 0;
    }

    public boundToRect(rect: IRect): Point2D {
        return new Point2D(this.x, this.y).boundToRect(rect);
    }

    public move(p: IPoint2D, rect: IRect, square: boolean = false, ref: IPoint2D = null) {
        let np: Point2D = p.boundToRect(rect);

        if (square) {
            let dx = Math.abs(np.x - ref.x);
            let vx = Math.sign(np.x - ref.x);
            let dy = Math.abs(np.y - ref.y);
            let vy = Math.sign(np.y - ref.y);

            let d = Math.min(dx, dy);
            np.x = ref.x + d * vx;
            np.y = ref.y + d * vy;
        }

        this.x = np.x;
        this.y = np.y;

        this.vl.node.setAttribute("x1", np.x.toString());
        this.vl.node.setAttribute("x2", np.x.toString());
        this.vl.node.setAttribute("y2", rect.height.toString());

        this.hl.node.setAttribute("y1", np.y.toString());
        this.hl.node.setAttribute("x2", rect.width.toString());
        this.hl.node.setAttribute("y2", np.y.toString());
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.vl.node.setAttribute("y2", height.toString());
        this.hl.node.setAttribute("x2", width.toString());
    }
}

class RectElement extends ElementPrototype {
    public rect: Rect;

    constructor(paper: Snap.Paper, boundRect: Rect, rect: Rect) {
        super(paper, boundRect);
        this.rect = rect;
        this.buildUIElements();
        this.hide();
    }

    private buildUIElements() {
        this.node = this.paper.rect(0, 0, this.rect.width, this.rect.height);

    }

    public move(p: IPoint2D) {
        this.node.node.setAttribute("x", p.x.toString());
        this.node.node.setAttribute("y", p.y.toString());
    }

    public resize(width: number, height: number) {
        this.rect.resize(width, height);
        this.node.node.setAttribute("height", height.toString());
        this.node.node.setAttribute("width", width.toString());
    }
}

class MaskElement extends ElementPrototype {
    private mask: RectElement;
    private maskIn: RectElement;
    private maskOut: { node: Snap.Element };

    constructor(paper: Snap.Paper, boundRect: Rect, maskOut: { node: Snap.Element }) {
        super(paper, boundRect);
        this.maskOut = maskOut;
        this.buildUIElements();
        this.resize(boundRect.width, boundRect.height);
        this.hide();
    }

    private buildUIElements() {
        this.mask = this.createMask();

        this.maskIn = this.createMaskIn();
        this.maskOut.node.addClass("maskOutStyle");

        let combinedMask = this.paper.g();
        combinedMask.add(this.maskIn.node);
        combinedMask.add(this.maskOut.node);

        this.mask.node.attr({
            mask: combinedMask
        });

        this.node = this.mask.node;
    }

    private createMask(): RectElement {
        let r: RectElement = new RectElement(this.paper, this.boundRect, this.boundRect);
        r.node.addClass("maskStyle");
        return r;
    }

    private createMaskIn(): RectElement {
        let r: RectElement = new RectElement(this.paper, this.boundRect, this.boundRect);
        r.node.addClass("maskInStyle");
        return r;
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.mask.resize(width, height);
        this.maskIn.resize(width, height);
    }
}

/* SELECTORS */
export enum SelectionMode { NONE, POINT, RECT, COPYRECT, POLYLINE };
export enum SelectionModificator { RECT, SQUARE };

type SelectionCommit = {
    boundRect: {
        x1: number,
        y1: number,
        x2: number,
        y2: number
    },
    meta?: Object
}

type SelectorCallbacks = {
    onSelectionBegin: () => void,
    onSelectionEnd: (commit: SelectionCommit) => void,
    onLocked?: () => void,
    onUnlocked?: () => void
}

abstract class SelectorPrototype extends ElementPrototype {
    protected isEnabled: boolean = true;

    public callbacks: SelectorCallbacks;

    constructor(paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks) {
        super(paper, boundRect);

        if (callbacks !== undefined) {
            this.callbacks = callbacks;
        } else {
            this.callbacks = {
                onSelectionBegin: null,
                onSelectionEnd: null,
                onLocked: null,
                onUnlocked: null
            };
        }
    }

    public enable() {
        if (!this.isEnabled) {
            this.isEnabled = true;
            this.show();
        }
    }

    public disable() {
        if (this.isEnabled) {
            this.isEnabled = false;
            this.hide();
        }
    }

    // helper functions
    protected subscribeToEvents(listeners: Array<EventDescriptor>) {
        listeners.forEach(e => {
            e.base.addEventListener(e.event, this.enablify(e.listener.bind(this), e.bypass));
        });
    }


    protected enablify(f: Function, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (this.isEnabled || bypass) {
                f(args);
            }
        }
    }

    protected showAll(elements: Array<IHideable>) {
        window.requestAnimationFrame(() => {
            elements.forEach(element => {
                element.show();
            });
        })
    }

    protected hideAll(elements: Array<IHideable>) {
        window.requestAnimationFrame(() => {
            elements.forEach(element => {
                element.hide();
            });
        })
    }

    protected resizeAll(elementSet: Array<IResizable>) {
        window.requestAnimationFrame(() => {
            elementSet.forEach(element => {
                element.resize(this.boundRect.width, this.boundRect.height);
            });
        })
    }
}

export class RectSelector extends SelectorPrototype {
    private parentNode: SVGSVGElement;
    private crossA: CrossElement;
    private crossB: CrossElement;
    private selectionBox: RectElement;
    private mask: MaskElement;

    private capturingState: boolean = false;
    private isTwoPoints: boolean = false;

    private selectionModificator: SelectionModificator = SelectionModificator.RECT;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks) {
        super(paper, boundRect, callbacks);
        this.parentNode = parent;
        this.buildUIElements();
        this.hide();
    }

    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectSelector");
        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.crossB = new CrossElement(this.paper, this.boundRect)
        this.selectionBox = new RectElement(this.paper, this.boundRect, new Rect(0, 0));
        this.selectionBox.node.addClass("selectionBoxStyle");

        this.mask = new MaskElement(this.paper, this.boundRect, this.selectionBox);

        this.node.add(this.mask.node);
        this.node.add(this.crossA.node);
        this.node.add(this.crossB.node);


        let listeners: Array<EventDescriptor> = [
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

    private moveCross(cross: CrossElement, p: IPoint2D, square: boolean = false, refCross: CrossElement = null) {
        cross.move(p, this.boundRect, square, refCross);
    }

    private moveSelectionBox(box: RectElement, crossA: CrossElement, crossB: CrossElement) {
        var x = (crossA.x < crossB.x) ? crossA.x : crossB.x;
        var y = (crossA.y < crossB.y) ? crossA.y : crossB.y;
        var w = Math.abs(crossA.x - crossB.x);
        var h = Math.abs(crossA.y - crossB.y);

        box.move(new Point2D(x, y));
        box.resize(w, h);
    }

    // Events
    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.crossA.show();
        })
    }

    private onPointerLeave(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            let rect = this.parentNode.getClientRects();
            let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

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
            let rect = this.parentNode.getClientRects();
            let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            if (!this.isTwoPoints) {
                this.capturingState = false;
                this.parentNode.releasePointerCapture(e.pointerId);
                this.hideAll([this.crossB, this.mask]);

                if (typeof this.callbacks.onSelectionEnd === "function") {
                    this.callbacks.onSelectionEnd({
                        boundRect: {
                            x1: this.crossA.x,
                            y1: this.crossA.y,
                            x2: this.crossB.x,
                            y2: this.crossB.y
                        }
                    });
                }
            }
            else {
                if (this.capturingState) {
                    this.capturingState = false;
                    this.hideAll([this.crossB, this.mask]);

                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        this.callbacks.onSelectionEnd({
                            boundRect: {
                                x1: this.crossA.x,
                                y1: this.crossA.y,
                                x2: this.crossB.x,
                                y2: this.crossB.y
                            }
                        });
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
            let rect = this.parentNode.getClientRects();
            let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            this.crossA.show();

            if (!this.isTwoPoints) {
                if (this.capturingState) {
                    this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                } else {
                    this.moveCross(this.crossA, p);
                }
            } else {
                if (this.capturingState) {
                    this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
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
        //Holding shift key enable square drawing mode
        if (e.shiftKey) {
            this.selectionModificator = SelectionModificator.SQUARE;
        }

        if (e.ctrlKey && !this.capturingState) {
            this.isTwoPoints = true;
        }
    }

    private onKeyUp(e: KeyboardEvent) {
        //Holding shift key enable square drawing mode
        if (!e.shiftKey) {
            this.selectionModificator = SelectionModificator.RECT;
        }

        //Holding Ctrl key to enable two point selection mode
        if (!e.ctrlKey && this.isTwoPoints) {
            this.isTwoPoints = false;
            this.capturingState = false;
            this.moveCross(this.crossA, this.crossB);
            this.hideAll([this.crossB, this.selectionBox, this.mask]);
        }
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

}

export class RectCopySelector extends SelectorPrototype {
    private parentNode: SVGSVGElement;

    private copyRect: Rect;

    private crossA: CrossElement;
    private copyRectEl: RectElement;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, copyRect: Rect, callbacks?: SelectorCallbacks) {
        super(paper, boundRect, callbacks);
        this.parentNode = parent;
        this.copyRect = copyRect;
        this.buildUIElements();
        this.hide();
    }

    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectCopySelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.copyRectEl = new RectElement(this.paper, this.boundRect, this.copyRect);
        this.copyRectEl.node.addClass("copyRectStyle");

        this.node.add(this.crossA.node);
        this.node.add(this.copyRectEl.node);

        let listeners: Array<EventDescriptor> = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "wheel", listener: this.onWheel, base: this.parentNode, bypass: false },
        ];

        this.subscribeToEvents(listeners);
    }

    private moveCross(cross: CrossElement, p: IPoint2D, square: boolean = false, refCross: CrossElement = null) {
        cross.move(p, this.boundRect, square, refCross);
    }

    private moveCopyRect(copyRect: RectElement, crossA: CrossElement) {
        var x = crossA.x - copyRect.rect.width / 2;
        var y = crossA.y - copyRect.rect.height / 2;
        copyRect.move(new Point2D(x, y));
    }

    public setTemplate(copyRect: Rect) {
        this.copyRect = copyRect;

        this.copyRectEl.resize(copyRect.width, copyRect.height);
        this.moveCopyRect(this.copyRectEl, this.crossA);
    }

    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.crossA.show();
            this.copyRectEl.show();
        })
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
                this.callbacks.onSelectionEnd({
                    boundRect: {
                        x1: p1.x,
                        y1: p1.y,
                        x2: p2.x,
                        y2: p2.y
                    }
                });
            }
        });
    }

    private onPointerMove(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            let rect = this.parentNode.getClientRects();
            let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

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

        let k = height / width;

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
}

export class PointSelector extends SelectorPrototype {
    private parentNode: SVGSVGElement;

    private crossA: CrossElement;
    private point: Snap.Element;

    private pointRadius: number = 6;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks) {
        super(paper, boundRect, callbacks);
        this.parentNode = parent;
        this.buildUIElements();
        this.hide();
    }

    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("pointSelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.point = this.paper.circle(0, 0, this.pointRadius);
        this.point.addClass("pointStyle");

        this.node.add(this.crossA.node);
        this.node.add(this.point);

        let listeners: Array<EventDescriptor> = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false }
        ];

        this.subscribeToEvents(listeners);
    }

    private moveCross(cross: CrossElement, p: IPoint2D, square: boolean = false, refCross: CrossElement = null) {
        cross.move(p, this.boundRect, square, refCross);
    }

    private movePoint(point: Snap.Element, crossA: CrossElement) {
        point.attr({
            cx: crossA.x,
            cy: crossA.y
        })
    }

    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.show();
        })
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
                let p1 = new Point2D(this.crossA.x - this.pointRadius, this.crossA.y - this.pointRadius);
                let p2 = new Point2D(this.crossA.x + this.pointRadius, this.crossA.y + this.pointRadius);
                p1 = p1.boundToRect(this.boundRect);
                p2 = p2.boundToRect(this.boundRect);
                this.callbacks.onSelectionEnd({
                    boundRect: {
                        x1: p1.x,
                        y1: p1.y,
                        x2: p2.x,
                        y2: p2.y
                    },
                    meta: {
                        point: {
                            x: this.crossA.x,
                            y: this.crossA.y
                        }
                    }
                });
            }
        });
    }

    private onPointerMove(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            let rect = this.parentNode.getClientRects();
            let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            this.show();
            this.moveCross(this.crossA, p);
            this.movePoint(this.point, this.crossA);
        });

        e.preventDefault();
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
}

export class PolylineSelector extends SelectorPrototype {
    private parentNode: SVGSVGElement;

    private crossA: CrossElement;
    private nextPoint: Snap.Element;
    private nextSegment: Snap.Element;

    private pointsGroup: Snap.Element;
    private polyline: Snap.Element;

    private points: Array<Point2D>;
    private lastPoint: Point2D;

    private pointRadius: number = 3;

    private isCapturing: boolean = false;
    private capturePointerId: number;

    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks) {
        super(paper, boundRect, callbacks);
        this.parentNode = parent;

        this.buildUIElements();
        this.reset();
        this.hide();
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

        let listeners: Array<EventDescriptor> = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "click", listener: this.onClick, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "dblclick", listener: this.onDoubleClick, base: this.parentNode, bypass: false },
            { event: "keyup", listener: this.onKeyUp, base: window, bypass: true }
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
            points: ""
        })

        if (this.isCapturing) {
            this.isCapturing = false;
        }
    }

    private moveCross(cross: CrossElement, pointTo: IPoint2D, square: boolean = false, refCross: CrossElement = null) {
        cross.move(pointTo, this.boundRect, square, refCross);
    }

    private movePoint(element: Snap.Element, pointTo: IPoint2D) {
        element.attr({
            cx: pointTo.x,
            cy: pointTo.y
        })
    }

    private moveLine(element: Snap.Element, pointFrom: IPoint2D, pointTo: IPoint2D) {
        element.attr({
            x1: pointFrom.x,
            y1: pointFrom.y,
            x2: pointTo.x,
            y2: pointTo.y
        })
    }

    private addPoint(x: number, y: number) {
        this.points.push(new Point2D(x, y));

        let point = this.paper.circle(x, y, this.pointRadius);
        point.addClass("polylinePointStyle");

        this.pointsGroup.add(point);

        let pointsStr = "";
        this.points.forEach((p) => {
            pointsStr += `${p.x},${p.y},`;
        })

        this.polyline.attr({
            points: pointsStr.substr(0, pointsStr.length - 1)
        })
    }

    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.show();
        })
    }

    private onPointerLeave(e: PointerEvent) {
        if (!this.isCapturing) {
            window.requestAnimationFrame(() => {
                this.hide();
            });
        } else {
            let rect = this.parentNode.getClientRects();
            let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

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
                let p = new Point2D(this.crossA.x, this.crossA.y);
                this.addPoint(p.x, p.y);

                this.lastPoint = p;
            });
        }
    }

    private onPointerMove(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            let rect = this.parentNode.getClientRects();
            let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

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
            let box = this.polyline.getBBox();

            this.callbacks.onSelectionEnd({
                boundRect: {
                    x1: box.x,
                    y1: box.y,
                    x2: box.x2,
                    y2: box.y2
                },
                meta: {
                    polyline: this.points
                }
            });
        }
        this.reset();
    }

    private onKeyUp(e: KeyboardEvent) {
        //Holding shift key enable square drawing mode
        if (e.code === "Escape") {
            this.submitPolyline();
        }
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
}

export class AreaSelector {
    private parentNode: SVGSVGElement;
    private paper: Snap.Paper;
    private boundRect: Rect;

    private areaSelectorLayer: Snap.Element;

    private selector: SelectorPrototype;

    private rectSelector: RectSelector;
    private rectCopySelector: RectCopySelector;
    private pointSelector: PointSelector;
    private polylineSelector: PolylineSelector;

    public callbacks: SelectorCallbacks;

    private isEnabled: boolean = true;
    private isVisible: boolean = true;
    public static DefaultTemplateSize: Rect = new Rect(20, 20);

    constructor(svgHost: SVGSVGElement, callbacks?: SelectorCallbacks) {
        this.parentNode = svgHost;
        if (callbacks !== undefined) {
            this.callbacks = callbacks;
        } else {
            this.callbacks = {
                onSelectionBegin: null,
                onSelectionEnd: null,
                onLocked: null,
                onUnlocked: null
            };
        }

        this.buildUIElements();
    }

    private buildUIElements() {
        this.paper = Snap(this.parentNode);
        this.boundRect = new Rect(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);

        this.areaSelectorLayer = this.paper.g();
        this.areaSelectorLayer.addClass("areaSelector");

        this.rectSelector = new RectSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.rectCopySelector = new RectCopySelector(this.parentNode, this.paper, this.boundRect, new Rect(0, 0), this.callbacks);
        this.pointSelector = new PointSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.polylineSelector = new PolylineSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);

        this.selector = this.rectSelector;
        this.rectSelector.enable();
        this.rectCopySelector.disable();
        this.pointSelector.disable();
        this.polylineSelector.disable();
        this.selector.hide();

        this.areaSelectorLayer.add(this.rectSelector.node);
        this.areaSelectorLayer.add(this.rectCopySelector.node);
        this.areaSelectorLayer.add(this.pointSelector.node);
        this.areaSelectorLayer.add(this.polylineSelector.node);
    }

    public resize(width: number, height: number): void {
        if (width !== undefined && height !== undefined) {
            this.boundRect.resize(width, height);
            //this.parentNode.style.width = width.toString();
            //this.parentNode.style.height = height.toString();
        } else {
            this.boundRect.resize(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
        }

        if (this.selector !== null) {
            this.selector.resize(width, height);
        }
    }

    public enable() {
        if (this.selector !== null) {
            this.selector.enable();
            this.isEnabled = true;
            this.selector.resize(this.boundRect.width, this.boundRect.height);
        }
    }

    public disable() {
        if (this.selector !== null) {
            this.selector.disable();
            this.isEnabled = false;
        }
    }

    public show() {
        this.enable();
        this.isVisible = true;
    }

    public hide() {
        this.disable();
        this.isVisible = false;
    }

    public setSelectionMode(selectionMode: SelectionMode, options?: { template?: Rect }) {
        this.disable();

        if (selectionMode === SelectionMode.NONE) {
            this.selector = null;
            return;
        }
        else if (selectionMode === SelectionMode.COPYRECT) {
            this.selector = this.rectCopySelector;
            if (options !== undefined && options.template !== undefined) {
                this.rectCopySelector.setTemplate(options.template);
            } else {
                this.rectCopySelector.setTemplate(AreaSelector.DefaultTemplateSize);
            }
        } else if (selectionMode === SelectionMode.RECT) {
            this.selector = this.rectSelector;
        } else if (selectionMode === SelectionMode.POINT) {
            this.selector = this.pointSelector;
        } else if (selectionMode === SelectionMode.POLYLINE) {
            this.selector = this.polylineSelector;
        }

        // restore enablement status
        this.enable();
        if (this.isVisible) {
            this.show();
        } else {
            this.hide();
        }
    }

    protected enablify(f: Function, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (this.isEnabled || bypass) {
                f(args);
            }
        }
    }
}