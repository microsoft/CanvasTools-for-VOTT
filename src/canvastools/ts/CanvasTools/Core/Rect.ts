import { IResizable } from "../Interface/IResizable";

export class Rect implements IResizable {
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        this.width = 0;
        this.height = 0;
        this.resize(width, height);
    }

    public resize(width: number, height: number): void {
        if (width >= 0 && height >= 0) {
            this.width = width;
            this.height = height;
        }
    }

    public copy(): Rect {
        return new Rect(this.width, this.height);
    }

    public toString(): string {
        return `[${this.width.toString()}, ${this.height.toString()}]`;
    }
}
