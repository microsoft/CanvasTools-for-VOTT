import { CubicBezierControl } from "../../Core/CubicBezierControl";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";
import { EventListeners } from "../../Interface/IEventDescriptor";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { MidpointComponent } from "../Component/MidpointComponent";

/**
 * `MidpointComponent` for the `PathRegion` class.
 */
export class MidpointElement extends MidpointComponent {
    /**
     * Creates a new `DragElement`.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
    }

    private createBezierControl(index: number) {
        const rd = this.regionData.copy();
        const line = rd.getLineSegments()[index];
        rd.addBezierControl(index, new CubicBezierControl({ c1: line.pointsAlongLine.oneThird, c2: line.pointsAlongLine.twoThird }))
        this.callbacks.onChange(this, rd);
    }

    /**
   * Add event listeners to a midpoint's DOM node
   */
    protected subscribeMidpointToEvents(midpoint: Snap.Element, index: number) {
        const listeners: EventListeners = [
            {
                event: "click",
                base: midpoint.node,
                listener: (e: MouseEvent) => {
                    e.stopPropagation();
                    this.createBezierControl(index);
                },
                bypass: false,
            },
        ];
        this.subscribeToEvents(listeners);
    }
}
