import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IFreezable } from "../../Interface/IFreezable";
import { IHideable } from "../../Interface/IHideadble";
import { IMovable } from "../../Interface/IMovable";
import { IResizable } from "../../Interface/IResizable";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";

import { ChangeEventType, ChangeFunction, ManipulationFunction, RegionComponent } from "../RegionComponent";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

/*
 * TagsElement
 * Used internally to draw labels and map colors for the region
*/
export class TagsElement extends RegionComponent {
    // Tags
    public tags: TagsDescriptor;

    // Region size
    private textBox: Snap.BBox;

    // Elements
    private primaryTagRect: Snap.Element;
    private primaryTagText: Snap.Element;
    private primaryTagTextBG: Snap.Element;

    private secondaryTagsGroup: Snap.Element;
    private secondaryTags: Snap.Element[];

    // Styling
    private styleId: string;
    private styleSheet: CSSStyleSheet = null;
    private tagsUpdateOptions: ITagsUpdateOptions;

    constructor(paper: Snap.Paper, paperRect: Rect, x: number, y: number, rect: Rect,
                tags: TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet,
                tagsUpdateOptions?: ITagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = rect;
        this.x = x;
        this.y = y;

        this.styleId = styleId;
        this.styleSheet = styleSheet;

        this.tagsUpdateOptions = tagsUpdateOptions;

        this.buildOn(paper, tags);
    }

    public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
        let keepPrimaryText = false; // redraw by default
        if (this.tags && this.tags.primary && tags && tags.primary) {
            keepPrimaryText = (tags.primary.name === this.tags.primary.name);
        }

        this.tags = tags;

        this.redrawTagLabels(keepPrimaryText);
        this.clearColors();

        const showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyColors(showBackground);
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any) {
        super.move(arg1, arg2);

        const size = 6;
        const cx = this.x + 0.5 * this.boundRect.width;
        const cy = this.y - size - 5;

        window.requestAnimationFrame(() => {
            this.primaryTagRect.attr({
                x: this.x,
                y: this.y,
            });
            this.primaryTagText.attr({
                x: this.x + 5,
                y: this.y + this.textBox.height,
            });
            this.primaryTagTextBG.attr({
                x: this.x + 1,
                y: this.y + 1,
            });

            // Secondary Tags
            if (this.secondaryTags && this.secondaryTags.length > 0) {
                const length = this.secondaryTags.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.secondaryTags[i];
                    const x = cx + (2 * i - length + 0.5) * size;

                    stag.attr({
                        x,
                        y: cy,
                    });
                }
            }
        });
    }

    public resize(width: number, height: number) {
        super.resize(width, height);

        window.requestAnimationFrame(() => {
            this.primaryTagRect.attr({
                height,
                width,
            });
        });

        this.redrawTagLabels();
    }

    private buildOn(paper: Snap.Paper, tags: TagsDescriptor) {
        this.node = paper.g();
        this.node.addClass("tagsLayer");

        this.primaryTagRect = paper.rect(0, 0, this.boundRect.width, this.boundRect.height);
        this.primaryTagRect.addClass("primaryTagRectStyle");

        this.primaryTagText = paper.text(0, 0, "");
        this.primaryTagText.addClass("primaryTagTextStyle");
        this.textBox = this.primaryTagText.getBBox();

        // bound to region???
        this.primaryTagTextBG = paper.rect(0, 0, 0, 0);
        this.primaryTagTextBG.addClass("primaryTagTextBGStyle");

        this.secondaryTagsGroup = paper.g();
        this.secondaryTagsGroup.addClass("secondatyTagsLayer");
        this.secondaryTags = [];

        this.node.add(this.primaryTagRect);
        this.node.add(this.primaryTagTextBG);
        this.node.add(this.primaryTagText);
        this.node.add(this.secondaryTagsGroup);

        this.updateTags(tags, this.tagsUpdateOptions);
    }

    private redrawTagLabels(keepPrimaryText: boolean = true) {
        // Clear secondary tags -> redraw from scratch
        this.secondaryTags.forEach((tag) => {
            tag.remove();
        });

        this.secondaryTags = [];
        // If there are tags assigned
        if (this.tags) {
            if (this.tags.primary !== undefined) {
                // Primary Tag
                if (!keepPrimaryText || this.textBox === undefined) {
                    this.primaryTagText.node.innerHTML = this.tags.primary.name;
                    this.textBox = this.primaryTagText.getBBox();
                }

                const showTextLabel = (this.textBox.width + 10 <= this.boundRect.width)
                                    && (this.textBox.height <= this.boundRect.height);
                if (showTextLabel) {

                    window.requestAnimationFrame(() => {
                        this.primaryTagTextBG.attr({
                            height: this.textBox.height + 5,
                            width: this.textBox.width + 10,
                        });
                        this.primaryTagText.attr({
                            visibility: "visible",
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                        });
                    });

                } else {
                    window.requestAnimationFrame(() => {
                        this.primaryTagTextBG.attr({
                            height: Math.min(10, this.boundRect.height),
                            width: Math.min(10, this.boundRect.width),
                        });
                        this.primaryTagText.attr({
                            visibility: "hidden",
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                        });
                    });
                }
            }
            // Secondary Tags
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                const length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.tags.secondary[i];

                    /* let r = 3;
                    let x = this.x + this.rect.width / 2 + (2 * i - length + 1) * 2 * r;
                    let y = this.y - r - 5;

                    let tagel = this.paper.circle(x, y, r);    */

                    const s = 6;
                    const x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                    const y = this.y - s - 5;
                    const tagel = this.paper.rect(x, y, s, s);

                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });

                    this.secondaryTagsGroup.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
            // Clear primary tag label
        } else {
            window.requestAnimationFrame(() => {
                this.primaryTagText.node.innerHTML = "";
                this.primaryTagTextBG.attr({
                    height: 0,
                    width: 0,
                });
            });
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
            const styleMap = [
                {
                    rule: `.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorShadow};
                                stroke:${this.tags.primary.colorAccent};`,
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke: #fff;`,
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                    style: `fill:${this.tags.primary.colorAccent};`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle`,
                    style: `stroke:${this.tags.primary.colorDark};
                                fill: ${this.tags.primary.colorPure}`,
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                    style: `stroke:#fff;`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                    style: `fill:transparent;`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                    style: `fill:rgba(255,255,255,0.5);`,
                },
            ];

            const styleMapLight = [
                {
                    rule: `.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorNoColor};
                                stroke:${this.tags.primary.colorAccent};`,
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke: #fff;`,
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                    style: `fill:${this.tags.primary.colorShadow};`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextStyle`,
                    style: `opacity:0.25;`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                    style: `opacity:0.25;`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle`,
                    style: `stroke:${this.tags.primary.colorDark};
                                fill: ${this.tags.primary.colorPure}`,
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                    style: `stroke:#fff;`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                    style: `fill:transparent;`,
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                    style: `fill:rgba(255,255,255,0.5);`,
                },
            ];

            window.requestAnimationFrame(() => {
                const sm = (showRegionBackground ? styleMap : styleMapLight);

                sm.forEach((r) => {
                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                });

                if (this.tags && this.tags.secondary.length > 0) {
                    this.tags.secondary.forEach((tag) => {
                        const rule = `.secondaryTagStyle.secondaryTag-${tag.name}{
                            fill: ${tag.colorAccent};
                        }`;
                        this.styleSheet.insertRule(rule, 0);
                    });
                }
            });
        }
    }
}
