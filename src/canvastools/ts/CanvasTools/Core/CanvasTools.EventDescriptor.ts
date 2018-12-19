export interface IEventDescriptor {
    event: string;
    listener: (e: PointerEvent | MouseEvent | KeyboardEvent | WheelEvent) => void;
    base: SVGSVGElement | HTMLElement | Window;
    bypass: boolean;
}