import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { RegionComponent } from "./RegionComponent";
import { IEventDescriptor } from "../../Interface/IEventDescriptor";

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
        this.dragNode.undrag();
        this.onManipulationEnd();
    }

    /**
     * Callback for the dragbegin event.
     */
    protected onDragBegin() {
        this.dragOrigin = new Point2D(this.x, this.y);
    }

    /**
     * Callback for the dragmove event.
     * @param dx - Diff in the `x`-coordinate of draggable element.
     * @param dy - Diff in the `y`-coordinate of draggable element.
     * @remarks This method directly calls the `onChange` callback wrapper.
     */
    protected onDragMove(dx: number, dy: number) {
        if (dx !== 0 && dy !== 0) {
            let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

            if (this.paperRect !== null) {
                p = p.boundToRect(this.paperRect);
            }

            const rd = this.regionData.copy();
            rd.move(p);
            this.onChange(this, rd, ChangeEventType.MOVING);
        }
    }

    /**
     * Callback for the dragend event.
     */
    protected onDragEnd() {
        this.dragOrigin = null;

        this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND);
    }

    /**
     * Helper function to subscibe the draggable element to events.
     */
    protected subscribeToDragEvents() {
        const listeners: IEventDescriptor[] = [
            {
                event: "pointerenter",
                base: this.dragNode.node,
                listener: (e: PointerEvent) => {
                    this.dragNode.undrag();
                    this.dragNode.drag(this.onDragMove.bind(this),
                                       this.onDragBegin.bind(this),
                                       this.onDragEnd.bind(this));
                    this.isDragged = true;
                    this.onManipulationBegin();
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.dragNode.node,
                listener: (e: PointerEvent) => {
                    if (!this.isDragged) {
                        this.dragNode.undrag();
                        this.dragNode.drag(this.onDragMove.bind(this),
                                           this.onDragBegin.bind(this),
                                           this.onDragEnd.bind(this));
                        this.isDragged = true;
                        this.onManipulationBegin();
                    }
                },
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.dragNode.node,
                listener: (e: PointerEvent) => {
                    this.dragNode.undrag();
                    this.isDragged = false;
                    this.onManipulationEnd();
                },
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.dragNode.node,
                listener: (e: PointerEvent) => {
                    this.dragNode.node.setPointerCapture(e.pointerId);
                    const multiselection = e.ctrlKey;
                    this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN, multiselection);
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.dragNode.node,
                listener:  (e: PointerEvent) => {
                    this.dragNode.node.releasePointerCapture(e.pointerId);
                    const multiselection = e.ctrlKey;
                    this.onChange(this, this.regionData.copy(), ChangeEventType.SELECTIONTOGGLE, multiselection);
                },
                bypass: false,
            },
        ];

        this.subscribeToEvents(listeners);
    }
}
