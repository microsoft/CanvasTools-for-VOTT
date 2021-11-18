import { ConfigurationManager } from "../../Core/ConfigurationManager";
import { CubicBezierControl } from "../../Core/CubicBezierControl";
import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { EventListeners } from "../../Interface/IEventDescriptor";
import { ILineSegment } from "../../Interface/ILineSegment";
import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { AnchorsComponent } from "../Component/AnchorsComponent";

enum GhostAnchorAction {
    Add = "add",
    Delete = "delete",
    None = "",
}

function bezierController<T extends { new(...args: any[]): AnchorsComponent }>(constructor: T) {
    const DEFAULT_RADIUS = 6;
    return class extends constructor {
        /**
         * The array of bezier control point elements.
         */
        private controlPoints: Snap.Element[];

        /**
         * Bezier control ghost anchor
         */
        private controlGhostAnchor: Snap.Element;

        private activeControlPointId?: { index: number, name: "c1" | "c2" };

        constructor(...args: any[]) {
            super(...args);
            this.controlPoints = [];
        }

        /**
         * Helper function to create a bezier control point.
         * @param paper - The `Snap.Paper` object to draw on.
         * @param x - The `x`-coordinate of the anchor.
         * @param y - The `y`-coordinate of the anchor.
         * @param r - The radius of the anchor.
         */
        protected createControlPoint(paper: Snap.Paper, x: number, y: number,
            r: number = DEFAULT_RADIUS): Snap.Element {
            const point = paper.circle(x, y, r);
            point.addClass("bezierControlPointStyle");
            return point;
        }

        /**
         * Helper function to create a bezier control point tangent line.
         * @param paper - The `Snap.Paper` object to draw on.
         * @param polylinePoints - Points to draw line on
         */
         protected createControlPointTangent(paper: Snap.Paper, polylinePoints: number[]): Snap.Element {
            const line = paper.polyline(polylinePoints);
            line.addClass("bezierControlPointTangentStyle");
            return line;
        }

        /**
         * Create Snap elements for control point and control point tangent line, in a group.
         * @param index - Index of line segment/control data
         * @param line - Line segment
         * @param control - Bezier control
         * @param pointName - `"c1" | "c2"` The point name id of the bezier control
         * @returns Group containing the control point element and its tangent line.
         */
        private createControlPointGroup(index: number, line: ILineSegment, control: CubicBezierControl, pointName: "c1" | "c2"): Snap.Paper {
            const g = this.paper.g();
            const pointBase = pointName === "c1" ? line.start : line.end;
            const controlPoint = control[pointName]; 
            const controlPointElem = this.createControlPoint(this.paper, controlPoint.x, controlPoint.y);
            const controlPointTangentElem = this.createControlPointTangent(this.paper, [pointBase.x, pointBase.y, controlPoint.x, controlPoint.y]);
            g.add(controlPointTangentElem);
            g.add(controlPointElem);
            this.subscribeControlPointToEvents(controlPointElem, index, pointName);
            return g;
        }

        /**
         * Creates SnapSVG UI of control points of each bezier control.
         */
        protected buildControlPoints() {
            const lineSegments = this.regionData.getLineSegments();
            this.regionData.bezierControls.forEach((control, index) => {
                const line = lineSegments[index];
                const c1Group = this.createControlPointGroup(index, line, control, "c1");
                this.anchorsNode.add(c1Group);
                const c2Group = this.createControlPointGroup(index, line, control, "c2");
                this.anchorsNode.add(c2Group);
                this.controlPoints.push(c1Group, c2Group);
            });
        }

        protected buildAnchors() {
            super.buildAnchors();
            this.buildControlPoints();

            this.controlGhostAnchor = this.createAnchor(this.paper, 0, 0, "ghost", AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS);
            this.controlGhostAnchor.attr({
                display: "none",
            });

            this.node.add(this.controlGhostAnchor);
            this.subscribeControlGhostToEvents(this.controlGhostAnchor);

        }

        protected updateControlPoints() {
            this.controlPoints.forEach((cp) => {
                cp.remove();
            });
            this.controlPoints = [];
            this.buildControlPoints();
        }

        protected subscribeControlPointToEvents(controlPoint: Snap.Element, index: number, controlPointName: "c1" | "c2") {
            this.subscribeToEvents([
                {
                    event: "pointerenter",
                    base: controlPoint.node,
                    listener: () => {
                        // Set drag origin point to current anchor
                        this.activeControlPointId = { index, name: controlPointName };
                        const controlPoint = this.getActiveControlPoint();
                        if (controlPoint) {
                            // Move ghost anchor to current anchor position
                            window.requestAnimationFrame(() => {
                                this.controlGhostAnchor.attr({
                                    cx: controlPoint.x,
                                    cy: controlPoint.y,
                                    display: "block",
                                });
                            });
                        }
                    },
                    bypass: false,
                },
            ]);
        }

        protected subscribeControlGhostToEvents(controlGhostAnchor: Snap.Element) {
            const listeners: EventListeners = [
                {
                    event: "pointerleave",
                    base: controlGhostAnchor.node,
                    listener: (e: PointerEvent) => {
                        if (!this.isDragged) {
                            window.requestAnimationFrame(() => {
                                this.controlGhostAnchor.attr({
                                    display: "none",
                                });
                            });
                            this.activeControlPointId = undefined;
                        }
                    },
                    bypass: true
                },
                {
                    event: "pointermove",
                    base: controlGhostAnchor.node,
                    listener: (e: PointerEvent) => {
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

                            if (this.activeControlPointId) {
                                const controlPoint = this.getActiveControlPoint();
                                let p = new Point2D(controlPoint.x + dx, controlPoint.y + dy);

                                if (this.paperRect !== null) {
                                    p = p.boundToRect(this.paperRect);
                                }
                                window.requestAnimationFrame(() => {
                                    this.controlGhostAnchor.attr({ cx: p.x, cy: p.y });
                                });

                                this.updateRegion(p);
                            }

                            this.dragOrigin = new Point2D(offsetX, offsetY);
                        }
                    },
                    bypass: false,
                },
                {
                    event: "pointerdown",
                    base: controlGhostAnchor.node,
                    listener: (e: PointerEvent) => {
                        console.log("control ghost pointer down");
                        this.controlGhostAnchor.node.setPointerCapture(e.pointerId);
                        const offsetX = e.clientX - (e.target as Element).closest("svg").getBoundingClientRect().left;
                        const offsetY = e.clientY - (e.target as Element).closest("svg").getBoundingClientRect().top;
                        this.dragOrigin = new Point2D(offsetX, offsetY);

                        this.isDragged = true;
                        this.callbacks.onManipulationLockRequest(this);
                        this.callbacks.onChange(this, this.regionData.copy(), ChangeEventType.MOVEBEGIN);
                    },
                    bypass: false,
                },
                {
                    event: "pointerup",
                    base: controlGhostAnchor.node,
                    listener: (e: PointerEvent) => {
                        this.controlGhostAnchor.node.releasePointerCapture(e.pointerId);
                        this.callbacks.onManipulationLockRelease(this);
                        this.callbacks.onChange(this, this.regionData.copy(), ChangeEventType.MOVEEND);
                        this.activeControlPointId = undefined;
                        this.dragOrigin = null;
                        this.isDragged = false;
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                display: "none",
                            });
                        });
                    },
                    bypass: false,
                },
            ];

            this.subscribeToEvents(listeners);
        }

        protected getActiveControlPoint(): Point2D | null {
            if (this.activeControlPointId) {
                return this.regionData.bezierControls[this.activeControlPointId.index][this.activeControlPointId.name];
            } else {
                return null;
            }
        }

        protected updateRegion(p: Point2D) {
            if (this.activeAnchorIndex > 0 && this.activeAnchorIndex <= this.regionData.points.length) {
                const rd = this.regionData.copy();
                rd.setPoint(p, this.activeAnchorIndex - 1);
                this.callbacks.onChange(this, rd, ChangeEventType.MOVING);
            } else if (this.activeControlPointId) {
                const rd = this.regionData.copy();
                if (this.activeControlPointId) {
                    const control = rd.bezierControls[this.activeControlPointId.index];
                    if (control) {
                        control[this.activeControlPointId.name].move(p);
                        rd.setBezierControl(this.activeControlPointId.index, control);
                    }
                }
                this.callbacks.onChange(this, rd, ChangeEventType.MOVING);
            }
        }

        public redraw() {
            super.redraw();
            this.updateControlPoints();
        }
    };
}

/**
 * `AnchorsComponent` for the `PolygonRegion` class.
 */
@bezierController
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
            this.updateAnchorLines();
        }
    }

    /**
     * Creates a collection on anchors.
     */
    protected buildAnchors() {
        this.buildAnchorLines();
        super.buildAnchors();
    }

    private getAnchorPolylinePointData(): number[] {
        const pointsData: number[] = [];
        this.regionData.getLineSegments().forEach((line, idx) => {
            if (this.regionData.bezierControls[idx]) {
                return;
            }
            pointsData.push(line.start.x, line.start.y, line.end.x, line.end.y);
        });
        return pointsData;
    }

    /**
     * Creates polyline between anchor points.
     */
    protected buildAnchorLines() {
        const pointsData = this.getAnchorPolylinePointData();
        this.anchorsPolyline = this.paper.polyline(pointsData);
        this.anchorsPolyline.addClass("anchorLineStyle");
        this.subscribeLineToEvents(this.anchorsPolyline);
        this.anchorsNode.add(this.anchorsPolyline);
    }

    /**
     * Updates polyline between anchor points.
     */
    protected updateAnchorLines() {
        const pointsData = this.getAnchorPolylinePointData();
        this.anchorsPolyline.attr({
            points: pointsData.toString(),
        });
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
     * Updated the `regionData` based on the new ghost anchor location.
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
