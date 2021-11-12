import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { MidpointComponent } from "../Component/MidpointComponent";

/**
 * `MidpointComponent` for the `PolygonRegion` class.
 */
export class MidpointElement extends MidpointComponent {
    /**
     * Creates a new `DragElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
    }
}
