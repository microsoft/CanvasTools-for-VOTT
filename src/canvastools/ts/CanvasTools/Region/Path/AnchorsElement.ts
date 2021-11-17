import { ConfigurationManager } from "../../Core/ConfigurationManager";
import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { AnchorsComponent } from "../Component/AnchorsComponent";

enum GhostAnchorAction {
    Add = "add",
    Delete = "delete",
    None = "",
}

/**
 * `AnchorsComponent` for the `PolygonRegion` class.
 */
export class AnchorsElement extends AnchorsComponent {
    /**
     * Default threshold distance to define whether ctrl-pointer click is on point or line.
     */
    public static ANCHOR_POINT_LINE_SWITCH_THRESHOLD: number = 5;

    /**
     * The simplest polygon is a triangle, which has three points
     */
    public static MIN_NUMBERS_OF_POINTS_PER_POLYGON = 3;

    /**
     * The state of the current anchor action
     */
    private ghostAnchorActionState: GhostAnchorAction = GhostAnchorAction.None;

    private set ghostAnchorAction(newValue: GhostAnchorAction) {
        this.ghostAnchor.removeClass("add");
        this.ghostAnchor.removeClass("delete");
        this.ghostAnchor.addClass(newValue);
        this.ghostAnchorActionState = newValue;
    }

    private get ghostAnchorAction() {
        return this.ghostAnchorActionState;
    }

    /**
     * Current number of anchors.
     */
    private anchorsLength: number;

    /**
     * Reference to the polyline object, used to trigger adding/deleting points.
     */
    private anchorsPolyline: Snap.Element;

    /**
     * Creates a new `AnchorsElement` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.anchorsLength = regionData.points.length;
    }

    /**
     * Redraws the component.
     */
    public redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
            const points = this.regionData.points;
            // rebuild anchors
            if (this.anchorsLength !== points.length) {
                window.requestAnimationFrame(() => {
                    this.anchors.forEach((anchor) => {
                        anchor.remove();
                    });
                    this.anchors = [];
                    this.buildPointAnchors();
                });

                this.anchorsLength = points.length;
            } else {
                window.requestAnimationFrame(() => {
                    this.regionData.points.forEach((p, index) => {
                        this.anchors[index].attr({
                            cx: p.x,
                            cy: p.y,
                        });
                    });
                });
            }

            const pointsData = [];
            this.regionData.points.forEach((p) => {
                pointsData.push(p.x, p.y);
            });
            pointsData.push(this.regionData.points[0].x, this.regionData.points[0].y);

            this.anchorsPolyline.attr({
                points: pointsData.toString(),
            });
        }
    }

    /**
     * Creates a collection on anchors.
     */
    protected buildAnchors() {
        this.buildPolygonAnchors();
        super.buildAnchors();
    }

    /**
     * Creates a collection of anchor points.
     */
    protected buildPolygonAnchors() {
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        pointsData.push(this.regionData.points[0].x, this.regionData.points[0].y);

        this.anchorsPolyline = this.paper.polyline(pointsData);
        this.anchorsPolyline.addClass("anchorLineStyle");
        this.subscribeLineToEvents(this.anchorsPolyline);

        this.anchorsNode.add(this.anchorsPolyline);
    }

    /**
     * Subscribe an anchor to events.
     * @param anchor - The anchor to wire up with events.
     */
    protected subscribeLineToEvents(anchor: Snap.Element) {
        this.subscribeToEvents([
            {
                base: anchor.node,
                event: "pointermove",
                listener: (e: PointerEvent) => {
                    if (this.isModifyRegionOnlyModeEnabled(e)) {
                        this.activeAnchorIndex = -1;
                        const anchorPoint = this.getActiveAnchorPoint(e);
                        this.dragOrigin = anchorPoint;
                        this.ghostAnchorAction = GhostAnchorAction.Add;
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                cx: anchorPoint.x,
                                cy: anchorPoint.y,
                                display: "block",
                            });
                        });
                    } else {
                        this.ghostAnchorAction = GhostAnchorAction.None;
                    }
                },
                bypass: false,
            },
        ]);
    }

    /**
     * Updated the `regionData` based on the new ghost anchor location. Should be redefined in child classes.
     * @param p - The new ghost anchor location.
     */
    protected updateRegion(p: Point2D) {
        const rd = this.regionData.copy();
        if (this.activeAnchorIndex > 0 && this.activeAnchorIndex <= this.regionData.points.length) {
            rd.setPoint(p, this.activeAnchorIndex - 1);
        }

        this.callbacks.onChange(this, rd, ChangeEventType.MOVING);
    }

    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerEnter(e: PointerEvent) {
        if (this.isModifyRegionOnlyModeEnabled(e)) {
            if (this.regionData.points.length <= AnchorsElement.MIN_NUMBERS_OF_POINTS_PER_POLYGON) {
                this.ghostAnchorAction = GhostAnchorAction.Delete;
            }
        } else {
            this.ghostAnchorAction = GhostAnchorAction.None;
        }

        super.onGhostPointerEnter(e);
    }

    /**
     * Callback for the pointermove event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerMove(e: PointerEvent) {
        if (this.isModifyRegionOnlyModeEnabled(e) && this.activeAnchorIndex !== 0) {
            const p = this.getActiveAnchorPoint(e);
            let dist: number = Number.MAX_VALUE;
            let index: number = -1;
            this.regionData.points.forEach((point, i) => {
                const d = p.squareDistanceToPoint(point);
                if (d < dist) {
                    dist = d;
                    index = i;
                }
            });

            const swapToDelete: boolean = dist < AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD;

            if (this.activeAnchorIndex <= 0 && !swapToDelete) {
                this.ghostAnchorAction = GhostAnchorAction.Add;
                this.activeAnchorIndex = -1;
            } else if (this.regionData.points.length > AnchorsElement.MIN_NUMBERS_OF_POINTS_PER_POLYGON
                       && swapToDelete) {
                this.activeAnchorIndex = index + 1;
                this.ghostAnchorAction = GhostAnchorAction.Delete;
            }
        } else {
            this.ghostAnchorAction = GhostAnchorAction.None;
        }

        super.onGhostPointerMove(e);
    }

    /**
     * Callback for the pointerup event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerUp(e: PointerEvent) {
        const rd = this.regionData.copy();
        if (this.ghostAnchorAction === GhostAnchorAction.Delete) {
            if (this.activeAnchorIndex > 0 && this.activeAnchorIndex <= this.regionData.points.length) {
                rd.splicePoints(this.activeAnchorIndex - 1, 1);
            }
            this.ghostAnchorAction = GhostAnchorAction.None;
            this.callbacks.onChange(this, rd, ChangeEventType.MOVEEND);
        } else if (this.ghostAnchorAction === GhostAnchorAction.Add) {
            const offsetX = e.clientX - (e.target as Element).closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - (e.target as Element).closest("svg").getBoundingClientRect().top;
            const point = new Point2D(offsetX, offsetY);
            const points = rd.points;

            // Find the nearest segment of polyline
            let index = 0;
            let distance = Number.MAX_VALUE;

            for (let i = 0; i < points.length; i++) {
                let d: number;
                if (i < points.length - 1) {
                    d = this.dragOrigin.squareDistanceToLine(points[i], points[i + 1]);
                } else {
                    d = this.dragOrigin.squareDistanceToLine(points[i], points[0]);
                }

                if (d < distance) {
                    index = i;
                    distance = d;
                }
            }

            rd.splicePoints(index + 1, 0, point);

            this.ghostAnchorAction = GhostAnchorAction.Delete;
            this.callbacks.onChange(this, rd, ChangeEventType.MOVEEND);
        }

        super.onGhostPointerUp(e);
    }

    /**
     * Returns `Point2D` with coordinates of active anchor
     */
    protected getActiveAnchorPoint(e: PointerEvent): Point2D {
        if (this.activeAnchorIndex > 0) {
            return this.regionData.points[this.activeAnchorIndex - 1];
        } else if (this.activeAnchorIndex < 0) {
            const offsetX = e.clientX - (e.target as Element).closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - (e.target as Element).closest("svg").getBoundingClientRect().top;
            return new Point2D(offsetX, offsetY);
        } else {
            return null;
        }
    }

    private isModifyRegionOnlyModeEnabled(event?: PointerEvent): boolean {
        return ConfigurationManager.isModifyRegionOnlyMode || event?.ctrlKey;
    }
}
