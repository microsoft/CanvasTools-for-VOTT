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

export interface ZoomProperties {
    isZoomEnabled: boolean;
    zoomType: ZoomType;
}

/**
 * x and y are coordinates of cursor position on the image relative to zoomed/scaled image
 */
export interface CursorPosition {
    x: number;
    y: number;
}

/**
 * Enum indicating zoom behavior
 */
export enum ZoomDirection {
    In,
    Out,
}

/**
 * This indicates the point around which an image will be zoomed in our out.
 */
export enum ZoomType {
    // This will zoom in/out based on browser default behavior
    Default,

    // This will zoom in/out based on the actual center point of image
    ImageCenter,

    // This will zoom in/out based on the center of the portion of image currently visible
    // or view port of editor container
    ViewportCenter,

    // This will zoom in/out based on the position of the cursor on the image
    CursorCenter
}

/**
 * The manager for zoom functionality.
 */
export class ZoomManager {
    /**
     * [Gets] The boolean flag that indicates if zoom settings needs to be reset when new content is loaded to canvas.
     */
    public get resetZoomOnContentLoad(): boolean {
        return this.shouldResetZoomOnContentLoad;
    }

    /**
     * [Sets] The boolean flag that indicates if zoom settings needs to be reset when new content is loaded to canvas.
     */
    public set resetZoomOnContentLoad(reset: boolean) {
        this.shouldResetZoomOnContentLoad = reset;
        if (reset) {
            this.previousZoomScale = this.currentZoomScale = 1;
        }
    }
;

    /**
     * Gets the singleton instance of Zoom Manager.
     * @param isZoomEnabled - Flag that indicates if zoom is enabled.
     * @param zoomCallbacks - [Optional] The collection of zoom callbacks.
     * @param maxZoom - [Optional] Maximum  zoom factor.
     * @param zoomScale - [Optional] Incremental/Decremental zoom factor.
     */
    public static getInstance(
        isZoomEnabled = false,
        editorContainerDiv?: HTMLDivElement,
        zoomCallbacks?: IZoomCallbacks,
        maxZoom?: number,
        zoomScale?: number,
    ) {
        if (!ZoomManager.instance) {
            ZoomManager.instance = new ZoomManager(isZoomEnabled, editorContainerDiv,
                zoomCallbacks, maxZoom, zoomScale);
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
     * This indicates the point around which an image will be zoomed in our out.
     */
    public zoomType: ZoomType;

    /**
     * The collection of zoom callbacks.
     */
    public callbacks: IZoomCallbacks;

    public isDraggingEnabled: boolean;

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
    private zoomScale: number = 0.1;

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
    private shouldResetZoomOnContentLoad: boolean;

    private zoomCanvas: HTMLDivElement;

    private pos = { top: 0, left: 0, x: 0, y: 0 };

    private constructor(isZoomEnabled = false, zoomCanvas: HTMLDivElement,
            zoomCallbacks?: IZoomCallbacks, maxZoom?: number, zoomScale?: number) {
        this.isZoomEnabled = isZoomEnabled;
        this.zoomCanvas = zoomCanvas;
        this.maxZoomScale = maxZoom ? maxZoom : this.maxZoomScale;
        this.zoomScale = zoomScale ? zoomScale : this.zoomScale;
        this.currentZoomScale = this.minZoomScale;
        this.previousZoomScale = this.minZoomScale;
        this.callbacks = zoomCallbacks;
        this.shouldResetZoomOnContentLoad = false;
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
        if (newScale) {
            updatedZoomScale = newScale;
        } else {
            if (zoomType === ZoomDirection.In) {
                updatedZoomScale = this.currentZoomScale + this.zoomScale;
            }
            if (zoomType === ZoomDirection.Out) {
                updatedZoomScale = this.currentZoomScale - this.zoomScale;
            }
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

    /**
     * Helper function to subscribe manager to drag events
     */
    public setDragging(activate: boolean) {
        this.isDraggingEnabled = activate;
        if (activate) {
            document.getElementById('svgCanvas').style.cursor = 'grab';
            // mouse down should be handled in the zoom canvas
            this.zoomCanvas.addEventListener('mousemove', this.mouseMoveHandler);
            // the scope of mouse move and up will be the window
            window.addEventListener('mousedown', this.mouseDownHandler);
            window.addEventListener('mouseup', this.mouseUpHandler);
        } else {
            document.getElementById('svgCanvas').style.cursor = 'var(--cursor-pointer)';
            // remove the mouse-down notion
            this.zoomCanvas.style.removeProperty('user-select');
            this.zoomCanvas.removeEventListener('mousemove', this.mouseMoveHandler);
            window.removeEventListener('mousedown', this.mouseDownHandler);
            window.removeEventListener('mouseup', this.mouseUpHandler);
        }
    }

    private mouseDownHandler = (e: MouseEvent) => {
        if (this.zoomCanvas) {
            document.getElementById('svgCanvas').style.cursor = 'grabbing';
            this.zoomCanvas.style.userSelect = 'none';

            this.pos = {
                left: this.zoomCanvas.scrollLeft,
                top: this.zoomCanvas.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };
        }
    };

    private mouseUpHandler = () => {
        if (this.zoomCanvas) {
            document.getElementById('svgCanvas').style.cursor = 'grab';
            this.zoomCanvas.style.removeProperty('user-select');
        }
    }

    private mouseMoveHandler = (e: MouseEvent) => {
        if (this.zoomCanvas && this.zoomCanvas.style.getPropertyValue('user-select')){
            // How far the mouse has been moved
            const dx = e.clientX - this.pos.x;
            const dy = e.clientY - this.pos.y;

            // Scroll the element
            this.zoomCanvas.scrollTop = this.pos.top - dy;
            this.zoomCanvas.scrollLeft = this.pos.left - dx;
        }
    };
}
