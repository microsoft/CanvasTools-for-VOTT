import { IMovable } from "./../Interface/IMovable";
import { IResizable } from "./../Interface/IResizable";
import { Point2D } from "./CanvasTools.Point2D";
import { Rect } from "./CanvasTools.Rect";

export enum RegionDataType {Point = "point", Rect = "rect", Polyline = "polyline"};

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
        return this.boundRect.width * this.boundRect.height;
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

    public boundToRect(rect: Rect): RegionData {
        const tlCorner = this.corner.boundToRect(rect);
        const brCorner = (new Point2D(this.x + this.width, this.y + this.height)).boundToRect(rect);

        const width = brCorner.x - tlCorner.x;
        const height = brCorner.y - brCorner.y;

        return new RegionData(tlCorner.x, tlCorner.y, width, height, this.points.map((p) => p.boundToRect(rect)));
    }

    public copy(): RegionData {
        return new RegionData(this.x, this.y, this.width, this.height, this.points.map((p) => p.copy()));
    }

    public toString(): string {
        return `${this.corner.toString()} x ${this.boundRect.toString()}: {${this.points.toString()}}`;
    }
}
