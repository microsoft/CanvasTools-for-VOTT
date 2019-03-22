import { Rect } from "../../Core/Rect";
import { Element } from "./Element";
import { RectElement } from "./RectElement";

/**
 * The mask element for selectors
 */
export class MaskElement extends Element {
    /**
     * Internal mask composition element.
     */
    private mask: RectElement;

    /**
     * Internal layer for the mask cover.
     */
    private maskIn: RectElement;

    /**
     * External layer for the mask filter.
     */
    private maskOut: { node: Snap.Element };

    /**
     * Combined mask
     */
    private combinedMask: Snap.Element;

    /**
     * Reference url to the mask
     */
    private maskReference: string;

    /**
     * Creates a new `MaskElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     * @param maskOut - The element to be used as mask filter.
     */
    constructor(paper: Snap.Paper, boundRect: Rect, maskOut: { node: Snap.Element }) {
        super(paper, boundRect);
        this.maskOut = maskOut;
        this.buildUIElements();
        this.resize(boundRect.width, boundRect.height);
        this.hide();
    }

    /**
     * Resize the element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    public resize(width: number, height: number) {
        super.resize(width, height);
        this.mask.resize(width, height);
        this.maskIn.resize(width, height);
    }

    /**
     * Builds the visual presentation of the element.
     */
    private buildUIElements() {
        this.mask = this.createMask();

        this.maskIn = this.createMaskIn();
        this.maskOut.node.addClass("maskOutStyle");

        this.combinedMask = this.paper.g();
        this.combinedMask.add(this.maskIn.node);
        this.combinedMask.add(this.maskOut.node);

        this.mask.node.attr({
            mask: this.combinedMask,
        });

        this.maskReference = this.mask.node.node.getAttribute("mask");

        this.node = this.mask.node;
    }

    /**
     * Helper function to build the mask rect.
     */
    private createMask(): RectElement {
        const r: RectElement = new RectElement(this.paper, this.boundRect, this.boundRect);
        r.node.addClass("maskStyle");
        return r;
    }

    /**
     * Helper function to build the mask-in rect.
     */
    private createMaskIn(): RectElement {
        const r: RectElement = new RectElement(this.paper, this.boundRect, this.boundRect);
        r.node.addClass("maskInStyle");
        return r;
    }
}
