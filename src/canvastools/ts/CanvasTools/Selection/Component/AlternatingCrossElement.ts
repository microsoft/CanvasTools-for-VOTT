import { Rect } from "../../Core/Rect";

import { IPoint2D } from "../../Interface/IPoint2D";
import { CrossElement } from "./CrossElement";

/**
 * The alternating cross element for selectors.
 */
export class AlternatingCrossElement extends CrossElement {
    /**
     * Horizontal line element that visually complements hl, the existing horizontal line element on CrossElement.
     */
    private hl2: Snap.Element;

    /**
     * Vertical line element that visually complements vl, the existing vertical line element on CrossElement.
     */
    private vl2: Snap.Element;

    /**
     * Creates new `AlternatingCrossElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     */
    constructor(paper: Snap.Paper, boundRect: Rect) {
        super(paper, boundRect);
        this.buildUIElements();
        this.hide();
    }

    /**
     * Moves cross to specified point, applying bounding and taking into account square movement modificator.
     * @param p - The new cross center location.
     * @param rect - The bounding box.
     * @param square - The square movement flag.
     * @param ref - The reference point for square.
     */
    public move(p: IPoint2D, boundRect: Rect, square: boolean = false, ref: IPoint2D = null) {
        super.move(p, boundRect, square, ref);
        this.vl2.node.setAttribute("x1", this.vl.attr("x1"));
        this.vl2.node.setAttribute("x2", this.vl.attr("x2"));
        this.vl2.node.setAttribute("y2", this.vl.attr("y2"));

        this.hl2.node.setAttribute("y1", this.hl.attr("y1"));
        this.hl2.node.setAttribute("x2", this.hl.attr("x2"));
        this.hl2.node.setAttribute("y2", this.hl.attr("y2"));
    }

    /**
     * Resizes the alternating cross element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    public resize(width: number, height: number) {
        super.resize(width, height);
        this.vl2.node.setAttribute("y2", height.toString());
        this.hl2.node.setAttribute("x2", width.toString());
    }

    /**
     * Builds the visual presentation of the element.
     */
    protected buildUIElements() {
        super.buildUIElements();
        const verticalLine2: Snap.Element = this.paper.line(0, 0, 0, this.boundRect.height);
        const horizontalLine2: Snap.Element = this.paper.line(0, 0, this.boundRect.width, 0);
        this.node.add(verticalLine2);
        this.node.add(horizontalLine2);

        this.vl2 = verticalLine2;
        this.hl2 = horizontalLine2;

        this.vl.addClass("blackDashes");
        this.hl.addClass("blackDashes");
        this.vl2.addClass("whiteDashes");
        this.hl2.addClass("whiteDashes");
    }
}
