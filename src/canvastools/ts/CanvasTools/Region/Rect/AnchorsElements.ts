import { Point2D } from "../../Core/Point2D";
import { Rect } from "../../Core/Rect";
import { RegionData } from "../../Core/RegionData";

import { ChangeEventType, IRegionCallbacks } from "../../Interface/IRegionCallbacks";

import { AnchorsComponent } from "../Component/AnchorsComponent";

/**
 * `AnchorsComponent` for the `RectRegion` class.
 * @todo Current implementations of bones reuses existing aprroach with anchor index
 * by using negative indexes and manually correcting them to actual indexes.
 * It seems like it should be refactored some how.
 */
export class AnchorsElement extends AnchorsComponent {
    private anchorPointStyles: string[];
    private anchorBoneStyles: string[];

    private boneThickness;
    private anchorBones: Snap.Element[];

    /**
     * Creates a new `AnchorsElement` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param paperRect - The parent bounding box for created component.
     * @param regionData - The `RegionData` object shared across components. Used also for initial setup.
     * @param callbacks - The external callbacks collection.
     */
    constructor(paper: Snap.Paper, paperRect: Rect = null, regionData: RegionData, callbacks: IRegionCallbacks) {
        super(paper, paperRect, regionData, callbacks);
    }

    /**
     * Redraws the visual on the component.
     */
    public redraw() {
        super.redraw();

        const [x, y, width, height] = [this.regionData.x, this.regionData.y,
                                       this.regionData.width, this.regionData.height];
        const [tBone, rBone, bBone, lBone] = this.anchorBones;

        window.requestAnimationFrame(() => {
            tBone.attr({x, y: y - this.boneThickness / 2, width, height: this.boneThickness });
            rBone.attr({x: x + width - this.boneThickness / 2, y, width: this.boneThickness, height });
            bBone.attr({x, y: y + height - this.boneThickness / 2, width, height: this.boneThickness });
            lBone.attr({x: x - this.boneThickness / 2, y, width: this.boneThickness, height });
        });
    }

    /**
     * Creates a collection on anchors.
     */
    protected buildAnchors() {
        this.buildBoneAnchors();
        super.buildAnchors();
    }

    /**
     * Creates collection of anchor points.
     */
    protected buildPointAnchors() {
        this.anchorPointStyles = ["TL", "TR", "BR", "BL"];
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y, this.anchorPointStyles[index]);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);

            this.subscribeAnchorToEvents(anchor, index + 1);
        });
    }

    /**
     * Creates collection of anchor bones.
     */
    protected buildBoneAnchors() {
        this.anchorBoneStyles = ["T", "R", "B", "L"];
        this.anchorBones = [];
        this.boneThickness = AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS;

        const [x, y, w, h] = [this.regionData.x, this.regionData.y, this.regionData.width, this.regionData.height];

        const tBone = this.createAnchorBone(this.paper, x, y, w, 0, "T", this.boneThickness);
        const rBone = this.createAnchorBone(this.paper, x + w, y, 0, h, "R", this.boneThickness);
        const bBone = this.createAnchorBone(this.paper, x, y + h, w, 0, "B", this.boneThickness);
        const lBone = this.createAnchorBone(this.paper, x, y, 0, h, "L", this.boneThickness);

        const bones = [tBone, rBone, bBone, lBone];
        this.anchorBones.push(...bones);
        bones.forEach((bone, index) => {
            this.anchorsNode.add(bone);

            // Using already existing infrastructure for indexes
            this.subscribeAnchorBoneToEvents(bone, - (index + 1));
        });
    }

    /**
     * Helper function to create a new anchor bone.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param x - The `x`-coordinate of the acnhor bone.
     * @param y - The `y`-coordinate of the anchor bone.
     * @param width - The `width` of the anchor bone.
     * @param height - The `height` of the anchor bone.
     * @param style - Additional css style class to be applied.
     * @param thickness - The `thickness` of the bone (activation area).
     */
    protected createAnchorBone(paper: Snap.Paper, x: number, y: number,
                               width: number, height: number, style?: string,
                               thickness: number = AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS): Snap.Element {
        let bone: Snap.Element;
        if (width === 0) {
            bone = paper.rect(x - thickness / 2, y, thickness, height);
        } else if (height === 0) {
            bone = paper.rect(x, y - thickness / 2, width, thickness);
        } else {
            throw Error("Rect bones that are neither vertical or horizontal are not supported.");
            return null;
        }

        bone.addClass("anchorBoneStyle");

        if (style !== undefined && style !== "") {
            bone.addClass(style);
        }
        return bone;
    }

    /**
     * Updates the `regionData` based on the new ghost anchor location. Should be redefined in child classes.
     * @param p - The new ghost anchor location.
     */
    protected updateRegion(p: Point2D) {
        let x1: number = p.x;
        let y1: number = p.y;
        let x2: number;
        let y2: number;
        let flipX: boolean = false;
        let flipY: boolean = false;

        let activeAnchor = this.getActiveAnchor();

        switch (activeAnchor) {
            case "TL": {
                x2 = this.x + this.width;
                y2 = this.y + this.height;
                flipX = x2 < x1;
                flipY = y2 < y1;
                break;
            }
            case "TR": {
                x2 = this.x;
                y2 = this.y + this.height;
                flipX = x1 < x2;
                flipY = y2 < y1;
                break;
            }
            case "BL": {
                y2 = this.y;
                x2 = this.x + this.width;
                flipX = x2 < x1;
                flipY = y1 < y2;
                break;
            }
            case "BR": {
                x2 = this.x;
                y2 = this.y;
                flipX = x1 < x2;
                flipY = y1 < y2;
                break;
            }
            case "T": {
                x1 = this.x;
                x2 = this.x + this.width;
                y2 = this.y + this.height;
                flipY = y1 > y2;
                break;
            }
            case "R": {
                x2 = this.x;
                y1 = this.y;
                y2 = this.y + this.height;
                flipX = x2 > x1;
                break;
            }
            case "B": {
                x1 = this.x;
                x2 = this.x + this.width;
                y2 = this.y;
                flipY = y1 < y2;
                break;
            }
            case "L": {
                x2 = this.x + this.width;
                y1 = this.y;
                y2 = this.y + this.height;
                flipX = x1 > x2;
                break;
            }
        }

        let newAA: string = "";
        if (activeAnchor !== "" && activeAnchor.length === 2) {
            newAA += (activeAnchor[0] === "T") ? (flipY ? "B" : "T") : (flipY ? "T" : "B");
            newAA += (activeAnchor[1] === "L") ? (flipX ? "R" : "L") : (flipX ? "L" : "R");
        }
        if (activeAnchor !== "" && activeAnchor.length === 1) {
            if (flipX) {
                newAA = (activeAnchor === "R") ? "L" : "R";
            } else if (flipY) {
                newAA = (activeAnchor === "T") ? "B" : "T";
            } else {
                newAA = activeAnchor;
            }
        }

        if (activeAnchor !== newAA) {
            this.ghostAnchor.removeClass(activeAnchor);
            if (newAA.length === 2) {
                this.activeAnchorIndex = this.anchorPointStyles.indexOf(newAA) + 1;
            } else {
                this.activeAnchorIndex = - (this.anchorBoneStyles.indexOf(newAA) + 1);
            }

            activeAnchor = newAA;
            this.ghostAnchor.addClass(newAA);
        }

        const p1 = new Point2D(Math.min(x1, x2), Math.min(y1, y2)).boundToRect(this.paperRect);
        const p2 = new Point2D(Math.max(x1, x2), Math.max(y1, y2)).boundToRect(this.paperRect);

        const rd = this.regionData.copy();
        rd.setPoints([p1, new Point2D(p2.x, p1.y), p2, new Point2D(p1.x, p2.y)]);

        this.callbacks.onChange(this, rd, ChangeEventType.MOVING);
    }

    /**
     * Callback for the pointerenter event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerEnter(e: PointerEvent) {
        this.ghostAnchor.addClass(this.getActiveAnchor());
        super.onGhostPointerEnter(e);
    }

    /**
     * Callback for the pointerleave event for the ghost anchor.
     * @param e - PointerEvent object.
     */
    protected onGhostPointerLeave(e: PointerEvent) {
        this.ghostAnchor.removeClass(this.getActiveAnchor());
        super.onGhostPointerLeave(e);
    }

    /**
     * Helper function to subscribe anchor to activation event.
     * @param bone - The anchor bone for wire up.
     * @param index - The index of the anchor used to define which one is active.
     */
    protected subscribeAnchorBoneToEvents(bone: Snap.Element, index: number) {
        this.subscribeToEvents([
            {
                event: "pointerenter",
                base: bone.node,
                listener: (e: PointerEvent) => {
                    if (!this.isFrozen) {
                        this.activeAnchorIndex = index;
                        const anchorPoint = this.getActiveAnchorPoint(e);
                        // Move ghost anchor to current anchor position
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                cx: anchorPoint.x,
                                cy: anchorPoint.y,
                                display: "block",
                            });
                        });
                    }
                },
                bypass: false,
            },
        ]);
    }

    /**
     * Returns `Point2D` with coordinates of active anchor
     */
    protected getActiveAnchorPoint(e?: PointerEvent): Point2D {
        if (this.activeAnchorIndex > 0) {
            return this.regionData.points[this.activeAnchorIndex - 1];
        } else if (this.activeAnchorIndex < 0) {
            if (e !== undefined) {
                const offsetX = e.clientX - (e.target as Element).closest("svg").getBoundingClientRect().left;
                const offsetY = e.clientY - (e.target as Element).closest("svg").getBoundingClientRect().top;
                return new Point2D(offsetX, offsetY);
            } else {
                const boneBox = this.anchorBones[-this.activeAnchorIndex - 1].getBBox();
                return new Point2D(boneBox.cx, boneBox.cy);
            }
        } else {
            return null;
        }
    }

    /**
     * Internal helper function to get active anchor.
     */
    private getActiveAnchor(): string {
        if (this.activeAnchorIndex > 0) {
            // anchor point is activeted
            return this.anchorPointStyles[this.activeAnchorIndex - 1];
        } else if (this.activeAnchorIndex < 0) {
            // anchor bone is activeted, indexes are negative starting -1
            return this.anchorBoneStyles[-this.activeAnchorIndex - 1];
        } else {
            return "";
        }
    }

}
