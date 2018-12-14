export type FilterFunction = (canvas: HTMLCanvasElement) => Promise<HTMLCanvasElement>;

export function InvertFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    var buff = document.createElement("canvas");
    buff.width = canvas.width;
    buff.height = canvas.height;

    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }

    buff.getContext("2d").putImageData(imageData, 0, 0);

    return new Promise<HTMLCanvasElement>((resolve, reject) => {
        return resolve(buff);
    });
}

export function GrayscaleFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    var buff = document.createElement("canvas");
    buff.width = canvas.width;
    buff.height = canvas.height;

    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        let gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = gray;      // red
        data[i + 1] = gray;      // green
        data[i + 2] = gray;      // blue
    }

    buff.getContext("2d").putImageData(imageData, 0, 0);

    return new Promise<HTMLCanvasElement>((resolve, reject) => {
        return resolve(buff);
    });
}

/*     contrastFilter(canvas, contrast) {
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;

        var buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;


        var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for(var i=0;i<data.length;i+=4)
        {
            data[i] = factor * (data[i] - 128) + 128;
            data[i+1] = factor * (data[i+1] - 128) + 128;
            data[i+2] = factor * (data[i+2] - 128) + 128;
        }

        buff.getContext("2d").putImageData(imageData, 0, 0);

        return new Promise((resolve, reject) => {
            resolve(buff);
        });
    }, */

/*     convoluteFilter(canvas, weights, opaque) {
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side/2);
        var src = imageData.data;
        var sw = imageData.width;
        var sh = imageData.height;
        // pad output by the convolution matrix
        var w = sw;
        var h = sh;
        var output = new ImageData(w, h);

        var dst = output.data;
        // go through the destination image pixels
        var alphaFac = opaque ? 1 : 0;
        for (var y=0; y<h; y++) {
            for (var x=0; x<w; x++) {
                var sy = y;
                var sx = x;
                var dstOff = (y*w+x)*4;
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                var r=0, g=0, b=0, a=0;
                for (var cy=0; cy<side; cy++) {
                    for (var cx=0; cx<side; cx++) {
                        var scy = sy + cy - halfSide;
                        var scx = sx + cx - halfSide;
                        if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                            var srcOff = (scy*sw+scx)*4;
                            var wt = weights[cy*side+cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff+1] * wt;
                            b += src[srcOff+2] * wt;
                            a += src[srcOff+3] * wt;
                        }
                    }
                }
                dst[dstOff] = r;
                dst[dstOff+1] = g;
                dst[dstOff+2] = b;
                dst[dstOff+3] = a + alphaFac*(255-a);
            }
        }
        return output;
    } */


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

    public applyToCanvas(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
        let promise = new Promise<HTMLCanvasElement>((resolve, reject) => {
            return resolve(canvas);
        })

        if (this.pipeline.length > 0) {
            this.pipeline.forEach((filter) => {
                promise = promise.then(filter);
            })
        }
        return promise;
    }
}