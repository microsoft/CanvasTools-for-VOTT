import { IRect } from "./IRect";
export interface IPoint2D {
    x: number;
    y: number;
    boundToRect(rect: IRect): IPoint2D;
}
