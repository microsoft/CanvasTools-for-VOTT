import { RegionData } from "../Core/RegionData";
import { RegionComponent } from "../Region/Component/RegionComponent";

/**
 * Defines callbacks for region manipulation events.
 * @remarks Used to sync the internal state with the `AreaSelector`.
 */
export type RegionManipulationFunction = (UIElement?: RegionComponent) => void;

/**
 * Defines callbacks for requesting/releasing manipulation lock.
 */
export type RegionManipulationLockFunction = (UIElement?: RegionComponent) => void;

/**
 * Defines supported events types for regions.
 */
export enum ChangeEventType { MOVEEND, MOVING, MOVEBEGIN, SELECTIONTOGGLE }

/**
 * Defines callbacks for regions state change events.
 */
export type RegionChangeFunction = (region: RegionComponent, regionData: RegionData,
                                    eventType?: ChangeEventType, multiSelection?: boolean) => void;

/**
 * Defines a collection of events to be passed to the `Region` constructor.
 */
export interface IRegionCallbacks {
    /**
     * The callback to be called when some manipulation with the region began.
     */
    onManipulationBegin: RegionManipulationFunction;

    /**
     * The callback to be called when some manipulation with the region ended.
     */
    onManipulationEnd: RegionManipulationFunction;

    /**
     * The callback to be called when region state changes.
     */
    onChange: RegionChangeFunction;

    /**
     * The callback to be called when manipulation should be locked down (exclusive).
     */
    onManipulationLockRequest?: RegionManipulationLockFunction;

    /**
     * The callback to be called when manipulation is done and lock should be released.
     */
    onManipulationLockRelease?: RegionManipulationLockFunction;
}
