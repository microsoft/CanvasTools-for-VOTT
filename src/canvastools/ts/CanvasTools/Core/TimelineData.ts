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

    public get current(): number {
        return this.currentTime;
    }

    public set current(currentTime: number) {
        this.currentTime = Math.max(Math.min(this.endTime, currentTime), this.beginTime);
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

    constructor(beginTime: number, endTime: number, frameRate: number);
    constructor(beginTime: number, endTime: number, frameRate: number, zeroTime?: number);
    constructor(beginTime: number, endTime: number, frameRate: number, zeroTime?: number) {
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.frameRate = frameRate;
        this.currentTime = beginTime;
        this.zeroTime = zeroTime;
    }

    public shift(beginTime: number, endTime: number) {
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.current = this.currentTime;
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
}
