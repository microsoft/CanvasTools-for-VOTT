import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { AnchorsComponent } from "../Component/AnchorsComponent";

/* import * as SNAPSVG_TYPE from "snapsvg";

declare var Snap: typeof SNAPSVG_TYPE; */

/*
 * AnchorsElement
 * Used internally to draw anchors to resize the region
*/
export class AnchorsElement extends AnchorsComponent {
    private anchorStyles: string[];

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
    }

    protected buildPointAnchors() {
        this.anchorStyles = ["TL", "TR", "BR", "BL"];

        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y, this.anchorStyles[index]);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);

            this.subscribeAnchorToEvents(anchor, index);
        })
    }

    private getActiveAnchor(): string {
        return (this.activeAnchorIndex >= 0) ? this.anchorStyles[this.activeAnchorIndex] : "";
    }

    protected updateRegion(p: Point2D) {
        let x1: number = p.x;
        let y1: number = p.y;
        let x2: number;
        let y2: number;
        let flipX: boolean = false;
        let flipY: boolean = false;

        let activeAnchor = this.getActiveAnchor();

        switch (this.getActiveAnchor()) {
            case "TL": {
                x2 = this.x + this.width;
                y2 = this.y + this.height;
                flipX = x2 < x1;
                flipY = y2 < y1;
                break;
            }
            case "TR": {
                x2 = this.x;
                y2 = this.y + this.height;
                flipX = x1 < x2;
                flipY = y2 < y1;
                break;
            }
            case "BL": {
                y2 = this.y;
                x2 = this.x + this.width;
                flipX = x2 < x1;
                flipY = y1 < y2;
                break;
            }
            case "BR": {
                x2 = this.x;
                y2 = this.y;
                flipX = x1 < x2;
                flipY = y1 < y2;
                break;
            }
        }

        let newAA: string = "";
        if (activeAnchor !== "") {
            newAA += (activeAnchor[0] === "T") ? (flipY ? "B" : "T") : (flipY ? "T" : "B");
            newAA += (activeAnchor[1] === "L") ? (flipX ? "R" : "L") : (flipX ? "L" : "R");
        }

        if (activeAnchor !== newAA) {
            this.ghostAnchor.removeClass(activeAnchor);
            this.activeAnchorIndex = this.anchorStyles.indexOf(newAA);
            activeAnchor = newAA;
            this.ghostAnchor.addClass(newAA);
        }

        let p1 = new Point2D(Math.min(x1, x2), Math.min(y1, y2)).boundToRect(this.paperRect);
        let p2 = new Point2D(Math.max(x1, x2), Math.max(y1, y2)).boundToRect(this.paperRect);

        let rd = this.regionData.copy();
        rd.setPoints([p1, new Point2D(p2.x, p1.y), p2, new Point2D(p1.x, p2.y)]);

        this.onChange(this, rd, ChangeEventType.MOVING);
    }

    protected onGhostPointerEnter(e: PointerEvent) {
        this.ghostAnchor.addClass(this.getActiveAnchor());
        super.onGhostPointerEnter(e);
    }

    protected onGhostPointerLeave(e: PointerEvent) {
        this.ghostAnchor.removeClass(this.getActiveAnchor());
        super.onGhostPointerLeave(e);
    }

}
