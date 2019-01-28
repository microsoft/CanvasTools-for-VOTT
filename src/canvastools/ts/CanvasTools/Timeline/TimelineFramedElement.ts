import { TimelineElement } from "./TimelineElement";
import { TimelineData } from "../Core/TimelineData";
import { Point2D } from "../Core/Point2D";

export class TimelineFramedElement extends TimelineElement {
    protected static DEFAULT_FRAME_HEIGHT = TimelineElement.DEFAULT_MARKER_SIZE * 2;
    protected static DEFAULT_FRAME_MIN_WIDTH = TimelineElement.DEFAULT_MARKER_SIZE;

    private frames: Snap.Element[];
    private frameGroup: Snap.Element;

    private frameHeight: number;

    private tlDataCopy: TimelineData;

    constructor(paper: Snap.Paper, width: number, height: number, timelineData: TimelineData) {
        super(paper, width, height, timelineData);
        this.tlDataCopy = timelineData.copy();

        this.frameHeight = Math.min(TimelineFramedElement.DEFAULT_FRAME_HEIGHT +
            TimelineElement.DEFAULT_TIMELINE_PADDING,
            height - TimelineElement.DEFAULT_TIMELINE_PADDING);

        this.frameGroup = this.paper.g();
        this.frameGroup.addClass("tlFrameGroup");
        this.frameGroup.insertBefore(this.marker);

        this.timelineData.addChangeListener((data) => {
            const rebuild = (this.tlDataCopy.begin !== data.begin || this.tlDataCopy.end !== data.end);
            this.redraw(rebuild);
        });
    }

    public redraw(rebuildFrames: boolean = true) {
        super.redraw();
        if (rebuildFrames) {
            this.clearFramesUI();
            this.buildFramesUI();
            this.tlDataCopy = this.timelineData.copy();
        }
    }

    public resize(width, height) {
        this.frameHeight = Math.min(TimelineFramedElement.DEFAULT_FRAME_HEIGHT +
            TimelineElement.DEFAULT_TIMELINE_PADDING,
            height - TimelineElement.DEFAULT_TIMELINE_PADDING);

        super.resize(width, height);
    }

    protected getMarkerPosition(): Point2D {
        const firstFrame: number = this.timelineData.firstFrame;
        const lastFrame: number = this.timelineData.lastFrame;

        const dx = this.width / (lastFrame - firstFrame);
        let cx: number;

        if (dx >= TimelineFramedElement.DEFAULT_FRAME_MIN_WIDTH) {
            const bt = this.timelineData.virtualTime(firstFrame) - this.timelineData.begin;
            // shift first frame position
            cx = this.x + this.width * bt / this.timelineData.duration +
                 dx * (this.timelineData.frame - firstFrame + 0.5);
        } else {
            cx = this.x + this.width * this.timelineData.progress;
        }

        return new Point2D(cx, this.y + this.height / 2);
    }

    private buildFramesUI() {
        const firstFrame: number = this.timelineData.firstFrame;
        const lastFrame: number = this.timelineData.lastFrame;

        const dx = this.width / (lastFrame - firstFrame);
        const ty = this.y + this.height / 2 - this.frameHeight / 2;

        const bt = this.timelineData.virtualTime(firstFrame) - this.timelineData.begin;
        let bx = this.x + this.width * bt / this.timelineData.duration;

        if (dx >= TimelineFramedElement.DEFAULT_FRAME_MIN_WIDTH) {
            for (let i = firstFrame; i <= lastFrame; i++, bx += dx) {
                const b = Math.max(this.x, Math.min(this.x + this.width, bx + 1));
                const e = Math.max(this.x, Math.min(this.x + this.width, bx + dx - 1));

                const frameEl = this.paper.rect(b, ty, e - b, this.frameHeight);
                frameEl.addClass("tlFrame");

                this.frameGroup.add(frameEl);
                this.frames.push(frameEl);
            }
        }
    }

    private clearFramesUI() {
        if (this.frames !== null && this.frames !== undefined) {
            this.frames.map((frame) => {
                frame.remove();
            });
            this.frames = new Array<Snap.Element>();
        }
        this.frames = new Array<Snap.Element>();
    }
}
