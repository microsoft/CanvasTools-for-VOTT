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
import { AnchorsElement } from "./AnchorsElements";
import { DragElement } from "./DragElement";
import { TagsElement } from "./TagsElements";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export class RectRegion extends RegionComponent {
    // Region size
    public area: number;
    // Region data
    public tags: TagsDescriptor;
    // Region ID
    public ID: string;
    // Region styles
    public regionID: string;

    // Bound rects
    private paperRects: { host: Rect, actual: Rect };

    // Region components
    private dragNode: DragElement;
    private anchorsNode: AnchorsElement;
    private tagsNode: TagsElement;
    private toolTip: Snap.Fragment;
    private UI: RegionComponent[];

    private styleID: string;
    private styleSheet: CSSStyleSheet = null;

    // Styling options
    private tagsUpdateOptions: ITagsUpdateOptions;

    constructor(paper: Snap.Paper, paperRect: Rect = null, point: Point2D, rect: Rect, id: string,
                tagsDescriptor: TagsDescriptor, onManipulationBegin?: ManipulationFunction,
                onManipulationEnd?: ManipulationFunction, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = rect;

        this.x = point.x;
        this.y = point.y;
        this.ID = id;
        this.tags = tagsDescriptor;

        if (paperRect !== null) {
            this.paperRects = {
                actual: new Rect(paperRect.width - rect.width, paperRect.height - rect.height),
                host: paperRect,
            };
        }

        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = () => {
                onManipulationBegin(this);
            };
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

    public removeStyles() {
        document.getElementById(this.styleID).remove();
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
        super.resize(width, height);
        this.area = width * height;

        this.paperRects.actual.resize(this.paperRects.host.width - width, this.paperRects.host.height - height);

        this.UI.forEach((element) => {
            element.resize(width, height);
        });
    }

    public freeze() {
        super.freeze();

        this.node.addClass("old");
        this.dragNode.freeze();
        this.anchorsNode.freeze();
    }

    public unfreeze() {
        super.unfreeze();

        this.node.removeClass("old");
        this.dragNode.unfreeze();
        this.anchorsNode.unfreeze();
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);

        this.anchorsNode = new AnchorsElement(paper, this.paperRects.host, this.x, this.y, this.boundRect,
                                              this.onInternalChange.bind(this), this.onManipulationBegin,
                                              this.onManipulationEnd);
        this.dragNode = new DragElement(paper, this.paperRects.actual, this.x, this.y, this.boundRect,
                                        this.onInternalChange.bind(this), this.onManipulationBegin,
                                        this.onManipulationEnd);
        this.tagsNode = new TagsElement(paper, this.paperRects.host, this.x, this.y, this.boundRect,
                                        this.tags, this.styleID, this.styleSheet,
                                        this.tagsUpdateOptions);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip as any);

        this.node.add(this.tagsNode.node);
        this.node.add(this.dragNode.node);
        this.node.add(this.anchorsNode.node);

        this.UI = new Array<RegionComponent>(this.tagsNode, this.dragNode, this.anchorsNode);
    }

    // Helper function to generate random id;
    private s8() {
        return Math.floor((1 + Math.random()) * 0x100000000)
            .toString(16)
            .substring(1);
    }

    // Helper function to insert a new stylesheet into the document
    private insertStyleSheet(): CSSStyleSheet {
        const style = document.createElement("style");
        style.setAttribute("id", this.styleID);
        document.head.appendChild(style);
        return style.sheet as CSSStyleSheet;
    }

    private onInternalChange(component: RegionComponent, x: number, y: number, width: number, height: number,
                             points: Point2D[], state: ChangeEventType, multiSelection: boolean = false) {
        if (this.x !== x || this.y !== y) {
            this.move(new Point2D(x, y));
        }
        if (this.boundRect.width !== width || this.boundRect.height !== height) {
            this.resize(width, height);
        }
        this.onChange(this, x, y, width, height, points.concat([new Point2D(x + width, y + height)]),
                      state, multiSelection);
    }
}
