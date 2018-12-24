import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IFreezable } from "../../Interface/IFreezable";
import { IHideable } from "../../Interface/IHideadble";
import { IMovable } from "../../Interface/IMovable";
import { IResizable } from "../../Interface/IResizable";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";
import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { RegionComponent } from "../RegionComponent";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

/*
 * AnchorsElement
 * Used internally to draw anchors to resize the region
*/
export class AnchorsElement extends RegionComponent {
    private static DefaultAnchorRadius = 3;
    private anchors: Snap.Element[];
    private ghostAnchor: Snap.Element;

    private activeAnchorIndex: number = -1;
   
    private dragOrigin: Point2D;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);

        this.buildOn(paper);
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any) {
        super.move(arg1, arg2);
        this.redraw();
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.redraw();
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

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("anchorsLayer");

        this.anchors = [];
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(paper, point.x, point.y);
            this.anchors.push(anchor);
            this.node.add(anchor);

            this.subscribeAnchorToEvents(anchor, index);
        })
        
        this.ghostAnchor = this.createAnchor(paper, 0, 0, "ghost", 7);
        this.node.add(this.ghostAnchor);

        const listeners: IEventDescriptor[] = [
            { event: "pointerenter", listener: this.onGhostPointerEnter, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerleave", listener: this.onGhostPointerLeave, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerdown", listener: this.onGhostPointerDown, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerup", listener: this.onGhostPointerUp, base: this.ghostAnchor.node, bypass: false },
        ];

        this.subscribeToEvents(listeners);
    }

    private subscribeAnchorToEvents(anchor: Snap.Element, index: number) {
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
            }
        });
    }

    private createAnchor(paper: Snap.Paper, x: number, y: number, style?: string, r: number = AnchorsElement.DefaultAnchorRadius): Snap.Element {
        const a = paper.circle(x, y, r);
        a.addClass("anchorStyle");
        if (style !== undefined && style !== "") {
            a.addClass(style);
        }
        return a;
    }

    private updateRegion(p: Point2D) {
        let rd = this.regionData.copy();
        if (this.activeAnchorIndex >= 0 && this.activeAnchorIndex < this.regionData.points.length) {
            rd.setPoint(p, this.activeAnchorIndex);
        }

        this.onChange(this, rd, ChangeEventType.MOVING);
    }

    private anchorDragBegin() {
        // do nothing
    }

    private anchorDragMove(dx: number, dy: number, x: number, y: number) {
        let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

        if (this.paperRect !== null) {
            p = p.boundToRect(this.paperRect);
        }

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({ cx: p.x, cy: p.y });
        });

        this.updateRegion(p);
    }

    private anchorDragEnd() {
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });
        this.activeAnchorIndex = -1;
    }

    private onGhostPointerEnter(e: PointerEvent) {
        this.ghostAnchor.drag(
            this.anchorDragMove.bind(this),
            this.anchorDragBegin.bind(this),
            this.anchorDragEnd.bind(this));

        this.onManipulationBegin();
    }

    private onGhostPointerLeave(e: PointerEvent) {
        this.ghostAnchor.undrag();

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });

        this.activeAnchorIndex = -1;
        this.onManipulationEnd();
    }

    private onGhostPointerDown(e: PointerEvent) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);

        this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN);
        
    }

    private onGhostPointerUp(e: PointerEvent) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        
        this.onChange(this, this.regionData, ChangeEventType.MOVEEND);
    }
}
