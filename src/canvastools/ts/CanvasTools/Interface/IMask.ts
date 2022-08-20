import { RegionData } from "../Core/RegionData";
import { TagsDescriptor } from "../Core/TagsDescriptor";
import { ICubicBezierControl } from "./ICubicBezierControl";
import { IPoint2D } from "./IPoint2D";
import { SelectionMode } from "./ISelectorSettings";

export type MaskSelectorMode = SelectionMode.BRUSH | SelectionMode.ERASER;

export interface IMaskManagerCallbacks {
    onMaskDrawingBegin: () => TagsDescriptor;
    onMaskDrawingEnd: (mask: Uint8ClampedArray) => void;
    onMaskGenerationBegin: () => void;
    onMaskGenerationEnd: () => void;
    onToggleMaskPreview: (enableMaskPreview: boolean) => void;
    getAllRegionsWithLayer: () => Array<{
        id: string;
        tags: TagsDescriptor;
        regionData: RegionData;
        layerNumber: number;
    }>;
}

export interface IDimension {
    width: number;
    height: number;
}

export interface IBrushSize {
    brush: number;
    erase: number;
}

export interface IMask {
    imageData: Uint8ClampedArray;
    tags: TagsDescriptor;
}

export interface IMergedMasks {
    masks: IMask[];
    mergedMasks: IMask[]
}

export interface IRegionEdge {
    start: IPoint2D;
    controlPoint?: ICubicBezierControl;
    end: IPoint2D;
}
