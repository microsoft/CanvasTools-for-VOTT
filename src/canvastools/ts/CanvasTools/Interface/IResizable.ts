import { IRect } from "./IRect";

export interface IResizable extends IRect {
    resize(width: number, height: number): void;
}
