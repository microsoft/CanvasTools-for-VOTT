import { IMovable } from "../Interface/IMovable";
import { IResizable } from "../Interface/IResizable";
import { Point2D } from "./Point2D";
import { Rect } from "./Rect";

export enum RegionDataType {Point = "point", Rect = "rect", Polyline = "polyline"}

export class RegionData implements IMovable, IResizable {
    public static BuildPointRegionData(x: number, y: number): RegionData {
        return new RegionData(x, y, 0, 0, [new Point2D(x, y)], RegionDataType.Point);
    }

    public static BuildRectRegionData(x: number, y: number, width: number, height: number): RegionData {
        return new RegionData(x, y, width, height,
            [new Point2D(x, y), new Point2D(x + width, y + height)], RegionDataType.Rect);
    }

    public boundRect: Rect;
    public points: Point2D[];

    public get x(): number {
        return this.corner.x;
    }

    public get y(): number {
        return this.corner.y;
    }

    public get width(): number {
        return this.boundRect.width;
    }

    public get height(): number {
        return this.boundRect.height;
    }

    public get area(): number {
        let area = 0;
        
        if (this.regionType === RegionDataType.Point) {
            area = 1.0;
        } else {
            area = this.boundRect.width * this.boundRect.height;
        }
        return area;
    }

    public regionType: RegionDataType;

    private corner: Point2D;

    constructor(x: number, y: number, width: number, height: number, points?: Point2D[], regionType?: RegionDataType) {
        this.corner = new Point2D(x, y);
        this.boundRect = new Rect(width, height);

        this.points = (points !== undefined && points !== null) ? points : new Array<Point2D>();
        this.regionType = (regionType !== undefined) ? regionType : RegionDataType.Point;
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any): void {
        const oldx = this.x;
        const oldy = this.y;
        this.corner.move(arg1, arg2);

        const dx = this.x - oldx;
        const dy = this.y - oldy;

        this.points.forEach((p) => {
            p.moveDelta(dx, dy);
        });
    }

    public resize(width: number, height: number) {
        const sx = width / this.width;
        const sy = height / this.height;

        this.boundRect.resize(width, height);

        this.points.forEach((p) => {
            const px = (p.x - this.x) * sx + this.x;
            const py = (p.y - this.y) * sy + this.y;
            p.move(px, py);
        });
    }

    public setPoints(points: Point2D[]) {
        let xmin = Number.MAX_VALUE;
        let xmax = 0;
        let ymin = Number.MAX_VALUE;
        let ymax = 0;

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

        this.points = points;
        this.corner.move(xmin, ymin);
        this.boundRect.resize(xmax - xmin, ymax - ymin);
    }

    public boundToRect(rect: Rect): RegionData {
        const tlCorner = this.corner.boundToRect(rect);
        const brCorner = (new Point2D(this.x + this.width, this.y + this.height)).boundToRect(rect);

        const width = brCorner.x - tlCorner.x;
        const height = brCorner.y - brCorner.y;

        return new RegionData(tlCorner.x, tlCorner.y, width, height, this.points.map((p) => p.boundToRect(rect)), this.regionType);
    }

    public scaleByFactor(xfactor: number, yfactor: number):RegionData;
    public scaleByFactor(factor: number):RegionData;    
    public scaleByFactor(f1: number, f2?: number):RegionData {
        let xf = f1;
        let yf = (f2 !== undefined) ? f2: f1;

        return new RegionData(this.x * xf, this.y * yf, this.width * xf, this.height * yf, 
                              this.points.map((p) => new Point2D(p.x * xf, p.y * yf)),
                              this.regionType);
    }

    public copy(): RegionData {
        return new RegionData(this.x, this.y, this.width, this.height, this.points.map((p) => p.copy()), this.regionType);
    }

    public toString(): string {
        return `${this.corner.toString()} x ${this.boundRect.toString()}: {${this.points.toString()}}`;
    }
}
