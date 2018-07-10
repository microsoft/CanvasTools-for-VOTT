export namespace CanvasTools.Base {
    export interface IRect {
        width: number;
        height: number;
        copy(): IRect;
    }

    export interface IPoint2D {
        x: number;
        y: number;
        boundToRect(rect: IRect): IPoint2D;
    }

    export interface IHideable {
        hide():void;
        show():void;
    }

    export interface IResizable {
        resize(width:number, height:number):void;
    }

    export interface IMovable {
        x: number;
        y: number;
        move(point: IPoint2D):void;
    }

    export interface IRegionPart extends IHideable, IResizable, IMovable {
        rect: IRect;
    }

    export class Rect implements IRect, IResizable {
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

    export class Point2D implements IPoint2D {
        public x: number;
        public y: number;
        constructor(x: number, y:number) {
            this.x = x;
            this.y = y;
        }

        public boundToRect(r: IRect): Point2D {
            let newp = new Point2D(0, 0);

            newp.x = (this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x);
            newp.y = (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y);

            return newp;
        }
    }

    export class Tag {
        public colorHue: number;
        public name: string;
        public id: string;


        public get colorPure():string {
            let pure = `hsl(${this.colorHue.toString()}, 100%, 50%)`;
            return pure;
        }

        public get colorAccent():string {
            let accent = `hsla(${this.colorHue.toString()}, 100%, 50%, 0.5)`;
            return accent;
        }

        public get colorHighlight():string {
            let highlight = `hsla(${this.colorHue.toString()}, 80%, 40%, 0.3)`;
            return highlight;
        }

        public get colorShadow():string {
            let shadow = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.2)`;
            return shadow;
        }

        public get colorDark():string {
            let shadow = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.8)`;
            return shadow;
        }

        constructor(name: string, colorHue: number, id: string = "none"){
            this.name = name;
            this.colorHue = colorHue;
            this.id = id;
        }

        static getHueFromColor(color: string): number {
            var r = parseInt(color.substring(1,3),16)/255;
            var g = parseInt(color.substring(3,5),16)/255;
            var b = parseInt(color.substring(5,7),16)/255;

            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if(max == min){
                h = s = 0; // achromatic
            }else{
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max){
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            return h;
        }
    }

    export class TagsDescriptor{
        public primary: Tag;
        public secondary: Array<Tag>;
        
        constructor(primaryTag: Tag, secondaryTags: Array<Tag> = []){
            this.primary = primaryTag;
            this.secondary = secondaryTags;
        }
    }
}