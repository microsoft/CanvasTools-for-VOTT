import { RGBColor } from "./RGBColor";
import { LABColor } from "./LABColor";

export class XYZColor {
    public static D65 = new XYZColor(0.95047, 1.0, 1.08883);
    public static D50 = new XYZColor(0.966797, 1.0, 0.825188);

    public get x(): number {
        return this.values[0];
    }

    public get y(): number {
        return this.values[1];
    }

    public get z(): number {
        return this.values[2];
    }

    private values: number[];

    constructor(x: number, y: number, z: number) {
        this.values = [x, y, z];
    }

    public toArray(): number[] {
        // copy
        return this.values.map((v) => v);
    }

    public toRGB(): RGBColor {
        const [x, y, z] = this.values;
        const r = +3.2406255 * x - 1.5372080 * y - 0.4986286 * z;
        const g = -0.9689307 * x + 1.8757561 * y + 0.0415175 * z;
        const b = +0.0557101 * x - 0.2040211 * y + 1.0569959 * z;
        return new RGBColor(r, g, b);
    }

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

        return new LABColor(116 * xyz[1] - 16, 500 * (xyz[0] - xyz[1]), 200 * (xyz[1] - xyz[2]));
    }
}
