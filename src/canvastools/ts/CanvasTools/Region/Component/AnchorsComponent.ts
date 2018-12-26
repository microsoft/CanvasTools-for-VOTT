import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { RegionComponent } from "./RegionComponent";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

/*
 * AnchorsElement
 * Used internally to draw anchors to resize the region
*/
export class AnchorsComponent extends RegionComponent {
    public static DEFAULT_ANCHOR_RADIUS = 3;
    public static DEFAULT_GHOST_ANCHOR_RADIUS = 7;
    protected anchors: Snap.Element[];
    protected anchorsNode: Snap.Element;
    protected ghostAnchor: Snap.Element;

    protected activeAnchorIndex: number = -1;
   
    protected dragOrigin: Point2D;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.node = paper.g();
        this.node.addClass("anchorsLayer");
        this.anchors = [];
        this.anchorsNode = paper.g();

        this.buildPointAnchors();

        this.ghostAnchor = this.createAnchor(paper, 0, 0, "ghost", AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS);
        this.ghostAnchor.attr({
            display: "none"
        });

        this.node.add(this.anchorsNode);
        this.node.add(this.ghostAnchor);

        const listeners: IEventDescriptor[] = [
            { event: "pointerenter", listener: this.onGhostPointerEnter, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerleave", listener: this.onGhostPointerLeave, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerdown", listener: this.onGhostPointerDown, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerup", listener: this.onGhostPointerUp, base: this.ghostAnchor.node, bypass: false },
            { event: "pointermove", listener: this.onGhostPointerMove, base: this.ghostAnchor.node, bypass: false },
        ];

        this.subscribeToEvents(listeners);
    }

    protected buildPointAnchors() {
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);

            this.subscribeAnchorToEvents(anchor, index);
        })
    }

    public redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
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

    public freeze() {
        super.freeze();
        this.ghostAnchor.undrag();
        this.onManipulationEnd();
    }

    protected subscribeAnchorToEvents(anchor: Snap.Element, index: number) {
        anchor.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                // Set drag origin point to current anchor
                this.dragOrigin = this.regionData.points[index];
                this.activeAnchorIndex = index;
                // Move ghost anchor to current anchor position

                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: this.dragOrigin.x,
                        cy: this.dragOrigin.y,
                        display: "block",
                    });
                });
                this.onManipulationBegin();
            }
        });
    }

    protected createAnchor(paper: Snap.Paper, x: number, y: number, style?: string, r: number = AnchorsComponent.DEFAULT_ANCHOR_RADIUS): Snap.Element {
        const a = paper.circle(x, y, r);
        a.addClass("anchorStyle");
        if (style !== undefined && style !== "") {
            a.addClass(style);
        }
        return a;
    }

    protected updateRegion(p: Point2D) {
    }

    protected anchorDragBegin() {
        // do nothing
    }

    protected anchorDragMove(dx: number, dy: number, x: number, y: number) {
        let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

        if (this.paperRect !== null) {
            p = p.boundToRect(this.paperRect);
        }

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({ cx: p.x, cy: p.y });
        });

        this.updateRegion(p);
    }

    protected anchorDragEnd() {
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });
        this.activeAnchorIndex = -1;
    }

    protected onGhostPointerEnter(e: PointerEvent) {
        this.ghostAnchor.drag(
            this.anchorDragMove.bind(this),
            this.anchorDragBegin.bind(this),
            this.anchorDragEnd.bind(this));

        this.onManipulationBegin();
    }

    protected onGhostPointerLeave(e: PointerEvent) {
        this.ghostAnchor.undrag();

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });

        this.activeAnchorIndex = -1;
        this.onManipulationEnd();
    }

    protected onGhostPointerDown(e: PointerEvent) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);
        this.dragOrigin = new Point2D(e.offsetX, e.offsetY);

        this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN);
        
    }

    protected onGhostPointerMove(e: PointerEvent) {
    }

    protected onGhostPointerUp(e: PointerEvent) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        
        this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND);
    }
}
