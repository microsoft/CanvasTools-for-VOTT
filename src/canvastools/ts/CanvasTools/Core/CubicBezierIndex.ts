import { ICubicBezierControl } from "../Interface/ICubicBezierControl";
import { IPoint2D } from "../Interface/IPoint2D";
import { IRect } from "../Interface/IRect";
import { CubicBezierControl } from "./CubicBezierControl";
import { Point2D } from "./Point2D";
import { mapIndexRecord } from "./Utils/mapIndexRecord";

function buildCopy(controls: Record<string, ICubicBezierControl> | Record<number, ICubicBezierControl>) {
    const record = mapIndexRecord(controls, (c) => new CubicBezierControl(c));
    return new CubicBezierIndex(record);
}

/**
 * Map of cubic bezier controls to numbered indexes.
 */
export class CubicBezierIndex implements Record<number, CubicBezierControl> {
    [index: number]: CubicBezierControl;

    /**
     * @param controls Builds a new record from JSON Record<number, ICubicBezierControl>
     * @returns CubicBezierRecord
     */
    public static buildFromJSON(controls: Record<string, ICubicBezierControl> | Record<number, ICubicBezierControl>) {
        return buildCopy(controls);
    }

    /**
     * Controls will be copied by reference into this record if provided in constructor.
     * @param controls Cubic bezier controls mapped to indexes
     */
    constructor(controls?: Record<number, CubicBezierControl>) {
        if (controls) {
            Object.entries(controls).forEach(([idx, control]) => {
                const iIdx = Number(idx);
                if (Number.isSafeInteger(iIdx)) {
                    this[iIdx] = control;
                }
            });
        }
    }

    /**
     * Create a copy of this record and return it.
     * @returns CubicBezierRecord
     */
    public copy(): CubicBezierIndex {
        return buildCopy(this);
    }

    /**
     * Create a new record with scaled controls.
     * @param scalePoint Function which takes a point and returns the new scaled point.
     * @deprecated Use mapPoints instead
     */
    public scale(scalePoint: (p: IPoint2D) => Point2D): CubicBezierIndex {
        return this.mapPoints(scalePoint);
    }

    /**
     * Create a new record with moved controls.
     * @param movePoint Function which takes a point and returns the new moved point.
     * @deprecated Use mapPoints instead
     */
    public move(movePoint: (p: IPoint2D) => Point2D): CubicBezierIndex {
        return this.mapPoints(movePoint);
    }

    /**
     * Create a new record with shifted controls.
     * @param dx Distance in x to shift control points.
     * @param dy Distance in y to shift control points.
     */
    public shift(dx: number, dy: number): CubicBezierIndex {
        return this.map((c) => {
            const control = c.copy();
            control.shift(dx, dy);
            return control;
        });
    }

    public map(fn: (control: CubicBezierControl, index: number) => ICubicBezierControl): CubicBezierIndex {
        return new CubicBezierIndex(mapIndexRecord(this, (control, idx) => new CubicBezierControl(fn(control, idx))));
    }

    public boundToRect(rect: IRect): CubicBezierIndex {
        return this.map((c) => c.boundToRect(rect));
    }

    public toJSON(): Record<number, ICubicBezierControl> {
        return mapIndexRecord(this, (c) => c.toJSON());
    }

    /**
     * Map over each point for each control in the index and return a new index.
     * @param fn Function which takes a point and returns the new point.
     */
    public mapPoints(fn: (p: IPoint2D) => IPoint2D): CubicBezierIndex {
        return this.map((control) => control.map(fn));
    }

    public forEach(fn: (control: CubicBezierControl, index: number) => void): void {
        mapIndexRecord(this, fn);
    }
}
