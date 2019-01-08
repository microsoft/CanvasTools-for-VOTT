import { ITag } from "../Interface/ITag";

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
        return new Tag(data.name, data.colorHue, (data.id === undefined) ? "" : data.id);
    }

    /**
     * Extracts the hue component from a provided CSS color string
     * @param color - A CSS-color in "#RRGGBB" or "#RGB" format
     * @returns A hue value for provided color
     */
    public static getHueFromColor(color: string): number {
        let r: number;
        let g: number;
        let b: number;
        if (color.length === 7) {
            r = parseInt(color.substring(1, 3), 16) / 255;
            g = parseInt(color.substring(3, 5), 16) / 255;
            b = parseInt(color.substring(5, 7), 16) / 255;
        } else if (color.length === 4) {
            r = parseInt(color.charAt(1), 16) / 16;
            g = parseInt(color.charAt(2), 16) / 16;
            b = parseInt(color.charAt(3), 16) / 16;
        }        

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return Math.round(h * 360);
    }

    private tagHue: number;
    private tagName: string;
    private tagID: string;
    /**
     * The hue-value of the tag's color. *Readonly*
     */
    public get colorHue(): number {
        return this.tagHue;
    };

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

    /**
     * Returns the pure color variation of the tag's color
     * @returns String hsl(H, 100%, 50%)
     */
    public get colorPure(): string {
        if (this.tagColorPure === "") {
            this.tagColorPure = `hsl(${this.tagHue.toString()}, 100%, 50%)`;
        }
        return this.tagColorPure;
    }

    /**
     * Returns the accent color variation of the tag's color
     * @returns String hsla(H, 100%, 50%, 0.5)
     */
    public get colorAccent(): string {
        if (this.tagColorAccent === "") {
            this.tagColorAccent = `hsla(${this.tagHue.toString()}, 100%, 50%, 0.5)`;
        }
        return this.tagColorAccent;
    }
    
    /**
     * Returns the highlight color variation of the tag's color
     * @returns String hsla(H, 80%, 40%, 0.3)
     */
    public get colorHighlight(): string {
        if (this.tagColorHighlight === "") {
            this.tagColorHighlight = `hsla(${this.tagHue.toString()}, 80%, 40%, 0.3)`;
        }
        return this.tagColorHighlight;
    }
    
    /**
     * Returns the shadow color variation of the tag's color
     * @returns String hsla(H, 50%, 30%, 0.2)
     */
    public get colorShadow(): string {
        if (this.tagColorShadow === "") {
            this.tagColorShadow = `hsla(${this.tagHue.toString()}, 50%, 30%, 0.2)`;
        }
        return this.tagColorShadow;
    }

    /**
     * Returns the dark color variation of the tag's color
     * @returns String hsla(H, 50% 30%, 0.8)
     */
    public get colorDark(): string {
        if (this.tagColorDark === "") {
            this.tagColorDark = `hsla(${this.tagHue.toString()}, 50%, 30%, 0.8)`;
        }
        return this.tagColorDark;
    }
    
    /**
     * Returns the fully transparent color variation of the tag's color
     * @returns String hsla(0, 0%, 0%, 0.0)
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
     */
    constructor(name: string, colorHue: number, id?: string);
    /**
     * Creates a new `Tag` object with specified `name`, hue value of `cssColor` and `id`
     * @param name - `name` of the new tag
     * @param cssColor - CSS color (e.g. #FF03A3) for the new tag, *only hue value of the color will be used*
     * @param id - `id` of the new tag (optional, by default is "")
     */
    constructor(name: string, cssColor: string, id?: string);
    
    constructor(name: string, color: number|string, id: string = "") {
        this.tagName = name;

        if (typeof color === "number") {
            this.tagHue = color % 360;
        } else if (typeof color === "string") {
            // check pattern
            let isValidColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
            if (isValidColor) {
                this.tagHue = Tag.getHueFromColor(color);
            } else {
                this.tagHue = 0;
            }             
        }
        
        this.tagID = id;
    }

    /**
     * Creates a copy of this tag
     * @returns A new `Tag` object with copied properties
     */
    public copy(): Tag {
        return new Tag(this.tagName, this.tagHue, this.tagID);
    }

    /**
     * Returns a JSON representation of the tag
     * @returns An `ITag` object with `name`, `colorHue` and `id` properties
     */
    public toJSON(): ITag {
        return {
            name: this.tagName,
            colorHue: this.tagHue,
            id: this.tagID
        }
    }
}
