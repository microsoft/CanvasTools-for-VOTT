import * as CTBaseRect from "./Base/CanvasTools.Base.Rect";
import Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
import * as CTBasePoint from "./Base/CanvasTools.Base.Point2D";
import Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
import * as CTBaseTag from "./Base/CanvasTools.Base.Tags";
import Tags = CTBaseTag.CanvasTools.Base.Tags;

import CTSelection = require("./CanvasTools.Selection");
import Selection = CTSelection.CanvasTools.Selection;

import CTRegionMgr = require("./Regions/CanvasTools.Regions.RegionsManager");
import CTRegionBase = require("./Regions/CanvasTools.Regions.Base");

import RegionsManager = CTRegionMgr.CanvasTools.Region.RegionsManager;
import RegionComponent = CTRegionBase.CanvasTools.Region.RegionBase.RegionComponentPrototype;

import CTToolbar = require("./CanvasTools.Toolbar");
import Toolbar = CTToolbar.CanvasTools.Toolbar;

export module CanvasTools.Editor {

    type ToolbarIconDescription = {
        type: Toolbar.ToolbarItemType.SELECTOR | Toolbar.ToolbarItemType.SWITCH,
        action: string,
        iconUrl: string,
        tooltip: string,
        keycode: string,
        actionCallback: (action: string, rm: RegionsManager, sl: Selection.AreaSelector) => void,
        width?: number,
        height?: number,
        activate: boolean
    } | {
        type: Toolbar.ToolbarItemType.SEPARATOR,
    }

    export class Editor {
        private toolbar: Toolbar.Toolbar;
        private regionsManager: RegionsManager;
        private areaSelector: Selection.AreaSelector;

        private isRMFrozen: boolean = false;

        constructor(regionsZone: SVGSVGElement, toolbarZone: SVGSVGElement, toolbarSet?:Array<ToolbarIconDescription>) {
            this.regionsManager = new RegionsManager(regionsZone, 
                (region?: RegionComponent) => {
                    this.areaSelector.hide();                    
                    this.onRegionManipulationBegin(region);
                },
                (region?: RegionComponent) => {
                    this.areaSelector.show();
                    this.onRegionManipulationEnd(region);
                });

                this.regionsManager.onRegionSelected = (id: string, multiselection: boolean) => {
                    this.onRegionSelected(id, multiselection);
                };
        
                this.regionsManager.onRegionMove = (id: string, x: number, y: number, width: number, height: number) => {
                    this.onRegionMove(id, x, y, width, height);
                };
        
                this.regionsManager.onRegionDelete = (id: string) => {
                    this.onRegionDelete(id);
                };

            this.areaSelector = new Selection.AreaSelector(regionsZone, 
                {
                    onSelectionBegin: () => {
                        this.isRMFrozen = this.regionsManager.isFrozen;
                        this.regionsManager.freeze();

                        this.onSelectionBegin();
                    },
                    onSelectionEnd: (commit) => {
                        if (!this.isRMFrozen) {
                            this.regionsManager.unfreeze();
                        }

                        this.onSelectionEnd(commit);
                    }
                })

            this.toolbar = new Toolbar.Toolbar(toolbarZone);

            if (toolbarSet !== undefined) {
                this.buildToolbarUI(toolbarSet);
            } else {
                this.buildToolbarUI(Editor.FullToolbarSet);
            }
        }

        public onRegionManipulationBegin(region?: RegionComponent): void {
            // do something
        }

        public onRegionManipulationEnd(region?: RegionComponent): void {
            // do something
        }

        public onRegionSelected(id: string, multiselection: boolean) {
             // do something
        }

        public onRegionMove(id: string, x: number, y: number, width: number, height: number) {
            // do something
        }

        public onRegionDelete(id: string) {
            // do something
        }

        public onSelectionBegin(): void {
            // do something
        }

        public onSelectionEnd(commit): void {  
            // do something          
        }

        public static FullToolbarSet: Array<ToolbarIconDescription> = [
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "none-select",
                iconUrl: "./images/icons/none-selection.svg",
                tooltip: "Regions Manipulation (M)",
                keycode: 'KeyM',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.NONE);
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SEPARATOR
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "point-select",
                iconUrl: "./images/icons/point-selection.svg",
                tooltip: "Point-selection (P)",
                keycode: 'KeyP',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.POINT);
                },
                activate: false
            },  
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "rect-select",
                iconUrl: "./images/icons/rect-selection.svg",
                tooltip: "Rectangular box (R)",
                keycode: 'KeyR',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.RECT);
                },
                activate: true
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "copy-select",
                iconUrl: "./images/icons/copy-t-selection.svg",
                tooltip: "Template-based box (T)",
                keycode: 'KeyT',
                actionCallback: (action, rm, sl) => {
                    let rs = rm.getSelectedRegionsBounds();
                    if (rs !== undefined && rs.length > 0) {
                        let r = rs[0];
                        sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(r.width, r.height) });
                    } else {
                        sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(40, 40) });
                    }
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "polyline-select",
                iconUrl: "./images/icons/polyline-selection.svg",
                tooltip: "Polyline-selection (Y)",
                keycode: 'KeyY',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.POLYLINE);
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SEPARATOR
            },
            {
                type: Toolbar.ToolbarItemType.SWITCH,
                action: "selection-lock",
                iconUrl: "./images/icons/selection-lock.svg",
                tooltip: "Lock/unlock regions (L)",
                keycode: 'KeyL',
                actionCallback: (action, rm, sl) => {
                    rm.toggleFreezeMode();
                },
                activate: false
            }

        ];

        public static RectToolbarSet: Array<ToolbarIconDescription> = [
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "none-select",
                iconUrl: "./images/icons/none-selection.svg",
                tooltip: "Regions Manipulation (M)",
                keycode: 'KeyM',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.NONE);
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SEPARATOR
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "rect-select",
                iconUrl: "./images/icons/rect-selection.svg",
                tooltip: "Rectangular box (R)",
                keycode: 'KeyR',
                actionCallback: (action, rm, sl) => {
                    sl.setSelectionMode(Selection.SelectionMode.RECT);
                },
                activate: true
            },
            {
                type: Toolbar.ToolbarItemType.SELECTOR,
                action: "copy-select",
                iconUrl: "./images/icons/copy-t-selection.svg",
                tooltip: "Template-based box (T)",
                keycode: 'KeyT',
                actionCallback: (action, rm, sl) => {
                    let rs = rm.getSelectedRegionsBounds();
                    if (rs !== undefined && rs.length > 0) {
                        let r = rs[0];
                        sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(r.width, r.height) });
                    } else {
                        sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(40, 40) });
                    }
                },
                activate: false
            },
            {
                type: Toolbar.ToolbarItemType.SEPARATOR
            },
            {
                type: Toolbar.ToolbarItemType.SWITCH,
                action: "selection-lock",
                iconUrl: "./images/icons/selection-lock.svg",
                tooltip: "Lock/unlock regions (L)",
                keycode: 'KeyL',
                actionCallback: (action, rm, sl) => {
                    rm.toggleFreezeMode();
                },
                activate: false
            }

        ];

        private buildToolbarUI(toolbarSet: Array<ToolbarIconDescription>) {
            let activeSelector: string;
            toolbarSet.forEach((item) => {
                if (item.type == Toolbar.ToolbarItemType.SEPARATOR) {
                    this.toolbar.addSeparator();
                } else if (item.type == Toolbar.ToolbarItemType.SELECTOR) {
                    this.toolbar.addSelector({
                        action: item.action,
                        iconUrl: item.iconUrl,
                        tooltip: item.tooltip,
                        keycode: item.keycode,
                        width: item.width,
                        height: item.height
                    }, (action) => {
                        item.actionCallback(action, this.regionsManager, this.areaSelector);
                    })

                    if (item.activate) {
                        activeSelector = item.action;                        
                    }
                } else if (item.type == Toolbar.ToolbarItemType.SWITCH) {
                    this.toolbar.addSwitch({
                        action: item.action,
                        iconUrl: item.iconUrl,
                        tooltip: item.tooltip,
                        keycode: item.keycode,
                        width: item.width,
                        height: item.height
                    }, (action) => {
                        item.actionCallback(action, this.regionsManager, this.areaSelector);
                    })

                    this.toolbar.setSwitch(item.action, item.activate);
                }


            })

            this.toolbar.select(activeSelector);
        }

        public resize(width: number, height: number) {
            this.regionsManager.resize(width, height);
            this.areaSelector.resize(width, height);
        }

        public get RM(): RegionsManager {
            return this.regionsManager;
        }
    }
}