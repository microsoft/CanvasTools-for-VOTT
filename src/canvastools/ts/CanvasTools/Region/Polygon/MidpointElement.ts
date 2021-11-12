import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { MidpointComponent } from "../Component/MidpointComponent";

/**
 * `MidpointComponent` for the `PolygonRegion` class.
 */
export class MidpointElement extends MidpointComponent {
    /**
     * Default (visual) radius for point drag-component.
     */
    public static DEFAULT_RADIUS: number = 6;

    private midpoints: Snap.Element[];

    /**
     * Creates a new `DragElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);

        this.midpointNode = paper.circle(this.x, this.y, MidpointElement.DEFAULT_RADIUS);
        this.midpointNode.addClass("midPointStyle");

        this.node.add(this.midpointNode);

        this.subscribeToClickEvents();
    }

    /**
     * Redraws the component.
     */
    public redraw() {
        // this.regionData.points.forEach(() )
        // const lines = this.regionData.points.reduce<Array<[Point2D, Point2D]>>((acc, point, idx) => {

        // }, []);
        // TODO: calculate midpoints of line segments in regionData and draw elements circles
        window.requestAnimationFrame(() => {
            this.midpointNode.attr({
                cx: this.x,
                cy: this.y,
            });
        });
    }
}
