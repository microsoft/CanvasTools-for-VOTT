import { IToolbarIcon } from "../Interface/IToolbarIcon";
import { ToolbarAction } from './ToolbarAction';
import { IconCallback, ToolbarSelect } from './ToolbarSelect';

export enum ToolbarItemType { SELECTOR, SWITCH, SEPARATOR, TRIGGER }

export abstract class ToolbarIcon extends ToolbarSelect{
    public static IconWidth: number = 48;
    public static IconHeight: number = 48;

    public width: number;
    public height: number;

    public description: IToolbarIcon;
    public node: Snap.Element;

    protected paper: Snap.Paper;
    protected x: number;
    protected y: number;

    constructor(paper: Snap.Paper, icon?: IToolbarIcon, onAction?: IconCallback,
        action?: ToolbarAction, key?: string[]) {
        super(onAction, action, key);
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
        super.select();
        this.node.addClass("selected");
    }

    public unselect() {
        super.unselect();
        this.node.removeClass("selected");
    }

    protected toggleSelection() {
        if (this.isSelected) {
            this.unselect();
        } else {
            this.select();
        }
    }
}
