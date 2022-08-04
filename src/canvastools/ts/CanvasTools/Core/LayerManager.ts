/**
 * The manager for layer functionality.
 */
 export class LayerManager {
    /**
     * Gets the singleton instance of layer Manager.
     */
    public static getInstance() {
        if (!LayerManager.instance) {
            LayerManager.instance = new LayerManager();
        }
        return LayerManager.instance;
    }

    /**
     * The current instance of LayerManager.
     */
    private static instance: LayerManager;

    /**
     * This current index of layer.
     */
    private currentLayerNumber: number;

    constructor() {
        this.currentLayerNumber = 1;
    }

    /**
     * Gets the current layer number.
     */
    public getCurrentLayerNumber(): number {
        return this.currentLayerNumber;
    }

    /**
     * Increases current layer number by 1.
     */
    public increaseCurrentLayerNumber(): void {
        this.currentLayerNumber++;
    }

    /**
     * Deletes the single instance of layer manager.
     */
    public deleteInstance(): void {
        if (LayerManager.instance) {
            
            delete LayerManager.instance;
        }
    }
}
