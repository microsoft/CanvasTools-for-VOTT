import { RegionData } from "../Core/RegionData";

export type SelectionNotifyFunction = () => void;
export type SelectionConfirmFunction = (regionData: RegionData) => void;
/**
 * Defines a collection of callbacks passed to the `AreaSelector` constructor.
 */
export interface ISelectorCallbacks {
    /**
     * The callback to be called when a new region selection began.
     */
    onSelectionBegin: SelectionNotifyFunction;

    /**
     * The callback to be called when a new region is selected.
     * @param regionData - The `RegionData` object describing new region.
     */
    onSelectionEnd: SelectionConfirmFunction;

    /**
     * The callback to be called when the current selector is locked.
     */
    onLocked?: () => void;

    /**
     * The callback to be called when the current selector is unlocked.
     */
    onUnlocked?: () => void;
}
