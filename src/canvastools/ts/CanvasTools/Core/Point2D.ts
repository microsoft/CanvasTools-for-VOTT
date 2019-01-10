import { IBoundable } from "../Interface/IBoundable";
import { IMovable } from "../Interface/IMovable";
import { IPoint2D } from "../Interface/IPoint2D";
import { IRect} from "../Interface/IRect";

/**
 * Represents a 2d point object
 */
export class Point2D implements IMovable, IBoundable<Point2D> {
    /**
     * Creates a new point based on extracting specific properties from any provided object
     * @param data - An `IPoint` object with `x` and `y` numeric properties
     * @returns A new `Point2D` object
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
     * Creates a new `Point2D` object from `x` and `y` coordinates
     * @param x - `x`-coordinate of the point
     * @param y - `y`-coordinate of the point
     */
    constructor(x: number, y: number);
    /**
     * Creates a new Point2D object from other `IPoint2D` object
     * @param p - an object implementing `IPoint2D`, which location will be copied
     */
    constructor(p: IPoint2D);
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
     * Moves point to the specified location
     * @param x - the new `x`-coordinate
     * @param y - a new `y`-coordinate
     */
    public move(x: number, y: number): void;
    /**
     * Moves point to the location of specified object
     * @param point - an object implementing `IPoint2D`, which location will be used as reference
     */
    public move(point: IPoint2D): void;
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
     * Shifts point location to specified delta
     * @param dx - Delta to be added to the `x`-coordinate
     * @param dy - Delta to be added to the `y`-coordinate
     */
    public shift(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Returns a new point created from bounding this one to the `Rect` object rovided
     * @remarks This method bounds the point to the rect with coordinates `[0, 0] x [r.width, r.height]`.
     * @param r - A bounding box
     * @returns A new `Point2D` object, with coordinates bounded to the box
     */
    public boundToRect(r: IRect): Point2D {
        return new Point2D((this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x),
                           (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y));
    }

    /**
     * Calculates the square of the distance between two points
     * @param p - Second point
     * @returns The square of the distance
     */
    public squareDistanceToPoint(p: Point2D): number {
        return (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y);
    }

    /**
     * Calculates the square of the distance from this point to a line segment
     * @param p1 - The first line segment point
     * @param p2 - The second line segment point
     * @returns The square of the distance
     */
    public squareDistanceToLine(p1: Point2D, p2: Point2D): number {
        const lineLength2: number = p1.squareDistanceToPoint(p2);
        let dist: number;

        if (lineLength2 === 0.0) {
            dist = this.squareDistanceToPoint(p1);
        } else {
            const t = ((this.x - p1.x) * (p2.x - p1.x) + (this.y - p1.y) * (p2.y - p1.y)) / lineLength2;
            const k = Math.max(0, Math.min(1, t));

            const p = new Point2D(p1.x + k * (p2.x - p1.x), p1.y + k * (p2.y - p1.y));
            dist = this.squareDistanceToPoint(p);
        }
        return dist;
    }

    /**
     * Creates a copy of this point
     * @returns A new `Point2D` object with copied coordinates
     */
    public copy(): Point2D {
        return new Point2D(this.x, this.y);
    }

    /**
     * Returns a string representation of the point in the format `"{x, y}"`.
     * @returns A string representation of the point
     */
    public toString(): string {
        return `{${this.x.toString()}, ${this.y.toString()}}`;
    }

    /**
     * Returns a JSON representation of the point
     * @returns An `IPoint` object with `x` and `y` numeric properties.
     */
    public toJSON(): IPoint2D {
        return {
            x: this.x,
            y: this.y,
        };
    }
}
