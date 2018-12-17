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
 * AnchorsElement 
 * Used internally to draw anchors to resize the region
*/
class AnchorsElement extends RegionComponent {
    private anchors: { TL: Snap.Element, TR: Snap.Element, BR: Snap.Element, BL: Snap.Element };
    private ghostAnchor: Snap.Element;

    // Change Notifier
    private onChange: ChangeFunction;

    constructor(paper: Snap.Paper, x: number, y: number, rect: IRect, paperRect: IRect = null, onChange?: ChangeFunction, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction) {
        super(paper, paperRect);
        this.x = x;
        this.y = y;
        this.boundRect = rect;

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
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("anchorsLayer");
        this.anchors = {
            TL: this.createAnchor(paper, "TL"),
            TR: this.createAnchor(paper, "TR"),
            BL: this.createAnchor(paper, "BL"),
            BR: this.createAnchor(paper, "BR")
        };
        this.ghostAnchor = this.createAnchor(paper, "ghost", 7);

        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);

        this.node.add(this.anchors.TL);
        this.node.add(this.anchors.TR);
        this.node.add(this.anchors.BR);
        this.node.add(this.anchors.BL);
        this.node.add(this.ghostAnchor);

        this.subscribeAnchorToEvents(this.anchors.TL, "TL");
        this.subscribeAnchorToEvents(this.anchors.TR, "TR");
        this.subscribeAnchorToEvents(this.anchors.BL, "BL");
        this.subscribeAnchorToEvents(this.anchors.BR, "BR");

        let listeners: Array<EventDescriptor> = [
            { event: "pointerenter", listener: this.onGhostPointerEnter, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerleave", listener: this.onGhostPointerLeave, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerdown", listener: this.onGhostPointerDown, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerup", listener: this.onGhostPointerUp, base: this.ghostAnchor.node, bypass: false },
        ];

        this.subscribeToEvents(listeners);
    }

    private subscribeAnchorToEvents(anchor: Snap.Element, active: string) {
        anchor.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.activeAnchor = active;
                // Set drag origin point to current anchor
                let p = this.getDragOriginPoint();
                this.dragOrigin = p;
                this.rectOrigin = this.boundRect.copy();
                this.pointOrigin = new Point2D(this.x, this.y);
                // Move ghost anchor to current anchor position

                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: p.x,
                        cy: p.y,
                        display: 'block'
                    });
                });
            }
        });
    }

    private createAnchor(paper: Snap.Paper, style: string = "", r: number = 3): Snap.Element {
        let a = paper.circle(0, 0, r);
        a.addClass("anchorStyle");
        a.addClass(style);
        return a;
    }

    public move(p: IPoint2D) {
        super.move(p);
        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
    }

    private rearrangeAnchors(x1: number, y1: number, x2: number, y2: number) {
        window.requestAnimationFrame(() => {
            this.anchors.TL.attr({ cx: x1, cy: y1 });
            this.anchors.TR.attr({ cx: x2, cy: y1 });
            this.anchors.BR.attr({ cx: x2, cy: y2 });
            this.anchors.BL.attr({ cx: x1, cy: y2 });
        });
    }

    private rearrangeCoord(p1: IPoint2D, p2: IPoint2D, flipX: boolean, flipY: boolean) {
        let x = (p1.x < p2.x) ? p1.x : p2.x;
        let y = (p1.y < p2.y) ? p1.y : p2.y;
        let width = Math.abs(p1.x - p2.x);
        let height = Math.abs(p1.y - p2.y);

        this.flipActiveAnchor(flipX, flipY);

        this.onChange(x, y, width, height, ChangeEventType.MOVING);
    }

    private activeAnchor: string;
    private originalAnchor: string;
    private flipActiveAnchor(flipX: boolean, flipY: boolean) {
        let ac: string = "";
        if (this.activeAnchor !== "") {
            ac += (this.activeAnchor[0] == "T") ? (flipY ? "B" : "T") : (flipY ? "T" : "B");
            ac += (this.activeAnchor[1] == "L") ? (flipX ? "R" : "L") : (flipX ? "L" : "R");
        }

        if (this.activeAnchor != ac) {
            this.ghostAnchor.removeClass(this.activeAnchor);
            this.activeAnchor = ac;
            this.ghostAnchor.addClass(this.activeAnchor);
        }

        if (flipX) {
            if (this.activeAnchor[1] == "R") {
                this.pointOrigin.x += this.rectOrigin.width;
            }
            this.rectOrigin.width = 0;
        }

        if (flipY) {
            if (this.activeAnchor[0] == "B") {
                this.pointOrigin.y += this.rectOrigin.height;
            }
            this.rectOrigin.height = 0;
        }
    }

    private dragOrigin: Point2D;
    private pointOrigin: Point2D;
    private rectOrigin: IRect;

    private anchorDragBegin() {
        this.originalAnchor = this.activeAnchor;
    }

    private getDragOriginPoint() {
        let x: number, y: number;

        switch (this.activeAnchor) {
            case "TL": {
                x = this.x;
                y = this.y;
                break;
            }
            case "TR": {
                x = this.x + this.boundRect.width;
                y = this.y;
                break;
            }
            case "BL": {
                x = this.x;
                y = this.y + this.boundRect.height;
                break;
            }
            case "BR": {
                x = this.x + this.boundRect.width;
                y = this.y + this.boundRect.height;
                break;
            }
        }
        return new Point2D(x, y);
    }

    private anchorDragMove(dx: number, dy: number, x: number, y: number) {
        // Calculation depends on active anchor!!
        let p1: Point2D, p2: Point2D;
        let x1: number, y1: number, x2: number, y2: number;
        let flipX: boolean = false;
        let flipY: boolean = false;

        x1 = this.dragOrigin.x + dx;
        y1 = this.dragOrigin.y + dy;

        switch (this.activeAnchor) {
            case "TL": {
                x2 = this.pointOrigin.x + this.rectOrigin.width;
                y2 = this.pointOrigin.y + this.rectOrigin.height;
                flipX = x2 < x1;
                flipY = y2 < y1;
                break;
            }
            case "TR": {
                x2 = this.pointOrigin.x;
                y2 = this.pointOrigin.y + this.rectOrigin.height;
                flipX = x1 < x2;
                flipY = y2 < y1;
                break;
            }
            case "BL": {
                y2 = this.pointOrigin.y;
                x2 = this.pointOrigin.x + this.rectOrigin.width;
                flipX = x2 < x1;
                flipY = y1 < y2;
                break;
            }
            case "BR": {
                x2 = this.pointOrigin.x;
                y2 = this.pointOrigin.y;
                flipX = x1 < x2;
                flipY = y1 < y2;
                break;
            }
        }

        p1 = new Point2D(x1, y1);
        p2 = new Point2D(x2, y2);

        if (this.paperRect !== null) {
            p1 = p1.boundToRect(this.paperRect);
            p2 = p2.boundToRect(this.paperRect);
        }

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({ cx: x1, cy: y1 });
        });


        this.rearrangeCoord(p1, p2, flipX, flipY);
    };

    private anchorDragEnd() {
        //this.dragOrigin = null;
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none"
            })
        });

    }

    private onGhostPointerEnter(e: PointerEvent) {
        this.ghostAnchor.drag(
            this.anchorDragMove.bind(this),
            this.anchorDragBegin.bind(this),
            this.anchorDragEnd.bind(this)
        );
        window.requestAnimationFrame(() => {
            this.ghostAnchor.addClass(this.activeAnchor);
        });
        this.onManipulationBegin();
    }

    private onGhostPointerLeave(e: PointerEvent) {
        this.ghostAnchor.undrag();

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none"
            });
            this.ghostAnchor.removeClass(this.activeAnchor);
        });

        this.onManipulationEnd();
    }

    private onGhostPointerDown(e: PointerEvent) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);

        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, ChangeEventType.MOVEBEGIN);
    }

    private onGhostPointerUp(e: PointerEvent) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, ChangeEventType.MOVEEND);
    }

    public freeze() {
        super.freeze();
        this.ghostAnchor.undrag();
        this.onManipulationEnd();
    }
}

/*
 * TagsElement 
 * Used internally to draw labels and map colors for the region
*/
class TagsElement extends RegionComponent {
    // Region size
    private textBox: Snap.BBox;

    // Elements
    private primaryTagRect: Snap.Element;
    private primaryTagText: Snap.Element;
    private primaryTagTextBG: Snap.Element;

    private secondaryTagsGroup: Snap.Element;
    private secondaryTags: Array<Snap.Element>;

    // Tags
    public tags: TagsDescriptor;

    // Styling
    private styleId: string;
    private styleSheet: CSSStyleSheet = null;
    private tagsUpdateOptions: TagsUpdateOptions;

    constructor(paper: Snap.Paper, x: number, y: number, rect: IRect, paperRect: IRect, tags: TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: TagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = rect;
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

    public updateTags(tags: TagsDescriptor, options?: TagsUpdateOptions) {
        let keepPrimaryText = false; // redraw by default
        if (this.tags && this.tags.primary && tags && tags.primary) {
            keepPrimaryText = (tags.primary.name == this.tags.primary.name);
        }

        this.tags = tags;

        this.redrawTagLabels(keepPrimaryText);
        this.clearColors();

        let showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyColors(showBackground);
    }

    private redrawTagLabels(keepPrimaryText: boolean = true) {
        // Clear secondary tags -> redraw from scratch
        for (let i = 0; i < this.secondaryTags.length; i++) {
            this.secondaryTags[i].remove();
        }
        this.secondaryTags = [];
        // If there are tags assigned
        if (this.tags) {
            if (this.tags.primary !== undefined) {
                // Primary Tag
                if (!keepPrimaryText || this.textBox == undefined) {
                    this.primaryTagText.node.innerHTML = this.tags.primary.name;
                    this.textBox = this.primaryTagText.getBBox();
                }
                let showTextLabel = (this.textBox.width + 10 <= this.boundRect.width) && (this.textBox.height <= this.boundRect.height);
                if (showTextLabel) {

                    window.requestAnimationFrame(() => {
                        this.primaryTagTextBG.attr({
                            width: this.textBox.width + 10,
                            height: this.textBox.height + 5
                        });
                        this.primaryTagText.attr({
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                            visibility: "visible"
                        });
                    });

                } else {
                    window.requestAnimationFrame(() => {
                        this.primaryTagTextBG.attr({
                            width: Math.min(10, this.boundRect.width),
                            height: Math.min(10, this.boundRect.height)
                        });
                        this.primaryTagText.attr({
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                            visibility: "hidden"
                        });
                    });
                }
            }
            // Secondary Tags
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                let length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    let stag = this.tags.secondary[i];

                    /* let r = 3;
                    let x = this.x + this.rect.width / 2 + (2 * i - length + 1) * 2 * r;
                    let y = this.y - r - 5;                        

                    let tagel = this.paper.circle(x, y, r);    */

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
            // Clear primary tag label
        } else {
            window.requestAnimationFrame(() => {
                this.primaryTagText.node.innerHTML = "";
                this.primaryTagTextBG.attr({
                    width: 0,
                    height: 0
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
            let styleMap = [
                {
                    rule: `.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorShadow};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                    style: `fill:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle`,
                    style: `stroke:${this.tags.primary.colorDark};
                                fill: ${this.tags.primary.colorPure}`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                    style: `stroke:#fff;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                    style: `fill:transparent;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                    style: `fill:rgba(255,255,255,0.5);`
                }
            ];

            let styleMapLight = [
                {
                    rule: `.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorNoColor};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                },
                {
                    rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                    style: `fill:${this.tags.primary.colorShadow};`
                },
                {
                    rule: `.regionStyle.${this.styleId} .primaryTagTextStyle`,
                    style: `opacity:0.25;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                    style: `opacity:0.25;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle`,
                    style: `stroke:${this.tags.primary.colorDark};
                                fill: ${this.tags.primary.colorPure}`
                },
                {
                    rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                    style: `stroke:#fff;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                    style: `fill:transparent;`
                },
                {
                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                    style: `fill:rgba(255,255,255,0.5);`
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
        let cx = this.x + 0.5 * this.boundRect.width;
        let cy = this.y - size - 5;

        window.requestAnimationFrame(() => {
            this.primaryTagRect.attr({
                x: p.x,
                y: p.y
            });
            this.primaryTagText.attr({
                x: p.x + 5,
                y: p.y + this.textBox.height
            });
            this.primaryTagTextBG.attr({
                x: p.x + 1,
                y: p.y + 1
            })

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

        window.requestAnimationFrame(() => {
            this.primaryTagRect.attr({
                width: width,
                height: height
            });
        })
        this.redrawTagLabels();
    }
}

/*
 * DragElement 
 * Used internally to drag the region
*/
class DragElement extends RegionComponent {
    private dragRect: Snap.Element;
    private isDragged: boolean = false;

    // Change Notifier
    private onChange: ChangeFunction;

    constructor(paper: Snap.Paper, x: number, y: number, rect: IRect, paperRect: IRect = null, onChange?: ChangeFunction, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction) {
        super(paper, paperRect);
        this.x = x;
        this.y = y;
        this.boundRect = rect;

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

        this.dragRect = paper.rect(0, 0, this.boundRect.width, this.boundRect.height);
        this.dragRect.addClass("dragRectStyle");

        this.node.add(this.dragRect);
    }

    public move(p: IPoint2D) {
        super.move(p);
        window.requestAnimationFrame(() => {
            this.dragRect.attr({
                x: p.x,
                y: p.y
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
            this.onChange(p.x, p.y, this.boundRect.width, this.boundRect.height, ChangeEventType.MOVING);
        }
    };

    private rectDragEnd() {
        this.dragOrigin = null;
        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, ChangeEventType.MOVEEND);
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
                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, ChangeEventType.MOVEBEGIN, multiselection);
            }
        });

        this.dragRect.node.addEventListener("pointerup", (e) => {
            if (!this.isFrozen) {
                this.dragRect.node.releasePointerCapture(e.pointerId);
                let multiselection = e.shiftKey;
                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, ChangeEventType.SELECTIONTOGGLE, multiselection);
            }
        });
    }

    public freeze() {
        super.freeze();
        this.dragRect.undrag();
        this.onManipulationEnd();
    }
}

export class RectRegion extends RegionComponent {
    // Region size
    public area: number;

    // Bound rects
    private paperRects: { host: IRect, actual: IRect };

    // Region components
    public node: Snap.Element;
    private dragNode: DragElement;
    private anchorsNode: AnchorsElement;
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

    constructor(paper: Snap.Paper, paperRect: IRect = null, point: Point2D, rect: IRect, id: string, tagsDescriptor: TagsDescriptor, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction, tagsUpdateOptions?: TagsUpdateOptions) {
        super(paper, paperRect);
        this.boundRect = rect;

        this.x = point.x;
        this.y = point.y;
        this.ID = id;
        this.tags = tagsDescriptor;

        if (paperRect !== null) {
            this.paperRects = {
                host: paperRect,
                actual: new Rect(paperRect.width - rect.width, paperRect.height - rect.height)
            };
        }

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
        this.move(point);
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);

        this.anchorsNode = new AnchorsElement(paper, this.x, this.y, this.boundRect, this.paperRects.host, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
        this.dragNode = new DragElement(paper, this.x, this.y, this.boundRect, this.paperRects.actual, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
        this.tagsNode = new TagsElement(paper, this.x, this.y, this.boundRect, this.paperRects.host, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);

        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(<any>this.toolTip);

        this.node.add(this.tagsNode.node);
        this.node.add(this.dragNode.node);
        this.node.add(this.anchorsNode.node);

        this.UI = new Array<RegionComponent>(this.tagsNode, this.dragNode, this.anchorsNode);
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
        super.resize(width, height);
        this.area = width * height;

        this.paperRects.actual.width = this.paperRects.host.width - width;
        this.paperRects.actual.height = this.paperRects.host.height - height;

        this.UI.forEach((element) => {
            element.resize(width, height);
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
            this.anchorsNode.freeze();
        }
    }

    public unfreeze() {
        if (this.isFrozen) {
            this.isFrozen = false;
            this.node.removeClass('old');
            this.dragNode.unfreeze();
            this.anchorsNode.unfreeze();
        }
    }
}