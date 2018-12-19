import { IResizable } from "./IResizable";

export interface IBoundable<T> {
    boundToRect(rect: IResizable): T;
}
