import { IRect } from "../Interface/IRect";
import { IResizable } from "../Interface/IResizable";

/**
 * Represents a rect object
 */
export class Rect implements IResizable {
    /**
     * Creates a new rect based on extracting specific properties from any provided object
     * @param data - An `IRect` object with `width` and `height` numeric properties
     * @returns A new `Rect` object
     */
    public static BuildFromJSON(data: IRect): Rect {
        return new Rect(data.width, data.height);
    }

    /**
     * `width` of the rect
     */
    public width: number;
    /**
     * `height` of the rect
     */
    public height: number;

    /**
     * Creates a new `Rect` object with specified `width` and `height`
     * @param width - `width` of the new rect
     * @param height - `height` of the new rect
     */
    constructor(width: number, height: number) {
        this.width = 0;
        this.height = 0;
        this.resize(width, height);
    }

    /**
     * Resizes this rect to specified `width` and `height`
     * @param width - a new `width` for the rect
     * @param height - a new `height` for the rect
     */
    public resize(width: number, height: number): void {
        if (width >= 0 && height >= 0) {
            this.width = width;
            this.height = height;
        }
    }

    /**
     * Creates a copy of this rect
     * @returns A new `Rect` object with copied dimensions
     */
    public copy(): Rect {
        return new Rect(this.width, this.height);
    }

    /**
     * Returns a string representation of the rect in the format `"[width, height]"`.
     * @returns A string representation of the rect
     */
    public toString(): string {
        return `[${this.width.toString()}, ${this.height.toString()}]`;
    }

    /**
     * Returns a JSON representation of the rect
     * @returns An `IRect` object with `width` and `height` numeric properties.
     */
    public toJSON(): IRect {
        return {
            width: this.width,
            height: this.height,
        };
    }
}
