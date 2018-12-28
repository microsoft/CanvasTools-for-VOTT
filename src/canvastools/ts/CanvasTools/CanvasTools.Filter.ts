export type FilterFunction = (canvas: HTMLCanvasElement) => Promise<HTMLCanvasElement>;

export function InvertFilter(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const buff = document.createElement("canvas");
    buff.width = canvas.width;
    buff.height = canvas.height;

    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
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
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const buff = document.createElement("canvas");
    buff.width = canvas.width;
    buff.height = canvas.height;

    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = gray;      // red
        data[i + 1] = gray;      // green
        data[i + 2] = gray;      // blue
    }

    buff.getContext("2d").putImageData(imageData, 0, 0);

    return new Promise<HTMLCanvasElement>((resolve, reject) => {
        return resolve(buff);
    });
}

export function BlurDiffFilter(factor: number): FilterFunction {
    // http://blog.ivank.net/fastest-gaussian-blur.html
    function boxesForGauss(sigma: number, n:number): number[]  // standard deviation, number of boxes
    {
        var wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width 
        var wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
        var wu = wl+2;
                    
        var mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
        var m = Math.round(mIdeal);
        // var sigmaActual = Math.sqrt( (m*wl*wl + (n-m)*wu*wu - n)/12 );
                    
        var sizes: number[] = [];  
        for(var i=0; i<n; i++) sizes.push(i<m?wl:wu);
        return sizes;
    }

    function gaussBlur_4 (scl: Uint8ClampedArray, tcl:Uint8ClampedArray, w: number, h: number, r: number) {
        var bxs = boxesForGauss(r, 3);
        boxBlur_4 (scl, tcl, w, h, (bxs[0]-1)/2);
        boxBlur_4 (tcl, scl, w, h, (bxs[1]-1)/2);
        boxBlur_4 (scl, tcl, w, h, (bxs[2]-1)/2);
    }
    function boxBlur_4 (scl: Uint8ClampedArray, tcl: Uint8ClampedArray, w: number, h: number, r: number) {
        for(var i=0; i<scl.length; i++) tcl[i] = scl[i];
        boxBlurH_4(tcl, scl, w, h, r);
        boxBlurT_4(scl, tcl, w, h, r);
    }
    function boxBlurH_4 (scl: Uint8ClampedArray, tcl: Uint8ClampedArray, w: number, h: number, r: number) {
        var iarr = 1 / (r+r+1);
        for(var i=0; i<h; i++) {
            var ti = i*w, li = ti, ri = ti+r;
            var fv = scl[ti], lv = scl[ti+w-1], val = (r+1)*fv;
            for(var j=0; j<r; j++) val += scl[ti+j];
            for(var j=0  ; j<=r ; j++) { val += scl[ri++] - fv       ;   tcl[ti++] = Math.round(val*iarr); }
            for(var j=r+1; j<w-r; j++) { val += scl[ri++] - scl[li++];   tcl[ti++] = Math.round(val*iarr); }
            for(var j=w-r; j<w  ; j++) { val += lv        - scl[li++];   tcl[ti++] = Math.round(val*iarr); }
        }
    }
    function boxBlurT_4 (scl: Uint8ClampedArray, tcl: Uint8ClampedArray, w: number, h: number, r: number) {
        var iarr = 1 / (r+r+1);
        for(var i=0; i<w; i++) {
            var ti = i, li = ti, ri = ti+r*w;
            var fv = scl[ti], lv = scl[ti+w*(h-1)], val = (r+1)*fv;
            for(var j=0; j<r; j++) val += scl[ti+j*w];
            for(var j=0  ; j<=r ; j++) { val += scl[ri] - fv     ;  tcl[ti] = Math.round(val*iarr);  ri+=w; ti+=w; }
            for(var j=r+1; j<h-r; j++) { val += scl[ri] - scl[li];  tcl[ti] = Math.round(val*iarr);  li+=w; ri+=w; ti+=w; }
            for(var j=h-r; j<h  ; j++) { val += lv      - scl[li];  tcl[ti] = Math.round(val*iarr);  li+=w; ti+=w; }
        }
    }
        
    return function (canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;

        const bludData = buff.getContext("2d").createImageData(buff.width, buff.height);
        const idata = imageData.data;
        const bdata = bludData.data;

        let pixelsNumber = canvas.width * canvas.height;
        let dataR = new Uint8ClampedArray(pixelsNumber);
        let dataG = new Uint8ClampedArray(pixelsNumber);
        let dataB = new Uint8ClampedArray(pixelsNumber);
        let dataA = new Uint8ClampedArray(pixelsNumber);

        for (var i = 0; i < pixelsNumber; i++) {
            dataR[i] = idata[4 * i];
            dataG[i] = idata[4 * i + 1];
            dataB[i] = idata[4 * i + 2];
            dataA[i] = idata[4 * i + 3];
        }

        let blurR = new Uint8ClampedArray(pixelsNumber);
        let blurG = new Uint8ClampedArray(pixelsNumber);
        let blurB = new Uint8ClampedArray(pixelsNumber);
        let blurR2 = new Uint8ClampedArray(pixelsNumber);
        let blurG2 = new Uint8ClampedArray(pixelsNumber);
        let blurB2 = new Uint8ClampedArray(pixelsNumber);
        //let blurA = new Uint8ClampedArray(pixelsNumber);

        let halfFactor = factor/2;
        gaussBlur_4(dataR, blurR, buff.width, buff.height, halfFactor);
        gaussBlur_4(dataG, blurG, buff.width, buff.height, halfFactor);
        gaussBlur_4(dataB, blurB, buff.width, buff.height, halfFactor);
        gaussBlur_4(dataR, blurR2, buff.width, buff.height, factor);
        gaussBlur_4(dataG, blurG2, buff.width, buff.height, factor);
        gaussBlur_4(dataB, blurB2, buff.width, buff.height, factor);

        let alphaStep = 127/factor;

        for (var i = 0; i < pixelsNumber; i++) {
            let dr = Math.abs(blurR2[i] - blurR[i]);
            let dg = Math.abs(blurG2[i] - blurG[i]);
            let db = Math.abs(blurB2[i] - blurB[i]);
            let d = 0.2126 * dr + 0.7152 * dg + 0.0722 * db;

            /* let dr = Math.abs(blurR2[i] - idata[4 * i + 0]);
            let dg = Math.abs(blurG2[i] - idata[4 * i + 1]);
            let db = Math.abs(blurB2[i] - idata[4 * i + 2]); */
            //let d = 255 - Math.min(Math.round(Math.max(dr + dg + db - 16, 0)/8) * 16, 255);
            

            /* bdata[4 * i + 0] = d;
            bdata[4 * i + 1] = d;
            bdata[4 * i + 2] = d; */
            bdata[4 * i + 0] = (d < factor) ? Math.round(idata[4 * i + 0] / factor) * factor : idata[4 * i + 0];
            bdata[4 * i + 1] = (d < factor) ? Math.round(idata[4 * i + 1] / factor) * factor : idata[4 * i + 1];
            bdata[4 * i + 2] = (d < factor) ? Math.round(idata[4 * i + 2] / factor) * factor : idata[4 * i + 2];

            /* bdata[4 * i + 0] = (dr >= factor) ? 0 : 255 - Math.round(dr * alphaStep);
            bdata[4 * i + 1] = (dg >= factor) ? 0 : 255 - Math.round(dg * alphaStep);
            bdata[4 * i + 2] = (db >= factor) ? 0 : 255 - Math.round(db * alphaStep); */

            /* bdata[4 * i + 0] = Math.round(idata[4 * i + 0] / 8) * 8;
            bdata[4 * i + 1] = Math.round(idata[4 * i + 1] / 8) * 8;
            bdata[4 * i + 2] = Math.round(idata[4 * i + 2] / 8) * 8; */
            bdata[4 * i + 3] = (d >= factor) ? 255 : Math.round(d * alphaStep);
        }

        buff.getContext("2d").putImageData(bludData, 0, 0);

        return new Promise<HTMLCanvasElement>((resolve, reject) => {
            return resolve(buff);
        });
    }    
}

export function BrightnessFilter(brightness: number): FilterFunction {    
    return function(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>{
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(data[i + 0] + brightness, 255));
            data[i+1] = Math.max(0, Math.min(data[i + 1] + brightness, 255));
            data[i+2] = Math.max(0, Math.min(data[i + 2] + brightness, 255));
        }

        buff.getContext("2d").putImageData(imageData, 0, 0);

        return new Promise<HTMLCanvasElement>((resolve, reject) => {
            return resolve(buff);
        });
    }   
}

export function ContrastFilter(contrast: number): FilterFunction {    
    return function(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>{
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;

        const data = imageData.data;
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
            data[i] = factor * (data[i] - 128) + 128;
            data[i+1] = factor * (data[i+1] - 128) + 128;
            data[i+2] = factor * (data[i+2] - 128) + 128;
        }

        buff.getContext("2d").putImageData(imageData, 0, 0);

        return new Promise<HTMLCanvasElement>((resolve, reject) => {
            return resolve(buff);
        });
    }   
}

export function SaturationFilter(saturation: number): FilterFunction {
    return function(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement>{
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;

        let s = saturation / 255;
        
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i + 0];
            let g = data[i + 1];
            let b = data[i + 2];
            let gr = 0.213  * r + 0.715 * g + 0.072 * b;
            let nr = gr + s * (+ 0.787 * r - 0.715 * g - 0.072 * b);
            let ng = gr + s * (- 0.213 * r + 0.285 * g - 0.072 * b);
            let nb = gr + s * (- 0.213 * r - 0.715 * g + 0.928 * b);

            data[i] =  Math.round(nr);     // red
            data[i + 1] =  Math.round(ng);     // green
            data[i + 2] =  Math.round(nb);      // blue
        }

        buff.getContext("2d").putImageData(imageData, 0, 0);

        return new Promise<HTMLCanvasElement>((resolve, reject) => {
            return resolve(buff);
        });
    }
}

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
    private pipeline: FilterFunction[];

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
        });

        if (this.pipeline.length > 0) {
            this.pipeline.forEach((filter) => {
                promise = promise.then(filter);
            });
        }
        return promise;
    }
}
