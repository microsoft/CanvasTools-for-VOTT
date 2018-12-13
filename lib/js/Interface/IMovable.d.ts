import { IPoint2D } from "./IPoint2D";
export interface IMovable {
    x: number;
    y: number;
    move(point: IPoint2D): void;
}
