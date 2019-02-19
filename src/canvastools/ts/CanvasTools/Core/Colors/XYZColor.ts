import { RGBColor } from "./RGBColor";
import { SRGBColor } from "./SRGBColor";
import { LABColor } from "./LABColor";

/**
 * Represents the CIE XYZ color space.
 */
export class XYZColor {
    /**
     * The D65 white point vector.
     */
    public static D65 = new XYZColor(0.95047, 1.000, 1.08883);

    /**
     * The D50 white point vector.
     */
    public static D50 = new XYZColor(0.966797, 1.000, 0.825188);

    /**
     * The x-component of the color.
     */
    public get x(): number {
        return this.values[0];
    }

    /**
     * The y-component of the color.
     */
    public get y(): number {
        return this.values[1];
    }

    /**
     * The z-component of the color.
     */
    public get z(): number {
        return this.values[2];
    }

    /**
     * Array of color components as [x, y, z].
     */
    private values: number[];

    /**
     * Creates new XYZ color.
     * @param x - x-component in the range [0, 1].
     * @param y - y-component in the range [0, 1].
     * @param z - z-component in the range [0, 1].
     */
    constructor(x: number, y: number, z: number) {
        this.values = [x, y, z];
    }

    /**
     * Return a copy of color values in array format as [x, y, z].
     */
    public toArray(): number[] {
        // copy
        return this.values.map((v) => v);
    }

    /**
     * Trasforms color to the RGB format.
     */
    public toRGB(): RGBColor {
        const [x, y, z] = this.values;
        const r = +3.2406255 * x - 1.5372080 * y - 0.4986286 * z;
        const g = -0.9689307 * x + 1.8757561 * y + 0.0415175 * z;
        const b = +0.0557101 * x - 0.2040211 * y + 1.0569959 * z;
        return new RGBColor(r, g, b);
    }

    /**
     * Trasforms color to the sRGB format.
     */
    public toSRGB(): SRGBColor {
        return this.toRGB().toSRGB();
    }

    /**
     * Trasforms color to the CIE LAB format.
     */
    public toLAB(): LABColor {
        const x = this.x / XYZColor.D65.x;
        const y = this.y / XYZColor.D65.y;
        const z = this.z / XYZColor.D65.z;

        const xyz = [x, y, z].map((v) => {
            if (v > 0.008856451) {
                return v ** (1 / 3);
            } else {
                return 7.787037 * v + 16 / 116;
            }
        });

        return new LABColor((116 * xyz[1] - 16) / 100, 5 * (xyz[0] - xyz[1]), 2 * (xyz[1] - xyz[2]));
    }
}
