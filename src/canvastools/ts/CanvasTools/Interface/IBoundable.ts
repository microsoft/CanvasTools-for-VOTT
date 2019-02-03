import { IResizable } from "./IResizable";

/**
 * Describes objects that can be bounded to specified box.
 */
export interface IBoundable<T> {
    /**
     * Returns an object bounded to specified `rect` box.
     * @param rect - Bounding `rect` (box).
     * @returns A new object of specified type `T`.
     */
    boundToRect(rect: IResizable): T;
}
