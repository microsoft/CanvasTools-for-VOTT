import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { DragComponent } from "../Component/DragComponent";

import * as SNAPSVG_TYPE from "snapsvg";

declare var Snap: typeof SNAPSVG_TYPE;

/*
 * DragElement
 * Used internally to drag the region
*/
export class DragElement extends DragComponent {
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);

        this.dragNode = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.dragNode.addClass("dragRectStyle");

        this.node.add(this.dragNode);

        this.subscribeToDragEvents();
    }

    public redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                height: this.height,
                width: this.width,
                x: this.x,
                y: this.y,
            });
        });
    }
}
