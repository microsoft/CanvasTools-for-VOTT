import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IFreezable } from "../../Interface/IFreezable";
import { IHideable } from "../../Interface/IHideadble";
import { IMovable } from "../../Interface/IMovable";
import { IResizable } from "../../Interface/IResizable";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";

import { ChangeEventType, ChangeFunction, ManipulationFunction, RegionComponent } from "../RegionComponent";
import { DragElement } from "./DragElement";
import { TagsElement } from "./TagsElement";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;


export class PointRegion extends RegionComponent {
    // Region size
    public area: number;
    // Region data
    public tags: TagsDescriptor;
    // Region ID
    public ID: string;
    public regionID: string

    // Region components
    private dragNode: DragElement;
    private tagsNode: TagsElement;
    private toolTip: Snap.Fragment;
    private UI: Array<RegionComponent>;

    // Region styles
    private styleID: string;
    private styleSheet: CSSStyleSheet = null;

    // Styling options
    private tagsUpdateOptions: ITagsUpdateOptions;    

    constructor(paper: Snap.Paper, paperRect: Rect = null, point: Point2D, id: string, tagsDescriptor: TagsDescriptor, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = new Rect(0, 0);

        this.x = point.x;
        this.y = point.y;
        this.area = 1.0;
        this.ID = id;
        this.tags = tagsDescriptor;

        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = () => {
                onManipulationBegin(this);
            }
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = () => {
                onManipulationEnd(this);
            };
        }

        this.regionID = this.s8();
        this.styleID = `region_${this.regionID}_style`;
        this.styleSheet = this.insertStyleSheet();
        this.tagsUpdateOptions = tagsUpdateOptions;

        this.buildOn(paper);
        this.move(point);
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);

        this.dragNode = new DragElement(paper, this.paperRect, this.x, this.y, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
        this.tagsNode = new TagsElement(paper,this.paperRect,  this.x, this.y, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(<any>this.toolTip);

        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);

        this.UI = new Array<RegionComponent>(this.tagsNode, this.dragNode);
    }

    // Helper function to generate random id;
    private s8() {
        return Math.floor((1 + Math.random()) * 0x100000000)
            .toString(16)
            .substring(1);
    }

    // Helper function to insert a new stylesheet into the document
    private insertStyleSheet(): CSSStyleSheet {
        var style = document.createElement("style");
        style.setAttribute("id", this.styleID);
        document.head.appendChild(style);
        return style.sheet as CSSStyleSheet;
    }

    public removeStyles() {
        document.getElementById(this.styleID).remove();
    }

    private onInternalChange(component: RegionComponent, x: number, y: number, width: number, height: number, points: Array<Point2D>, state: ChangeEventType, multiSelection: boolean = false) {
        if (this.x != x || this.y != y) {
            this.move(new Point2D(x, y));
        }
        if (this.boundRect.width != width || this.boundRect.height != height) {
            this.resize(width, height);
        }
        this.onChange(this, x, y, width, height, points, state, multiSelection);
    }

    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        this.tagsNode.updateTags(tags, options);

        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any) {
        super.move(arg1, arg2);

        this.UI.forEach((element) => {
            element.move(arg1, arg2);
        });
    }

    public resize(width: number, height: number) {
        // do nothing
    }

    public freeze() {
        super.freeze();
        this.node.addClass('old');
        this.dragNode.freeze();
    }

    public unfreeze() {
        super.unfreeze();
        this.node.removeClass('old');
        this.dragNode.unfreeze();
    }
}
