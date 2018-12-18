import { IResizable } from "./../Interface/IResizable";

export class Rect implements IResizable {
    private __width: number;
    private __height: number;

    public get width(): number {
        return this.__width;
    }

    public get height(): number {
        return this.__height;
    }
    
    constructor(width: number, height: number) {
        this.__width = 0;
        this.__height = 0;
        this.resize(width, height);
    }

    public resize(width: number, height: number): void {
        if (width > 0 && height >= 0) {
            this.__width = width;
            this.__height = height;
        }
    }

    public copy(): Rect {
        return new Rect(this.__width, this.__height);
    }
}