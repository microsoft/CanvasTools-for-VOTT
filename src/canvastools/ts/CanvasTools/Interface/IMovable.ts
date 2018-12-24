import { IPoint2D } from "./IPoint2D";

export interface IMovable extends IPoint2D {
    move(point: IPoint2D): void;
    move(x: number, y: number): void;
}
