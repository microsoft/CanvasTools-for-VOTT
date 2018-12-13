import { IRect } from "./../Interface/IRect";
import { IResizable } from "./../Interface/IResizable";
export declare class Rect implements IRect, IResizable {
    width: number;
    height: number;
    constructor(width: number, height: number);
    resize(width: number, height: number): void;
    copy(): Rect;
}
