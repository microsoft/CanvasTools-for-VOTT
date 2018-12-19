export class Tag {
    public static getHueFromColor(color: string): number {
        const r = parseInt(color.substring(1, 3), 16) / 255;
        const g = parseInt(color.substring(3, 5), 16) / 255;
        const b = parseInt(color.substring(5, 7), 16) / 255;

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

        return h;
    }

    public colorHue: number;
    public name: string;
    public id: string;

    private tagColorPure: string = "";
    public get colorPure(): string {
        if (this.tagColorPure === "") {
            this.tagColorPure = `hsl(${this.colorHue.toString()}, 100%, 50%)`;
        }
        return this.tagColorPure;
    }

    private tagColorAccent: string = "";
    public get colorAccent(): string {
        if (this.tagColorAccent === "") {
            this.tagColorAccent = `hsla(${this.colorHue.toString()}, 100%, 50%, 0.5)`;
        }
        return this.tagColorAccent;
    }

    private tagColorHighlight: string = "";
    public get colorHighlight(): string {
        if (this.tagColorHighlight === "") {
            this.tagColorHighlight = `hsla(${this.colorHue.toString()}, 80%, 40%, 0.3)`;
        }
        return this.tagColorHighlight;
    }

    private tagColorShadow: string = "";
    public get colorShadow(): string {
        if (this.tagColorShadow === "") {
            this.tagColorShadow = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.2)`;
        }
        return this.tagColorShadow;
    }

    private tagColorNoColor: string = "";
    public get colorNoColor(): string {
        if (this.tagColorNoColor === "") {
            this.tagColorNoColor = `rgba(0, 0, 0, 0.0)`;
        }
        return this.tagColorNoColor;
    }

    private tagColorDark: string = "";
    public get colorDark(): string {
        if (this.tagColorDark === "") {
            this.tagColorDark = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.8)`;
        }
        return this.tagColorDark;
    }

    constructor(name: string, colorHue: number, id: string = "none") {
        this.name = name;
        this.colorHue = colorHue;
        this.id = id;
    }
}
