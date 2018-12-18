import { IMovable } from "./../Interface/IMovable";
import { IBoundable } from "../Interface/IBoundable";
import { Rect} from "./CanvasTools.Rect";

export class Point2D implements IMovable, IBoundable<Point2D> {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
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
    
    public boundToRect(r: Rect): Point2D {
        let newp = new Point2D(0, 0);

        newp.x = (this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x);
        newp.y = (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y);

        return newp;
    }

    public copy(): Point2D {
        return new Point2D(this.x, this.y);
    }
}
