export declare type FilterFunction = (canvas: HTMLCanvasElement) => Promise<HTMLCanvasElement>;
export declare function InvertFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
export declare function GrayscaleFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
export declare class FilterPipeline {
    private pipeline;
    constructor();
    addFilter(filter: FilterFunction): void;
    clearPipeline(): void;
    applyToCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>;
}
