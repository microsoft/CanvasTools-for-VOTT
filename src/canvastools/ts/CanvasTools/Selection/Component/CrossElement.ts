import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { IMovable } from "../../Interface/IMovable";

import { Element } from "./Element";
import { IPoint2D } from "../../Interface/IPoint2D";

/**
 * The cross element for selectors.
 */
export class CrossElement extends Element implements IPoint2D {
    /**
     * Horizontal line element.
     */
    private hl: Snap.Element;

    /**
     * Vertical line element.
     */
    private vl: Snap.Element;

    /**
     * Visual center of the cross.
     */
    private center: Point2D;

    /**
     * The `x`-coordinate of the cross center.
     */
    public get x(): number {
        return this.center.x;
    }

    /**
     * The `y`-coordinate of the cross center.
     */
    public get y(): number {
        return this.center.y;
    }

    /**
     * Creates new `CrossElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     */
    constructor(paper: Snap.Paper, boundRect: Rect) {
        super(paper, boundRect);
        this.buildUIElements();
        this.hide();
    }

    /**
     * Bounds the cross center to the specified box.
     * @param rect - The bounding box.
     */
    public boundToRect(rect: Rect): Point2D {
        return new Point2D(this.x, this.y).boundToRect(rect);
    }

    /**
     * Moves cross to specified point, applying bounding and taking into account square movement modificator.
     * @param p - The new cross center location.
     * @param rect - The bounding box.
     * @param square - The square movement flag.
     * @param ref - The reference point for square.
     */
    public move(p: IPoint2D, boundRect: Rect, square: boolean = false, ref: IPoint2D = null) {
        const np: Point2D = new Point2D(p).boundToRect(boundRect);

        if (square) {
            const dx = Math.abs(np.x - ref.x);
            const vx = Math.sign(np.x - ref.x);
            const dy = Math.abs(np.y - ref.y);
            const vy = Math.sign(np.y - ref.y);

            const d = Math.min(dx, dy);
            np.x = ref.x + d * vx;
            np.y = ref.y + d * vy;
        }

        this.center.move(np);

        this.vl.node.setAttribute("x1", np.x.toString());
        this.vl.node.setAttribute("x2", np.x.toString());
        this.vl.node.setAttribute("y2", boundRect.height.toString());

        this.hl.node.setAttribute("y1", np.y.toString());
        this.hl.node.setAttribute("x2", boundRect.width.toString());
        this.hl.node.setAttribute("y2", np.y.toString());
    }

    /**
     * Resizes the cross element to specified `width` and `height`.
     * @param width - The new `width`.
     * @param height - The new `height`.
     */
    public resize(width: number, height: number) {
        super.resize(width, height);
        this.vl.node.setAttribute("y2", height.toString());
        this.hl.node.setAttribute("x2", width.toString());
    }

    /**
     * Builds the visual presentation of the element.
     */
    private buildUIElements() {
        const verticalLine: Snap.Element = this.paper.line(0, 0, 0, this.boundRect.height);
        const horizontalLine: Snap.Element = this.paper.line(0, 0, this.boundRect.width, 0);

        this.node = this.paper.g();
        this.node.addClass("crossStyle");
        this.node.add(verticalLine);
        this.node.add(horizontalLine);

        this.hl = horizontalLine;
        this.vl = verticalLine;

        this.center = new Point2D(0, 0);
    }
}
