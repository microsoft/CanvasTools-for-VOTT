import { IHideable } from "./Interface/IHideadble";
import { IResizable } from "./Interface/IResizable";
import { IRect } from "./Interface/IRect";
import * as Snap from "snapsvg";
import { Rect } from "./Core/CanvasTools.Rect";
import { EventDescriptor } from "./Core/CanvasTools.EventDescriptor";
declare abstract class ElementPrototype implements IHideable, IResizable {
    protected paper: Snap.Paper;
    protected boundRect: IRect;
    node: Snap.Element;
    protected isVisible: boolean;
    constructor(paper: Snap.Paper, boundRect: IRect);
    hide(): void;
    show(): void;
    resize(width: number, height: number): void;
}
export declare enum SelectionMode {
    NONE = 0,
    POINT = 1,
    RECT = 2,
    COPYRECT = 3,
    POLYLINE = 4
}
export declare enum SelectionModificator {
    RECT = 0,
    SQUARE = 1
}
declare type SelectionCommit = {
    boundRect: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    meta?: Object;
};
declare type SelectorCallbacks = {
    onSelectionBegin: () => void;
    onSelectionEnd: (commit: SelectionCommit) => void;
    onLocked?: () => void;
    onUnlocked?: () => void;
};
declare abstract class SelectorPrototype extends ElementPrototype {
    protected isEnabled: boolean;
    callbacks: SelectorCallbacks;
    constructor(paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
    enable(): void;
    disable(): void;
    protected subscribeToEvents(listeners: Array<EventDescriptor>): void;
    protected enablify(f: Function, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
    protected showAll(elements: Array<IHideable>): void;
    protected hideAll(elements: Array<IHideable>): void;
    protected resizeAll(elementSet: Array<IResizable>): void;
}
export declare class RectSelector extends SelectorPrototype {
    private parentNode;
    private crossA;
    private crossB;
    private selectionBox;
    private mask;
    private capturingState;
    private isTwoPoints;
    private selectionModificator;
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
    private buildUIElements;
    private moveCross;
    private moveSelectionBox;
    private onPointerEnter;
    private onPointerLeave;
    private onPointerDown;
    private onPointerUp;
    private onPointerMove;
    private onKeyDown;
    private onKeyUp;
    resize(width: number, height: number): void;
    hide(): void;
    show(): void;
}
export declare class RectCopySelector extends SelectorPrototype {
    private parentNode;
    private copyRect;
    private crossA;
    private copyRectEl;
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, copyRect: Rect, callbacks?: SelectorCallbacks);
    private buildUIElements;
    private moveCross;
    private moveCopyRect;
    setTemplate(copyRect: Rect): void;
    private onPointerEnter;
    private onPointerLeave;
    private onPointerDown;
    private onPointerUp;
    private onPointerMove;
    private onWheel;
    resize(width: number, height: number): void;
    hide(): void;
    show(): void;
}
export declare class PointSelector extends SelectorPrototype {
    private parentNode;
    private crossA;
    private point;
    private pointRadius;
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
    private buildUIElements;
    private moveCross;
    private movePoint;
    private onPointerEnter;
    private onPointerLeave;
    private onPointerDown;
    private onPointerUp;
    private onPointerMove;
    resize(width: number, height: number): void;
    hide(): void;
    show(): void;
}
export declare class PolylineSelector extends SelectorPrototype {
    private parentNode;
    private crossA;
    private nextPoint;
    private nextSegment;
    private pointsGroup;
    private polyline;
    private points;
    private lastPoint;
    private pointRadius;
    private isCapturing;
    private capturePointerId;
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
    private buildUIElements;
    private reset;
    private moveCross;
    private movePoint;
    private moveLine;
    private addPoint;
    private onPointerEnter;
    private onPointerLeave;
    private onPointerDown;
    private onClick;
    private onPointerMove;
    private onDoubleClick;
    private submitPolyline;
    private onKeyUp;
    resize(width: number, height: number): void;
    hide(): void;
    show(): void;
}
export declare class AreaSelector {
    private parentNode;
    private paper;
    private boundRect;
    private areaSelectorLayer;
    private selector;
    private rectSelector;
    private rectCopySelector;
    private pointSelector;
    private polylineSelector;
    callbacks: SelectorCallbacks;
    private isEnabled;
    private isVisible;
    static DefaultTemplateSize: Rect;
    constructor(svgHost: SVGSVGElement, callbacks?: SelectorCallbacks);
    private buildUIElements;
    resize(width: number, height: number): void;
    enable(): void;
    disable(): void;
    show(): void;
    hide(): void;
    setSelectionMode(selectionMode: SelectionMode, options?: {
        template?: Rect;
    }): void;
    protected enablify(f: Function, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
}
export {};
