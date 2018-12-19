import { IMovable } from "./Interface/IMovable";
import { Point2D } from "./Core/CanvasTools.Point2D";
import { Rect } from "./Core/CanvasTools.Rect";
import { RegionComponent, ManipulationFunction, ChangeFunction, ChangeEventType } from "./CanvasTools.RegionComponent";
import { TagsDescriptor } from "./Core/CanvasTools.Tags";
import { TagsUpdateOptions } from "./CanvasTools.TagsUpdateOptions";
import { RegionData } from "./Core/CanvasTools.RegionData";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;
/*
 * TagsElement 
 * Used internally to draw labels and map colors for the region
*/
class TagsElement extends RegionComponent {
    private radius: number = 3;

    // Elements
    private primaryTagNode: Snap.Element;
    private primaryTagBoundRect: Snap.Element;

    private primaryTagPointsArray: Array<Snap.Element>;
    private primaryTagPointsGroup: Snap.Element;
    private primaryTagPolyline: Snap.Element;

    private secondaryTagsGroup: Snap.Element;
    private secondaryTags: Array<Snap.Element>;

    // Tags
    public tags: TagsDescriptor;

    // Styling
    private styleId: string;
    private styleSheet: CSSStyleSheet = null;
    private tagsUpdateOptions: TagsUpdateOptions;

    private regionData: RegionData;

    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, tags: TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: TagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = regionData.boundRect;
        this.x = regionData.x;
        this.y = regionData.y;
        this.regionData = regionData.copy();

        this.styleId = styleId;
        this.styleSheet = styleSheet;

        this.tagsUpdateOptions = tagsUpdateOptions;

        this.buildOn(paper, tags);
    }

    private buildOn(paper: Snap.Paper, tags: TagsDescriptor) {
        this.node = paper.g();
        this.node.addClass("tagsLayer");

        this.primaryTagNode = paper.g();

        this.primaryTagBoundRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.primaryTagBoundRect.addClass("primaryTagBoundRectStyle");
       
        this.primaryTagPointsGroup = paper.g();
        this.primaryTagPointsArray = new Array<Snap.Element>();

        let pointsData = [];
        this.regionData.points.forEach(p => {
            pointsData.push(p.x, p.y);
            let point = paper.circle(p.x, p.y, 3);

            point.addClass("primaryTagPolylinePointStyle")
            this.primaryTagPointsArray.push(point);
            this.primaryTagPointsGroup.add(point);
        });
        this.primaryTagPolyline = paper.polyline(pointsData);
        this.primaryTagPolyline.addClass("primaryTagPolylineStyle");
        
        this.regionData.points.forEach(p => {
            pointsData.push(p.x, p.y);
        });

        this.primaryTagNode.add(this.primaryTagBoundRect);
        this.primaryTagNode.add(this.primaryTagPolyline);
        this.primaryTagNode.add(this.primaryTagPointsGroup);

        //this.primaryTagPoint = paper.circle(0, 0, this.radius);
        //this.primaryTagPoint.addClass("primaryTagPointStyle");

        this.secondaryTagsGroup = paper.g();
        this.secondaryTagsGroup.addClass("secondatyTagsLayer");
        this.secondaryTags = [];

        this.node.add(this.primaryTagNode);
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
                    rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                    style: `fill: ${this.tags.primary.colorShadow};
                            stroke: ${this.tags.primary.colorDark};`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                    style: `fill: ${this.tags.primary.colorAccent};
                            stroke: ${this.tags.primary.colorDark};`
                },
                {
                    rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                    style: `fill: ${this.tags.primary.colorShadow};
                            stroke: ${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.${this.styleId} .primaryTagPolylineStyle`,
                    style: `stroke: ${this.tags.primary.colorPure};`
                },             
                {
                    rule: `.${this.styleId} .primaryTagPolylinePointStyle`,
                    style: `fill: ${this.tags.primary.colorPure};
                            stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPolylinePointStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                            stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPolylinePointStyle`,
                    style: `fill: ${this.tags.primary.colorPure};
                                stroke:${this.tags.primary.colorHighlight};`
                }
            ];

            let styleMapLight = [
                {
                    rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                    style: `fill: none;
                            stroke: ${this.tags.primary.colorDark};`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                    style: `stroke: ${this.tags.primary.colorShadow};`
                },
                {
                    rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                    style: `fill: none;
                            stroke: ${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.${this.styleId} .primaryTagPolylineStyle`,
                    style: `stroke: ${this.tags.primary.colorPure};
                            stroke-width: 1px;`
                },
                {
                    rule: `.${this.styleId} .primaryTagPolylinePointStyle`,
                    style: `fill: ${this.tags.primary.colorPure};
                            stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPolylinePointStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPolylinePointStyle`,
                    style: `fill: ${this.tags.primary.colorPure};
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
        this.regionData.move(arg1, arg2);

        let size = 6;
        let cx = this.x + this.boundRect.width / 2;
        let cy = this.y - size - 5;

        let pointsData = [];
        this.regionData.points.forEach(p => {
            pointsData.push(p.x, p.y);
        });

        window.requestAnimationFrame(() => {
            this.primaryTagBoundRect.attr({
                x: this.x,
                y: this.y
            });

            this.primaryTagPointsArray.forEach((p, index) => {
                p.attr({
                    cx: this.regionData.points[index].x,
                    cy: this.regionData.points[index].y
                });
            });

            this.primaryTagPolyline.attr({
                points: pointsData.toString()
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
        super.resize(width, height);
        this.regionData.resize(width,height);
        
        let pointsData = [];
        this.regionData.points.forEach(p => {
            pointsData.push(p.x, p.y);
        });

        window.requestAnimationFrame(() => {
            this.primaryTagBoundRect.attr({
                width: width,
                height: height
            });

            this.primaryTagPointsArray.forEach((p, index) => {
                p.attr({
                    cx: this.regionData.points[index].x,
                    cy: this.regionData.points[index].y
                });
            });

            this.primaryTagPolyline.attr({
                points: pointsData.toString()
            });
        });
    }
}

/*
 * DragElement 
 * Used internally to drag the region
*/
class DragElement extends RegionComponent {
    private dragRect: Snap.Element;
    private isDragged: boolean = false;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, onChange?: ChangeFunction, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction) {
        super(paper, paperRect);
        this.x = regionData.x;
        this.y = regionData.y;
        this.boundRect = regionData.boundRect;

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

        this.dragRect = paper.rect(this.x, this.y, this.width, this.height);
        this.dragRect.addClass("dragRectStyle");

        this.node.add(this.dragRect);
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any) {
        super.move(arg1, arg2);
        window.requestAnimationFrame(() => {
            this.dragRect.attr({
                x: this.x,
                y: this.y
            });
        });
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        window.requestAnimationFrame(() => {
            this.dragRect.attr({
                width: width,
                height: height
            });
        });
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
            this.onChange(this, p.x, p.y, this.boundRect.width, this.boundRect.height, [new Point2D(p.x, p.y)], ChangeEventType.MOVING);
        }
    };

    private rectDragEnd() {
        this.dragOrigin = null;
        this.onChange(this, this.x, this.y, this.boundRect.width, this.boundRect.height, [new Point2D(this.x, this.y)], ChangeEventType.MOVEEND);
    }

    private subscribeToDragEvents() {
        this.dragRect.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.dragRect.undrag();
                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;
                this.onManipulationBegin();
            }
        });

        this.dragRect.node.addEventListener("pointermove", (e) => {
            if (!this.isDragged && !this.isFrozen) {
                this.dragRect.undrag();
                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                this.isDragged = true;

                this.onManipulationBegin();
            }
        });

        this.dragRect.node.addEventListener("pointerleave", (e) => {
            this.dragRect.undrag();
            this.isDragged = false;
            this.onManipulationEnd();
        });

        this.dragRect.node.addEventListener("pointerdown", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.setPointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this, this.x, this.y, this.boundRect.width, this.boundRect.height, [new Point2D(this.x, this.y)], ChangeEventType.MOVEBEGIN, multiselection);
            }
        });

        this.dragRect.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.releasePointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this, this.x, this.y, this.boundRect.width, this.boundRect.height, [new Point2D(this.x, this.y)], ChangeEventType.SELECTIONTOGGLE, multiselection);
            }
        });
    }

    public freeze() {
        super.freeze();
        this.dragRect.undrag();
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

    private regionData: RegionData;

    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData:RegionData, id: string, tagsDescriptor: TagsDescriptor, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction, tagsUpdateOptions?: TagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = regionData.boundRect;

        this.regionData = regionData;
        this.x = regionData.x;
        this.y = regionData.y;
        this.area = regionData.area;

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
        this.move(this.x, this.y);
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);

        this.dragNode = new DragElement(paper, this.paperRect, this.regionData, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
        this.tagsNode = new TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);

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

    private onInternalChange(component: RegionComponent, x: number, y: number, width: number, height: number, points: Array<Point2D>, state: ChangeEventType, multiSelection: boolean = false) {
        if (this.x != x || this.y != y) {
            this.move(new Point2D(x, y));
        }
        if (this.boundRect.width != width || this.boundRect.height != height) {
            this.resize(width, height);
        }
        this.onChange(this, x, y, width, height, points, state, multiSelection);
    }

    public updateTags(tags: TagsDescriptor, options?: TagsUpdateOptions) {
        this.tagsNode.updateTags(tags, options);

        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any) {
        super.move(arg1, arg2);
        this.regionData.move(arg1, arg2);

        this.UI.forEach((element) => {
            element.move(arg1, arg2);
        });
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.regionData.resize(width, height);

        this.area = this.regionData.area;

        this.UI.forEach((element) => {
            element.resize(width, height)
        });
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