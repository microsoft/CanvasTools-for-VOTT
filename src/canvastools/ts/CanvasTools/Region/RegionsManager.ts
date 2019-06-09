import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";
import { ChangeEventType } from "../Interface/IRegionCallbacks";
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
import { RegionComponent } from "./Component/RegionComponent";

import * as Snap from "snapsvg-cjs";

/**
 * The manager for visual region objects.
 */
export class RegionsManager {
    /**
     * Reference to external callbacks.
     */
    public callbacks: IRegionsManagerCallbacks;

    /**
     * Reference to the host SVG element.
     */
    private baseParent: SVGSVGElement;

    /**
     * Reference to the `Snap.Paper` object to draw on.
     */
    private paper: Snap.Paper;

    /**
     * The paper bounding box.
     */
    private paperRect: Rect;

    /**
     * Collection of regions.
     */
    private regions: Region[];

    /**
     * Grouping element for menu element.
     */
    private menuLayer: Snap.Element;

    /**
     * Reference to the `MenuElement` object.
     */
    private menu: MenuElement;

    /**
     * Grouping layer for the manager.
     */
    private regionManagerLayer: Snap.Element;

    /**
     * Global freezing state.
     */
    private isFrozenState: boolean = false;

    /**
     * Internal manipulation flag.
     */
    private justManipulated = false;

    /**
     * Internal flag for locking manipulation.
     */
    private manipulationLock = false;

    /**
     * Returns current freezing state.
     */
    public get isFrozen(): boolean {
        return this.isFrozenState;
    }

    /**
     * Additional CSS class to be added when manager is frozen.
     */
    private frozenNuance: string;

    /**
     * Tags create/redraw options.
     */
    private tagsUpdateOptions: ITagsUpdateOptions = {
        showRegionBackground: true,
    };

    /**
     * Creates new `RegionsManager`.
     * @param svgHost - The hosting SVG element.
     * @param callbacks - Reference to the callbacks collection.
     */
    constructor(svgHost: SVGSVGElement, callbacks: IRegionsManagerCallbacks) {
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);

        this.regions = new Array<Region>();

        this.callbacks = {
            onChange: (region: Region, regionData: RegionData, state: ChangeEventType,
                       multiSelection: boolean = false) => {
                this.onRegionChange(region, regionData, state, multiSelection);
                if (typeof callbacks.onChange === "function") {
                    callbacks.onChange(region, regionData, state, multiSelection);
                }
            },
            onManipulationLockRequest: (region?: RegionComponent) => {
                this.manipulationLock = true;

                if (typeof callbacks.onManipulationLockRequest === "function") {
                    callbacks.onManipulationLockRequest(region);
                }
            },
            onManipulationLockRelease: (region?: RegionComponent) => {
                this.manipulationLock = false;

                if (typeof callbacks.onManipulationLockRelease === "function") {
                    callbacks.onManipulationLockRelease(region);
                }
            },
            onManipulationBegin: this.functionGuard(callbacks.onManipulationBegin),
            onManipulationEnd: (region?: RegionComponent) => {
                if (!this.manipulationLock && typeof callbacks.onManipulationEnd === "function") {
                    callbacks.onManipulationEnd(region);
                }
            },
            onRegionDelete: this.functionGuard(callbacks.onRegionDelete),
            onRegionMoveBegin: this.functionGuard(callbacks.onRegionMoveBegin),
            onRegionMove: this.functionGuard(callbacks.onRegionMove),
            onRegionMoveEnd: this.functionGuard(callbacks.onRegionMoveEnd),
            onRegionSelected: this.functionGuard(callbacks.onRegionSelected),
        };

        this.buildOn(this.paper);
        this.subscribeToEvents();
    }

    /**
     * Add new region to the manager. Automatically defines region type based on the `type` property.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
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

    /**
     * Add new rect region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    public addRectRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();

        const region = new RectRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor,
                                      this.tagsUpdateOptions);

        this.registerRegion(region);
    }

    /**
     * Add new point region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    public addPointRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();

        const region = new PointRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor,
                                       this.tagsUpdateOptions);

        this.registerRegion(region);
    }

    /**
     * Add new polyline region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    public addPolylineRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();

        const region = new PolylineRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor,
                                          this.tagsUpdateOptions);

        this.registerRegion(region);
    }

    /**
     * Add new polygon region to the manager.
     * @param id - The region ID.
     * @param regionData - The `RegionData` object defining region.
     * @param tagsDescriptor - The tags descriptor object.
     */
    public addPolygonRegion(id: string, regionData: RegionData, tagsDescriptor: TagsDescriptor) {
        this.menu.hide();

        const region = new PolygonRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor,
                                         this.tagsUpdateOptions);

        this.registerRegion(region);
    }

    /**
     * Redraws all regions. Reinserts regions in actual order.
     */
    public redrawAllRegions() {
        // re-add all elements to DOM based on new order
        window.requestAnimationFrame((e) => {
            this.regions.forEach((region) => {
                const node = region.node.remove();
                this.regionManagerLayer.add(node);
            });
        });
    }

    /**
     * Returns bounding boxes of the selected regions.
     * @deprecated Use `getSelectedRegions` method instead
     */
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

    /**
     * Returns a collection of selected regions.
     */
    public getSelectedRegions(): Array<{ id: string, regionData: RegionData }> {
        const regions = this.lookupSelectedRegions().map((region) => {
            return {
                id: region.ID,
                regionData: region.regionData,
            };
        });
        return regions;
    }

    /**
     * Deletes a region with specified `id`.
     * @param id - Id of the region to delete.
     */
    public deleteRegionById(id: string) {
        const region = this.lookupRegionByID(id);

        if (region != null) {
            this.deleteRegion(region);
        }

        this.callbacks.onManipulationEnd();
    }

    /**
     * Deletes all the regions from the manager.
     */
    public deleteAllRegions() {
        for (const region of this.regions) {
            region.removeStyles();
            region.node.remove();
        }
        this.regions = [];
        this.menu.hide();
    }

    /**
     * Updates tags of the specified region.
     * @param id - The `id` of the region to update.
     * @param tagsDescriptor - The new tags descriptor object.
     */
    public updateTagsById(id: string, tagsDescriptor: TagsDescriptor) {
        const region = this.lookupRegionByID(id);

        if (region != null) {
            region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
        }
    }

    /**
     * Updates tags for all selected regions.
     * @param tagsDescriptor - The new tags descriptor object.
     */
    public updateTagsForSelectedRegions(tagsDescriptor: TagsDescriptor) {
        const regions = this.lookupSelectedRegions();

        regions.forEach((region) => {
            region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
        });
    }

    /**
     * Selects the region specified by `id`.
     * @param id - The `id` of the region to select.
     */
    public selectRegionById(id: string) {
        const region = this.lookupRegionByID(id);
        this.selectRegion(region);
    }

    /**
     * Resizes the manager to specified `width` and `height`.
     * @param width - The new manager width.
     * @param height - The new manager height.
     */
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

    /**
     * Freezes the manager and all its current regions.
     * @param nuance - [optional] Additional css-class to add to the manager.
     */
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

    /**
     * Unfreezes the manager and all its regions.
     */
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

    /**
     * Toggles freezing mode.
     */
    public toggleFreezeMode() {
        if (this.isFrozen) {
            this.unfreeze();
        } else {
            this.freeze();
        }
    }

    /**
     * Changes the tags drawing setting to draw background or make it transparent.
     */
    public toggleBackground() {
        this.tagsUpdateOptions.showRegionBackground = !this.tagsUpdateOptions.showRegionBackground;

        this.regions.forEach((r) => {
            r.updateTags(r.tags, this.tagsUpdateOptions);
        });
    }

    /**
     * Finds the region by specified `id`.
     * @param id - The `id` to look for.
     */
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

    /**
     * Internal helper function to sort regions by their area.
     */
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

    /**
     * Finds all selected regions.
     */
    private lookupSelectedRegions(): Region[] {
        const collection = Array<Region>();

        for (const region of this.regions) {
            if (region.isSelected) {
                collection.push(region);
            }
        }

        return collection;
    }

    /**
     * Deletes provided region.
     * @param region - The region to delete.
     */
    private deleteRegion(region: Region) {
        // remove style
        region.removeStyles();

        // remove element
        region.node.remove();
        this.regions = this.regions.filter((r) => {
            return r !== region;
        });

        this.menu.hide();

        this.callbacks.onRegionDelete(region.ID, region.regionData);
    }

    /**
     * Deletes all selected regions.
     */
    private deleteSelectedRegions() {
        const collection = this.lookupSelectedRegions();
        for (const region of collection) {
            this.deleteRegion(region);
        }

        this.selectNextRegion();
        this.callbacks.onManipulationEnd();
    }

    /**
     * Selects specified region.
     * @param region - The region to select.
     */
    private selectRegion(region: Region) {
        if (region !== null) {
            this.unselectRegions(region);
            region.select();

            this.menu.showOnRegion(region);
            this.callbacks.onRegionSelected(region.ID);
        }
    }

    /**
     * Selects all the regions.
     */
    private selectAllRegions() {
        let r = null;
        for (const region of this.regions) {
            r = region;
            r.select();

            this.callbacks.onRegionSelected(r.ID);
        }
        if (r != null) {
            this.menu.showOnRegion(r);
        }
    }

    /**
     * Selects the next region (based on current order, e.g., sorted by area).
     */
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

    /**
     * Moves or changes region size
     * @param region - The region to be changed.
     * @param dx - x-coordinate shift.
     * @param dy - y-coordinate shift.
     * @param dw - width-shift.
     * @param dh - height-shift.
     * @param inverse - flag if the change is inverted.
     */
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

    /**
     * Moves the selected region with specified shift in coordinates
     * @param dx - x-coordinate shift.
     * @param dy - y-coordinate shift.
     */
    private moveSelectedRegions(dx: number, dy: number) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((r) => {
            this.reshapeRegion(r, dx, dy, 0, 0);
        });
        this.menu.showOnRegion(regions[0]);
    }

    /**
     * Resizes the selected region with specified width and height shifts.
     * @param dw - width-shift.
     * @param dh - height-shift.
     * @param inverse - flag if the change is inverted.
     */
    private resizeSelectedRegions(dw: number, dh: number, inverse: boolean = false) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((r) => {
            this.reshapeRegion(r, 0, 0, dw, dh, inverse);
        });
        this.menu.showOnRegion(regions[0]);
    }

    /**
     * The callback function fot internal components.
     * @param component - Reference to the UI component.
     * @param regionData - New RegionData object.
     * @param state - New state of the region.
     * @param multiSelection - Flag for multiselection.
     */
    private onRegionChange(region: Region, regionData: RegionData, state: ChangeEventType,
                           multiSelection: boolean = false) {
        // resize or drag begin
        if (state === ChangeEventType.MOVEBEGIN) {
            if (!multiSelection) {
                this.unselectRegions(region);
            }
            this.menu.hide();
            this.callbacks.onRegionSelected(region.ID, multiSelection);
            this.callbacks.onRegionMoveBegin(region.ID, regionData);
            this.justManipulated = false;
            // resizing or dragging
        } else if (state === ChangeEventType.MOVING) {
            this.callbacks.onRegionMove(region.ID, regionData);
            this.justManipulated = true;
            // resize or drag end
        } else if (state === ChangeEventType.MOVEEND) {
            if (this.justManipulated) {
                region.select();
                this.menu.showOnRegion(region);
                this.sortRegionsByArea();
                this.redrawAllRegions();
                this.callbacks.onRegionMoveEnd(region.ID, regionData);
            }
        } else if (state === ChangeEventType.SELECTIONTOGGLE && !this.justManipulated) {
            // select
            if (!region.isSelected) {
                if (!multiSelection) {
                    this.unselectRegions(region);
                }
                region.select();
                this.menu.showOnRegion(region);
                this.callbacks.onRegionSelected(region.ID, multiSelection);
                // unselect
            } else {
                region.unselect();
                this.menu.hide();
                this.callbacks.onRegionSelected("", multiSelection);
            }
        }
    }

    /**
     * Unselects all the regions, naybe except the one specified.
     * @param except - Region to ignore.
     */
    private unselectRegions(except?: Region) {
        for (const region of this.regions) {
            if (region !== except) {
                region.unselect();
            }
        }
    }

    /**
     * Inits regions manager UI.
     * @param paper - The `Snap.Paper` element to draw on.
     */
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

    /**
     * Helper function to subscribe manager to pointer and keyboard events.
     */
    private subscribeToEvents() {
        this.regionManagerLayer.node.addEventListener("pointerenter", (e: PointerEvent) => {
            this.callbacks.onManipulationBegin();
        });

        this.regionManagerLayer.node.addEventListener("pointerleave", (e: PointerEvent) => {
            this.callbacks.onManipulationEnd();
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
                    }
                    // e.preventDefault();
                }
            }
        });
    }

    /**
     * Registers the provided region in the manager.
     * @param region - The new region to register.
     */
    private registerRegion(region: Region) {
        this.unselectRegions();
        region.select();

        this.regionManagerLayer.add(region.node);
        this.regions.push(region);

        this.menu.showOnRegion(region);
    }

    /**
     * Wraps provided function into a checker that it exists
     * @param f - Function to wrap
     */
    private functionGuard<T extends any[]>(f: (...args: T) => void): (...args: T) => void {
        return (...args) => {
            if (typeof f === "function") {
                f(...args);
            }
        };
    }
}
