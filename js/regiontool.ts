/// <reference types="snapsvg" />
import * as CT from "./basetool.js";
import * as Snap from "./snapsvg/snap.svg.js";
import base = CT.CanvasTools.Base;
import { runInThisContext } from "vm";

export namespace CanvasTools.Region { 
    interface onManipulationFunction {
        (): void;
    }

    class AncorsRect {
        // Region size
        private rect: base.IRect;
        public get width(): number {
            return this.rect.width;
        }
        public set width(width: number) {
            this.resize(width, this.rect.height);
        }
        public get height(): number {
            return this.rect.height;
        };
        public set height(height: number) {
            this.resize(this.rect.width, height);
        }

        // Region position
        public x: number;
        public y: number;

        // Bound rects
        private boundRect: base.IRect;

        // Ancors composition
        public ancorsGroup:Snap.Element;
        private ancors: {TL: Snap.Element, TR: Snap.Element, BR:Snap.Element, BL: Snap.Element};
        private ghostAncor: Snap.Element;

        private onResizeCallback: Function;

        // Manipulation notifiers
        public onManipulationBegin: onManipulationFunction;
        public onManipulationEnd: onManipulationFunction;

        constructor(paper:Snap.Paper, x: number, y: number, rect:base.IRect, boundRect:base.IRect = null, onResize?: Function, onManipulationBegin?: onManipulationFunction, onManipulationEnd?:onManipulationFunction) {
            this.x = x;
            this.y = y;
            this.rect = rect;
            this.onResizeCallback = onResize;
            this.boundRect = boundRect;

            if (onManipulationBegin !== undefined) {
                this.onManipulationBegin = onManipulationBegin;
            }
            if (onManipulationEnd !== undefined) {
                this.onManipulationEnd = onManipulationEnd;
            }

            this.build(paper);
            this.subscribeToEvents();
        }

        private build(paper:Snap.Paper){
            this.ancorsGroup = paper.g();
            this.ancorsGroup.addClass("ancorsLayer");
            this.ancors = {
                TL: this.createAncor(paper),
                TR: this.createAncor(paper),
                BL: this.createAncor(paper),
                BR: this.createAncor(paper)
            };
            this.ghostAncor = this.createAncor(paper, 7);
            this.ghostAncor.addClass("ghost");

            this.rearrangeAncors();   
            
            this.ancorsGroup.add(this.ancors.TL);
            this.ancorsGroup.add(this.ancors.TR);
            this.ancorsGroup.add(this.ancors.BR);
            this.ancorsGroup.add(this.ancors.BL);
            this.ancorsGroup.add(this.ghostAncor);
        }

        private createAncor(paper: Snap.Paper, r:number = 3): Snap.Element {
            let a = paper.circle(0, 0, r);
            a.addClass("ancorStyle");
            return a;
        }

        public move(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.rearrangeAncors();
        }

        public resize(width: number, height: number) {
            this.rect.width = width;
            this.rect.height = height;
            this.rearrangeAncors();
        }

        private rearrangeAncors() {
            let self = this;
            window.requestAnimationFrame(function(){
                self.ancors.TL.attr({ cx: self.x, cy: self.y });
                self.ancors.TR.attr({ cx: self.x + self.width, cy: self.y});
                self.ancors.BR.attr({ cx: self.x + self.width, cy: self.y + self.height});
                self.ancors.BL.attr({ cx: self.x, cy: self.y + self.height});
            });
        }

        private rearrangeCoord(p1: base.IPoint2D, p2: base.IPoint2D) {
            let x = (p1.x < p2.x) ? p1.x : p2.x;
            let y = (p1.y < p2.y) ? p1.y : p2.y;
            let width = Math.abs(p1.x - p2.x);
            let height = Math.abs(p1.y - p2.y);
            this.flipActiveAncor(p1.x - p2.x > 0, p1.y - p2.y > 0);
            
            this.onResizeCallback(x, y, width, height);
        }

        private flipActiveAncor(w:boolean, h:boolean) {
            let ac:string = "";
            if (this.activeAncor !== "") {
                ac += (this.activeAncor[0] == "T") ? (h? "B": "T") : (h? "T" : "B");
                ac += (this.activeAncor[1] == "L") ? (w? "R": "L") : (w? "L" : "R");
            }
            this.activeAncor = ac;
        }
        
        private dragOrigin: base.Point2D;
        private activeAncor: string;

        private ancorDragBegin() {
            
        }

        private getDragOriginPoint() {
            let x: number, y: number;
            
            switch (this.activeAncor) {
                case "TL": {
                    x = this.x;
                    y = this.y;
                    break;
                }
                case "TR": {
                    x = this.x + this.width;
                    y = this.y;
                    break;
                }
                case "BL": {
                    x = this.x;
                    y = this.y + this.height;
                    break;
                }
                case "BR": {
                    x = this.x + this.width;
                    y = this.y + this.height;
                    break;
                }
            }
            return new base.Point2D(x, y);
        }
        
        private ancorDragMove(dx:number, dy:number, x: number, y: number) {
            // Calculation depends on active ancor!!
            let p1, p2;
            let x1, y1, x2, y2;

            switch (this.activeAncor) {
                case "TL": {
                    x1 = this.dragOrigin.x + dx;
                    y1 = this.dragOrigin.y + dy;
                    x2 = this.x + this.width;
                    y2 = this.y + this.height;
                    break;
                }
                case "TR": {
                    x1 = this.x;
                    y1 = this.dragOrigin.y + dy;
                    x2 = this.dragOrigin.x + dx;
                    y2 = this.y + this.height;
                    break;
                }
                case "BL": {
                    x1 = this.dragOrigin.x + dx;
                    y1 = this.y;
                    x2 = this.x + this.width;
                    y2 = this.dragOrigin.y + dy;
                    break;
                }
                case "BR": {
                    x1 = this.x;
                    y1 = this.y;
                    x2 = this.dragOrigin.x + dx;
                    y2 = this.dragOrigin.y + dy;
                    break;
                }
            }

            p1 = new base.Point2D(x1, y1);
            p2 = new base.Point2D(x2, y2);

            if (this.boundRect !== null) {
                p1 = p1.boundToRect(this.boundRect);
                p2 = p2.boundToRect(this.boundRect);
            }

            let self = this;
            window.requestAnimationFrame(function(){
                self.ghostAncor.attr({ cx: self.dragOrigin.x + dx, cy: self.dragOrigin.y + dy });
            });

            this.rearrangeCoord(p1, p2);
        };

        private ancorDragEnd() {
            //this.dragOrigin = null;
            this.ghostAncor.attr({
                display: "none"
            })
        }

        private subscribeToEvents() {
            let self = this;
            this.subscribeAncorToEvents(this.ancors.TL, "TL");
            this.subscribeAncorToEvents(this.ancors.TR, "TR");
            this.subscribeAncorToEvents(this.ancors.BL, "BL");
            this.subscribeAncorToEvents(this.ancors.BR, "BR");

            self.ghostAncor.mouseover(function(e){
                self.ghostAncor.drag(
                    self.ancorDragMove.bind(self),
                    self.ancorDragBegin.bind(self),
                    self.ancorDragEnd.bind(self)
                );                

                self.onManipulationBegin();
            });

            self.ghostAncor.mouseout(function(e){
                self.ghostAncor.undrag();
                window.requestAnimationFrame(function(){
                    self.ghostAncor.attr({
                        display: "none"
                    })
                });
                //self.activeAncor = "";
                self.onManipulationEnd();
            });

            self.ghostAncor.node.addEventListener("pointerdown", function(e){
                self.ghostAncor.node.setPointerCapture(e.pointerId);
            });

            self.ghostAncor.node.addEventListener("pointerup", function(e){
                self.ghostAncor.node.releasePointerCapture(e.pointerId);
            });
        }

        private subscribeAncorToEvents(ancor:Snap.Element, active:string) {
            let self = this;
            ancor.mouseover(function(e){
                self.activeAncor = active;
                // Set drag origin point to current ancor
                let p = self.getDragOriginPoint();    
                self.dragOrigin = p;
                // Move ghost ancor to current ancor position
                window.requestAnimationFrame(function(){
                    self.ghostAncor.attr({ 
                        cx: p.x, 
                        cy: p.y,
                        display: 'block' });
                });                
                
            });
        }
    }

    class RegionElement implements base.IRect, base.IHideable, base.IResizable{
        // Region size
        private rect: base.IRect;
        public get width(): number {
            return this.rect.width;
        }
        public set width(width: number) {
            this.resize(width, this.rect.height);
        }
        public get height(): number {
            return this.rect.height;
        };
        public set height(height: number) {
            this.resize(this.rect.width, height);
        }

        // Region position
        public x: number;
        public y: number;

        // Bound rects
        private boundRects: {host: base.IRect, self: base.IRect };

        // Region components
        public regionGroup: Snap.Element;
        private regionRect: Snap.Element;
        private ancors: AncorsRect;

        // Region state        
        private isSelected:boolean = false;

        // Manipulation notifiers
        public onManipulationBegin: onManipulationFunction;
        public onManipulationEnd: onManipulationFunction;

        constructor(paper: Snap.Paper, rect:base.IRect, boundRect:base.IRect = null, onManipulationBegin?: onManipulationFunction, onManipulationEnd?:onManipulationFunction){
            this.x = 0;
            this.y = 0;
            this.rect = rect;

            if (boundRect !== null) {
                this.boundRects = { 
                    host: boundRect, 
                    self: new base.Rect(boundRect.width - rect.width, boundRect.height - rect.height)
                };
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

        private buildOn(paper: Snap.Paper){
            this.regionGroup = paper.g();
            this.regionGroup.addClass("regionStyle");

            this.regionRect = paper.rect(0, 0, this.width, this.height);
            this.regionRect.addClass("regionRectStyle");

            this.ancors = new AncorsRect(paper, this.x, this.y, this.rect,this.boundRects.host, this.onInternalResize.bind(this), this.onManipulationBegin, this.onManipulationEnd);
            
            this.regionGroup.add(this.regionRect);
            this.regionGroup.add(this.ancors.ancorsGroup);
        }

        private onInternalResize(x: number, y:number, width: number, height:number) {
            this.move(new base.Point2D(x, y));
            this.resize(width, height);
        }

        public move(p: base.IPoint2D) {           
            let self = this;
            this.x = p.x;
            this.y = p.y;
            window.requestAnimationFrame(function(){
                self.regionRect.attr({
                    x: p.x,
                    y: p.y
                });
                self.ancors.move(p.x, p.y);
            })  
        }

        public resize(width: number, height: number){
            this.rect.width = width;
            this.rect.height = height;

            this.boundRects.self.width = this.boundRects.host.width - width;
            this.boundRects.self.height = this.boundRects.host.height - height;

            let self = this;
            window.requestAnimationFrame(function(){
                self.regionRect.attr({
                    width: width,
                    height: height
                });
                self.ancors.resize(width, height);
            }) 
        }

        public hide() {
            let self = this;
            window.requestAnimationFrame(function(){
                self.regionGroup.attr({
                    visibility: 'hidden'
                });
            }) 
        }

        public show() {
            let self = this;
            window.requestAnimationFrame(function(){
                self.regionGroup.attr({
                    visibility: 'visible'
                });
            }) 
        }

        public select() {
            this.isSelected = true;
            this.regionGroup.addClass("selected");
        }

        public unselect() {
            this.isSelected = false;
            this.regionGroup.removeClass("selected");
        }

        private dragOrigin: base.Point2D;

        private rectDragBegin() {
            this.dragOrigin = new base.Point2D(this.x, this.y);
        }
        
        private rectDragMove(dx:number, dy:number) {
            let p:base.IPoint2D;
            p = new base.Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

            if (this.boundRects !== null) {                
                p = p.boundToRect(this.boundRects.self);
            }
            this.move(p);
        };

        private rectDragEnd() {
            this.dragOrigin = null;
        }

        private subscribeToEvents() {
            let self = this;
            self.regionRect.click(function(e){
                if (self.isSelected) {
                    self.unselect();                    
                } else {
                    self.select();                    
                }
            }, this);

            self.regionRect.mouseover(function(e){
                self.regionRect.drag(self.rectDragMove.bind(self), self.rectDragBegin.bind(self), self.rectDragEnd.bind(self));
                self.onManipulationBegin();
                //self.host.onDragBegin();
            })

            self.regionRect.mouseout(function(e){
                self.regionRect.undrag();
                self.onManipulationEnd();
                //self.host.onDragEnd();
            });

            self.regionRect.node.addEventListener("pointerdown", function(e){
                self.regionRect.node.setPointerCapture(e.pointerId);
            });

            self.regionRect.node.addEventListener("pointerup", function(e){
                self.regionRect.node.releasePointerCapture(e.pointerId);
            });
        }
    }

    export class RegionsManager {
        private baseParent:SVGSVGElement;
        private paper: Snap.Paper;
        private paperRect: base.Rect;

        public onManipulationBegin: onManipulationFunction;
        public onManipulationEnd: onManipulationFunction;

        private regionManagerLayer:Snap.Element;

        constructor(svgHost: SVGSVGElement, onManipulationBegin: onManipulationFunction, onManipulationEnd: onManipulationFunction){
            this.baseParent = svgHost;
            this.paper = Snap(svgHost);
            this.paperRect = new base.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

            this.regionManagerLayer = this.paper.g();
            this.regionManagerLayer.addClass("regionManager");

            this.onManipulationBegin = onManipulationBegin;
            this.onManipulationEnd = onManipulationEnd;
        }

        public addRegion(pointA: base.IPoint2D, pointB: base.IPoint2D) {
            let x = (pointA.x < pointB.x) ? pointA.x : pointB.x;
            let y = (pointA.y < pointB.y) ? pointA.y : pointB.y;
            let w = Math.abs(pointA.x - pointB.x);
            let h = Math.abs(pointA.y - pointB.y);

            let region = new RegionElement(this.paper, new base.Rect(w, h), this.paperRect, this.onManipulationBegin, this.onManipulationEnd);
            region.move(new base.Point2D(x, y));

            this.regionManagerLayer.add(region.regionGroup);
        }
    }
}