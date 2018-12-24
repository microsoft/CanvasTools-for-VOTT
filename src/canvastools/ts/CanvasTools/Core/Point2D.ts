import { IBoundable } from "../Interface/IBoundable";
import { IMovable } from "../Interface/IMovable";
import { IPoint2D } from "../Interface/IPoint2D";
import { Rect} from "./Rect";

/**
 * Represents a 2d point object
 */
export class Point2D implements IMovable, IBoundable<Point2D> {
    /**
     * Creates a new point based on extracting specific properties from any provided object
     * @param data - An `IPoint` object with `x` and `y` numeric properties
     * @returns A new Point2D object
     */
    public static BuildFromJSON(data: IPoint2D): Point2D {
        return new Point2D(data.x, data.y);
    }

    /**
     * `x`-coordinate of the point
     */
    public x: number;

    /**
     * `y`-coordinate of the point
     */
    public y: number;

    /**
     * Create a new Point2D object from `x` and `y` coordinates
     * @param x - `x`-coordinate of the point
     * @param y - `y`-coordinate of the point
     */
    constructor(x: number, y: number);
    /**
     * Create a new Point2D object from other `IMovable` object
     * @param p - an object implementing `IMovable`, which location will be copied
     */
    constructor(p: IMovable);
    constructor(arg1: any, arg2?: number) {
        if (typeof arg1 === "number" && typeof arg2 === "number") {
            this.x = arg1;
            this.y = arg2;
        } else if (arg1.x !== undefined && arg1.y !== undefined) {
            this.x = arg1.x;
            this.y = arg1.y;
        }
    }

    /**
     * Move point to the specified location
     * @param x - new `x`-coordinate
     * @param y - new `y`-coordinate
     */
    public move(x: number, y: number): void;
    /**
     * Move point to the location of specified object
     * @param point - an object implementing `IMovable`, which location will be used as reference
     */
    public move(point: IMovable): void;
    public move(arg1: any, arg2?: any): void {
        if (typeof arg1 === "number" && typeof arg2 === "number") {
            this.x = arg1;
            this.y = arg2;
        } else if (arg1.x !== undefined && arg1.y !== undefined) {
            this.x = arg1.x;
            this.y = arg1.y;
        }
    }

    /**
     * Shift point location to specified delta
     * @param dx - delta to be added to the `x`-coordinate
     * @param dy - delta to be added to the `y`-coordinate
     */
    public shift(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Get a new point created from bounding this one to the `Rect` object rovided
     * @remarks This method bounds the point to the rect with coordinates `[0, 0] x [r.width, r.height]`.
     * @param r - a bounding box
     * @returns A new Point2D object, with coordinates bounded to the box
     */
    public boundToRect(r: Rect): Point2D {
        return new Point2D((this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x),
                           (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y));
    }

    /**
     * Get a copy of this point
     * @returns A new Point2D object with copied coordinates
     */
    public copy(): Point2D {
        return new Point2D(this.x, this.y);
    }

    /**
     * Get a string representation of the point in the format `"{x, y}"`.
     * @returns A string representation of the point
     */
    public toString(): string {
        return `{${this.x.toString()}, ${this.y.toString()}}`;
    }

    /**
     * Get a JSON representation of the point
     * @returns An `IPoint` object with `x` and `y` numeric properties.
     */
    public toJSON(): IPoint2D {
        return {
            x: this.x,
            y: this.y
        };
    }
}
