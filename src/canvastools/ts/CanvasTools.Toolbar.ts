import * as Snap from "snapsvg";
import * as CTBaseRect from "./Base/CanvasTools.Base.Rect";
import Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;

export module CanvasTools.Toolbar {
    export type IconCallback = (action: string) => void;

    export class IconDescription {
        public action: string;
        public iconUrl: string;
        public tooltip: string;
        public keycode: string;
        public isSwitch: boolean;

        constructor(action: string, iconUrl: string, tooltip: string, keycode: string, isSwitch:boolean = false) {
            this.action = action;
            this.iconUrl = iconUrl;
            this.tooltip = tooltip;
            this.keycode = keycode;
            this.isSwitch = isSwitch;
        }
    }

    export class ToolbarIcon {
        public static IconWidth: number = 48;
        public static IconHeight: number = 48;

        private actor: IconCallback;
        private paper: Snap.Paper;

        public iconGroup: Snap.Element;
        public iconBackgrounRect: Snap.Element;
        public iconImage: Snap.Element;
        public iconImageSVG: Snap.Element;

        private x: number;
        private y: number;

        public description: IconDescription;
        public isSelected: boolean = false;
        public areHotkeysEnabled: boolean = true;

        constructor(icon: IconDescription, paper: Snap.Paper, actor: IconCallback) {
            this.description = icon;
            this.actor = actor;
            this.paper = paper;

            this.buildIconUI();
        }

        private buildIconUI() {
            this.iconGroup = this.paper.g();
            this.iconGroup.addClass("iconStyle");
            if (this.description.isSwitch) {
                this.iconGroup.addClass("switch");
            }

            this.iconBackgrounRect = this.paper.rect(0, 0, ToolbarIcon.IconWidth, ToolbarIcon.IconHeight);
            this.iconBackgrounRect.addClass("iconBGRectStyle");
            this.iconGroup.add(this.iconBackgrounRect);

            this.iconImage = this.paper.g();
            if (this.description.iconUrl !== undefined) {
                Snap.load(this.description.iconUrl, (fragment) => {
                    this.iconImage.append(fragment);
                    this.iconImageSVG = this.iconImage.children().find((element) => {
                        return (element.type === "svg");
                    });
                    if (this.iconImageSVG !== undefined) {
                        this.iconImageSVG.attr({
                            width: ToolbarIcon.IconWidth,
                            height: ToolbarIcon.IconHeight
                        });

                        this.move(this.x, this.y);
                    }                    
                });
            }
            this.iconImage.addClass("iconImageStyle");
            this.iconGroup.add(this.iconImage);

            let title = Snap.parse(`<title>${this.description.tooltip}</title>`);
            this.iconGroup.append(<any>title);

            this.iconGroup.click((e) => {
                this.actor(this.description.action);
            })
        }

        public move(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.iconBackgrounRect.attr({ x: x, y: y });
            if (this.iconImageSVG !== undefined) {
                this.iconImageSVG.attr({ x: x, y: y });
            }            
        }

        public select() {
            this.iconGroup.addClass("selected");
            this.isSelected = true;
        }

        public unselect() {
            this.iconGroup.removeClass("selected");
            this.isSelected = false;
        }

        private toggleSelection() {
            if (this.isSelected) {
                this.unselect();
            } else {
                this.select();
            }
        }

        public toggleOnKey() {
            if (this.description.isSwitch) {
                this.toggleSelection();
            } else {
                this.select();
            }
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

        private icons: Array<ToolbarIcon>;

        private areHotKeysEnabled: boolean = true;

        constructor(svgHost: SVGSVGElement){
            this.icons = new Array<ToolbarIcon>();

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
            
        }

        private recalculateToolbarSize() {
            this.toolbarWidth = ToolbarIcon.IconWidth + 2 * this.iconSpace;
            this.toolbarHeight = this.icons.length * (ToolbarIcon.IconHeight + this.iconSpace) + this.iconSpace;
        }

        private updateToolbarSize() {
            this.backgroundRect.attr({
                width: this.toolbarWidth,
                height: this.toolbarHeight
            });
        }

        public addAction(icon: IconDescription, actor: IconCallback, keyCode?: string) {
            let iconElement = new ToolbarIcon(icon, this.paper, (action) => {
                if (!icon.isSwitch) {
                    this.select(action);
                } else {
                    iconElement.toggleOnKey();
                }                
                actor(action);
            });

            this.icons.push(iconElement);
            this.iconsLayer.add(iconElement.iconGroup);

            iconElement.move(this.iconSpace, (this.icons.length - 1) * (ToolbarIcon.IconHeight + this.iconSpace) + this.iconSpace)

            this.recalculateToolbarSize();
            this.updateToolbarSize();

            if (icon.keycode !== undefined) {
                window.addEventListener("keyup", (e) => {
                    if (this.areHotKeysEnabled) {
                        if (e.code === icon.keycode && !e.ctrlKey && !e.altKey) {
                            if (!icon.isSwitch) {
                                this.select(icon.action);
                            } else {
                                iconElement.toggleOnKey();
                            }
                            actor(icon.action);
                        }
                    }                    
                });
            }
        }

        public select(action: string) {
            this.icons.forEach((icon) => {
                if (!icon.description.isSwitch) {
                    if (icon.description.action !== action) {
                        icon.unselect();
                    } else {
                        icon.select();
                    }
                }                
            });

        }

        public enableHotkeys() {
            this.areHotKeysEnabled = true;
        }

        public disableHotkeys() {
            this.areHotKeysEnabled = false;
        }
 
    }
}