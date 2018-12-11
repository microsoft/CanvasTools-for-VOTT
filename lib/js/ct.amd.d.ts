/// <reference types="snapsvg" />
declare module "Base/CanvasTools.Base.Interfaces" {
    export namespace CanvasTools.Base.Interfaces {
        interface IRect {
            width: number;
            height: number;
            resize(width: number, height: number): any;
            copy(): IRect;
        }
        interface IPoint2D {
            x: number;
            y: number;
            boundToRect(rect: IRect): IPoint2D;
        }
        interface IHideable {
            hide(): void;
            show(): void;
        }
        interface IFreezable {
            freeze(): void;
            unfreeze(): void;
        }
        interface IResizable {
            resize(width: number, height: number): void;
        }
        interface IMovable {
            x: number;
            y: number;
            move(point: IPoint2D): void;
        }
        interface IRegionPart extends IHideable, IResizable, IMovable {
            rect: IRect;
        }
    }
}
declare module "Base/CanvasTools.Base.Point2D" {
    import base = require("Base/CanvasTools.Base.Interfaces");
    import IBase = base.CanvasTools.Base.Interfaces;
    export namespace CanvasTools.Base.Point {
        class Point2D implements IBase.IPoint2D {
            x: number;
            y: number;
            constructor(x: number, y: number);
            boundToRect(r: IBase.IRect): Point2D;
        }
    }
}
declare module "Base/CanvasTools.Base.Rect" {
    import base = require("Base/CanvasTools.Base.Interfaces");
    import IBase = base.CanvasTools.Base.Interfaces;
    export namespace CanvasTools.Base.Rect {
        class Rect implements IBase.IRect, IBase.IResizable {
            width: number;
            height: number;
            constructor(width: number, height: number);
            resize(width: number, height: number): void;
            copy(): Rect;
        }
    }
}
declare module "Base/CanvasTools.Base.Tags" {
    export namespace CanvasTools.Base.Tags {
        class Tag {
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
        class TagsDescriptor {
            primary: Tag;
            secondary: Array<Tag>;
            constructor(primaryTag: Tag, secondaryTags?: Array<Tag>);
            toString(): string;
        }
    }
}
declare module "CanvasTools.Selection" {
    import CTBaseInterfaces = require("Base/CanvasTools.Base.Interfaces");
    import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
    import CTBaseRect = require("Base/CanvasTools.Base.Rect");
    import Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
    import * as Snap from "snapsvg";
    export module CanvasTools.Selection {
        abstract class ElementPrototype implements IBase.IHideable, IBase.IResizable {
            protected paper: Snap.Paper;
            protected boundRect: Rect;
            node: Snap.Element;
            protected isVisible: boolean;
            constructor(paper: Snap.Paper, boundRect: Rect);
            hide(): void;
            show(): void;
            resize(width: number, height: number): void;
        }
        enum SelectionMode {
            NONE = 0,
            POINT = 1,
            RECT = 2,
            COPYRECT = 3,
            POLYLINE = 4
        }
        enum SelectionModificator {
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
        type EventDescriptor = {
            event: string;
            listener: (e: PointerEvent | MouseEvent | KeyboardEvent | WheelEvent) => void;
            base: SVGSVGElement | HTMLElement | Window;
            bypass: boolean;
        };
        abstract class SelectorPrototype extends ElementPrototype {
            protected isEnabled: boolean;
            callbacks: SelectorCallbacks;
            constructor(paper: Snap.Paper, boundRect: Rect, callbacks?: SelectorCallbacks);
            enable(): void;
            disable(): void;
            protected subscribeToEvents(listeners: Array<EventDescriptor>): void;
            protected enablify(f: Function, bypass?: boolean): (args: KeyboardEvent | PointerEvent) => void;
            protected showAll(elements: Array<IBase.IHideable>): void;
            protected hideAll(elements: Array<IBase.IHideable>): void;
            protected resizeAll(elementSet: Array<IBase.IResizable>): void;
        }
        class RectSelector extends SelectorPrototype {
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
        class RectCopySelector extends SelectorPrototype {
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
        class PointSelector extends SelectorPrototype {
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
        class PolylineSelector extends SelectorPrototype {
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
        class AreaSelector {
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
}
declare module "CanvasTools.Filter" {
    export module CanvasTools.Filter {
        type FilterFunction = (canvas: HTMLCanvasElement) => Promise<HTMLCanvasElement>;
        function InvertFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
        function GrayscaleFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
        class FilterPipeline {
            private pipeline;
            constructor();
            addFilter(filter: FilterFunction): void;
            clearPipeline(): void;
            applyToCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
        }
    }
}
declare module "CanvasTools.Toolbar" {
    import * as Snap from "snapsvg";
    export module CanvasTools.Toolbar {
        type IconCallback = (action: string) => void;
        type IconDescription = {
            action: string;
            iconUrl: string;
            tooltip: string;
            keycode: string;
            width: number;
            height: number;
        };
        enum ToolbarItemType {
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
        class ToolbarSelectIcon extends ToolbarIconPrototype {
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
        class ToolbarSwitchIcon extends ToolbarIconPrototype {
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
        class ToolbarSeparator extends ToolbarIconPrototype {
            private iconSeparator;
            constructor(paper: Snap.Paper, width: number);
            private buildIconUI;
            move(x: number, y: number): void;
            resize(width: number, height: number): void;
        }
        class Toolbar {
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
}
declare module "Regions/CanvasTools.Regions.Base" {
    import * as CTBaseInterfaces from "Base/CanvasTools.Base.Interfaces";
    import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
    import * as CTBasePoint from "Base/CanvasTools.Base.Point2D";
    import Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
    import * as Snap from "snapsvg";
    export module CanvasTools.Region.RegionBase {
        type ManipulationFunction = (UIElement?: RegionComponentPrototype) => void;
        enum ChangeEventType {
            MOVEEND = 0,
            MOVING = 1,
            MOVEBEGIN = 2,
            SELECTIONTOGGLE = 3
        }
        type ChangeFunction = (x: number, y: number, width: number, height: number, eventType?: ChangeEventType, multiSelection?: boolean) => void;
        type EventDescriptor = {
            event: string;
            listener: (e: PointerEvent | MouseEvent | KeyboardEvent | WheelEvent) => void;
            base: SVGSVGElement | HTMLElement | Window;
            bypass: boolean;
        };
        type TagsUpdateOptions = {
            showRegionBackground: boolean;
        };
        abstract class RegionComponentPrototype implements IBase.IHideable, IBase.IResizable, IBase.IMovable, IBase.IFreezable {
            protected paper: Snap.Paper;
            protected paperRect: IBase.IRect;
            boundRect: IBase.IRect;
            node: Snap.Element;
            x: number;
            y: number;
            protected isVisible: boolean;
            protected isFrozen: boolean;
            onManipulationBegin: ManipulationFunction;
            onManipulationEnd: ManipulationFunction;
            constructor(paper: Snap.Paper, paperRect: IBase.IRect);
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
}
declare module "Regions/CanvasTools.Regions.RectRegion" {
    import * as CTBaseInterfaces from "Base/CanvasTools.Base.Interfaces";
    import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
    import * as CTBaseTag from "Base/CanvasTools.Base.Tags";
    import Tags = CTBaseTag.CanvasTools.Base.Tags;
    import * as CTRegion from "Regions/CanvasTools.Regions.Base";
    import RegionBase = CTRegion.CanvasTools.Region.RegionBase;
    import * as Snap from "snapsvg";
    export module CanvasTools.Region.RectRegion {
        class RectRegion extends RegionBase.RegionComponentPrototype {
            area: number;
            private paperRects;
            node: Snap.Element;
            private dragNode;
            private anchorsNode;
            private tagsNode;
            private toolTip;
            private UI;
            tags: Tags.TagsDescriptor;
            ID: string;
            regionID: string;
            private styleID;
            private styleSheet;
            isSelected: boolean;
            private tagsUpdateOptions;
            onChange: Function;
            constructor(paper: Snap.Paper, rect: IBase.IRect, paperRect: IBase.IRect, id: string, tagsDescriptor: Tags.TagsDescriptor, onManipulationBegin?: RegionBase.ManipulationFunction, onManipulationEnd?: RegionBase.ManipulationFunction, tagsUpdateOptions?: RegionBase.TagsUpdateOptions);
            private buildOn;
            private s8;
            private insertStyleSheet;
            removeStyles(): void;
            private onInternalChange;
            updateTags(tags: Tags.TagsDescriptor, options?: RegionBase.TagsUpdateOptions): void;
            move(p: IBase.IPoint2D): void;
            resize(width: number, height: number): void;
            select(): void;
            unselect(): void;
            freeze(): void;
            unfreeze(): void;
        }
    }
}
declare module "Regions/CanvasTools.Regions.PointRegion" {
    import * as CTBaseInterfaces from "Base/CanvasTools.Base.Interfaces";
    import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
    import * as CTBaseTag from "Base/CanvasTools.Base.Tags";
    import Tags = CTBaseTag.CanvasTools.Base.Tags;
    import * as CTRegion from "Regions/CanvasTools.Regions.Base";
    import RegionBase = CTRegion.CanvasTools.Region.RegionBase;
    import * as Snap from "snapsvg";
    export module CanvasTools.Region.PointRegion {
        class PointRegion extends RegionBase.RegionComponentPrototype {
            area: number;
            node: Snap.Element;
            private dragNode;
            private tagsNode;
            private toolTip;
            private UI;
            tags: Tags.TagsDescriptor;
            ID: string;
            regionID: string;
            private styleID;
            private styleSheet;
            isSelected: boolean;
            private tagsUpdateOptions;
            onChange: Function;
            constructor(paper: Snap.Paper, paperRect: IBase.IRect, id: string, tagsDescriptor: Tags.TagsDescriptor, onManipulationBegin?: RegionBase.ManipulationFunction, onManipulationEnd?: RegionBase.ManipulationFunction, tagsUpdateOptions?: RegionBase.TagsUpdateOptions);
            private buildOn;
            private s8;
            private insertStyleSheet;
            removeStyles(): void;
            private onInternalChange;
            updateTags(tags: Tags.TagsDescriptor, options?: RegionBase.TagsUpdateOptions): void;
            move(p: IBase.IPoint2D): void;
            resize(width: number, height: number): void;
            select(): void;
            unselect(): void;
            freeze(): void;
            unfreeze(): void;
        }
    }
}
declare module "Regions/CanvasTools.Regions.RegionMenu" {
    import * as CTBaseInterfaces from "Base/CanvasTools.Base.Interfaces";
    import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
    import * as CTRegion from "Regions/CanvasTools.Regions.Base";
    import RegionBase = CTRegion.CanvasTools.Region.RegionBase;
    import * as Snap from "snapsvg";
    export module CanvasTools.Region.RegionMenu {
        class MenuElement extends RegionBase.RegionComponentPrototype {
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
            constructor(paper: Snap.Paper, x: number, y: number, rect: IBase.IRect, paperRect?: IBase.IRect, onManipulationBegin?: RegionBase.ManipulationFunction, onManipulationEnd?: RegionBase.ManipulationFunction);
            private buildOn;
            private pathCollection;
            addAction(action: string, icon: string, actor: Function): void;
            private rearrangeMenuPosition;
            attachTo(region: RegionBase.RegionComponentPrototype): void;
            move(p: IBase.IPoint2D): void;
            resize(width: number, height: number): void;
            hide(): void;
            show(): void;
            showOnRegion(region: RegionBase.RegionComponentPrototype): void;
        }
    }
}
declare module "Regions/CanvasTools.Regions.RegionsManager" {
    import * as CTBaseInterfaces from "Base/CanvasTools.Base.Interfaces";
    import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
    import * as CTBaseTag from "Base/CanvasTools.Base.Tags";
    import Tags = CTBaseTag.CanvasTools.Base.Tags;
    import * as CTRegion from "Regions/CanvasTools.Regions.Base";
    import RegionBase = CTRegion.CanvasTools.Region.RegionBase;
    export module CanvasTools.Region {
        class RegionsManager {
            private baseParent;
            private paper;
            private paperRect;
            private regions;
            private menuLayer;
            private menu;
            onManipulationBegin: RegionBase.ManipulationFunction;
            onManipulationEnd: RegionBase.ManipulationFunction;
            onRegionSelected: Function;
            onRegionMove: Function;
            onRegionDelete: Function;
            private regionManagerLayer;
            private __isFrozen;
            readonly isFrozen: boolean;
            private frozenNuance;
            private tagsUpdateOptions;
            constructor(svgHost: SVGSVGElement, onManipulationBegin: RegionBase.ManipulationFunction, onManipulationEnd: RegionBase.ManipulationFunction);
            private buildOn;
            private subscribeToEvents;
            addRectRegion(id: string, pointA: IBase.IPoint2D, pointB: IBase.IPoint2D, tagsDescriptor: Tags.TagsDescriptor): void;
            addPointRegion(id: string, point: IBase.IPoint2D, tagsDescriptor: Tags.TagsDescriptor): void;
            drawRegion(x: number, y: number, rect: IBase.IRect, id: string, tagsDescriptor: Tags.TagsDescriptor): void;
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
            updateTagsById(id: string, tagsDescriptor: Tags.TagsDescriptor): void;
            updateTagsForSelectedRegions(tagsDescriptor: Tags.TagsDescriptor): void;
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
}
declare module "CanvasTools.Editor" {
    import CTSelection = require("CanvasTools.Selection");
    import Selection = CTSelection.CanvasTools.Selection;
    import CTRegionMgr = require("Regions/CanvasTools.Regions.RegionsManager");
    import CTRegionBase = require("Regions/CanvasTools.Regions.Base");
    import RegionsManager = CTRegionMgr.CanvasTools.Region.RegionsManager;
    import RegionComponent = CTRegionBase.CanvasTools.Region.RegionBase.RegionComponentPrototype;
    import CTToolbar = require("CanvasTools.Toolbar");
    import Toolbar = CTToolbar.CanvasTools.Toolbar;
    import CTFilter = require("CanvasTools.Filter");
    import Filter = CTFilter.CanvasTools.Filter;
    export module CanvasTools.Editor {
        type ToolbarIconDescription = {
            type: Toolbar.ToolbarItemType.SELECTOR | Toolbar.ToolbarItemType.SWITCH;
            action: string;
            iconFile: string;
            tooltip: string;
            keycode: string;
            actionCallback: (action: string, rm: RegionsManager, sl: Selection.AreaSelector) => void;
            width?: number;
            height?: number;
            activate: boolean;
        } | {
            type: Toolbar.ToolbarItemType.SEPARATOR;
        };
        class Editor {
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
            readonly FilterPipeline: Filter.FilterPipeline;
        }
    }
}
declare module "CanvasTools" {
    export * from "Base/CanvasTools.Base.Interfaces";
    import Point2D = require("Base/CanvasTools.Base.Point2D");
    import Rect = require("Base/CanvasTools.Base.Rect");
    import Tags = require("Base/CanvasTools.Base.Tags");
    import SelectionTool = require("CanvasTools.Selection");
    import FilterTool = require("CanvasTools.Filter");
    import ToolbarTools = require("CanvasTools.Toolbar");
    import RegionTools = require("Regions/CanvasTools.Regions.RegionsManager");
    import PointRegion = require("Regions/CanvasTools.Regions.PointRegion");
    import RectRegion = require("Regions/CanvasTools.Regions.RectRegion");
    import EditorTools = require("CanvasTools.Editor");
    export module CanvasTools {
        const Base: {
            Point: typeof Point2D.CanvasTools.Base.Point;
            Rect: typeof Rect.CanvasTools.Base.Rect;
            Tags: typeof Tags.CanvasTools.Base.Tags;
        };
        const Selection: typeof SelectionTool.CanvasTools.Selection;
        const Region: {
            RegionsManager: typeof RegionTools.CanvasTools.Region.RegionsManager;
            PointRegion: typeof PointRegion.CanvasTools.Region.PointRegion.PointRegion;
            RectRegion: typeof RectRegion.CanvasTools.Region.RectRegion.RectRegion;
        };
        const Filter: typeof FilterTool.CanvasTools.Filter;
        const Toolbar: typeof ToolbarTools.CanvasTools.Toolbar;
        const Editor: typeof EditorTools.CanvasTools.Editor.Editor;
    }
    import "./../css/canvastools.css";
}
