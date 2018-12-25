import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";

import { TagsComponent } from "../Component/TagsComponent";

import * as SNAPSVG_TYPE from "snapsvg";

declare var Snap: typeof SNAPSVG_TYPE;

/*
 * TagsElement 
 * Used internally to draw labels and map colors for the region
*/
export class TagsElement extends TagsComponent {
    public static DEFAULT_PRIMARY_TAG_RADIUS: number = 3;
    public static DEFAULT_SECONDARY_TAG_SIZE: number = 6;
    public static DEFAULT_SECONDARY_TAG_DY: number = 6;

    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, tags: TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);

        this.buildOn(paper, tags);
    }

    private buildOn(paper: Snap.Paper, tags: TagsDescriptor) {
        this.primaryTagNode = paper.circle(this.x, this.y, TagsElement.DEFAULT_PRIMARY_TAG_RADIUS);
        this.primaryTagNode.addClass("primaryTagPointStyle");

        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondatyTagsLayer");
        this.secondaryTags = [];

        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);

        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }

    protected initStyleMaps(tags: TagsDescriptor) {
        if (tags !== null) {
            this.styleMap = [
                {
                    rule: `.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                    style: `fill: ${tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${tags.primary.colorAccent};
                                stroke:${tags.primary.colorHighlight};`
                }
            ];
    
            this.styleLightMap = [
                {
                    rule: `.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${tags.primary.colorNoColor};
                                stroke:${tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                    style: `fill: ${tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${tags.primary.colorHighlight};
                                stroke:${tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                    style: `opacity:0.25;`
                }
            ];

            if (tags.secondary !== null && tags.secondary !== undefined) {
                tags.secondary.forEach((tag) => {
                    let rule = {
                        rule: `.secondaryTagStyle.secondaryTag-${tag.name}`,
                        style: `fill: ${tag.colorAccent};`
                    }
        
                    this.styleMap.push(rule);
                    this.styleLightMap.push(rule);
                })
            }
        }       
    }

    protected rebuildTagLabels() {
        // Clear secondary tags -> redraw from scratch
        for (let i = 0; i < this.secondaryTags.length; i++) {
            this.secondaryTags[i].remove();
        }
        this.secondaryTags = [];
        // If there are tags assigned
        if (this.tags) {
            if (this.tags.primary !== undefined) {
                // Primary Tag

            }
            // Secondary Tags
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                let length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    let stag = this.tags.secondary[i];

                    let size = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
                    let x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * size - size / 2;
                    let y = this.y - size - TagsElement.DEFAULT_SECONDARY_TAG_DY;
                    let tagel = this.paper.rect(x, y, size, size);

                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });

                    this.secondaryTagsNode.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
        }
    }

    public redraw() {
        let size = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;;
        let cx = this.x;
        let cy = this.y - size - TagsElement.DEFAULT_SECONDARY_TAG_DY;

        window.requestAnimationFrame(() => {
            this.primaryTagNode.attr({
                cx: this.x,
                cy: this.y
            });

            // Secondary Tags
            if (this.secondaryTags && this.secondaryTags.length > 0) {
                let length = this.secondaryTags.length;
                for (let i = 0; i < length; i++) {
                    let stag = this.secondaryTags[i];
                    let x = cx + (2 * i - length + 0.5) * size;

                    stag.attr({
                        x: x,
                        y: cy
                    });
                }
            }
        });
    }
}
