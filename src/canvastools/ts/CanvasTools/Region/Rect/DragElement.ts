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
    private dragRect: Snap.Element;
    private isDragged: boolean = false;
    private dragOrigin: Point2D;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);

        this.buildOn(paper);
        this.subscribeToDragEvents();
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
            this.dragRect.attr({
                height: this.height,
                width: this.width,
                x: this.x,
                y: this.y,
            });
        });
    }

    public freeze() {
        super.freeze();
        this.dragRect.undrag();

        if (this.onManipulationEnd !== null) {
            this.onManipulationEnd();
        }        
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("dragLayer");

        this.dragRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.dragRect.addClass("dragRectStyle");

        this.node.add(this.dragRect);
    }

    private rectDragBegin() {
        this.dragOrigin = new Point2D(this.x, this.y);
    }

    private rectDragMove(dx: number, dy: number) {
        if (dx !== 0 && dy !== 0) {
            let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

            if (this.paperRect !== null) {
                p = p.boundToRect(this.paperRect);
            }

            let rd = this.regionData.copy();
            rd.move(p);

            if(this.onChange !== null) {
                this.onChange(this, rd, ChangeEventType.MOVING);
            }            
        }
    }

    private rectDragEnd() {
        this.dragOrigin = null;

        if (this.onChange !== null) {
            this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND);
        }        
    }

    private subscribeToDragEvents() {
        this.dragRect.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.dragRect.undrag();
                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this),
                                   this.rectDragEnd.bind(this));
                this.isDragged = true;

                if (this.onManipulationBegin !== null) {
                    this.onManipulationBegin();
                }                
            }
        });

        this.dragRect.node.addEventListener("pointermove", (e) => {
            if (!this.isDragged && !this.isFrozen) {
                this.dragRect.undrag();
                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this),
                                   this.rectDragEnd.bind(this));
                this.isDragged = true;

                if (this.onManipulationBegin !== null) {
                    this.onManipulationBegin();
                }                   
            }
        });

        this.dragRect.node.addEventListener("pointerleave", (e) => {
            this.dragRect.undrag();
            this.isDragged = false;

            if (this.onManipulationEnd !== null) {
                this.onManipulationEnd();
            }            
        });

        this.dragRect.node.addEventListener("pointerdown", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.setPointerCapture(e.pointerId);
                const multiselection = e.shiftKey;

                if (this.onChange !== null) {
                    this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN, multiselection);
                }
                
            }
        });

        this.dragRect.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.releasePointerCapture(e.pointerId);
                const multiselection = e.shiftKey;

                if (this.onChange !== null) {
                    this.onChange(this, this.regionData.copy(), ChangeEventType.SELECTIONTOGGLE, multiselection);
                }                
            }
        });
    }
}
