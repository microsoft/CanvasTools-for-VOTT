import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { RegionComponent } from "./RegionComponent";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

/*
 * DragElement
 * Used internally to drag the region
*/
export abstract class DragComponent extends RegionComponent {
    protected dragNode: Snap.Element;
    protected isDragged: boolean = false;
    protected dragOrigin: Point2D;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.node = paper.g();
        this.node.addClass("dragLayer");
    }

    public freeze() {
        super.freeze();
        this.dragNode.undrag();
        this.onManipulationEnd();
    }

    protected onDragBegin() {
        this.dragOrigin = new Point2D(this.x, this.y);
    }

    protected onDragMove(dx: number, dy: number) {
        if (dx !== 0 && dy !== 0) {
            let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

            if (this.paperRect !== null) {
                p = p.boundToRect(this.paperRect);
            }

            const rd = this.regionData.copy();
            rd.move(p);
            this.onChange(this, rd, ChangeEventType.MOVING);
        }
    }

    protected onDragEnd() {
        this.dragOrigin = null;

        this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND);
    }

    protected subscribeToDragEvents() {
        this.dragNode.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.dragNode.undrag();
                this.dragNode.drag(this.onDragMove.bind(this), this.onDragBegin.bind(this), this.onDragEnd.bind(this));
                this.isDragged = true;

                this.onManipulationBegin();
            }
        });

        this.dragNode.node.addEventListener("pointermove", (e) => {
            if (!this.isDragged && !this.isFrozen) {
                this.dragNode.undrag();
                this.dragNode.drag(this.onDragMove.bind(this), this.onDragBegin.bind(this), this.onDragEnd.bind(this));
                this.isDragged = true;

                this.onManipulationBegin();
            }
        });

        this.dragNode.node.addEventListener("pointerleave", (e) => {
            this.dragNode.undrag();
            this.isDragged = false;

            this.onManipulationEnd();
        });

        this.dragNode.node.addEventListener("pointerdown", (e) => {
            if (!this.isFrozen) {
                this.dragNode.node.setPointerCapture(e.pointerId);
                const multiselection = e.shiftKey;
                this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN, multiselection);
            }
        });

        this.dragNode.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragNode.node.releasePointerCapture(e.pointerId);
                const multiselection = e.shiftKey;
                this.onChange(this, this.regionData.copy(), ChangeEventType.SELECTIONTOGGLE, multiselection);
            }
        });
    }
}
