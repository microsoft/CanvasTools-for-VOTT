import { IMovable } from "../Interface/IMovable";
import { IPoint2D } from "../Interface/IPoint2D";
import { IRect } from "../Interface/IRect";
import { IRegionData } from "../Interface/IRegionData";
import { IResizable } from "../Interface/IResizable";
import { Point2D } from "./Point2D";
import { Rect } from "./Rect";

/**
 * Defines supported region types.
 */
export enum RegionDataType {Point = "point", Rect = "rect", Polyline = "polyline", Polygon = "polygon"}

/**
 * Represents region meta-data, including position, size, points and type
 */
export class RegionData implements IRegionData, IMovable, IResizable {
    /**
     * Creates a new `RegionData` object with `point`-type at provided `x`, `y` coordinates
     * @param x - `x`-coordinate
     * @param y - `y`-coordinate
     * @returns A new `RegionData` object
     */
    public static BuildPointRegionData(x: number, y: number): RegionData {
        return new RegionData(x, y, 0, 0, [new Point2D(x, y)], RegionDataType.Point);
    }

    /**
     * Creates a new `RegionData` object with `rect`-type at provided `x`, `y`
     * coordinates and of provided `width` and `height`
     * @param x - `x`-coordinate
     * @param y - `y`-coordinate
     * @param width - `width` of the rect
     * @param height - `height` of the rect
     * @returns A new `RegionData` object
     */
    public static BuildRectRegionData(x: number, y: number, width: number, height: number): RegionData {
        return new RegionData(x, y, width, height,
            [new Point2D(x, y), new Point2D(x + width, y),
             new Point2D(x + width, y + height), new Point2D(x, y + height)], RegionDataType.Rect);
    }

    /**
     * Creates a new `RegionData` object with `rect`-type at provided `x`, `y`
     * coordinates and of provided `width` and `height`
     * @param x - `x`-coordinate
     * @param y - `y`-coordinate
     * @param width - `width` of the bounding rect
     * @param height - `height` of the bounding rect
     * @param points - the points that make up the polygon
     * @returns A new `RegionData` object
     */
    public static BuildPolygonRegionData(
        x: number,
        y: number,
        width: number,
        height: number,
        points: Point2D[],
    ): RegionData {
        const region = new RegionData(x, y, width, height,
            [new Point2D(x, y), new Point2D(x + width, y),
             new Point2D(x + width, y + height), new Point2D(x, y + height)], RegionDataType.Polygon);
        region.points = points;
        return region;
    }

    /**
     * Creates a new `RegionData` object based on extracting specific properties from any provided object
     * @param data - An `IRegionData` object with `x`, `y`, `width`, `height`, `points` and `type` properties
     * @returns A new `RegionData` object
     */
    public static BuildFromJson(data: IRegionData): RegionData {
        return new RegionData(data.x, data.y, data.width, data.height,
                              data.points.map((p) => new Point2D(p.x, p.y)),
                              data.type);
    }

    /**
     * Gets the `x`-coordinate of the region
     */
    public get x(): number {
        return this.corner.x;
    }

    /**
     * Sets the `x`-coordinate of the region. *Region points position will be recalculated*
     */
    public set x(x: number) {
        this.move(x, this.y);
    }

    /**
     * Gets the `y`-coordinate of the region
     */
    public get y(): number {
        return this.corner.y;
    }

    /**
     * Sets the `y`-coordinate of the region. *Region points position will be recalculated*
     */
    public set y(y: number) {
        this.move(this.x, y);
    }

    /**
     * Gets the `width` of the region
     */
    public get width(): number {
        return this.regionRect.width;
    }

    /**
     * Sets the `width` of the region. *Region points position will be recalculated*
     */
    public set width(width: number) {
        this.resize(width, this.height);
    }

    /**
     * Gets the `height` of the region
     */
    public get height(): number {
        return this.regionRect.height;
    }

    /**
     * Sets the `height` of the region. *Region points position will be recalculated*
     */
    public set height(height: number) {
        this.resize(this.width, height);
    }

    /**
     * Returns the area of the region. *Point has area = 1.0, for other types it is `width * height`*
     */
    public get area(): number {
        let area: number;

        if (this.regionType === RegionDataType.Point) {
            area = 1.0;
        } else {
            area = this.regionRect.width * this.regionRect.height;
        }
        return area;
    }

    public getLineSegments(): Array<[Point2D, Point2D]> {
        const points = this.regionPoints;
        if (points.length < 2) {
            return []
        }
        if (points.length === 2) {
            return [[points[0], points[1]]]
        }
        const segments = [];
        const pointsLength = points.length;
        const loopLength = pointsLength - 1;
        for (let i = 0; i < loopLength; i++) {
            const nextPointIdx = i + 1;
            if (nextPointIdx < pointsLength) {
                segments.push([points[i], points[nextPointIdx]])
            }
        }
        if (this.regionType == RegionDataType.Polygon) {
            // closing line segment from last to first point
            segments.push([points[pointsLength - 1], points[0]])
        }
        return segments;
    }

    public getLineMidpoints(): Point2D[] {
        const lines = this.getLineSegments();
        return lines.map(line => {
            const x = line[0].x - ((line[0].x - line[1].x) / 2);
            const y = line[0].y - ((line[0].y - line[1].y) / 2);
            return new Point2D(x, y);
        });
    }

    /**
     * Gets the bounding box size of the region
     */
    public get boundRect(): Rect {
        return this.regionRect.copy();
    }

    /**
     * Sets the bounding box size of the region. *Region will be resized automatically*
     */
    public set boundRect(rect: Rect) {
        this.resize(rect.width, rect.height);
    }

    /**
     * Gets the array of region points.
     */
    public get points(): Point2D[] {
        return this.regionPoints.map((p) => p.copy());
    }

    /**
     * Sets the array of region points. *Region will be resized and repositioned automatically*
     */
    public set points(points: Point2D[]) {
        this.setPoints(points);
    }

    /**
     * Gets the type of the region
     */
    public get type(): RegionDataType {
        return this.regionType;
    }

    protected corner: Point2D;
    protected regionRect: Rect;
    protected regionPoints: Point2D[];
    protected regionType: RegionDataType;

    /**
     * Creates a new `RegionData` object
     * @param x - `x`-coordinate of the region
     * @param y - `y`-coordinate of the region
     * @param width - `width` of the region
     * @param height - `height` of the region
     * @param points - Collection of internal region points
     * @param type - `type` of the region from enum `RegionDataType`
     */
    constructor(x: number, y: number, width: number, height: number, points?: Point2D[], type?: RegionDataType) {
        this.corner = new Point2D(x, y);
        this.regionRect = new Rect(width, height);

        this.regionPoints = (points !== undefined && points !== null) ? points : new Array<Point2D>();
        this.regionType = (type !== undefined) ? type : RegionDataType.Point;
    }

    /**
     * Moves the region to the position of an `IPoint2D` object
     * @param point - `IPoint2D` object to use as position source
     */
    public move(point: IPoint2D): void;
    /**
     * Moves the region to specified coordinates
     * @param x - New `x`-coordinate
     * @param y - New `y`-coordinate
     */
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any): void {
        const oldx = this.x;
        const oldy = this.y;
        this.corner.move(arg1, arg2);

        const dx = this.x - oldx;
        const dy = this.y - oldy;

        this.regionPoints.forEach((p) => {
            p.shift(dx, dy);
        });
    }

    /**
     * Resizes regions to specified dimensions
     * @param width - New `width` of the region
     * @param height - New `height` of the region
     */
    public resize(width: number, height: number) {
        const sx = width / this.width;
        const sy = height / this.height;

        this.regionRect.resize(width, height);

        this.regionPoints.forEach((p) => {
            const px = (p.x - this.x) * sx + this.x;
            const py = (p.y - this.y) * sy + this.y;
            p.move(px, py);
        });
    }

    /**
     * Changes the `point` at specified `index`
     * @param point - New `point` value
     * @param index - `index` of the point in internal collection
     */
    public setPoint(point: IPoint2D, index: number) {
        if (index >= 0 && index < this.regionPoints.length) {
            this.regionPoints[index] = new Point2D(point);
        }

        // Update region position and size
        let xmin = Number.MAX_VALUE;
        let xmax = 0;
        let ymin = Number.MAX_VALUE;
        let ymax = 0;

        this.regionPoints.forEach((point) => {
            if (point.x > xmax) {
                xmax = point.x;
            }
            if (point.x < xmin) {
                xmin = point.x;
            }
            if (point.y > ymax) {
                ymax = point.y;
            }
            if (point.y < ymin) {
                ymin = point.y;
            }
        });

        this.corner.move(xmin, ymin);
        this.regionRect.resize(xmax - xmin, ymax - ymin);
    }

    /**
     * Updates the collection of internal points
     * @param points - `IPoint2D[]` collection for the region to serve as the source for the
     * internal *copy* in the `points` collection
     */
    public setPoints(points: IPoint2D[]) {
        let xmin = Number.MAX_VALUE;
        let xmax = 0;
        let ymin = Number.MAX_VALUE;
        let ymax = 0;

        // Update region position and size
        points.forEach((point) => {
            if (point.x > xmax) {
                xmax = point.x;
            }
            if (point.x < xmin) {
                xmin = point.x;
            }
            if (point.y > ymax) {
                ymax = point.y;
            }
            if (point.y < ymin) {
                ymin = point.y;
            }
        });

        this.regionPoints = points.map((p) => new Point2D(p));
        this.corner.move(xmin, ymin);
        this.regionRect.resize(xmax - xmin, ymax - ymin);
    }

    /**
     * Inits this region properties from another `IRegionData` object
     * @param regionData - An `IRegionData` object to serve as the source for the property values
     */
    public initFrom(regionData: IRegionData) {
        this.corner = new Point2D(regionData.x, regionData.y);
        this.regionRect = new Rect(regionData.width, regionData.height);
        this.regionPoints = regionData.points.map((p) => new Point2D(p.x, p.y));
    }

    /**
     * Returns a new `RegionData` object with all coordinates and dimensions bounded to specified box
     * @param rect - The `IRect` box, which `width` and `height` will be used for bounding
     * @returns A new `RegionData` object
     */
    public boundToRect(rect: IRect): RegionData {
        const brCorner = (new Point2D(this.x + this.width, this.y + this.height)).boundToRect(rect);
        const tlCorner = this.corner.boundToRect(rect);

        const width = brCorner.x - tlCorner.x;
        const height = brCorner.y - tlCorner.y;

        return new RegionData(tlCorner.x, tlCorner.y, width, height,
                              this.regionPoints.map((p) => p.boundToRect(rect)), this.regionType);
    }

    /**
     * Scale region coordinates, points and size by `xfactor` and `yfactor`
     * @param xfactor - Horizontal scaling factor
     * @param yfactor - Vertical scaling factor
     */
    public scale(xfactor: number, yfactor: number): void;
    /**
     * Scale region coordinates, points and size by `factor`
     * @param factor - Horizontal & vertical scaling factor
     */
    public scale(factor: number): void;
    public scale(f1: number, f2?: number): void {
        const xf = f1;
        const yf = (f2 !== undefined) ? f2 : f1;

        this.corner = new Point2D(this.x * xf, this.y * yf);
        this.regionRect = new Rect(this.width * xf, this.height * yf);
        this.regionPoints =  this.regionPoints.map((p) => new Point2D(p.x * xf, p.y * yf));
    }

    /**
     * Creates a copy of this region data
     * @returns A new `RegionData` object with copied properties
     */
    public copy(): RegionData {
        return new RegionData(this.x, this.y, this.width, this.height,
                              this.regionPoints.map((p) => p.copy()), this.regionType);
    }

    /**
     * Returns a string representation of the region in the format
     * `"{x, y} x [width, height]: {{x1, y1}, ..., {xn, yn}}"`.
     * @returns A string representation of the rect
     */
    public toString(): string {
        return `${this.corner.toString()} x ${this.boundRect.toString()}: {${this.regionPoints.toString()}}`;
    }

    /**
     * Returns a JSON representation of the region
     * @returns An `IRegionData` object with properties only.
     */
    public toJSON(): IRegionData {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            points: this.regionPoints.map((point) => {
                return { x: point.x, y: point.y };
            }),
            type: this.regionType,
        };
    }
}
