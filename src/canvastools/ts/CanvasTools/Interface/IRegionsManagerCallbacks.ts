import { RegionData } from "../Core/RegionData";
import { RegionComponent } from "../Region/Component/RegionComponent";
import { IRegionCallbacks } from "./IRegionCallbacks";

export type RegionUpdateFunction = (id: string, regionData?: RegionData) => void;
export type RegionSelectionFunction = (id: string, multiselection?: boolean) => void;

/**
 * Defines a collection of events to be passed to the `RegionsManager` constructor.
 */
export interface IRegionsManagerCallbacks extends IRegionCallbacks {
    /**
     * The callback to be called when any of the regions is selected or unselected.
     */
    onRegionSelected?: RegionSelectionFunction;

    /**
     * The callback to be called when any of the regions is moving or resizing.
     */
    onRegionMove?: RegionUpdateFunction;

    /**
     * The callback to be called when any of the regions began moving or resizing.
     */
    onRegionMoveBegin?: RegionUpdateFunction;

    /**
     * The callback to be called when region moving or resizing ended.
     */
    onRegionMoveEnd?: RegionUpdateFunction;

    /**
     * The callback to be called when any regions is deleted from UI.
     */
    onRegionDelete?: RegionUpdateFunction;
}
