import { Color } from "../Core/Colors/Color";
import { ITag } from "../Interface/ITag";
import { HSLColor } from "./Colors/HSLColor";
import { LABColor } from "./Colors/LABColor";

/**
 * Represents meta-data for a tag
 * @remarks
 * 1. To represent the color Tag class uses only the hue component
 * and generates a number of color variations based on that value.
 * 2. The `Tag` object is *immutable*, all public properties are readonly.
 */
export class Tag implements ITag {
    /**
     * Creates a new tag based on extracting specific properties from any provided object
     * @param data - An `ITag` object with `name`, `colorHue` and `id` properties
     * @returns A new `Tag` object
     */
    public static BuildFromJSON(data: ITag): Tag {
        if (data.color !== undefined) {
            return new Tag(data.name, new Color(data.color), (data.id === undefined) ? "" : data.id);
        } else if (data.colorHue !== undefined) {
            return new Tag(data.name, new Color(new HSLColor((data.colorHue % 360) / 360.0, 1, 0.5)),
                           (data.id === undefined) ? "" : data.id);
        }
    }

    /**
     * Extracts the hue component from a provided CSS color string
     * @param color - A CSS-color in "#RRGGBB" or "#RGB" format
     * @returns A hue value for provided color
     * @deprecated Use the Color class instead.
     */
    public static getHueFromColor(color: string): number {
        const c = new Color(color);
        return c.HSL.h * 360;
    }

    private tagName: string;
    private tagID: string;

    /**
     * The hue-value of the tag's color. *Readonly*
     */
    public get colorHue(): number {
        return this.colorObj.HSL.h * 360;
    }

    /**
     * The tag's color in hex format. *Readonly*
     */
    public get color(): string {
        return this.colorObj.sRGB.toHex();
    }

    /**
     * The `name` of the tag. *Readonly*
     */
    public get name(): string {
        return this.tagName;
    }

    /**
     * The `id` of the tag. *Readonly*
     */
    public get id(): string {
        return this.tagID;
    }

    private tagColorPure: string = "";
    private tagColorAccent: string = "";
    private tagColorHighlight: string = "";
    private tagColorShadow: string = "";
    private tagColorNoColor: string = "";
    private tagColorDark: string = "";

    private colorObj: Color;

    /**
     * Returns the pure color variation of the tag's color
     * @returns String hsl(H, 100%, 50%)
     */
    public get colorPure(): string {
        if (this.tagColorPure === "") {
            this.tagColorPure = this.colorObj.sRGB.toCSSString();
            // OLD: `hsl(${this.tagHue.toString()}, 100%, 50%)`;
        }
        return this.tagColorPure;
    }

    /**
     * Returns the accent color variation of the tag's color.
     * Accent = almost pure, alpha = 0.8.
     * @returns Hex string for the color
     */
    public get colorAccent(): string {
        if (this.tagColorAccent === "") {
            this.tagColorAccent = this.colorObj.sRGB.toCSSString(0.8);
            // OLD: `hsla(${this.tagHue.toString()}, 100%, 50%, 0.5)`;
        }
        return this.tagColorAccent;
    }

    /**
     * Returns the highlight color variation of the tag's color.
     * Highlight = grayed pure, alpha = 0.4
     * @returns Hex string for the color
     */
    public get colorHighlight(): string {
        if (this.tagColorHighlight === "") {
            const lab = this.colorObj.LAB.toArray();
            const highlight = new LABColor(lab[0] * 0.7, lab[1] * 0.7, lab[2] * 0.7);
            this.tagColorHighlight = highlight.toSRGB().truncate().toCSSString(0.4);
            // OLD: `hsla(${this.tagHue.toString()}, 80%, 40%, 0.3)`;
        }
        return this.tagColorHighlight;
    }

    /**
     * Returns the shadow color variation of the tag's color
     * Shadow = grayed pure, alpha = 0.2
     * @returns Hex string for the color
     */
    public get colorShadow(): string {
        if (this.tagColorShadow === "") {
            const lab = this.colorObj.LAB.toArray();
            const shadow = new LABColor(lab[0] * 0.6, lab[1] * 0.6, lab[2] * 0.6);
            this.tagColorShadow = shadow.toSRGB().truncate().toCSSString(0.2);
            // OLD: `hsla(${this.tagHue.toString()}, 50%, 30%, 0.2)`;
        }
        return this.tagColorShadow;
    }

    /**
     * Returns the dark color variation of the tag's color.
     * Dark = pure with decreased lightness and grayed.
     * @returns Hex string for the color
     */
    public get colorDark(): string {
        if (this.tagColorDark === "") {
            const lab = this.colorObj.LAB.toArray();
            const dark = new LABColor(lab[0] * 0.5, lab[1] * 0.5, lab[2] * 0.5);
            this.tagColorDark = dark.toSRGB().truncate().toCSSString(0.8);
            // OLD: `hsla(${this.tagHue.toString()}, 50%, 30%, 0.8)`;
        }
        return this.tagColorDark;
    }

    /**
     * Returns the fully transparent color variation of the tag's color
     * @returns Hex string for the color
     */
    public get colorNoColor(): string {
        if (this.tagColorNoColor === "") {
            this.tagColorNoColor = `rgba(0, 0, 0, 0.0)`;
        }
        return this.tagColorNoColor;
    }

    /**
     * Creates a new `Tag` object with specified `name`, `colorHue` and `id`
     * @param name - `name` of the new tag
     * @param colorHue - `colorHue` of the new tag
     * @param id - `id` of the new tag (optional, by default is "")
     * @deprecated Use the `Color` class instead.
     */
    constructor(name: string, colorHue: number, id?: string);
    /**
     * Creates a new `Tag` object with specified `name`, hue value of `cssColor` and `id`
     * @param name - `name` of the new tag
     * @param cssColor - CSS color (e.g. #FF03A3) for the new tag, *only hue value of the color will be used*
     * @param id - `id` of the new tag (optional, by default is "")
     */
    constructor(name: string, cssColor: string, id?: string);
    /**
     * Creates a new `Tag` object with specified `name`, hue value of `cssColor` and `id`
     * @param name - `name` of the new tag
     * @param color - The `Color` object.
     * @param id - `id` of the new tag (optional, by default is "")
     */
    constructor(name: string, color: Color, id?: string);

    constructor(name: string, color: number|string|Color, id: string = "") {
        this.tagName = name;

        if (typeof color === "number") {
            this.colorObj = new Color(new HSLColor((color % 360) / 360.0, 1, 0.5));
        } else if (typeof color === "string") {
            this.colorObj = new Color(color);
        } else if (color instanceof Color) {
            this.colorObj = color;
        }
        this.tagID = id;
    }

    /**
     * Creates a copy of this tag
     * @returns A new `Tag` object with copied properties
     */
    public copy(): Tag {
        return new Tag(this.tagName, this.colorObj, this.tagID);
    }

    /**
     * Returns a JSON representation of the tag
     * @returns An `ITag` object with `name`, `colorHue` and `id` properties
     */
    public toJSON(): ITag {
        return {
            name: this.tagName,
            colorHue: this.colorHue,
            color: this.colorObj.sRGB.toHex(),
            id: this.tagID,
        };
    }
}
