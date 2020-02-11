import { IZoomCallbacks } from "../Interface/IZoomCallbacks";

/**
 * represents zoom meta data
 */
export type ZoomData = {
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
    Out
}

/**
 * The manager for zoom functionality.
 */
export class ZoomManager {
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
     * boolean that states if the zoom needs to be reset on content update. Defaults to false.
     */
    private _resetZoomOnContentLoad: boolean;

     /**
     * This holds the current instance of zoomManager.
     */
    private static instance: ZoomManager;

    private constructor(isZoomEnabled = false, zoomCallbacks?: IZoomCallbacks, maxZoom?: number, zoomScale?: number) {
        this.isZoomEnabled = isZoomEnabled;
        this.maxZoomScale = maxZoom ? maxZoom : this.maxZoomScale;
        this.zoomScale = zoomScale ? zoomScale : this.zoomScale;
        this.currentZoomScale = this.minZoomScale;
        this.callbacks = zoomCallbacks;
        this._resetZoomOnContentLoad = false;
    }

    public get resetZoomOnContentLoad(): boolean {
        return this._resetZoomOnContentLoad;
    }

    public set resetZoomOnContentLoad(reset: boolean) {
        this._resetZoomOnContentLoad = reset;
    }

    public static getInstance(isZoomEnabled = false, zoomCallbacks?: IZoomCallbacks, maxZoom?: number, zoomScale?: number) {
        if (!ZoomManager.instance) {
            ZoomManager.instance = new ZoomManager(isZoomEnabled, zoomCallbacks, maxZoom, zoomScale);
          }
          return ZoomManager.instance;
    }

    public updateZoomScale(zoomType: ZoomDirection): ZoomData {
        let zoomData = this.getZoomData();

        let updatedZoomScale;
        if (zoomType == ZoomDirection.In) {
            updatedZoomScale = this.currentZoomScale + this.zoomScale;
        }

        if (zoomType == ZoomDirection.Out) {
            updatedZoomScale = this.currentZoomScale - this.zoomScale;
        }

        if (updatedZoomScale >= this.minZoomScale && updatedZoomScale <= this.maxZoomScale) {
            this.currentZoomScale = updatedZoomScale;
            zoomData.currentZoomScale = updatedZoomScale;
            return zoomData;
        }
    }

    public setMaxZoomScale(maxZoomScale: number): void {
        this.maxZoomScale = maxZoomScale;
    }

    public setZoomScale(zoomScale: number): void {
        this.zoomScale = zoomScale;
    }

    public getCurrentZoomScale(): number {
        return this.currentZoomScale;
    }

    public getZoomData(): ZoomData {
        let zoomData = {
            minZoomScale: this.minZoomScale,
            maxZoomScale: this.maxZoomScale,
            currentZoomScale: this.currentZoomScale,
            previousZoomScale: this.currentZoomScale
        };

        return zoomData;
    }
}