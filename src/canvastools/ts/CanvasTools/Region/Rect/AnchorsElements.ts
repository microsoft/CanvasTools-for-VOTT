import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { TagsDescriptor } from "../../Core/TagsDescriptor";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IFreezable } from "../../Interface/IFreezable";
import { IHideable } from "../../Interface/IHideadble";
import { IMovable } from "../../Interface/IMovable";
import { IResizable } from "../../Interface/IResizable";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";

import { ChangeEventType, ChangeFunction, ManipulationFunction, RegionComponent } from "../RegionComponent";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

/*
 * AnchorsElement
 * Used internally to draw anchors to resize the region
*/
export class AnchorsElement extends RegionComponent {
    private anchors: { TL: Snap.Element, TR: Snap.Element, BR: Snap.Element, BL: Snap.Element };
    private ghostAnchor: Snap.Element;

    private activeAnchor: string;
    private originalAnchor: string;

    private dragOrigin: Point2D;
    private pointOrigin: Point2D;
    private rectOrigin: Rect;

    constructor(paper: Snap.Paper, paperRect: Rect = null, x: number, y: number, rect: Rect,
                onChange?: ChangeFunction, onManipulationBegin?: ManipulationFunction,
                onManipulationEnd?: ManipulationFunction) {
        super(paper, paperRect);
        this.x = x;
        this.y = y;
        this.boundRect = rect;

        if (onChange !== undefined) {
            this.onChange = onChange;
        }

        if (onManipulationBegin !== undefined) {
            this.onManipulationBegin = onManipulationBegin;
        }
        if (onManipulationEnd !== undefined) {
            this.onManipulationEnd = onManipulationEnd;
        }

        this.buildOn(paper);
    }

    public move(point: IMovable): void;
    public move(x: number, y: number): void;
    public move(arg1: any, arg2?: any) {
        super.move(arg1, arg2);
        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
    }

    public resize(width: number, height: number) {
        super.resize(width, height);
        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
    }

    public freeze() {
        super.freeze();
        this.ghostAnchor.undrag();
        this.onManipulationEnd();
    }

    private buildOn(paper: Snap.Paper) {
        this.node = paper.g();
        this.node.addClass("anchorsLayer");
        this.anchors = {
            BL: this.createAnchor(paper, "BL"),
            BR: this.createAnchor(paper, "BR"),
            TL: this.createAnchor(paper, "TL"),
            TR: this.createAnchor(paper, "TR"),
        };
        this.ghostAnchor = this.createAnchor(paper, "ghost", 7);

        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);

        this.node.add(this.anchors.TL);
        this.node.add(this.anchors.TR);
        this.node.add(this.anchors.BR);
        this.node.add(this.anchors.BL);
        this.node.add(this.ghostAnchor);

        this.subscribeAnchorToEvents(this.anchors.TL, "TL");
        this.subscribeAnchorToEvents(this.anchors.TR, "TR");
        this.subscribeAnchorToEvents(this.anchors.BL, "BL");
        this.subscribeAnchorToEvents(this.anchors.BR, "BR");

        const listeners: IEventDescriptor[] = [
            { event: "pointerenter", listener: this.onGhostPointerEnter, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerleave", listener: this.onGhostPointerLeave, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerdown", listener: this.onGhostPointerDown, base: this.ghostAnchor.node, bypass: false },
            { event: "pointerup", listener: this.onGhostPointerUp, base: this.ghostAnchor.node, bypass: false },
        ];

        this.subscribeToEvents(listeners);
    }

    private subscribeAnchorToEvents(anchor: Snap.Element, active: string) {
        anchor.node.addEventListener("pointerenter", (e) => {
            if (!this.isFrozen) {
                this.activeAnchor = active;
                // Set drag origin point to current anchor
                const p = this.getDragOriginPoint();
                this.dragOrigin = p;
                this.rectOrigin = this.boundRect.copy();
                this.pointOrigin = new Point2D(this.x, this.y);
                // Move ghost anchor to current anchor position

                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({
                        cx: p.x,
                        cy: p.y,
                        display: "block",
                    });
                });
            }
        });
    }

    private createAnchor(paper: Snap.Paper, style: string = "", r: number = 3): Snap.Element {
        const a = paper.circle(0, 0, r);
        a.addClass("anchorStyle");
        a.addClass(style);
        return a;
    }

    private rearrangeAnchors(x1: number, y1: number, x2: number, y2: number) {
        window.requestAnimationFrame(() => {
            this.anchors.TL.attr({ cx: x1, cy: y1 });
            this.anchors.TR.attr({ cx: x2, cy: y1 });
            this.anchors.BR.attr({ cx: x2, cy: y2 });
            this.anchors.BL.attr({ cx: x1, cy: y2 });
        });
    }

    private rearrangeCoord(p1: Point2D, p2: Point2D, flipX: boolean, flipY: boolean) {
        const x = (p1.x < p2.x) ? p1.x : p2.x;
        const y = (p1.y < p2.y) ? p1.y : p2.y;
        const width = Math.abs(p1.x - p2.x);
        const height = Math.abs(p1.y - p2.y);

        this.flipActiveAnchor(flipX, flipY);

        this.onChange(this, x, y, width, height, [new Point2D(x, y)], ChangeEventType.MOVING);
    }

    private flipActiveAnchor(flipX: boolean, flipY: boolean) {
        let ac: string = "";
        if (this.activeAnchor !== "") {
            ac += (this.activeAnchor[0] === "T") ? (flipY ? "B" : "T") : (flipY ? "T" : "B");
            ac += (this.activeAnchor[1] === "L") ? (flipX ? "R" : "L") : (flipX ? "L" : "R");
        }

        if (this.activeAnchor !== ac) {
            this.ghostAnchor.removeClass(this.activeAnchor);
            this.activeAnchor = ac;
            this.ghostAnchor.addClass(this.activeAnchor);
        }

        if (flipX) {
            if (this.activeAnchor[1] === "R") {
                this.pointOrigin.x += this.rectOrigin.width;
            }
            this.rectOrigin.resize(0, this.rectOrigin.height);
        }

        if (flipY) {
            if (this.activeAnchor[0] === "B") {
                this.pointOrigin.y += this.rectOrigin.height;
            }
            this.rectOrigin.resize(this.rectOrigin.width, 0);
        }
    }

    private anchorDragBegin() {
        this.originalAnchor = this.activeAnchor;
    }

    private getDragOriginPoint() {
        let x: number;
        let y: number;

        switch (this.activeAnchor) {
            case "TL": {
                x = this.x;
                y = this.y;
                break;
            }
            case "TR": {
                x = this.x + this.boundRect.width;
                y = this.y;
                break;
            }
            case "BL": {
                x = this.x;
                y = this.y + this.boundRect.height;
                break;
            }
            case "BR": {
                x = this.x + this.boundRect.width;
                y = this.y + this.boundRect.height;
                break;
            }
        }
        return new Point2D(x, y);
    }

    private anchorDragMove(dx: number, dy: number, x: number, y: number) {
        // Calculation depends on active anchor!!
        let p1: Point2D;
        let p2: Point2D;
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        let flipX: boolean = false;
        let flipY: boolean = false;

        x1 = this.dragOrigin.x + dx;
        y1 = this.dragOrigin.y + dy;

        switch (this.activeAnchor) {
            case "TL": {
                x2 = this.pointOrigin.x + this.rectOrigin.width;
                y2 = this.pointOrigin.y + this.rectOrigin.height;
                flipX = x2 < x1;
                flipY = y2 < y1;
                break;
            }
            case "TR": {
                x2 = this.pointOrigin.x;
                y2 = this.pointOrigin.y + this.rectOrigin.height;
                flipX = x1 < x2;
                flipY = y2 < y1;
                break;
            }
            case "BL": {
                y2 = this.pointOrigin.y;
                x2 = this.pointOrigin.x + this.rectOrigin.width;
                flipX = x2 < x1;
                flipY = y1 < y2;
                break;
            }
            case "BR": {
                x2 = this.pointOrigin.x;
                y2 = this.pointOrigin.y;
                flipX = x1 < x2;
                flipY = y1 < y2;
                break;
            }
        }

        p1 = new Point2D(x1, y1);
        p2 = new Point2D(x2, y2);

        if (this.paperRect !== null) {
            p1 = p1.boundToRect(this.paperRect);
            p2 = p2.boundToRect(this.paperRect);
        }

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({ cx: x1, cy: y1 });
        });

        this.rearrangeCoord(p1, p2, flipX, flipY);
    }

    private anchorDragEnd() {
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });
    }

    private onGhostPointerEnter(e: PointerEvent) {
        this.ghostAnchor.drag(
            this.anchorDragMove.bind(this),
            this.anchorDragBegin.bind(this),
            this.anchorDragEnd.bind(this));

        window.requestAnimationFrame(() => {
            this.ghostAnchor.addClass(this.activeAnchor);
        });
        this.onManipulationBegin();
    }

    private onGhostPointerLeave(e: PointerEvent) {
        this.ghostAnchor.undrag();

        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
            this.ghostAnchor.removeClass(this.activeAnchor);
        });

        this.onManipulationEnd();
    }

    private onGhostPointerDown(e: PointerEvent) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);

        this.onChange(this, this.x, this.y, this.boundRect.width, this.boundRect.height,
            [new Point2D(this.x, this.y)], ChangeEventType.MOVEBEGIN);
    }

    private onGhostPointerUp(e: PointerEvent) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        this.onChange(this, this.x, this.y, this.boundRect.width, this.boundRect.height,
            [new Point2D(this.x, this.y)], ChangeEventType.MOVEEND);
    }
}
