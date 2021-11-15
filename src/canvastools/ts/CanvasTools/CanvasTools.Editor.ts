import { FilterPipeline } from "./CanvasTools.Filter";
import { ConfigurationManager } from "./Core/ConfigurationManager";
import { Point2D } from "./Core/Point2D";
import { Rect } from "./Core/Rect";
import { RegionData } from "./Core/RegionData";
import { ZoomData, ZoomDirection, ZoomManager, ZoomProperties, ZoomType } from "./Core/ZoomManager";
import { RegionChangeFunction, RegionManipulationFunction } from "./Interface/IRegionCallbacks";
import { RegionSelectionFunction, RegionUpdateFunction } from "./Interface/IRegionsManagerCallbacks";
import {
    PointSelectionNotifyFunction,
    SelectionConfirmFunction,
    SelectionNotifyFunction,
} from "./Interface/ISelectorCallbacks";
import { SelectionMode } from "./Interface/ISelectorSettings";
import { IToolbarIcon } from "./Interface/IToolbarIcon";
import { IZoomCallbacks, ZoomUpdateFunction } from "./Interface/IZoomCallbacks";
import { RegionComponent } from "./Region/Component/RegionComponent";
import { RegionsManager } from "./Region/RegionsManager";
import { AreaSelector } from "./Selection/AreaSelector";
import { Toolbar } from "./Toolbar/Toolbar";
import { ToolbarItemType} from "./Toolbar/ToolbarIcon";

/**
 * Internal type to describe toolbar presets
 */
type ToolbarIconDescription = {
    type: ToolbarItemType.SELECTOR | ToolbarItemType.SWITCH | ToolbarItemType.TRIGGER,
    action: string,
    iconFile: string,
    tooltip: string,
    actionCallback: (action: string, rm: RegionsManager, sl: AreaSelector, zm: ZoomManager) => void,
    key: string[],
    width?: number,
    height?: number,
    activate: boolean,
} | {
    type: ToolbarItemType.SEPARATOR,
};

/**
 * Wraps internal CanvasTools components into one Editor experience.
 */
export class Editor {
    /**
     * The toolbar icons preset with all available features.
     */
    public static FullToolbarSet: ToolbarIconDescription[] = [
        {
            type: ToolbarItemType.SELECTOR,
            action: "none-select",
            iconFile: "none-selection.svg",
            tooltip: "Regions Manipulation (M)",
            key: ["M", "m"],
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.NONE });
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SEPARATOR,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "point-select",
            iconFile: "point-selection.svg",
            tooltip: "Point-selection (P)",
            key: ["P", "p"],
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.POINT });
                sl.show();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "rect-select",
            iconFile: "rect-selection.svg",
            tooltip: "Rectangular box (R)",
            key: ["R", "r"],
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.RECT });
                sl.show();
            },
            activate: true,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "copy-select",
            iconFile: "copy-t-selection.svg",
            tooltip: "Template-based box (T)",
            key: ["T", "t"],
            actionCallback: (action, rm, sl) => {
                const regions = rm.getSelectedRegions();
                if (regions !== undefined && regions.length > 0) {
                    const r = regions[0];
                    sl.setSelectionMode({
                        mode: SelectionMode.COPYRECT,
                        template: new Rect(r.regionData.width, r.regionData.height),
                    });
                } else {
                    sl.setSelectionMode({
                        mode: SelectionMode.COPYRECT,
                        template: new Rect(40, 40),
                    });
                }
                sl.show();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "polyline-select",
            iconFile: "polyline-selection.svg",
            tooltip: "Polyline-selection (Y)",
            key: ["Y", "y"],
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.POLYLINE });
                sl.show();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "polygon-select",
            iconFile: "polygon-selection.svg",
            tooltip: "Polygon-selection (O)",
            key: ["O", "o"],
            actionCallback: (action, rm, sl) => {
                ConfigurationManager.isModifyRegionOnlyMode = false;
                sl.setSelectionMode({ mode: SelectionMode.POLYGON });
                sl.show();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "pointer-add-remove-points-on-polygons",
            iconFile: "pointer-add-polygon-point.svg",
            tooltip: "Polygon add/remove points (U)",
            key: ["U", "u"],
            actionCallback: (action, rm, sl) => {
                if (!ConfigurationManager.isModifyRegionOnlyMode) {
                    ConfigurationManager.isModifyRegionOnlyMode = true;
                    sl.setSelectionMode({ mode: SelectionMode.POLYGON });
                    sl.show();
                }
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SEPARATOR,
        },
        {
            type: ToolbarItemType.TRIGGER,
            action: "delete-all-select",
            iconFile: "delete-all-selection.svg",
            tooltip: "Delete all regions",
            key: ["D", "d"],
            actionCallback: (action, rm, sl) => {
                rm.deleteAllRegions();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SEPARATOR,
        },
        {
            type: ToolbarItemType.SWITCH,
            action: "selection-lock",
            iconFile: "selection-lock.svg",
            tooltip: "Lock/unlock regions (L)",
            key: ["L", "l"],
            actionCallback: (action, rm, sl) => {
                rm.toggleFreezeMode();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SWITCH,
            action: "background-toggle",
            iconFile: "background-toggle.svg",
            tooltip: "Toggle Region Background (B)",
            key: ["B", "b"],
            actionCallback: (action, rm, sl) => {
                rm.toggleBackground();
            },
            activate: false,
        },
    ];

    /**
     * The toolbar icons preset with only rect-related features.
     */
    public static RectToolbarSet: ToolbarIconDescription[] = [
        {
            type: ToolbarItemType.SELECTOR,
            action: "none-select",
            iconFile: "none-selection.svg",
            tooltip: "Regions Manipulation (M)",
            key: ["M", "m"],
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.NONE });
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SEPARATOR,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "rect-select",
            iconFile: "rect-selection.svg",
            tooltip: "Rectangular box (R)",
            key: ["R", "r"],
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.RECT });
                sl.show();
            },
            activate: true,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "copy-select",
            iconFile: "copy-t-selection.svg",
            tooltip: "Template-based box (T)",
            key: ["T", "t"],
            actionCallback: (action, rm, sl) => {
                const regions = rm.getSelectedRegionsWithZoomScale();
                if (regions !== undefined && regions.length > 0) {
                    const r = regions[0];
                    sl.setSelectionMode({
                        mode: SelectionMode.COPYRECT,
                        template: new Rect(r.regionData.width, r.regionData.height),
                    });
                } else {
                    sl.setSelectionMode({
                        mode: SelectionMode.COPYRECT,
                        template: new Rect(40, 40),
                    });
                }
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SEPARATOR,
        },
        {
            type: ToolbarItemType.TRIGGER,
            action: "delete-all-select",
            iconFile: "delete-all-selection.svg",
            tooltip: "Delete all regions (D)",
            key: ["D", "d"],
            actionCallback: (action, rm, sl) => {
                rm.deleteAllRegions();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SEPARATOR,
        },
        {
            type: ToolbarItemType.SWITCH,
            action: "selection-lock",
            iconFile: "selection-lock.svg",
            tooltip: "Lock/unlock regions (L)",
            key: ["L", "l"],
            actionCallback: (action, rm, sl) => {
                rm.toggleFreezeMode();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SWITCH,
            action: "background-toggle",
            iconFile: "background-toggle.svg",
            tooltip: "Toggle Region Background (B)",
            key: ["B", "b"],
            actionCallback: (action, rm, sl) => {
                rm.toggleBackground();
            },
            activate: false,
        },
    ];

    /**
     * The toolbar icon group with only zoom related features.
     */
    private static ZoomIconGroupToolbar: ToolbarIconDescription[] = [
        {
            type: ToolbarItemType.TRIGGER,
            action: "zoom-in",
            iconFile: "zoom-in.svg",
            tooltip: "Zoom in (+)",
            key: ["+"],
            actionCallback: (action, rm, sl, zm) => {
                zm.callbacks.onZoomingIn();
            },
            activate: false,
        },
        {
            type: ToolbarItemType.TRIGGER,
            action: "zoom-out",
            iconFile: "zoom-out.svg",
            tooltip: "Zoom out (-)",
            key: ["-"],
            actionCallback: (action, rm, sl, zm) => {
                zm.callbacks.onZoomingOut();
            },
            activate: false,
        },
    ];

    /**
     * The toolbar icon group with only separator.
     */
    private static SeparatorIconGroupToolbar: ToolbarIconDescription[] = [
        {
            type: ToolbarItemType.SEPARATOR,
        },
    ];

    /**
     * Internal SVG template to define shadow filter.
     */
    private static SVGDefsTemplate = `
        <defs>
            <filter id="black-glow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.8" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>`;

    /**
     * Auto-resize flag to automatically update editor internals when the container (window) size is changed.
     */
    public autoResize: boolean = true;

    /**
     * A proxy wrapper around internal API for the `Editor` itself, `RegionsManager` (`RM`), `AreaSelector` (`AS`) and
     * `FilterPipeline` (`FP`).
     * @remarks As of now those apis do not overlap, so all methods/properties might be mapped from unified API.
     */
    public get api(): Editor & RegionsManager & AreaSelector & FilterPipeline & ZoomManager {
        return this.mergedAPI;
    }

    /**
     * Callback for `RegionsManager` called when some region is selected or unselected.
     */
    public onRegionSelected: RegionSelectionFunction;

    /**
     * Callback for `RegionsManager` called when some region is moving.
     */
    public onRegionMove: RegionUpdateFunction;

    /**
     * Callback for `RegionsManager` called when some region began moving.
     */
    public onRegionMoveBegin: RegionUpdateFunction;

    /**
     * Callback for `RegionsManager` called when some region ended moving.
     */
    public onRegionMoveEnd: RegionUpdateFunction;

    /**
     * Callback for `RegionsManager` called when some region is deleted from UI.
     */
    public onRegionDelete: RegionUpdateFunction;

    /**
     * Callback for `RegionsManager` called when pointer entered manipulation area.
     */
    public onManipulationBegin: RegionManipulationFunction;

    /**
     * Callback for `RegionsManager` called when pointer leaved manipulation area.
     */
    public onManipulationEnd: RegionManipulationFunction;

    /**
     * Callback for `AreaSelector` called when user began selecting (creating) new region.
     */
    public onSelectionBegin: SelectionNotifyFunction;

    /**
     * Callback for `AreaSelector` called when user ended selecting (creating) new region.
     */
    public onSelectionEnd: SelectionConfirmFunction;

    /**
     * Callback for `AreaSelector` called when the next point in `PolygonSelector` is drawn.
     */
    public onNextSelectionPoint: PointSelectionNotifyFunction;

    /**
     * Callback when user ended zoom function.
     */
    public onZoomEnd: ZoomUpdateFunction;

    /**
     * Internal reference to the proxy of APIs.
     */
    private mergedAPI: Editor & RegionsManager & AreaSelector & FilterPipeline & ZoomManager;

    /**
     * Internal reference to the `Toolbar` component.
     */
    private toolbar: Toolbar;

    /**
     * Internal reference to the `RegionsManager` component.
     */
    private regionsManager: RegionsManager;

    /**
     * Internal reference to the `AresSelector` component.
     */
    private areaSelector: AreaSelector;

    /**
     * Internal reference to the `FilterPipeline` component.
     */
    private filterPipeline: FilterPipeline;

    /**
     * Internal reference to the `ZoomManager` component.
     */
    private zoomManager: ZoomManager;

    /**
     * Reference to the host SVG element.
     */
    private editorSVG: SVGSVGElement;

    /**
     * Reference to the host canvas element.
     */
    private contentCanvas: HTMLCanvasElement;

    /**
     * Reference to the host div element (contains SVG and Canvas elements).
     */
    private editorDiv: HTMLDivElement;

    /**
     * Reference to the host container div element (contains editor div).
     */
    private editorContainerDiv: HTMLDivElement;

    /**
     * Internal reference to the RegionsManager freezing state.
     */
    private isRMFrozen: boolean = false;

    /**
     * The width of the source content.
     */
    private sourceWidth: number;

    /**
     * The height of the source content.
     */
    private sourceHeight: number;

    /**
     * The current frame width.
     */
    private frameWidth: number;

    /**
     * The current frame height.
     */
    private frameHeight: number;

    /**
     * Creates a new `Editor` in specified div-container.
     * @param container - The div-container for the editor.
     */
    constructor(container: HTMLDivElement);

    /**
     * Creates a new `Editor` in specified div-container and with custom building components.
     * @remarks - Originally created for testing purposes.
     * @param container - The div-container for the editor.
     * @param areaSelector - The `AreaSelector` component to use.
     * @param regionsManager - The `RegionsManager` component to use.
     */
    constructor(container: HTMLDivElement, areaSelector: AreaSelector, regionsManager: RegionsManager);

    /**
     * Creates a new `Editor` in specified div-container and with custom building components.
     * @remarks - Originally created for testing purposes.
     * @param container - The div-container for the editor.
     * @param areaSelector - The `AreaSelector` component to use.
     * @param regionsManager - The `RegionsManager` component to use.
     * @param filterPipeline - The `FilterPipeline` component to use.
     */
    constructor(container: HTMLDivElement, areaSelector: AreaSelector, regionsManager: RegionsManager,
                filterPipeline: FilterPipeline);

    /**
     * Creates a new `Editor` in specified div-container and with custom building components.
     * @remarks - Originally created for testing purposes.
     * @param container - The div-container for the editor.
     * @param areaSelector [Optional]- The `AreaSelector` component to use.
     * @param regionsManager [Optional]- The `RegionsManager` component to use.
     * @param filterPipeline [Optional]- The `FilterPipeline` component to use.
     * @param zoomProperties [Optional]- The properties of Zoom Manager to set
     */
    constructor(container: HTMLDivElement, areaSelector?: AreaSelector, regionsManager?: RegionsManager,
                filterPipeline?: FilterPipeline, zoomProperties?: ZoomProperties);

    constructor(container: HTMLDivElement, areaSelector?: AreaSelector, regionsManager?: RegionsManager,
                filterPipeline?: FilterPipeline, zoomProperties?: ZoomProperties) {
        // Create SVG Element
        this.contentCanvas = this.createCanvasElement();
        this.editorSVG = this.createSVGElement();

        this.editorContainerDiv = container;
        this.editorContainerDiv.classList.add("CanvasToolsContainer");
        this.editorContainerDiv.tabIndex = 0;

        this.editorDiv = this.createDivElement();
        this.editorDiv.classList.add("CanvasToolsEditor");

        this.editorDiv.append(this.contentCanvas);
        this.editorDiv.append(this.editorSVG);
        this.editorContainerDiv.append(this.editorDiv);

        // Init regionsManager
        const rmCallbacks = {
            onChange: null,
            onManipulationBegin: (region?: RegionComponent) => {
                this.areaSelector.hide();
                if (typeof this.onManipulationBegin === "function") {
                    this.onManipulationBegin(region);
                }
            },
            onManipulationEnd: (region?: RegionComponent) => {
                this.areaSelector.show();
                if (typeof this.onManipulationEnd === "function") {
                    this.onManipulationEnd(region);
                }
            },
            onRegionSelected: (id: string, multiselection: boolean) => {
                if (typeof this.onRegionSelected === "function") {
                    this.onRegionSelected(id, multiselection);
                }
            },
            onRegionMove: (id: string, regionData: RegionData) => {
                if (typeof this.onRegionMove === "function") {
                    this.onRegionMove(id, regionData);
                }
            },
            onRegionMoveBegin: (id: string, regionData: RegionData) => {
                if (typeof this.onRegionMoveBegin === "function") {
                    this.onRegionMoveBegin(id, regionData);
                }
            },
            onRegionMoveEnd: (id: string, regionData: RegionData) => {
                if (typeof this.onRegionMoveEnd === "function") {
                    this.onRegionMoveEnd(id, regionData);
                }
            },
            onRegionDelete: (id: string, regionData: RegionData) => {
                if (typeof this.onRegionDelete === "function") {
                    this.onRegionDelete(id, regionData);
                }
            },
        };

        if (regionsManager !== null && regionsManager !== undefined) {
            this.regionsManager = regionsManager;
            regionsManager.callbacks = rmCallbacks;
        } else {
            this.regionsManager = new RegionsManager(this.editorSVG, rmCallbacks);
        }

        // Init areaSelector
        const asCallbacks = {
            onSelectionBegin: () => {
                this.isRMFrozen = this.regionsManager.isFrozen;
                this.regionsManager.freeze();

                if (typeof this.onSelectionBegin === "function") {
                    this.onSelectionBegin();
                }
            },
            onSelectionEnd: (regionData: RegionData) => {
                if (!this.isRMFrozen) {
                    this.regionsManager.unfreeze();
                }

                if (typeof this.onSelectionEnd === "function") {
                    this.onSelectionEnd(regionData);
                }
            },
            onNextSelectionPoint: (point: Point2D) => {
                if (typeof this.onNextSelectionPoint === "function") {
                    this.onNextSelectionPoint(point);
                }
            },
        };
        if (areaSelector !== null && areaSelector !== undefined) {
            this.areaSelector = areaSelector;
            this.areaSelector.callbacks = asCallbacks;
        } else {
            this.areaSelector = new AreaSelector(this.editorSVG, asCallbacks);
        }

        // Init filterPipeline
        if (filterPipeline !== undefined && filterPipeline !== null) {
            this.filterPipeline = filterPipeline;
        } else {
            this.filterPipeline = new FilterPipeline();
        }

        // Init zoom manager
        const initZoomCallbacks: IZoomCallbacks = {
            onZoomingOut: () => {
                this.onZoom(ZoomDirection.Out);
            },
            onZoomingIn: () => {
                this.onZoom(ZoomDirection.In);
            },
            getZoomLevel: () => {
                return this.zoomManager.getZoomData().currentZoomScale;
            },
            setZoomLevel: (newZoomScale: number) => {
                this.onZoom(ZoomDirection.In, newZoomScale);
                return this.zoomManager.getZoomData();
            },
        };

        this.zoomManager = ZoomManager.getInstance(false, initZoomCallbacks);
        this.zoomManager.deleteInstance();
        this.zoomManager = ZoomManager.getInstance(false, initZoomCallbacks);

        if (zoomProperties && zoomProperties.isZoomEnabled) {
            this.zoomManager.isZoomEnabled = true;
            this.zoomManager.zoomType = zoomProperties.zoomType || ZoomType.Default;
        }

        // Adjust editor size
        this.resize(container.offsetWidth, container.offsetHeight);

        // Add proxy to regionsManager, areaSelector and filterPipeline;
        this.mergedAPI = new Proxy(this, {
            get: (target, prop) => {
                let p: any;
                let t: any;

                if (prop in target) {
                    t = target;
                    p = t[prop];
                } else if (prop in target.regionsManager) {
                    t = target.RM;
                    p = t[prop];
                } else if (prop in target.areaSelector) {
                    t = target.AS;
                    p = t[prop];
                } else if (prop in target.filterPipeline) {
                    t = target.FP;
                    p = t[prop];
                } else if (prop in target.zoomManager) {
                    t = target.FP;
                    p = t[prop];
                } else {
                    p = undefined;
                }

                if (typeof p === "function") {
                    return (...args) => {
                        p.apply(t, args);
                    };
                } else {
                    return p;
                }
            },
        }) as any;

        this.subscribeToEvents();

        // create aria live region for announcements
        const regionAnnouncer = document.createElement("div");
        regionAnnouncer.setAttribute("aria-live", "assertive");
        regionAnnouncer.setAttribute("tabindex", "-1");
        regionAnnouncer.id = "regionAnnouncer";
        container.appendChild(regionAnnouncer);
    }

    /**
     * Creates a new toolbar in specified div-container
     * @param container - The div-container for the toolbar.
     * @param toolbarSet - Icons set for the toolbar.
     * @param iconsPath - Path to the toolbar icons.
     */
    public addToolbar(container: HTMLDivElement, toolbarSet: ToolbarIconDescription[], iconsPath: string) {
        const svg = this.createSVGElement();
        container.append(svg);

        this.toolbar = new Toolbar(svg);

        if (toolbarSet === null || toolbarSet === undefined) {
            toolbarSet = Editor.FullToolbarSet;
        }

        // enable zoom feature in the toolbar
        if (this.zoomManager.isZoomEnabled) {
            toolbarSet = toolbarSet.concat(Editor.SeparatorIconGroupToolbar).concat(Editor.ZoomIconGroupToolbar);
        }

        let activeSelector: string;
        toolbarSet.forEach((item) => {
            if (item.type === ToolbarItemType.SEPARATOR) {
                this.toolbar.addSeparator();
            } else {
                const toolbarItem: IToolbarIcon = {
                    action: item.action,
                    iconUrl: iconsPath + item.iconFile,
                    tooltip: item.tooltip,
                    key: item.key,
                    width: item.width,
                    height: item.height,
                };

                const actionFn = (action) => {
                    item.actionCallback(action, this.regionsManager, this.areaSelector, this.zoomManager);
                };

                if (item.type === ToolbarItemType.SELECTOR) {
                    this.toolbar.addSelector(toolbarItem, actionFn);
                    if (item.activate) {
                        activeSelector = item.action;
                    }
                } else if (item.type === ToolbarItemType.SWITCH) {
                    this.toolbar.addSwitch(toolbarItem, actionFn);

                    this.toolbar.setSwitch(item.action, item.activate);
                } else if (item.type === ToolbarItemType.TRIGGER) {
                    this.toolbar.addTrigger(toolbarItem, actionFn);
                }
            }
        });

        this.toolbar.select(activeSelector);
    }

    /**
     * Updates the content source for the editor.
     * @param source - Content source.
     * @returns A new `Promise` resolved when content is drawn and Editor is resized.
     */
    public async addContentSource(source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement): Promise<void> {
        const buffCnvs = document.createElement("canvas");
        const context = buffCnvs.getContext("2d");

        if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
            this.sourceWidth = source.width;
            this.sourceHeight = source.height;
        } else if (source instanceof HTMLVideoElement) {
            this.sourceWidth = source.videoWidth;
            this.sourceHeight = source.videoHeight;
        }

        buffCnvs.width = this.sourceWidth;
        buffCnvs.height = this.sourceHeight;

        context.drawImage(source, 0, 0, buffCnvs.width, buffCnvs.height);

        return this.filterPipeline.applyToCanvas(buffCnvs).then((bcnvs) => {
            // Copy buffer to the canvas on screen
            this.contentCanvas.width = bcnvs.width;
            this.contentCanvas.height = bcnvs.height;
            const imgContext = this.contentCanvas.getContext("2d");
            imgContext.drawImage(bcnvs, 0, 0, bcnvs.width, bcnvs.height);
        }).then(() => {
            // resize the container of editor size to adjust to the new content size
            this.resize(this.editorContainerDiv.offsetWidth, this.editorContainerDiv.offsetHeight);

            this.handleZoomAfterContentUpdate();
        });
    }

    /**
     * Enable path regions
     * 
     * @remarks - Any polygon region created by the editor will become a path region (allowing curved shapes) while this setting is enabled.
     * @param enable - The new enabled state
     */
    public enablePathRegions(enable: boolean) {
        ConfigurationManager.isPathRegionEnabled = enable;
    }

    /**
     * Resize editor to new width and height.
     * @remarks - Use if the `autoResize` is `false`.
     * @param containerWidth - The new container width.
     * @param containerHeight - The new container height.
     */
    public resize(containerWidth: number, containerHeight: number) {
        this.frameWidth = containerWidth;
        this.frameHeight = containerHeight;

        const imgRatio = this.contentCanvas.width / this.contentCanvas.height;
        const containerRatio = containerWidth / containerHeight;

        let hpadding = 0;
        let vpadding = 0;

        if (imgRatio > containerRatio) {
            vpadding = (containerHeight - containerWidth / imgRatio) / 2;
            this.editorDiv.style.height = `calc(100% - ${vpadding * 2}px)`;
            this.editorDiv.style.width = "";
        } else {
            hpadding = (containerWidth - containerHeight * imgRatio) / 2;
            this.editorDiv.style.height = "";
            this.editorDiv.style.width = `calc(100% - ${hpadding * 2}px)`;
        }

        this.editorDiv.style.padding = `${vpadding}px ${hpadding}px`;

        this.frameWidth = containerWidth - hpadding * 2;
        this.frameHeight = containerHeight - vpadding * 2;

        this.areaSelector.resize(this.frameWidth, this.frameHeight);
        this.regionsManager.resize(this.frameWidth, this.frameHeight);
    }

    /**
     * Short reference to the `RegionsManager` component.
     */
    public get RM(): RegionsManager {
        return this.regionsManager;
    }

    /**
     * Short reference to the `AreaSelector` component.
     */
    public get AS(): AreaSelector {
        return this.areaSelector;
    }

    /**
     * Short reference to the `FilterPipeline` component.
     */
    public get FP(): FilterPipeline {
        return this.filterPipeline;
    }

    /**
     * Short reference to the `RegionsManager` component.
     */
    public get ZM(): ZoomManager {
        return this.zoomManager;
    }

    /**
     * Set polygon selection to be in add/remove points mode on anchors
     */
    public set isModifyRegionOnlyMode(value: boolean) {
        ConfigurationManager.isModifyRegionOnlyMode = value;
    }

    public get isModifyRegionOnlyMode() {
        return ConfigurationManager.isModifyRegionOnlyMode;
    }

    /**
     * Scales the `RegionData` object from frame to source size.
     * @param regionData - The `RegionData` object.
     * @param sourceWidth - [Optional] The source width.
     * @param sourceHeight - [Optional] The source height.
     * @returns Resized `RegionData` object.
     */
    public scaleRegionToSourceSize(regionData: RegionData, sourceWidth?: number, sourceHeight?: number): RegionData {
        const sw = (sourceWidth !== undefined) ? sourceWidth : this.sourceWidth;
        const sh = (sourceHeight !== undefined) ? sourceHeight : this.sourceHeight;

        const xf = sw / this.frameWidth;
        const yf = sh / this.frameHeight;

        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }

    /**
     * Scales the `RegionData` object from source to frame size.
     * @param regionData - The `RegionData` object.
     * @param sourceWidth - [Optional] The source width.
     * @param sourceHeight - [Optional] The source height.
     * @returns Resized `RegionData` object.
     */
    public scaleRegionToFrameSize(regionData: RegionData, sourceWidth?: number, sourceHeight?: number): RegionData {
        const sw = (sourceWidth !== undefined) ? sourceWidth : this.sourceWidth;
        const sh = (sourceHeight !== undefined) ? sourceHeight : this.sourceHeight;

        const xf = this.frameWidth / sw;
        const yf = this.frameHeight / sh;

        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }

    /**
     * Internal helper to create a new SVG element.
     */
    private createSVGElement(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.innerHTML = Editor.SVGDefsTemplate;
        svg.ondragstart = () => {
            return false;
        };
        svg.ondragend = () => {
            return false;
        };
        return svg;
    }

    /**
     * Internal helper to create a new HTMLCanvas element.
     */
    private createCanvasElement(): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        return canvas;
    }

    /**
     * Internal helper to create a new HTMLDiv element.
     */
    private createDivElement(): HTMLDivElement {
        const div = document.createElement("div");
        return div;
    }

    /**
     * Internal helper to set the editor container size properties.
     * Necessary for zoom feature, where the internal editor may container bigger content,
     * and a scroll bar needs to appear.
     * @param zoomType - A type that indicates whether we are zooming in or out.
     */
    private onZoom(zoomType: ZoomDirection, newScale?: number): void {
        if (!this.zoomManager.isZoomEnabled) {
            throw new Error("Zoom feature is not enabled");
        }

        const zoomData = this.zoomManager.updateZoomScale(zoomType, newScale);
        if (zoomData) {
            const scaledFrameWidth = (this.frameWidth / zoomData.previousZoomScale) * zoomData.currentZoomScale;
            const scaledFrameHeight = (this.frameHeight / zoomData.previousZoomScale) * zoomData.currentZoomScale;
            this.frameWidth = scaledFrameWidth;
            this.frameHeight = scaledFrameHeight;
            this.zoomEditorToScale(scaledFrameWidth, scaledFrameHeight, zoomData);

            // area selector updates after zoom
            this.areaSelector.resize(scaledFrameWidth, scaledFrameHeight);

            // regions on the canvas updates after zoom
            this.regionsManager.resize(scaledFrameWidth, scaledFrameHeight);

            // template box or rect copy selector updates after zoom.
            const regions = this.regionsManager.getSelectedRegionsWithZoomScale();
            this.areaSelector.updateRectCopyTemplateSelector(this.areaSelector.getRectCopyTemplate(regions));

            if (typeof this.onZoomEnd === "function") {
                this.onZoomEnd(zoomData);
            }
        }
    }

    private handleZoomAfterContentUpdate(): void {
        // check if the editor needs to be zoomed based on previous content source.
        if (this.zoomManager.isZoomEnabled) {
            const zoomData = this.zoomManager.getZoomData();
            const scaledFrameWidth = this.frameWidth * zoomData.currentZoomScale;
            const scaledFrameHeight = this.frameHeight * zoomData.currentZoomScale;
            this.frameWidth = scaledFrameWidth;
            this.frameHeight = scaledFrameHeight;
            this.zoomEditorToScale(scaledFrameWidth, scaledFrameHeight, zoomData);
            this.areaSelector.resize(scaledFrameWidth, scaledFrameHeight);
            this.regionsManager.resize(scaledFrameWidth, scaledFrameHeight);
        }
    }

    /**
     * Helper function to zoom the editor to given scale.
     */
    private zoomEditorToScale(scaledFrameWidth: number, scaledFrameHeight: number, zoomData: ZoomData): void {
        if (!this.editorContainerDiv && !this.editorContainerDiv.offsetWidth) {
            this.editorContainerDiv = document.getElementsByClassName("CanvasToolsContainer")[0] as HTMLDivElement;
            this.editorDiv = document.getElementsByClassName("CanvasToolsEditor")[0] as HTMLDivElement;
        }
        if (this.editorContainerDiv) {
            // scroll
            this.editorContainerDiv.style.overflow = zoomData.currentZoomScale === 1 ? "hidden" : "auto";
            const containerWidth = this.editorContainerDiv.offsetWidth;
            const containerHeight = this.editorContainerDiv.offsetHeight;

            let hpadding = 0;
            let vpadding = 0;

            if (scaledFrameWidth < containerWidth) {
                hpadding = (containerWidth - scaledFrameWidth) / 2;
                this.editorDiv.style.width = `calc(100% - ${hpadding * 2}px)`;
            } else {
                this.editorDiv.style.width = `${scaledFrameWidth}px`;
            }

            if (scaledFrameHeight < containerHeight) {
                vpadding = (containerHeight - scaledFrameHeight) / 2;
                this.editorDiv.style.height = `calc(100% - ${vpadding * 2}px)`;
            } else {
                this.editorDiv.style.height = `${scaledFrameHeight}px`;
            }

            // existence of either a vertical or horizontal scroll bar
            // clientWidth is the offsetWidth - scrollbarWidth
            if (hpadding && !vpadding) {
                hpadding = (this.editorContainerDiv.clientWidth - scaledFrameWidth) / 2;
                this.editorDiv.style.width = `calc(100% - ${hpadding * 2}px)`;
            }

            if (!hpadding && vpadding) {
                vpadding = (this.editorContainerDiv.clientHeight - scaledFrameHeight) / 2;
                this.editorDiv.style.height = `calc(100% - ${vpadding * 2}px)`;
            }

            this.editorDiv.style.padding = `${vpadding}px ${hpadding}px`;
            // focus on the editor container div so that scroll bar can be used via arrow keys
            this.editorContainerDiv.focus();

            // when the zooming is around the actual center of the image
            if (this.zoomManager.zoomType === ZoomType.ImageCenter) {
                if (this.editorContainerDiv.scrollHeight > this.editorContainerDiv.clientHeight) {
                    this.editorContainerDiv.scrollTop =
                    (this.editorDiv.clientHeight - this.editorContainerDiv.clientHeight) / 2;
                }

                if (this.editorContainerDiv.scrollWidth > this.editorContainerDiv.clientWidth) {
                    this.editorContainerDiv.scrollLeft =
                    (this.editorDiv.clientWidth - this.editorContainerDiv.clientWidth) / 2;
                }
            }

            // when the zooming is around the center of the image currently in the view port of editor container.
            if (this.zoomManager.zoomType === ZoomType.ViewportCenter) {
                // get the current scroll position
                const currentScrollPos = {
                    left: this.editorContainerDiv.scrollLeft,
                    top: this.editorContainerDiv.scrollTop,
                };

                // get the current center of the viewport
                const currentCenterInView = {
                    x: (this.editorContainerDiv.clientWidth / 2) + currentScrollPos.left,
                    y: (this.editorContainerDiv.clientHeight / 2) + currentScrollPos.top,
                };

                // get the current center of the viewport once its is scaled based on zoom data
                const zoomedCenterInView = {
                    x: (currentCenterInView.x / zoomData.previousZoomScale) * zoomData.currentZoomScale,
                    y: (currentCenterInView.y / zoomData.previousZoomScale) * zoomData.currentZoomScale,
                };

                // get the difference between the expected scaled viewport center and current viewport center
                const expectedScrollPosDifference = {
                    left: zoomedCenterInView.x - currentCenterInView.x,
                    top: zoomedCenterInView.y - currentCenterInView.y,
                };

                // get the expected scaled scroll position
                const expectedScrollPos = {
                    left: currentScrollPos.left + expectedScrollPosDifference.left,
                    top: currentScrollPos.top + expectedScrollPosDifference.top,
                };

                this.editorContainerDiv.scrollLeft = expectedScrollPos.left;
                this.editorContainerDiv.scrollTop = expectedScrollPos.top;
            }
        }
    }

    /**
     * Helper function to subscribe manager to keyboard events.
     */
    private subscribeToEvents() {
        // automatically resize internals on window resize
        window.addEventListener("resize", (e) => {
            if (this.autoResize) {
                this.resize(this.editorContainerDiv.offsetWidth, this.editorContainerDiv.offsetHeight);
                this.handleZoomAfterContentUpdate();
            }
        });
    }
}
