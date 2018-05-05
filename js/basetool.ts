export namespace CanvasTools.Base {
    export interface IRect {
        width: number;
        height: number;
    }

    export interface IPoint2D {
        x: number;
        y: number;
        boundToRect(rect: IRect): IPoint2D;
    }

    export interface IHideable {
        hide():void;
        show():void;
    }

    export interface IResizable {
        resize(width:number, height:number):void;
    }

    export class Rect implements IRect, IResizable {
        public width: number;
        public height: number;
        constructor(width: number, height: number){
            this.resize(width, height);
        }
        
        public resize(width: number, height: number):void {
            this.width = width;
            this.height = height;
        }

    }

    export class Point2D implements IPoint2D {
        public x: number;
        public y: number;
        constructor(x: number, y:number) {
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
}