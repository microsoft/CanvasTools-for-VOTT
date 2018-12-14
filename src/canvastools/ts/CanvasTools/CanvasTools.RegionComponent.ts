import { IHideable } from "./Interface/IHideadble";
import { IResizable } from "./Interface/IResizable";
import { IMovable } from "./Interface/IMovable";
import { IFreezable } from "./Interface/IFreezable";
import { IRect } from "./Interface/IRect";
import { IPoint2D } from "./Interface/IPoint2D";
import { Point2D } from "./Core/CanvasTools.Point2D";
import { Rect } from "./Core/CanvasTools.Rect";
import { EventDescriptor } from "./Core/CanvasTools.EventDescriptor";
import * as Snap from "snapsvg";

export type ManipulationFunction = (UIElement?: RegionComponent) => void;

export enum ChangeEventType { MOVEEND, MOVING, MOVEBEGIN, SELECTIONTOGGLE };

export type ChangeFunction = (x: number, y: number, width: number, height: number, eventType?: ChangeEventType, multiSelection?: boolean) => void;

export abstract class RegionComponent implements IHideable, IResizable, IMovable, IFreezable {
    protected paper: Snap.Paper;
    protected paperRect: IRect;

    public boundRect: IRect;

    public node: Snap.Element;

    public x: number;
    public y: number;

    protected isVisible: boolean = true;
    protected isFrozen: boolean = false;

    // Manipulation notifiers
    public onManipulationBegin: ManipulationFunction;
    public onManipulationEnd: ManipulationFunction;

    constructor(paper: Snap.Paper, paperRect: IRect) {
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

    protected makeFreezable(f: Function, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (!this.isFrozen || bypass) {
                f(args);
            }
        }
    }
}