import { Rect } from "../Core/Rect";

import { ISelectorCallbacks } from "../Interface/ISelectorCallbacks";

import { PointSelector } from "./Selectors/PointSelector";
import { PolylineSelector } from "./Selectors/PolylineSelector";
import { PolygonSelector } from "./Selectors/PolygonSelector";
import { RectCopySelector } from "./Selectors/RectCopySelector";
import { RectSelector } from "./Selectors/RectSelector";
import { Selector } from "./Selector";

/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

/* SELECTORS */
export enum SelectionMode { NONE, POINT, RECT, COPYRECT, POLYLINE, POLYGON }

export class AreaSelector {
    public static DefaultTemplateSize: Rect = new Rect(20, 20);

    public callbacks: ISelectorCallbacks;

    private parentNode: SVGSVGElement;
    private paper: Snap.Paper;
    private boundRect: Rect;

    private areaSelectorLayer: Snap.Element;

    private selector: Selector;

    private rectSelector: RectSelector;
    private rectCopySelector: RectCopySelector;
    private pointSelector: PointSelector;
    private polylineSelector: PolylineSelector;
    private polygonSelector: PolygonSelector;

    private isEnabled: boolean = true;
    private isVisible: boolean = true;

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

    public enable() {
        if (this.selector !== null) {
            this.selector.enable();
            this.isEnabled = true;
            this.selector.resize(this.boundRect.width, this.boundRect.height);
        }
    }

    public disable() {
        if (this.selector !== null) {
            this.selector.disable();
            this.isEnabled = false;
        }
    }

    public show() {
        this.enable();
        this.isVisible = true;
    }

    public hide() {
        this.disable();
        this.isVisible = false;
    }

    public setSelectionMode(selectionMode: SelectionMode, options?: { template?: Rect }) {
        this.disable();

        if (selectionMode === SelectionMode.NONE) {
            this.selector = null;
            return;
        } else if (selectionMode === SelectionMode.COPYRECT) {
            this.selector = this.rectCopySelector;
            if (options !== undefined && options.template !== undefined) {
                this.rectCopySelector.setTemplate(options.template);
            } else {
                this.rectCopySelector.setTemplate(AreaSelector.DefaultTemplateSize);
            }
        } else if (selectionMode === SelectionMode.RECT) {
            this.selector = this.rectSelector;
        } else if (selectionMode === SelectionMode.POINT) {
            this.selector = this.pointSelector;
        } else if (selectionMode === SelectionMode.POLYLINE) {
            this.selector = this.polylineSelector;
        } else if (selectionMode === SelectionMode.POLYGON) {
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
