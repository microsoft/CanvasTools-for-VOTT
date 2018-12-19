import { Point2D } from "../Core/Point2D";
import { Rect } from "../Core/Rect";
import { RegionData, RegionDataType } from "../Core/RegionData";

import { IEventDescriptor } from "../Interface/IEventDescriptor";
import { IHideable } from "../Interface/IHideadble";
import { IMovable } from "../Interface/IMovable";
import { IResizable } from "../Interface/IResizable";
import { ISelectorCallbacks } from "../Interface/ISelectorCallbacks";

import { ElementPart } from "./ElementPart";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export abstract class Selector extends ElementPart {
    public callbacks: ISelectorCallbacks;

    protected isEnabled: boolean = true;

    constructor(paper: Snap.Paper, boundRect: Rect, callbacks?: ISelectorCallbacks) {
        super(paper, boundRect);

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
    }

    public enable() {
        if (!this.isEnabled) {
            this.isEnabled = true;
            this.show();
        }
    }

    public disable() {
        if (this.isEnabled) {
            this.isEnabled = false;
            this.hide();
        }
    }

    // helper functions
    protected subscribeToEvents(listeners: IEventDescriptor[]) {
        listeners.forEach((e) => {
            e.base.addEventListener(e.event, this.enablify(e.listener.bind(this), e.bypass));
        });
    }

    protected enablify(f: (args: PointerEvent | KeyboardEvent) => void, bypass: boolean = false) {
        return (args: PointerEvent | KeyboardEvent) => {
            if (this.isEnabled || bypass) {
                f(args);
            }
        };
    }

    protected showAll(elements: IHideable[]) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                element.show();
            });
        });
    }

    protected hideAll(elements: IHideable[]) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                element.hide();
            });
        });
    }

    protected resizeAll(elementSet: IResizable[]) {
        window.requestAnimationFrame(() => {
            elementSet.forEach((element) => {
                element.resize(this.boundRect.width, this.boundRect.height);
            });
        });
    }
}
