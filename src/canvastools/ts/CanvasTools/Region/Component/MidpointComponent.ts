import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { ILineSegment } from "../../Interface/ILineSegment";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { RegionComponent } from "./RegionComponent";

/**
 * Component to represent mid-points along line segments in a region.
 */
export abstract class MidpointComponent extends RegionComponent {
  /**
   * Default (visual) radius for midpoints.
   */
  public static DEFAULT_RADIUS: number = 6;

  protected midpointElements: Snap.Element[];

  /**
   * Grouping element for midpoints.
   */
  protected midpointNode: Snap.Element;

  /**
   * Creates a new `MidpointComponent` object.
   * @param paper - The `Snap.Paper` object to draw on.
   * @param paperRect - The parent bounding box for created component.
   * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
   * @param callbacks - The external callbacks collection.
   */
  constructor(
    paper: Snap.Paper,
    paperRect: Rect = null,
    regionData: RegionData,
    callbacks: IRegionCallbacks
  ) {
    super(paper, paperRect, regionData, callbacks);
    this.node = paper.g();
    this.node.addClass("midpointLayer");
    this.midpointElements = [];
    this.midpointNode = this.paper.g();
    this.node.add(this.midpointNode);
    const regionLineSegments = this.regionData.getLineSegments();
    this.buildMidpoints(regionLineSegments);
  }

  /**
   * Helper function to create a new midpoint.
   * @param paper - The `Snap.Paper` object to draw on.
   * @param x - The `x`-coordinate of the midpoint.
   * @param y - The `y`-coordinate of the midpoint.
   * @param style - Additional css style class to be applied.
   * @param r - The radius of the midpoint.
   */
  protected createMidpoint(
    paper: Snap.Paper,
    x: number,
    y: number,
    style?: string,
    r: number = MidpointComponent.DEFAULT_RADIUS
  ): Snap.Element {
    const midpoint = paper.circle(x, y, r);
    midpoint.addClass("midpointStyle");
    if (style !== undefined && style !== "") {
      midpoint.addClass(style);
    }
    return midpoint;
  }

  protected teardownMidpoints() {
    this.midpointElements.forEach(midpointElement => {
      midpointElement.remove();
    });
    this.midpointElements = [];
  }

  protected buildMidpoints(regionLineSegments: ILineSegment[]) {
    this.teardownMidpoints();
    regionLineSegments.forEach((line, index) => {
      if (this.regionData.bezierControls[index]) {
        // only create midpoints for straight lines
        return;
      }
      const midpoint = this.createMidpoint(this.paper, line.pointsAlongLine.half.x, line.pointsAlongLine.half.y);
      this.midpointElements.push(midpoint);
      this.midpointNode.add(midpoint);
      this.subscribeMidpointToEvents(midpoint, index);
    });
  }

  public redraw() {
    const bezierControls = this.regionData.bezierControls;
    const regionLineSegments = this.regionData.getLineSegments();
    const straightLineCount = regionLineSegments.length - bezierControls.length;
    if (this.midpointElements.length !== straightLineCount) {
      // # of straight lines has changed, rebuild midpoints
      window.requestAnimationFrame(() => {
        this.buildMidpoints(regionLineSegments);
      });
    } else {
      // update midpoints in place
      window.requestAnimationFrame(() => {
          regionLineSegments.forEach((line, index) => {
              this.midpointElements[index].attr({
                  cx: line.pointsAlongLine.half.x,
                  cy: line.pointsAlongLine.half.y,
              });
          });
      });
    }
  }

  /**
   * Add event listeners to a midpoint's DOM node
   */
   protected abstract subscribeMidpointToEvents(midpoint: Snap.Element, index: number): void;
}
