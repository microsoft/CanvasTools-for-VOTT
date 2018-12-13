import { IRect } from "./../Interface/IRect";
import { IPoint2D } from "./../Interface/IPoint2D";
export declare class Point2D implements IPoint2D {
    x: number;
    y: number;
    constructor(x: number, y: number);
    boundToRect(r: IRect): Point2D;
}
