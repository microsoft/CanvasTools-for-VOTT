export interface IResizable {
    width: number;
    height: number;
    resize(width: number, height: number): void;
}
