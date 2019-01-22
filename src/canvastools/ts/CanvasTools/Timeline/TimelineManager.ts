
import { TimelineElement } from "./TimelineElement";
import { TimelineRangeElement } from "./TimelineRangeElement";
import { TimelineData } from "../Core/TimelineData";

export class TimelineManager {
    private static SVGDefsTemplate: string = `
        <defs>
            <filter id="black-glow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.8" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>`;

    private static DEFAULT_TIMELINE_HEIGHT: number = 30;

    private timelineDiv: HTMLDivElement;
    private svgHost: SVGSVGElement;
    private paper: Snap.Paper;
    private width: number;
    private height: number;
    private responsiveTimelineHeight: boolean;

    private node: Snap.Element;

    private timelines: TimelineElement[];

    constructor(containerDiv: HTMLDivElement, responsiveTimelineHeight: boolean = false) {
        this.timelineDiv = containerDiv;
        this.timelineDiv.classList.add("CanvasToolsTimeline");

        this.responsiveTimelineHeight = responsiveTimelineHeight;

        this.svgHost = this.createSVGElement();
        this.timelineDiv.appendChild(this.svgHost);
        this.paper = Snap(this.svgHost);

        this.node = this.paper.g();
        this.node.addClass("timelineManager");

        this.timelineDiv.addEventListener("resize", (e) => {
            this.resize(this.timelineDiv.offsetWidth, this.timelineDiv.offsetHeight);
        });
        this.width = this.timelineDiv.offsetWidth;
        this.height = this.timelineDiv.offsetHeight;

        this.timelines = new Array<TimelineElement>();
        this.resize(this.width, this.height);
    }

    public addTimeline(timeline: TimelineData) {
        const tlH = (this.responsiveTimelineHeight) ? this.height / (this.timelines.length + 1) :
                                                      TimelineManager.DEFAULT_TIMELINE_HEIGHT;

        const tlElement = new TimelineElement(this.paper, this.width, tlH, timeline);
        this.node.add(tlElement.node);
        this.timelines.push(tlElement);

        this.redraw();
    }

    public addTimelineRange(timeline: TimelineData): TimelineData {
        const tlH = (this.responsiveTimelineHeight) ? this.height / (this.timelines.length + 1) :
                                                      TimelineManager.DEFAULT_TIMELINE_HEIGHT;

        const tlElement = new TimelineRangeElement(this.paper, this.width, tlH, timeline);
        this.node.add(tlElement.node);
        this.timelines.push(tlElement);

        this.redraw();

        return tlElement.range;
    }

    public redraw() {
        const tlH = (this.responsiveTimelineHeight) ? this.height / (this.timelines.length) :
                                                      TimelineManager.DEFAULT_TIMELINE_HEIGHT;

        this.timelines.forEach((tlElement, index) => {
            tlElement.resize(this.width, tlH);
            tlElement.move(0, tlH * index);
        });
    }

    public updateMarkers() {
        this.timelines.forEach((tlElement) => {
            tlElement.redraw();
        });
    }

    private createSVGElement(): SVGSVGElement {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.innerHTML = TimelineManager.SVGDefsTemplate;
        return svg;
    }

    private resize(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.redraw();
    }
}
