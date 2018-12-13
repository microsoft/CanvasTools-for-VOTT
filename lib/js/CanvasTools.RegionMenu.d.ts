import { IRect } from "./Interface/IRect";
import { IPoint2D } from "./Interface/IPoint2D";
import { RegionComponent, ManipulationFunction } from "./CanvasTools.RegionComponent";
import * as Snap from "snapsvg";
export declare class MenuElement extends RegionComponent {
    private menuItemSize;
    private mx;
    private my;
    private mw;
    private mh;
    private dh;
    private dw;
    menuGroup: Snap.Paper;
    menuRect: Snap.Element;
    menuItemsGroup: Snap.Element;
    menuItems: Array<Snap.Element>;
    private region;
    constructor(paper: Snap.Paper, x: number, y: number, rect: IRect, paperRect?: IRect, onManipulationBegin?: ManipulationFunction, onManipulationEnd?: ManipulationFunction);
    private buildOn;
    private pathCollection;
    addAction(action: string, icon: string, actor: Function): void;
    private rearrangeMenuPosition;
    attachTo(region: RegionComponent): void;
    move(p: IPoint2D): void;
    resize(width: number, height: number): void;
    hide(): void;
    show(): void;
    showOnRegion(region: RegionComponent): void;
}
