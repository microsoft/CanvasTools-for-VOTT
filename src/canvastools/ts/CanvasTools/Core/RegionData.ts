import { calculateLineSegments } from "../Core/Utils/calculateLineSegments";
import { ICubicBezierControl } from "../Interface/ICubicBezierControl";
import { ILineSegment } from "../Interface/ILineSegment";
import { IMovable } from "../Interface/IMovable";
import { IPoint2D } from "../Interface/IPoint2D";
import { IRect } from "../Interface/IRect";
import { IRegionData } from "../Interface/IRegionData";
import { IResizable } from "../Interface/IResizable";
import { RegionDataType } from "../Interface/RegionDataType";
import { CubicBezierControl } from "./CubicBezierControl";
import { CubicBezierIndex } from "./CubicBezierIndex";
import { Point2D } from "./Point2D";
import { Rect } from "./Rect";

export { RegionDataType };

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
     * Creates a new `RegionData` object with `polygon`-type at provided `x`, `y`
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
            points.map((p) => new Point2D(p.x, p.y)), RegionDataType.Polygon);
        return region;
    }

    /**
     * Creates a new `RegionData` object with `path`-type at provided `x`, `y`
     * coordinates and of provided `width` and `height`
     * 
     * path region types can represent complex shapes including bezier curves
     * 
     * @param x - `x`-coordinate
     * @param y - `y`-coordinate
     * @param width - `width` of the bounding rect
     * @param height - `height` of the bounding rect
     * @param points - the points the path
     * @param bezierControls - Map of bezier controls to lines in the path
     * @returns A new `RegionData` object
     */
    public static BuildPathRegionData(
        x: number,
        y: number,
        width: number,
        height: number,
        points: Point2D[],
        bezierControls: Record<number, CubicBezierControl>
    ): RegionData {
        const region = new RegionData(x, y, width, height,
            points.map((p) => new Point2D(p.x, p.y)), RegionDataType.Path,
            CubicBezierIndex.buildFromJSON(bezierControls));
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
            data.type, CubicBezierIndex.buildFromJSON(data.bezierControls));
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
     *
     * @deprecated directly setting point arrays does not work with path regions which contain bezier control points
     * use set/splice methods instead.
     */
    public set points(points: Point2D[]) {
        this.setPoints(points);
    }

    /**
     * Bezier controls mapped to line segment indexes.
     */
    public get bezierControls() {
        return this.regionBezierControls.copy();
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
    protected regionBezierControls: CubicBezierIndex;
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
    constructor(x: number, y: number, width: number, height: number, points?: Point2D[], type?: RegionDataType, bezierControls?: Record<number, CubicBezierControl>) {
        this.corner = new Point2D(x, y);
        this.regionRect = new Rect(width, height);

        this.regionPoints = points ?? [];
        this.regionBezierControls = new CubicBezierIndex(bezierControls);
        this.regionType = type ?? RegionDataType.Point;
    }

    private resetBBox(): void {
        const { x: xmin, y: ymin, height, width } = Snap.path.getBBox(this.toPath());
        this.corner.move(xmin, ymin);
        this.regionRect.resize(width, height);
    }

    private getLineSegmentCount(): number {
        const pointCount = this.regionPoints.length;
        if ([RegionDataType.Polygon, RegionDataType.Path].includes(this.regionType)) {
            // closing line segment from last to first point
            return pointCount;
        }
        return pointCount - 1;
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
        this.regionBezierControls = this.regionBezierControls.shift(dx, dy);
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
        const movePoint = (p: Point2D): Point2D => {
            const px = (p.x - this.x) * sx + this.x;
            const py = (p.y - this.y) * sy + this.y;
            return new Point2D(px, py);
        }
        this.regionPoints = this.regionPoints.map(movePoint);
        this.regionBezierControls = this.regionBezierControls.move(movePoint);
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
        this.resetBBox();
    }

    /**
     * Removes points from region and, if necessary, inserts new points in their place.
     * if start is < 0 it is reset to 0.
     * if start is > region points length it is reset to region points length.
     * *Region will be resized and repositioned automatically*
     * @param start The zero-based location in the array from which to start removing points.
     * @param deleteCount The number of points to remove.
     * @param points Points to insert into the array in place of the deleted points.
     */
    public splicePoints(start: number, deleteCount: number = 0, ...points: IPoint2D[]): void {
        const pointCount = this.regionPoints.length;
        const spliceStart = (start < 0) ? start : (start > pointCount) ? pointCount : start;
        // delete bezier controls mapped to lines which connect to deleted points
        const bezDeleteIndexes = [];
        // lines are indexed by the point that they start from.
        // get line segment of point directly preceding starting point. 
        if (spliceStart === 0) {
            // if it's the first point then wrap around to the ending point line segment.
            bezDeleteIndexes.push(pointCount - 1);
        } else {
            bezDeleteIndexes.push(spliceStart - 1);
        }
        for (let i = spliceStart; i < (spliceStart + deleteCount); i++) {
            bezDeleteIndexes.push(i);
        }
        this._deleteBezierControls(bezDeleteIndexes);
        this.regionPoints.splice(spliceStart, deleteCount, ...points.map(p => new Point2D(p)));
        this.resetBBox();
    }

    /**
     * Add or replace bezier controls at the designated index.
     * *Region will be resized and repositioned automatically*
     * @param index Line segment index to add the control to.
     * @param control Bezier control to add.
     */
    public addBezierControl(index: number, control: ICubicBezierControl) {
        this.addBezierControls({ [index]: control });
    }

    /**
     * _addBezierControls does not update the BBox, to allow code re-use with minimum necessary BBox recalculations.
     */
    private _addBezierControls(controls: Record<number, ICubicBezierControl>) {
        const lineCount = this.getLineSegmentCount();
        Object.entries(controls).forEach(([index, control]) => {
            const iIndex = Number(index);
            if (iIndex < 0 || iIndex >= lineCount) {
                return;
            }
            this.regionBezierControls[iIndex] = new CubicBezierControl(control);
        });
    }
    /**
     * Add or replace bezier controls at the designated indexes.
     * *Region will be resized and repositioned automatically*
     * @param controls Map of bezier controls to line segment indexes.
     */
    public addBezierControls(controls: Record<number, ICubicBezierControl>) {
        this._addBezierControls(controls);
        this.resetBBox();
    }

    /**
     * _deleteBezierControls does not update the BBox, to allow code re-use with minimum necessary BBox recalculations.
     */
    private _deleteBezierControls(index: number | number[]) {
        const delIndexes = Array.isArray(index) ? index : [index];
        delIndexes.forEach(i => delete this.regionBezierControls[i]);
    }

    /**
     * Delete bezier controls.
     * *Region will be resized and repositioned automatically*
     * @param index - `number | number[]` Indexes of bezier controls to delete.
     */
    public deleteBezierControls(index: number | number[]) {
        this._deleteBezierControls(index);
        this.resetBBox();
    }

    /**
     * Updates the collection of internal points.
     * @param points - `IPoint2D[]` collection for the region to serve as the source for the
     * internal *copy* in the `points` collection.
     * *Region will be resized and repositioned automatically*
     * 
     * @deprecated setPoints does not work with path regions which contain bezier control points
     * use set/splice methods instead
     */
    public setPoints(points: IPoint2D[]) {
        this.regionPoints = points.map((p) => new Point2D(p));
        this.resetBBox();
    }

    /**
     * Inits this region properties from another `IRegionData` object
     * @param regionData - An `IRegionData` object to serve as the source for the property values
     */
    public initFrom(regionData: IRegionData) {
        this.corner = new Point2D(regionData.x, regionData.y);
        this.regionRect = new Rect(regionData.width, regionData.height);
        this.regionPoints = regionData.points.map((p) => new Point2D(p.x, p.y));
        this.regionBezierControls = CubicBezierIndex.buildFromJSON(regionData.bezierControls);
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
            this.regionPoints.map((p) => p.boundToRect(rect)), this.regionType, this.regionBezierControls.boundToRect(rect));
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

        const scalePoint = (p: IPoint2D): Point2D => {
            return new Point2D(p.x * xf, p.y * yf)
        }
        const scaleRect = (r: IRect): Rect => {
            return new Rect(r.width * xf, r.height * yf)
        }

        this.corner = scalePoint(this);
        this.regionRect = scaleRect(this);
        this.regionPoints = this.regionPoints.map(scalePoint);
        this.regionBezierControls = this.regionBezierControls.scale(scalePoint);
    }

    /**
     * Creates a copy of this region data
     * @returns A new `RegionData` object with copied properties
     */
    public copy(): RegionData {
        return new RegionData(this.x, this.y, this.width, this.height,
            this.regionPoints.map((p) => p.copy()), this.regionType, this.regionBezierControls.copy());
    }

    /**
     * Calculate line segments between each point in the region.
     * @returns ILineSegment[]
     */
    public getLineSegments(): ILineSegment[] {
        return calculateLineSegments(this.regionPoints, { regionType: this.regionType });
    }

    /**
     * Returns a string representation of the region in the format
     * `"{x, y} x [width, height]: {{x1, y1}, ..., {xn, yn}}"`.
     * @returns A string representation of the rect
     */
    public toString(): string {
        return `${this.corner.toString()} x ${this.boundRect.toString()}: {${this.regionPoints.toString()}}, {${this.regionBezierControls.toString()}}`;
    }

    /**
     * Transform regionData into an SVG Path
     */
    public toPath(): string {
        const lineSegments = this.getLineSegments();
        const lineSegmentsLength = lineSegments.length;
        const points = this.regionPoints;
        const controlPoints = this.regionBezierControls;

        if (points.length === 1) {
            // move to first point and draw a circle of radius 1
            return `M${points[0].x},${points[0].y} m-1,0 a1,1 0 1 0 2,0 a1,1 0 1 0 -2,0`;
        }

        const pathSegments: string[] = [];
        for (let i = 0; i < lineSegmentsLength; i++) {
            const line = lineSegments[i];
            if (i === 0) {
                // move to first point
                pathSegments.push(`M${line.start.x},${line.start.y}`);
            }
            if (controlPoints[i]) {
                // curved line
                pathSegments.push(`C${controlPoints[i].c1.x},${controlPoints[i].c1.y} ${controlPoints[i].c2.x},${controlPoints[i].c2.y} ${line.end.x},${line.end.y}`);
            } else {
                // straight line
                pathSegments.push(`L${line.end.x},${line.end.y}`);
            }
        }
        return pathSegments.join(" ");
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
            bezierControls: this.regionBezierControls.toJSON(),
            type: this.regionType,
        };
    }
}
