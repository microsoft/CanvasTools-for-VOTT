import { ToolbarIcon } from "./ToolbarIcon";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

export class ToolbarSeparator extends ToolbarIcon {
    private iconSeparator: Snap.Element;
    private isVertical: boolean;
    constructor(paper: Snap.Paper, width: number, isVertical: boolean = true) {
        super(paper, null);
        this.buildIconUI();

        if (isVertical) {
            this.resize(width, 1);
        } else {
            this.resize(1, width);
        }

        this.isVertical = isVertical;
    }

    public move(x: number, y: number) {
        super.move(x, y);
        if (this.isVertical) {
            this.iconSeparator.attr({
                x1: x,
                x2: x + this.width,
                y1: y,
                y2: y,
            });
        } else {
            this.iconSeparator.attr({
                x1: x,
                x2: x,
                y1: y,
                y2: y + this.width,
            });
        }
        
    }

    public resize(width: number, height: number) {
        if (this.isVertical) {
            super.resize(width, 1);

            this.iconSeparator.attr({
                width: this.width,
            });
        } else {
            super.resize(1, height);

            this.iconSeparator.attr({
                height: this.height,
            });
        }
        
    }

    private buildIconUI() {
        this.node = this.paper.g();
        // this.node.addClass("iconStyle");
        this.node.addClass("separator");

        this.iconSeparator = this.isVertical ? this.paper.line(0, 0, this.width, 0) : this.paper.line(0, 0, 0, this.width);
        this.node.add(this.iconSeparator);
    }
}
