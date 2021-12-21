import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { EventListeners } from "../../Interface/IEventDescriptor";
import { IFreezable } from "../../Interface/IFreezable";
import { IHideable } from "../../Interface/IHideadble";
import { IMovable } from "../../Interface/IMovable";
import { IPoint2D } from "../../Interface/IPoint2D";
import { IRegionCallbacks } from "../../Interface/IRegionCallbacks";
import { IResizable } from "../../Interface/IResizable";

/**
 * An abstract visual component to define a component of region presentation UI.
 */
export abstract class RegionComponent implements IHideable, IResizable, IMovable, IFreezable {
    /**
     * The `Snap.Element` object of the component to be used in DOM tree composition.
     */
    public node: Snap.Element;
    /**
     * The `RegionData` object describing current region state.
     */
    public regionData: RegionData;

    /**
     * Defines if the component is visible.
     */
    public isVisible: boolean = true;

    /**
     * Defines if the component is in a frozen state.
     */
    public isFrozen: boolean = false;

    /**
     * Defines if the component is selected.
     */
    public isSelected: boolean = false;

    /**
     * Reference to the `Snap.Paper` object to draw on.
     */
    protected paper: Snap.Paper;

    /**
     * Reference to the size of parent host.
     */
    protected paperRect: Rect;

    /**
     * The `x`-coordinate of the component. Defined through the `regionsData`.
     */
    public get x(): number {
        return this.regionData.x;
    }

    /**
     * The `y`-coordinate of the component. Defined through the `regionsData`.
     */
    public get y(): number {
        return this.regionData.y;
    }

    /**
     * The `width` of the component. Defined through the `regionsData`.
     */
    public get width(): number {
        return this.regionData.boundRect.width;
    }

    /**
     * The `height` of the component. Defined through the `regionsData`.
     */
    public get height(): number {
        return this.regionData.boundRect.height;
    }

    /**
     * The `area` of the component. Defined through the `regionsData`.
     */
    public get area(): number {
        return this.regionData.area;
    }

    /**
     * The `boundRect` of the component. Defined through the `regionsData`.
     * @remarks Returns the `Rect` object of the same `width` and `height` as the component.
     */
    public get boundRect(): Rect {
        return this.regionData.boundRect;
    }

    /**
     * Reference to external callbacks collection.
     */
    protected callbacks: IRegionCallbacks;

    /**
     * Creates a new UI component (part of the region).
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, callbacks: IRegionCallbacks = null) {
        this.paper = paper;
        this.paperRect = paperRect;
        this.regionData = regionData;

        this.callbacks = callbacks;
    }

    /**
     * Switches the component presentation to the hidden state.
     */
    public hide() {
        this.node.node.setAttribute("display", "none");
        this.isVisible = false;
    }

    /**
     * Switches the component presentation to the visible state.
     */
    public show() {
        this.node.node.setAttribute("display", "inherit");
        this.isVisible = true;
    }

    /**
     * Selects the component.
     */
    public select() {
        this.isSelected = true;
        this.node.addClass("selected");
    }

    /**
     * Unselects the component.
     */
    public unselect() {
        this.isSelected = false;
        this.node.removeClass("selected");
    }

    /**
     * Switches the component to the frozen state.
     */
    public freeze() {
        this.isFrozen = true;
    }

    /**
     * Switches the component to the unfrozen state.
     */
    public unfreeze() {
        this.isFrozen = false;
    }

    /**
     * Moves the component to specified location
     * @param point - The new component location.
     */
    public move(point: IPoint2D): void;

    /**
     * Moves the component to specified `x` and `y` coordinates.
     * @param x - The new `x`-coordinate.
     * @param y - The new `y`-coordinate.
     */
    public move(x: number, y: number): void;

    public move(arg1: any, arg2?: any): void {
        this.regionData.move(arg1, arg2);
        this.redraw();
    }

    /**
     * Redraws the visual of the component. Should be redefined in child classes.
     */
    public abstract redraw(): void;

    /**
     * Resizes the component to specified `width` and `height`.
     * @param width - The new `width` for the component.
     * @param height - The new `height` for the component.
     */
    public resize(width: number, height: number) {
        this.regionData.resize(width, height);
        this.redraw();
    }

    /**
     * Resizes the bounding box for the component.
     * @param width - The new `width` of the bounding box.
     * @param height - The new `height` of the bounding box.
     */
    public resizePaper(width: number, height: number) {
        this.paperRect.resize(width, height);
    }

    /**
     * Subscribes the component elements according to provided event descriptors. Binds to the `this` object.
     * @param listeners - The collection of event descriptors.
     */
    protected subscribeToEvents(listeners: EventListeners) {
        listeners.forEach((e) => {
            e.base.addEventListener(e.event, this.makeFreezable(e.listener.bind(this), e.bypass));
        });
    }

    /**
     * A helper function to make event listeners frozen if the component state is frozen.
     * @param f - Function to wrap.
     * @param bypass - A flag whether event should bypass.
     */
    protected makeFreezable(f: (args: PointerEvent | KeyboardEvent) => void, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (!this.isFrozen || bypass) {
                f(args);
            }
        };
    }
}
