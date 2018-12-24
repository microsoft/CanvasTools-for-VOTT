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
import { Region } from "../Region";
import { DragElement } from "./DragElement";
import { TagsElement } from "./TagsElement";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;


export class PointRegion extends Region {
    // Region components
    private dragNode: DragElement;
    private tagsNode: TagsElement;
    private toolTip: Snap.Fragment;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, id: string, tagsDescriptor: TagsDescriptor, callbacks: IRegionCallbacks, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions);

        this.buildOn(paper);
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);

        const callbacks = {
            onChange: this.onChange.bind(this),
            onManipulationBegin: this.onManipulationBegin.bind(this),
            onManipulationEnd: this.onManipulationEnd.bind(this)
        };

        this.dragNode = new DragElement(paper, this.paperRect, this.regionData, callbacks);
        this.tagsNode = new TagsElement(paper,this.paperRect,  this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(<any>this.toolTip);

        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);

        this.UI.push(this.tagsNode, this.dragNode);
    }

    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        super.updateTags(tags, options);

        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }
}
