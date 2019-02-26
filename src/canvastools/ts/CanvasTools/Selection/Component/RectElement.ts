import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";

import { Element} from "./Element";
import { IPoint2D } from "../../Interface/IPoint2D";
import { IRect } from "../../Interface/IRect";

/**
 * The rect element for selectors
 */
export class RectElement extends Element implements IPoint2D {
    /**
     * The rect size.
     */
    public rect: Rect;

    /**
     * Visual center of the cross.
     */
    private originPoint: Point2D;

    /**
     * The `x`-coordinate of the cross center.
     */
    public get x(): number {
        return this.originPoint.x;
    }

    /**
     * The `y`-coordinate of the cross center.
     */
    public get y(): number {
        return this.originPoint.y;
    }

    /**
     * Creates the new `RectElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     * @param rect - The rect size.
     */
    constructor(paper: Snap.Paper, boundRect: Rect, rect: IRect) {
        super(paper, boundRect);
        this.rect = new Rect(rect.width, rect.height);
        this.originPoint = new Point2D(0, 0);
        this.buildUIElements();
        this.hide();
    }

    /**
     * Moves rect element to specified location.
     * @param p - The new rect location.
     */
    public move(p: Point2D) {
        this.node.node.setAttribute("x", p.x.toString());
        this.node.node.setAttribute("y", p.y.toString());
        this.originPoint.move(p);
    }

    /**
     * Resizes the element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    public resize(width: number, height: number) {
        this.rect.resize(width, height);
        this.node.node.setAttribute("height", height.toString());
        this.node.node.setAttribute("width", width.toString());
    }

    /**
     * Builds the visual presentation of the element.
     */
    private buildUIElements() {
        this.node = this.paper.rect(0, 0, this.rect.width, this.rect.height);

    }
}
