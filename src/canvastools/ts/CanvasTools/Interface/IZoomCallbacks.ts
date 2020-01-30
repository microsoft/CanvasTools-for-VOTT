export type zoomOutFunction = () => void;
export type zoomInFunction = () => void;
/**
 * Defines a collection of callbacks passed to the `ZoomManager` constructor.
 */
export interface IZoomCallbacks {
    /**
     * The callback to be called on zooming out.
     */
    onZoomingOut: zoomOutFunction;

    /**
     * The callback to be called on zooming in.
     */
    onZoomingIn: zoomInFunction;
}
