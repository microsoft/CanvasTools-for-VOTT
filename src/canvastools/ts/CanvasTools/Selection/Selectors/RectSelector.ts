import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

import { CrossElement } from "../Component/CrossElement";
import { RectElement } from "../Component/RectElement";
import { Selector } from "./Selector";
import { IPoint2D } from "../../Interface/IPoint2D";

/**
 * Enum to specify selection mode.
 */
export enum SelectionModificator { RECT, SQUARE }

/**
 * The selector to define a rect-region.
 */
export class RectSelector extends Selector {
    /**
     * The `CrossElement` to set the first corner of the rect.
     */
    private crossA: CrossElement;

    /**
     * The `CrossElement` to set the opposite corner of the rect.
     */
    private crossB: CrossElement;

    /**
     * The `RectElement` to draw selection box.
     */
    private selectionBox: RectElement;

    /**
     * Internal flag for selection state.
     */
    private capturingState: boolean = false;

    /**
     * Pointer Id for capturing
     */
    private pointerCaptureId: number = -1;

    /**
     * Internal flag for selection mode.
     */
    private isTwoPoints: boolean = false;

    /**
     * Internal flag for selection type.
     */
    private selectionModificator: SelectionModificator = SelectionModificator.RECT;

    /**
     * Creates new `RectSelector` object.
     * @param parent - The parent SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(parent, paper, boundRect, callbacks);
        this.buildUIElements();
        this.hide();
    }

    /**
     * Resizes the selector to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    public resize(width: number, height: number) {
        super.resize(width, height);
        this.resizeAll([this.selectionBox, this.crossA, this.crossB]);
    }

    /**
     * Hides the selector.
     */
    public hide() {
        super.hide();
        this.hideAll([this.crossA, this.crossB, this.selectionBox]);
        if (this.pointerCaptureId >= 0) {
            this.parentNode.releasePointerCapture(this.pointerCaptureId);
            this.pointerCaptureId = -1;
        }
    }

    /**
     * Shows the selector.
     */
    public show() {
        super.show();
        this.crossA.show();
    }

    /**
     * Builds selector's UI.
     */
    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectSelector");
        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.crossB = new CrossElement(this.paper, this.boundRect);
        this.selectionBox = new RectElement(this.paper, this.boundRect, new Rect(0, 0));
        this.selectionBox.node.addClass("selectionBoxStyle");

        this.node.add(this.crossA.node);
        this.node.add(this.crossB.node);
        this.node.add(this.selectionBox.node);

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

    /**
     * Helper function to move the rect element to specified locations.
     * @param box - The box to move.
     * @param pa - The first corner point.
     * @param pb - The opposite corner point.
     */
    private moveSelectionBox(box: RectElement, pa: IPoint2D, pb: IPoint2D) {
        const x = (pa.x < pb.x) ? pa.x : pb.x;
        const y = (pa.y < pb.y) ? pa.y : pb.y;
        const w = Math.abs(pa.x - pb.x);
        const h = Math.abs(pa.y - pb.y);

        box.move(new Point2D(x, y));
        box.resize(w, h);
    }

    /**
     * Listener for the pointer enter event.
     * @param e PointerEvent
     */
    private onPointerEnter(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            this.crossA.show();
        });
    }

    /**
     * Listener for the pointer leave event.
     * @param e PointerEvent
     */
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

    /**
     * Listener for the pointer down event.
     * @param e PointerEvent
     */
    private onPointerDown(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            if (!this.isTwoPoints) {
                this.capturingState = true;

                this.pointerCaptureId = e.pointerId;
                this.parentNode.setPointerCapture(this.pointerCaptureId);
                this.moveCross(this.crossB, this.crossA);
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);

                this.showAll([this.crossA, this.crossB, this.selectionBox]);

                if (typeof this.callbacks.onSelectionBegin === "function") {
                    this.callbacks.onSelectionBegin();
                }
            }
        });
    }

    /**
     * Listener for the pointer up event.
     * @param e PointerEvent
     */
    private onPointerUp(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            if (!this.isTwoPoints) {
                this.capturingState = false;
                if (this.pointerCaptureId >= 0) {
                    this.parentNode.releasePointerCapture(this.pointerCaptureId);
                    this.pointerCaptureId = -1;
                }
                this.hideAll([this.crossB, this.selectionBox]);

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
                    this.hideAll([this.crossB, this.selectionBox]);

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
                    this.showAll([this.crossA, this.crossB, this.selectionBox]);

                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                }
            }
        });
    }

    /**
     * Listener for the pointer move event.
     * @param e PointerEvent
     */
    private onPointerMove(e: PointerEvent) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

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

    /**
     * Listener for the key down event.
     * @param e KeyboardEvent
     */
    private onKeyDown(e: KeyboardEvent) {
        // Holding shift key enable square drawing mode
        if (e.shiftKey) {
            this.selectionModificator = SelectionModificator.SQUARE;
        }

        if (e.ctrlKey && !this.capturingState) {
            this.isTwoPoints = true;
        }
    }

    /**
     * Listener for the key up event.
     * @param e KeyboardEvent
     */
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
            this.hideAll([this.crossB, this.selectionBox]);
        }
    }
}
