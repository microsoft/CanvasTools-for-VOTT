export module CanvasTools.Base.Interfaces {
    export interface IRect {
        width: number;
        height: number;
        copy(): IRect;
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

    export interface IMovable {
        x: number;
        y: number;
        move(point: IPoint2D):void;
    }

    export interface IRegionPart extends IHideable, IResizable, IMovable {
        rect: IRect;
    }
}
