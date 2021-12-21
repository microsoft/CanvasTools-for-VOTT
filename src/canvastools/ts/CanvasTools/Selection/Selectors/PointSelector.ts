import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

import { IPoint2D } from "../../Interface/IPoint2D";
import { CrossElement } from "../Component/CrossElement";
import { Selector } from "./Selector";

/**
 * The selector to define a point-region.
 */
export class PointSelector extends Selector {
    /**
     * Default radius for the point element. Can be redefined through css styles.
     */
    private static DEFAULT_POINT_RADIUS: number = 6;

    /**
     * The `CrossElement` to define point position
     */
    private crossA: CrossElement;

    /**
     * The temporary point element.
     */
    private point: Snap.Element;

    /**
     * Creates new `PointSelector` object.
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
     * Resets any in progress shape
     */
    public reset(): void {
        this.buildUIElements();
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
        this.hideAll([this.crossA, this.point]);
    }

    /**
     * Shows the selector.
     */
    public show() {
        super.show();
        this.showAll([this.crossA, this.point]);
    }

    /**
     * Builds selector's UI.
     */
    private buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("pointSelector");

        this.crossA = new CrossElement(this.paper, this.boundRect);
        this.point = this.paper.circle(0, 0, PointSelector.DEFAULT_POINT_RADIUS);
        this.point.addClass("pointStyle");

        this.node.add(this.crossA.node);
        this.node.add(this.point);

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
                listener: () => this.hide(),
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.parentNode,
                listener: (e: PointerEvent) => {
                    this.show();
                    this.movePoint(this.point, this.crossA);
                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.parentNode,
                listener: (e: PointerEvent) => {
                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        this.callbacks.onSelectionEnd(RegionData.BuildPointRegionData(this.crossA.x, this.crossA.y));
                    }
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.parentNode,
                listener: (e: PointerEvent) => {
                    const rect = this.parentNode.getClientRects();
                    const p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.moveCross(this.crossA, p);
                    this.movePoint(this.point, this.crossA);
                    e.preventDefault();
                },
                bypass: false,
            },
        ];

        this.subscribeToEvents(listeners);
    }
}
