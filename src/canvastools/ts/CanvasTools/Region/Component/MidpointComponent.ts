import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { RegionComponent } from "./RegionComponent";

/**
 * An abstract visual component to represent a midpoint along a straight line segment.
 */
export abstract class MidpointComponent extends RegionComponent {
  /**
   * Midpoint visual element.
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
    callbacks: IRegionCallbacks,
  ) {
    super(paper, paperRect, regionData, callbacks);
    this.node = paper.g();
    this.node.addClass("midpointLayer");
  }

  /**
   * Helper function to subscribe the clickable element to events.
   */
  protected subscribeToClickEvents() {
    const listeners: EventListeners = [
      {
        event: "click",
        base: this.midpointNode.node,
        listener: (e: MouseEvent) => {
          e.stopPropagation();
          console.log("midpoint component click event", e);
        },
        bypass: false,
      },
    ];

    this.subscribeToEvents(listeners);
  }
}
