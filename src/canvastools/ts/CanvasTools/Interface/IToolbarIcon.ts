/**
 * Defines an toolbar icon.
 */
export interface IToolbarIcon {
    /**
     * Unique icon `action` identifier.
     */
    action: string;

    /**
     * Icon image url.
     */
    iconUrl: string;

    /**
     * The `tooltip` string to be shown on focus/pointer over.
     */
    tooltip: string;

    /**
     * The `width` of the icon.
     */
    width: number;

    /**
     * The `height` of the icon.
     */
    height: number;

    /**
     * The list of `key` to be used for keyboard shortcut.
     */
    key: string[];
}
