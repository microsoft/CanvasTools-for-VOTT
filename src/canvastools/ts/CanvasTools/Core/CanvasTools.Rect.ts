import { IResizable } from "./../Interface/IResizable";

export class Rect implements IResizable {
    private rectWidth: number;
    private rectHeight: number;

    public get width(): number {
        return this.rectWidth;
    }

    public get height(): number {
        return this.rectHeight;
    }

    constructor(width: number, height: number) {
        this.rectWidth = 0;
        this.rectHeight = 0;
        this.resize(width, height);
    }

    public resize(width: number, height: number): void {
        if (width >= 0 && height >= 0) {
            this.rectWidth = width;
            this.rectHeight = height;
        }
    }

    public copy(): Rect {
        return new Rect(this.rectWidth, this.rectHeight);
    }

    public toString(): string {
        return `[${this.width.toString()}, ${this.height.toString()}]`;
    }
}
