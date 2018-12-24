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
import { AnchorsElement } from "./AnchorsElements";
import { DragElement } from "./DragElement";
import { TagsElement } from "./TagsElement";

import * as SNAPSVG_TYPE from "snapsvg";

declare var Snap: typeof SNAPSVG_TYPE;

export class PolylineRegion extends Region {
    private anchorNode: AnchorsElement;
    private dragNode: DragElement;
    private tagsNode: TagsElement;
    private toolTip: Snap.Fragment;

    // Bound rects
    private paperRects: { host: Rect, actual: Rect };

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData:RegionData, id: string, tagsDescriptor: TagsDescriptor, callbacks: IRegionCallbacks, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions);

        if (paperRect !== null) {
            this.paperRects = {
                actual: new Rect(paperRect.width - regionData.width, paperRect.height - regionData.height),
                host: paperRect,
            };
        }
        
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

        this.dragNode = new DragElement(paper, this.paperRects.actual, this.regionData, callbacks);
        this.tagsNode = new TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.anchorNode = new AnchorsElement(paper, this.paperRect, this.regionData, callbacks);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(<any>this.toolTip);

        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.node.add(this.anchorNode.node);

        this.UI.push(this.tagsNode, this.dragNode, this.anchorNode);
    }

    public onChange(component: RegionComponent, regionData: RegionData, state: ChangeEventType, multiSelection: boolean = false) {
        this.paperRects.actual.resize(this.paperRects.host.width - regionData.width, this.paperRects.host.height - regionData.height);

        super.onChange(component, regionData, state, multiSelection);
    }

    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        super.updateTags(tags, options);
        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }

    public resize(width: number, height: number) {
        this.paperRects.actual.resize(this.paperRects.host.width - width, this.paperRects.host.height - height);
        super.resize(width, height);
    }
}