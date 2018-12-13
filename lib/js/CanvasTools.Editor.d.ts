import { ToolbarItemType } from "./CanvasTools.Toolbar";
import { RegionsManager } from "./CanvasTools.RegionsManager";
import { AreaSelector } from "./CanvasTools.Selection";
import { FilterPipeline } from "./CanvasTools.Filter";
import { RegionComponent } from "./CanvasTools.RegionComponent";
declare type ToolbarIconDescription = {
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
export declare class Editor {
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
export {};
