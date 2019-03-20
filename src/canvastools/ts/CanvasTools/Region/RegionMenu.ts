import { Rect } from "../Core/Rect";
import { RegionData } from "../Core/RegionData";

import { IMovable } from "../Interface/IMovable";
import { IRegionCallbacks } from "../Interface/IRegionCallbacks";

import { RegionComponent } from "./Component/RegionComponent";
import { Region } from "./Region";

/**
 * The region menu element.
 */
export class MenuElement extends RegionComponent {
    /**
     * The SVG path for x-button (close).
     */
    public static PathCollection = {
        delete: {
            iconSize: 96,
            path: "M 83.4 21.1 L 74.9 12.6 L 48 39.5 L 21.1 12.6 L 12.6 21.1 L 39.5 48 L 12.6 74.9 " +
                  "L 21.1 83.4 L 48 56.5 L 74.9 83.4 L 83.4 74.9 L 56.5 48 Z",
        },
    };

    /**
     * Menu group object.
     */
    public menuGroup: Snap.Paper;

    /**
     * Menu background rect.
     */
    public menuRect: Snap.Element;

    /**
     * Reference to the grouping object for menu items.
     */
    public menuItemsGroup: Snap.Element;

    /**
     * Menu items collection.
     */
    public menuItems: Snap.Element[];

    /**
     * Default menu item size.
     */
    private menuItemSize: number = 20;

    /**
     * Menu x-coordinate.
     */
    private mx: number;

    /**
     * Menu y-coordinate.
     */
    private my: number;

    /**
     * Default menu width.
     */
    private mw: number = this.menuItemSize + 10;

    /**
     * Default menu height.
     */
    private mh: number = this.menuItemSize + 10;

    /**
     * Threshold for positioning menu inside/outside
     */
    private dh: number = 20;

    /**
     * Threshold for positioning menu left/right
     */
    private dw: number = 5;

    /**
     * Reference to the host region element.
     */
    private region: RegionComponent;

    /**
     * Creates the menu component.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.buildUI();
    }

    /**
     * Add a new icon with action to menu.
     * @param action - Item action description.
     * @param icon - Item SVG-path string.
     * @param actor - The callback function.
     */
    public addAction(action: string, icon: string, actor: (component: RegionComponent, action?: string) => void) {
        const item = this.menuGroup.g();
        const itemBack = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemBack.addClass("menuItemBack");

        const itemIcon = this.menuGroup.path(MenuElement.PathCollection.delete.path);
        itemIcon.transform(`scale(0.2) translate(26 26)`);

        itemIcon.addClass("menuIcon");
        itemIcon.addClass("menuIcon-" + icon);

        const itemRect = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemRect.addClass("menuItem");

        item.add(itemBack);
        item.add(itemIcon);
        item.add(itemRect);

        item.click((e) => {
            actor(this.region, action);
        });

        this.menuItemsGroup.add(item);
        this.menuItems.push(item);
    }

    /**
     * Attach the menu to specified region element.
     * @param region - The host region element.
     */
    public attachTo(region: Region) {
        this.region = region;
        this.regionData.initFrom(region.regionData);
        this.rearrangeMenuPosition();

        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }

    /**
     * Move menu according to new region location
     * @remarks This method moves the virtual shadow of the region and then rearranges menu position.
     * @param point - New region location.
     */
    public move(point: IMovable): void;

    /**
     * Move menu according to new region coordinates.
     * @remarks This method moves the virtual shadow of the region and then rearranges menu position.
     * @param x - New region x-coordinate.
     * @param y - New region y-coordinate.
     */
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any): void {
        super.move(arg1, arg2);

        this.rearrangeMenuPosition();

        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }

    /**
     * Move menu according to new region size.
     * @remarks This method moves the virtual shadow of the region and then rearranges menu position.
     * @param width - New region width.
     * @param height - New region height.
     */
    public resize(width: number, height: number) {
        super.resize(width, height);

        this.rearrangeMenuPosition();

        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }

    /**
     * Redraw menu element.
     */
    public redraw() {
        // do nothing
    }

    /**
     * Visually hide menu element.
     */
    public hide() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: "hidden",
            });
        });

    }

    /**
     * Visually show menu element.
     */
    public show() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: "visible",
            });
        });
    }

    /**
     * Show menu element on the specified region.
     * @param region - The host region element.
     */
    public showOnRegion(region: Region) {
        this.attachTo(region);
        this.show();
    }

    /**
     * Creates the menu element UI.
     */
    private buildUI() {
        const menuSVG = this.paper.svg(this.mx, this.my, this.mw, this.mh,
                                     this.mx, this.my, this.mw, this.mh) as SVGGraphicsElement;

        // Snap.Paper
        this.menuGroup = Snap(menuSVG).paper;
        this.menuGroup.addClass("menuLayer");

        this.rearrangeMenuPosition();

        this.menuRect = this.menuGroup.rect(0, 0, this.mw, this.mh, 5, 5);
        this.menuRect.addClass("menuRectStyle");

        this.menuItemsGroup = this.menuGroup.g();
        this.menuItemsGroup.addClass("menuItems");

        this.menuItems = new Array<Snap.Element>();

        this.menuGroup.add(this.menuRect);
        this.menuGroup.add(this.menuItemsGroup);

        this.menuGroup.mouseover((e) => {
            this.callbacks.onManipulationBegin();
        });

        this.menuGroup.mouseout((e) => {
            this.callbacks.onManipulationEnd();
        });
    }

    /**
     * Updates menu position.
     */
    private rearrangeMenuPosition() {
        /* // position menu inside
        if (this.mh <= this.boundRect.height - this.dh) {
            this.my = this.y + this.boundRect.height / 2 - this.mh / 2;
            // position menu on the right side
            if (this.x + this.boundRect.width + this.mw / 2 + this.dw < this.paperRect.width) {
                this.mx = this.x + this.boundRect.width - this.mw / 2;
            } else if (this.x - this.mw / 2 - this.dw > 0) { // position menu on the left side
                this.mx = this.x - this.mw / 2;
            } else { // position menu on the right side INSIDE
                this.mx = this.x + this.boundRect.width - this.mw - this.dw;
            }
        } else { // position menu outside
            if (this.y + this.mh > this.paperRect.height) {
                this.my = this.paperRect.height - this.mh - this.dw;
            } else {
                this.my = this.y;
            }
            // position menu on the right side
            if (this.x + this.boundRect.width + this.mw + 2 * this.dw < this.paperRect.width) {
                this.mx = this.x + this.boundRect.width + this.dw;
            } else if (this.x - this.mw - 2 * this.dw > 0) { // position menu on the left side
                this.mx = this.x - this.mw - this.dw;
            } else { // position menu on the right side INSIDE
                this.mx = this.x + this.boundRect.width - this.mw - this.dw;
            }
        } */

        // position menu outside
        if (this.y + this.mh + this.dw > this.paperRect.height) {
            this.my = this.paperRect.height - this.mh - this.dw;
        } else {
            this.my = this.y + this.dw;
        }
        // position menu on the right side
        if (this.x + this.boundRect.width + this.mw + 2 * this.dw < this.paperRect.width) {
            this.mx = this.x + this.boundRect.width + this.dw;
        } else if (this.x - this.mw - 2 * this.dw > 0) { // position menu on the left side
            this.mx = this.x - this.mw - this.dw;
        } else { // position menu on the right side INSIDE
            this.mx = this.x + this.boundRect.width - this.mw - this.dw;
        }

    }
}
