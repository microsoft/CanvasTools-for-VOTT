import { Point2D } from "../Core/Point2D";
import { RegionData } from "../Core/RegionData";
import { MaskSelectorMode } from "./IMask";

export type SelectionNotifyFunction = () => void;
export type PointSelectionNotifyFunction = (point: Point2D) => void;
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
     * The callback when a new point is drawn by the `PolygonSelector`
     * @param point - The `Point2D` object describing the new point
     */
    onNextSelectionPoint?: PointSelectionNotifyFunction;

    /**
     * The callback to be called when the current selector is locked.
     */
    onLocked?: () => void;

    /**
     * The callback to be called when the current selector is unlocked.
     */
    onUnlocked?: () => void;

    /**
     * The callback to be called when the current selector is unlocked.
     * @param enabled - indicates if mask selection is enabled
     * @param mode - optional. sets the mode of mask selection to either brush or eraser
     */
    onMaskSelection?: (enabled: boolean, mode?: MaskSelectorMode) => void
}
