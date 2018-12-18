import { IRect } from "./IRect";

export interface IBoundable<T> {
    boundToRect(rect: IRect):T;
}