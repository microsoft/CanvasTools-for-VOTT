import { IPoint2D } from "./IPoint2D";

/**
 * Defines that an object can be moved to specified location
 */
export interface IMovable extends IPoint2D {
    /**
     * Move the object to specified `point`.
     * @param point - New object location.
     */
    move(point: IPoint2D): void;

    /**
     * Move the object to specified coordinates `x` and `y`.
     * @param x - New `x` coordinate of the object.
     * @param y - New `y` coordinate of the object.
     */
    move(x: number, y: number): void;
}
