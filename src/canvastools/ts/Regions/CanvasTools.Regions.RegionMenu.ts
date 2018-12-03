import * as CTBaseInterfaces from "../Base/CanvasTools.Base.Interfaces";
import IBase = CTBaseInterfaces.CanvasTools.Base.Interfaces;
import * as CTBaseRect from "../Base/CanvasTools.Base.Rect";
import Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
import * as CTBasePoint from "../Base/CanvasTools.Base.Point2D";
import Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
import * as CTBaseTag from "../Base/CanvasTools.Base.Tags";
import Tags = CTBaseTag.CanvasTools.Base.Tags;

import * as CTRegion from "./CanvasTools.Regions.Base";
import RegionBase = CTRegion.CanvasTools.Region.RegionBase;

import * as Snap from "snapsvg";

export module CanvasTools.Region.RegionMenu {
    /*
     * MenuElement 
     * Used internally to show actions menu for the region
    */
    export class MenuElement extends RegionBase.RegionComponentPrototype {
        // Menu Item Size
        private menuItemSize: number = 20;
        // Menu position;
        private mx: number;
        private my: number;
        private mw: number = this.menuItemSize + 10;
        private mh: number = 60;

        // threshold for positioning menu inside/outside
        private dh: number = 20;
        // threshold for positioning menu left/right
        private dw: number = 5;

        // Menu group
        public menuGroup: Snap.Paper;
        public menuRect: Snap.Element;
        public menuItemsGroup: Snap.Element;
        public menuItems: Array<Snap.Element>;

        private region: RegionBase.RegionComponentPrototype;

        constructor(paper: Snap.Paper, x: number, y: number, rect: IBase.IRect, paperRect: IBase.IRect = null, onManipulationBegin?: RegionBase.ManipulationFunction, onManipulationEnd?: RegionBase.ManipulationFunction) {
            super(paper, paperRect);
            this.boundRect = rect;
            this.x = x;
            this.y = y;

            if (onManipulationBegin !== undefined) {
                this.onManipulationBegin = onManipulationBegin;
            }
            if (onManipulationEnd !== undefined) {
                this.onManipulationEnd = onManipulationEnd;
            }

            this.buildOn(this.paper);
        }

        private buildOn(paper: Snap.Paper) {
            let menuSVG = this.paper.svg(this.mx, this.my, this.mw, this.mh, this.mx, this.my, this.mw, this.mh) as SVGGraphicsElement;

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
            //this.menuGroup.add(this.menuRect);
            //this.menuGroup.add(this.menuItemsGroup);

            this.menuGroup.mouseover((e) => {
                this.onManipulationBegin();
            })
            this.menuGroup.mouseout((e) => {
                this.onManipulationEnd();
            })
        }

        private pathCollection = {
            "delete": {
                path: "M 83.4 21.1 L 74.9 12.6 L 48 39.5 L 21.1 12.6 L 12.6 21.1 L 39.5 48 L 12.6 74.9 L 21.1 83.4 L 48 56.5 L 74.9 83.4 L 83.4 74.9 L 56.5 48 Z",
                iconSize: 96
            }
        }

        public addAction(action: string, icon: string, actor: Function) {
            let item = this.menuGroup.g();
            let itemBack = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
            itemBack.addClass("menuItemBack");

            let k = (this.menuItemSize - 4) / this.pathCollection.delete.iconSize;
            let itemIcon = this.menuGroup.path(this.pathCollection.delete.path);
            itemIcon.transform(`scale(0.2) translate(26 26)`);

            //let itemIcon = this.menuGroup.text(6, 19, "✖");
            itemIcon.addClass("menuIcon");
            itemIcon.addClass("menuIcon-" + icon);

            let itemRect = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
            itemRect.addClass("menuItem");

            item.add(itemBack);
            item.add(itemIcon);
            item.add(itemRect);

            item.click((e) => {
                actor(this.region);
            });

            this.menuItemsGroup.add(item);
            this.menuItems.push(item);
        }

        private rearrangeMenuPosition() {
            // position menu inside
            if (this.mh <= this.boundRect.height - this.dh) {
                this.my = this.y + this.boundRect.height / 2 - this.mh / 2;
                // position menu on the right side
                if (this.x + this.boundRect.width + this.mw / 2 + this.dw < this.paperRect.width) {
                    this.mx = this.x + this.boundRect.width - this.mw / 2;
                }
                // position menu on the left side
                else if (this.x - this.mw / 2 - this.dw > 0) {
                    this.mx = this.x - this.mw / 2;
                }
                // position menu on the right side INSIDE 
                else {
                    this.mx = this.x + this.boundRect.width - this.mw - this.dw;
                }
            }
            // position menu outside
            else {
                if (this.y + this.mh > this.paperRect.height) {
                    this.my = this.paperRect.height - this.mh - this.dw;
                } else {
                    this.my = this.y;
                }
                // position menu on the right side
                if (this.x + this.boundRect.width + this.mw + 2 * this.dw < this.paperRect.width) {
                    this.mx = this.x + this.boundRect.width + this.dw;
                }
                // position menu on the left side
                else if (this.x - this.mw - 2 * this.dw > 0) {
                    this.mx = this.x - this.mw - this.dw;
                }
                // position menu on the right side INSIDE 
                else {
                    this.mx = this.x + this.boundRect.width - this.mw - this.dw;
                }
            }
        }

        public attachTo(region: RegionBase.RegionComponentPrototype) {
            this.region = region;
            this.x = region.x;
            this.y = region.y;
            this.boundRect = region.boundRect;
            this.rearrangeMenuPosition();

            window.requestAnimationFrame(() => {
                this.menuGroup.attr({
                    x: this.mx,
                    y: this.my
                });
            });
        }

        public move(p: IBase.IPoint2D) {
            super.move(p);

            this.rearrangeMenuPosition();

            window.requestAnimationFrame(() => {
                this.menuGroup.attr({
                    x: this.mx,
                    y: this.my
                });
            });
        }

        public resize(width: number, height: number) {
            super.resize(width, height);

            this.rearrangeMenuPosition();

            window.requestAnimationFrame(() => {
                this.menuGroup.attr({
                    x: this.mx,
                    y: this.my
                });
            });
        }

        // IHideable -> hide()
        public hide() {
            window.requestAnimationFrame(() => {
                this.menuGroup.attr({
                    visibility: 'hidden'
                });
            });

        }

        // IHideable -> show()
        public show() {
            window.requestAnimationFrame(() => {
                this.menuGroup.attr({
                    visibility: 'visible'
                });
            });
        }

        public showOnRegion(region: RegionBase.RegionComponentPrototype) {
            this.attachTo(region);
            this.show();
        }
    }
}