/// <reference types="snapsvg" />
declare module "Interface/IRect" {
    export interface IRect {
        width: number;
        height: number;
        resize(width: number, height: number): void;
        copy(): IRect;
    }
}
declare module "Interface/IResizable" {
    export interface IResizable {
        resize(width: number, height: number): void;
    }
}
declare module "Core/CanvasTools.Rect" {
    import { IRect } from "Interface/IRect";
    import { IResizable } from "Interface/IResizable";
    export class Rect implements IRect, IResizable {
        width: number;
        height: number;
        constructor(width: number, height: number);
        resize(width: number, height: number): void;
        copy(): Rect;
    }
}
declare module "CanvasTools.Toolbar" {
    import * as Snap from "snapsvg";
    export type IconCallback = (action: string) => void;
    export type IconDescription = {
        action: string;
        iconUrl: string;
        tooltip: string;
        keycode: string;
        width: number;
        height: number;
    };
    export enum ToolbarItemType {
        SELECTOR = 0,
        SWITCH = 1,
        SEPARATOR = 2
    }
    abstract class ToolbarIconPrototype {
        static IconWidth: number;
        static IconHeight: number;
        protected x: number;
        protected y: number;
        width: number;
        height: number;
        protected paper: Snap.Paper;
        description: IconDescription;
        node: Snap.Element;
        protected isSelected: boolean;
        constructor(paper: Snap.Paper, icon?: IconDescription);
        move(x: number, y: number): void;
        resize(width: number, height: number): void;
        select(): void;
        unselect(): void;
        protected toggleSelection(): void;
    }
    export class ToolbarSelectIcon extends ToolbarIconPrototype {
        onAction: IconCallback;
        private iconBackgrounRect;
        private iconImage;
        private iconImageSVG;
        constructor(paper: Snap.Paper, icon: IconDescription, onAction: IconCallback);
        private buildIconUI;
        activate(): void;
        move(x: number, y: number): void;
        resize(width: number, height: number): void;
    }
    export class ToolbarSwitchIcon extends ToolbarIconPrototype {
        onAction: IconCallback;
        private iconBackgrounRect;
        private iconImage;
        private iconImageSVG;
        constructor(paper: Snap.Paper, icon: IconDescription, onAction: IconCallback);
        private buildIconUI;
        activate(): void;
        move(x: number, y: number): void;
        resize(width: number, height: number): void;
    }
    export class ToolbarSeparator extends ToolbarIconPrototype {
        private iconSeparator;
        constructor(paper: Snap.Paper, width: number);
        private buildIconUI;
        move(x: number, y: number): void;
        resize(width: number, height: number): void;
    }
    export class Toolbar {
        private baseParent;
        private paper;
        private paperRect;
        private backgroundRect;
        private iconsLayer;
        private iconSpace;
        private toolbarWidth;
        private toolbarHeight;
        private icons;
        private areHotKeysEnabled;
        constructor(svgHost: SVGSVGElement);
        private buildUIElements;
        private recalculateToolbarSize;
        private updateToolbarSize;
        addSelector(icon: IconDescription, actor: IconCallback): void;
        addSwitch(icon: IconDescription, actor: IconCallback): void;
        addSeparator(): void;
        private addIcon;
        private findIconByKeycode;
        private findIconByAction;
        private subscribeToKeyboardEvents;
        select(action: string): void;
        setSwitch(action: string, on: boolean): void;
        enableHotkeys(): void;
        disableHotkeys(): void;
    }
}
declare module "Interface/IPoint2D" {
    import { IRect } from "Interface/IRect";
    export interface IPoint2D {
        x: number;
        y: number;
        boundToRect(rect: IRect): IPoint2D;
    }
}
declare module "Core/CanvasTools.Point2D" {
    import { IRect } from "Interface/IRect";
    import { IPoint2D } from "Interface/IPoint2D";
    export class Point2D implements IPoint2D {
        x: number;
        y: number;
        constructor(x: number, y: number);
        boundToRect(r: IRect): Point2D;
    }
}
declare module "Core/CanvasTools.EventDescriptor" {
    export type EventDescriptor = {
        event: string;
        listener: (e: PointerEvent | MouseEvent | KeyboardEvent | WheelEvent) => void;
        base: SVGSVGElement | HTMLElement | Window;
        bypass: boolean;
    };
}
declare module "Interface/IHideadble" {
    export interface IHideable {
        hide(): void;
        show(): void;
    }
}
declare module "Interface/IMovable" {
    import { IPoint2D } from "Interface/IPoint2D";
    export interface IMovable {
        x: number;
        y: number;
        move(point: IPoint2D): void;
    }
}
declare module "Interface/IFreezable" {
    export interface IFreezable {
        freeze(): void;
        unfreeze(): void;
    }
}
declare module "CanvasTools.RegionComponent" {
    import { IHideable } from "Interface/IHideadble";
    import { IResizable } from "Interface/IResizable";
    import { IMovable } from "Interface/IMovable";
    import { IFreezable } from "Interface/IFreezable";
    import { IRect } from "Interface/IRect";
    import { Point2D } from "Core/CanvasTools.Point2D";
    import { EventDescriptor } from "Core/CanvasTools.EventDescriptor";
    import * as Snap from "snapsvg";
    export type ManipulationFunction = (UIElement?: RegionComponent) => void;
    export enum ChangeEventType {
        MOVEEND = 0,
        MOVING = 1,
        MOVEBEGIN = 2,
        SELECTIONTOGGLE = 3
    }
    export type ChangeFunction = (x: number, y: number, width: number, height: number, eventType?: ChangeEventType, multiSelection?: boolean) => void;
    export abstract class RegionComponent implements IHideable, IResizable, IMovable, IFreezable {
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
}
declare module "Core/CanvasTools.Tags" {
    export class Tag {
        colorHue: number;
        name: string;
        id: string;
        private __colorPure;
        readonly colorPure: string;
        private __colorAccent;
        readonly colorAccent: string;
        private __colorHighlight;
        readonly colorHighlight: string;
        private __colorShadow;
        readonly colorShadow: string;
        private __colorNoColor;
        readonly colorNoColor: string;
        private __colorDark;
        readonly colorDark: string;
        constructor(name: string, colorHue: number, id?: string);
        static getHueFromColor(color: string): number;
    }
    export class TagsDescriptor {
        primary: Tag;
        secondary: Array<Tag>;
        constructor(primaryTag: Tag, secondaryTags?: Array<Tag>);
        toString(): string;
    }
}
declare module "CanvasTools.TagsUpdateOptions" {
    export type TagsUpdateOptions = {
        showRegionBackground: boolean;
    };
}
declare module "CanvasTools.RectRegion" {
    import { IRect } from "Interface/IRect";
    import { IPoint2D } from "Interface/IPoint2D";
    import { RegionComponent, ManipulationFunction } from "CanvasTools.RegionComponent";
    import { TagsDescriptor } from "Core/CanvasTools.Tags";
    import { TagsUpdateOptions } from "CanvasTools.TagsUpdateOptions";
    import * as Snap from "snapsvg";
    export class RectRegion extends RegionComponent {
        area: number;
        private paperRects;
        node: Snap.Element;
        private dragNode;
        private anchorsNode;
        private tagsNode;
        private toolTip;
        private UI;
        tags: TagsDescriptor;
        ID: string;
        regionID: string;
        private styleID;
        private styleSheet;
        isSelected: boolean;
        private tagsUpdateOptions;
        onChange: Function;
        constructor(paper: Snap.Paper, rect: IRect, paperRect: IRect, id: string, tagsDescriptor: TagsDescriptor, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction, tagsUpdateOptions?: TagsUpdateOptions);
        private buildOn;
        private s8;
        private insertStyleSheet;
        removeStyles(): void;
        private onInternalChange;
        updateTags(tags: TagsDescriptor, options?: TagsUpdateOptions): void;
        move(p: IPoint2D): void;
        resize(width: number, height: number): void;
        select(): void;
        unselect(): void;
        freeze(): void;
        unfreeze(): void;
    }
}
declare module "CanvasTools.PointRegion" {
    import { IRect } from "Interface/IRect";
    import { IPoint2D } from "Interface/IPoint2D";
    import { RegionComponent, ManipulationFunction } from "CanvasTools.RegionComponent";
    import { TagsDescriptor } from "Core/CanvasTools.Tags";
    import { TagsUpdateOptions } from "CanvasTools.TagsUpdateOptions";
    import * as Snap from "snapsvg";
    export class PointRegion extends RegionComponent {
        area: number;
        node: Snap.Element;
        private dragNode;
        private tagsNode;
        private toolTip;
        private UI;
        tags: TagsDescriptor;
        ID: string;
        regionID: string;
        private styleID;
        private styleSheet;
        isSelected: boolean;
        private tagsUpdateOptions;
        onChange: Function;
        constructor(paper: Snap.Paper, paperRect: IRect, id: string, tagsDescriptor: TagsDescriptor, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction, tagsUpdateOptions?: TagsUpdateOptions);
        private buildOn;
        private s8;
        private insertStyleSheet;
        removeStyles(): void;
        private onInternalChange;
        updateTags(tags: TagsDescriptor, options?: TagsUpdateOptions): void;
        move(p: IPoint2D): void;
        resize(width: number, height: number): void;
        select(): void;
        unselect(): void;
        freeze(): void;
        unfreeze(): void;
    }
}
declare module "CanvasTools.RegionMenu" {
    import { IRect } from "Interface/IRect";
    import { IPoint2D } from "Interface/IPoint2D";
    import { RegionComponent, ManipulationFunction } from "CanvasTools.RegionComponent";
    import * as Snap from "snapsvg";
    export class MenuElement extends RegionComponent {
        private menuItemSize;
        private mx;
        private my;
        private mw;
        private mh;
        private dh;
        private dw;
        menuGroup: Snap.Paper;
        menuRect: Snap.Element;
        menuItemsGroup: Snap.Element;
        menuItems: Array<Snap.Element>;
        private region;
        constructor(paper: Snap.Paper, x: number, y: number, rect: IRect, paperRect?: IRect, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction);
        private buildOn;
        private pathCollection;
        addAction(action: string, icon: string, actor: Function): void;
        private rearrangeMenuPosition;
        attachTo(region: RegionComponent): void;
        move(p: IPoint2D): void;
        resize(width: number, height: number): void;
        hide(): void;
        show(): void;
        showOnRegion(region: RegionComponent): void;
    }
}
declare module "CanvasTools.RegionsManager" {
    import { IRect } from "Interface/IRect";
    import { IPoint2D } from "Interface/IPoint2D";
    import { ManipulationFunction } from "CanvasTools.RegionComponent";
    import { TagsDescriptor } from "Core/CanvasTools.Tags";
    export class RegionsManager {
        private baseParent;
        private paper;
        private paperRect;
        private regions;
        private menuLayer;
        private menu;
        onManipulationBegin: ManipulationFunction;
        onManipulationEnd: ManipulationFunction;
        onRegionSelected: Function;
        onRegionMove: Function;
        onRegionDelete: Function;
        private regionManagerLayer;
        private __isFrozen;
        readonly isFrozen: boolean;
        private frozenNuance;
        private tagsUpdateOptions;
        constructor(svgHost: SVGSVGElement, onManipulationBegin: ManipulationFunction, onManipulationEnd: ManipulationFunction);
        private buildOn;
        private subscribeToEvents;
        addRectRegion(id: string, pointA: IPoint2D, pointB: IPoint2D, tagsDescriptor: TagsDescriptor): void;
        addPointRegion(id: string, point: IPoint2D, tagsDescriptor: TagsDescriptor): void;
        drawRegion(x: number, y: number, rect: IRect, id: string, tagsDescriptor: TagsDescriptor): void;
        redrawAllRegions(): void;
        private sortRegionsByArea;
        private lookupRegionByID;
        private lookupSelectedRegions;
        getSelectedRegionsBounds(): {
            id: string;
            x: number;
            y: number;
            width: number;
            height: number;
        }[];
        private deleteRegion;
        private deleteSelectedRegions;
        deleteRegionById(id: string): void;
        deleteAllRegions(): void;
        updateTagsById(id: string, tagsDescriptor: TagsDescriptor): void;
        updateTagsForSelectedRegions(tagsDescriptor: TagsDescriptor): void;
        private selectRegion;
        private selectAllRegions;
        selectRegionById(id: string): void;
        private selectNextRegion;
        private reshapeRegion;
        private moveSelectedRegions;
        private resizeSelectedRegions;
        resize(width: number, height: number): void;
        private onManipulationBegin_local;
        private onManipulationEnd_local;
        private justManipulated;
        private onRegionUpdate;
        private unselectRegions;
        private toggleBackground;
        freeze(nuance?: string): void;
        unfreeze(): void;
        toggleFreezeMode(): void;
    }
}
declare module "CanvasTools.Selection" {
    import { IHideable } from "Interface/IHideadble";
    import { IResizable } from "Interface/IResizable";
    import { IRect } from "Interface/IRect";
    import * as Snap from "snapsvg";
    import { Rect } from "Core/CanvasTools.Rect";
    import { EventDescriptor } from "Core/CanvasTools.EventDescriptor";
    abstract class ElementPrototype implements IHideable, IResizable {
        protected paper: Snap.Paper;
        protected boundRect: IRect;
        node: Snap.Element;
        protected isVisible: boolean;
        constructor(paper: Snap.Paper, boundRect: IRect);
        hide(): void;
        show(): void;
        resize(width: number, height: number): void;
    }
    export enum SelectionMode {
        NONE = 0,
        POINT = 1,
        RECT = 2,
        COPYRECT = 3,
        POLYLINE = 4
    }
    export enum SelectionModificator {
        RECT = 0,
        SQUARE = 1
    }
    type SelectionCommit = {
        boundRect: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        };
        meta?: Object;
    };
    type SelectorCallbacks = {
        onSelectionBegin: () => void;
        onSelectionEnd: (commit: SelectionCommit) => void;
        onLocked?: () => void;
        onUnlocked?: () => void;
    };
    abstract class SelectorPrototype extends ElementPrototype {
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
    export class RectSelector extends SelectorPrototype {
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
    export class RectCopySelector extends SelectorPrototype {
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
    export class PointSelector extends SelectorPrototype {
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
    export class PolylineSelector extends SelectorPrototype {
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
    export class AreaSelector {
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
}
declare module "CanvasTools.Filter" {
    export type FilterFunction = (canvas: HTMLCanvasElement) => Promise<HTMLCanvasElement>;
    export function InvertFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
    export function GrayscaleFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
    export class FilterPipeline {
        private pipeline;
        constructor();
        addFilter(filter: FilterFunction): void;
        clearPipeline(): void;
        applyToCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
    }
}
declare module "CanvasTools.Editor" {
    import { ToolbarItemType } from "CanvasTools.Toolbar";
    import { RegionsManager } from "CanvasTools.RegionsManager";
    import { AreaSelector } from "CanvasTools.Selection";
    import { FilterPipeline } from "CanvasTools.Filter";
    import { RegionComponent } from "CanvasTools.RegionComponent";
    type ToolbarIconDescription = {
        type: ToolbarItemType.SELECTOR | ToolbarItemType.SWITCH;
        action: string;
        iconFile: string;
        tooltip: string;
        keycode: string;
        actionCallback: (action: string, rm: RegionsManager, sl: AreaSelector) => void;
        width?: number;
        height?: number;
        activate: boolean;
    } | {
        type: ToolbarItemType.SEPARATOR;
    };
    export class Editor {
        private static SVGDefsTemplate;
        private toolbar;
        private regionsManager;
        private areaSelector;
        private filterPipeline;
        private editorSVG;
        private contentCanvas;
        private editorDiv;
        private isRMFrozen;
        autoResize: boolean;
        constructor(editorZone: HTMLDivElement);
        private createSVGElement;
        private createCanvasElement;
        onRegionManipulationBegin(region?: RegionComponent): void;
        onRegionManipulationEnd(region?: RegionComponent): void;
        onRegionSelected(id: string, multiselection: boolean): void;
        onRegionMove(id: string, x: number, y: number, width: number, height: number): void;
        onRegionDelete(id: string): void;
        onSelectionBegin(): void;
        onSelectionEnd(commit: any): void;
        static FullToolbarSet: Array<ToolbarIconDescription>;
        static RectToolbarSet: Array<ToolbarIconDescription>;
        addToolbar(toolbarZone: HTMLDivElement, toolbarSet: Array<ToolbarIconDescription>, iconsPath: string): void;
        addContentSource(source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement): Promise<void>;
        resize(containerWidth: number, containerHeight: number): void;
        readonly RM: RegionsManager;
        readonly FilterPipeline: FilterPipeline;
    }
}
declare module "CanvasTools" {
    import { Toolbar as CTToolbar } from "CanvasTools.Toolbar";
    import { RegionsManager } from "CanvasTools.RegionsManager";
    import { PointRegion } from "CanvasTools.PointRegion";
    import { RectRegion } from "CanvasTools.RectRegion";
    import { AreaSelector, SelectionMode } from "CanvasTools.Selection";
    import { FilterPipeline } from "CanvasTools.Filter";
    import { Rect } from "Core/CanvasTools.Rect";
    import { Point2D } from "Core/CanvasTools.Point2D";
    import { TagsDescriptor, Tag } from "Core/CanvasTools.Tags";
    import { Editor as CTEditor } from "CanvasTools.Editor";
    export module CanvasTools {
        const Core: {
            Rect: typeof Rect;
            Point2D: typeof Point2D;
            TagsDescriptor: typeof TagsDescriptor;
            Tag: typeof Tag;
        };
        const Selection: {
            AreaSelector: typeof AreaSelector;
            SelectionMode: typeof SelectionMode;
        };
        const Region: {
            RegionsManager: typeof RegionsManager;
            PointRegion: typeof PointRegion;
            RectRegion: typeof RectRegion;
        };
        const Filter: typeof FilterPipeline;
        const Editor: typeof CTEditor;
        const Toolbar: typeof CTToolbar;
    }
    import "./../css/canvastools.css";
}
