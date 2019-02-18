import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
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
     */
    protected activeAnchorIndex: number = -1;

    /**
     * The coordinates of the origin point on dragging.
     */
    protected dragOrigin: Point2D;

    /**
     * Creates a new `AnchorsComponent` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.node = paper.g();
        this.node.addClass("anchorsLayer");
        this.anchors = [];
        this.anchorsNode = paper.g();

        this.buildPointAnchors();

        this.ghostAnchor = this.createAnchor(paper, 0, 0, "ghost", AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS);
        this.ghostAnchor.attr({
            display: "none",
        });

        this.node.add(this.anchorsNode);
        this.node.add(this.ghostAnchor);

        const listeners: IEventDescriptor[] = [
            { event: "pointerenter", listener: this.onGhostPointerEnter, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerleave", listener: this.onGhostPointerLeave, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerdown", listener: this.onGhostPointerDown, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerup", listener: this.onGhostPointerUp, base: this.ghostAnchor.node, bypass: false },
            { event: "pointermove", listener: this.onGhostPointerMove, base: this.ghostAnchor.node, bypass: false },
        ];

        this.subscribeToEvents(listeners);
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
        this.ghostAnchor.undrag();
        this.onManipulationEnd();
    }

    /**
     * Creates collection of anchor points.
     */
    protected buildPointAnchors() {
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);

            this.subscribeAnchorToEvents(anchor, index);
        });
    }

    /**
     * Helper function to subscribe anchor to activation event.
     * @param anchor - The anchor for wire up.
     * @param index - The index of the anchor used to define which one is active.
     */
    protected subscribeAnchorToEvents(anchor: Snap.Element, index: number) {
        anchor.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                // Set drag origin point to current anchor
                this.dragOrigin = this.regionData.points[index];
                this.activeAnchorIndex = index;

                // Move ghost anchor to current anchor position
                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: this.dragOrigin.x,
                        cy: this.dragOrigin.y,
                        display: "block",
                    });
                });
                this.onManipulationBegin();
            }
        });
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
     * Callback for the dragbegin event.
     */
    protected anchorDragBegin() {
        // do nothing
    }

    /**
     * Callback for the dragmove event. Uses `dragOrigin` to calculate new position.
     * @param dx - Diff in the `x`-coordinate.
     * @param dy - Diff in the `y`-coordinate.
     * @param x - New `x`-coordinate.
     * @param y - New `y`-coordinate.
     * @remarks This method calls the `updateRegion` method to actually make any changes in data.
     */
    protected anchorDragMove(dx: number, dy: number, x: number, y: number) {
        let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);

        if (this.paperRect !== null) {
            p = p.boundToRect(this.paperRect);
        }

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({ cx: p.x, cy: p.y });
        });

        this.updateRegion(p);
    }

    /**
     * Callback for the dranend event.
     */
    protected anchorDragEnd() {
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });
        this.activeAnchorIndex = -1;
    }

    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerEnter(e: PointerEvent) {
        this.ghostAnchor.drag(
            this.anchorDragMove.bind(this),
            this.anchorDragBegin.bind(this),
            this.anchorDragEnd.bind(this));

        this.onManipulationBegin();
    }

    /**
     * Callback for the pointerleave event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerLeave(e: PointerEvent) {
        this.ghostAnchor.undrag();

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });

        this.activeAnchorIndex = -1;
        this.onManipulationEnd();
    }

    /**
     * Callback for the pointerdown event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerDown(e: PointerEvent) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);
        this.dragOrigin = new Point2D(e.offsetX, e.offsetY);

        this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN);
    }

    /**
     * Callback for the pointermove event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerMove(e: PointerEvent) {
        // do nothing
    }

    /**
     * Callback for the pointerup event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerUp(e: PointerEvent) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        this.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND);
    }
}
