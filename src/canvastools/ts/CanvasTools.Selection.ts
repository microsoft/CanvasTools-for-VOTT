import CTBaseInterfaces = require("./Base/CanvasTools.Base.Interfaces");
import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
import CTBaseRect = require("./Base/CanvasTools.Base.Rect");
import Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
import CTBasePoint = require("./Base/CanvasTools.Base.Point2D");
import Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;

import * as Snap from "snapsvg";

export module CanvasTools.Selection {       
    class CrossElement implements IBase.IPoint2D, IBase.IHideable, IBase.IResizable {
        private hl: Snap.Element;
        private vl: Snap.Element;
        public crossGroup: Snap.Element;
        public x: number;
        public y: number;

        private isVisible: boolean = true;

        constructor(paper: Snap.Paper, rect: IBase.IRect){
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

        public boundToRect(rect: IBase.IRect): Point2D {
            return new Point2D(this.x, this.y).boundToRect(rect);
        }

        public move(p: IBase.IPoint2D, rect:IBase.IRect, square:boolean = false, ref: IBase.IPoint2D = null) {
            let np:Point2D = p.boundToRect(rect); 

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
            
            this.vl.node.setAttribute("x1", np.x.toString());
            this.vl.node.setAttribute("x2", np.x.toString());
            this.vl.node.setAttribute("y2", rect.height.toString());

            this.hl.node.setAttribute("y1", np.y.toString());
            this.hl.node.setAttribute("x2", rect.width.toString());
            this.hl.node.setAttribute("y2", np.y.toString());
        }

        public resize(width: number, height: number) {
            this.vl.node.setAttribute("y2", height.toString());
            this.hl.node.setAttribute("x2", width.toString());
        }

        public hide() {
            if (this.isVisible) {
                this.crossGroup.node.setAttribute("visibility", "hidden");
                this.isVisible = false;
            }
        }

        public show() {
            if (!this.isVisible) {
                this.crossGroup.node.setAttribute("visibility", "visible");
                this.isVisible = true;
            }          
        }

    }

    class RectElement implements IBase.IHideable, IBase.IResizable{
        public width: number;
        public height: number;

        public rect: Snap.Element;

        private isVisible:boolean = true;

        constructor(paper: Snap.Paper, rect:IBase.IRect){
           this.build(paper, rect.width, rect.height);
        }

        private build(paper: Snap.Paper, width:number, height:number){
            this.rect = paper.rect(0, 0, width, height);
            this.width = width;
            this.height = height;            
        }

        public move(p: IBase.IPoint2D) {           
            this.rect.node.setAttribute("x", p.x.toString());
            this.rect.node.setAttribute("y", p.y.toString());
        }

        public resize(width: number, height: number){
            this.width = width;
            this.height = height;

            this.rect.node.setAttribute("height", height.toString());
            this.rect.node.setAttribute("width", width.toString());
        }

        public hide() {
            if (this.isVisible) {
                this.rect.node.setAttribute("visibility", "hidden");
                this.isVisible = false;
            }
        }

        public show() {
            if (!this.isVisible) {
                this.rect.node.setAttribute("visibility", "visible");
                this.isVisible = true;
            }          
        }
    }

    export enum SelectionMode { RECT, TWOPOINTS, CENTRALPOINT };
    export enum SelectionModificator { RECT, SQUARE };

    export class AreaSelector {
        private baseParent:SVGSVGElement;
        private paper: Snap.Paper;
        private paperRect: Rect;

        private overlay: RectElement;
        private mask: RectElement;        
        private selectionBox: RectElement;

        private crossA: CrossElement;
        private crossB: CrossElement;
        private capturingState: boolean = false;
        private exclusiveCapturingState: boolean = false;
        private areaSelectorLayer: Snap.Element;
        private templateRect: RectElement;

        public onSelectionBeginCallback: Function;
        public onSelectionEndCallback: Function;

        private isEnabled: boolean = true;

        private selectionMode: SelectionMode = SelectionMode.RECT;
        private selectionModificator: SelectionModificator = SelectionModificator.RECT;

        private templateSize: Rect;
        public static DefaultTemplateSize: Rect = new Rect(20, 20);

        constructor(svgHost: SVGSVGElement, onSelectionBegin: Function, onSelectionEnd: Function){
            this.templateSize = AreaSelector.DefaultTemplateSize;

            this.buildUIElements(svgHost);
            this.subscribeToEvents();
            this.onSelectionEndCallback = onSelectionEnd;
            this.onSelectionBeginCallback = onSelectionBegin;
        }

        private buildUIElements(svgHost: SVGSVGElement) {
            this.baseParent = svgHost;
            this.paper = Snap(svgHost);
            this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

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

            this.templateRect = this.createTemplateRect();

            this.hideAll([this.crossA, this.crossB, this.templateRect, this.overlay]);

            this.areaSelectorLayer.add(this.overlay.rect);
            this.areaSelectorLayer.add(this.crossA.crossGroup);
            this.areaSelectorLayer.add(this.crossB.crossGroup);
            this.areaSelectorLayer.add(this.templateRect.rect);
        }

        private createOverlay(): RectElement {
            let r:RectElement = new RectElement(this.paper, this.paperRect);
            r.rect.addClass("overlayStyle");
            return r;
        }

        private createMask(): RectElement {
            let r:RectElement = new RectElement(this.paper, this.paperRect);            
            r.rect.addClass("overlayMaskStyle");
            return r;
        }

        private createSelectionBoxMask(): RectElement {
            let r:RectElement = new RectElement(this.paper, new Rect(0, 0));
            r.rect.addClass("selectionBoxMaskStyle");
            return r;
        }

        private createCross(): CrossElement {
            let cr:CrossElement = new CrossElement(this.paper, this.paperRect);  
            return cr;
        }

        private createTemplateRect(): RectElement {
            let r: RectElement = new RectElement(this.paper, this.templateSize);
            r.rect.addClass("templateRectStyle");
            return r;
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

        private resizeAll(elementSet: Array<IBase.IResizable>) {
            window.requestAnimationFrame(() => {
                elementSet.forEach(element => {
                    element.resize(this.paperRect.width, this.paperRect.height);                
                });
            })            
        }

        private showAll(elementSet: Array<IBase.IHideable>) {
            window.requestAnimationFrame(() => {
                elementSet.forEach(element => {
                    element.show();                
                });    
            })            
        }

        private hideAll(elementSet: Array<IBase.IHideable>) {
            window.requestAnimationFrame(() => {
                elementSet.forEach(element => {
                    element.hide();                
                }); 
            })            
        }

        private onPointerEnter(e:PointerEvent) {
            window.requestAnimationFrame(() => {
                this.crossA.show();

                if (this.selectionMode === SelectionMode.CENTRALPOINT) {
                    this.templateRect.show();
                }
            })            
        }

        private onPointerLeave(e:PointerEvent) {
            window.requestAnimationFrame(() => {
                let rect = this.baseParent.getClientRects();
                let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

                if (this.selectionMode === SelectionMode.RECT && !this.capturingState) {
                    this.hideAll([this.crossA, this.crossB, this.selectionBox]);
                } else if (this.selectionMode === SelectionMode.TWOPOINTS && this.capturingState) {
                    this.moveCross(this.crossB, p);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                } else if (this.selectionMode === SelectionMode.CENTRALPOINT) {
                    this.hideAll([this.templateRect, this.crossA, this.crossB]);
                }
            });
            
        }

        private onPointerDown(e:PointerEvent) {
            window.requestAnimationFrame(() => {
                if (this.selectionMode === SelectionMode.RECT) {
                    this.capturingState = true;

                    this.baseParent.setPointerCapture(e.pointerId);
                    this.moveCross(this.crossB, this.crossA);
                    this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);

                    this.showAll([this.overlay, this.crossB, this.selectionBox]);

                    if (typeof this.onSelectionBeginCallback === "function") {
                        this.onSelectionBeginCallback();
                    }
                } else if (this.selectionMode === SelectionMode.CENTRALPOINT) {
                    this.showAll([this.templateRect]);
                    this.moveTemplateRect(this.templateRect, this.crossA);
                    if (typeof this.onSelectionBeginCallback === "function") {
                        this.onSelectionBeginCallback();
                    }
                }
            });         
        }

        private onPointerUp(e:PointerEvent) {
            window.requestAnimationFrame(() => {
                let rect = this.baseParent.getClientRects();
                let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                
                if (this.selectionMode === SelectionMode.RECT) { 
                    this.capturingState = false;
                    this.baseParent.releasePointerCapture(e.pointerId);                    
                    this.hideAll([this.crossB, this.overlay]);
                    
                    if (typeof this.onSelectionEndCallback === "function") {
                        this.onSelectionEndCallback(this.crossA.x, this.crossA.y, this.crossB.x, this.crossB.y);
                    }
                } 
                else if (this.selectionMode === SelectionMode.TWOPOINTS) {
                    if (this.capturingState) {
                        this.capturingState = false;
                        this.hideAll([this.crossB, this.overlay]);

                        if (typeof this.onSelectionEndCallback === "function") {
                            this.onSelectionEndCallback(this.crossA.x, this.crossA.y, this.crossB.x, this.crossB.y);
                        }
                        this.moveCross(this.crossA, p);
                        this.moveCross(this.crossB, p);
                    } else {
                        this.capturingState = true;
                        this.moveCross(this.crossB, p);
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                        this.showAll([this.crossA, this.crossB, this.selectionBox, this.overlay]);

                        if (typeof this.onSelectionBeginCallback === "function") {
                            this.onSelectionBeginCallback();
                        }
                    }
                } else if (this.selectionMode === SelectionMode.CENTRALPOINT) {
                    if (typeof this.onSelectionEndCallback === "function") {
                        let p1 = new Point2D(this.crossA.x - this.templateSize.width/2, this.crossA.y - this.templateSize.height/2);
                        let p2 = new Point2D(this.crossA.x + this.templateSize.width/2, this.crossA.y + this.templateSize.height/2);
                        p1 = p1.boundToRect(this.paperRect);
                        p2 = p2.boundToRect(this.paperRect);
                        this.onSelectionEndCallback(p1.x, p1.y, p2.x, p2.y);
                    }
                }
            });
        }

        private onPointerMove(e:PointerEvent) {
            window.requestAnimationFrame(() => {
                let rect = this.baseParent.getClientRects();
                let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);

                this.crossA.show();

                if (this.selectionMode === SelectionMode.RECT) {
                    if (this.capturingState) {
                        this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);                    
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                    } else {
                        this.moveCross(this.crossA, p);
                    }
                } else if (this.selectionMode === SelectionMode.TWOPOINTS) {
                    if (this.capturingState) {
                        this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);                    
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                    } else {
                        this.moveCross(this.crossA, p);
                        this.moveCross(this.crossB, p);
                    }
                } else if (this.selectionMode === SelectionMode.CENTRALPOINT) {
                    this.templateRect.show();
                    this.moveCross(this.crossA, p);
                    this.moveTemplateRect(this.templateRect, this.crossA);
                }
            });
        }

        private onKeyDown(e:KeyboardEvent) {
            //Holding shift key enable square drawing mode
            if (e.shiftKey) {
                this.selectionModificator = SelectionModificator.SQUARE;
            } 

            if (this.selectionMode === SelectionMode.RECT || this.selectionMode === SelectionMode.TWOPOINTS) {
                if (e.ctrlKey && !this.capturingState) {
                    this.selectionMode = SelectionMode.TWOPOINTS;                   
                }
            } 
            // else if (this.selectionMode === SelectionMode.CENTRALPOINT) { }
        }

        private onKeyUp(e:KeyboardEvent) {
            //Holding shift key enable square drawing mode
            if (!e.shiftKey) {
                this.selectionModificator = SelectionModificator.RECT;
            }

            if (this.selectionMode === SelectionMode.RECT || this.selectionMode === SelectionMode.TWOPOINTS) {
                //Holding Ctrl key to enable two point selection mode
                if (!e.ctrlKey && this.selectionMode === SelectionMode.TWOPOINTS) {
                    this.selectionMode = SelectionMode.RECT;
                    this.capturingState = false;

                    this.moveCross(this.crossA, this.crossB);
                    this.hideAll([this.crossB, this.selectionBox, this.overlay]);
                }
            }
            // else if (this.selectionMode === SelectionMode.CENTRALPOINT) { }


            //Ctrl + N to add new region temporarily disabling all others
            if(e.ctrlKey && e.keyCode == 78 && !this.exclusiveCapturingState) {
                this.enableExclusiveMode();
                this.selectionMode = SelectionMode.RECT;
            } 
            //Escape to exit exclusive mode
            if(e.keyCode == 27) {
                this.disableExclusiveMode();
            }
        }

        private subscribeToEvents() {
            let listeners = [
                {event: "pointerenter", listener: this.onPointerEnter, base: this.baseParent, bypass: false},
                {event: "pointerleave", listener: this.onPointerLeave, base: this.baseParent, bypass: false},
                {event: "pointerdown", listener: this.onPointerDown, base: this.baseParent, bypass: false},
                {event: "pointerup", listener: this.onPointerUp, base: this.baseParent, bypass: false},
                {event: "pointermove", listener: this.onPointerMove, base: this.baseParent, bypass: true},
                {event: "keydown", listener: this.onKeyDown, base: window, bypass: false},
                {event: "keyup", listener: this.onKeyUp, base: window, bypass: false},
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

        private moveCross(cross:CrossElement, p:IBase.IPoint2D, square:boolean = false, refCross: CrossElement = null) {
            cross.move(p, this.paperRect, square, refCross);
        }        

        private moveSelectionBox(box: RectElement, crossA:CrossElement, crossB: CrossElement) {
            var x = (crossA.x < crossB.x) ? crossA.x : crossB.x;
            var y = (crossA.y < crossB.y) ? crossA.y : crossB.y;
            var w = Math.abs(crossA.x - crossB.x);
            var h = Math.abs(crossA.y - crossB.y);

            box.move(new Point2D(x, y));
            box.resize(w, h);
        }

        private moveTemplateRect(template: RectElement, crossA:CrossElement) {
            var x = crossA.x - template.width/2;
            var y = crossA.y - template.height/2;
            template.move(new Point2D(x, y));
        }

        public enable() {
            this.isEnabled = true;
            this.areaSelectorLayer.attr({
                display: "block"
            });
        }

        public disable() {
            if(!this.exclusiveCapturingState) {
                this.isEnabled = false;
                this.areaSelectorLayer.attr({
                    display: "none"
                });
            }
        }

        public setSelectionMode(selectionMode: SelectionMode, options?: { template?: Rect }) {
            this.selectionMode = selectionMode;
            if (selectionMode === SelectionMode.CENTRALPOINT) {
                if (options !== undefined && options.template !== undefined) {
                    this.setTemplate(options.template);
                } else {
                    this.setTemplate(AreaSelector.DefaultTemplateSize);
                }
                this.hideAll([this.overlay, this.selectionBox, this.crossB]);

            } else {
                this.templateRect.hide();
            }
        }

        private setTemplate(template: Rect) {
            this.templateSize = template;
            this.templateRect.resize(template.width, template.height);
        }

        private enablify(f:Function, bypass:boolean = false) {
            return (args:PointerEvent|KeyboardEvent) => {
                if (this.isEnabled || bypass) {
                    f(args);
                }
            }
        }
    }
}