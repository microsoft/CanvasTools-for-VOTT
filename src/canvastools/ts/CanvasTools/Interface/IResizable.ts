import { IRect } from "./IRect";

/**
 * Defines an object that can be resized to specified size.
 */
export interface IResizable extends IRect {
    /**
     * Resize the object to specified `width` and `height`.
     * @param width - The new object `width`.
     * @param height - The new object `height`.
     */
    resize(width: number, height: number): void;
}
