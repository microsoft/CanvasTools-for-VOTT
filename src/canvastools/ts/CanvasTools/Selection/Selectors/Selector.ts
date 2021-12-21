import { Rect } from "../../Core/Rect";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { IHideable } from "../../Interface/IHideadble";
import { IResizable } from "../../Interface/IResizable";
import { ISelectorCallbacks } from "../../Interface/ISelectorCallbacks";

import { IPoint2D } from "../../Interface/IPoint2D";
import { CrossElement } from "../Component/CrossElement";
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
     * The reference to hosting SVG element.
     */
    protected parentNode: SVGSVGElement;

    /**
     * Creates new selector.
     * @param parent - The parent (host) SVG-element.
     * @param paper - The `Snap.Paper` element to draw on.
     * @param boundRect - The bounding box for selector.
     * @param callbacks - The collection of callbacks.
     */
    constructor(parent: SVGSVGElement, paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(paper, boundRect);
        this.parentNode = parent;

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
     * Resets any in progress shape
     */
    public abstract reset(): void;

    /**
     * Enables and shows this selector.
     */
    public enable(): void {
        if (!this.isEnabled) {
            this.isEnabled = true;
            this.show();
        }
    }

    /**
     * Disables and hides this selector.
     */
    public disable(): void {
        if (this.isEnabled) {
            this.isEnabled = false;
            this.hide();
        }
    }

    /**
     * Helper function to subscribe collection of elements to specified listeners.
     * @param listeners - The collection of `IEventDescriptor` objects.
     */
    protected subscribeToEvents(listeners: EventListeners) {
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
    protected showAll(elements: Array<IHideable|Snap.Element>) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                if ((element as IHideable).show !== undefined) {
                    (element as IHideable).show();
                } else {
                    (element as Snap.Element).node.setAttribute("visibility", "visible");
                }
            });
        });
    }

    /**
     * Hides all the elements in specified array.
     * @param elements - The array of elements to hide.
     */
    protected hideAll(elements: Array<IHideable|Snap.Element>) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                if ((element as IHideable).hide !== undefined) {
                    (element as IHideable).hide();
                } else {
                    (element as Snap.Element).node.setAttribute("visibility", "hidden");
                }
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

    /**
     * Helper function to move the cross element to specified position.
     * @param cross - The cross element to move.
     * @param pointTo - The new position of the cross element.
     * @param square - The flag that movement should be related to reference point of a square
     */
    protected moveCross(cross: CrossElement, pointTo: IPoint2D, square: boolean = false, ref: IPoint2D = null) {
        cross.move(pointTo, this.boundRect, square, ref);
    }

    /**
     * Helper function to move a point element to specified position
     * @param point - The point element to move.
     * @param pointTo - The new position of the point.
     */
    protected movePoint(point: Snap.Element, pointTo: IPoint2D) {
        point.attr({
            cx: pointTo.x,
            cy: pointTo.y,
        });
    }

    /**
     * Helper function to move a line element to specified begin and end positions
     * @param line - The line element to move.
     * @param pointFrom - The begin point.
     * @param pointTo - The end point.
     */
    protected moveLine(line: Snap.Element, pointFrom: IPoint2D, pointTo: IPoint2D) {
        line.attr({
            x1: pointFrom.x,
            x2: pointTo.x,
            y1: pointFrom.y,
            y2: pointTo.y,
        });
    }
}
