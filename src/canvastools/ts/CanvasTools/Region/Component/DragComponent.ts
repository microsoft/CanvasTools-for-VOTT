import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { RegionComponent } from "./RegionComponent";

/**
 * An abstract visual component used internall do allow dragging the whole region.
 */
export abstract class DragComponent extends RegionComponent {
    /**
     * Grouping element for internal drag elements.
     */
    protected dragNode: Snap.Element;

    /**
     * Dragging state of the component.
     */
    protected isDragged: boolean = false;

    /**
     * The coordinates of the origin point on dragging.
     */
    protected dragOrigin: Point2D;

    /**
     * Creates a new `DragComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.node = paper.g();
        this.node.addClass("dragLayer");
    }

    /**
     * Switches the component to the frozen state.
     */
    public freeze() {
        super.freeze();
        this.isDragged = false;
        this.dragOrigin = null;
    }

    /**
     * Helper function to subscribe the draggable element to events.
     */
    protected subscribeToDragEvents() {
        const listeners: EventListeners = [
            {
                event: "pointerenter",
                base: this.dragNode.node,
                listener: (e: PointerEvent) => {
                    if (this.isDragged) {
                        e.stopPropagation();
                    }
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.dragNode.node,
                listener: (e: PointerEvent) => {
                    if (this.isDragged) {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        const rdx = e.clientX - rect.left;
                        const rdy = e.clientY - rect.top;

                        let dx = e.clientX - this.dragOrigin.x;
                        let dy = e.clientY - this.dragOrigin.y;

                        if ((rdx < 0 && dx > 0) || (rdx > this.width && dx < 0)) {
                            dx = 0;
                        }

                        if ((rdy < 0 && dy > 0) || (rdy > this.height && dy < 0)) {
                            dy = 0;
                        }

                        let p = new Point2D(this.x + dx, this.y + dy);

                        if (this.paperRect !== null) {
                            p = p.boundToRect(this.paperRect);
                        }

                        this.dragOrigin = new Point2D(e.clientX, e.clientY);

                        const rd = this.regionData.copy();
                        rd.move(p);
                        this.callbacks.onChange(this, rd, ChangeEventType.MOVING);

                    }
                },
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.dragNode.node,
                listener: (e: PointerEvent) => {
                    // do nothing
                },
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.dragNode.node,
                listener: (e: PointerEvent) => {
                    this.dragNode.node.setPointerCapture(e.pointerId);
                    const multiselection = e.ctrlKey;
                    this.isDragged = true;
                    this.dragOrigin = new Point2D(e.clientX, e.clientY);
                    this.callbacks.onManipulationLockRequest(this);
                    this.callbacks.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN, multiselection);
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.dragNode.node,
                listener:  (e: PointerEvent) => {
                    this.dragNode.node.releasePointerCapture(e.pointerId);
                    const multiselection = e.ctrlKey;
                    if (this.isDragged) {
                        this.callbacks.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND, multiselection);
                        this.isDragged = false;
                        this.dragOrigin = null;
                    }
                    this.callbacks.onManipulationLockRelease(this);
                    this.callbacks.onChange(this, this.regionData.copy(),
                                            ChangeEventType.SELECTIONTOGGLE, multiselection);
                },
                bypass: false,
            },
        ];

        this.subscribeToEvents(listeners);
    }
}
