import { FilterPipeline } from "./CanvasTools.Filter";

import { Rect } from "./Core/Rect";
import { RegionData } from "./Core/RegionData";

import { RegionComponent } from "./Region/Component/RegionComponent";
import { RegionsManager } from "./Region/RegionsManager";

import { AreaSelector, SelectionMode } from "./Selection/AreaSelector";

import { ToolbarItemType} from "./Toolbar/ToolbarIcon";
import { Toolbar } from "./Toolbar/Toolbar";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

type ToolbarIconDescription = {
    type: ToolbarItemType.SELECTOR | ToolbarItemType.SWITCH,
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

export class Editor {
    public static FullToolbarSet: ToolbarIconDescription[] = [
        {
            type: ToolbarItemType.SELECTOR,
            action: "none-select",
            iconFile: "none-selection.svg",
            tooltip: "Regions Manipulation (M)",
            keycode: "KeyM",
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode(SelectionMode.NONE);
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
                sl.setSelectionMode(SelectionMode.POINT);
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
                sl.setSelectionMode(SelectionMode.RECT);
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
                const rs = rm.getSelectedRegionsBounds();
                if (rs !== undefined && rs.length > 0) {
                    const r = rs[0];
                    sl.setSelectionMode(SelectionMode.COPYRECT, { template: new Rect(r.width, r.height) });
                } else {
                    sl.setSelectionMode(SelectionMode.COPYRECT, { template: new Rect(40, 40) });
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
                sl.setSelectionMode(SelectionMode.POLYLINE);
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
                sl.setSelectionMode(SelectionMode.POLYGON);
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
    ];

    public static RectToolbarSet: ToolbarIconDescription[] = [
        {
            type: ToolbarItemType.SELECTOR,
            action: "none-select",
            iconFile: "none-selection.svg",
            tooltip: "Regions Manipulation (M)",
            keycode: "KeyM",
            actionCallback: (action, rm, sl) => {
                sl.setSelectionMode(SelectionMode.NONE);
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
                sl.setSelectionMode(SelectionMode.RECT);
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
                const rs = rm.getSelectedRegionsBounds();
                if (rs !== undefined && rs.length > 0) {
                    const r = rs[0];
                    sl.setSelectionMode(SelectionMode.COPYRECT, { template: new Rect(r.width, r.height) });
                } else {
                    sl.setSelectionMode(SelectionMode.COPYRECT, { template: new Rect(40, 40) });
                }
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
    ];

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

    public autoResize: boolean = true;

    public get api(): Editor & RegionsManager & AreaSelector & FilterPipeline {
        return this.mergedAPI;
    }

    private mergedAPI: Editor & RegionsManager & AreaSelector & FilterPipeline;

    private toolbar: Toolbar;
    private regionsManager: RegionsManager;
    private areaSelector: AreaSelector;
    private filterPipeline: FilterPipeline;

    private editorSVG: SVGSVGElement;
    private contentCanvas: HTMLCanvasElement;

    private editorDiv: HTMLDivElement;

    private isRMFrozen: boolean = false;

    private sourceWidth: number;
    private sourceHeight: number;

    private frameWidth: number;
    private frameHeight: number;

    constructor(editorZone: HTMLDivElement) {
        // Create SVG Element
        this.contentCanvas = this.createCanvasElement();
        this.editorSVG = this.createSVGElement();

        this.editorDiv = editorZone;

        this.editorDiv.classList.add("CanvasToolsEditor");
        this.editorDiv.append(this.contentCanvas);
        this.editorDiv.append(this.editorSVG);

        // automatically resize internals on window resize
        window.addEventListener("resize", (e) => {
            if (this.autoResize) {
                this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
            }
        });

        this.regionsManager = new RegionsManager(this.editorSVG, {
            onChange: null,
            onManipulationBegin: (region?: RegionComponent) => {
                this.areaSelector.hide();
                this.onRegionManipulationBegin(region);
            },
            onManipulationEnd: (region?: RegionComponent) => {
                this.areaSelector.show();
                this.onRegionManipulationEnd(region);
            },
        });

        this.regionsManager.onRegionSelected = (id: string, multiselection: boolean) => {
            this.onRegionSelected(id, multiselection);
        };

        this.regionsManager.onRegionMove = (id: string, regionData: RegionData) => {
            this.onRegionMove(id, regionData);
        };

        this.regionsManager.onRegionDelete = (id: string) => {
            this.onRegionDelete(id);
        };

        this.areaSelector = new AreaSelector(this.editorSVG,
            {
                onSelectionBegin: () => {
                    this.isRMFrozen = this.regionsManager.isFrozen;
                    this.regionsManager.freeze();

                    this.onSelectionBegin();
                },
                onSelectionEnd: (regionData: RegionData) => {
                    if (!this.isRMFrozen) {
                        this.regionsManager.unfreeze();
                    }

                    this.onSelectionEnd(regionData);
                },
            });

        this.filterPipeline = new FilterPipeline();

        this.resize(editorZone.offsetWidth, editorZone.offsetHeight);

        // add proxies to regionsManager, areaSelector and filterPipeline;
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
                    t = target.FilterPipeline;
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

    public onRegionManipulationBegin(region?: RegionComponent): void {
        // do something
    }

    public onRegionManipulationEnd(region?: RegionComponent): void {
        // do something
    }

    public onRegionSelected(id: string, multiselection: boolean) {
        // do something
    }

    public onRegionMove(id: string, regionData: RegionData) {
        // do something
    }

    public onRegionDelete(id: string) {
        // do something
    }

    public onSelectionBegin(): void {
        // do something
    }

    public onSelectionEnd(regionData: RegionData): void {
        // do something
    }

    public addToolbar(toolbarZone: HTMLDivElement, toolbarSet: ToolbarIconDescription[], iconsPath: string) {
        const svg = this.createSVGElement();
        toolbarZone.append(svg);

        this.toolbar = new Toolbar(svg);

        if (toolbarSet === null) {
            toolbarSet = Editor.FullToolbarSet;
        }

        let activeSelector: string;
        toolbarSet.forEach((item) => {
            if (item.type === ToolbarItemType.SEPARATOR) {
                this.toolbar.addSeparator();
            } else if (item.type === ToolbarItemType.SELECTOR) {
                this.toolbar.addSelector({
                    action: item.action,
                    iconUrl: iconsPath + item.iconFile,
                    tooltip: item.tooltip,
                    keycode: item.keycode,
                    width: item.width,
                    height: item.height,
                }, (action) => {
                    item.actionCallback(action, this.regionsManager, this.areaSelector);
                });

                if (item.activate) {
                    activeSelector = item.action;
                }
            } else if (item.type === ToolbarItemType.SWITCH) {
                this.toolbar.addSwitch({
                    action: item.action,
                    iconUrl: iconsPath + item.iconFile,
                    tooltip: item.tooltip,
                    keycode: item.keycode,
                    width: item.width,
                    height: item.height,
                }, (action) => {
                    item.actionCallback(action, this.regionsManager, this.areaSelector);
                });

                this.toolbar.setSwitch(item.action, item.activate);
            }
        });

        this.toolbar.select(activeSelector);
    }

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

        this.frameWidth = this.editorSVG.clientWidth;
        this.frameHeight = this.editorSVG.clientHeight;

        this.areaSelector.resize(this.frameWidth, this.frameHeight);
        this.regionsManager.resize(this.frameWidth, this.frameHeight);
    }

    public get RM(): RegionsManager {
        return this.regionsManager;
    }

    public get AS(): AreaSelector {
        return this.areaSelector;
    }

    public get FilterPipeline(): FilterPipeline {
        return this.filterPipeline;
    }

    public scaleRegionToSourceSize(regionData: RegionData, sourceWidth?: number, sourceHeight?: number): RegionData {
        const sw = (sourceWidth !== undefined) ? sourceWidth : this.sourceWidth;
        const sh = (sourceHeight !== undefined) ? sourceHeight : this.sourceHeight;

        const xf = sw / this.frameWidth;
        const yf = sh / this.frameHeight;

        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }

    public scaleRegionToFrameSize(regionData: RegionData, sourceWidth?: number, sourceHeight?: number): RegionData {
        const sw = (sourceWidth !== undefined) ? sourceWidth : this.sourceWidth;
        const sh = (sourceHeight !== undefined) ? sourceHeight : this.sourceHeight;

        const xf = this.frameWidth / sw;
        const yf = this.frameHeight / sh;

        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }

    private createSVGElement(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.innerHTML = Editor.SVGDefsTemplate;
        return svg;
    }

    private createCanvasElement(): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        return canvas;
    }
}
