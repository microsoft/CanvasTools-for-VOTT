import { RegionData } from "../Core/RegionData";
import { RegionComponent } from "../Region/Component/RegionComponent";

/**
 * Defines callbacks for region manipulation events.
 * @remarks Used to sync the internal state with the `AreaSelector`.
 */
export type ManipulationFunction = (UIElement?: RegionComponent) => void;

/**
 * Defines supported events types for regions.
 */
export enum ChangeEventType { MOVEEND, MOVING, MOVEBEGIN, SELECTIONTOGGLE }

/**
 * Defines callbacks for regions state change events.
 */
export type ChangeFunction = (region: RegionComponent, regionData: RegionData,
                              eventType?: ChangeEventType, multiSelection?: boolean) => void;

/**
 * Defines a collection of events to be passed to the `Region` constructor.
 */
export interface IRegionCallbacks {
    /**
     * The callback to be called when some manipulation with the region began.
     */
    onManipulationBegin: ManipulationFunction;

    /**
     * The callback to be called when some manipulation with the region ended.
     */
    onManipulationEnd: ManipulationFunction;

    /**
     * The callback to be called when region state changes.
     */
    onChange: ChangeFunction;
}
