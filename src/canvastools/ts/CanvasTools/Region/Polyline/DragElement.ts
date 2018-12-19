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

import { ChangeEventType, ChangeFunction, ManipulationFunction, RegionComponent } from "../RegionComponent";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

/*
 * DragElement 
 * Used internally to drag the region
*/
export class DragElement extends RegionComponent {
    private dragRect: Snap.Element;
    private isDragged: boolean = false;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, onChange?: ChangeFunction, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction) {
        super(paper, paperRect);
        this.x = regionData.x;
        this.y = regionData.y;
        this.boundRect = regionData.boundRect;

        if (onChange !== undefined) {
            this.onChange = onChange;
        }

        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = onManipulationBegin;
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = onManipulationEnd;
        }

        this.buildOn(paper);
        this.subscribeToDragEvents();
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("dragLayer");

        this.dragRect = paper.rect(this.x, this.y, this.width, this.height);
        this.dragRect.addClass("dragRectStyle");

        this.node.add(this.dragRect);
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any) {
        super.move(arg1, arg2);
        window.requestAnimationFrame(() => {
            this.dragRect.attr({
                x: this.x,
                y: this.y
            });
        });
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        window.requestAnimationFrame(() => {
            this.dragRect.attr({
                width: width,
                height: height
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
            //this.move(p);            
            this.onChange(this, p.x, p.y, this.boundRect.width, this.boundRect.height, [new Point2D(p.x, p.y)], ChangeEventType.MOVING);
        }
    };

    private rectDragEnd() {
        this.dragOrigin = null;
        this.onChange(this, this.x, this.y, this.boundRect.width, this.boundRect.height, [new Point2D(this.x, this.y)], ChangeEventType.MOVEEND);
    }

    private subscribeToDragEvents() {
        this.dragRect.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.dragRect.undrag();
                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;
                this.onManipulationBegin();
            }
        });

        this.dragRect.node.addEventListener("pointermove", (e) => {
            if (!this.isDragged && !this.isFrozen) {
                this.dragRect.undrag();
                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;

                this.onManipulationBegin();
            }
        });

        this.dragRect.node.addEventListener("pointerleave", (e) => {
            this.dragRect.undrag();
            this.isDragged = false;
            this.onManipulationEnd();
        });

        this.dragRect.node.addEventListener("pointerdown", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.setPointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this, this.x, this.y, this.boundRect.width, this.boundRect.height, [new Point2D(this.x, this.y)], ChangeEventType.MOVEBEGIN, multiselection);
            }
        });

        this.dragRect.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.releasePointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this, this.x, this.y, this.boundRect.width, this.boundRect.height, [new Point2D(this.x, this.y)], ChangeEventType.SELECTIONTOGGLE, multiselection);
            }
        });
    }

    public freeze() {
        super.freeze();
        this.dragRect.undrag();
        this.onManipulationEnd();
    }
}