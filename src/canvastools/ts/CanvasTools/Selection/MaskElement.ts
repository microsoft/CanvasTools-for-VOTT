import { Rect } from "../Core/Rect";

import { ElementPart } from "./ElementPart";
import { RectElement } from "./RectElement";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

export class MaskElement extends ElementPart {
    private mask: RectElement;
    private maskIn: RectElement;
    private maskOut: { node: Snap.Element };

    constructor(paper: Snap.Paper, boundRect: Rect, maskOut: { node: Snap.Element }) {
        super(paper, boundRect);
        this.maskOut = maskOut;
        this.buildUIElements();
        this.resize(boundRect.width, boundRect.height);
        this.hide();
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.mask.resize(width, height);
        this.maskIn.resize(width, height);
    }

    private buildUIElements() {
        this.mask = this.createMask();

        this.maskIn = this.createMaskIn();
        this.maskOut.node.addClass("maskOutStyle");

        const combinedMask = this.paper.g();
        combinedMask.add(this.maskIn.node);
        combinedMask.add(this.maskOut.node);

        this.mask.node.attr({
            mask: combinedMask,
        });

        this.node = this.mask.node;
    }

    private createMask(): RectElement {
        const r: RectElement = new RectElement(this.paper, this.boundRect, this.boundRect);
        r.node.addClass("maskStyle");
        return r;
    }

    private createMaskIn(): RectElement {
        const r: RectElement = new RectElement(this.paper, this.boundRect, this.boundRect);
        r.node.addClass("maskInStyle");
        return r;
    }
}
