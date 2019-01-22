import { Point2D } from "../Core/Point2D";
import { TimelineData } from "../Core/TimelineData";
import { K } from "handlebars";
import { Rect } from "../Core/Rect";

export class TimelineElement {
    protected static DEFAULT_MARKER_SIZE: number = 5;
    protected static DEFAULT_TIMELINE_PADDING: number = 10;

    public node: Snap.Element;
    public timelineData: TimelineData;

    protected paper: Snap.Paper;
    protected containerWidth: number;
    protected containerHeight: number;
    protected containerX: number;
    protected containerY: number;
    protected width: number;
    protected height: number;
    protected x: number;
    protected y: number;

    protected bgRect: Snap.Element;
    protected timeline: Snap.Element;
    protected marker: Snap.Element;

    constructor(paper: Snap.Paper, width: number, height: number, timelineData: TimelineData) {
        this.paper = paper;
        this.containerX = 0;
        this.containerY = 0;
        this.x = TimelineElement.DEFAULT_TIMELINE_PADDING;
        this.y = 0;
        this.containerWidth = width;
        this.width = width - 2 * TimelineElement.DEFAULT_TIMELINE_PADDING;
        this.containerHeight = height;
        this.height = height;
        this.timelineData = timelineData;

        this.node = this.paper.g();
        this.node.addClass("timelineElement");

        this.bgRect = this.paper.rect(this.x, this.y, this.containerWidth, this.containerHeight);
        this.bgRect.addClass("tlElementBGRect");

        const cy = this.y + this.height / 2;
        const dx = TimelineElement.DEFAULT_TIMELINE_PADDING;
        this.timeline = this.paper.line(this.x, cy, this.x + this.width, cy);
        this.timeline.addClass("tlLine");

        this.marker = this.buildMarker();

        this.node.add(this.bgRect);
        this.node.add(this.timeline);
        this.node.add(this.marker);

        this.redraw();

        this.timelineData.addChangeListener((data) => {
            this.updateMarkerPosition();
        });
    }

    public move(x: number, y: number) {
        this.containerX = x;
        this.containerY = y;
        this.x = x + TimelineElement.DEFAULT_TIMELINE_PADDING;
        this.y = y;
        this.redraw();
    }

    public resize(width: number, height: number) {
        this.containerWidth = width;
        this.width = width - 2 * TimelineElement.DEFAULT_TIMELINE_PADDING;
        this.containerHeight = height;
        this.height = height;
        this.redraw();
    }

    public redraw() {
        window.requestAnimationFrame((e) => {
            this.bgRect.attr({
                x: this.containerX,
                y: this.containerY,
                width: this.containerWidth,
                height: this.containerHeight,
            });

            const cy = this.y + this.height / 2;
            this.timeline.attr({
                x1: this.x,
                y1: cy,
                x2: this.x + this.width,
                y2: cy,
            });

            this.updateMarkerPosition();
        });
    }

    protected getMarkerPosition(): Point2D {
        return new Point2D(this.x + this.width * this.timelineData.progress, this.y + this.height / 2);
    }

    protected buildMarker(): Snap.Element {
        const cp = this.getMarkerPosition();
        const marker = this.paper.circle(cp.x, cp.y, TimelineElement.DEFAULT_MARKER_SIZE);
        marker.addClass("tlMarker");

        let markerCaptured = false;

        marker.node.addEventListener("pointerdown", (e) => {
            marker.node.setPointerCapture(e.pointerId);
            markerCaptured = true;
        });

        marker.node.addEventListener("pointerup", (e) => {
            marker.node.releasePointerCapture(e.pointerId);
            markerCaptured = false;
        });

        marker.node.addEventListener("pointermove", (e) => {
            if (markerCaptured) {
                const cx = e.offsetX - TimelineElement.DEFAULT_TIMELINE_PADDING;
                this.timelineData.progress = (cx) / this.width;
            }
        });

        return marker;
    }

    protected updateMarkerPosition() {
        const cp = this.getMarkerPosition();
        this.marker.attr({
            cx: cp.x,
            cy: cp.y,
        });
    }
}
