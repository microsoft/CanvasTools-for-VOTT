import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";

import { RegionComponent } from "./RegionComponent";

/**
 * An abstract visual component used internal do draw tags data for regions.
 */
export abstract class TagsComponent extends RegionComponent {
    /**
     * Computing the bounding box of a given svg text element is an expensive rendering call,
     * given tag styles don't change and there is a set number of primary tag names caching improves
     * re-render performance significantly. https://bugzilla.mozilla.org/show_bug.cgi?id=1579181
     * @param primaryTagNode a given tag node which the content string will be used to lookup in the cache
     */
    public static getCachedBBox(primaryTagNode: Snap.Element): Snap.BBox {
        const tagName = primaryTagNode.node.innerHTML;
        if (TagsComponent.bboxCache[tagName]) {
            return TagsComponent.bboxCache[tagName];
        }

        TagsComponent.bboxCache[tagName] = primaryTagNode.getBBox();
        return TagsComponent.bboxCache[tagName];
    }
    private static bboxCache: { [K: string]: Snap.BBox } = {};
    /**
     * The reference to region's `TagsDescriptor` object.
     */
    public tags: TagsDescriptor;

    /**
     * The grouping element for primary tag.
     */
    protected primaryTagNode: Snap.Element;

    /**
     * The grouping element for secondary tags.
     */
    protected secondaryTagsNode: Snap.Element;

    /**
     * The array of secondary tags elements.
     */
    protected secondaryTags: Snap.Element[];

    /**
     * Unique css style id associated with the region.
     */
    protected styleId: string;

    /**
     * Reference to the stylesheet element.
     */
    protected styleSheet: CSSStyleSheet = null;

    /**
     * The settings for redrawing tags.
     */
    protected tagsUpdateOptions: ITagsUpdateOptions;

    /**
     * Default styling rules.
     */
    protected styleMap: Array<{ rule: string, style: string }> = [];

    /**
     * Light styling rules used when `showRegionBackground` is set to `false`.
     */
    protected styleLightMap: Array<{ rule: string, style: string }> = [];

    /**
     * Creates a new `TagsComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param tags - The `TagsDescriptor` object presenting colors and names for region tags.
     * @param styleId - The unique css style id for region.
     * @param styleSheet - The reference to the stylesheet object for rules insertion.
     * @param tagsUpdateOptions - The settings for redrawing tags.
     */
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

    /**
     * Updates component with new `TagsDescriptor` object and new drawing settings.
     * @param tags - The new `TagsDescriptor` object.
     * @param options - The new drawing settings.
     */
    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        this.tags = tags;
        this.tagsUpdateOptions = options;

        this.rebuildTagLabels();
        this.clearStyleMaps();
        this.initStyleMaps(tags);

        const showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyStyleMaps(showBackground);
        const showTagsText = (options !== undefined) ? options.showTagsText : true;
        this.applyStyleForTagsVisibility(showTagsText);
    }

    /**
     * Inits the styling rules for the component. Should be redefined in child classes.
     * @param tags -- The `TagsDescriptor` object to define new styles.
     */
    protected abstract initStyleMaps(tags: TagsDescriptor);

    /**
     * Rebuilds the tags elements. Should be redefined in child classes.
     */
    protected abstract rebuildTagLabels();

    /**
     * Clears current styling rules.
     */
    protected clearStyleMaps() {
        while (this.styleSheet.cssRules.length > 0) {
            this.styleSheet.deleteRule(0);
        }
    }

    /**
     * Inserts the styling rules into the `styleSheet` object.
     * @param showRegionBackground - The flag to make background visible or transparent.
     */
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

    /**
     * Inserts the tags text visibility styling rule into the `styleSheet` object.
     * @param showTagsText - The flag to display tags text or not.
     */
     protected applyStyleForTagsVisibility(showTagsText: boolean = true) {
        if (this.tags && this.tags.primary !== undefined) {
            const visibility = showTagsText ? "block" : "none";
            const sm = [
                {
                    rule: `.${this.styleId} .primaryTagTextBGStyle`,
                    style: `display: ${visibility};`,
                },
                {
                    rule: `.${this.styleId} .primaryTagTextStyle`,
                    style: `display: ${visibility};`,
                },
            ];
            window.requestAnimationFrame(() => {
                for (const r of sm) {
                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                }
            });
        }
    }
}
