import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";
import { ManipulationFunction, ChangeEventType } from "../Interface/IRegionCallbacks";
import { IRegionsManagerCallbacks } from "../Interface/IRegionsManagerCallbacks";
import { TagsDescriptor } from "../Core/TagsDescriptor";
import { ITagsUpdateOptions } from "../Interface/ITagsUpdateOptions";
import { RectRegion } from "./Rect/RectRegion";
import { PointRegion } from "./Point/PointRegion";
import { PolygonRegion } from "./Polygon/PolygonRegion";
import { PolylineRegion } from "./Polyline/PolylineRegion";
import { MenuElement } from "./RegionMenu";
import { RegionData, RegionDataType } from "../Core/RegionData";
import { Region } from "./Region";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

export class RegionsManager {
    public callbacks: IRegionsManagerCallbacks;

    private baseParent: SVGSVGElement;
    private paper: Snap.Paper;
    private paperRect: Rect;

    private regions: Region[];

    private menuLayer: Snap.Element;
    private menu: MenuElement;

    private regionManagerLayer: Snap.Element;

    private isFrozenState: boolean = false;

    private justManipulated = false;

    public get isFrozen(): boolean {
        return this.isFrozenState;
    }

    private frozenNuance: string;

    private tagsUpdateOptions: ITagsUpdateOptions = {
        showRegionBackground: true,
    };

    constructor(svgHost: SVGSVGElement, callbacks: IRegionsManagerCallbacks) {
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

        this.regions = new Array<Region>();

        if (callbacks !== undefined) {
            this.callbacks = callbacks;

            if (typeof callbacks.onChange === "function") {
                this.callbacks.onChange = (region: Region, regionData: RegionData, state: ChangeEventType,
                                           multiSelection: boolean = false) => {
                    this.onRegionChange(region, regionData, state, multiSelection);
                    callbacks.onChange(region, regionData, state, multiSelection);
                };
            } else {
                this.callbacks.onChange = this.onRegionChange.bind(this);
            }
        } else {
            this.callbacks = {
                onChange: this.onRegionChange.bind(this),
                onManipulationBegin: null,
                onManipulationEnd: null,
            };
        }

        this.buildOn(this.paper);
        this.subscribeToEvents();
    }

    public addRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        if (regionData.type === RegionDataType.Point) {
            this.addPointRegion(id, regionData, tagsDescriptor);
        } else if (regionData.type === RegionDataType.Polyline) {
            this.addPolylineRegion(id, regionData, tagsDescriptor);
        } else if (regionData.type === RegionDataType.Rect) {
            this.addRectRegion(id, regionData, tagsDescriptor);
        } else if (regionData.type === RegionDataType.Polygon) {
            this.addPolygonRegion(id, regionData, tagsDescriptor);
        }
        this.sortRegionsByArea();
        this.redrawAllRegions();
    }

    // SETUP NEW REGION
    public addRectRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();

        const region = new RectRegion(this.paper, this.paperRect, regionData, id, tagsDescriptor,
                                      this.callbacks, this.tagsUpdateOptions);

        this.registerRegion(region);
    }

    public addPointRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();

        const region = new PointRegion(this.paper, this.paperRect, regionData, id, tagsDescriptor,
                                       this.callbacks, this.tagsUpdateOptions);

        this.registerRegion(region);
    }

    public addPolylineRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();

        const region = new PolylineRegion(this.paper, this.paperRect, regionData, id, tagsDescriptor,
                                          this.callbacks, this.tagsUpdateOptions);

        this.registerRegion(region);
    }

    public addPolygonRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();

        const region = new PolygonRegion(this.paper, this.paperRect, regionData, id, tagsDescriptor,
                                         this.callbacks, this.tagsUpdateOptions);

        this.registerRegion(region);
    }

/*     // REGION CREATION
    public drawRegion(x: number, y: number, rect: Rect, id: string, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();
        let region = new RectRegion(this.paper, this.paperRect, new Point2D(x, y), rect, id, tagsDescriptor,
            this.onManipulationBegin_local.bind(this),
            this.onManipulationEnd_local.bind(this),
            this.tagsUpdateOptions);
        region.area = rect.height * rect.width;
        region.onChange = this.onRegionChange.bind(this);

        region.updateTags(region.tags, this.tagsUpdateOptions);
        this.regionManagerLayer.add(region.node);
        this.regions.push(region);
        // Need to do a check for invalid stacking from user generated or older saved json
        if (this.regions.length > 1) {
            this.sortRegionsByArea();
            this.redrawAllRegions();
        }
        //this.menu.showOnRegion(region);
    } */

    // REDRAW ALL REGIONS (corrects z-order changes)
    public redrawAllRegions() {
        // re-add all elements to DOM based on new order
        window.requestAnimationFrame((e) => {
            this.regions.forEach((region) => {
                const node = region.node.remove();
                this.regionManagerLayer.add(node);
            });
        });
    }

    public getSelectedRegionsBounds() {
        const regions = this.lookupSelectedRegions().map((region) => {
            return {
                id: region.ID,
                x: region.x,
                y: region.y,
                width: region.boundRect.width,
                height: region.boundRect.height,
            };
        });
        return regions;
    }

    public deleteRegionById(id: string) {
        const region = this.lookupRegionByID(id);

        if (region != null) {
            this.deleteRegion(region);
        }
        this.menu.hide();

        if (this.callbacks.onManipulationEnd !== null) {
            this.callbacks.onManipulationEnd();
        }
    }

    public deleteAllRegions() {
        for (const region of this.regions) {
            region.removeStyles();
            region.node.remove();
        }
        this.regions = [];
        this.menu.hide();
    }

    // REGIONS TAGS UPDATE
    public updateTagsById(id: string, tagsDescriptor: TagsDescriptor) {
        const region = this.lookupRegionByID(id);

        if (region != null) {
            region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
        }
    }

    public updateTagsForSelectedRegions(tagsDescriptor: TagsDescriptor) {
        const regions = this.lookupSelectedRegions();

        regions.forEach((region) => {
            region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
        });
    }

    public selectRegionById(id: string) {
        const region = this.lookupRegionByID(id);
        this.selectRegion(region);
    }

    // MANAGER RESIZE
    public resize(width: number, height: number) {
        const tw = width / this.paperRect.width;
        const th = height / this.paperRect.height;

        this.paperRect.resize(width, height);

        this.menu.hide();

        // recalculate size/position for all regions;
        for (const region of this.regions) {
            region.move(new Point2D(region.x * tw, region.y * th));
            region.resize(region.boundRect.width * tw, region.boundRect.height * th);
        }
    }

    public freeze(nuance?: string) {
        this.regionManagerLayer.addClass("frozen");
        if (nuance !== undefined) {
            this.regionManagerLayer.addClass(nuance);
            this.frozenNuance = nuance;
        } else {
            this.frozenNuance = "";
        }
        this.menu.hide();
        this.regions.forEach((region) => {
            region.freeze();
        });

        this.isFrozenState = true;
    }

    public unfreeze() {
        this.regionManagerLayer.removeClass("frozen");
        if (this.frozenNuance !== "") {
            this.regionManagerLayer.removeClass(this.frozenNuance);
        }

        const selectedRegions = this.lookupSelectedRegions();

        if (selectedRegions.length > 0) {
            this.menu.showOnRegion(selectedRegions[0]);
        }

        this.regions.forEach((region) => {
            region.unfreeze();
        });

        this.isFrozenState = false;
    }

    public toggleFreezeMode() {
        if (this.isFrozen) {
            this.unfreeze();
        } else {
            this.freeze();
        }
    }

    // REGIONS LOOKUP
    private lookupRegionByID(id: string): Region {
        let region: Region = null;
        let i = 0;
        while (i < this.regions.length && region == null) {
            if (this.regions[i].ID === id) {
                region = this.regions[i];
            }
            i++;
        }
        return region;
    }

    // QUICKSORT REGIONS BY AREA DESCENDING
    private sortRegionsByArea() {
        function quickSort(arr: Region[], left: number, right: number) {
            let pivot: number;
            let partitionIndex: number;

            if (left < right) {
                pivot = right;
                partitionIndex = partition(arr, pivot, left, right);

                // sort left and right
                quickSort(arr, left, partitionIndex - 1);
                quickSort(arr, partitionIndex + 1, right);
            }
            return arr;
        }

        function partition(arr: Region[], pivot: number, left: number, right: number) {
            const pivotValue = arr[pivot].area;
            let partitionIndex = left;

            for (let i = left; i < right; i++) {
                if (arr[i].area > pivotValue) {
                    swap(arr, i, partitionIndex);
                    partitionIndex++;
                }
            }
            swap(arr, right, partitionIndex);
            return partitionIndex;
        }

        function swap(arr: Region[], i: number, j: number) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        const length = this.regions.length;
        if (length > 1) {
            quickSort(this.regions, 0, this.regions.length - 1);
        }
    }

    private lookupSelectedRegions(): Region[] {
        const collection = Array<Region>();

        for (const region of this.regions) {
            if (region.isSelected) {
                collection.push(region);
            }
        }

        return collection;
    }

    // REGIONS DELETE
    private deleteRegion(region: Region) {
        // remove style
        region.removeStyles();

        // remove element
        region.node.remove();
        this.regions = this.regions.filter((r) => {
            return r !== region;
        });

        if ((typeof this.callbacks.onRegionDelete) === "function") {
            this.callbacks.onRegionDelete(region.ID);
        }
    }

    private deleteSelectedRegions() {
        const collection = this.lookupSelectedRegions();
        for (const region of collection) {
            this.deleteRegion(region);
        }

        this.menu.hide();
        this.selectNextRegion();
        if (this.callbacks.onManipulationEnd !== null) {
            this.callbacks.onManipulationEnd();
        }
    }

    // REGIONS SELECTION
    private selectRegion(region: Region) {
        if (region != null) {
            this.unselectRegions(region);
            region.select();

            this.menu.showOnRegion(region);
            if ((typeof this.callbacks.onRegionSelected) === "function") {
                this.callbacks.onRegionSelected(region.ID);
            }
        }
    }

    private selectAllRegions() {
        let r = null;
        for (const region of this.regions) {
            r = region;
            r.select();

            if ((typeof this.callbacks.onRegionSelected) === "function") {
                this.callbacks.onRegionSelected(r.ID);
            }
        }
        if (r != null) {
            this.menu.showOnRegion(r);
        }
    }

    private selectNextRegion() {
        let region = null;
        let i = 0;
        const length = this.regions.length;

        if (length === 1) {
            region = this.regions[0];
        } else if (length > 1) {
            while (i < length && region == null) {
                if (this.regions[i].isSelected) {
                    region = (i === length - 1) ? this.regions[0] : this.regions[i + 1];
                }
                i++;
            }
        }

        if (region == null && length > 0) {
            region = this.regions[0];
        }

        this.selectRegion(region);
    }

    // REGIONS MOVE/RESIZE
    private reshapeRegion(region: Region, dx: number, dy: number, dw: number, dh: number, inverse: boolean = false) {
        let w: number;
        let h: number;
        let x: number;
        let y: number;
        if (!inverse) {
            w = region.boundRect.width + Math.abs(dw);
            h = region.boundRect.height + Math.abs(dh);
            x = region.x + dx + (dw > 0 ? 0 : dw);
            y = region.y + dy + (dh > 0 ? 0 : dh);
        } else {
            w = Math.max(0, region.boundRect.width - Math.abs(dw));
            h = Math.max(0, region.boundRect.height - Math.abs(dh));

            x = region.x + dx + (dw < 0 ? 0 : dw);
            y = region.y + dy + (dh < 0 ? 0 : dh);
        }

        const p1 = new Point2D(x, y).boundToRect(this.paperRect);
        const p2 = new Point2D(x + w, y + h).boundToRect(this.paperRect);

        region.move(p1);
        region.resize(p2.x - p1.x, p2.y - p1.y);
    }

    private moveSelectedRegions(dx: number, dy: number) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((r) => {
            this.reshapeRegion(r, dx, dy, 0, 0);
        });
        this.menu.showOnRegion(regions[0]);
    }

    private resizeSelectedRegions(dw: number, dh: number, inverse: boolean = false) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((r) => {
            this.reshapeRegion(r, 0, 0, dw, dh, inverse);
        });
        this.menu.showOnRegion(regions[0]);
    }

    private onRegionChange(region: Region, regionData: RegionData, state: ChangeEventType,
                           multiSelection: boolean = false) {
        // resize or drag begin
        if (state === ChangeEventType.MOVEBEGIN) {
            if (!multiSelection) {
                this.unselectRegions(region);
            }
            this.menu.hide();
            if ((typeof this.callbacks.onRegionSelected) === "function") {
                this.callbacks.onRegionSelected(region.ID);
            }
            if ((typeof this.callbacks.onRegionMoveBegin) === "function") {
                this.callbacks.onRegionMoveBegin(region.ID, regionData);
            }
            this.justManipulated = false;
            // resizing or dragging
        } else if (state === ChangeEventType.MOVING) {
            if ((typeof this.callbacks.onRegionMove) === "function") {
                this.callbacks.onRegionMove(region.ID, regionData);
            }
            this.justManipulated = true;
            // resize or drag end
        } else if (state === ChangeEventType.MOVEEND) {
            if (this.justManipulated) {
                region.select();
                this.menu.showOnRegion(region);
                this.sortRegionsByArea();
                this.redrawAllRegions();

                if ((typeof this.callbacks.onRegionMoveEnd) === "function") {
                    this.callbacks.onRegionMoveEnd(region.ID, regionData);
                }
            }
        } else if (state === ChangeEventType.SELECTIONTOGGLE && !this.justManipulated) {
            // select
            if (!region.isSelected) {
                if (!multiSelection) {
                    this.unselectRegions(region);
                }
                region.select();
                this.menu.showOnRegion(region);
                if ((typeof this.callbacks.onRegionSelected) === "function") {
                    this.callbacks.onRegionSelected(region.ID);
                }
                // unselect
            } else {
                region.unselect();
                this.menu.hide();
                if ((typeof this.callbacks.onRegionSelected) === "function") {
                    this.callbacks.onRegionSelected("");
                }
            }
        }
    }

    private unselectRegions(except?: Region) {
        for (const region of this.regions) {
            if (region !== except) {
                region.unselect();
            }
        }
    }

    private toggleBackground() {
        this.tagsUpdateOptions.showRegionBackground = !this.tagsUpdateOptions.showRegionBackground;

        this.regions.forEach((r) => {
            r.updateTags(r.tags, this.tagsUpdateOptions);
        });
    }

    private buildOn(paper: Snap.Paper) {
        this.regionManagerLayer = paper.g();
        this.regionManagerLayer.addClass("regionManager");

        this.menuLayer = paper.g();
        this.menuLayer.addClass("menuManager");
        this.menu = new MenuElement(paper, this.paperRect, new RegionData(0, 0, 0, 0), this.callbacks);

        this.menu.addAction("delete", "trash", (region: Region) => {
            this.deleteRegion(region);
            this.menu.hide();
        });

        this.menuLayer.add(this.menu.menuGroup);
        this.menu.hide();
    }

    private subscribeToEvents() {
        this.regionManagerLayer.mouseover((e: MouseEvent) => {
            if (this.callbacks.onManipulationBegin !== null) {
                this.callbacks.onManipulationBegin();
            }
        });

        this.regionManagerLayer.mouseout((e: MouseEvent) => {
            if (this.callbacks.onManipulationEnd !== null) {
                this.callbacks.onManipulationEnd();
            }
        });

        window.addEventListener("keyup", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (!this.isFrozen) {
                    switch (e.keyCode) {
                        // tab
                        case 9:
                            this.selectNextRegion();
                            break;

                        // delete, backspace
                        case 46:
                        case 8:
                            this.deleteSelectedRegions();
                            break;
                        // ctrl + up
                        case 38:
                            if (e.ctrlKey) {
                                if (!e.shiftKey && !e.altKey) {
                                    this.moveSelectedRegions(0, -5);
                                } else if (e.shiftKey && !e.altKey) {
                                    this.resizeSelectedRegions(0, -5);
                                } else if (e.altKey && !e.shiftKey) {
                                    this.resizeSelectedRegions(0, -5, true);
                                }
                            }
                            break;
                        // ctrl + down
                        case 40:
                            if (e.ctrlKey) {
                                if (!e.shiftKey && !e.altKey) {
                                    this.moveSelectedRegions(0, 5);
                                } else if (e.shiftKey && !e.altKey) {
                                    this.resizeSelectedRegions(0, 5);
                                } else if (e.altKey && !e.shiftKey) {
                                    this.resizeSelectedRegions(0, 5, true);
                                }
                            }
                            break;
                        // ctrl + left
                        case 37:
                            if (e.ctrlKey) {
                                if (!e.shiftKey && !e.altKey) {
                                    this.moveSelectedRegions(-5, 0);
                                } else if (e.shiftKey && !e.altKey) {
                                    this.resizeSelectedRegions(-5, 0);
                                } else if (e.altKey && !e.shiftKey) {
                                    this.resizeSelectedRegions(-5, 0, true);
                                }
                            }
                            break;
                        // ctrl + right
                        case 39:
                            if (e.ctrlKey) {
                                if (!e.shiftKey && !e.altKey) {
                                    this.moveSelectedRegions(5, 0);
                                } else if (e.shiftKey && !e.altKey) {
                                    this.resizeSelectedRegions(5, 0);
                                } else if (e.altKey && !e.shiftKey) {
                                    this.resizeSelectedRegions(5, 0, true);
                                }
                            }
                            break;
                        // default
                        default: return;
                    }
                    e.preventDefault();
                }
            }
        });
        window.addEventListener("keydown", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (!this.isFrozen) {
                    switch (e.code) {
                        // ctrl + A, ctrl + a
                        case "KeyA":
                        case "Numpad1":
                            if (e.ctrlKey) {
                                this.selectAllRegions();
                            }
                            break;
                        // ctrl + B, ctrl + b
                        case "KeyB":
                            if (e.ctrlKey) {
                                this.toggleBackground();
                            }
                            break;
                        // default
                        default: return;
                    }
                    // e.preventDefault();
                }
            }
        });
    }

    private registerRegion(region: Region) {
        this.unselectRegions();
        region.select();

        this.regionManagerLayer.add(region.node);
        this.regions.push(region);

        this.menu.showOnRegion(region);
    }
}
