import { RegionData } from "../Core/RegionData";

/**
 * Defines a collection of callbacks passed to the `AreaSelector` constructor.
 */
export interface ISelectorCallbacks {
    /**
     * The callback to be called when a new region selection began.
     */
    onSelectionBegin: () => void;

    /**
     * The callback to be called when a new region is selected.
     * @param regionData - The `RegionData` object describing new region.
     */
    onSelectionEnd: (regionData: RegionData) => void;

    /**
     * The callback to be called when the current selector is locked.
     */
    onLocked?: () => void;

    /**
     * The callback to be called when the current selector is unlocked.
     */
    onUnlocked?: () => void;
}
