import { TimelineElement } from "./TimelineElement";
import { TimelineData } from "../Core/TimelineData";

export class TimelineRangeElement extends TimelineElement {
    protected static DEFAULT_RANGE_MARKER_HEIGHT = TimelineElement.DEFAULT_MARKER_SIZE * 2;
    protected static DEFAULT_RANGE_MARKER_WIDTH = TimelineElement.DEFAULT_MARKER_SIZE * 1.5;

    public range: TimelineData;

    private rangeGroup: Snap.Element;
    private rangeBeginMarker: Snap.Element;
    private rangeEndMarker: Snap.Element;
    private rangeGhostMarker: Snap.Element;
    private rangeBGRect: Snap.Element;

    private rangeMarkerHeight: number;
    private rangeMarkerWidth: number;
    private activeMarker: "begin" | "end";

    constructor(paper: Snap.Paper, width: number, height: number, timelineData: TimelineData) {
        super(paper, width, height, timelineData);

        this.range = new TimelineData(this.timelineData.begin, this.timelineData.end,
                                      this.timelineData.rate, this.timelineData.begin);

        this.range.addChangeListener((data) => {
            this.updateRangePosition();
        });

        this.rangeMarkerHeight = Math.min(TimelineRangeElement.DEFAULT_RANGE_MARKER_HEIGHT +
                                          TimelineElement.DEFAULT_TIMELINE_PADDING,
                                          height - TimelineElement.DEFAULT_TIMELINE_PADDING);

        this.rangeMarkerWidth = TimelineRangeElement.DEFAULT_RANGE_MARKER_WIDTH;

        this.createRangeUI();
        this.rangeGroup.insertBefore(this.marker);
    }

    public redraw() {
        super.redraw();

        this.updateRangePosition();
    }

    public resize(width: number, height: number) {
        this.rangeMarkerHeight = Math.min(TimelineRangeElement.DEFAULT_RANGE_MARKER_HEIGHT +
            TimelineElement.DEFAULT_TIMELINE_PADDING,
            height - TimelineElement.DEFAULT_TIMELINE_PADDING);

        super.resize(width, height);
    }

    private createRangeUI() {
        this.rangeGroup = this.paper.g();
        this.rangeGroup.addClass("tlRangeGroup");

        this.rangeBGRect = this.paper.rect(0, 0, 0, this.rangeMarkerHeight);
        this.rangeBGRect.addClass("tlRangeBGRect");

        this.rangeBeginMarker = this.createRangeMarker("begin");

        this.rangeEndMarker = this.createRangeMarker("end");

        this.rangeGhostMarker = this.createRangeGhostMarker((progress: number) => {
            progress = Math.max(0, Math.min(1, progress));
            // update range
            let b: number;
            let e: number;
            if (this.activeMarker === "begin") {
                b = this.timelineData.begin + progress * (this.timelineData.duration);
                e = this.range.end;
            } else {
                b = this.range.begin;
                e = this.timelineData.begin + progress * (this.timelineData.duration);
            }

            // swap markers
            if (b >= e) {
                this.activeMarker = (this.activeMarker === "begin") ? "end" : "begin";
            }

            this.range.shift(Math.min(b, e), Math.max(b, e));
        });

        this.rangeGhostMarker.addClass("tlRangeGhostMarker");
        this.rangeGhostMarker.attr({
            visibility: "hidden",
        });

        this.rangeGroup.add(this.rangeBGRect);
        this.rangeGroup.add(this.rangeBeginMarker);
        this.rangeGroup.add(this.rangeEndMarker);
        this.rangeGroup.add(this.rangeGhostMarker);
    }

    private createRangeMarker(activeMarker: "begin" | "end"): Snap.Element {
        const marker = this.paper.rect(0, 0, this.rangeMarkerWidth, this.rangeMarkerHeight);

        marker.addClass("tlRangeMarker");

        marker.node.addEventListener("pointerover", (e) => {
            this.rangeGhostMarker.attr({
                visibility: "visible",
            });
            this.activeMarker = activeMarker;
            this.updateRangePosition();
        });

        return marker;
    }

    private createRangeGhostMarker(onChange: (progress: number) => void): Snap.Element {
        const marker = this.paper.rect(0, 0, this.rangeMarkerWidth, this.rangeMarkerHeight);

        marker.addClass("tlRangeGhostMarker");

        let markerCaptured = false;

        marker.node.addEventListener("pointerdown", (e) => {
            marker.node.setPointerCapture(e.pointerId);
            markerCaptured = true;
        });

        marker.node.addEventListener("pointerup", (e) => {
            marker.node.releasePointerCapture(e.pointerId);
            markerCaptured = false;

            const cx = e.offsetX - TimelineElement.DEFAULT_TIMELINE_PADDING;
            onChange((cx) / this.width);

            this.rangeGhostMarker.attr({
                visibility: "hidden",
            });
        });

        marker.node.addEventListener("pointermove", (e) => {
            if (markerCaptured) {
                const cx = e.offsetX - TimelineElement.DEFAULT_TIMELINE_PADDING;
                onChange((cx) / this.width);
            }
        });

        return marker;
    }

    private updateRangePosition() {
        if (this.rangeGroup !== undefined) {
            const ty = this.y + this.height / 2 - this.rangeMarkerHeight / 2;
            const bx = this.x + this.width * (this.range.begin - this.timelineData.begin) / this.timelineData.duration;
            const ex = this.x + this.width * (this.range.end - this.timelineData.begin) / this.timelineData.duration;

            this.rangeBeginMarker.attr({
                x: bx - this.rangeMarkerWidth / 2,
                y: ty,
                height: this.rangeMarkerHeight,
            });

            this.rangeEndMarker.attr({
                x: ex - this.rangeMarkerWidth / 2,
                y: ty,
                height: this.rangeMarkerHeight,
            });

            this.rangeBGRect.attr({
                x: bx,
                y: ty,
                width: ex - bx,
                height: this.rangeMarkerHeight,
            });

            this.rangeGhostMarker.attr({
                x: (this.activeMarker === "begin") ? bx - this.rangeMarkerWidth / 2 : ex - this.rangeMarkerWidth / 2,
                y: ty,
                height: this.rangeMarkerHeight,
            });
        }
    }
}
