import { CubicBezierIndex } from "../../Core/CubicBezierIndex";
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

  /**
   * Midpoint elements mapped to line segment indices.
   */
  protected midpointElements: Record<number, Snap.Element>;

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
    this.midpointElements = {};
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
    Object.values(this.midpointElements).forEach(midpointElement => {
      midpointElement.remove();
    });
    this.midpointElements = {};
  }

  protected buildMidpoints(regionLineSegments: ILineSegment[]) {
    this.teardownMidpoints();
    const bezierControls = this.regionData.bezierControls;
    regionLineSegments.forEach((line, index) => {
      if (bezierControls[index]) {
        // only create midpoints for straight lines
        return;
      }
      const midpoint = this.createMidpoint(this.paper, line.pointsAlongLine.half.x, line.pointsAlongLine.half.y);
      this.midpointElements[index] = midpoint;
      this.midpointNode.add(midpoint);
      this.subscribeMidpointToEvents(midpoint, index);
    });
  }

  private updateMidpoints(bezierControls: CubicBezierIndex, regionLineSegments: ILineSegment[]) {
    const toDelete: number[] = [];
    const toAdd: number[] = [];
    const toUpdate: number[] = [];
    // first check each line segment
    regionLineSegments.forEach((_line, idx) => {
      // this line segment has no bezier control data and doesn't have a midpoint element
      // need to add one
      if (!bezierControls[idx] && !this.midpointElements[idx]) {
        toAdd.push(idx);
      // this line segment has no bezier control data and does have a midpoint element
      // need to update it
      } else if (!bezierControls[idx] && this.midpointElements[idx]) {
        toUpdate.push(idx);
      // this line segment does have bezier control data and does have a midpoint element
      // need to remove it
      } else if (bezierControls[idx] && this.midpointElements[idx]) {
        toDelete.push(idx);
      }
    });
    // next check existing midpoint elements to see if
    // any are mapped to line segment that's been removed
    Object.entries(this.midpointElements).forEach(([idx]) => {
      if (!regionLineSegments[idx]) {
        toDelete.push(Number(idx));
      }
    });
    toDelete.forEach((idx) => {
      this.midpointElements[idx].remove();
      delete this.midpointElements[idx];
    });
    toAdd.forEach((idx) => {
      if (this.midpointElements[idx]) {
        this.midpointElements[idx].remove();
      }
      const midpoint = this.createMidpoint(this.paper, regionLineSegments[idx].pointsAlongLine.half.x, regionLineSegments[idx].pointsAlongLine.half.y);
      this.midpointElements[idx] = midpoint;
      this.midpointNode.add(midpoint);
      this.subscribeMidpointToEvents(midpoint, idx);
    });
    toUpdate.forEach((idx) => {
      const line = regionLineSegments[idx];
      this.midpointElements[idx].attr({
        cx: line.pointsAlongLine.half.x,
        cy: line.pointsAlongLine.half.y,
      });
    });
  }

  public redraw() {
    const bezierControls = this.regionData.bezierControls;
    const regionLineSegments = this.regionData.getLineSegments();
    window.requestAnimationFrame(() => {
      this.updateMidpoints(bezierControls, regionLineSegments);
    });
  };

  /**
   * Add event listeners to a midpoint's DOM node
   */
  protected abstract subscribeMidpointToEvents(midpoint: Snap.Element, index: number): void;
}
