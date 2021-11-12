import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { RegionComponent } from "./RegionComponent";

/**
 * An abstract visual component used internall to draw anchor points that allow
 * region points moving and this component resizing.
 */
export abstract class AnchorsComponent extends RegionComponent {
    /**
     * Default radius for anchor poitns. Can be redefined through CSS styles.
     */
    public static DEFAULT_ANCHOR_RADIUS = 3;

    /**
     * Defailt radius for the ghost anchor, used activate dragging. Can be redefined through CSS styles.
     */
    public static DEFAULT_GHOST_ANCHOR_RADIUS = 7;

    /**
     * The array of anchors.
     */
    protected anchors: Snap.Element[];

    /**
     * The grouping element for anchors.
     */
    protected anchorsNode: Snap.Element;

    /**
     * The ghost anchor.
     */
    protected ghostAnchor: Snap.Element;

    /**
     * The index of currently active anchor.
     * 0 - none
     * 1, 2, ... - one of point anchors
     * -1, -2, ... - one of bone anchors
     */
    protected activeAnchorIndex: number = 0;

    /**
     * The coordinates of the origin point on dragging.
     */
    protected dragOrigin: Point2D;

    /**
     * Dragging state of the component.
     */
    protected isDragged: boolean = false;

    /**
     * Creates a new `AnchorsComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.node = this.paper.g();
        this.node.addClass("anchorsLayer");
        this.anchors = [];
        this.anchorsNode = this.paper.g();
        this.node.add(this.anchorsNode);

        this.buildAnchors();
    }

    /**
     * Redraws the visual on the component.
     */
    public redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
            window.requestAnimationFrame(() => {
                this.regionData.points.forEach((p, index) => {
                    this.anchors[index].attr({
                        cx: p.x,
                        cy: p.y,
                    });
                });
            });
        }
    }

    /**
     * Switches the component to the frozen state.
     */
    public freeze() {
        super.freeze();
    }

    /**
     * Creates a collection on anchors.
     */
    protected buildAnchors() {
        this.buildPointAnchors();
        this.buildGhostAnchor();

        this.subscribeToEvents([
            {
                event: "pointerleave",
                base: this.node.node,
                listener: (e: PointerEvent) => {
                    if (!this.isDragged) {
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                display: "none",
                            });
                        });
                    }
                },
                bypass: true,
            },
        ]);
    }

    /**
     * Creates a collection of anchor points.
     */
    protected buildPointAnchors() {
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);

            this.subscribeAnchorToEvents(anchor, index + 1);
        });
    }

    /**
     * Creates the ghost anchor.
     */
    protected buildGhostAnchor() {
        this.ghostAnchor = this.createAnchor(this.paper, 0, 0, "ghost", AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS);
        this.ghostAnchor.attr({
            display: "none",
        });

        this.node.add(this.ghostAnchor);
        this.subscribeGhostToEvents();
    }

    /**
     * Helper function to subscribe anchor to activation event.
     * @param anchor - The anchor for wire up.
     * @param index - The index of the anchor used to define which one is active.
     */
    protected subscribeAnchorToEvents(anchor: Snap.Element, index: number) {
        this.subscribeToEvents([
            {
                event: "pointerenter",
                base: anchor.node,
                listener: (e: PointerEvent) => {
                    // Set drag origin point to current anchor
                    this.activeAnchorIndex = index;
                    const anchorPoint = this.getActiveAnchorPoint(e);
                    // Move ghost anchor to current anchor position
                    window.requestAnimationFrame(() => {
                        this.ghostAnchor.attr({
                            cx: anchorPoint.x,
                            cy: anchorPoint.y,
                            display: "block",
                        });
                    });
                },
                bypass: false,
            },
        ]);
    }

    /**
     * Helper function to create a new anchor.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param x - The `x`-coordinate of the acnhor.
     * @param y - The `y`-coordinate of the anchor.
     * @param style - Additional css style class to be applied.
     * @param r - The radius of the anchor.
     */
    protected createAnchor(paper: Snap.Paper, x: number, y: number, style?: string,
                           r: number = AnchorsComponent.DEFAULT_ANCHOR_RADIUS): Snap.Element {
        const a = paper.circle(x, y, r);
        a.addClass("anchorStyle");
        if (style !== undefined && style !== "") {
            a.addClass(style);
        }
        return a;
    }

    /**
     * Updated the `regionData` based on the new ghost anchor location. Should be redefined in child classes.
     * @param p - The new ghost anchor location.
     */
    protected abstract updateRegion(p: Point2D);

    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerEnter(e: PointerEvent) {
        // do nothing
    }

    /**
     * Callback for the pointerleave event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerLeave(e: PointerEvent) {
        if (!this.isDragged) {
            window.requestAnimationFrame(() => {
                this.ghostAnchor.attr({
                    display: "none",
                });
            });
            this.activeAnchorIndex = 0;
        }
    }

    /**
     * Callback for the pointerdown event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerDown(e: PointerEvent) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);
        const offsetX = e.clientX - (e.target as Element).closest("svg").getBoundingClientRect().left;
        const offsetY = e.clientY - (e.target as Element).closest("svg").getBoundingClientRect().top;
        this.dragOrigin = new Point2D(offsetX, offsetY);

        this.isDragged = true;
        this.callbacks.onManipulationLockRequest(this);
        this.callbacks.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN);
    }

    /**
     * Callback for the pointermove event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerMove(e: PointerEvent) {
        if (this.isDragged) {
            const ghost = (e.target as HTMLElement).getBoundingClientRect();
            const rdx = e.clientX - ghost.left;
            const rdy = e.clientY - ghost.top;

            const offsetX = e.clientX - (e.target as Element).closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - (e.target as Element).closest("svg").getBoundingClientRect().top;

            let dx = offsetX - this.dragOrigin.x;
            let dy = offsetY - this.dragOrigin.y;

            if ((rdx < 0 && dx > 0) || (rdx > 0 && dx < 0)) {
                dx = 0;
            }

            if ((rdy < 0 && dy > 0) || (rdy > 0 && dy < 0)) {
                dy = 0;
            }

            if (this.activeAnchorIndex !== 0) {
                const anchorPoint = this.getActiveAnchorPoint(e);
                let p = new Point2D(anchorPoint.x + dx, anchorPoint.y + dy);

                if (this.paperRect !== null) {
                    p = p.boundToRect(this.paperRect);
                }
                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({ cx: p.x, cy: p.y });
                });

                this.updateRegion(p);

            }

            this.dragOrigin = new Point2D(offsetX, offsetY);
        }
    }

    /**
     * Callback for the pointerup event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerUp(e: PointerEvent) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        this.callbacks.onManipulationLockRelease(this);
        this.callbacks.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND);
        this.activeAnchorIndex = 0;
        this.dragOrigin = null;
        this.isDragged = false;
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });
    }

    /**
     * Subscribe event listeners on the ghost anchor
     */
    protected subscribeGhostToEvents() {
        const listeners: EventListeners = [
            {
                event: "pointerenter",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerEnter,
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerLeave,
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerDown,
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerUp,
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerMove,
                bypass: false,
            },
        ];

        this.subscribeToEvents(listeners);
    }

    /**
     * Returns `Point2D` with coordinates of active anchor
     */
    protected getActiveAnchorPoint(e?: PointerEvent): Point2D {
        if (this.activeAnchorIndex > 0) {
            return this.regionData.points[this.activeAnchorIndex - 1];
        } else {
            return null;
        }
    }
}
