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
    private enabled: boolean;

    constructor(callbacks: ISelectorCallbacks) {
        this.maskSelectorCallbacks = callbacks;
    }
    /**
     * This selection enables the mask selection mode and increases layer number by 1
     * if mask selection was disabled earlier
     * @param mode the selection mode. either brush or eraser
     */
    public enableMode(mode: MaskSelectorMode): void {
        this.maskSelectorCallbacks.onMaskSelection(true, mode);
        this.enabled = true;
    }

    /**
     * This selection disables the mask selection mode and increases layer number by 1
     * if mask selection was enabled earlier
     */
    public disable(): void {
        this.maskSelectorCallbacks.onMaskSelection(false);
        this.enabled = false;
    }
}