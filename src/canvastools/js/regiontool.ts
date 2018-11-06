/// <reference types="snapsvg" />
import * as CT from "./basetool";
import * as Snap from "@snapsvg/snap.svg.js";
import base = CT.CanvasTools.Base;

export namespace CanvasTools.Region { 
    interface onManipulationFunction {
        (UIElement?: base.IRegionPart): void;
    }

    interface onChangeFunction {
        (x: number, y: number, width:number, height:number, eventType?: string): void;
    }


    /*
     * AnchorsElement 
     * Used internally to draw anchors to resize the region
    */
    class AnchorsElement implements base.IRegionPart {
        // Region size
        public rect: base.IRect;

        // Region position
        public x: number;
        public y: number;

        // Bound rects
        private boundRect: base.IRect;

        // Anchors composition
        public anchorsGroup:Snap.Element;
        private anchors: {TL: Snap.Element, TR: Snap.Element, BR:Snap.Element, BL: Snap.Element};
        private ghostAnchor: Snap.Element;

        // Change Notifier
        private onChange: Function;

        // Manipulation notifiers
        public onManipulationBegin: onManipulationFunction;
        public onManipulationEnd: onManipulationFunction;

        constructor(paper:Snap.Paper, x: number, y: number, rect:base.IRect, boundRect:base.IRect = null, onChange?: onChangeFunction, onManipulationBegin?: onManipulationFunction, onManipulationEnd?:onManipulationFunction) {
            this.x = x;
            this.y = y;
            this.rect = rect;
            this.boundRect = boundRect;

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
            this.subscribeToEvents();
        }

        private buildOn(paper:Snap.Paper){
            this.anchorsGroup = paper.g();
            this.anchorsGroup.addClass("anchorsLayer");
            this.anchors = {
                TL: this.createAnchor(paper, "TL"),
                TR: this.createAnchor(paper, "TR"),
                BL: this.createAnchor(paper, "BL"),
                BR: this.createAnchor(paper, "BR")
            };
            this.ghostAnchor = this.createAnchor(paper, "ghost", 7);

            this.rearrangeAnchors(this.x, this.y, this.x + this.rect.width, this.y + this.rect.height);   
            
            this.anchorsGroup.add(this.anchors.TL);
            this.anchorsGroup.add(this.anchors.TR);
            this.anchorsGroup.add(this.anchors.BR);
            this.anchorsGroup.add(this.anchors.BL);
            this.anchorsGroup.add(this.ghostAnchor);
        }

        private createAnchor(paper: Snap.Paper, style: string = "", r:number = 3): Snap.Element {
            let a = paper.circle(0, 0, r);            
            a.addClass("anchorStyle");
            a.addClass(style);
            return a;
        }

        public move(p: base.IPoint2D) {
            this.x = p.x;
            this.y = p.y;
            this.rearrangeAnchors(this.x, this.y, this.x + this.rect.width, this.y + this.rect.height);
        }

        public resize(width: number, height: number) {
            this.rect.width = width;
            this.rect.height = height;
            this.rearrangeAnchors(this.x, this.y, this.x + this.rect.width, this.y + this.rect.height);
        }

        private rearrangeAnchors(x1: number, y1: number, x2: number, y2: number) {
            window.requestAnimationFrame(() => {
                this.anchors.TL.attr({ cx: x1, cy: y1 });
                this.anchors.TR.attr({ cx: x2, cy: y1});
                this.anchors.BR.attr({ cx: x2, cy: y2});
                this.anchors.BL.attr({ cx: x1, cy: y2});
            });            
        }

        private rearrangeCoord(p1: base.IPoint2D, p2: base.IPoint2D, flipX: boolean, flipY: boolean) {
            let x = (p1.x < p2.x) ? p1.x : p2.x;
            let y = (p1.y < p2.y) ? p1.y : p2.y;
            let width = Math.abs(p1.x - p2.x);
            let height = Math.abs(p1.y - p2.y);

            this.flipActiveAnchor(flipX, flipY);
            
            this.onChange(x, y, width, height, "moving");
        }

        private activeAnchor: string;
        private originalAnchor: string;
        private flipActiveAnchor(flipX:boolean, flipY:boolean) {
            let ac:string = "";
            if (this.activeAnchor !== "") {
                ac += (this.activeAnchor[0] == "T") ? (flipY? "B": "T") : (flipY? "T" : "B");
                ac += (this.activeAnchor[1] == "L") ? (flipX? "R": "L") : (flipX? "L" : "R");
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
        
        private dragOrigin: base.Point2D;
        private pointOrigin: base.Point2D;
        private rectOrigin: base.IRect;

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
                    x = this.x + this.rect.width;
                    y = this.y;
                    break;
                }
                case "BL": {
                    x = this.x;
                    y = this.y + this.rect.height;
                    break;
                }
                case "BR": {
                    x = this.x + this.rect.width;
                    y = this.y + this.rect.height;
                    break;
                }
            }
            return new base.Point2D(x, y);
        }
        
        private anchorDragMove(dx:number, dy:number, x: number, y: number) {
            // Calculation depends on active anchor!!
            let p1: base.Point2D, p2: base.Point2D;
            let x1: number, y1: number, x2: number, y2: number;
            let flipX:boolean = false;
            let flipY:boolean = false;

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

            p1 = new base.Point2D(x1, y1);
            p2 = new base.Point2D(x2, y2);

            if (this.boundRect !== null) {
                p1 = p1.boundToRect(this.boundRect);
                p2 = p2.boundToRect(this.boundRect);
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

        private subscribeToEvents() {
            let self = this;
            this.subscribeAnchorToEvents(this.anchors.TL, "TL");
            this.subscribeAnchorToEvents(this.anchors.TR, "TR");
            this.subscribeAnchorToEvents(this.anchors.BL, "BL");
            this.subscribeAnchorToEvents(this.anchors.BR, "BR");

            self.ghostAnchor.mouseover(function(e){
                self.ghostAnchor.drag(
                    self.anchorDragMove.bind(self),
                    self.anchorDragBegin.bind(self),
                    self.anchorDragEnd.bind(self)
                );                
                window.requestAnimationFrame(() => {
                    self.ghostAnchor.addClass(self.activeAnchor);
                });                
                self.onManipulationBegin();
            });

            self.ghostAnchor.mouseout(function(e){
                self.ghostAnchor.undrag();

                window.requestAnimationFrame(() => {
                    self.ghostAnchor.attr({
                        display: "none"
                    });
                    self.ghostAnchor.removeClass(self.activeAnchor);
                });
                
                self.onManipulationEnd();
            });

            self.ghostAnchor.node.addEventListener("pointerdown", function(e){
                self.ghostAnchor.node.setPointerCapture(e.pointerId);

                self.onChange(self.x, self.y, self.rect.width, self.rect.height, "movingbegin");
            });

            self.ghostAnchor.node.addEventListener("pointerup", function(e){
                self.ghostAnchor.node.releasePointerCapture(e.pointerId);

                self.onChange(self.x, self.y, self.rect.width, self.rect.height, "movingend");
            });
        }

        private subscribeAnchorToEvents(anchor:Snap.Element, active:string) {
            anchor.mouseover((e) => {
                this.activeAnchor = active;
                // Set drag origin point to current anchor
                let p = this.getDragOriginPoint();    
                this.dragOrigin = p;
                this.rectOrigin = this.rect.copy();
                this.pointOrigin = new base.Point2D(this.x, this.y);
                // Move ghost anchor to current anchor position

                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({ 
                        cx: p.x, 
                        cy: p.y,
                        display: 'block' });  
                });
            });
        }

        // IHideable -> hide()
        public hide() {
            window.requestAnimationFrame(() => {
                this.anchorsGroup.attr({
                    visibility: 'hidden'
                });
            });
            
        }
        
        // IHideable -> show()
        public show() {
            window.requestAnimationFrame(() => {
                this.anchorsGroup.attr({
                    visibility: 'visible'
                });
            });            
        }
    }

    export type TagsUpdateOptions = {
        showRegionBackground: boolean
    };
    /*
     * TagsElement 
     * Used internally to draw labels and map colors for the region
    */
    class TagsElement  implements base.IRegionPart {
        // Region size
        public rect: base.IRect;

        // Region position
        public x: number;
        public y: number;

        private textBox: Snap.BBox;

        // Elements
        public tagsGroup:Snap.Element;
        private primaryTagRect: Snap.Element;
        private primaryTagText: Snap.Element;
        private primaryTagTextBG: Snap.Element;

        private secondaryTagsGroup: Snap.Element;
        private secondaryTags: Array<Snap.Element>;

        // Tags
        public tags: base.TagsDescriptor;

        // Styling
        private styleId: string;
        private styleSheet: CSSStyleSheet = null;
        private paper: Snap.Paper;
        private tagsUpdateOptions: TagsUpdateOptions;

        constructor(paper:Snap.Paper, x: number, y: number, rect:base.IRect, tags: base.TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: TagsUpdateOptions){
            //this.tags = tags;
            this.rect = rect;
            this.x = x;
            this.y = y;


            this.styleId = styleId;
            this.styleSheet = styleSheet;
            this.paper = paper;
            
            this.tagsUpdateOptions = tagsUpdateOptions;

            this.buildOn(paper, tags);
        }

        private buildOn(paper:Snap.Paper, tags: base.TagsDescriptor){
            this.tagsGroup = paper.g();
            this.tagsGroup.addClass("tagsLayer");    
            
            this.primaryTagRect = paper.rect(0, 0, this.rect.width, this.rect.height);
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
            
            this.tagsGroup.add(this.primaryTagRect);
            this.tagsGroup.add(this.primaryTagTextBG);
            this.tagsGroup.add(this.primaryTagText); 
            this.tagsGroup.add(this.secondaryTagsGroup); 
            
            this.updateTags(tags, this.tagsUpdateOptions);                       
        }

        public updateTags(tags: base.TagsDescriptor, options?: TagsUpdateOptions){            
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
                    let showTextLabel = (this.textBox.width + 10 <= this.rect.width) && (this.textBox.height <= this.rect.height);
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
                                width: Math.min(10, this.rect.width),
                                height: Math.min(10, this.rect.height)                    
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
                        let x = this.x + this.rect.width / 2 + (2 * i - length + 1) * s - s / 2;
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
            while(this.styleSheet.cssRules.length > 0) {
                this.styleSheet.deleteRule(0);
            }
        }

        // Map colors to region
        private applyColors(showRegionBackground:boolean = true) {
            // Map primary tag color
            if (this.tags && this.tags.primary !== undefined) {
                let styleMap = [
                    {
                        rule: `.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${showRegionBackground? this.tags.primary.colorShadow : this.tags.primary.colorNoColor};
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
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${this.tags.primary.colorAccent};`
                    },
                ];

                window.requestAnimationFrame(() => {
                    for (let i = 0; i < styleMap.length; i++) {
                        let r = styleMap[i];
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

        public move(p: base.IPoint2D) {           
            this.x = p.x;
            this.y = p.y;

            let size = 6;
            let cx = this.x + 0.5 * this.rect.width;
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

        public resize(width: number, height: number){
            this.rect.width = width;
            this.rect.height = height;

            window.requestAnimationFrame(() => {
                this.primaryTagRect.attr({
                    width: width,
                    height: height
                });
            })            
            this.redrawTagLabels();
        }

        // IHideable -> hide()
        public hide() {
            window.requestAnimationFrame(() => {
                this.tagsGroup.attr({
                    visibility: 'hidden'
                });
            });            
        }

        // IHideable -> show()
        public show() {
            window.requestAnimationFrame(() => {
                this.tagsGroup.attr({
                    visibility: 'visible'
                });
            });            
        }
    } 

    /*
     * DragElement 
     * Used internally to drag the region
    */
    class DragElement implements base.IRegionPart {
        // Region size
        public rect: base.IRect;

        // Region position
        public x: number;
        public y: number;

        // Drag rect
        public dragGroup: Snap.Element;
        private dragRect: Snap.Element;

        // Bounding box
        private boundRect: base.IRect;

        // Change Notifier
        private onChange: Function;

        // Manipulation notifiers
        public onManipulationBegin: onManipulationFunction;
        public onManipulationEnd: onManipulationFunction;

        constructor(paper:Snap.Paper, x: number, y: number, rect:base.IRect, boundRect:base.IRect = null, onChange?: onChangeFunction, onManipulationBegin?: onManipulationFunction, onManipulationEnd?:onManipulationFunction){
            this.rect = rect;
            this.x = x;
            this.y = y;

            this.boundRect = boundRect;
            
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
            this.subscribeToEvents();
        }

        private buildOn(paper:Snap.Paper){
            this.dragGroup = paper.g();
            this.dragGroup.addClass("dragLayer");    
            
            this.dragRect = paper.rect(0, 0, this.rect.width, this.rect.height);
            this.dragRect.addClass("dragRectStyle");

            this.dragGroup.add(this.dragRect);
        }

        public move(p: base.IPoint2D) {           
            this.x = p.x;
            this.y = p.y;
            window.requestAnimationFrame(() => {
                this.dragRect.attr({
                    x: p.x,
                    y: p.y
                });  
            });            
        }

        public resize(width: number, height: number){
            this.rect.width = width;
            this.rect.height = height;

            window.requestAnimationFrame(() => {
                this.dragRect.attr({
                    width: width,
                    height: height
                });
            });            
        }

        // IHideable -> hide()
        public hide() {
            window.requestAnimationFrame(() => {
                this.dragRect.attr({
                    visibility: 'hidden'
                }); 
            });
            
        }

        // IHideable -> show()
        public show() {
            window.requestAnimationFrame(() => {
                this.dragRect.attr({
                    visibility: 'visible'
                });
            });            
        }

        private dragOrigin: base.Point2D;

        private rectDragBegin() {
            this.dragOrigin = new base.Point2D(this.x, this.y);            
        }
        
        private rectDragMove(dx:number, dy:number) {            
            if (dx != 0 && dy != 0) {
                let p = new base.Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

                if (this.boundRect !== null) {                
                    p = p.boundToRect(this.boundRect);
                }
                //this.move(p);            
                this.onChange(p.x, p.y, this.rect.width, this.rect.height, "moving");
            }
        };

        private rectDragEnd() {
            this.dragOrigin = null;
            this.onChange(this.x, this.y, this.rect.width, this.rect.height, "movingend");
        }

        private subscribeToEvents() {
            let self = this;

            self.dragRect.mouseover(function(e){
                self.dragRect.drag(self.rectDragMove.bind(self), self.rectDragBegin.bind(self), self.rectDragEnd.bind(self));
                self.onManipulationBegin();
            })

            self.dragRect.mouseout(function(e){
                self.dragRect.undrag();
                self.onManipulationEnd();
            });

            self.dragRect.node.addEventListener("pointerdown", function(e){
                self.dragRect.node.setPointerCapture(e.pointerId);  
                let multiselection = e.shiftKey;
                self.onChange(self.x, self.y, self.rect.width, self.rect.height, "movingbegin", multiselection);
            });

            self.dragRect.node.addEventListener("pointerup", function(e){
                self.dragRect.node.releasePointerCapture(e.pointerId);

                let multiselection = e.shiftKey;
                self.onChange(self.x, self.y, self.rect.width, self.rect.height, "clicked", multiselection);
            });
        }
    }

    /*
     * MenuElement 
     * Used internally to show actions menu for the region
    */
   class MenuElement implements base.IRegionPart {
    // Region size
    public rect: base.IRect;

    // Region position
    public x: number;
    public y: number;

    // Menu Item Size
    private menuItemSize:number = 20;
    // Menu position;
    private mx: number;
    private my: number;
    private mw: number = this.menuItemSize + 10;
    private mh: number = 60;
    
    // threshold for positioning menu inside/outside
    private dh: number = 20;
    // threshold for positioning menu left/right
    private dw: number = 5;

    // Menu group
    public menuGroup: Snap.Paper;
    public menuRect: Snap.Element;
    public menuItemsGroup: Snap.Element;
    public menuItems: Array<Snap.Element>;

    // Bounding box
    private boundRect: base.IRect;

    // Manipulation notifiers
    public onManipulationBegin: onManipulationFunction;
    public onManipulationEnd: onManipulationFunction;

    // Snap Paper
    private paper: Snap.Paper;

    private region: RegionElement;

    constructor(paper:Snap.Paper, x: number, y: number, rect:base.IRect, boundRect:base.IRect = null, onManipulationBegin?: onManipulationFunction, onManipulationEnd?:onManipulationFunction){
        this.paper = paper;
        this.rect = rect;
        this.x = x;
        this.y = y;

        this.boundRect = boundRect;
        
        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = onManipulationBegin;
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = onManipulationEnd;
        }

        this.buildOn(this.paper);
    }

    private buildOn(paper:Snap.Paper){
        let menuSVG = this.paper.svg(this.mx, this.my, this.mw, this.mh, this.mx, this.my, this.mw, this.mh) as SVGGraphicsElement;

        // Snap.Paper
        this.menuGroup = Snap(menuSVG).paper;
        this.menuGroup.addClass("menuLayer");
                
        this.rearrangeMenuPosition();

        this.menuRect = this.menuGroup.rect(0, 0, this.mw, this.mh, 5, 5);
        this.menuRect.addClass("menuRectStyle");

        this.menuItemsGroup = this.menuGroup.g();
        this.menuItemsGroup.addClass("menuItems");

        this.menuItems = new Array<Snap.Element>();

        this.menuGroup.add(this.menuRect);
        this.menuGroup.add(this.menuItemsGroup);
        //this.menuGroup.add(this.menuRect);
        //this.menuGroup.add(this.menuItemsGroup);

        this.menuGroup.mouseover((e) => {
            this.onManipulationBegin();
        })
        this.menuGroup.mouseout((e) => {
            this.onManipulationEnd();
        })
    }

    private pathCollection = {
        "delete": {
            path: "M 83.4 21.1 L 74.9 12.6 L 48 39.5 L 21.1 12.6 L 12.6 21.1 L 39.5 48 L 12.6 74.9 L 21.1 83.4 L 48 56.5 L 74.9 83.4 L 83.4 74.9 L 56.5 48 Z",
            iconSize: 96
        }
    }

    public addAction(action: string, icon:string, actor: Function) {
        let item = this.menuGroup.g();
        let itemBack = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemBack.addClass("menuItemBack");

        let k = (this.menuItemSize - 4) / this.pathCollection.delete.iconSize;
        let itemIcon = this.menuGroup.path(this.pathCollection.delete.path);
        itemIcon.transform(`scale(0.2) translate(26 26)`);

        //let itemIcon = this.menuGroup.text(6, 19, "✖");
        itemIcon.addClass("menuIcon");
        itemIcon.addClass("menuIcon-" + icon);

        let itemRect = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemRect.addClass("menuItem");

        item.add(itemBack);
        item.add(itemIcon);
        item.add(itemRect);

        item.click((e) => {
            actor(this.region);
        });

        this.menuItemsGroup.add(item);
        this.menuItems.push(item);
    }

    private rearrangeMenuPosition() {
        // position menu inside
        if (this.mh <= this.rect.height - this.dh) {
            this.my = this.y + this.rect.height / 2 - this.mh / 2;
            // position menu on the right side
            if (this.x + this.rect.width + this.mw/2 + this.dw < this.boundRect.width) {
                this.mx = this.x + this.rect.width - this.mw/2;
            } 
            // position menu on the left side
            else if (this.x - this.mw/2 - this.dw > 0) {
                this.mx = this.x - this.mw/2;
            }
            // position menu on the right side INSIDE 
            else {
                this.mx = this.x + this.rect.width - this.mw - this.dw;
            }
        } 
        // position menu outside
        else {
            this.my = this.y;
            // position menu on the right side
            if (this.x + this.rect.width + this.mw + 2 * this.dw < this.boundRect.width) {
                this.mx = this.x + this.rect.width + this.dw;
            } 
            // position menu on the left side
            else if (this.x - this.mw - 2 * this.dw > 0) {
                this.mx = this.x - this.mw - this.dw;
            }
            // position menu on the right side INSIDE 
            else {
                this.mx = this.x + this.rect.width - this.mw - this.dw;
            }
        }
    }

    public attachTo(region: RegionElement) {
        this.region = region;
        this.x = region.x;
        this.y = region.y;
        this.rect = region.rect;
        this.rearrangeMenuPosition();

        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my
            }); 
        });        
    }

    public move(p: base.IPoint2D) {           
        let self = this;
        this.x = p.x;
        this.y = p.y;

        this.rearrangeMenuPosition();

        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my
            }); 
        }); 
    }

    public resize(width: number, height: number){
        let self = this;
        this.rect.width = width;
        this.rect.height = height;

        this.rearrangeMenuPosition();

        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my
            }); 
        }); 
    }

    // IHideable -> hide()
    public hide() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: 'hidden'
            });
        });
        
    }

    // IHideable -> show()
    public show() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: 'visible'
            });
        });        
    }    

    public showOnRegion(region:RegionElement) {
        this.attachTo(region);
        this.show();
    }
}

    class RegionElement implements base.IHideable, base.IResizable{
        // Region size
        public rect: base.IRect;
        public area: number;

        // Region position
        public x: number;
        public y: number;

        // Bound rects
        private boundRects: {host: base.IRect, self: base.IRect };

        // Region components
        public regionGroup: Snap.Element;
        private drag: DragElement;
        private anchors: AnchorsElement;
        public tags: TagsElement;
        private UI: Array<base.IRegionPart>;

        // Region data
        private tagsDescriptor: base.TagsDescriptor;

        // Region state        
        public isSelected:boolean = false;

        // Region ID
        public ID: string;
        // Region styles
        public regionID: string
        private styleID: string;
        private styleSheet: CSSStyleSheet = null;

        // Manipulation notifiers
        public onManipulationBegin: onManipulationFunction;
        public onManipulationEnd: onManipulationFunction;

        // Styling options
        private tagsUpdateOptions: TagsUpdateOptions;

        constructor(paper: Snap.Paper, rect:base.IRect, boundRect:base.IRect = null, id: string, tagsDescriptor: base.TagsDescriptor, onManipulationBegin?: onManipulationFunction, onManipulationEnd?:onManipulationFunction, tagsUpdateOptions?: TagsUpdateOptions){
            this.x = 0;
            this.y = 0;
            this.rect = rect;
            this.ID = id;
            this.tagsDescriptor = tagsDescriptor;

            if (boundRect !== null) {
                this.boundRects = { 
                    host: boundRect, 
                    self: new base.Rect(boundRect.width - rect.width, boundRect.height - rect.height)
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
            this.styleID = `region_${ this.regionID }_style`;
            this.styleSheet = this.insertStyleSheet();
            this.tagsUpdateOptions = tagsUpdateOptions;
        
            this.buildOn(paper);
        }

        private buildOn(paper: Snap.Paper){
            this.regionGroup = paper.g();
            this.regionGroup.addClass("regionStyle");
            this.regionGroup.addClass(this.styleID);

            this.anchors = new AnchorsElement(paper, this.x, this.y, this.rect,this.boundRects.host, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
            this.drag = new DragElement(paper, this.x, this.y, this.rect, this.boundRects.self, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
            this.tags = new TagsElement(paper, this.x, this.y, this.rect, this.tagsDescriptor, this.styleID, this.styleSheet, this.tagsUpdateOptions);
            
            this.regionGroup.add(this.tags.tagsGroup);
            this.regionGroup.add(this.drag.dragGroup);                      
            this.regionGroup.add(this.anchors.anchorsGroup);  
            
            this.UI = new Array<base.IRegionPart>(this.tags, this.drag, this.anchors);
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

        private onInternalChange(x: number, y:number, width: number, height:number, state:string, multiSelection: boolean = false) {
            if (this.x != x || this.y != y) {
                this.move(new base.Point2D(x, y));
            }
            if (this.rect.width != width || this.rect.height != height) {
                this.resize(width, height);
            }            
            this.onChange(this, state, multiSelection);
        }

        public updateTags(tags: base.TagsDescriptor, options?: TagsUpdateOptions){
            this.tags.updateTags(tags, options);
        }

        public move(p: base.IPoint2D) {           
            let self = this;
            this.x = p.x;
            this.y = p.y;
            this.UI.forEach((element) => {
                element.move(p);
            });
        }

        public resize(width: number, height: number){
            this.rect.width = width;
            this.rect.height = height;
            this.area = width * height;

            this.boundRects.self.width = this.boundRects.host.width - width;
            this.boundRects.self.height = this.boundRects.host.height - height;

            this.UI.forEach((element) => {
                element.resize(width, height);
            });
        }

        // IHideable -> hide()
        public hide() {
            window.requestAnimationFrame(() => {
                this.regionGroup.attr({
                    visibility: 'hidden'
                });
            });            
        }

        // IHideable -> show()
        public show() {
            window.requestAnimationFrame(() => {
                this.regionGroup.attr({
                    visibility: 'visible'
                });
            });            
        }

        public onChange: Function;

        public select() {
            this.isSelected = true;
            this.regionGroup.addClass("selected");

/*             if (this.onChange != undefined) {
                this.onChange(this, this.isSelected);
            } */
        }

        public unselect() {
            this.isSelected = false;
            this.regionGroup.removeClass("selected");

/*             if (this.onChange != undefined) {
                this.onChange(this, this.isSelected);
            } */
        }
    }

    export class RegionsManager {
        private baseParent:SVGSVGElement;
        private paper: Snap.Paper;
        private paperRect: base.Rect;

        private regions: Array<RegionElement>;    
        
        private menuLayer: Snap.Element;
        private menu: MenuElement;

        public onManipulationBegin: onManipulationFunction;
        public onManipulationEnd: onManipulationFunction;

        public onRegionSelected: Function;
        public onRegionMove: Function;
        public onRegionDelete: Function;

        private regionManagerLayer:Snap.Element;

        private tagsUpdateOptions: TagsUpdateOptions = {
            showRegionBackground: true
        };

        constructor(svgHost: SVGSVGElement, onManipulationBegin: onManipulationFunction, onManipulationEnd: onManipulationFunction){
            this.baseParent = svgHost;
            this.paper = Snap(svgHost);
            this.paperRect = new base.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

            this.regions = new Array<RegionElement>();
            this.onManipulationBegin = onManipulationBegin;
            this.onManipulationEnd = onManipulationEnd;

            this.buildOn(this.paper);
            this.subscribeToEvents();
        }

        private buildOn(paper: Snap.Paper) {
            this.regionManagerLayer = paper.g();
            this.regionManagerLayer.addClass("regionManager");

            this.menuLayer = paper.g();
            this.menuLayer.addClass("menuManager");
            this.menu = new MenuElement(paper, 0, 0, new base.Rect(0,0), this.paperRect, 
                                        this.onManipulationBegin_local.bind(this), 
                                         this.onManipulationEnd_local.bind(this));

            this.menu.addAction("delete", "trash", (region: RegionElement) => {
                console.log(region.regionID);
                this.deleteRegion(region);
                this.menu.hide();
            })
            this.menuLayer.add(this.menu.menuGroup);
            this.menu.hide();
        }

        private subscribeToEvents() {
            window.addEventListener("keyup", (e) => {
                switch (e.keyCode) {
                    // tab
                    case 9:
                        this.selectNextRegion();
                        break;

                    // delete, backspace
                    case 46: 
                    case 8: 
                        this.deleteSelectedRegions();
                        break;
                    // ctrl + up
                    case 38:
                        if (e.ctrlKey) {
                            if (!e.shiftKey && !e.altKey) {
                                this.moveSelectedRegions(0, -5);
                            } else if (e.shiftKey && !e.altKey) {
                                this.resizeSelectedRegions(0, -5);
                            } else if (e.altKey && !e.shiftKey) {
                                this.resizeSelectedRegions(0, -5, true);
                            }                     
                        }
                        break;
                    // ctrl + down
                    case 40:
                        if (e.ctrlKey) {
                            if (!e.shiftKey && !e.altKey) {
                                this.moveSelectedRegions(0, 5);
                            } else if (e.shiftKey && !e.altKey) {
                                this.resizeSelectedRegions(0, 5);
                            } else if (e.altKey && !e.shiftKey) {
                                this.resizeSelectedRegions(0, 5, true);
                            }  
                        }
                        break;
                    // ctrl + left
                    case 37:
                        if (e.ctrlKey) {
                            if (!e.shiftKey && !e.altKey) {
                                this.moveSelectedRegions(-5, 0);
                            } else if (e.shiftKey && !e.altKey) {
                                this.resizeSelectedRegions(-5, 0);
                            } else if (e.altKey && !e.shiftKey) {
                                this.resizeSelectedRegions(-5, 0, true);
                            } 
                        }
                        break;
                    // ctrl + right
                    case 39:
                        if (e.ctrlKey) {
                            if (!e.shiftKey && !e.altKey) {
                                this.moveSelectedRegions(5, 0);
                            } else if (e.shiftKey && !e.altKey) {
                                this.resizeSelectedRegions(5, 0);
                            } else if (e.altKey && !e.shiftKey) {
                                this.resizeSelectedRegions(5, 0, true);
                            } 
                        }
                        break;
                    // default
                    default: return;
                }
                e.preventDefault();
            });
            window.addEventListener("keydown", (e) => {
                switch (e.keyCode) {
                    // ctrl + A, ctrl + a
                    case 65:
                    case 97:
                        if (e.ctrlKey) {
                            this.selectAllRegions();
                            e.preventDefault();
                            return false;                          
                        }
                        break;
                        // ctrl + B, ctrl + b
                        case 66:
                        case 98:
                        if (e.ctrlKey) {
                            this.toggleBackground();
                            e.preventDefault();
                            return false;                          
                        }
                        break;
                    // default
                    default: return;
                }
            });
        }

        // SETUP NEW REGION
        public addRegion(id: string, pointA: base.IPoint2D, pointB: base.IPoint2D, tagsDescriptor: base.TagsDescriptor) {
            this.menu.hide();

            let x = (pointA.x < pointB.x) ? pointA.x : pointB.x;
            let y = (pointA.y < pointB.y) ? pointA.y : pointB.y;
            let w = Math.abs(pointA.x - pointB.x);
            let h = Math.abs(pointA.y - pointB.y);

            let region = new RegionElement(this.paper, new base.Rect(w, h), this.paperRect, id, tagsDescriptor, 
                this.onManipulationBegin_local.bind(this), 
                this.onManipulationEnd_local.bind(this),
                this.tagsUpdateOptions);
            region.move(new base.Point2D(x, y));

            region.onChange = this.onRegionUpdate.bind(this);

            this.unselectRegions();
            region.select();

            this.regionManagerLayer.add(region.regionGroup);
            this.regions.push(region);

            this.menu.showOnRegion(region); 
        }

        // REGION CREATION
        public drawRegion(x: number, y: number, rect: base.IRect, id: string, tagsDescriptor: base.TagsDescriptor) {
            this.menu.hide();
            let region = new RegionElement(this.paper, rect, this.paperRect, id, tagsDescriptor,
                this.onManipulationBegin_local.bind(this), 
                this.onManipulationEnd_local.bind(this),
                this.tagsUpdateOptions);
            region.area = rect.height * rect.width;
            region.move(new base.Point2D(x, y));
            region.onChange = this.onRegionUpdate.bind(this);
            region.tags.updateTags(region.tags.tags, this.tagsUpdateOptions);
            this.regionManagerLayer.add(region.regionGroup);
            this.regions.push(region);
            // Need to do a check for invalid stacking from user generated or older saved json
            if(this.regions.length > 1 && region.area > this.regions[this.regions.length - 2].area) {   
                this.sortRegionsByArea();
                this.redrawAllRegions();
            }
            //this.menu.showOnRegion(region);  
        }

        // REDRAW ALL REGIONS (corrects z-order changes)
        public redrawAllRegions() {
            let sr = this.regions;
            this.deleteAllRegions();
            let selectedID: string = "";
            for(var i = 0; i < sr.length; i++) {
                this.drawRegion(sr[i].x, sr[i].y, sr[i].rect, sr[i].ID, sr[i].tags.tags);
                if(sr[i].isSelected) {
                    selectedID = sr[i].ID
                }
            }
            if (selectedID !== "") {
                this.selectRegionById(selectedID);
            }
        }

        // QUICKSORT REGIONS BY AREA DESCENDING
        private sortRegionsByArea() {
            function quickSort(arr: Array<RegionElement>, left: number, right: number){
                var len = arr.length, 
                pivot,
                partitionIndex;
             
             
               if(left < right){
                 pivot = right;
                 partitionIndex = partition(arr, pivot, left, right);
                 
                //sort left and right
                quickSort(arr, left, partitionIndex - 1);
                quickSort(arr, partitionIndex + 1, right);
               }
               return arr;
             }

             function partition(arr: Array<RegionElement>, pivot: number, left: number, right: number){
                var pivotValue = arr[pivot].area,
                    partitionIndex = left;
             
                for(var i = left; i < right; i++){
                 if(arr[i].area > pivotValue){
                   swap(arr, i, partitionIndex);
                   partitionIndex++;
                 }
               }
               swap(arr, right, partitionIndex);
               return partitionIndex;
             }

             function swap(arr: Array<RegionElement>, i: number, j: number){
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
             }

             let length = this.regions.length;
             if(length > 1) {
                quickSort(this.regions, 0, this.regions.length - 1);
             }
        }

        // REGIONS LOOKUP
        private lookupRegionByID(id:string): RegionElement {
            let region:RegionElement = null;
            let i = 0;
            while (i < this.regions.length && region == null) {
                if (this.regions[i].ID == id) {
                    region = this.regions[i];
                }
                i++
            }

            return region;
        }

        private lookupSelectedRegions(): Array<RegionElement> {
            let collection = Array<RegionElement>();

            for (var i = 0; i < this.regions.length; i++) {
                if (this.regions[i].isSelected) {
                    collection.push(this.regions[i]);
                }
            }

            return collection;
        }

        // REGIONS DELETE
        private deleteRegion(region:RegionElement){
            // remove style
            region.removeStyles();
            
            // remove element
            region.regionGroup.remove();
            this.regions = this.regions.filter((r) => {return r != region});

            if ((typeof this.onRegionDelete) == "function") {
                this.onRegionDelete(region.ID);
            }            
        }

        private deleteSelectedRegions() {
            let collection = this.lookupSelectedRegions();
            for (var i = 0; i < collection.length; i++) {
                this.deleteRegion(collection[i]);
            }       
            
            this.menu.hide();
            this.selectNextRegion();
            this.onManipulationEnd();
        }

        public deleteRegionById(id: string) {
            let region = this.lookupRegionByID(id);

            if (region != null) {
                this.deleteRegion(region);
            }
            this.menu.hide();
            this.onManipulationEnd();
        }

        public deleteAllRegions(){
            for (let i = 0; i< this.regions.length; i++) {
                let r = this.regions[i];
                r.removeStyles();
                r.regionGroup.remove();                
            }
            this.regions = [];
            this.menu.hide();
        }

        // REGIONS TAGS UPDATE
        public updateTagsById(id: string, tagsDescriptor:base.TagsDescriptor) {
            let region = this.lookupRegionByID(id);

            if (region != null) {
                region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
            }
        }
        
        public updateTagsForSelectedRegions(tagsDescriptor:base.TagsDescriptor) {
            let regions = this.lookupSelectedRegions();

            regions.forEach(region => {
                region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
            });
        }

        // REGIONS SELECTION
        private selectRegion(region: RegionElement) {
            if (region != null) {
                this.unselectRegions(region);
                region.select();

                this.menu.showOnRegion(region);
                if ((typeof this.onRegionSelected) == "function") {
                    this.onRegionSelected(region.ID);
                }
            }
        }

        private selectAllRegions() {
            let r = null;
            for (let i = 0; i< this.regions.length; i++) {
                let r = this.regions[i];
                r.select(); 

                if ((typeof this.onRegionSelected) == "function") {
                    this.onRegionSelected(r.ID);
                }         
            }
            if (r != null) {
                this.menu.showOnRegion(r);
            }
        }

        public selectRegionById(id: string) {
            let region = this.lookupRegionByID(id);
            this.selectRegion(region);
        }

        private selectNextRegion() {
            let region = null;
            let i = 0;
            let length = this.regions.length;

            if (length == 1) {
                region = this.regions[0];
            }
            else if (length > 1) {
                while (i < length && region == null) {
                    if (this.regions[i].isSelected) {
                        region = (i == length - 1) ? this.regions[0] : this.regions[i + 1];
                    }
                    i++
                }
            } 

            if (region == null && length > 0) {
                region = this.regions[0];
            }

            this.selectRegion(region);
        }

        // REGIONS MOVE/RESIZE
        private reshapeRegion(region: RegionElement, dx: number, dy: number, dw: number, dh: number, inverse: boolean = false) {
            let w: number;
            let h: number;
            let x: number;
            let y: number;
            if (!inverse) {
                w = region.rect.width + Math.abs(dw);
                h = region.rect.height + Math.abs(dh);
                x = region.x + dx + (dw > 0 ? 0 : dw);
                y = region.y + dy + (dh > 0 ? 0 : dh);
            } else {
                w = Math.max(0, region.rect.width - Math.abs(dw));
                h = Math.max(0, region.rect.height - Math.abs(dh));

                x = region.x + dx + (dw < 0 ? 0 : dw);
                y = region.y + dy + (dh < 0 ? 0 : dh);
            }
            
            let p1 = new base.Point2D(x, y).boundToRect(this.paperRect);
            let p2 = new base.Point2D(x + w, y + h).boundToRect(this.paperRect);

            region.move(p1);
            region.resize(p2.x - p1.x, p2.y - p1.y);
        }

        private moveSelectedRegions(dx: number, dy: number) {
            let regions = this.lookupSelectedRegions();
            regions.forEach(r => {
                this.reshapeRegion(r, dx, dy, 0, 0);
            });
            this.menu.showOnRegion(regions[0]);
        }

        private resizeSelectedRegions(dw: number, dh: number, inverse: boolean = false) {
            let regions = this.lookupSelectedRegions();
            regions.forEach(r => {
                this.reshapeRegion(r, 0, 0, dw, dh, inverse);
            });
            this.menu.showOnRegion(regions[0]);
        }

        // MANAGER RESIZE
        public resize(width: number, height: number){
            let tw = width / this.paperRect.width;
            let th = height / this.paperRect.height;

            this.paperRect.resize(width, height);

            this.menu.hide();
            
            // recalculate size/position for all regions;
            for (var i = 0; i < this.regions.length; i++){
                let r = this.regions[i];
                r.move(new base.Point2D(r.x * tw, r.y * th));
                r.resize(r.rect.width * tw, r.rect.height * th);
            }    
        }

        private onManipulationBegin_local(region: RegionElement) {
            this.onManipulationBegin();
        }
        private onManipulationEnd_local(region: RegionElement) {
            this.onManipulationEnd();
        }


        private justManipulated = false;

        private onRegionUpdate(region: RegionElement, state: string, multiSelection:boolean) {
            // resize or drag begin
            if (state == "movingbegin") { 
                if (!multiSelection) {              
                    this.unselectRegions(region);
                } 
                this.menu.hide(); 
                if ((typeof this.onRegionSelected) == "function") {
                    this.onRegionSelected(region.ID);
                }
                this.justManipulated = false;
            // resizing or dragging            
            } else if (state == "moving") {
                if ((typeof this.onRegionMove) == "function") {
                    this.onRegionMove(region.ID, region.x, region.y, region.rect.width, region.rect.height);
                }   
                this.justManipulated = true;
            // resize or drag end
            } else if (state == "movingend") {
                if (this.justManipulated) {
                    region.select();
                    this.menu.showOnRegion(region); 
                    this.sortRegionsByArea();
                    this.redrawAllRegions();
                }                
            } else if (state == "clicked" && !this.justManipulated) {
                // select
                if (!region.isSelected) {
                    if (!multiSelection) {              
                        this.unselectRegions(region);
                    } 
                    region.select();                    
                    this.menu.showOnRegion(region); 
                    if ((typeof this.onRegionSelected) == "function") {
                        this.onRegionSelected(region.ID);
                    }
                // unselect
                } else {
                    region.unselect();
                    this.menu.hide();
                    if ((typeof this.onRegionSelected) == "function") {
                        this.onRegionSelected("");
                    }
                }
            }
        }

        public unselectRegions(except?: RegionElement){
            for (var i = 0; i < this.regions.length; i++){
                let r = this.regions[i];
                if (r != except) {
                    r.unselect();
                }
            } 
        }

        private showRegionBackground:boolean = true;
        private toggleBackground() {
            this.tagsUpdateOptions.showRegionBackground = !this.tagsUpdateOptions.showRegionBackground;

            this.regions.forEach((r) => {
                r.tags.updateTags(r.tags.tags, this.tagsUpdateOptions);
            });
        }
    }
}