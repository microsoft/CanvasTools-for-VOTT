import { MaskSelectorMode } from "../../Interface/IMask";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

/**
 * The selector for semantic mask region. A brush or an eraser.
 */
export class MaskSelector {
    /**
     * The internal reference to mask selector callbacks.
     */
    private maskSelectorCallbacks: ISelectorCallbacks;

    constructor(callbacks: ISelectorCallbacks) {
        this.maskSelectorCallbacks = callbacks;
    }

    public enableMode(mode: MaskSelectorMode): void {
        this.maskSelectorCallbacks.onMaskSelection(true, mode);
    }

    public disable(): void {
        this.maskSelectorCallbacks.onMaskSelection(false);
    }
}