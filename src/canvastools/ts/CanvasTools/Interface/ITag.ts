/**
 * Defines an object that can be tagged with specified color hue value, `name` and `id`.
 */
export interface ITag {
    /**
     * The color hue value of the object.
     * @remarks Only hue value is used to automatically generate use pallete of shades.
     */
    colorHue: number;

    /**
     * The `name` of the tag.
     */
    name: string;

    /**
     * The `id` of the tag if it should be unique.
     * @remarks Not used internally, defined for external usage.
     */
    id?: string;
}
