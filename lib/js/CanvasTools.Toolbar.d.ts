import * as Snap from "snapsvg";
export declare type IconCallback = (action: string) => void;
export declare type IconDescription = {
    action: string;
    iconUrl: string;
    tooltip: string;
    keycode: string;
    width: number;
    height: number;
};
export declare enum ToolbarItemType {
    SELECTOR = 0,
    SWITCH = 1,
    SEPARATOR = 2
}
declare abstract class ToolbarIconPrototype {
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
export declare class ToolbarSelectIcon extends ToolbarIconPrototype {
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
export declare class ToolbarSwitchIcon extends ToolbarIconPrototype {
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
export declare class ToolbarSeparator extends ToolbarIconPrototype {
    private iconSeparator;
    constructor(paper: Snap.Paper, width: number);
    private buildIconUI;
    move(x: number, y: number): void;
    resize(width: number, height: number): void;
}
export declare class Toolbar {
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
export {};
