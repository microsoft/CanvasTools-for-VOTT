import { IResizable } from "./../Interface/IResizable";
import { IMovable } from "./../Interface/IMovable";
import { Rect } from "./CanvasTools.Rect";
import { Point2D } from "./CanvasTools.Point2D";

export enum RegionDataType {Point = "point", Rect = "rect", Polyline = "polyline"};

export class RegionData implements IMovable, IResizable {
    private __corner: Point2D;
    
    public boundRect: Rect;
    public points: Array<Point2D>;

    public get x(): number{
        return this.__corner.x;
    };

    public get y(): number {
        return this.__corner.y;
    }

    public get width(): number {
        return this.boundRect.width;
    }

    public get height(): number {
        return this.boundRect.height;
    };

    public regionType: RegionDataType;

    constructor(x: number, y: number, width: number, height: number, points?: Array<Point2D>, regionType: RegionDataType = RegionDataType.Point) {
        this.__corner = new Point2D(x, y);
        this.boundRect = new Rect(width, height);

        this.points = (points !== undefined && points !== null) ? points : new Array<Point2D>();
        this.regionType = regionType;
    }

    public static BuildPointRegionData(x, y): RegionData {
        return new RegionData(x, y, 0, 0, [new Point2D(x, y)], RegionDataType.Point);        
    }

    public static BuildRectRegionData(x, y, width, height): RegionData {
        return new RegionData(x, y, width, height, [new Point2D(x, y), new Point2D(x + width, y + height)], RegionDataType.Rect);        
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any): void {
        let oldx = this.x;
        let oldy = this.y;
        this.__corner.move(arg1, arg2);
        
        let dx = this.x - oldx;
        let dy = this.y - oldy;

        this.points.forEach((p) => {
            p.moveDelta(dx, dy);
        });
    }

    public resize(width: number, height: number) {
        let sx = width/this.width;
        let sy = height/this.height;

        this.boundRect.resize(width, height);

        this.points.forEach((p) => {
            let px = (p.x - this.x) * sx + this.x;
            let py = (p.y - this.y) * sy + this.y;
            p.move(px, py);
        });
    }

    public boundToRect(rect: Rect): RegionData {
        let tlCorner = this.__corner.boundToRect(rect);
        let brCorner = (new Point2D(this.x + this.width, this.y + this.height)).boundToRect(rect);

        let width = brCorner.x - tlCorner.x;
        let height = brCorner.y - brCorner.y;

        return new RegionData(tlCorner.x, tlCorner.y, width, height, this.points.map(p => p.boundToRect(rect)));
    }

    public copy(): RegionData {
        return new RegionData(this.x, this.y, this.width, this.height, this.points.map(p => p.copy()));
    }

    public toString(): string {
        return `${this.__corner.toString()} x ${this.boundRect.toString()}: {${this.points.toString()}}`;
    }
}