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

import * as SNAPSVG_TYPE from "snapsvg";

declare var Snap: typeof SNAPSVG_TYPE;

/*
 * TagsElement 
 * Used internally to draw labels and map colors for the region
*/
export class TagsElement extends RegionComponent {
    private radius: number = 3;

    // Elements
    private primaryTagPoint: Snap.Element;

    private secondaryTagsGroup: Snap.Element;
    private secondaryTags: Array<Snap.Element>;

    // Tags
    public tags: TagsDescriptor;

    // Styling
    private styleId: string;
    private styleSheet: CSSStyleSheet = null;
    private tagsUpdateOptions: ITagsUpdateOptions;

    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, tags: TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect, regionData, null);

        this.styleId = styleId;
        this.styleSheet = styleSheet;

        this.tagsUpdateOptions = tagsUpdateOptions;

        this.buildOn(paper, tags);
    }

    private buildOn(paper: Snap.Paper, tags: TagsDescriptor) {
        this.node = paper.g();
        this.node.addClass("tagsLayer");

        this.primaryTagPoint = paper.circle(this.x, this.y, this.radius);
        this.primaryTagPoint.addClass("primaryTagPointStyle");

        this.secondaryTagsGroup = paper.g();
        this.secondaryTagsGroup.addClass("secondatyTagsLayer");
        this.secondaryTags = [];

        this.node.add(this.primaryTagPoint);
        this.node.add(this.secondaryTagsGroup);

        this.updateTags(tags, this.tagsUpdateOptions);
    }

    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        this.tags = tags;

        this.redrawTagLabels();
        this.clearColors();

        let showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyColors(showBackground);
    }

    private redrawTagLabels() {
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

                    let s = 6;
                    let x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                    let y = this.y - s - 5;
                    let tagel = this.paper.rect(x, y, s, s);

                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });

                    this.secondaryTagsGroup.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
        }
    }

    private clearColors() {
        while (this.styleSheet.cssRules.length > 0) {
            this.styleSheet.deleteRule(0);
        }
    }

    // Map colors to region
    private applyColors(showRegionBackground: boolean = true) {
        // Map primary tag color
        if (this.tags && this.tags.primary !== undefined) {
            let styleMap = [
                {
                    rule: `.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorAccent};
                                stroke:${this.tags.primary.colorHighlight};`
                }
            ];

            let styleMapLight = [
                {
                    rule: `.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorNoColor};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                    style: `opacity:0.25;`
                }
            ];

            window.requestAnimationFrame(() => {
                let sm = (showRegionBackground ? styleMap : styleMapLight);
                for (let i = 0; i < sm.length; i++) {
                    let r = sm[i];
                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                }

                if (this.tags && this.tags.secondary.length > 0) {
                    for (let i = 0; i < this.tags.secondary.length; i++) {
                        let tag = this.tags.secondary[i];
                        let rule = `.secondaryTagStyle.secondaryTag-${tag.name}{
                                fill: ${tag.colorAccent};
                            }`;
                        this.styleSheet.insertRule(rule, 0);
                    }
                }
            });
        }
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
        let size = 6;
        let cx = this.x;
        let cy = this.y - size - 5;

        window.requestAnimationFrame(() => {
            this.primaryTagPoint.attr({
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
