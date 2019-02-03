/**
 * Represents an event with its listener and settings
 * @remarks Used as an array type to specify a collection of listeners that should
 * added to each of the elements in another array.
 */
export interface IEventDescriptor {
    /**
     * Event name used in the `addEventListener` method
     */
    event: string;

    /**
     * Event listener passed to the `addEventListener` method
     * @param e - Event object of specified type
     */
    listener: (e: PointerEvent | MouseEvent | KeyboardEvent | WheelEvent) => void;

    /**
     * Event broadcaster on which event listener should be subscribed
     */
     base: SVGSVGElement | HTMLElement | Window;

    /**
     * Event capturing setting passed to the `addEventListener` method
     */
    bypass: boolean;
}
