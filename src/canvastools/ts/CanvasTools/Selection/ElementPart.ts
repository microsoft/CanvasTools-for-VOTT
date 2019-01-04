import { Rect } from "../Core/Rect";
import { IHideable } from "../Interface/IHideadble";
import { IResizable } from "../Interface/IResizable";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

export abstract class ElementPart implements IHideable, IResizable {
    public node: Snap.Element;

    protected paper: Snap.Paper;
    protected boundRect: Rect;
    protected isVisible: boolean = true;

    public get width() {
        return this.boundRect.width;
    }

    public get height() {
        return this.boundRect.height;
    }

    constructor(paper: Snap.Paper, boundRect: Rect) {
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
