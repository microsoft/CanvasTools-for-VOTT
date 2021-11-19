import { CubicBezierControl } from "../../Core/CubicBezierControl";
import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { IAnchorMixin } from "../../Interface/IAnchorMixin";
import { EventListeners } from "../../Interface/IEventDescriptor";
import { ILineSegment } from "../../Interface/ILineSegment";
import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { AnchorsComponent } from "../Component/AnchorsComponent";

const DEFAULT_RADIUS = 6;
export class BezierController implements IAnchorMixin {
    private anchorComponent: AnchorsComponent;
    private paper: Snap.Paper;
    private paperRect: Rect;
    private regionData: RegionData;
    private anchorsNode: Snap.Element;
    private callbacks: IRegionCallbacks;
    /**
     * The array of bezier control point elements.
     */
    private controlPoints: Snap.Element[];

    /**
     * Bezier control ghost anchor
     */
    private controlGhostAnchor: Snap.Element;

    private activeControlPointId?: { index: number, name: "c1" | "c2" };

    private createAnchor: (paper: Snap.Paper, x: number, y: number, style?: string,
        r?: number) => Snap.Element;

    private subscribeToEvents: (listeners: EventListeners) => void;

    private dragOrigin?: Point2D;
    private isDragged: boolean;

    constructor(
        anchorComponent: AnchorsComponent,
        paper: Snap.Paper,
        paperRect: Rect,
        regionData: RegionData,
        anchorsNode: Snap.Element,
        callbacks: IRegionCallbacks,
        createAnchor: (paper: Snap.Paper, x: number, y: number, style?: string, r?: number) => Snap.Element,
        subscribeToEvents: (listeners: EventListeners) => void
    ) {
        this.anchorComponent = anchorComponent;
        this.paper = paper;
        this.paperRect = paperRect;
        this.regionData = regionData;
        this.anchorsNode = anchorsNode;
        this.callbacks = callbacks;
        this.createAnchor = createAnchor;
        this.subscribeToEvents = subscribeToEvents;
        this.isDragged = false;
        this.controlPoints = [];
    }

    /**
     * Helper function to create a bezier control point.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param x - The `x`-coordinate of the anchor.
     * @param y - The `y`-coordinate of the anchor.
     * @param r - The radius of the anchor.
     */
    private createControlPoint(paper: Snap.Paper, x: number, y: number,
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
    private createControlPointTangent(paper: Snap.Paper, polylinePoints: number[]): Snap.Element {
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
    private buildControlPoints() {
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

    public buildAnchors() {
        this.buildControlPoints();

        this.controlGhostAnchor = this.createAnchor(this.paper, 0, 0, "ghost", AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS);
        this.controlGhostAnchor.attr({
            display: "none",
        });

        this.anchorComponent.node.add(this.controlGhostAnchor);
        this.subscribeControlGhostToEvents(this.controlGhostAnchor);

    }

    private updateControlPoints() {
        this.controlPoints.forEach((cp) => {
            cp.remove();
        });
        this.controlPoints = [];
        this.buildControlPoints();
    }

    private subscribeControlPointToEvents(controlPoint: Snap.Element, index: number, controlPointName: "c1" | "c2") {
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

    private subscribeControlGhostToEvents(controlGhostAnchor: Snap.Element) {
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
                    this.controlGhostAnchor.node.setPointerCapture(e.pointerId);
                    const offsetX = e.clientX - (e.target as Element).closest("svg").getBoundingClientRect().left;
                    const offsetY = e.clientY - (e.target as Element).closest("svg").getBoundingClientRect().top;
                    this.dragOrigin = new Point2D(offsetX, offsetY);

                    this.isDragged = true;
                    this.callbacks.onManipulationLockRequest(this.anchorComponent);
                    this.callbacks.onChange(this.anchorComponent, this.regionData.copy(), ChangeEventType.MOVEBEGIN);
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: controlGhostAnchor.node,
                listener: (e: PointerEvent) => {
                    this.controlGhostAnchor.node.releasePointerCapture(e.pointerId);
                    this.callbacks.onManipulationLockRelease(this.anchorComponent);
                    this.callbacks.onChange(this.anchorComponent, this.regionData.copy(), ChangeEventType.MOVEEND);
                    this.activeControlPointId = undefined;
                    this.dragOrigin = null;
                    this.isDragged = false;
                    window.requestAnimationFrame(() => {
                        this.controlGhostAnchor.attr({
                            display: "none",
                        });
                    });
                },
                bypass: false,
            },
        ];

        this.subscribeToEvents(listeners);
    }

    private getActiveControlPoint(): Point2D | null {
        if (this.activeControlPointId) {
            return this.regionData.bezierControls[this.activeControlPointId.index][this.activeControlPointId.name];
        } else {
            return null;
        }
    }

    private updateRegion(p: Point2D) {
        if (this.activeControlPointId) {
            const rd = this.regionData.copy();
            if (this.activeControlPointId) {
                const control = rd.bezierControls[this.activeControlPointId.index];
                if (control) {
                    control[this.activeControlPointId.name].move(p);
                    rd.setBezierControl(this.activeControlPointId.index, control);
                }
            }
            this.callbacks.onChange(this.anchorComponent, rd, ChangeEventType.MOVING);
        }
    }

    public redraw() {
        this.updateControlPoints();
    }
};