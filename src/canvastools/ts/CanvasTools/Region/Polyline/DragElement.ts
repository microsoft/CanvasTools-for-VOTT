import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { DragComponent } from "../Component/DragComponent";

/**
 * `DragComponent` for the `PolylineRegion` class.
 */
export class DragElement extends DragComponent {
    /**
     * Creates a new `DragElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);

        this.dragNode = paper.rect(this.x, this.y, this.width, this.height);
        this.dragNode.addClass("dragRectStyle");

        this.node.add(this.dragNode);

        this.subscribeToDragEvents();
    }

    /**
     * Redraws the componnent.
     */
    public redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            });
        });
    }
}
