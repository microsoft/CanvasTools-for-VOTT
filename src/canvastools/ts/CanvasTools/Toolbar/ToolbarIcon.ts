import { IToolbarIcon } from "../Interface/IToolbarIcon";

export type IconCallback = (action: string) => void;

export enum ToolbarItemType { SELECTOR, SWITCH, SEPARATOR, TRIGGER }

export abstract class ToolbarIcon {
    public static IconWidth: number = 48;
    public static IconHeight: number = 48;

    public width: number;
    public height: number;

    public description: IToolbarIcon;
    public node: Snap.Element;

    protected paper: Snap.Paper;
    protected x: number;
    protected y: number;
    protected isSelected: boolean = false;

    constructor(paper: Snap.Paper, icon?: IToolbarIcon) {
        this.paper = paper;

        if (icon !== undefined && icon !== null) {
            this.description = icon;
            if (icon.width !== undefined) {
                this.width = icon.width;
            } else {
                this.width = ToolbarIcon.IconWidth;
            }

            if (icon.height !== undefined) {
                this.height = icon.height;
            } else {
                this.height = ToolbarIcon.IconHeight;
            }
        } else {
            this.description = null;
            this.width = ToolbarIcon.IconWidth;
            this.height = ToolbarIcon.IconHeight;
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
