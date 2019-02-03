import { Rect } from "../../Core/Rect";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IHideable } from "../../Interface/IHideadble";
import { IResizable } from "../../Interface/IResizable";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

import { Element } from "../Component/Element";

/**
 * The abstract class to define region selectors.
 */
export abstract class Selector extends Element {
    /**
     * The reference to callbacks collection.
     */
    public callbacks: ISelectorCallbacks;

    /**
     * The flag to define if selector is enabled or disabled.
     */
    protected isEnabled: boolean = true;

    /**
     * Creates new selector.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box for selector.
     * @param callbacks - The collection of callbacks.
     */
    constructor(paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(paper, boundRect);

        if (callbacks !== undefined) {
            this.callbacks = callbacks;
        } else {
            this.callbacks = {
                onLocked: null,
                onSelectionBegin: null,
                onSelectionEnd: null,
                onUnlocked: null,
            };
        }
    }

    /**
     * Enables and shows this selector.
     */
    public enable() {
        if (!this.isEnabled) {
            this.isEnabled = true;
            this.show();
        }
    }

    /**
     * Disables and hides this selector.
     */
    public disable() {
        if (this.isEnabled) {
            this.isEnabled = false;
            this.hide();
        }
    }

    /**
     * Helper function to subscribe collection of elements to specified listeners.
     * @param listeners - The collection of `IEventDescriptor` objects.
     */
    protected subscribeToEvents(listeners: IEventDescriptor[]) {
        listeners.forEach((e) => {
            e.base.addEventListener(e.event, this.enablify(e.listener.bind(this), e.bypass));
        });
    }

    /**
     * Helper function to wrap listener with the enablement flag.
     * @param f - The function to wrap.
     * @param bypass - The `bypass` flag to define whether event should be captured.
     */
    protected enablify(f: (args: PointerEvent | KeyboardEvent) => void, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (this.isEnabled || bypass) {
                f(args);
            }
        };
    }

    /**
     * Shows all the elements in specified array.
     * @param elements - The array of elements to show.
     */
    protected showAll(elements: IHideable[]) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                element.show();
            });
        });
    }

    /**
     * Hides all the elements in specified array.
     * @param elements - The array of elements to hide.
     */
    protected hideAll(elements: IHideable[]) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                element.hide();
            });
        });
    }

    /**
     * Resizes all the elements to the `boundRect` of this element.
     * @param elemenets - The array of elements to resize.
     */
    protected resizeAll(elements: IResizable[]) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                element.resize(this.boundRect.width, this.boundRect.height);
            });
        });
    }
}
