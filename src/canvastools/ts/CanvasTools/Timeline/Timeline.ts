
export class Timeline {
    private basehost: SVGSVGElement;
    private paper: Snap.Paper;

    constructor(svgHost: SVGSVGElement) {
        this.basehost = svgHost;
        this.paper = Snap(svgHost);
    }
}
