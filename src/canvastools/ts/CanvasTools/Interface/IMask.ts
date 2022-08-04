import { RegionData } from "../Core/RegionData";
import { TagsDescriptor } from "../Core/TagsDescriptor";
import { ICubicBezierControl } from "./ICubicBezierControl";
import { IPoint2D } from "./IPoint2D";
import { SelectionMode } from "./ISelectorSettings";

export type MaskSelectorMode = SelectionMode.BRUSH | SelectionMode.ERASER;

export interface IMaskManagerCallbacks {
    onMaskDrawingBegin: () => TagsDescriptor;
}

export interface IDimension {
    width: number;
    height: number;
}

export interface IBrushSize {
    brush: number;
    erase: number;
}
