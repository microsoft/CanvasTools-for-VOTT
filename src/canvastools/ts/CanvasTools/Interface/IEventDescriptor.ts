/**
 * Represents an event with its listener and settings
 * @remarks Used as an array type to specify a collection of listeners that should
 * added to each of the elements in another array.
 */
 export interface IEventDescriptor<T extends PointerEvent | MouseEvent | KeyboardEvent | WheelEvent> {
    /**
     * Event name used in the `addEventListener` method
     */
    event: string;

    /**
     * Event listener passed to the `addEventListener` method
     * @param e - Event object of specified type
     */
    listener: (e: T) => void;

    /**
     * Event broadcaster on which event listener should be subscribed
     */
     base: SVGSVGElement | HTMLElement | Window;

    /**
     * Event capturing setting passed to the `addEventListener` method
     */
    bypass: boolean;
}

export interface IMouseEventDescriptor extends IEventDescriptor<MouseEvent> {}
export interface IPointerEventDescriptor extends IEventDescriptor<PointerEvent> {}
export interface IKeyboardEventDescriptor extends IEventDescriptor<KeyboardEvent> {}
export interface IWheelEventDescriptor extends IEventDescriptor<WheelEvent> {}

export type EventListeners = Array<IMouseEventDescriptor | IPointerEventDescriptor | IKeyboardEventDescriptor | IWheelEventDescriptor>;
