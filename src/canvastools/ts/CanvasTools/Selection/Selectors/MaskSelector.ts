import { LayerManager } from "../../Core/LayerManager";
import { MaskSelectorMode } from "../../Interface/IMask";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

export class MaskSelector {
    private currentMaskMode: MaskSelectorMode;
    private enabled: boolean;
    private maskSelectorCallbacks: ISelectorCallbacks;
    constructor(defaultMode: MaskSelectorMode, callbacks: ISelectorCallbacks) {
        this.currentMaskMode = defaultMode;
        this.maskSelectorCallbacks = callbacks;
    }

    public enableMode(mode: MaskSelectorMode): void {
        this.currentMaskMode = mode;
        this.maskSelectorCallbacks.onMaskSelection(true, mode);
        if (!this.enabled) {
            LayerManager.getInstance().increaseCurrentLayerNumber();
        }
        this.enabled = true;
        
    }

    public disable(): void {
        this.maskSelectorCallbacks.onMaskSelection(false);
        if (this.enabled) {
            LayerManager.getInstance().increaseCurrentLayerNumber();
        }
        this.enabled = false;
    }
}