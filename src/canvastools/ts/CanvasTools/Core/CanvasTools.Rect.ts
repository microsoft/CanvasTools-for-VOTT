import { IResizable } from "./../Interface/IResizable";

export class Rect implements IResizable {
    public width: number;
    public height: number;
    constructor(width: number, height: number) {
        this.resize(width, height);
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public copy(): Rect {
        return new Rect(this.width, this.height);
    }
}