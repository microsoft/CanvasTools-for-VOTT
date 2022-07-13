import { Rect } from "../Core/Rect";
import { IToolbarIcon } from "../Interface/IToolbarIcon";
import { ToolbarAction } from './ToolbarAction';
import { ToolbarIcon } from "./ToolbarIcon";
import { IconCallback, ToolbarSelect } from "./ToolbarSelect";
import { ToolbarSelectIcon } from "./ToolbarSelectIcon";
import { ToolbarSeparator } from "./ToolbarSeparator";
import { ToolbarSwitchIcon } from "./ToolbarSwitchIcon";
import { ToolbarTriggerIcon } from "./ToolbarTriggerIcon";

export class Toolbar {
    private baseParent: SVGSVGElement;
    private paper: Snap.Paper;
    private paperRect: Rect;

    private backgroundRect: Snap.Element;
    private iconsLayer: Snap.Element;

    private iconSpace: number = 8;

    private toolbarWidth: number;
    private toolbarHeight: number;

    private icons: ToolbarSelect[];

    private areHotKeysEnabled: boolean = true;

    private isVertical = true;

    constructor(svgHost: SVGSVGElement, isVertical: boolean = true) {
        this.icons = new Array<ToolbarSelect>();

        this.isVertical = isVertical;

        this.buildUIElements(svgHost, isVertical);
    }

    public addSelector(icon: IToolbarIcon, actor: IconCallback) {
        const newIcon = new ToolbarSelectIcon(this.paper, icon, (action) => {
            this.select(action);
            actor(action);
        }, icon.action ? icon.action as ToolbarAction : undefined,
        icon.key? icon.key: undefined);

        this.addIcon(newIcon);
    }

    public addSwitch(icon: IToolbarIcon, actor: IconCallback) {
        const newIcon = new ToolbarSwitchIcon(this.paper, icon, (action) => {
            actor(action);
        }, icon.action ? icon.action as ToolbarAction : undefined,
        icon.key? icon.key: undefined);

        this.addIcon(newIcon);
    }

    public addSeparator() {
        const newIcon = new ToolbarSeparator(this.paper, ToolbarIcon.IconWidth, this.isVertical);
        this.addIcon(newIcon);
    }

    public addTrigger(icon: IToolbarIcon, actor: IconCallback) {
        const newIcon = new ToolbarTriggerIcon(this.paper, icon, (action) => {
            actor(action);
        }, icon.action ? icon.action as ToolbarAction : undefined,
        icon.key? icon.key: undefined);

        this.addIcon(newIcon);
    }

    public select(action: string) {
        this.icons.forEach((icon) => {
            if (icon instanceof ToolbarSelect) {
                if (icon.action !== action) {
                    icon.unselect();
                } else {
                    icon.select();
                }
            }
        });
    }

    public setSwitch(action: string, on: boolean) {
        const switchIcon: ToolbarSelect = this.findIconByAction(action);

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

    private buildUIElements(svgHost: SVGSVGElement, isVertical: boolean) {
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

        const toolbarGroup = this.paper.g();
        toolbarGroup.addClass("toolbarLayer");

        this.recalculateToolbarSize(isVertical);

        this.backgroundRect = this.paper.rect(0, 0, this.toolbarWidth, this.toolbarHeight);
        this.backgroundRect.addClass("toolbarBGStyle");
        toolbarGroup.add(this.backgroundRect);

        this.iconsLayer = this.paper.g();
        this.iconsLayer.addClass("iconsLayerStyle");
        toolbarGroup.add(this.iconsLayer);

        this.subscribeToKeyboardEvents();
    }

    private recalculateToolbarSize(isVertical: boolean, newIcon?: ToolbarIcon) {
        if (isVertical) {
            if (newIcon === undefined) {
                this.toolbarWidth = ToolbarIcon.IconWidth + 2 * this.iconSpace;
                this.toolbarHeight = this.icons.length * (ToolbarIcon.IconHeight + this.iconSpace) + this.iconSpace;
            } else {
                const width = newIcon.width + 2 * this.iconSpace;
                if (width > this.toolbarWidth) {
                    this.toolbarWidth = width;
                }
    
                this.toolbarHeight = this.toolbarHeight + newIcon.height + this.iconSpace;
            }
        } else {
            if (newIcon === undefined) {
                this.toolbarHeight = ToolbarIcon.IconHeight + 2 * this.iconSpace;
                this.toolbarWidth = this.icons.length * (ToolbarIcon.IconWidth + this.iconSpace) + this.iconSpace;
            } else {
                const height = newIcon.height + 2 * this.iconSpace;
                if (height > this.toolbarHeight) {
                    this.toolbarHeight = height;
                }
    
                this.toolbarWidth = this.toolbarWidth + newIcon.width + this.iconSpace;
            }
        }
        
    }

    private updateToolbarSize() {
        this.backgroundRect.attr({
            height: this.toolbarHeight,
            width: this.toolbarWidth,
        });
    }

    private addIcon(newIcon: ToolbarIcon) {
        this.icons.push(newIcon);
        this.iconsLayer.add(newIcon.node);

        if(this.isVertical) {
            newIcon.move(this.iconSpace, this.toolbarHeight + this.iconSpace);
        } else {
            newIcon.move(this.toolbarWidth + this.iconSpace, this.iconSpace);
        }
        
        this.recalculateToolbarSize(this.isVertical, newIcon);
        this.updateToolbarSize();
    }

    private findIconByKey(key: string): ToolbarSelect {
        return this.icons.find((icon: ToolbarSelect) => {if (icon.key) { return icon.key.includes(key); }});
    }

    private findIconByAction(action: string): ToolbarSelect {
        return this.icons.find((icon) => {
            return icon.action !== null && icon.action === action;
        });
    }

    private findFocusedIcon(): ToolbarSelect {
        return this.icons.find((icon) => {
            return icon.isFocused();
        });
    }

    private subscribeToKeyboardEvents() {
        window.addEventListener("keyup", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (this.areHotKeysEnabled && !e.ctrlKey && !e.altKey) {
                    const icon = this.findIconByKey(e.key);
                    if (icon !== undefined) {
                        if (icon instanceof ToolbarSelectIcon || icon instanceof ToolbarSwitchIcon
                            || icon instanceof ToolbarTriggerIcon) {
                            icon.activate();
                        }
                    }
                }

                if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    const icon = this.findFocusedIcon();
                    if (icon !== undefined) {
                        if (icon instanceof ToolbarSelectIcon || icon instanceof ToolbarSwitchIcon
                            || icon instanceof ToolbarTriggerIcon) {
                            icon.activate();
                        }
                    }
                }
            }
        });
    }
}
