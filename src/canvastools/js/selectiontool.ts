/// <reference types="snapsvg" />
import * as CT from "./basetool.js";
import * as Snap from "../../snapsvg/snap.svg";
import base = CT.CanvasTools.Base;

export namespace CanvasTools.Selection {       
    class CrossElement implements base.IPoint2D, base.IHideable, base.IResizable {
        private hl: Snap.Element;
        private vl: Snap.Element;
        public crossGroup: Snap.Element;
        public x: number;
        public y: number;

        constructor(paper: Snap.Paper, rect: base.IRect){
            this.build(paper, rect.width, rect.height, 0 , 0);
        }

        private build(paper: Snap.Paper, width:number, height: number, x:number, y:number) {
            let verticalLine: Snap.Element = paper.line(0, 0, 0, height);
            let horizontalLine: Snap.Element = paper.line(0, 0, width, 0);

            this.crossGroup = paper.g();
            this.crossGroup.addClass("crossStyle");
            this.crossGroup.add(verticalLine);
            this.crossGroup.add(horizontalLine);

            this.hl = horizontalLine;
            this.vl = verticalLine;
            this.x = x;
            this.y = y;
        }

        public boundToRect(rect: base.IRect): base.Point2D {
            return new base.Point2D(this.x, this.y).boundToRect(rect);
        }

        public move(p: base.IPoint2D, rect:base.IRect, square:boolean = false, ref: base.IPoint2D = null) {
            let np:base.Point2D = p.boundToRect(rect); 

            if (square) {
                let dx = Math.abs(np.x - ref.x);
                let vx = Math.sign(np.x - ref.x);
                let dy = Math.abs(np.y - ref.y);
                let vy = Math.sign(np.y - ref.y);

                let d = Math.min(dx, dy);
                np.x = ref.x + d * vx;
                np.y = ref.y + d * vy;
            }

            this.x = np.x;
            this.y = np.y;  
            
            this.vl.attr({
                x1: np.x,
                x2: np.x,
                y2: rect.height
            });

            this.hl.attr({
                y1: np.y,
                x2: rect.width,
                y2: np.y
            });         
        }

        public resize(width: number, height: number) {
            this.vl.attr({
                y2: height
            });
            this.hl.attr({
                x2: width,
            })
        }

        public hide() {
            this.crossGroup.attr({
                visibility: 'hidden'
            });
        }

        public show() {
            this.crossGroup.attr({
                visibility: 'visible'
            });
        }

    }

    class RectElement implements base.IHideable, base.IResizable{
        public width: number;
        public height: number;

        public rect: Snap.Element;

        constructor(paper: Snap.Paper, rect:base.IRect){
           this.build(paper, rect.width, rect.height);
        }

        private build(paper: Snap.Paper, width:number, height:number){
            this.rect = paper.rect(0, 0, width, height);
            this.width = width;
            this.height = height;            
        }

        public move(p: base.IPoint2D) {           
            let self = this;
            window.requestAnimationFrame(function(){
                self.rect.attr({
                    x: p.x,
                    y: p.y
                });
            })  
        }

        public resize(width: number, height: number){
            this.width = width;
            this.height = height;

            let self = this;
            window.requestAnimationFrame(function(){
                self.rect.attr({
                    width: width,
                    height: height
                });
            }) 
        }

        public hide() {
            let self = this;
            window.requestAnimationFrame(function(){
                self.rect.attr({
                    visibility: 'hidden'
                });
            }) 
        }

        public show() {
            let self = this;
            window.requestAnimationFrame(function(){
                self.rect.attr({
                    visibility: 'visible'
                });
            }) 
        }
    }

    export class AreaSelector {
        private baseParent:SVGSVGElement;
        private paper: Snap.Paper;
        private paperRect: base.Rect;

        private overlay: RectElement;
        private mask: RectElement;        
        private selectionBox: RectElement;

        private crossA: CrossElement;
        private crossB: CrossElement;
        private capturingState: boolean = false;
        private exclusiveCapturingState: boolean = false;
        private areaSelectorLayer: Snap.Element;

        public onSelectionBeginCallback: Function;
        public onSelectionEndCallback: Function;

        private isEnabled: boolean = true;
        private squareMode: boolean = false;
        private twoPointsMode: boolean = false;

        constructor(svgHost: SVGSVGElement, onSelectionBegin: Function, onSelectionEnd: Function){
            this.buildUIElements(svgHost);
            this.subscribeToEvents();

            this.onSelectionEndCallback = onSelectionEnd;
            this.onSelectionBeginCallback = onSelectionBegin;
        }

        private buildUIElements(svgHost: SVGSVGElement) {
            this.baseParent = svgHost;
            this.paper = Snap(svgHost);
            this.paperRect = new base.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

            this.areaSelectorLayer = this.paper.g();
            this.areaSelectorLayer.addClass("areaSelector");
            
            this.overlay = this.createOverlay();

            this.mask = this.createMask();
            this.selectionBox = this.createSelectionBoxMask();

            let combinedMask = this.paper.g();
                combinedMask.add(this.mask.rect);
                combinedMask.add(this.selectionBox.rect);

            this.overlay.rect.attr({
                mask: combinedMask
            });

            this.crossA = this.createCross();
            this.crossB = this.createCross();

            this.areaSelectorLayer.add(this.overlay.rect);
            this.areaSelectorLayer.add(this.crossA.crossGroup);
            this.areaSelectorLayer.add(this.crossB.crossGroup);
        }

        private createOverlay(): RectElement {
            let r:RectElement = new RectElement(this.paper, this.paperRect);
            r.rect.addClass("overlayStyle");
            r.hide();
            return r;
        }

        private createMask(): RectElement {
            let r:RectElement = new RectElement(this.paper, this.paperRect);            
            r.rect.addClass("overlayMaskStyle");
            return r;
        }

        private createSelectionBoxMask(): RectElement {
            let r:RectElement = new RectElement(this.paper, new base.Rect(0, 0));
            r.rect.addClass("selectionBoxMaskStyle");
            return r;
        }

        private createCross(): CrossElement {
            let cr:CrossElement = new CrossElement(this.paper, this.paperRect);  
            cr.hide();
            return cr;
        }

        public resize(width:number, height:number):void {
            if (width !== undefined && height !== undefined) {
                this.paperRect.resize(width, height);
                this.baseParent.style.width = width.toString();
                this.baseParent.style.height = height.toString();
            } else {
                this.paperRect.resize(this.baseParent.width.baseVal.value, this.baseParent.height.baseVal.value);
            }

            this.resizeAll([this.overlay, this.mask, this.crossA, this.crossB]);
        }

        private resizeAll(elementSet: Array<base.IResizable>) {
            elementSet.forEach(element => {
                element.resize(this.paperRect.width, this.paperRect.height);                
            });
        }

        private showAll(elementSet: Array<base.IHideable>) {
            elementSet.forEach(element => {
                element.show();                
            });
        }

        private hideAll(elementSet: Array<base.IHideable>) {
            elementSet.forEach(element => {
                element.hide();                
            });
        }

        private onPointerEnter(e:PointerEvent) {
            this.crossA.show();
        }

        private onPointerLeave(e:PointerEvent) {
            let rect = this.baseParent.getClientRects();
            let p = new base.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                
            if (!this.twoPointsMode && !this.capturingState) {
                this.hideAll([this.crossA, this.crossB, this.selectionBox]);
            } else if (this.twoPointsMode && this.capturingState) {
                this.moveCross(this.crossB, p);
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB); 
            }
        }

        private onPointerDown(e:PointerEvent) {
            if (!this.twoPointsMode) {
                this.capturingState = true;

                this.baseParent.setPointerCapture(e.pointerId);
                this.moveCross(this.crossB, this.crossA); 
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB); 

                this.showAll([this.overlay, this.crossB, this.selectionBox]);

                if (typeof this.onSelectionBeginCallback === "function") {
                    this.onSelectionBeginCallback();
                }
            }                 
        }

        private onPointerUp(e:PointerEvent) {
            let rect = this.baseParent.getClientRects();
            let p = new base.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
            
            if (!this.twoPointsMode) { 
                this.capturingState = false;
                this.baseParent.releasePointerCapture(e.pointerId);                    
                this.hideAll([this.crossB, this.overlay]);
                
                if (typeof this.onSelectionEndCallback === "function") {
                    this.onSelectionEndCallback(this.crossA.x, this.crossA.y, this.crossB.x, this.crossB.y);
                }
            } 
            else if (this.twoPointsMode && !this.capturingState) {
                this.capturingState = true;                    
                this.moveCross(this.crossB, p); 
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB); 
                this.showAll([this.crossA, this.crossB, this.selectionBox, this.overlay]);

                if (typeof this.onSelectionBeginCallback === "function") {
                    this.onSelectionBeginCallback();
                }

            } else {
                this.capturingState = false;
                this.hideAll([this.crossB, this.overlay]);

                if (typeof this.onSelectionEndCallback === "function") {
                    this.onSelectionEndCallback(this.crossA.x, this.crossA.y, this.crossB.x, this.crossB.y);
                }
                this.moveCross(this.crossA, p);
                this.moveCross(this.crossB, p);
            }
        }

        private onPointerMove(e:PointerEvent) {
            let rect = this.baseParent.getClientRects();
            let p = new base.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

            this.crossA.show();
            
            if (!this.twoPointsMode && !this.capturingState){
                this.moveCross(this.crossA, p);
            }
            else if (!this.twoPointsMode && this.capturingState) {                    
                this.moveCross(this.crossB, p, this.squareMode, this.crossA);                    
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
            } 
            else if (this.twoPointsMode && this.capturingState) {
                this.moveCross(this.crossB, p, this.squareMode, this.crossA);                    
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
            } 
            else {                    
                this.moveCross(this.crossA, p);
                this.moveCross(this.crossB, p);
            }

            e.preventDefault();
        }

        private onKeyDown(e:KeyboardEvent) {
            if (e.shiftKey) {
                this.squareMode = true; 
            } 
            if (e.ctrlKey && !this.capturingState) {
                this.twoPointsMode = true;                    
            }
        }

        private onKeyUp(e:KeyboardEvent) {
            //Holding shift key enable square drawing mode
            if (!e.shiftKey) {
                this.squareMode = false;
            }
            //Holding Ctrl key to enable two point selection mode
            if (!e.ctrlKey && this.twoPointsMode) {
                this.twoPointsMode = false;   
                this.capturingState = false;

                this.moveCross(this.crossA, this.crossB);
                this.hideAll([this.crossB, this.selectionBox, this.overlay]);
            }

            //Ctrl + N to add new region temporarily disabling all others
            if(e.ctrlKey && e.keyCode == 78 && !this.exclusiveCapturingState) {
                this.enableExclusiveMode();
                this.twoPointsMode = false;
            } 
            //Escape to exit exclusive mode
            if(e.keyCode == 27) {
                this.disableExclusiveMode();
            }
        }

        private subscribeToEvents() {
            let self = this;

            let listeners = [
                {event: "pointerenter", listener: this.onPointerEnter, base: this.baseParent, bypass: false},
                {event: "pointerleave", listener: this.onPointerLeave, base: this.baseParent, bypass: false},
                {event: "pointerdown", listener: this.onPointerDown, base: this.baseParent, bypass: false},
                {event: "pointerup", listener: this.onPointerUp, base: this.baseParent, bypass: false},
                {event: "pointermove", listener: this.onPointerMove, base: this.baseParent, bypass: false},
                {event: "keydown", listener: this.onKeyDown, base: window, bypass: false},
                {event: "keyup", listener: this.onKeyUp, base: window, bypass: true},
            ];

            listeners.forEach(e => {
                e.base.addEventListener(e.event, this.enablify(e.listener.bind(this), e.bypass));            
            });
        }

        private enableExclusiveMode() {
            this.exclusiveCapturingState = true;
            this.showAll([this.overlay]);
            this.hideAll([this.selectionBox]);
            this.enable();
        }
        private disableExclusiveMode() {
            this.exclusiveCapturingState = false;
            this.hideAll([this.overlay]);
        }

        private moveCross(cross:CrossElement, p:base.IPoint2D, square:boolean = false, refCross: CrossElement = null) {
            cross.move(p, this.paperRect, square, refCross);
        }        

        private moveSelectionBox(box: RectElement, crossA:CrossElement, crossB: CrossElement) {
            var x = (crossA.x < crossB.x) ? crossA.x : crossB.x;
            var y = (crossA.y < crossB.y) ? crossA.y : crossB.y;
            var w = Math.abs(crossA.x - crossB.x);
            var h = Math.abs(crossA.y - crossB.y);

            box.move(new base.Point2D(x, y));
            box.resize(w, h);
        }

        enable() {
            this.isEnabled = true;
            this.areaSelectorLayer.attr({
                display: "block"
            });
        }

        disable() {
            if(!this.exclusiveCapturingState) {
                this.isEnabled = false;
                this.areaSelectorLayer.attr({
                    display: "none"
                });
            }
        }

        enablify(f:Function, bypass:boolean = false) {
            let self = this;
            return function(args:PointerEvent|KeyboardEvent) {
                if (this.isEnabled || bypass) {
                    f(args);
                }
            }.bind(self);
        }
    }
}