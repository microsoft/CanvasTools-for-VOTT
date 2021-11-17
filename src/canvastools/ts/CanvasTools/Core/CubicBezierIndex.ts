import { mapIndexRecord } from "./Utils/mapIndexRecord";
import { ICubicBezierControl } from "../Interface/ICubicBezierControl";
import { IPoint2D } from "../Interface/IPoint2D";
import { IRect } from "../Interface/IRect";
import { Point2D } from "./Point2D";
import { CubicBezierControl } from "./CubicBezierControl";

function buildCopy(controls: Record<string, ICubicBezierControl> | Record<number, ICubicBezierControl>) {
    const record = mapIndexRecord(controls, (c) => new CubicBezierControl(c));
    return new CubicBezierIndex(record);
}

/**
 * @param controls Controls to modify.
 * @param modifyPoint Function to take a point and return a new point.
 * @returns new CubicBezierIndex with modified points.
 */
function modifyControlPoints(controls: Record<number, ICubicBezierControl>, modifyPoint: (p: IPoint2D) => Point2D): CubicBezierIndex {
    return new CubicBezierIndex(mapIndexRecord(controls, (c) => new CubicBezierControl({ c1: modifyPoint(c.c1), c2: modifyPoint(c.c2) })));
}

/**
 * Map of cubic bezier controls to numbered indexes.
 */
export class CubicBezierIndex implements Record<number, CubicBezierControl> {
    [index: number]: CubicBezierControl;

    /**
     * 
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
     */
    public scale(scalePoint: (p: IPoint2D) => Point2D): CubicBezierIndex {
        return modifyControlPoints(this, scalePoint);
    }

    /**
     * Create a new record with moved controls.
     * @param movePoint Function which takes a point and returns the new moved point.
     */
     public move(movePoint: (p: IPoint2D) => Point2D): CubicBezierIndex {
        return modifyControlPoints(this, movePoint);
    }

    /**
     * Create a new record with shifted controls.
     * @param dx Distance in x to shift control points.
     * @param dy Distance in y to shift control points.
     */
    public shift(dx: number, dy: number): CubicBezierIndex {
        return new CubicBezierIndex(mapIndexRecord(this, (c) => {
            const control = c.copy();
            control.shift(dx, dy);
            return control;
        }));
    }

    public boundToRect(rect: IRect): CubicBezierIndex {
        return new CubicBezierIndex(mapIndexRecord(this, c => c.boundToRect(rect)));
    }

    public toJSON(): Record<number, ICubicBezierControl> {
        return mapIndexRecord(this, c => c.toJSON());
    }
}
