import { Rect } from "./Core/CanvasTools.Rect";
import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export type IconCallback = (action: string) => void;

export type IconDescription = {
    action: string;
    iconUrl: string;
    tooltip: string;
    keycode: string;
    width: number;
    height: number;
}

export enum ToolbarItemType { SELECTOR, SWITCH, SEPARATOR };

abstract class ToolbarIconPrototype {
    public static IconWidth: number = 48;
    public static IconHeight: number = 48;

    protected x: number;
    protected y: number;
    public width: number;
    public height: number;

    protected paper: Snap.Paper;

    public description: IconDescription;
    public node: Snap.Element;

    protected isSelected: boolean = false;

    constructor(paper: Snap.Paper, icon?: IconDescription) {
        this.paper = paper;

        if (icon !== undefined && icon !== null) {
            this.description = icon;
            if (icon.width !== undefined) {
                this.width = icon.width;
            } else {
                this.width = ToolbarIconPrototype.IconWidth;
            }

            if (icon.height !== undefined) {
                this.height = icon.height;
            } else {
                this.height = ToolbarIconPrototype.IconHeight;
            }
        } else {
            this.description = null;
            this.width = ToolbarIconPrototype.IconWidth;
            this.height = ToolbarIconPrototype.IconHeight;
        }
    }

    public move(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public resize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public select() {
        this.node.addClass("selected");
        this.isSelected = true;
    }

    public unselect() {
        this.node.removeClass("selected");
        this.isSelected = false;
    }

    protected toggleSelection() {
        if (this.isSelected) {
            this.unselect();
        } else {
            this.select();
        }
    }
}

export class ToolbarSelectIcon extends ToolbarIconPrototype {
    public onAction: IconCallback;

    private iconBackgrounRect: Snap.Element;
    private iconImage: Snap.Element;
    private iconImageSVG: Snap.Element;

    constructor(paper: Snap.Paper, icon: IconDescription, onAction: IconCallback) {
        super(paper, icon);

        this.onAction = onAction;
        this.buildIconUI();
    }

    private buildIconUI() {
        this.node = this.paper.g();
        this.node.addClass("iconStyle");
        this.node.addClass("selector");

        this.iconBackgrounRect = this.paper.rect(0, 0, this.width, this.height);
        this.iconBackgrounRect.addClass("iconBGRectStyle");

        this.iconImage = this.paper.g();
        if (this.description.iconUrl !== undefined) {
            Snap.load(this.description.iconUrl, (fragment) => {
                this.iconImage.append(<any>fragment);
                this.iconImageSVG = this.iconImage.children().find((element) => {
                    return (element.type === "svg");
                });
                if (this.iconImageSVG !== undefined) {
                    this.iconImageSVG.attr({
                        width: this.width,
                        height: this.height
                    });

                    this.move(this.x, this.y);
                }
            });
        }
        this.iconImage.addClass("iconImageStyle");

        let title = Snap.parse(`<title>${this.description.tooltip}</title>`);

        this.node.add(this.iconBackgrounRect);
        this.node.add(this.iconImage);
        this.node.append(<any>title);

        this.node.click((e) => {
            this.activate();
        })
    }

    public activate() {
        this.onAction(this.description.action);
        this.select();
    }

    public move(x: number, y: number) {
        super.move(x, y);
        this.iconBackgrounRect.attr({ x: x, y: y });
        if (this.iconImageSVG !== undefined) {
            this.iconImageSVG.attr({ x: x, y: y });
        }
    }

    public resize(width: number, height: number) {
        super.resize(width, height);

        this.iconBackgrounRect.attr({
            width: this.width,
            height: this.height
        });

        this.iconImageSVG.attr({
            width: this.width,
            height: this.height
        });
    }
}

export class ToolbarSwitchIcon extends ToolbarIconPrototype {
    public onAction: IconCallback;

    private iconBackgrounRect: Snap.Element;
    private iconImage: Snap.Element;
    private iconImageSVG: Snap.Element;

    constructor(paper: Snap.Paper, icon: IconDescription, onAction: IconCallback) {
        super(paper, icon);

        this.onAction = onAction;
        this.buildIconUI();
    }

    private buildIconUI() {
        this.node = this.paper.g();
        this.node.addClass("iconStyle");
        this.node.addClass("switch");

        this.iconBackgrounRect = this.paper.rect(0, 0, this.width, this.height);
        this.iconBackgrounRect.addClass("iconBGRectStyle");

        this.iconImage = this.paper.g();
        if (this.description.iconUrl !== undefined) {
            Snap.load(this.description.iconUrl, (fragment) => {
                this.iconImage.append(<any>fragment);
                this.iconImageSVG = this.iconImage.children().find((element) => {
                    return (element.type === "svg");
                });
                if (this.iconImageSVG !== undefined) {
                    this.iconImageSVG.attr({
                        width: this.width,
                        height: this.height
                    });

                    this.move(this.x, this.y);
                }
            });
        }
        this.iconImage.addClass("iconImageStyle");

        let title = Snap.parse(`<title>${this.description.tooltip}</title>`);

        this.node.add(this.iconBackgrounRect);
        this.node.add(this.iconImage);
        this.node.append(<any>title);

        this.node.click((e) => {
            this.activate();
        })
    }

    public activate() {
        this.onAction(this.description.action);
        this.toggleSelection();
    }

    public move(x: number, y: number) {
        super.move(x, y);
        this.iconBackgrounRect.attr({ x: x, y: y });
        if (this.iconImageSVG !== undefined) {
            this.iconImageSVG.attr({ x: x, y: y });
        }
    }

    public resize(width: number, height: number) {
        super.resize(width, height);

        this.iconBackgrounRect.attr({
            width: this.width,
            height: this.height
        });

        this.iconImageSVG.attr({
            width: this.width,
            height: this.height
        });
    }
}

export class ToolbarSeparator extends ToolbarIconPrototype {
    private iconSeparator: Snap.Element;

    constructor(paper: Snap.Paper, width: number) {
        super(paper, null);
        this.buildIconUI();

        this.resize(width, 1);
    }

    private buildIconUI() {
        this.node = this.paper.g();
        this.node.addClass("iconStyle");
        this.node.addClass("separator");

        this.iconSeparator = this.paper.line(0, 0, this.width, 0);
        this.node.add(this.iconSeparator);
    }

    public move(x: number, y: number) {
        super.move(x, y);
        this.iconSeparator.attr({
            x1: x,
            y1: y,
            x2: x + this.width,
            y2: y
        });
    }

    public resize(width: number, height: number) {
        super.resize(width, 1);

        this.iconSeparator.attr({
            width: this.width
        });
    }
}

export class Toolbar {
    private baseParent: SVGSVGElement;
    private paper: Snap.Paper;
    private paperRect: Rect;

    private backgroundRect: Snap.Element;
    private iconsLayer: Snap.Element;

    private iconSpace: number = 8;

    private toolbarWidth: number;
    private toolbarHeight: number;

    private icons: Array<ToolbarIconPrototype>;

    private areHotKeysEnabled: boolean = true;

    constructor(svgHost: SVGSVGElement) {
        this.icons = new Array<ToolbarIconPrototype>();

        this.buildUIElements(svgHost);
    }

    private buildUIElements(svgHost: SVGSVGElement) {
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

        let toolbarGroup = this.paper.g();
        toolbarGroup.addClass("toolbarLayer");

        this.recalculateToolbarSize();

        this.backgroundRect = this.paper.rect(0, 0, this.toolbarWidth, this.toolbarHeight);
        this.backgroundRect.addClass("toolbarBGStyle");
        toolbarGroup.add(this.backgroundRect);

        this.iconsLayer = this.paper.g();
        this.iconsLayer.addClass("iconsLayerStyle");
        toolbarGroup.add(this.iconsLayer);

        this.subscribeToKeyboardEvents();
    }

    private recalculateToolbarSize(newIcon?: ToolbarIconPrototype) {
        if (newIcon == undefined) {
            this.toolbarWidth = ToolbarIconPrototype.IconWidth + 2 * this.iconSpace;
            this.toolbarHeight = this.icons.length * (ToolbarIconPrototype.IconHeight + this.iconSpace) + this.iconSpace;
        } else {
            let width = newIcon.width + 2 * this.iconSpace;
            if (width > this.toolbarWidth) {
                this.toolbarWidth = width;
            }

            this.toolbarHeight = this.toolbarHeight + newIcon.height + this.iconSpace;
        }
    }

    private updateToolbarSize() {
        this.backgroundRect.attr({
            width: this.toolbarWidth,
            height: this.toolbarHeight
        });
    }

    public addSelector(icon: IconDescription, actor: IconCallback) {
        let newIcon = new ToolbarSelectIcon(this.paper, icon, (action) => {
            this.select(action);
            actor(action);
        });

        this.addIcon(newIcon);
    }

    public addSwitch(icon: IconDescription, actor: IconCallback) {
        let newIcon = new ToolbarSwitchIcon(this.paper, icon, (action) => {
            actor(action);
        });

        this.addIcon(newIcon);
    }

    public addSeparator() {
        let newIcon = new ToolbarSeparator(this.paper, ToolbarIconPrototype.IconWidth);
        this.addIcon(newIcon);
    }

    private addIcon(newIcon: ToolbarIconPrototype) {
        this.icons.push(newIcon);
        this.iconsLayer.add(newIcon.node);

        newIcon.move(this.iconSpace, this.toolbarHeight + this.iconSpace);
        this.recalculateToolbarSize(newIcon);
        this.updateToolbarSize();
    }

    private findIconByKeycode(keycode: string): ToolbarIconPrototype {
        return this.icons.find((icon) => {
            return icon.description !== null && icon.description.keycode == keycode;
        })
    }

    private findIconByAction(action: string): ToolbarIconPrototype {
        return this.icons.find((icon) => {
            return icon.description !== null && icon.description.action == action;
        })
    }

    private subscribeToKeyboardEvents() {
        window.addEventListener("keyup", (e) => {
            if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
                if (this.areHotKeysEnabled && !e.ctrlKey && !e.altKey) {
                    let icon = this.findIconByKeycode(e.code);
                    if (icon !== undefined) {
                        if (icon instanceof ToolbarSelectIcon || icon instanceof ToolbarSwitchIcon) {
                            icon.activate();
                        }
                    }
                }
            }
        });
    }

    public select(action: string) {
        this.icons.forEach((icon) => {
            if (icon instanceof ToolbarSelectIcon) {
                if (icon.description.action !== action) {
                    icon.unselect();
                } else {
                    icon.select();
                }
            }
        });
    }

    public setSwitch(action: string, on: boolean) {
        let switchIcon: ToolbarIconPrototype = this.findIconByAction(action);

        if (switchIcon !== undefined && switchIcon instanceof ToolbarSwitchIcon) {
            (on) ? switchIcon.select() : switchIcon.unselect();
        }
    }

    public enableHotkeys() {
        this.areHotKeysEnabled = true;
    }

    public disableHotkeys() {
        this.areHotKeysEnabled = false;
    }

}