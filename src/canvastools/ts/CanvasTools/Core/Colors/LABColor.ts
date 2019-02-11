import { RGBColor } from "./RGBColor";
import { XYZColor } from "./XYZColor";

export interface ILabColorPoint {
    a: number;
    b: number;
}

export class LABColor implements ILabColorPoint {
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

    public distanceTo(color: LABColor): number {
        const deltaL = this.values[0] - color.values[0];
        const deltaA = this.values[1] - color.values[1];
        const deltaB = this.values[2] - color.values[2];
        const c1 = Math.sqrt(this.values[1] * this.values[1] + this.values[2] * this.values[2]);
        const c2 = Math.sqrt(color.values[1] * color.values[1] + color.values[2] * color.values[2]);
        const deltaC = c1 - c2;
        let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
        deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
        const sc = 1.0 + 0.045 * c1;
        const sh = 1.0 + 0.015 * c1;
        const deltaLKlsl = deltaL / (1.0);
        const deltaCkcsc = deltaC / (sc);
        const deltaHkhsh = deltaH / (sh);
        const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
    }

    public distanceToGray(): number {
        return Math.sqrt(this.a * this.a + this.b * this.b);
    }

    public toArray(): number[] {
        // copy
        return this.values.map((v) => v);
    }

    public toXYZ(): XYZColor {
        let y = (this.l * 100 + 16) / 116;
        let x = this.a / 5 + y;
        let z = y - this.b / 2;

        [x, y, z] = [x, y, z].map((v) => {
            const v3 = v * v * v;
            return (v3 > 0.008856451) ? v3 : (v - 16 / 116) / 7.787037;
        });

        return new XYZColor(x * XYZColor.D65.x, y * XYZColor.D65.y, z * XYZColor.D65.z);
    }

    public toRGB(): RGBColor {
        return this.toXYZ().toRGB();
    }
}
