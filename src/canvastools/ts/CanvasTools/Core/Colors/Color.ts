import { RGBColor } from "./RGBColor";
import { SRGBColor } from "./SRGBColor";
import { XYZColor } from "./XYZColor";
import { LABColor } from "./LABColor";
import { HSLColor } from "./HSLColor";

/**
 * A wrapper `Color` class to represent various color formats
 * and manage conversions between them.
 * @remarks The current work on defining color management in web (including conversion algorithms)
 * can be tracked in this draft: https://drafts.csswg.org/css-color/
 */
export class Color {
    public get sRGB(): SRGBColor {
        return this.srgbColor;
    }

    public get RGB(): RGBColor {
        if (this.rgbColor === undefined) {
            this.rgbColor = this.srgbColor.toRGB();
        }

        return this.rgbColor;
    }

    public get XYZ(): XYZColor {
        if (this.xyzColor === undefined) {
            this.xyzColor = this.RGB.toXYZ();
        }

        return this.xyzColor;
    }

    public get LAB(): LABColor {
        if (this.labColor === undefined) {
            this.labColor = this.XYZ.toLAB();
        }

        return this.labColor;
    }

    public get HSL(): HSLColor {
        if (this.hslColor === undefined) {
            this.hslColor = this.srgbColor.toHSL();
        }

        return this.hslColor;
    }

    private srgbColor: SRGBColor;
    private rgbColor: RGBColor;
    private xyzColor: XYZColor;
    private labColor: LABColor;
    private hslColor: HSLColor;

    constructor(srgb: SRGBColor);
    constructor(rgb: RGBColor);
    constructor(hsl: HSLColor);
    constructor(xyz: XYZColor);
    constructor(lab: LABColor);
    constructor(srgbCSSString: string);
    constructor(r: number, g: number, b: number);
    constructor(...args) {
        if (args.length === 1) {
            const c = args[0];
            if (c instanceof SRGBColor) {
                this.srgbColor = c;
            } else if (c instanceof RGBColor) {
                this.rgbColor = c;
                this.srgbColor = c.toSRGB();
            } else if (c instanceof HSLColor) {
                this.hslColor = c;
                this.srgbColor = c.toSRGB();
            } else if (c instanceof XYZColor) {
                this.xyzColor = c;
                this.rgbColor = c.toRGB();
                this.srgbColor = this.rgbColor.toSRGB();
            } else if (c instanceof LABColor) {
                this.labColor = c;
                this.xyzColor = c.toXYZ();
                this.rgbColor = this.xyzColor.toRGB();
                this.srgbColor = this.rgbColor.toSRGB();
            } else if (typeof c === "string") {
                this.srgbColor = SRGBColor.ParseHex(c);
            } else {
                throw new Error("Wrong arg type. Expected one of the '***Color' types.");
            }
        } else if (args.length === 3) {
            if (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number") {
                this.srgbColor = new SRGBColor(args[0], args[1], args[2]);
            } else {
                throw new Error("Wrong arg type. Expected 3 args of the 'number' type.");
            }

        } else {
            throw new Error("Wrong args for Color constructor.");
        }
    }
}
