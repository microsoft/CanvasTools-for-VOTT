import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { EventListeners } from "../../Interface/IEventDescriptor";
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
   * Zero-based index of active midpoint.
   */
  protected activeMidpointIndex: number | undefined; 

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
    const regionMidpoints = this.regionData.getLineMidpoints();
    this.buildMidpoints(regionMidpoints);
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

  protected buildMidpoints(regionMidpoints: Point2D[]) {
    this.teardownMidpoints();
    regionMidpoints.forEach((point, index) => {
      const midpoint = this.createMidpoint(this.paper, point.x, point.y);
      this.midpointElements.push(midpoint);
      this.midpointNode.add(midpoint);
      this.subscribeMidpointToEvents(midpoint, index);
    });
  }

  public redraw() {
    const regionMidpoints = this.regionData.getLineMidpoints();
    if (this.midpointElements.length !== regionMidpoints.length) {
      // if # of midpoints has changed, rebuild them
      window.requestAnimationFrame(() => {
        this.buildMidpoints(regionMidpoints);
      });
    } else {
      // update midpoints in place
      window.requestAnimationFrame(() => {
          regionMidpoints.forEach((p, index) => {
              this.midpointElements[index].attr({
                  cx: p.x,
                  cy: p.y,
              });
          });
      });
    }
  }

  /**
   * Add event listeners to a midpoint's DOM node
   */
  protected subscribeMidpointToEvents(midpoint: Snap.Element, index: number) {
    const listeners: EventListeners = [
      {
        event: "pointerenter",
        base: midpoint.node,
        listener: (e: PointerEvent) => {
          e.stopPropagation();
          console.log(`Midpoint entered. Index = ${index}`);
          this.activeMidpointIndex = index;
        },
        bypass: false
      },
      {
        event: "click",
        base: midpoint.node,
        listener: (e: MouseEvent) => {
          e.stopPropagation();
          console.log("Midpoint component clicked", e);
        },
        bypass: false,
      },
    ];
    this.subscribeToEvents(listeners);
  }
}
