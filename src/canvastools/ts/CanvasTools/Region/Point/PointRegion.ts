import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { Region } from "../Region";
import { DragElement } from "./DragElement";
import { TagsElement } from "./TagsElement";

/**
 * The point-type region class.
 */
export class PointRegion extends Region {
    /**
     * Reference to the internal DragElement.
     */
    private dragNode: DragElement;

    /**
     * Reference to the internal TagsElement.
     */
    private tagsNode: TagsElement;

    /**
     * Reference to the tooltip element.
     */
    private toolTip: Snap.Fragment;

    /**
     * Creates new `PointRegion` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     * @param id - The region `id` used to identify regions in `RegionsManager`.
     * @param tagsDescriptor - The descriptor of region tags.
     * @param tagsUpdateOptions - The drawing options for tags.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks,
                id: string, tagsDescriptor: TagsDescriptor, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions);

        this.buildOn(paper);
    }

    /**
     * Updates region tags.
     * @param tags - The new tags descriptor object.
     * @param options - The tags drawing options.
     */
    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        super.updateTags(tags, options);

        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }

    /**
     * Creates the UI of the region component.
     * @param paper - The `Snap.Paper` element to draw on.
     */
    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);

        this.dragNode = new DragElement(paper, this.paperRect, this.regionData, this.callbacks);
        this.tagsNode = new TagsElement(paper, this.paperRect,  this.regionData, this.tags, this.styleID,
                                        this.styleSheet, this.tagsUpdateOptions);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip as any);

        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);

        this.UI.push(this.tagsNode, this.dragNode);
    }
}
