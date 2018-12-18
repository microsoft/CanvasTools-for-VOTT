import { IHideable } from "./Interface/IHideadble";
import { IResizable } from "./Interface/IResizable";
import { IMovable } from "./Interface/IMovable";
import { IFreezable } from "./Interface/IFreezable";
import { Point2D } from "./Core/CanvasTools.Point2D";
import { Rect } from "./Core/CanvasTools.Rect";
import { EventDescriptor } from "./Core/CanvasTools.EventDescriptor";
import * as Snap from "snapsvg-cjs";

export type ManipulationFunction = (UIElement?: RegionComponent) => void;

export enum ChangeEventType { MOVEEND, MOVING, MOVEBEGIN, SELECTIONTOGGLE };

export type ChangeFunction = (region: RegionComponent, x: number, y: number, width: number, height: number, points?: Array<Point2D>, eventType?: ChangeEventType, multiSelection?: boolean) => void;

export abstract class RegionComponent implements IHideable, IResizable, IMovable, IFreezable {
    protected paper: Snap.Paper;
    protected paperRect: Rect;

    public boundRect: Rect;

    public node: Snap.Element;

    public x: number;
    public y: number;
    
    public get width() {
        return this.boundRect.width;
    }

    public get height() {
        return this.boundRect.height;
    }

    protected isVisible: boolean = true;
    protected isFrozen: boolean = false;

    // Manipulation notifiers
    public onManipulationBegin: ManipulationFunction;
    public onManipulationEnd: ManipulationFunction;

    constructor(paper: Snap.Paper, paperRect: Rect) {
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

    public move(point: IMovable): void;
    public move(x: number, y: number): void;

    public move(arg1: any, arg2?: any): void {
        if (typeof arg1 === "number" && typeof arg2 === "number") {
            this.x = arg1;
            this.y = arg2;
        } else if (arg1.x !== undefined && arg1.y !== undefined) {
            this.x = arg1.x;
            this.y = arg1.y;
        }        
    }

    public onChange: ChangeFunction;

    protected subscribeToEvents(listeners: Array<EventDescriptor>) {
        listeners.forEach(e => {
            e.base.addEventListener(e.event, this.makeFreezable(e.listener.bind(this), e.bypass));
        });
    }

    protected makeFreezable(f: Function, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (!this.isFrozen || bypass) {
                f(args);
            }
        }
    }
}