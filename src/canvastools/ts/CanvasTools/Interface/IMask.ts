import { TagsDescriptor } from "../Core/TagsDescriptor";
import { SelectionMode } from "./ISelectorSettings";

export type MaskSelectorMode = SelectionMode.BRUSH | SelectionMode.ERASER;

export interface IMaskManagerCallbacks {
    onMaskDrawingBegin: () => TagsDescriptor;
}

export interface IBrushSize {
    brush: number;
    erase: number;
}