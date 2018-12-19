import { Point2D } from "../Core/CanvasTools.Point2D";
import { Rect } from "../Core/CanvasTools.Rect";

import { IEventDescriptor } from "../Interface/IEventDescriptor";
import { IFreezable } from "../Interface/IFreezable";
import { IHideable } from "../Interface/IHideadble";
import { IMovable } from "../Interface/IMovable";
import { IResizable } from "../Interface/IResizable";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export type ManipulationFunction = (UIElement?: RegionComponent) => void;

export enum ChangeEventType { MOVEEND, MOVING, MOVEBEGIN, SELECTIONTOGGLE }

export type ChangeFunction = (region: RegionComponent, x: number, y: number,
                              width: number, height: number, points?: Point2D[],
                              eventType?: ChangeEventType, multiSelection?: boolean) => void;

export abstract class RegionComponent implements IHideable, IResizable, IMovable, IFreezable {
    public boundRect: Rect;

    public node: Snap.Element;

    // Manipulation notifiers
    public onChange: ChangeFunction;
    public onManipulationBegin: ManipulationFunction;
    public onManipulationEnd: ManipulationFunction;

    public x: number;
    public y: number;

    public isVisible: boolean = true;
    public isFrozen: boolean = false;
    public isSelected: boolean = false;

    protected paper: Snap.Paper;
    protected paperRect: Rect;

    public get width() {
        return this.boundRect.width;
    }

    public get height() {
        return this.boundRect.height;
    }

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

    public select() {
        this.isSelected = true;
        this.node.addClass("selected");
    }

    public unselect() {
        this.isSelected = false;
        this.node.removeClass("selected");
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

    protected subscribeToEvents(listeners: IEventDescriptor[]) {
        listeners.forEach((e) => {
            e.base.addEventListener(e.event, this.makeFreezable(e.listener.bind(this), e.bypass));
        });
    }

    protected makeFreezable(f: (args: PointerEvent | KeyboardEvent) => void, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (!this.isFrozen || bypass) {
                f(args);
            }
        };
    }
}
