import { ICubicBezierControl } from "../Interface/ICubicBezierControl";
import { IPoint2D } from "../Interface/IPoint2D";
import { IRect } from "../Interface/IRect";
import { Point2D } from "./Point2D";

/**
 * Represents a cubic bezier line control
 */
export class CubicBezierControl {
    /**
     * Creates a new cubic bezier control based on extracting specific properties from any provided object
     * @param data - An `ICubicBezierControl` object with `c1` and `c2` point properties
     * @returns A new `CubicBezierControl` object
     */
    public static BuildFromJSON({ c1, c2 }: ICubicBezierControl): CubicBezierControl {
        return new CubicBezierControl({ c1, c2 });
    }
    public c1: Point2D;
    public c2: Point2D;

    constructor({ c1, c2 }: ICubicBezierControl) {
        this.c1 = new Point2D(c1);
        this.c2 = new Point2D(c2);
    }

    /**
     * Returns a new control created from bounding each point to the `Rect` object provided
     * @remarks This method bounds the control points to the rect with coordinates `[0, 0] x [r.width, r.height]`.
     * @param r - A bounding box
     * @returns A new `CubicBezierControl` object, with control coordinates bounded to the box
     */
    public boundToRect(r: IRect): CubicBezierControl {
        return new CubicBezierControl({ c1: this.c1.boundToRect(r), c2: this.c2.boundToRect(r) });
    }

    /**
     * Shifts the control by specified delta.
     * Modifies control in place.
     * @param dx - Delta to be added to the `x`-coordinate
     * @param dy - Delta to be added to the `y`-coordinate
     */
    public shift(dx: number, dy: number): void {
        this.c1.shift(dx, dy);
        this.c2.shift(dx, dy);
    }

    /**
     * Map each point in the control to a new point.
     * @param fn map function
     * @returns new bezier control with mapped points
     */
    public map(fn: (p: Point2D, idx: number) => IPoint2D): CubicBezierControl {
        const points = [this.c1, this.c2];
        const mappedPoints = points.map((p, idx) => fn(p, idx));
        return new CubicBezierControl({ c1: mappedPoints[0], c2: mappedPoints[1] });
    }

    /**
     * Creates a copy of this control
     * @returns A new `Point2D` object with copied coordinates
     */
    public copy(): CubicBezierControl {
        return new CubicBezierControl(this);
    }

    /**
     * Returns a string representation of the point in the format `"{x, y}"`.
     * @returns A string representation of the point
     */
    public toString(): string {
        return `{${this.c1.toString()}, ${this.c2.toString()}}`;
    }

    /**
     * Returns a JSON representation of the point
     * @returns An `IPoint` object with `x` and `y` numeric properties.
     */
    public toJSON(): ICubicBezierControl {
        return {
            c1: this.c1.toJSON(),
            c2: this.c2.toJSON(),
        };
    }
}
