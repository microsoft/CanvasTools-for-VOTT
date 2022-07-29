import { RegionData } from "../Core/RegionData";
import { TagsDescriptor } from "../Core/TagsDescriptor";
import { ICubicBezierControl } from "./ICubicBezierControl";
import { IPoint2D } from "./IPoint2D";
import { SelectionMode } from "./ISelectorSettings";

export type MaskSelectorMode = SelectionMode.BRUSH | SelectionMode.ERASER;

export interface IMaskManagerCallbacks {
    onMaskDrawingBegin: () => TagsDescriptor;
    onToggleMaskPreview: (enableMaskPreview: boolean) => void;
    getAllRegions: () => Array<{ id: string, tags: TagsDescriptor, regionData: RegionData }>;
}

export interface IBrushSize {
    brush: number;
    erase: number;
}

export interface IMask {
    imageData: Uint8Array;
    tags: TagsDescriptor;
}

export interface IRegionEdge {
    start: IPoint2D;
    controlPoint?: ICubicBezierControl;
    end: IPoint2D;
}