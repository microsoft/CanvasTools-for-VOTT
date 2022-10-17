import { RegionData } from "../Core/RegionData";
import { TagsDescriptor } from "../Core/TagsDescriptor";
import { ICubicBezierControl } from "./ICubicBezierControl";
import { IPoint2D } from "./IPoint2D";
import { SelectionMode } from "./ISelectorSettings";

export type MaskSelectorMode = 
    SelectionMode.BRUSH |
    SelectionMode.ERASER |
    SelectionMode.PENCIL |
    SelectionMode.FLOODFILL;

export interface IMaskManagerCallbacks {
    onMaskDrawingBegin: () => TagsDescriptor;
    onMaskDrawingEnd: () => void;
    getAllRegions: () => Array<{
        id: string;
        tags: TagsDescriptor;
        regionData: RegionData;
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
    imageData: number[];
    tags: TagsDescriptor[];
}

export interface IRegionEdge {
    start: IPoint2D;
    controlPoint?: ICubicBezierControl;
    end: IPoint2D;
}
