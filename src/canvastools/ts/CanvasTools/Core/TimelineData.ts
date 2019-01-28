import { TimelineChangeListener } from "./../Interface/ITimelineChangeListener";

export class TimelineData {
    public get begin(): number {
        return this.beginTime;
    }

    public set begin(beginTime: number) {
        this.shift(beginTime, this.endTime);
    }

    public get end(): number {
        return this.endTime;
    }

    public set end(endTime: number) {
        this.shift(this.beginTime, endTime);
    }

    public get duration(): number {
        return this.endTime - this.beginTime;
    }

    public get frameDuration(): number {
        return 1 / this.rate;
    }

    public get current(): number {
        return this.currentTime;
    }

    public set current(currentTime: number) {
        if (currentTime !== this.currentTime) {
            this.currentTime = Math.max(Math.min(this.endTime, currentTime), this.beginTime);
            this.notifyOnChanges();
        }
    }

    public get progress(): number {
        return (this.currentTime - this.beginTime) / (this.endTime - this.beginTime);
    }

    public set progress(progress: number) {
        progress = Math.min(Math.max(progress, 0), 1);
        this.current = this.beginTime + progress * (this.endTime - this.beginTime);
    }

    public get rate(): number {
        return this.frameRate;
    }

    public get frame(): number {
        return this.virtualFrame(this.currentTime);
    }

    public set frame(frame: number) {
        this.current = this.virtualTime(frame);
    }

    public get firstFrame(): number {
        const ctime = (this.zeroTime !== undefined) ? this.beginTime - this.zeroTime : 0;
        return Math.floor(ctime * this.frameRate);
    }

    public get lastFrame(): number {
        const ctime = (this.zeroTime !== undefined) ? this.endTime - this.zeroTime :
                                                      this.endTime - this.beginTime;
        return Math.floor(ctime * this.frameRate);
    }

    private beginTime: number;
    private endTime: number;
    private currentTime: number;

    private zeroTime: number;

    private frameRate: number;

    private changeListeners: TimelineChangeListener[];

    constructor(beginTime: number, endTime: number, frameRate: number);
    constructor(beginTime: number, endTime: number, frameRate: number, zeroTime?: number);
    constructor(beginTime: number, endTime: number, frameRate: number, zeroTime?: number) {
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.frameRate = frameRate;
        this.currentTime = beginTime;
        this.zeroTime = zeroTime;

        this.changeListeners = [];
    }

    public shift(beginTime: number, endTime: number) {
        if (this.beginTime !== beginTime || this.endTime !== endTime) {
            this.beginTime = beginTime;
            this.endTime = endTime;
            this.currentTime = Math.max(Math.min(this.endTime, this.currentTime), this.beginTime);

            this.notifyOnChanges();
        }
    }

    public nextFrame() {
        this.frame = this.frame + 1;
    }

    public prevFrame() {
        this.frame = this.frame - 1;
    }

    public virtualTime(frame: number) {
        const ztime = (this.zeroTime !== undefined) ? this.zeroTime : this.beginTime;
        return ztime + frame / this.frameRate;
    }

    public virtualFrame(time: number) {
        const ctime = (this.zeroTime !== undefined) ? time - this.zeroTime : time - this.beginTime;
        return Math.floor(ctime * this.frameRate);
    }

    public addChangeListener(listener: TimelineChangeListener) {
        const exists: boolean = this.changeListeners.indexOf(listener) >= 0;
        if (!exists) {
            this.changeListeners.push(listener);
        }
    }

    public removeChangeListener(listener: TimelineChangeListener) {
        const index: number = this.changeListeners.indexOf(listener);
        if (index >= 0) {
            this.changeListeners.splice(index, 1);
        }
    }

    public copy(): TimelineData {
        const c = new TimelineData(this.beginTime, this.endTime, this.frameRate, this.zeroTime);
        c.currentTime = this.currentTime;

        return c;
    }

    private notifyOnChanges() {
        this.changeListeners.forEach((listener) => {
            listener(this.copy());
        });
    }
}
