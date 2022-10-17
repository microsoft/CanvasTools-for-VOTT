import { IRect } from "./IRect";

/**
 * Enum to define current selection mode
 */
export enum SelectionMode { NONE, POINT, RECT, COPYRECT, POLYLINE, POLYGON, BRUSH, ERASER, PENCIL, FLOODFILL }

/**
 * Defines options to setup an selector in `AreaSelector`.
 */
export interface ISelectorSettings {
    mode: SelectionMode;
    template?: IRect;
}
