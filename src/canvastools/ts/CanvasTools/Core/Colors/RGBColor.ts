import { HSLColor } from "./HSLColor";
import { XYZColor } from "./XYZColor";

export class RGBColor {
    public static ParseHex(hex: string): RGBColor {
        const isValidColor = /#([a-f0-9]{3}){1,2}\b/i.test(hex);
        if (!isValidColor) {
            throw new Error(`Invalid CSS RGB color: ${hex}`);
        }

        let r: number;
        let g: number;
        let b: number;
        if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16) / 255;
            g = parseInt(hex.substring(3, 5), 16) / 255;
            b = parseInt(hex.substring(5, 7), 16) / 255;
        } else if (hex.length === 4) {
            r = parseInt(hex.charAt(1), 16) / 16;
            g = parseInt(hex.charAt(2), 16) / 16;
            b = parseInt(hex.charAt(3), 16) / 16;
        }

        return new RGBColor(r, g, b);
    }

    public static FromSRGB(sr: number, sg: number, sb: number): RGBColor {
        const [r, g, b] = [sr, sg, sb].map((v) => {
            if (v < 0.04045) {
                return v / 12.92;
            } else {
                return ((v + 0.055) / 1.055) ** 2.4;
            }
        });
        return new RGBColor(r, g, b);
    }

    public get r(): number {
        return this.values[0];
    }

    public get g(): number {
        return this.values[1];
    }

    public get b(): number {
        return this.values[2];
    }

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

    public toArray(): number[] {
        // copy
        return this.values.map((v) => v);
    }

    public toCSSString(alpha?: number): string {
        const [r, g, b] = this.to255();
        if (alpha !== undefined) {
            // cast to [0, 1]
            alpha = Math.min(1, Math.max(0, alpha));
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
            return `rgb(${r}, ${g}, ${b})`;
        }
    }

    public toHex(alpha?: number): string {
        const [r, g, b] = this.toFF();
        if (alpha !== undefined) {
            // cast to [0, 1]
            alpha = Math.min(1, Math.max(0, alpha));
            const alphaFF = Math.round(alpha * 255).toString(16);
            return `#${r}${g}${b}${alphaFF})`;
        } else {
            return `#${r}${g}${b}`;
        }
    }

    public toHSL(): HSLColor {
        const [r, g, b] = this.values;
        const max: number = Math.max(r, g, b);
        const min: number = Math.min(r, g, b);
        let h: number;
        let s: number;
        const l: number = (max + min) / 2;

        if (max === min) {
          h = 0;
          s = 0;
        } else {
            const d = max - min;
            s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return new HSLColor(h, s, l);
    }

    public toXYZ(): XYZColor {
        const [r, g, b] = this.values;
        const x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
        const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
        return new XYZColor(x, y, z);
    }

    public toSRGB(): number[] {
        return this.values.map((v) => {
            if (v < 0.0031308) {
                return 12.92 * v;
            } else {
                return 1.055 / (v ** 2.4) - 0.055;
            }
        });
    }

    private to255(): number[] {
        return this.values.map((v) => Math.round(255 * v));
    }

    private toFF(): string[] {
        return this.values.map((v) => Math.round(v * 255).toString(16));
    }
}
