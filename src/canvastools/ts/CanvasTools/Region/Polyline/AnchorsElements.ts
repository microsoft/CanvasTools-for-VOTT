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
    private deleteOnPointerUp: boolean = false;
    private anchorsLength: number;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.anchorsLength = regionData.points.length;
    }

    protected updateRegion(p: Point2D) {
        let rd = this.regionData.copy();
        if (this.activeAnchorIndex >= 0 && this.activeAnchorIndex < this.regionData.points.length) {
            rd.setPoint(p, this.activeAnchorIndex);
        }

        this.onChange(this, rd, ChangeEventType.MOVING);
    }

    public redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
            let points = this.regionData.points;
            // rebuild anchors
            if (this.anchorsLength !== points.length) {
                window.requestAnimationFrame(() => {
                    this.anchors.forEach((anchor) => {
                        anchor.remove();
                    });
                    this.anchors = [];

                    this.buildPointAnchors();

                });

                this.anchorsLength = points.length;
            } else {
                window.requestAnimationFrame(() => {
                    this.regionData.points.forEach((p, index) => {
                        this.anchors[index].attr({
                            cx: p.x,
                            cy: p.y,
                        });
                    });
                })
            }
        }
    }

    protected onGhostPointerEnter(e: PointerEvent) {
        if (e.ctrlKey) {
            this.ghostAnchor.addClass("delete");            
        } else {
            this.ghostAnchor.removeClass("delete");            
        }

        this.ghostAnchor.drag(
            this.anchorDragMove.bind(this),
            this.anchorDragBegin.bind(this),
            this.anchorDragEnd.bind(this));

        this.onManipulationBegin();
    }

    protected onGhostPointerMove(e: PointerEvent) {
        if (e.ctrlKey) {
            if (this.regionData.points.length > 2) {
                this.ghostAnchor.addClass("delete");
                this.deleteOnPointerUp = true;
            }            
        } else {
            this.ghostAnchor.removeClass("delete");
            this.deleteOnPointerUp = false;
        }
    }

    protected onGhostPointerUp(e: PointerEvent) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        
        let rd = this.regionData.copy();

        if (this.deleteOnPointerUp) {            
            if (this.activeAnchorIndex >= 0 && this.activeAnchorIndex < this.regionData.points.length) {
                let points = rd.points;
                points.splice(this.activeAnchorIndex, 1);
                rd.setPoints(points);
            }
            this.deleteOnPointerUp = false;
            this.ghostAnchor.removeClass("delete");
        }

        this.onChange(this, rd, ChangeEventType.MOVEEND);
    }
}
