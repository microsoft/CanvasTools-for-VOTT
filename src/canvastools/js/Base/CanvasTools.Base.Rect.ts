import base = require("@canvastools/base/CanvasTools.Base.Interfaces");
import IBase = base.CanvasTools.Base.Interfaces;

export namespace CanvasTools.Base.Rect {
    export class Rect implements IBase.IRect, IBase.IResizable {
        public width: number;
        public height: number;
        constructor(width: number, height: number){
            this.resize(width, height);
        }
        
        public resize(width: number, height: number):void {
            this.width = width;
            this.height = height;
        }

        public copy(): Rect {
            return new Rect(this.width, this.height);
        }
    }
}