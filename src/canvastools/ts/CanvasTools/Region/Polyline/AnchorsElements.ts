import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { AnchorsComponent } from "../Component/AnchorsComponent";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

/*
 * AnchorsElement
 * Used internally to draw anchors to resize the region
*/
export class AnchorsElement extends AnchorsComponent {
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
    }

    protected buildPointAnchors(paper: Snap.Paper) {
        super.buildPointAnchors(paper);
    }

    protected updateRegion(p: Point2D) {
        let rd = this.regionData.copy();
        if (this.activeAnchorIndex >= 0 && this.activeAnchorIndex < this.regionData.points.length) {
            rd.setPoint(p, this.activeAnchorIndex);
        }

        this.onChange(this, rd, ChangeEventType.MOVING);
    }
}
