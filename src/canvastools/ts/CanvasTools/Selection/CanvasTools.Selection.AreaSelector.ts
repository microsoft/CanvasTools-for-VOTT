import { Point2D } from "./../Core/CanvasTools.Point2D";
import { Rect } from "./../Core/CanvasTools.Rect";
import { RegionData, RegionDataType } from "./../Core/CanvasTools.RegionData";

import { IEventDescriptor } from "./../Interface/IEventDescriptor";
import { IHideable } from "./../Interface/IHideadble";
import { IMovable } from "./../Interface/IMovable";
import { IResizable } from "./../Interface/IResizable";
import { ISelectorCallbacks } from "./../Interface/ISelectorCallbacks";

import { ElementPart } from "./CanvasTools.Selection.ElementPart";
import { PointSelector } from "./CanvasTools.Selection.PointSelector";
import { PolylineSelector } from "./CanvasTools.Selection.PolylineSelector";
import { RectCopySelector } from "./CanvasTools.Selection.RectCopySelector";
import { RectSelector } from "./CanvasTools.Selection.RectSelector";
import { Selector } from "./CanvasTools.Selection.Selector";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

/* SELECTORS */
export enum SelectionMode { NONE, POINT, RECT, COPYRECT, POLYLINE }

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
        }

        // restore enablement status
        this.enable();
        if (this.isVisible) {
            this.show();
        } else {
            this.hide();
        }
    }

    protected enablify(f: (args: PointerEvent | KeyboardEvent) => void, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (this.isEnabled || bypass) {
                f(args);
            }
        };
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

        this.selector = this.rectSelector;
        this.rectSelector.enable();
        this.rectCopySelector.disable();
        this.pointSelector.disable();
        this.polylineSelector.disable();
        this.selector.hide();

        this.areaSelectorLayer.add(this.rectSelector.node);
        this.areaSelectorLayer.add(this.rectCopySelector.node);
        this.areaSelectorLayer.add(this.pointSelector.node);
        this.areaSelectorLayer.add(this.polylineSelector.node);
    }
}
