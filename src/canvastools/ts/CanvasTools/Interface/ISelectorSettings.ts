import { IRect } from "./IRect";

/**
 * Enum to define current selectio mode
 */
export enum SelectionMode { NONE, POINT, RECT, COPYRECT, POLYLINE, POLYGON }

/**
 * Defines options to setup an selector in `AreaSelector`.
 */
export interface ISelectorSettings {
    mode: SelectionMode;
    template?: IRect;
}
