import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";
import { IMovable } from "../Interface/IMovable";

import { ElementPart } from "./ElementPart";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export class CrossElement extends ElementPart implements IMovable {
    private hl: Snap.Element;
    private vl: Snap.Element;

    private center: Point2D;

    public get x(): number {
        return this.center.x;
    }

    public get y(): number {
        return this.center.y;
    }

    constructor(paper: Snap.Paper, boundRect: Rect) {
        super(paper, boundRect);
        this.buildUIElements();
        this.hide();
    }

    public boundToRect(rect: Rect): Point2D {
        return new Point2D(this.x, this.y).boundToRect(rect);
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;

    public move(arg1: any, arg2?: any): void {
        this.center.move(arg1, arg2);
    }

    public moveCross(p: IMovable, rect: Rect, square: boolean = false, ref: IMovable = null) {
        const np: Point2D = new Point2D(p).boundToRect(rect);

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
