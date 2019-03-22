import { Rect } from "../Core/Rect";

import { ISelectorCallbacks } from "../Interface/ISelectorCallbacks";
import { ISelectorSettings, SelectionMode } from "../Interface/ISelectorSettings";

import { PointSelector } from "./Selectors/PointSelector";
import { PolylineSelector } from "./Selectors/PolylineSelector";
import { PolygonSelector } from "./Selectors/PolygonSelector";
import { RectCopySelector } from "./Selectors/RectCopySelector";
import { RectSelector } from "./Selectors/RectSelector";
import { Selector } from "./Selectors/Selector";

/**
 * The region selection manager.
 * @remarks The naming of the class is historical per the idea to specify the
 * region area to be selected. Thus AreaSelector.
 * @todo Consider renaming.
 */
export class AreaSelector {
    /**
     * Default template size for the `RectCopySelector`.
     * @todo Move to the `RectCopySelector` class.
     */
    public static DefaultTemplateSize: Rect = new Rect(20, 20);

    /**
     * The collection of selector's callbacks.
     */
    public callbacks: ISelectorCallbacks;

    /**
     * The reference to the host SVG element.
     */
    private parentNode: SVGSVGElement;

    /**
     * The reference to the `Snap.Paper` element to draw on.
     */
    private paper: Snap.Paper;

    /**
     * The bounding rect for selectors.
     */
    private boundRect: Rect;

    /**
     * The grouping element for selectors.
     */
    private areaSelectorLayer: Snap.Element;

    /**
     * Reference to the current selector.
     */
    private selector: Selector;

    /**
     * Current selector options, if any.
     */
    private selectorSettings: ISelectorSettings;

    /**
     * Reference to a `RectSelector` object.
     */
    private rectSelector: RectSelector;

    /**
     * Reference to a `RectCopySelector` object.
     */
    private rectCopySelector: RectCopySelector;

    /**
     * Reference to a `PointSelector` object.
     */
    private pointSelector: PointSelector;

    /**
     * Reference to a `PolylineSelector` object.
     */
    private polylineSelector: PolylineSelector;

    /**
     * Reference to a `PolygonSelector` object.
     */
    private polygonSelector: PolygonSelector;

    /**
     * Internal flag to track selector visibility.
     */
    private isVisible: boolean = true;

    /**
     * Creates a new `AreaSelector` manager.
     * @param svgHost - The host SVG element.
     * @param callbacks - The collection of callbacks.
     */
    constructor(svgHost: SVGSVGElement, callbacks?: ISelectorCallbacks) {
        this.parentNode = svgHost;
        if (callbacks !== undefined) {
            this.callbacks = callbacks;
        } else {
            this.callbacks = {
                onLocked: null,
                onSelectionBegin: null,
                onSelectionEnd: null,
                onUnlocked: null,
            };
        }

        this.buildUIElements();
    }

    /**
     * Resizes selectors to specified `width` and `height`.
     * @param width - The new `width` for selector.
     * @param height - The new `height` for selector.
     */
    public resize(width: number, height: number): void {
        if (width !== undefined && height !== undefined) {
            this.boundRect.resize(width, height);
        } else {
            this.boundRect.resize(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
        }

        if (this.selector !== null) {
            this.selector.resize(width, height);
        }
    }

    /**
     * Enables the current selector.
     */
    public enable() {
        if (this.selector !== null) {
            this.selector.enable();
            this.selector.resize(this.boundRect.width, this.boundRect.height);
        }
    }

    /**
     * Disables the current selector.
     */
    public disable() {
        if (this.selector !== null) {
            this.selector.disable();
        }
    }

    /**
     * Makes current selector visible and enabled.
     */
    public show() {
        this.enable();
        this.isVisible = true;
    }

    /**
     * Makes current selector hidden and disabled.
     */
    public hide() {
        this.disable();
        this.isVisible = false;
    }

    /**
     * Sets new selection mode (changes active selector).
     * @param selectionMode - Selector mode.
     */
    public setSelectionMode(selectionMode: SelectionMode);

    /**
     * Sets new selection mode (changes active selector).
     * @param settings - Selector settings, including selection mode
     */
    public setSelectionMode(settings: ISelectorSettings);
    public setSelectionMode(settings: ISelectorSettings | SelectionMode) {
        let selectionSettings: ISelectorSettings;
        if (settings === null || settings === undefined) {
            selectionSettings = {
                mode: SelectionMode.NONE,
            };
        } else if ((settings as ISelectorSettings).mode !== undefined) {
            selectionSettings = settings as ISelectorSettings;
        } else {
            selectionSettings = { mode: settings as SelectionMode };
        }

        if (this.selectorSettings === undefined || this.selectorSettings.mode !== selectionSettings.mode) {
            this.disable();
            this.selectorSettings = selectionSettings;

            if (this.selectorSettings.mode === SelectionMode.NONE) {
                this.selector = null;
                return;
            } else if (this.selectorSettings.mode === SelectionMode.COPYRECT) {
                this.selector = this.rectCopySelector;
                const template = this.selectorSettings.template;
                if (template !== undefined) {
                    this.rectCopySelector.setTemplate(template);
                } else {
                    this.rectCopySelector.setTemplate(AreaSelector.DefaultTemplateSize);
                }
            } else if (this.selectorSettings.mode === SelectionMode.RECT) {
                this.selector = this.rectSelector;
            } else if (this.selectorSettings.mode === SelectionMode.POINT) {
                this.selector = this.pointSelector;
            } else if (this.selectorSettings.mode === SelectionMode.POLYLINE) {
                this.selector = this.polylineSelector;
            } else if (this.selectorSettings.mode === SelectionMode.POLYGON) {
                this.selector = this.polygonSelector;
            }
            // restore enablement status
            this.enable();
            if (this.isVisible) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    /**
     * Returns current options (settings) for selector.
     */
    public getSelectorSettings(): ISelectorSettings {
        return this.selectorSettings;
    }

    /**
     * Creates UI of the AreaSelector.
     */
    private buildUIElements() {
        this.paper = Snap(this.parentNode);
        this.boundRect = new Rect(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);

        this.areaSelectorLayer = this.paper.g();
        this.areaSelectorLayer.addClass("areaSelector");

        this.rectSelector = new RectSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.rectCopySelector = new RectCopySelector(this.parentNode, this.paper, this.boundRect,
                                                     new Rect(0, 0), this.callbacks);
        this.pointSelector = new PointSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.polylineSelector = new PolylineSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.polygonSelector = new PolygonSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);

        this.selector = this.rectSelector;

        this.rectSelector.enable();
        this.rectCopySelector.disable();
        this.pointSelector.disable();
        this.polylineSelector.disable();
        this.polygonSelector.disable();

        this.selector.hide();

        this.areaSelectorLayer.add(this.rectSelector.node);
        this.areaSelectorLayer.add(this.rectCopySelector.node);
        this.areaSelectorLayer.add(this.pointSelector.node);
        this.areaSelectorLayer.add(this.polylineSelector.node);
        this.areaSelectorLayer.add(this.polygonSelector.node);
    }
}
