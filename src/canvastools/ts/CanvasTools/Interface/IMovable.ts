
export interface IMovable {
    x: number;
    y: number;
    move(point: IMovable):void;
    move(x: number, y: number):void;
}