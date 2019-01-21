import { TimelineData } from "./TimelineData";

export class TimelineEventData {
    public get begin(): number {
        return this.beginTime;
    }

    public set begin(beginTime: number) {
        this.beginTime = Math.min(beginTime, this.endTime);
        this.endTime = Math.max(beginTime, this.endTime);
    }

    public get end(): number {
        return this.endTime;
    }

    public set end(endTime: number) {
        this.endTime = Math.max(this.endTime, endTime);
        this.beginTime = Math.min(this.beginTime, endTime);
    }

    private beginTime: number;
    private endTime: number;

    constructor(time: number);
    constructor(begin: number, end: number);
    constructor(begin: number, end?: number) {
        if (end === undefined) {
            this.beginTime = begin;
            this.endTime = end;
        } else {
            this.beginTime = Math.min(begin, end);
            this.endTime = Math.max(begin, end);
        }
    }

    public boundToTimeline(timeline: TimelineData): TimelineEventData {
        const b = Math.max(this.begin, timeline.begin);
        const e = Math.min(this.end, timeline.end);
        return new TimelineEventData(b, e);
    }
}
