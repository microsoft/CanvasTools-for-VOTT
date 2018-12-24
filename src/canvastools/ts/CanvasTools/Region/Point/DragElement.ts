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
 * DragElement 
 * Used internally to drag the region
*/
export class DragElement extends RegionComponent {
    private dragPoint: Snap.Element;
    private isDragged: boolean = false;

    private radius: number = 7;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);

        this.buildOn(paper);
        this.subscribeToDragEvents();
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("dragLayer");

        this.dragPoint = paper.circle(this.x, this.y, this.radius);
        this.dragPoint.addClass("dragPointStyle");

        this.node.add(this.dragPoint);
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
        window.requestAnimationFrame(() => {
            this.dragPoint.attr({
                cx: this.x,
                cy: this.y
            });
        });
    }

    private dragOrigin: Point2D;

    private rectDragBegin() {
        this.dragOrigin = new Point2D(this.x, this.y);
    }

    private rectDragMove(dx: number, dy: number) {
        if (dx != 0 && dy != 0) {
            let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

            if (this.paperRect !== null) {
                p = p.boundToRect(this.paperRect);
            }

            let rd = this.regionData.copy();
            rd.move(p);
            
            this.onChange(this, rd, ChangeEventType.MOVING);
        }
    };

    private rectDragEnd() {
        this.dragOrigin = null;

        this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND);
    }

    private subscribeToDragEvents() {
        this.dragPoint.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.undrag();
                this.dragPoint.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;

                this.onManipulationBegin();
            }
        });

        this.dragPoint.node.addEventListener("pointermove", (e) => {
            if (!this.isDragged && !this.isFrozen) {
                this.dragPoint.undrag();
                this.dragPoint.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;

                this.onManipulationBegin();
            }
        });

        this.dragPoint.node.addEventListener("pointerleave", (e) => {
            this.dragPoint.undrag();
            this.isDragged = false;

            this.onManipulationEnd();
        });

        this.dragPoint.node.addEventListener("pointerdown", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.node.setPointerCapture(e.pointerId);
                let multiselection = e.shiftKey;

                this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN, multiselection);
            }
        });

        this.dragPoint.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.node.releasePointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                
                this.onChange(this, this.regionData.copy(), ChangeEventType.SELECTIONTOGGLE, multiselection);
            }
        });
    }

    public freeze() {
        super.freeze();
        this.dragPoint.undrag();
        this.onManipulationEnd();
    }
}
