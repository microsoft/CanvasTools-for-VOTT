import { RGBColor } from "./RGBColor";
import { XYZColor } from "./XYZColor";
import { LABColor } from "./LABColor";
import { HSLColor } from "./HSLColor";

export class Color {
    public rgb: RGBColor;
    public xyz: XYZColor;
    public lab: LABColor;
    public hsl: HSLColor;

    constructor(r: number, g: number, b: number) {
        this.rgb = new RGBColor(r, g, b);
        // do one time calculation
        this.hsl = this.rgb.toHSL();
        this.xyz = this.rgb.toXYZ();
        this.lab = this.xyz.toLAB();
    }
}
