import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { DragComponent } from "../Component/DragComponent";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

/*
 * DragElement
 * Used internally to drag the region
*/
export class DragElement extends DragComponent {
    public static DEFAULT_DRAG_RADIUS: number = 7;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);

        this.dragNode = paper.circle(this.x, this.y, DragElement.DEFAULT_DRAG_RADIUS);
        this.dragNode.addClass("dragPointStyle");

        this.node.add(this.dragNode);

        this.subscribeToDragEvents();
    }

    public redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                cx: this.x,
                cy: this.y,
            });
        });
    }
}
