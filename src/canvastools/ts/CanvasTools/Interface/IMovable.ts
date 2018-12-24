import { IPoint2D } from "./IPoint2D";

export interface IMovable extends IPoint2D {
    move(point: IMovable): void;
    move(x: number, y: number): void;
}
