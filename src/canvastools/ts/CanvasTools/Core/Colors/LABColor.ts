import { RGBColor } from "./RGBColor";
import { XYZColor } from "./XYZColor";

export class LABColor {
    public get l(): number {
        return this.values[0];
    }

    public get a(): number {
        return this.values[1];
    }

    public get b(): number {
        return this.values[2];
    }

    private values: number[];

    constructor(l: number, a: number, b: number) {
        this.values = [l, a, b];
    }

    public toArray(): number[] {
        // copy
        return this.values.map((v) => v);
    }

    public toXYZ(): XYZColor {
        let y = (this.l + 16) / 116;
        let x = this.a / 500 + y;
        let z = y - this.b / 200;

        [x, y, z] = [x, y, z].map((v) => {
            const v3 = v * v * v;
            return (v3 > 0.008856451) ? v : (v - 16 / 116) / 7.787037;
        });

        return new XYZColor(x * XYZColor.D65.x, y * XYZColor.D65.y, z * XYZColor.D65.z);
    }
}
