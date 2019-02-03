/**
 * Defines an toolbar icon.
 */
export interface IToolbarIcon {
    /**
     * Unique icon `action` identificator.
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
     * The `keycode` to be used for keyboard shortcut.
     */
    keycode: string;

    /**
     * The `width` of the icon.
     */
    width: number;

    /**
     * The `height` of the icon.
     */
    height: number;
}
