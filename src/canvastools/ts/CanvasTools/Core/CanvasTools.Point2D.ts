import { IRect } from "./../Interface/IRect";
import { IPoint2D } from "./../Interface/IPoint2D";

export class Point2D implements IPoint2D {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public boundToRect(r: IRect): Point2D {
        let newp = new Point2D(0, 0);

        newp.x = (this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x);
        newp.y = (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y);

        return newp;
    }
}
