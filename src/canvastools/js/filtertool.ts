export namespace CanvasTools.Filter {

    export type FilterFunction = (canvas: HTMLCanvasElement) => Promise<HTMLCanvasElement>;

    export function InvertFilter(canvas: HTMLCanvasElement):Promise<HTMLCanvasElement> {
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        var buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;

        var data = imageData.data;
        for(var i=0;i<data.length;i+=4)
        {
            data[i]     = 255 - data[i];     // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }

        buff.getContext("2d").putImageData(imageData, 0, 0);

        return new Promise<HTMLCanvasElement>((resolve, reject) => {
            return buff;
        });
    }


    export class FilterPipeline {
        private pipeline: Array<FilterFunction>;

        constructor() {
            this.pipeline = new Array<FilterFunction>();
        }

        public addFilter(filter: FilterFunction) {
            this.pipeline.push(filter);
        }

        public clearPipeline() {
            this.pipeline = new Array<FilterFunction>();
        }

        public applyToCanvas(canvas: HTMLCanvasElement):Promise<HTMLCanvasElement> {
            let promise = new Promise<HTMLCanvasElement>((resolve, reject) => {
                return canvas;
            })

            if (this.pipeline.length > 0) {
                this.pipeline.forEach((filter) => {
                    promise =  promise.then(filter);
                })                                               
            }
            return promise;
        }
    }
} 