import { Rect } from "../Core/Rect";
import { RegionData } from "../Core/RegionData";
import { TagsDescriptor } from "../Core/TagsDescriptor";

import { IMovable } from "../Interface/IMovable";
import { ITagsUpdateOptions } from "../Interface/ITagsUpdateOptions";
import { ChangeEventType, IRegionCallbacks } from "../Interface/IRegionCallbacks";

import { RegionComponent } from "./Component/RegionComponent";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

export abstract class Region extends RegionComponent {
    // Region data
    public tags: TagsDescriptor;
    // Region ID
    public ID: string;
    public regionID: string;

    protected UI: RegionComponent[];
    // Region styles
    protected styleID: string;
    protected styleSheet: CSSStyleSheet = null;

    // Styling options
    protected tagsUpdateOptions: ITagsUpdateOptions;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks,
                id: string, tagsDescriptor: TagsDescriptor, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect, regionData, callbacks);

        this.ID = id;
        this.tags = tagsDescriptor;

        this.regionID = this.s8();
        this.styleID = `region_${this.regionID}_style`;
        this.styleSheet = this.insertStyleSheet();
        this.tagsUpdateOptions = tagsUpdateOptions;

        this.UI = [];
    }

    public removeStyles() {
        document.getElementById(this.styleID).remove();
    }

    public onChange(component: RegionComponent, regionData: RegionData, state: ChangeEventType,
                    multiSelection: boolean = false) {
        this.regionData.initFrom(regionData);
        this.redraw();
        super.onChange(this, this.regionData.copy(), state, multiSelection);
    }

    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        this.tags = tags;
        this.tagsUpdateOptions = options;
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
        super.redraw();

        this.UI.forEach((element) => {
            element.redraw();
        });
    }

    public freeze() {
        super.freeze();
        this.node.addClass("old");
        this.UI.forEach((element) => {
            element.freeze();
        });
    }

    public unfreeze() {
        super.unfreeze();
        this.node.removeClass("old");
        this.UI.forEach((element) => {
            element.unfreeze();
        });
    }

    // Helper function to generate random id;
    protected s8() {
        return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
    }

    // Helper function to insert a new stylesheet into the document
    private insertStyleSheet(): CSSStyleSheet {
        const style = document.createElement("style");
        style.setAttribute("id", this.styleID);
        document.head.appendChild(style);
        return style.sheet as CSSStyleSheet;
    }
}
