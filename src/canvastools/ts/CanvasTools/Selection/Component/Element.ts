import { Rect } from "../../Core/Rect";
import { IHideable } from "../../Interface/IHideadble";
import { IResizable } from "../../Interface/IResizable";

/**
 * Abstract class for building blocks of selectors.
 */
export abstract class Element implements IHideable, IResizable {
    /**
     * The `Snap.Element` object for external integration into SVG-tree.
     */
    public node: Snap.Element;

    /**
     * The `Snap.Paper` object to draw on.
     */
    protected paper: Snap.Paper;

    /**
     * The parent bounding box for selection.
     */
    protected boundRect: Rect;

    /**
     * The element visibility flag.
     */
    protected isVisible: boolean = true;

    /**
     * The `width` of the element.
     */
    public get width() {
        return this.boundRect.width;
    }

    /**
     * The `height` of the element.
     */
    public get height() {
        return this.boundRect.height;
    }

    /**
     * Creates new `Element` object.
     * @param paper - The `Snap.Paper` object to draw on.
     * @param boundRect - The parent bounding box for selection.
     */
    constructor(paper: Snap.Paper, boundRect: Rect) {
        this.paper = paper;
        this.boundRect = boundRect;
    }

    /**
     * Makes elemement visually hidden.
     */
    public hide() {
        this.node.node.setAttribute("visibility", "hidden");
        this.isVisible = false;
    }

    /**
     * Makes element visible.
     */
    public show() {
        this.node.node.setAttribute("visibility", "visible");
        this.isVisible = true;
    }

    /**
     * Resizes element to specified `width` and `height`.
     * @param width - New element `width`.
     * @param height - New element `height`.
     */
    public resize(width: number, height: number) {
        this.boundRect.resize(width, height);
    }
}
