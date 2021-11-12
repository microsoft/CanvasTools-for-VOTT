import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";
import { RegionComponent } from "../Component/RegionComponent";
import { Region } from "../Region";
import { AnchorsElement } from "./AnchorsElement";
import { DragElement } from "./DragElement";
import { MidpointElement } from "./MidpointElement";
import { TagsElement } from "./TagsElement";

/**
 * The polygon-type region class.
 */
export class PolygonRegion extends Region {
    /**
     * Reference to the internal AnchorsElement.
     */
    private anchorNode: AnchorsElement;
    
    /**
     * Reference to midpoint node
     */
    private midpointNode: MidpointElement; 
    
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
     * Bounding rects for the region.
     */
    private paperRects: { host: Rect, actual: Rect };

    /**
     * Creates new `PolygonRegion` object.
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
        super(paper, paperRect, regionData, Object.assign({}, callbacks), id, tagsDescriptor, tagsUpdateOptions);

        if (paperRect !== null) {
            this.paperRects = {
                actual: new Rect(paperRect.width - regionData.width, paperRect.height - regionData.height),
                host: paperRect,
            };
        }

        this.buildOn(paper);

        const onChange = this.callbacks.onChange;
        this.callbacks.onChange = (region: RegionComponent, regionData: RegionData, ...args) => {
            this.paperRects.actual.resize(this.paperRects.host.width - regionData.width,
                                          this.paperRects.host.height - regionData.height);
            onChange(this, regionData, ...args);
        };
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
     * Resizes the region to specified `width` and `height`.
     * @param width - The new region width.
     * @param height - The new region height.
     */
    public resize(width: number, height: number) {
        this.paperRects.actual.resize(this.paperRects.host.width - width, this.paperRects.host.height - height);
        super.resize(width, height);
    }

    /**
     * Creates the UI of the region component.
     * @param paper - The `Snap.Paper` element to draw on.
     */
    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);

        this.dragNode = new DragElement(paper, this.paperRects.actual, this.regionData, this.callbacks);
        this.tagsNode = new TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID,
                                        this.styleSheet, this.tagsUpdateOptions);
        this.anchorNode = new AnchorsElement(paper, this.paperRect, this.regionData, this.callbacks);
        this.midpointNode = new MidpointElement(paper, this.paperRect, this.regionData, this.callbacks);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip as any);

        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.node.add(this.anchorNode.node);
        this.node.add(this.midpointNode.node);

        this.UI.push(this.tagsNode, this.dragNode, this.anchorNode, this.midpointNode);
    }
}
