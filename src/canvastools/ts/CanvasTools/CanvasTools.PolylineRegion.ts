import { IRect } from "./Interface/IRect";
import { IPoint2D } from "./Interface/IPoint2D";
import { Point2D } from "./Core/CanvasTools.Point2D";
import { Rect } from "./Core/CanvasTools.Rect";
import { EventDescriptor } from "./Core/CanvasTools.EventDescriptor";
import { RegionComponent, ManipulationFunction, ChangeFunction, ChangeEventType } from "./CanvasTools.RegionComponent";
import { TagsDescriptor } from "./Core/CanvasTools.Tags";
import { TagsUpdateOptions } from "./CanvasTools.TagsUpdateOptions";
import * as Snap from "snapsvg";

/*
 * TagsElement 
 * Used internally to draw labels and map colors for the region
*/
class TagsElement extends RegionComponent {
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
    private tagsUpdateOptions: TagsUpdateOptions;

    constructor(paper: Snap.Paper, x: number, y: number, paperRect: IRect, tags: TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: TagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = new Rect(0, 0);
        this.x = x;
        this.y = y;

        this.styleId = styleId;
        this.styleSheet = styleSheet;

        this.tagsUpdateOptions = tagsUpdateOptions;

        this.buildOn(paper, tags);
    }

    private buildOn(paper: Snap.Paper, tags: TagsDescriptor) {
        this.node = paper.g();
        this.node.addClass("tagsLayer");

        this.primaryTagPoint = paper.circle(0, 0, this.radius);
        this.primaryTagPoint.addClass("primaryTagPointStyle");

        this.secondaryTagsGroup = paper.g();
        this.secondaryTagsGroup.addClass("secondatyTagsLayer");
        this.secondaryTags = [];

        this.node.add(this.primaryTagPoint);
        this.node.add(this.secondaryTagsGroup);

        this.updateTags(tags, this.tagsUpdateOptions);
    }

    public updateTags(tags: TagsDescriptor, options?: TagsUpdateOptions) {
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

    public move(p: IPoint2D) {
        super.move(p);

        let size = 6;
        let cx = this.x;
        let cy = this.y - size - 5;

        window.requestAnimationFrame(() => {
            this.primaryTagPoint.attr({
                cx: p.x,
                cy: p.y
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

    public resize(width: number, height: number) {
        // do nothing
    }
}

/*
 * DragElement 
 * Used internally to drag the region
*/
class DragElement extends RegionComponent {
    private dragPoint: Snap.Element;
    private isDragged: boolean = false;

    private radius: number = 7;

    // Change Notifier
    private onChange: ChangeFunction;

    constructor(paper: Snap.Paper, x: number, y: number, paperRect: IRect = null, onChange?: ChangeFunction, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction) {
        super(paper, paperRect);
        this.x = x;
        this.y = y;
        this.boundRect = new Rect(0, 0);

        if (onChange !== undefined) {
            this.onChange = onChange;
        }

        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = onManipulationBegin;
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = onManipulationEnd;
        }

        this.buildOn(paper);
        this.subscribeToDragEvents();
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("dragLayer");

        this.dragPoint = paper.circle(0, 0, this.radius);
        this.dragPoint.addClass("dragPointStyle");

        this.node.add(this.dragPoint);
    }

    public move(p: IPoint2D) {
        super.move(p);
        window.requestAnimationFrame(() => {
            this.dragPoint.attr({
                cx: p.x,
                cy: p.y
            });
        });
    }

    public resize(width: number, height: number) {
        // do nothing
    }

    private dragOrigin: Point2D;

    private rectDragBegin() {
        this.dragOrigin = new Point2D(this.x, this.y);
    }

    private rectDragMove(dx: number, dy: number) {
        if (dx != 0 && dy != 0) {
            let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

            if (this.paperRect !== null) {
                p = p.boundToRect(this.paperRect);
            }
            //this.move(p);            
            this.onChange(p.x, p.y, this.boundRect.width, this.boundRect.height, ChangeEventType.MOVING);
        }
    };

    private rectDragEnd() {
        this.dragOrigin = null;
        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, ChangeEventType.MOVEEND);
    }

    private subscribeToDragEvents() {
        this.dragPoint.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.undrag();
                this.dragPoint.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;
                this.onManipulationBegin();
            }
        });

        this.dragPoint.node.addEventListener("pointermove", (e) => {
            if (!this.isDragged && !this.isFrozen) {
                this.dragPoint.undrag();
                this.dragPoint.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;

                this.onManipulationBegin();
            }
        });

        this.dragPoint.node.addEventListener("pointerleave", (e) => {
            this.dragPoint.undrag();
            this.isDragged = false;
            this.onManipulationEnd();
        });

        this.dragPoint.node.addEventListener("pointerdown", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.node.setPointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, ChangeEventType.MOVEBEGIN, multiselection);
            }
        });

        this.dragPoint.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragPoint.node.releasePointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, ChangeEventType.SELECTIONTOGGLE, multiselection);
            }
        });
    }

    public freeze() {
        super.freeze();
        this.dragPoint.undrag();
        this.onManipulationEnd();
    }
}

export class PolylineRegion extends RegionComponent {
    // Region size
    public area: number;

    // Region components
    public node: Snap.Element;
    private dragNode: DragElement;
    private tagsNode: TagsElement;
    private toolTip: Snap.Fragment;
    private UI: Array<RegionComponent>;

    // Region data
    public tags: TagsDescriptor;

    // Region ID
    public ID: string;
    // Region styles
    public regionID: string
    private styleID: string;
    private styleSheet: CSSStyleSheet = null;

    // Manipulation notifiers
    public isSelected: boolean = false;

    // Styling options
    private tagsUpdateOptions: TagsUpdateOptions;
    public onChange: Function;

    constructor(paper: Snap.Paper, paperRect: IRect = null, points: Array<Point2D>, id: string, tagsDescriptor: TagsDescriptor, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction, tagsUpdateOptions?: TagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = new Rect(0, 0);

        this.x = points[0].x;
        this.y = points[0].y;
        this.area = 1.0;
        this.ID = id;
        this.tags = tagsDescriptor;

        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = () => {
                onManipulationBegin(this);
            }
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = () => {
                onManipulationEnd(this);
            };
        }

        this.regionID = this.s8();
        this.styleID = `region_${this.regionID}_style`;
        this.styleSheet = this.insertStyleSheet();
        this.tagsUpdateOptions = tagsUpdateOptions;

        this.buildOn(paper);
        this.move(points[0]);
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);

        this.dragNode = new DragElement(paper, this.x, this.y, this.paperRect, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
        this.tagsNode = new TagsElement(paper, this.x, this.y, this.paperRect, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(<any>this.toolTip);

        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);

        this.UI = new Array<RegionComponent>(this.tagsNode, this.dragNode);
    }

    // Helper function to generate random id;
    private s8() {
        return Math.floor((1 + Math.random()) * 0x100000000)
            .toString(16)
            .substring(1);
    }

    // Helper function to insert a new stylesheet into the document
    private insertStyleSheet(): CSSStyleSheet {
        var style = document.createElement("style");
        style.setAttribute("id", this.styleID);
        document.head.appendChild(style);
        return style.sheet as CSSStyleSheet;
    }

    public removeStyles() {
        document.getElementById(this.styleID).remove();
    }

    private onInternalChange(x: number, y: number, width: number, height: number, state: string, multiSelection: boolean = false) {
        if (this.x != x || this.y != y) {
            this.move(new Point2D(x, y));
        }
        if (this.boundRect.width != width || this.boundRect.height != height) {
            this.resize(width, height);
        }
        this.onChange(this, state, multiSelection);
    }

    public updateTags(tags: TagsDescriptor, options?: TagsUpdateOptions) {
        this.tagsNode.updateTags(tags, options);

        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }

    public move(p: IPoint2D) {
        super.move(p);

        this.UI.forEach((element) => {
            element.move(p);
        });
    }

    public resize(width: number, height: number) {
        // do nothing
    }



    public select() {
        this.isSelected = true;
        this.node.addClass("selected");

        /*             if (this.onChange != undefined) {
                        this.onChange(this, this.isSelected);
                    } */
    }

    public unselect() {
        this.isSelected = false;
        this.node.removeClass("selected");

        /*             if (this.onChange != undefined) {
                        this.onChange(this, this.isSelected);
                    } */
    }

    public freeze() {
        if (!this.isFrozen) {
            this.isFrozen = true;
            this.node.addClass('old');
            this.dragNode.freeze();
        }
    }

    public unfreeze() {
        if (this.isFrozen) {
            this.isFrozen = false;
            this.node.removeClass('old');
            this.dragNode.unfreeze();
        }
    }
}