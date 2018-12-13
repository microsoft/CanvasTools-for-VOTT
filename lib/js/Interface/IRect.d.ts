export interface IRect {
    width: number;
    height: number;
    resize(width: number, height: number): void;
    copy(): IRect;
}
