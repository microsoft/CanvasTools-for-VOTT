import { ToolbarIcon } from "./ToolbarIcon";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

export class ToolbarSeparator extends ToolbarIcon {
    private iconSeparator: Snap.Element;

    constructor(paper: Snap.Paper, width: number) {
        super(paper, null);
        this.buildIconUI();

        this.resize(width, 1);
    }

    public move(x: number, y: number) {
        super.move(x, y);
        this.iconSeparator.attr({
            x1: x,
            x2: x + this.width,
            y1: y,
            y2: y,
        });
    }

    public resize(width: number, height: number) {
        super.resize(width, 1);

        this.iconSeparator.attr({
            width: this.width,
        });
    }

    private buildIconUI() {
        this.node = this.paper.g();
        this.node.addClass("iconStyle");
        this.node.addClass("separator");

        this.iconSeparator = this.paper.line(0, 0, this.width, 0);
        this.node.add(this.iconSeparator);
    }
}
