import * as CTBaseInterfaces from "../Base/CanvasTools.Base.Interfaces";
import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
import * as CTBaseRect from "../Base/CanvasTools.Base.Rect";
import Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
import * as CTBasePoint from "../Base/CanvasTools.Base.Point2D";
import Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
import * as CTBaseTag from "../Base/CanvasTools.Base.Tags";
import Tags = CTBaseTag.CanvasTools.Base.Tags;

import * as Snap from "snapsvg";

export module CanvasTools.Region.RegionBase { 
    export type ManipulationFunction = (UIElement?: RegionComponentPrototype) => void;

    export enum ChangeEventType { MOVEEND, MOVING, MOVEBEGIN, SELECTIONTOGGLE };

    export type ChangeFunction = (x: number, y: number, width:number, height:number, eventType?: ChangeEventType, multiSelection?: boolean) => void;

    export type EventDescriptor = {
        event: string, 
        listener: (e:PointerEvent|MouseEvent|KeyboardEvent|WheelEvent) => void, 
        base: SVGSVGElement | HTMLElement | Window, 
        bypass: boolean
    };

    export abstract class RegionComponentPrototype implements IBase.IHideable, IBase.IResizable, IBase.IMovable, IBase.IFreezable {
        protected paper: Snap.Paper;
        protected paperRect: IBase.IRect;

        public boundRect: IBase.IRect;

        public node: Snap.Element;

        public x: number;
        public y: number;

        protected isVisible:boolean = true;
        protected isFrozen:boolean = false;

        // Manipulation notifiers
        public onManipulationBegin: ManipulationFunction;
        public onManipulationEnd: ManipulationFunction;

        constructor(paper:Snap.Paper, paperRect: IBase.IRect) {
            this.paper = paper;
            this.paperRect = paperRect;
            this.boundRect = new Rect(0, 0);
        }

        public hide() {
            this.node.node.setAttribute("visibility", "hidden");
            this.isVisible = false;
        }

        public show() {
            this.node.node.setAttribute("visibility", "visible");
            this.isVisible = true;
        }

        public freeze() {
            this.isFrozen = true;
        }
        
        public unfreeze() {
            this.isFrozen = false;
        }

        public resize(width: number, height: number) {
            this.boundRect.resize(width, height);
        }

        public resizePaper(width: number, height: number) {
            this.paperRect.resize(width, height);
        }

        public move(point: Point2D) {
            this.x = point.x;
            this.y = point.y;
        }

        protected subscribeToEvents(listeners: Array<EventDescriptor>) {
            listeners.forEach(e => {
                e.base.addEventListener(e.event, this.makeFreezable(e.listener.bind(this), e.bypass));            
            });
        }

        protected makeFreezable(f:Function, bypass:boolean = false) {
            return (args:PointerEvent|KeyboardEvent) => {
                if (!this.isFrozen || bypass) {
                    f(args);
                }
            }
        }
    }
}