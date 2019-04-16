import { XYZColor } from "./XYZColor";
import { LABColor } from "./LABColor";
import { SRGBColor } from "./SRGBColor";

/**
 * Represents the RGB color space.
 */
export class RGBColor {
    /**
     * The red-component of the color.
     */
    public get r(): number {
        return this.values[0];
    }

    /**
     * The green-component of the color.
     */
    public get g(): number {
        return this.values[1];
    }

    /**
     * The blue-component of the color.
     */
    public get b(): number {
        return this.values[2];
    }

    /**
     * Array of color components as [r, g, b].
     */
    private values: number[];

    /**
     * Creates new RGBColor
     * @param r - Red component in the range [0, 1].
     * @param g - Green component in the range [0, 1].
     * @param b - Blue component in the range [0, 1].
     */
    constructor(r: number, g: number, b: number) {
        this.values = [r, g, b];
    }

    /**
     * Normalize color to the [0, 1] range
     */
    public normalize(): RGBColor {
        let [r, g, b] = this.values;
        r = Math.min(1, Math.max(0, r));
        g = Math.min(1, Math.max(0, g));
        b = Math.min(1, Math.max(0, b));
        return new RGBColor(r, g, b);
    }

    /**
     * Return a copy of color values in array format as [r, g, b].
     */
    public toArray(): number[] {
        // copy
        return this.values.map((v) => v);
    }

    /**
     * Trasforms color to the XYZ format.
     */
    public toXYZ(): XYZColor {
        // https://www.w3.org/TR/css-color-4/#color-conversion-code
        const [r, g, b] = this.values;
        const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
        const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
        const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
        return new XYZColor(x, y, z);
    }

    /**
     * Trasforms color to the sRGB values.
     */
    public toSRGB(): SRGBColor {
        const values = this.values.map((v) => {
            if (v < 0.0031308) {
                return 12.92 * v;
            } else {
                return 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
            }
        });

        return new SRGBColor(values[0], values[1], values[2]);
    }

    /**
     * Trasforms color to the CIE LAB format.
     */
    public toLAB(): LABColor {
        return this.toXYZ().toLAB();
    }
}
