import { IZoomCallbacks } from "../Interface/IZoomCallbacks";

/**
 * Represents zoom meta data.
 */
export interface ZoomData {
    minZoomScale: number;
    maxZoomScale: number;
    previousZoomScale: number;
    currentZoomScale: number;
}

/**
 * Enum indicating zoom behavior
 */
export enum ZoomDirection {
    In,
    Out,
}

/**
 * The manager for zoom functionality.
 */
export class ZoomManager {

    /**
     * [Gets] The boolean flag that indicates if zoom settings needs to be reset when new content is loaded to canvas.
     */
    public get resetZoomOnContentLoad(): boolean {
        return this.resetZoomOnContentLoad;
    }

    /**
     * [Sets] The boolean flag that indicates if zoom settings needs to be reset when new content is loaded to canvas.
     */
    public set resetZoomOnContentLoad(reset: boolean) {
        this.resetZoomOnContentLoad = reset;
        if (reset) {
            this.previousZoomScale = this.currentZoomScale = 1;
        }
    }

    /**
     * Gets the singleton instance of Zoom Manager.
     * @param isZoomEnabled - Flag that indicates if zoom is enabled.
     * @param zoomCallbacks - [Optional] The collection of zoom callbacks.
     * @param maxZoom - [Optional] Maximum  zoom factor.
     * @param zoomScale - [Optional] Incremental/Decremental zoom factor.
     */
    public static getInstance(
        isZoomEnabled = false,
        zoomCallbacks?: IZoomCallbacks,
        maxZoom?: number,
        zoomScale?: number,
    ) {
        if (!ZoomManager.instance) {
            ZoomManager.instance = new ZoomManager(isZoomEnabled, zoomCallbacks, maxZoom, zoomScale);
        }
        return ZoomManager.instance;
    }

     /**
      * This holds the current instance of zoomManager.
      */
    private static instance: ZoomManager;
    /**
     * This decides whether zoom is enabled for the project.
     */
    public isZoomEnabled: boolean;

    /**
     * The collection of zoom callbacks.
     */
    public callbacks: IZoomCallbacks;

    /**
     * The minimum zoom factor.
     * Defaults to 1 or 100%.
     */
    private minZoomScale: number = 1;

    /**
     * The maximum zoom factor.
     * Defaults to 4 or 400%.
     */
    private maxZoomScale: number = 4;

    /**
     * The factor or scale at which the zoom in / zoom out works incrementally.
     */
    private zoomScale: number = 0.5;

    /**
     * This holds the current scale at which the image is zoomed at.
     */
    private currentZoomScale: number;

    /**
     * This holds the previous scale at which the image is zoomed at.
     */
    private previousZoomScale: number;

     /**
      * boolean that states if the zoom needs to be reset on content update. Defaults to false.
      */
    private resetZoomOnContentLoad: boolean;

    private constructor(isZoomEnabled = false, zoomCallbacks?: IZoomCallbacks, maxZoom?: number, zoomScale?: number) {
        this.isZoomEnabled = isZoomEnabled;
        this.maxZoomScale = maxZoom ? maxZoom : this.maxZoomScale;
        this.zoomScale = zoomScale ? zoomScale : this.zoomScale;
        this.currentZoomScale = this.minZoomScale;
        this.previousZoomScale = this.minZoomScale;
        this.callbacks = zoomCallbacks;
        this.resetZoomOnContentLoad = false;
    }

    /**
     * Updates the zoom values based on the direction of zoom.
     * @param zoomType - The direction of zoom.
     * @returns - Zoom data object.
     */
    public updateZoomScale(zoomType: ZoomDirection, newScale?: number): ZoomData {
        this.previousZoomScale = this.currentZoomScale;
        const zoomData = this.getZoomData();

        let updatedZoomScale;
        if (newScale !== undefined) {
            updatedZoomScale = newScale;
        } else if (zoomType === ZoomDirection.In) {
            updatedZoomScale = this.currentZoomScale + this.zoomScale;
        } else if (zoomType === ZoomDirection.Out) {
            updatedZoomScale = this.currentZoomScale - this.zoomScale;
        }

        if (updatedZoomScale >= this.minZoomScale && updatedZoomScale <= this.maxZoomScale) {
            this.currentZoomScale = updatedZoomScale;
            zoomData.currentZoomScale = updatedZoomScale;
            return zoomData;
        }
    }

    /**
     * Sets the maximum zoom scale.
     * @param maxZoomScale - The maximum zoom scale.
     */
    public setMaxZoomScale(maxZoomScale: number): void {
        this.maxZoomScale = maxZoomScale;
    }

    /**
     * Sets the zoom scale.
     * @param zoomScale - Zoom factor.
     */
    public setZoomScale(zoomScale: number): void {
        this.zoomScale = zoomScale;
    }

    /**
     * Gets the zoomData object.
     * @returns - Zoom data object.
     */
    public getZoomData(): ZoomData {
        return {
            minZoomScale: this.minZoomScale,
            maxZoomScale: this.maxZoomScale,
            currentZoomScale: this.currentZoomScale,
            previousZoomScale: this.previousZoomScale,
        };
    }

    /**
     * Deletes the single instance of zoom manager.
     */
    public deleteInstance(): void {
        if (ZoomManager.instance) {
            delete ZoomManager.instance;
        }
    }
}
