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
    public static ANCHOR_POINT_LINE_SWITCH_THRESHOLD: number = 5;

    private deleteOnPointerUp: boolean = false;
    private anchorsLength: number;
    private anchorsPolyline: Snap.Element;
    private addOnPointerUp:boolean = false;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.anchorsLength = regionData.points.length;
    }

    protected buildPointAnchors() {
        let pointsData = [];
        this.regionData.points.forEach(p => {
            pointsData.push(p.x, p.y);
        });

        this.anchorsPolyline = this.paper.polyline(pointsData);
        this.anchorsPolyline.addClass("anchorLineStyle");
        this.subscribeLineToEvents(this.anchorsPolyline);

        this.anchorsNode.add(this.anchorsPolyline);

        super.buildPointAnchors();        
    }

    protected subscribeLineToEvents(anchor: Snap.Element) {
        anchor.node.addEventListener("pointermove", (e: PointerEvent) => {
            if (!this.isFrozen) {
                if (e.ctrlKey) {
                    this.dragOrigin = new Point2D(e.offsetX, e.offsetY);
                    this.activeAnchorIndex = -1;
                    this.addOnPointerUp = true;
                    window.requestAnimationFrame(() => {
                        this.ghostAnchor.attr({
                            cx: this.dragOrigin.x,
                            cy: this.dragOrigin.y,
                            display: "block",
                        });
                    });
                } else {
                    this.addOnPointerUp = false;
                }
                this.onManipulationBegin();
            }
        }, false);
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

            let pointsData = [];        
            this.regionData.points.forEach(p => {
                pointsData.push(p.x, p.y);
            });
    
            this.anchorsPolyline.attr({
                points: pointsData.toString()
            });
        }
    }

    protected onGhostPointerEnter(e: PointerEvent) {
        if (e.ctrlKey) {
            console.log(this.activeAnchorIndex, this.addOnPointerUp, this.deleteOnPointerUp);
           
            if (this.addOnPointerUp && this.activeAnchorIndex < 0) {
                this.ghostAnchor.addClass("add");
            } else if (this.regionData.points.length > 2) {
                this.ghostAnchor.addClass("delete");
                this.deleteOnPointerUp = true;
                this.addOnPointerUp = false;
            }                        
        } else {
            this.ghostAnchor.removeClass("delete");  
            this.ghostAnchor.removeClass("add");          
            this.deleteOnPointerUp = false;
        }

        this.ghostAnchor.drag(
            this.anchorDragMove.bind(this),
            this.anchorDragBegin.bind(this),
            this.anchorDragEnd.bind(this));

        this.onManipulationBegin();
    }

    protected onGhostPointerMove(e: PointerEvent) {
        if (e.ctrlKey) {
            console.log(this.activeAnchorIndex, this.addOnPointerUp, this.deleteOnPointerUp);

            let p = new Point2D(e.offsetX, e.offsetY);
            let dist: number = Number.MAX_VALUE;
            let nearestPoint: Point2D = null;
            let index: number = -1;
            this.regionData.points.forEach((point, i) => {
                let d = p.squareDistanceToPoint(point);
                if (d < dist) {
                    dist = d;
                    nearestPoint = point;
                    index = i;
                }
            });

            let swapToDelete:boolean = dist < AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD;

            if (this.addOnPointerUp && this.activeAnchorIndex < 0 && !swapToDelete) {
                this.ghostAnchor.addClass("add");

                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: p.x,
                        cy: p.y,
                    });
                });

            } else if (this.regionData.points.length > 2 || swapToDelete) {
                this.ghostAnchor.removeClass("add"); 
                this.ghostAnchor.addClass("delete");
                this.activeAnchorIndex = index;

                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: nearestPoint.x,
                        cy: nearestPoint.y,
                    });
                });

                this.deleteOnPointerUp = true;
                this.addOnPointerUp = false;
            }
        } else {
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");  
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
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
            this.addOnPointerUp = false;
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
        } else if (this.addOnPointerUp) {
            let point = new Point2D(e.offsetX, e.offsetY);
            let points = rd.points;

            // Find the nearest segment of polyline
            let index = 0;
            let distance = Number.MAX_VALUE;

            for (let i = 0; i < points.length - 1; i++) {
                let d = this.dragOrigin.squareDistanceToLine(points[i], points[i+1]);

                if (d < distance) {
                    index = i;
                    distance = d;
                }
            }

            points.splice(index + 1, 0, point);
            rd.setPoints(points);

            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
            this.ghostAnchor.addClass("delete");
        }

        this.onChange(this, rd, ChangeEventType.MOVEEND);
    }
}
