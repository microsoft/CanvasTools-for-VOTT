import { IHideable } from "./Interface/IHideadble";
import { IResizable } from "./Interface/IResizable";
import { IMovable } from "./Interface/IMovable";
import { IFreezable } from "./Interface/IFreezable";
import { IRect } from "./Interface/IRect";
import { Point2D } from "./Core/CanvasTools.Point2D";
import { EventDescriptor } from "./Core/CanvasTools.EventDescriptor";
import * as Snap from "snapsvg";
export declare type ManipulationFunction = (UIElement?: RegionComponent) => void;
export declare enum ChangeEventType {
    MOVEEND = 0,
    MOVING = 1,
    MOVEBEGIN = 2,
    SELECTIONTOGGLE = 3
}
export declare type ChangeFunction = (x: number, y: number, width: number, height: number, eventType?: ChangeEventType, multiSelection?: boolean) => void;
export declare abstract class RegionComponent implements IHideable, IResizable, IMovable, IFreezable {
    protected paper: Snap.Paper;
    protected paperRect: IRect;
    boundRect: IRect;
    node: Snap.Element;
    x: number;
    y: number;
    protected isVisible: boolean;
    protected isFrozen: boolean;
    onManipulationBegin: ManipulationFunction;
    onManipulationEnd: ManipulationFunction;
    constructor(paper: Snap.Paper, paperRect: IRect);
    hide(): void;
    show(): void;
    freeze(): void;
    unfreeze(): void;
    resize(width: number, height: number): void;
    resizePaper(width: number, height: number): void;
    move(point: Point2D): void;
    protected subscribeToEvents(listeners: Array<EventDescriptor>): void;
    protected makeFreezable(f: Function, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
}
