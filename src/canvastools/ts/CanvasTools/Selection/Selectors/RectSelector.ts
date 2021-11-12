import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

import { IPoint2D } from "../../Interface/IPoint2D";
import { AlternatingCrossElement } from "../Component/AlternatingCrossElement";
import { CrossElement } from "../Component/CrossElement";
import { RectElement } from "../Component/RectElement";
import { Selector } from "./Selector";

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
    private crossA: AlternatingCrossElement;

    /**
     * The `CrossElement` to set the opposite corner of the rect.
     */
    private crossB: AlternatingCrossElement;

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
     * Internal flag to control keyboard cursor mode.
     */
    private usingKeyboardCursor: boolean = false;

    /**
     * Internal reference to the current keyboard cross element.
     */
    private curKeyboardCross: CrossElement;

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
     * Resets any in progress shape
     */
    public reset(): void {
        this.buildUIElements();
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
     *  Returns the member variable `usingKeyboardCursor`
     */
    public getUsingKeyboardCursor() {
        return this.usingKeyboardCursor;
    }

    /**
     * Helper function to start the use of keyboard cursor controls.
     */
    public activateKeyboardCursor() {
        this.usingKeyboardCursor = true;
        this.curKeyboardCross = this.crossA;
        this.isTwoPoints = true;
        this.capturingState = false;
        this.showAll([this.crossA]);
        this.hideAll([this.crossB, this.selectionBox]);
    }

    /**
     * Helper function to stop the use of keyboard cursor controls.
     */
    public deactivateKeyboardCursor() {
        this.usingKeyboardCursor = false;
        this.curKeyboardCross = null;
    }

    /**
     * Builds selector's UI.
     */
    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectSelector");
        this.crossA = new AlternatingCrossElement(this.paper, this.boundRect);
        this.crossB = new AlternatingCrossElement(this.paper, this.boundRect);
        this.selectionBox = new RectElement(this.paper, this.boundRect, new Rect(0, 0));
        this.selectionBox.node.addClass("selectionBoxStyle");

        this.node.add(this.crossA.node);
        this.node.add(this.crossB.node);
        this.node.add(this.selectionBox.node);

        const listeners: EventListeners = [
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
            this.deactivateKeyboardCursor();
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
                    this.endTwoPointSelection(p);
                } else {
                    this.startTwoPointSelection(p);
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
            this.deactivateKeyboardCursor();
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

        if (e.key === "k" || e.key.toLocaleUpperCase() === "K") {
            if (!this.usingKeyboardCursor) {
                // start keyboard mode
                this.activateKeyboardCursor();
            } else if (this.usingKeyboardCursor && !this.capturingState) {
                // set crossA
                this.startTwoPointSelection(this.curKeyboardCross);
                this.curKeyboardCross = this.crossB;
            } else if (this.usingKeyboardCursor && this.capturingState) {
                // set crossB
                this.endTwoPointSelection(this.curKeyboardCross);
                this.curKeyboardCross = this.crossA;
            }
        }
        if (!e.ctrlKey && e.shiftKey && this.isKeyboardControlKey(e.key) && this.usingKeyboardCursor) {
            e.preventDefault();
            this.moveKeyboardCursor(e.key);
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

    /**
     * Helper function for common logic to start a two point selection.
     * @param curPoint IPoint2D
     */
    private startTwoPointSelection(curPoint: IPoint2D) {
        this.capturingState = true;
        this.moveCross(this.crossB, curPoint);
        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
        this.showAll([this.crossA, this.crossB, this.selectionBox]);

        if (typeof this.callbacks.onSelectionBegin === "function") {
            this.callbacks.onSelectionBegin();
        }
    }

    /**
     * Helper function for common logic to end a two point selection.
     * @param curPoint IPoint2D
     */
    private endTwoPointSelection(curPoint: IPoint2D) {
        this.capturingState = false;
        this.hideAll([this.crossB, this.selectionBox]);

        if (typeof this.callbacks.onSelectionEnd === "function") {
            const x = Math.min(this.crossA.x, this.crossB.x);
            const y = Math.min(this.crossA.y, this.crossB.y);
            const w = Math.abs(this.crossA.x - this.crossB.x);
            const h = Math.abs(this.crossA.y - this.crossB.y);

            this.callbacks.onSelectionEnd(RegionData.BuildRectRegionData(x, y, w, h));
        }
        this.moveCross(this.crossA, curPoint);
        this.moveCross(this.crossB, curPoint);
    }

    /**
     * Helper function to check if a key is used for controlling the keyboard cursor.
     * @param key string
     */
    private isKeyboardControlKey(key: string) {
        return key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";
    }
    /**
     * Helper function for common logic to move the keyboard cursor
     * @param key string
     */
    private moveKeyboardCursor(key: string) {
        const nextPos: IPoint2D = {x: this.curKeyboardCross.x, y: this.curKeyboardCross.y};
        switch (key) {
            // up
            case "ArrowUp":
                nextPos.y -= 20;
                break;
            // down
            case "ArrowDown":
                nextPos.y += 20;
                break;
            // left
            case "ArrowLeft":
                nextPos.x -= 20;
                break;
            // right
            case "ArrowRight":
                nextPos.x += 20;
                break;
            default:
                break;
        }

        this.moveCross(this.curKeyboardCross, nextPos);
        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
    }
}
