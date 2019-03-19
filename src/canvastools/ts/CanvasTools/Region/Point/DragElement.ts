import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { DragComponent } from "../Component/DragComponent";

/**
 * `DragComponent` for the `PointRegion` class.
 */
export class DragElement extends DragComponent {
    /**
     * Default (visual) radius for point drag-component.
     */
    public static DEFAULT_DRAG_RADIUS: number = 6;

    /**
     * Creates a new `DragElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);

        this.dragNode = paper.circle(this.x, this.y, DragElement.DEFAULT_DRAG_RADIUS);
        this.dragNode.addClass("dragPointStyle");

        this.node.add(this.dragNode);

        this.subscribeToDragEvents();
    }

    /**
     * Redraws the componnent.
     */
    public redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                cx: this.x,
                cy: this.y,
            });
        });
    }
}
