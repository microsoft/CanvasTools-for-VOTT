import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";

import { RegionComponent } from "./RegionComponent";

/* import * as SNAPSVG_TYPE from "snapsvg";

declare var Snap: typeof SNAPSVG_TYPE; */

/*
 * TagsElement
 * Used internally to draw labels and map colors for the region
*/
export abstract class TagsComponent extends RegionComponent {
    // Tags
    public tags: TagsDescriptor;

    // Elements
    protected primaryTagNode: Snap.Element;

    protected secondaryTagsNode: Snap.Element;
    protected secondaryTags: Snap.Element[];

    // Styling
    protected styleId: string;
    protected styleSheet: CSSStyleSheet = null;
    protected tagsUpdateOptions: ITagsUpdateOptions;

    // Style rules
    protected styleMap: Array<{ rule: string, style: string }> = [];
    protected styleLightMap: Array<{ rule: string, style: string }> = [];

    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, tags: TagsDescriptor,
                styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect, regionData, null);

        this.styleId = styleId;
        this.styleSheet = styleSheet;

        this.tags = tags;
        this.tagsUpdateOptions = tagsUpdateOptions;

        this.node = paper.g();
        this.node.addClass("tagsLayer");
    }

    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        this.tags = tags;
        this.tagsUpdateOptions = options;

        this.rebuildTagLabels();
        this.clearStyleMaps();
        this.initStyleMaps(tags);

        const showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyStyleMaps(showBackground);
    }

    protected initStyleMaps(tags: TagsDescriptor) {
        // do nothing
    }

    protected rebuildTagLabels() {
        // do nothing
    }

    protected clearStyleMaps() {
        while (this.styleSheet.cssRules.length > 0) {
            this.styleSheet.deleteRule(0);
        }
    }

    // Map colors to region
    protected applyStyleMaps(showRegionBackground: boolean = true) {
        // Map primary tag color
        if (this.tags && this.tags.primary !== undefined) {
            window.requestAnimationFrame(() => {
                const sm = (showRegionBackground ? this.styleMap : this.styleLightMap);
                for (const r of sm) {
                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                }
            });
        }
    }
}
