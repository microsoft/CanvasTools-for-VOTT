import { Rect } from "../Core/Rect";
import { IToolbarIcon } from "../Interface/IToolbarIcon";
import { IconCallback, ToolbarIcon } from "./ToolbarIcon";
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

    private icons: ToolbarIcon[];

    private areHotKeysEnabled: boolean = true;

    constructor(svgHost: SVGSVGElement) {
        this.icons = new Array<ToolbarIcon>();

        this.buildUIElements(svgHost);
    }

    public addSelector(icon: IToolbarIcon, actor: IconCallback) {
        const newIcon = new ToolbarSelectIcon(this.paper, icon, (action) => {
            this.select(action);
            actor(action);
        });

        this.addIcon(newIcon);
    }

    public addSwitch(icon: IToolbarIcon, actor: IconCallback) {
        const newIcon = new ToolbarSwitchIcon(this.paper, icon, (action) => {
            actor(action);
        });

        this.addIcon(newIcon);
    }

    public addSeparator() {
        const newIcon = new ToolbarSeparator(this.paper, ToolbarIcon.IconWidth);
        this.addIcon(newIcon);
    }

    public addTrigger(icon: IToolbarIcon, actor: IconCallback) {
        const newIcon = new ToolbarTriggerIcon(this.paper, icon, (action) => {
            actor(action);
        });

        this.addIcon(newIcon);
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
        const switchIcon: ToolbarIcon = this.findIconByAction(action);

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

    private buildUIElements(svgHost: SVGSVGElement) {
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

        const toolbarGroup = this.paper.g();
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

    private recalculateToolbarSize(newIcon?: ToolbarIcon) {
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

        newIcon.move(this.iconSpace, this.toolbarHeight + this.iconSpace);
        this.recalculateToolbarSize(newIcon);
        this.updateToolbarSize();
    }

    private findIconByKeycode(keycode: string): ToolbarIcon {
        return this.icons.find((icon) => {
            return icon.description !== null && icon.description.keycode === keycode;
        });
    }

    private findIconByAction(action: string): ToolbarIcon {
        return this.icons.find((icon) => {
            return icon.description !== null && icon.description.action === action;
        });
    }

    private subscribeToKeyboardEvents() {
        window.addEventListener("keyup", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (this.areHotKeysEnabled && !e.ctrlKey && !e.altKey) {
                    const icon = this.findIconByKeycode(e.code);
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
