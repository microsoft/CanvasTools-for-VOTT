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
            let pure = `hsla(${this.colorHue.toString()}, 100%, 50%)`;
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

        constructor(name: string, colorHue: number, id: string = "none"){
            this.name = name;
            this.colorHue = colorHue;
            this.id = id;
        }
    }

    export class TagsDescriptor{
        public primary: Tag;
        public secondary: Array<Tag>;
        
        constructor(primary: Tag, ...secondary: Array<Tag>){
            this.primary = primary;
            this.secondary = secondary;
        }
    }
}