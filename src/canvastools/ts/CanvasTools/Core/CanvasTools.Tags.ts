export class Tag {
    public colorHue: number;
    public name: string;
    public id: string;

    private __colorPure: string = "";
    public get colorPure(): string {
        if (this.__colorPure == "") {
            this.__colorPure = `hsl(${this.colorHue.toString()}, 100%, 50%)`;
        }
        return this.__colorPure;
    }

    private __colorAccent: string = "";
    public get colorAccent(): string {
        if (this.__colorAccent == "") {
            this.__colorAccent = `hsla(${this.colorHue.toString()}, 100%, 50%, 0.5)`;
        }
        return this.__colorAccent;
    }

    private __colorHighlight: string = "";
    public get colorHighlight(): string {
        if (this.__colorHighlight == "") {
            this.__colorHighlight = `hsla(${this.colorHue.toString()}, 80%, 40%, 0.3)`;
        }
        return this.__colorHighlight;
    }

    private __colorShadow: string = "";
    public get colorShadow(): string {
        if (this.__colorShadow == "") {
            this.__colorShadow = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.2)`;
        }
        return this.__colorShadow;
    }

    private __colorNoColor: string = "";
    public get colorNoColor(): string {
        if (this.__colorNoColor == "") {
            this.__colorNoColor = `rgba(0, 0, 0, 0.0)`;
        }
        return this.__colorNoColor;
    }

    private __colorDark: string = "";
    public get colorDark(): string {
        if (this.__colorDark == "") {
            this.__colorDark = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.8)`;
        }
        return this.__colorDark;
    }

    constructor(name: string, colorHue: number, id: string = "none") {
        this.name = name;
        this.colorHue = colorHue;
        this.id = id;
    }

    static getHueFromColor(color: string): number {
        var r = parseInt(color.substring(1, 3), 16) / 255;
        var g = parseInt(color.substring(3, 5), 16) / 255;
        var b = parseInt(color.substring(5, 7), 16) / 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
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
}

export class TagsDescriptor {
    public primary: Tag;
    public secondary: Array<Tag>;

    constructor(primaryTag: Tag, secondaryTags: Array<Tag> = []) {
        this.primary = primaryTag;
        this.secondary = secondaryTags;
    }

    public toString(): string {
        let str = this.primary.name;

        this.secondary.forEach((tag) => {
            str += " " + tag.name;
        })

        return str;
    }
}