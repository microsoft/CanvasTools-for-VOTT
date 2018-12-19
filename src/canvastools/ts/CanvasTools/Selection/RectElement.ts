import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";

import { ElementPart } from "./ElementPart";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export class RectElement extends ElementPart {
    public rect: Rect;

    constructor(paper: Snap.Paper, boundRect: Rect, rect: Rect) {
        super(paper, boundRect);
        this.rect = rect;
        this.buildUIElements();
        this.hide();
    }

    public move(p: Point2D) {
        this.node.node.setAttribute("x", p.x.toString());
        this.node.node.setAttribute("y", p.y.toString());
    }

    public resize(width: number, height: number) {
        this.rect.resize(width, height);
        this.node.node.setAttribute("height", height.toString());
        this.node.node.setAttribute("width", width.toString());
    }

    private buildUIElements() {
        this.node = this.paper.rect(0, 0, this.rect.width, this.rect.height);

    }
}
