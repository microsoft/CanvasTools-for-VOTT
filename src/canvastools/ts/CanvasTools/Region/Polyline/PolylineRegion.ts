import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";
import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { RegionComponent } from "../Component/RegionComponent";
import { Region } from "../Region";
import { AnchorsElement } from "./AnchorsElement";
import { DragElement } from "./DragElement";
import { TagsElement } from "./TagsElement";

/**
 * The polyline-type region class.
 */
export class PolylineRegion extends Region {
    /**
     * Reference to the internal AnchorsElement.
     */
    private anchorNode: AnchorsElement;

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
     * Creates new `PolylineRegion` object.
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

        if (paperRect !== null) {
            this.paperRects = {
                actual: new Rect(paperRect.width - regionData.width, paperRect.height - regionData.height),
                host: paperRect,
            };
        }

        this.buildOn(paper);
    }

    /**
     * The callback function fot internal components.
     * @param component - Reference to the UI component.
     * @param regionData - New RegionData object.
     * @param state - New state of the region.
     * @param multiSelection - Flag for multiselection.
     */
    public onChange(component: RegionComponent, regionData: RegionData, state: ChangeEventType,
                    multiSelection: boolean = false) {
        this.paperRects.actual.resize(this.paperRects.host.width - regionData.width,
                                      this.paperRects.host.height - regionData.height);

        super.onChange(component, regionData, state, multiSelection);
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

        const callbacks = {
            onChange: this.onChange.bind(this),
            onManipulationBegin: this.onManipulationBegin.bind(this),
            onManipulationEnd: this.onManipulationEnd.bind(this),
        };

        this.dragNode = new DragElement(paper, this.paperRects.actual, this.regionData, callbacks);
        this.tagsNode = new TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID,
                                        this.styleSheet, this.tagsUpdateOptions);
        this.anchorNode = new AnchorsElement(paper, this.paperRect, this.regionData, callbacks);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip as any);

        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.node.add(this.anchorNode.node);

        this.UI.push(this.tagsNode, this.dragNode, this.anchorNode);
    }
}
