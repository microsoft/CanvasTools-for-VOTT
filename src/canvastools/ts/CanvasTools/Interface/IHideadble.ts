/**
 * Defines that an object might be visually hidden or shown.
 */
export interface IHideable {
    /**
     * Make the object hidden
     */
    hide(): void;

    /**
     * Make the object visible
     */
    show(): void;
}
