import { IBoundable } from "../Interface/IBoundable";
import { IMovable } from "../Interface/IMovable";
import { Rect} from "./Rect";

export class Point2D implements IMovable, IBoundable<Point2D> {
    public x: number;
    public y: number;
    constructor(x: number, y: number);
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

    public move(point: IMovable): void;
    public move(x: number, y: number): void;

    public move(arg1: any, arg2?: any): void {
        if (typeof arg1 === "number" && typeof arg2 === "number") {
            this.x = arg1;
            this.y = arg2;
        } else if (arg1.x !== undefined && arg1.y !== undefined) {
            this.x = arg1.x;
            this.y = arg1.y;
        }
    }

    public moveDelta(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }

    public boundToRect(r: Rect): Point2D {
        const newp = new Point2D(0, 0);

        newp.x = (this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x);
        newp.y = (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y);

        return newp;
    }

    public copy(): Point2D {
        return new Point2D(this.x, this.y);
    }

    public toString(): string {
        return `{${this.x.toString()}, ${this.y.toString()}}`;
    }
}
