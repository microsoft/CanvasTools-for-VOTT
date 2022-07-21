import { MaskSelectorMode } from "../../Interface/IMask";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

export class MaskSelector {
    private currentMaskMode: MaskSelectorMode;
    private maskSelectorCallbacks: ISelectorCallbacks;
    constructor(defaultMode: MaskSelectorMode, callbacks: ISelectorCallbacks) {
        this.currentMaskMode = defaultMode;
        this.maskSelectorCallbacks = callbacks;
    }

    public enableMode(mode: MaskSelectorMode): void {
        this.currentMaskMode = mode;
        this.maskSelectorCallbacks.onMaskSelection(true, mode);
    }

    public disable(): void {
        this.maskSelectorCallbacks.onMaskSelection(false);
    }
}