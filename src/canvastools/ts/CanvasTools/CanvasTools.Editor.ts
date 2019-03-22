import { FilterPipeline } from "./CanvasTools.Filter";

import { Rect } from "./Core/Rect";
import { RegionData } from "./Core/RegionData";

import { RegionManipulationFunction, RegionChangeFunction } from "./Interface/IRegionCallbacks";
import { RegionUpdateFunction, RegionSelectionFunction } from "./Interface/IRegionsManagerCallbacks";
import { SelectionNotifyFunction, SelectionConfirmFunction } from "./Interface/ISelectorCallbacks";
import { SelectionMode } from "./Interface/ISelectorSettings";

import { RegionComponent } from "./Region/Component/RegionComponent";
import { RegionsManager } from "./Region/RegionsManager";

import { AreaSelector } from "./Selection/AreaSelector";

import { ToolbarItemType} from "./Toolbar/ToolbarIcon";
import { Toolbar } from "./Toolbar/Toolbar";
import { IToolbarIcon } from "./Interface/IToolbarIcon";

/**
 * Internal type to describe toolbar presets
 */
type ToolbarIconDescription = {
    type: ToolbarItemType.SELECTOR | ToolbarItemType.SWITCH | ToolbarItemType.TRIGGER,
    action: string,
    iconFile: string,
    tooltip: string,
    keycode: string,
    actionCallback: (action: string, rm: RegionsManager, sl: AreaSelector) => void,
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
            keycode: "KeyM",
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
            keycode: "KeyP",
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.POINT });
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "rect-select",
            iconFile: "rect-selection.svg",
            tooltip: "Rectangular box (R)",
            keycode: "KeyR",
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.RECT });
            },
            activate: true,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "copy-select",
            iconFile: "copy-t-selection.svg",
            tooltip: "Template-based box (T)",
            keycode: "KeyT",
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
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "polyline-select",
            iconFile: "polyline-selection.svg",
            tooltip: "Polyline-selection (Y)",
            keycode: "KeyY",
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.POLYLINE });
            },
            activate: false,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "polygon-select",
            iconFile: "polygon-selection.svg",
            tooltip: "Polygon-selection (O)",
            keycode: "KeyO",
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.POLYGON });
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
            keycode: "",
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
            keycode: "KeyL",
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
            keycode: "KeyB",
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
            keycode: "KeyM",
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
            keycode: "KeyR",
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode({ mode: SelectionMode.RECT });
            },
            activate: true,
        },
        {
            type: ToolbarItemType.SELECTOR,
            action: "copy-select",
            iconFile: "copy-t-selection.svg",
            tooltip: "Template-based box (T)",
            keycode: "KeyT",
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
            keycode: "",
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
            keycode: "KeyL",
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
            keycode: "KeyB",
            actionCallback: (action, rm, sl) => {
                rm.toggleBackground();
            },
            activate: false,
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
     * A proxi wrapper around internal API for the `Editor` itself, `RegionsManager` (`RM`), `AreaSelector` (`AS`) and
     * `FilterPipeline` (`FP`).
     * @remarks As of now those apis do not overlap, so all methods/properties might be mapped from unified API.
     */
    public get api(): Editor & RegionsManager & AreaSelector & FilterPipeline {
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
     * Internal reference to the proxi of APIs.
     */
    private mergedAPI: Editor & RegionsManager & AreaSelector & FilterPipeline;

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
     * @param areaSelector - The `AresSelector` component to use.
     * @param regionsManager - The `RegionsManager` component to use.
     */
    constructor(container: HTMLDivElement, areaSelector: AreaSelector, regionsManager: RegionsManager);

    /**
     * Creates a new `Editor` in specified div-container and with custom building components.
     * @remarks - Originally created for testing purposes.
     * @param container - The div-container for the editor.
     * @param areaSelector - The `AresSelector` component to use.
     * @param regionsManager - The `RegionsManager` component to use.
     * @param filterPipeline - The `FilterPipeline` component to use.
     */
    constructor(container: HTMLDivElement, areaSelector: AreaSelector, regionsManager: RegionsManager,
                filterPipeline: FilterPipeline);

    constructor(container: HTMLDivElement, areaSelector?: AreaSelector, regionsManager?: RegionsManager,
                filterPipeline?: FilterPipeline) {
        // Create SVG Element
        this.contentCanvas = this.createCanvasElement();
        this.editorSVG = this.createSVGElement();

        this.editorDiv = container;

        this.editorDiv.classList.add("CanvasToolsEditor");
        this.editorDiv.append(this.contentCanvas);
        this.editorDiv.append(this.editorSVG);

        // automatically resize internals on window resize
        window.addEventListener("resize", (e) => {
            if (this.autoResize) {
                this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
            }
        });

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

        // Init areaSeletor
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

        let activeSelector: string;
        toolbarSet.forEach((item) => {
            if (item.type === ToolbarItemType.SEPARATOR) {
                this.toolbar.addSeparator();
            } else {
                const toolbarItem: IToolbarIcon = {
                    action: item.action,
                    iconUrl: iconsPath + item.iconFile,
                    tooltip: item.tooltip,
                    keycode: item.keycode,
                    width: item.width,
                    height: item.height,
                };

                const actionFn = (action) => {
                    item.actionCallback(action, this.regionsManager, this.areaSelector);
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
            // resize the editor size to adjust to the new content size
            this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
        });
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
}
