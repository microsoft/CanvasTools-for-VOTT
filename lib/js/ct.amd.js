var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("Base/CanvasTools.Base.Interfaces", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Base/CanvasTools.Base.Point2D", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CanvasTools;
    (function (CanvasTools) {
        var Base;
        (function (Base) {
            var Point;
            (function (Point) {
                class Point2D {
                    constructor(x, y) {
                        this.x = x;
                        this.y = y;
                    }
                    boundToRect(r) {
                        let newp = new Point2D(0, 0);
                        newp.x = (this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x);
                        newp.y = (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y);
                        return newp;
                    }
                }
                Point.Point2D = Point2D;
            })(Point = Base.Point || (Base.Point = {}));
        })(Base = CanvasTools.Base || (CanvasTools.Base = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("Base/CanvasTools.Base.Rect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CanvasTools;
    (function (CanvasTools) {
        var Base;
        (function (Base) {
            var Rect;
            (function (Rect_1) {
                class Rect {
                    constructor(width, height) {
                        this.resize(width, height);
                    }
                    resize(width, height) {
                        this.width = width;
                        this.height = height;
                    }
                    copy() {
                        return new Rect(this.width, this.height);
                    }
                }
                Rect_1.Rect = Rect;
            })(Rect = Base.Rect || (Base.Rect = {}));
        })(Base = CanvasTools.Base || (CanvasTools.Base = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("Base/CanvasTools.Base.Tags", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CanvasTools;
    (function (CanvasTools) {
        var Base;
        (function (Base) {
            var Tags;
            (function (Tags) {
                class Tag {
                    constructor(name, colorHue, id = "none") {
                        this.__colorPure = "";
                        this.__colorAccent = "";
                        this.__colorHighlight = "";
                        this.__colorShadow = "";
                        this.__colorNoColor = "";
                        this.__colorDark = "";
                        this.name = name;
                        this.colorHue = colorHue;
                        this.id = id;
                    }
                    get colorPure() {
                        if (this.__colorPure == "") {
                            this.__colorPure = `hsl(${this.colorHue.toString()}, 100%, 50%)`;
                        }
                        return this.__colorPure;
                    }
                    get colorAccent() {
                        if (this.__colorAccent == "") {
                            this.__colorAccent = `hsla(${this.colorHue.toString()}, 100%, 50%, 0.5)`;
                        }
                        return this.__colorAccent;
                    }
                    get colorHighlight() {
                        if (this.__colorHighlight == "") {
                            this.__colorHighlight = `hsla(${this.colorHue.toString()}, 80%, 40%, 0.3)`;
                        }
                        return this.__colorHighlight;
                    }
                    get colorShadow() {
                        if (this.__colorShadow == "") {
                            this.__colorShadow = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.2)`;
                        }
                        return this.__colorShadow;
                    }
                    get colorNoColor() {
                        if (this.__colorNoColor == "") {
                            this.__colorNoColor = `rgba(0, 0, 0, 0.0)`;
                        }
                        return this.__colorNoColor;
                    }
                    get colorDark() {
                        if (this.__colorDark == "") {
                            this.__colorDark = `hsla(${this.colorHue.toString()}, 50%, 30%, 0.8)`;
                        }
                        return this.__colorDark;
                    }
                    static getHueFromColor(color) {
                        var r = parseInt(color.substring(1, 3), 16) / 255;
                        var g = parseInt(color.substring(3, 5), 16) / 255;
                        var b = parseInt(color.substring(5, 7), 16) / 255;
                        var max = Math.max(r, g, b), min = Math.min(r, g, b);
                        var h, s, l = (max + min) / 2;
                        if (max == min) {
                            h = s = 0;
                        }
                        else {
                            var d = max - min;
                            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                            switch (max) {
                                case r:
                                    h = (g - b) / d + (g < b ? 6 : 0);
                                    break;
                                case g:
                                    h = (b - r) / d + 2;
                                    break;
                                case b:
                                    h = (r - g) / d + 4;
                                    break;
                            }
                            h /= 6;
                        }
                        return h;
                    }
                }
                Tags.Tag = Tag;
                class TagsDescriptor {
                    constructor(primaryTag, secondaryTags = []) {
                        this.primary = primaryTag;
                        this.secondary = secondaryTags;
                    }
                    toString() {
                        let str = this.primary.name;
                        this.secondary.forEach((tag) => {
                            str += " " + tag.name;
                        });
                        return str;
                    }
                }
                Tags.TagsDescriptor = TagsDescriptor;
            })(Tags = Base.Tags || (Base.Tags = {}));
        })(Base = CanvasTools.Base || (CanvasTools.Base = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("CanvasTools.Selection", ["require", "exports", "Base/CanvasTools.Base.Rect", "Base/CanvasTools.Base.Point2D", "snapsvg"], function (require, exports, CTBaseRect, CTBasePoint, Snap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
    var Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
    var CanvasTools;
    (function (CanvasTools) {
        var Selection;
        (function (Selection) {
            class ElementPrototype {
                constructor(paper, boundRect) {
                    this.isVisible = true;
                    this.paper = paper;
                    this.boundRect = boundRect;
                }
                hide() {
                    this.node.node.setAttribute("visibility", "hidden");
                    this.isVisible = false;
                }
                show() {
                    this.node.node.setAttribute("visibility", "visible");
                    this.isVisible = true;
                }
                resize(width, height) {
                    this.boundRect.resize(width, height);
                }
            }
            class CrossElement extends ElementPrototype {
                constructor(paper, boundRect) {
                    super(paper, boundRect);
                    this.buildUIElements();
                    this.hide();
                }
                buildUIElements() {
                    let verticalLine = this.paper.line(0, 0, 0, this.boundRect.height);
                    let horizontalLine = this.paper.line(0, 0, this.boundRect.width, 0);
                    this.node = this.paper.g();
                    this.node.addClass("crossStyle");
                    this.node.add(verticalLine);
                    this.node.add(horizontalLine);
                    this.hl = horizontalLine;
                    this.vl = verticalLine;
                    this.x = 0;
                    this.y = 0;
                }
                boundToRect(rect) {
                    return new Point2D(this.x, this.y).boundToRect(rect);
                }
                move(p, rect, square = false, ref = null) {
                    let np = p.boundToRect(rect);
                    if (square) {
                        let dx = Math.abs(np.x - ref.x);
                        let vx = Math.sign(np.x - ref.x);
                        let dy = Math.abs(np.y - ref.y);
                        let vy = Math.sign(np.y - ref.y);
                        let d = Math.min(dx, dy);
                        np.x = ref.x + d * vx;
                        np.y = ref.y + d * vy;
                    }
                    this.x = np.x;
                    this.y = np.y;
                    this.vl.node.setAttribute("x1", np.x.toString());
                    this.vl.node.setAttribute("x2", np.x.toString());
                    this.vl.node.setAttribute("y2", rect.height.toString());
                    this.hl.node.setAttribute("y1", np.y.toString());
                    this.hl.node.setAttribute("x2", rect.width.toString());
                    this.hl.node.setAttribute("y2", np.y.toString());
                }
                resize(width, height) {
                    super.resize(width, height);
                    this.vl.node.setAttribute("y2", height.toString());
                    this.hl.node.setAttribute("x2", width.toString());
                }
            }
            class RectElement extends ElementPrototype {
                constructor(paper, boundRect, rect) {
                    super(paper, boundRect);
                    this.rect = rect;
                    this.buildUIElements();
                    this.hide();
                }
                buildUIElements() {
                    this.node = this.paper.rect(0, 0, this.rect.width, this.rect.height);
                }
                move(p) {
                    this.node.node.setAttribute("x", p.x.toString());
                    this.node.node.setAttribute("y", p.y.toString());
                }
                resize(width, height) {
                    this.rect.resize(width, height);
                    this.node.node.setAttribute("height", height.toString());
                    this.node.node.setAttribute("width", width.toString());
                }
            }
            class MaskElement extends ElementPrototype {
                constructor(paper, boundRect, maskOut) {
                    super(paper, boundRect);
                    this.maskOut = maskOut;
                    this.buildUIElements();
                    this.resize(boundRect.width, boundRect.height);
                    this.hide();
                }
                buildUIElements() {
                    this.mask = this.createMask();
                    this.maskIn = this.createMaskIn();
                    this.maskOut.node.addClass("maskOutStyle");
                    let combinedMask = this.paper.g();
                    combinedMask.add(this.maskIn.node);
                    combinedMask.add(this.maskOut.node);
                    this.mask.node.attr({
                        mask: combinedMask
                    });
                    this.node = this.mask.node;
                }
                createMask() {
                    let r = new RectElement(this.paper, this.boundRect, this.boundRect);
                    r.node.addClass("maskStyle");
                    return r;
                }
                createMaskIn() {
                    let r = new RectElement(this.paper, this.boundRect, this.boundRect);
                    r.node.addClass("maskInStyle");
                    return r;
                }
                resize(width, height) {
                    super.resize(width, height);
                    this.mask.resize(width, height);
                    this.maskIn.resize(width, height);
                }
            }
            let SelectionMode;
            (function (SelectionMode) {
                SelectionMode[SelectionMode["NONE"] = 0] = "NONE";
                SelectionMode[SelectionMode["POINT"] = 1] = "POINT";
                SelectionMode[SelectionMode["RECT"] = 2] = "RECT";
                SelectionMode[SelectionMode["COPYRECT"] = 3] = "COPYRECT";
                SelectionMode[SelectionMode["POLYLINE"] = 4] = "POLYLINE";
            })(SelectionMode = Selection.SelectionMode || (Selection.SelectionMode = {}));
            ;
            let SelectionModificator;
            (function (SelectionModificator) {
                SelectionModificator[SelectionModificator["RECT"] = 0] = "RECT";
                SelectionModificator[SelectionModificator["SQUARE"] = 1] = "SQUARE";
            })(SelectionModificator = Selection.SelectionModificator || (Selection.SelectionModificator = {}));
            ;
            class SelectorPrototype extends ElementPrototype {
                constructor(paper, boundRect, callbacks) {
                    super(paper, boundRect);
                    this.isEnabled = true;
                    if (callbacks !== undefined) {
                        this.callbacks = callbacks;
                    }
                    else {
                        this.callbacks = {
                            onSelectionBegin: null,
                            onSelectionEnd: null,
                            onLocked: null,
                            onUnlocked: null
                        };
                    }
                }
                enable() {
                    if (!this.isEnabled) {
                        this.isEnabled = true;
                        this.show();
                    }
                }
                disable() {
                    if (this.isEnabled) {
                        this.isEnabled = false;
                        this.hide();
                    }
                }
                subscribeToEvents(listeners) {
                    listeners.forEach(e => {
                        e.base.addEventListener(e.event, this.enablify(e.listener.bind(this), e.bypass));
                    });
                }
                enablify(f, bypass = false) {
                    return (args) => {
                        if (this.isEnabled || bypass) {
                            f(args);
                        }
                    };
                }
                showAll(elements) {
                    window.requestAnimationFrame(() => {
                        elements.forEach(element => {
                            element.show();
                        });
                    });
                }
                hideAll(elements) {
                    window.requestAnimationFrame(() => {
                        elements.forEach(element => {
                            element.hide();
                        });
                    });
                }
                resizeAll(elementSet) {
                    window.requestAnimationFrame(() => {
                        elementSet.forEach(element => {
                            element.resize(this.boundRect.width, this.boundRect.height);
                        });
                    });
                }
            }
            class RectSelector extends SelectorPrototype {
                constructor(parent, paper, boundRect, callbacks) {
                    super(paper, boundRect, callbacks);
                    this.capturingState = false;
                    this.isTwoPoints = false;
                    this.selectionModificator = SelectionModificator.RECT;
                    this.parentNode = parent;
                    this.buildUIElements();
                    this.hide();
                }
                buildUIElements() {
                    this.node = this.paper.g();
                    this.node.addClass("rectSelector");
                    this.crossA = new CrossElement(this.paper, this.boundRect);
                    this.crossB = new CrossElement(this.paper, this.boundRect);
                    this.selectionBox = new RectElement(this.paper, this.boundRect, new Rect(0, 0));
                    this.selectionBox.node.addClass("selectionBoxStyle");
                    this.mask = new MaskElement(this.paper, this.boundRect, this.selectionBox);
                    this.node.add(this.mask.node);
                    this.node.add(this.crossA.node);
                    this.node.add(this.crossB.node);
                    let listeners = [
                        { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
                        { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
                        { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
                        { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
                        { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
                        { event: "keydown", listener: this.onKeyDown, base: window, bypass: false },
                        { event: "keyup", listener: this.onKeyUp, base: window, bypass: true },
                    ];
                    this.subscribeToEvents(listeners);
                }
                moveCross(cross, p, square = false, refCross = null) {
                    cross.move(p, this.boundRect, square, refCross);
                }
                moveSelectionBox(box, crossA, crossB) {
                    var x = (crossA.x < crossB.x) ? crossA.x : crossB.x;
                    var y = (crossA.y < crossB.y) ? crossA.y : crossB.y;
                    var w = Math.abs(crossA.x - crossB.x);
                    var h = Math.abs(crossA.y - crossB.y);
                    box.move(new Point2D(x, y));
                    box.resize(w, h);
                }
                onPointerEnter(e) {
                    window.requestAnimationFrame(() => {
                        this.crossA.show();
                    });
                }
                onPointerLeave(e) {
                    window.requestAnimationFrame(() => {
                        let rect = this.parentNode.getClientRects();
                        let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        if (!this.capturingState) {
                            this.hideAll([this.crossA, this.crossB, this.selectionBox]);
                        }
                        else if (this.isTwoPoints && this.capturingState) {
                            this.moveCross(this.crossB, p);
                            this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                        }
                    });
                }
                onPointerDown(e) {
                    window.requestAnimationFrame(() => {
                        if (!this.isTwoPoints) {
                            this.capturingState = true;
                            this.parentNode.setPointerCapture(e.pointerId);
                            this.moveCross(this.crossB, this.crossA);
                            this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                            this.showAll([this.mask, this.crossB, this.selectionBox]);
                            if (typeof this.callbacks.onSelectionBegin === "function") {
                                this.callbacks.onSelectionBegin();
                            }
                        }
                    });
                }
                onPointerUp(e) {
                    window.requestAnimationFrame(() => {
                        let rect = this.parentNode.getClientRects();
                        let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        if (!this.isTwoPoints) {
                            this.capturingState = false;
                            this.parentNode.releasePointerCapture(e.pointerId);
                            this.hideAll([this.crossB, this.mask]);
                            if (typeof this.callbacks.onSelectionEnd === "function") {
                                this.callbacks.onSelectionEnd({
                                    boundRect: {
                                        x1: this.crossA.x,
                                        y1: this.crossA.y,
                                        x2: this.crossB.x,
                                        y2: this.crossB.y
                                    }
                                });
                            }
                        }
                        else {
                            if (this.capturingState) {
                                this.capturingState = false;
                                this.hideAll([this.crossB, this.mask]);
                                if (typeof this.callbacks.onSelectionEnd === "function") {
                                    this.callbacks.onSelectionEnd({
                                        boundRect: {
                                            x1: this.crossA.x,
                                            y1: this.crossA.y,
                                            x2: this.crossB.x,
                                            y2: this.crossB.y
                                        }
                                    });
                                }
                                this.moveCross(this.crossA, p);
                                this.moveCross(this.crossB, p);
                            }
                            else {
                                this.capturingState = true;
                                this.moveCross(this.crossB, p);
                                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                                this.showAll([this.crossA, this.crossB, this.selectionBox, this.mask]);
                                if (typeof this.callbacks.onSelectionBegin === "function") {
                                    this.callbacks.onSelectionBegin();
                                }
                            }
                        }
                    });
                }
                onPointerMove(e) {
                    window.requestAnimationFrame(() => {
                        let rect = this.parentNode.getClientRects();
                        let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.crossA.show();
                        if (!this.isTwoPoints) {
                            if (this.capturingState) {
                                this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                            }
                            else {
                                this.moveCross(this.crossA, p);
                            }
                        }
                        else {
                            if (this.capturingState) {
                                this.moveCross(this.crossB, p, this.selectionModificator === SelectionModificator.SQUARE, this.crossA);
                                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                            }
                            else {
                                this.moveCross(this.crossA, p);
                                this.moveCross(this.crossB, p);
                            }
                        }
                    });
                    e.preventDefault();
                }
                onKeyDown(e) {
                    if (e.shiftKey) {
                        this.selectionModificator = SelectionModificator.SQUARE;
                    }
                    if (e.ctrlKey && !this.capturingState) {
                        this.isTwoPoints = true;
                    }
                }
                onKeyUp(e) {
                    if (!e.shiftKey) {
                        this.selectionModificator = SelectionModificator.RECT;
                    }
                    if (!e.ctrlKey && this.isTwoPoints) {
                        this.isTwoPoints = false;
                        this.capturingState = false;
                        this.moveCross(this.crossA, this.crossB);
                        this.hideAll([this.crossB, this.selectionBox, this.mask]);
                    }
                }
                resize(width, height) {
                    super.resize(width, height);
                    this.resizeAll([this.mask, this.crossA, this.crossB]);
                }
                hide() {
                    super.hide();
                    this.hideAll([this.crossA, this.crossB, this.mask]);
                }
                show() {
                    super.show();
                    this.crossA.show();
                }
            }
            Selection.RectSelector = RectSelector;
            class RectCopySelector extends SelectorPrototype {
                constructor(parent, paper, boundRect, copyRect, callbacks) {
                    super(paper, boundRect, callbacks);
                    this.parentNode = parent;
                    this.copyRect = copyRect;
                    this.buildUIElements();
                    this.hide();
                }
                buildUIElements() {
                    this.node = this.paper.g();
                    this.node.addClass("rectCopySelector");
                    this.crossA = new CrossElement(this.paper, this.boundRect);
                    this.copyRectEl = new RectElement(this.paper, this.boundRect, this.copyRect);
                    this.copyRectEl.node.addClass("copyRectStyle");
                    this.node.add(this.crossA.node);
                    this.node.add(this.copyRectEl.node);
                    let listeners = [
                        { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
                        { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
                        { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
                        { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
                        { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
                        { event: "wheel", listener: this.onWheel, base: this.parentNode, bypass: false },
                    ];
                    this.subscribeToEvents(listeners);
                }
                moveCross(cross, p, square = false, refCross = null) {
                    cross.move(p, this.boundRect, square, refCross);
                }
                moveCopyRect(copyRect, crossA) {
                    var x = crossA.x - copyRect.rect.width / 2;
                    var y = crossA.y - copyRect.rect.height / 2;
                    copyRect.move(new Point2D(x, y));
                }
                setTemplate(copyRect) {
                    this.copyRect = copyRect;
                    this.copyRectEl.resize(copyRect.width, copyRect.height);
                    this.moveCopyRect(this.copyRectEl, this.crossA);
                }
                onPointerEnter(e) {
                    window.requestAnimationFrame(() => {
                        this.crossA.show();
                        this.copyRectEl.show();
                    });
                }
                onPointerLeave(e) {
                    window.requestAnimationFrame(() => {
                        this.hide();
                    });
                }
                onPointerDown(e) {
                    window.requestAnimationFrame(() => {
                        this.show();
                        this.moveCopyRect(this.copyRectEl, this.crossA);
                        if (typeof this.callbacks.onSelectionBegin === "function") {
                            this.callbacks.onSelectionBegin();
                        }
                    });
                }
                onPointerUp(e) {
                    window.requestAnimationFrame(() => {
                        if (typeof this.callbacks.onSelectionEnd === "function") {
                            let p1 = new Point2D(this.crossA.x - this.copyRect.width / 2, this.crossA.y - this.copyRect.height / 2);
                            let p2 = new Point2D(this.crossA.x + this.copyRect.width / 2, this.crossA.y + this.copyRect.height / 2);
                            p1 = p1.boundToRect(this.boundRect);
                            p2 = p2.boundToRect(this.boundRect);
                            this.callbacks.onSelectionEnd({
                                boundRect: {
                                    x1: p1.x,
                                    y1: p1.y,
                                    x2: p2.x,
                                    y2: p2.y
                                }
                            });
                        }
                    });
                }
                onPointerMove(e) {
                    window.requestAnimationFrame(() => {
                        let rect = this.parentNode.getClientRects();
                        let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.crossA.show();
                        this.copyRectEl.show();
                        this.moveCross(this.crossA, p);
                        this.moveCopyRect(this.copyRectEl, this.crossA);
                    });
                    e.preventDefault();
                }
                onWheel(e) {
                    let width = this.copyRect.width;
                    let height = this.copyRect.height;
                    let k = height / width;
                    if (e.shiftKey) {
                        if (e.deltaY > 0) {
                            width *= 1.1;
                            height *= 1.1;
                        }
                        else {
                            width /= 1.1;
                            height /= 1.1;
                        }
                    }
                    else {
                        if (e.deltaY > 0) {
                            width += 1.0;
                            height += k;
                        }
                        else {
                            width -= 1.0;
                            height -= k;
                        }
                    }
                    if (width < 1.0) {
                        width = 1.0;
                        height = k;
                    }
                    if (height < 1.0) {
                        height = 1.0;
                        width = 1.0 / k;
                    }
                    window.requestAnimationFrame(() => {
                        this.copyRect.resize(width, height);
                        this.copyRectEl.resize(width, height);
                        this.moveCopyRect(this.copyRectEl, this.crossA);
                    });
                }
                resize(width, height) {
                    super.resize(width, height);
                    this.crossA.resize(width, height);
                }
                hide() {
                    super.hide();
                    this.hideAll([this.crossA, this.copyRectEl]);
                }
                show() {
                    super.show();
                    this.showAll([this.crossA, this.copyRectEl]);
                }
            }
            Selection.RectCopySelector = RectCopySelector;
            class PointSelector extends SelectorPrototype {
                constructor(parent, paper, boundRect, callbacks) {
                    super(paper, boundRect, callbacks);
                    this.pointRadius = 6;
                    this.parentNode = parent;
                    this.buildUIElements();
                    this.hide();
                }
                buildUIElements() {
                    this.node = this.paper.g();
                    this.node.addClass("pointSelector");
                    this.crossA = new CrossElement(this.paper, this.boundRect);
                    this.point = this.paper.circle(0, 0, this.pointRadius);
                    this.point.addClass("pointStyle");
                    this.node.add(this.crossA.node);
                    this.node.add(this.point);
                    let listeners = [
                        { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
                        { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
                        { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
                        { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
                        { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false }
                    ];
                    this.subscribeToEvents(listeners);
                }
                moveCross(cross, p, square = false, refCross = null) {
                    cross.move(p, this.boundRect, square, refCross);
                }
                movePoint(point, crossA) {
                    point.attr({
                        cx: crossA.x,
                        cy: crossA.y
                    });
                }
                onPointerEnter(e) {
                    window.requestAnimationFrame(() => {
                        this.show();
                    });
                }
                onPointerLeave(e) {
                    window.requestAnimationFrame(() => {
                        this.hide();
                    });
                }
                onPointerDown(e) {
                    window.requestAnimationFrame(() => {
                        this.show();
                        this.movePoint(this.point, this.crossA);
                        if (typeof this.callbacks.onSelectionBegin === "function") {
                            this.callbacks.onSelectionBegin();
                        }
                    });
                }
                onPointerUp(e) {
                    window.requestAnimationFrame(() => {
                        if (typeof this.callbacks.onSelectionEnd === "function") {
                            let p1 = new Point2D(this.crossA.x - this.pointRadius, this.crossA.y - this.pointRadius);
                            let p2 = new Point2D(this.crossA.x + this.pointRadius, this.crossA.y + this.pointRadius);
                            p1 = p1.boundToRect(this.boundRect);
                            p2 = p2.boundToRect(this.boundRect);
                            this.callbacks.onSelectionEnd({
                                boundRect: {
                                    x1: p1.x,
                                    y1: p1.y,
                                    x2: p2.x,
                                    y2: p2.y
                                },
                                meta: {
                                    point: {
                                        x: this.crossA.x,
                                        y: this.crossA.y
                                    }
                                }
                            });
                        }
                    });
                }
                onPointerMove(e) {
                    window.requestAnimationFrame(() => {
                        let rect = this.parentNode.getClientRects();
                        let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.show();
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.point, this.crossA);
                    });
                    e.preventDefault();
                }
                resize(width, height) {
                    super.resize(width, height);
                    this.crossA.resize(width, height);
                }
                hide() {
                    super.hide();
                    this.crossA.hide();
                    this.point.node.setAttribute("visibility", "hidden");
                }
                show() {
                    super.show();
                    this.crossA.show();
                    this.point.node.setAttribute("visibility", "visible");
                }
            }
            Selection.PointSelector = PointSelector;
            class PolylineSelector extends SelectorPrototype {
                constructor(parent, paper, boundRect, callbacks) {
                    super(paper, boundRect, callbacks);
                    this.pointRadius = 3;
                    this.isCapturing = false;
                    this.parentNode = parent;
                    this.buildUIElements();
                    this.reset();
                    this.hide();
                }
                buildUIElements() {
                    this.node = this.paper.g();
                    this.node.addClass("polylineSelector");
                    this.crossA = new CrossElement(this.paper, this.boundRect);
                    this.nextPoint = this.paper.circle(0, 0, this.pointRadius);
                    this.nextPoint.addClass("nextPointStyle");
                    this.nextSegment = this.paper.line(0, 0, 0, 0);
                    this.nextSegment.addClass("nextSegmentStyle");
                    this.pointsGroup = this.paper.g();
                    this.pointsGroup.addClass("polylineGroupStyle");
                    this.polyline = this.paper.polyline([]);
                    this.polyline.addClass("polylineStyle");
                    this.node.add(this.polyline);
                    this.node.add(this.pointsGroup);
                    this.node.add(this.crossA.node);
                    this.node.add(this.nextSegment);
                    this.node.add(this.nextPoint);
                    let listeners = [
                        { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
                        { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
                        { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
                        { event: "click", listener: this.onClick, base: this.parentNode, bypass: false },
                        { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
                        { event: "dblclick", listener: this.onDoubleClick, base: this.parentNode, bypass: false },
                        { event: "keyup", listener: this.onKeyUp, base: window, bypass: true }
                    ];
                    this.subscribeToEvents(listeners);
                }
                reset() {
                    this.points = new Array();
                    this.lastPoint = null;
                    let ps = this.pointsGroup.children();
                    while (ps.length > 0) {
                        ps[0].remove();
                        ps = this.pointsGroup.children();
                    }
                    this.polyline.attr({
                        points: ""
                    });
                    if (this.isCapturing) {
                        this.isCapturing = false;
                    }
                }
                moveCross(cross, pointTo, square = false, refCross = null) {
                    cross.move(pointTo, this.boundRect, square, refCross);
                }
                movePoint(element, pointTo) {
                    element.attr({
                        cx: pointTo.x,
                        cy: pointTo.y
                    });
                }
                moveLine(element, pointFrom, pointTo) {
                    element.attr({
                        x1: pointFrom.x,
                        y1: pointFrom.y,
                        x2: pointTo.x,
                        y2: pointTo.y
                    });
                }
                addPoint(x, y) {
                    this.points.push(new Point2D(x, y));
                    let point = this.paper.circle(x, y, this.pointRadius);
                    point.addClass("polylinePointStyle");
                    this.pointsGroup.add(point);
                    let pointsStr = "";
                    this.points.forEach((p) => {
                        pointsStr += `${p.x},${p.y},`;
                    });
                    this.polyline.attr({
                        points: pointsStr.substr(0, pointsStr.length - 1)
                    });
                }
                onPointerEnter(e) {
                    window.requestAnimationFrame(() => {
                        this.show();
                    });
                }
                onPointerLeave(e) {
                    if (!this.isCapturing) {
                        window.requestAnimationFrame(() => {
                            this.hide();
                        });
                    }
                    else {
                        let rect = this.parentNode.getClientRects();
                        let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.nextPoint, p);
                    }
                }
                onPointerDown(e) {
                    if (!this.isCapturing) {
                        this.isCapturing = true;
                        if (typeof this.callbacks.onSelectionBegin === "function") {
                            this.callbacks.onSelectionBegin();
                        }
                    }
                }
                onClick(e) {
                    if (e.detail <= 1) {
                        window.requestAnimationFrame(() => {
                            let p = new Point2D(this.crossA.x, this.crossA.y);
                            this.addPoint(p.x, p.y);
                            this.lastPoint = p;
                        });
                    }
                }
                onPointerMove(e) {
                    window.requestAnimationFrame(() => {
                        let rect = this.parentNode.getClientRects();
                        let p = new Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.show();
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.nextPoint, p);
                        if (this.lastPoint != null) {
                            this.moveLine(this.nextSegment, this.lastPoint, p);
                        }
                        else {
                            this.moveLine(this.nextSegment, p, p);
                        }
                    });
                    e.preventDefault();
                }
                onDoubleClick(e) {
                    this.submitPolyline();
                }
                submitPolyline() {
                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        let box = this.polyline.getBBox();
                        this.callbacks.onSelectionEnd({
                            boundRect: {
                                x1: box.x,
                                y1: box.y,
                                x2: box.x2,
                                y2: box.y2
                            },
                            meta: {
                                polyline: this.points
                            }
                        });
                    }
                    this.reset();
                }
                onKeyUp(e) {
                    if (e.code === "Escape") {
                        this.submitPolyline();
                    }
                }
                resize(width, height) {
                    super.resize(width, height);
                    this.crossA.resize(width, height);
                }
                hide() {
                    super.hide();
                    this.crossA.hide();
                    this.nextPoint.node.setAttribute("visibility", "hidden");
                    this.nextSegment.node.setAttribute("visibility", "hidden");
                    this.polyline.node.setAttribute("visibility", "hidden");
                    this.pointsGroup.node.setAttribute("visibility", "hidden");
                }
                show() {
                    super.show();
                    this.crossA.show();
                    this.nextPoint.node.setAttribute("visibility", "visible");
                    this.nextSegment.node.setAttribute("visibility", "visible");
                    this.polyline.node.setAttribute("visibility", "visible");
                    this.pointsGroup.node.setAttribute("visibility", "visible");
                }
            }
            Selection.PolylineSelector = PolylineSelector;
            class AreaSelector {
                constructor(svgHost, callbacks) {
                    this.isEnabled = true;
                    this.isVisible = true;
                    this.parentNode = svgHost;
                    if (callbacks !== undefined) {
                        this.callbacks = callbacks;
                    }
                    else {
                        this.callbacks = {
                            onSelectionBegin: null,
                            onSelectionEnd: null,
                            onLocked: null,
                            onUnlocked: null
                        };
                    }
                    this.buildUIElements();
                }
                buildUIElements() {
                    this.paper = Snap(this.parentNode);
                    this.boundRect = new Rect(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
                    this.areaSelectorLayer = this.paper.g();
                    this.areaSelectorLayer.addClass("areaSelector");
                    this.rectSelector = new RectSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
                    this.rectCopySelector = new RectCopySelector(this.parentNode, this.paper, this.boundRect, new Rect(0, 0), this.callbacks);
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
                resize(width, height) {
                    if (width !== undefined && height !== undefined) {
                        this.boundRect.resize(width, height);
                    }
                    else {
                        this.boundRect.resize(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
                    }
                    if (this.selector !== null) {
                        this.selector.resize(width, height);
                    }
                }
                enable() {
                    if (this.selector !== null) {
                        this.selector.enable();
                        this.isEnabled = true;
                        this.selector.resize(this.boundRect.width, this.boundRect.height);
                    }
                }
                disable() {
                    if (this.selector !== null) {
                        this.selector.disable();
                        this.isEnabled = false;
                    }
                }
                show() {
                    this.enable();
                    this.isVisible = true;
                }
                hide() {
                    this.disable();
                    this.isVisible = false;
                }
                setSelectionMode(selectionMode, options) {
                    this.disable();
                    if (selectionMode === SelectionMode.NONE) {
                        this.selector = null;
                        return;
                    }
                    else if (selectionMode === SelectionMode.COPYRECT) {
                        this.selector = this.rectCopySelector;
                        if (options !== undefined && options.template !== undefined) {
                            this.rectCopySelector.setTemplate(options.template);
                        }
                        else {
                            this.rectCopySelector.setTemplate(AreaSelector.DefaultTemplateSize);
                        }
                    }
                    else if (selectionMode === SelectionMode.RECT) {
                        this.selector = this.rectSelector;
                    }
                    else if (selectionMode === SelectionMode.POINT) {
                        this.selector = this.pointSelector;
                    }
                    else if (selectionMode === SelectionMode.POLYLINE) {
                        this.selector = this.polylineSelector;
                    }
                    this.enable();
                    if (this.isVisible) {
                        this.show();
                    }
                    else {
                        this.hide();
                    }
                }
                enablify(f, bypass = false) {
                    return (args) => {
                        if (this.isEnabled || bypass) {
                            f(args);
                        }
                    };
                }
            }
            AreaSelector.DefaultTemplateSize = new Rect(20, 20);
            Selection.AreaSelector = AreaSelector;
        })(Selection = CanvasTools.Selection || (CanvasTools.Selection = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("CanvasTools.Filter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CanvasTools;
    (function (CanvasTools) {
        var Filter;
        (function (Filter) {
            function InvertFilter(canvas) {
                var context = canvas.getContext('2d');
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var buff = document.createElement("canvas");
                buff.width = canvas.width;
                buff.height = canvas.height;
                var data = imageData.data;
                for (var i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                buff.getContext("2d").putImageData(imageData, 0, 0);
                return new Promise((resolve, reject) => {
                    return resolve(buff);
                });
            }
            Filter.InvertFilter = InvertFilter;
            function GrayscaleFilter(canvas) {
                var context = canvas.getContext('2d');
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var buff = document.createElement("canvas");
                buff.width = canvas.width;
                buff.height = canvas.height;
                var data = imageData.data;
                for (var i = 0; i < data.length; i += 4) {
                    let gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                }
                buff.getContext("2d").putImageData(imageData, 0, 0);
                return new Promise((resolve, reject) => {
                    return resolve(buff);
                });
            }
            Filter.GrayscaleFilter = GrayscaleFilter;
            class FilterPipeline {
                constructor() {
                    this.pipeline = new Array();
                }
                addFilter(filter) {
                    this.pipeline.push(filter);
                }
                clearPipeline() {
                    this.pipeline = new Array();
                }
                applyToCanvas(canvas) {
                    let promise = new Promise((resolve, reject) => {
                        return resolve(canvas);
                    });
                    if (this.pipeline.length > 0) {
                        this.pipeline.forEach((filter) => {
                            promise = promise.then(filter);
                        });
                    }
                    return promise;
                }
            }
            Filter.FilterPipeline = FilterPipeline;
        })(Filter = CanvasTools.Filter || (CanvasTools.Filter = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("CanvasTools.Toolbar", ["require", "exports", "snapsvg", "Base/CanvasTools.Base.Rect"], function (require, exports, Snap, CTBaseRect) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
    var CanvasTools;
    (function (CanvasTools) {
        var Toolbar;
        (function (Toolbar_1) {
            let ToolbarItemType;
            (function (ToolbarItemType) {
                ToolbarItemType[ToolbarItemType["SELECTOR"] = 0] = "SELECTOR";
                ToolbarItemType[ToolbarItemType["SWITCH"] = 1] = "SWITCH";
                ToolbarItemType[ToolbarItemType["SEPARATOR"] = 2] = "SEPARATOR";
            })(ToolbarItemType = Toolbar_1.ToolbarItemType || (Toolbar_1.ToolbarItemType = {}));
            ;
            class ToolbarIconPrototype {
                constructor(paper, icon) {
                    this.isSelected = false;
                    this.paper = paper;
                    if (icon !== undefined && icon !== null) {
                        this.description = icon;
                        if (icon.width !== undefined) {
                            this.width = icon.width;
                        }
                        else {
                            this.width = ToolbarIconPrototype.IconWidth;
                        }
                        if (icon.height !== undefined) {
                            this.height = icon.height;
                        }
                        else {
                            this.height = ToolbarIconPrototype.IconHeight;
                        }
                    }
                    else {
                        this.description = null;
                        this.width = ToolbarIconPrototype.IconWidth;
                        this.height = ToolbarIconPrototype.IconHeight;
                    }
                }
                move(x, y) {
                    this.x = x;
                    this.y = y;
                }
                resize(width, height) {
                    this.width = width;
                    this.height = height;
                }
                select() {
                    this.node.addClass("selected");
                    this.isSelected = true;
                }
                unselect() {
                    this.node.removeClass("selected");
                    this.isSelected = false;
                }
                toggleSelection() {
                    if (this.isSelected) {
                        this.unselect();
                    }
                    else {
                        this.select();
                    }
                }
            }
            ToolbarIconPrototype.IconWidth = 48;
            ToolbarIconPrototype.IconHeight = 48;
            class ToolbarSelectIcon extends ToolbarIconPrototype {
                constructor(paper, icon, onAction) {
                    super(paper, icon);
                    this.onAction = onAction;
                    this.buildIconUI();
                }
                buildIconUI() {
                    this.node = this.paper.g();
                    this.node.addClass("iconStyle");
                    this.node.addClass("selector");
                    this.iconBackgrounRect = this.paper.rect(0, 0, this.width, this.height);
                    this.iconBackgrounRect.addClass("iconBGRectStyle");
                    this.iconImage = this.paper.g();
                    if (this.description.iconUrl !== undefined) {
                        Snap.load(this.description.iconUrl, (fragment) => {
                            this.iconImage.append(fragment);
                            this.iconImageSVG = this.iconImage.children().find((element) => {
                                return (element.type === "svg");
                            });
                            if (this.iconImageSVG !== undefined) {
                                this.iconImageSVG.attr({
                                    width: this.width,
                                    height: this.height
                                });
                                this.move(this.x, this.y);
                            }
                        });
                    }
                    this.iconImage.addClass("iconImageStyle");
                    let title = Snap.parse(`<title>${this.description.tooltip}</title>`);
                    this.node.add(this.iconBackgrounRect);
                    this.node.add(this.iconImage);
                    this.node.append(title);
                    this.node.click((e) => {
                        this.activate();
                    });
                }
                activate() {
                    this.onAction(this.description.action);
                    this.select();
                }
                move(x, y) {
                    super.move(x, y);
                    this.iconBackgrounRect.attr({ x: x, y: y });
                    if (this.iconImageSVG !== undefined) {
                        this.iconImageSVG.attr({ x: x, y: y });
                    }
                }
                resize(width, height) {
                    super.resize(width, height);
                    this.iconBackgrounRect.attr({
                        width: this.width,
                        height: this.height
                    });
                    this.iconImageSVG.attr({
                        width: this.width,
                        height: this.height
                    });
                }
            }
            Toolbar_1.ToolbarSelectIcon = ToolbarSelectIcon;
            class ToolbarSwitchIcon extends ToolbarIconPrototype {
                constructor(paper, icon, onAction) {
                    super(paper, icon);
                    this.onAction = onAction;
                    this.buildIconUI();
                }
                buildIconUI() {
                    this.node = this.paper.g();
                    this.node.addClass("iconStyle");
                    this.node.addClass("switch");
                    this.iconBackgrounRect = this.paper.rect(0, 0, this.width, this.height);
                    this.iconBackgrounRect.addClass("iconBGRectStyle");
                    this.iconImage = this.paper.g();
                    if (this.description.iconUrl !== undefined) {
                        Snap.load(this.description.iconUrl, (fragment) => {
                            this.iconImage.append(fragment);
                            this.iconImageSVG = this.iconImage.children().find((element) => {
                                return (element.type === "svg");
                            });
                            if (this.iconImageSVG !== undefined) {
                                this.iconImageSVG.attr({
                                    width: this.width,
                                    height: this.height
                                });
                                this.move(this.x, this.y);
                            }
                        });
                    }
                    this.iconImage.addClass("iconImageStyle");
                    let title = Snap.parse(`<title>${this.description.tooltip}</title>`);
                    this.node.add(this.iconBackgrounRect);
                    this.node.add(this.iconImage);
                    this.node.append(title);
                    this.node.click((e) => {
                        this.activate();
                    });
                }
                activate() {
                    this.onAction(this.description.action);
                    this.toggleSelection();
                }
                move(x, y) {
                    super.move(x, y);
                    this.iconBackgrounRect.attr({ x: x, y: y });
                    if (this.iconImageSVG !== undefined) {
                        this.iconImageSVG.attr({ x: x, y: y });
                    }
                }
                resize(width, height) {
                    super.resize(width, height);
                    this.iconBackgrounRect.attr({
                        width: this.width,
                        height: this.height
                    });
                    this.iconImageSVG.attr({
                        width: this.width,
                        height: this.height
                    });
                }
            }
            Toolbar_1.ToolbarSwitchIcon = ToolbarSwitchIcon;
            class ToolbarSeparator extends ToolbarIconPrototype {
                constructor(paper, width) {
                    super(paper, null);
                    this.buildIconUI();
                    this.resize(width, 1);
                }
                buildIconUI() {
                    this.node = this.paper.g();
                    this.node.addClass("iconStyle");
                    this.node.addClass("separator");
                    this.iconSeparator = this.paper.line(0, 0, this.width, 0);
                    this.node.add(this.iconSeparator);
                }
                move(x, y) {
                    super.move(x, y);
                    this.iconSeparator.attr({
                        x1: x,
                        y1: y,
                        x2: x + this.width,
                        y2: y
                    });
                }
                resize(width, height) {
                    super.resize(width, 1);
                    this.iconSeparator.attr({
                        width: this.width
                    });
                }
            }
            Toolbar_1.ToolbarSeparator = ToolbarSeparator;
            class Toolbar {
                constructor(svgHost) {
                    this.iconSpace = 8;
                    this.areHotKeysEnabled = true;
                    this.icons = new Array();
                    this.buildUIElements(svgHost);
                }
                buildUIElements(svgHost) {
                    this.baseParent = svgHost;
                    this.paper = Snap(svgHost);
                    this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
                    let toolbarGroup = this.paper.g();
                    toolbarGroup.addClass("toolbarLayer");
                    this.recalculateToolbarSize();
                    this.backgroundRect = this.paper.rect(0, 0, this.toolbarWidth, this.toolbarHeight);
                    this.backgroundRect.addClass("toolbarBGStyle");
                    toolbarGroup.add(this.backgroundRect);
                    this.iconsLayer = this.paper.g();
                    this.iconsLayer.addClass("iconsLayerStyle");
                    toolbarGroup.add(this.iconsLayer);
                    this.subscribeToKeyboardEvents();
                }
                recalculateToolbarSize(newIcon) {
                    if (newIcon == undefined) {
                        this.toolbarWidth = ToolbarIconPrototype.IconWidth + 2 * this.iconSpace;
                        this.toolbarHeight = this.icons.length * (ToolbarIconPrototype.IconHeight + this.iconSpace) + this.iconSpace;
                    }
                    else {
                        let width = newIcon.width + 2 * this.iconSpace;
                        if (width > this.toolbarWidth) {
                            this.toolbarWidth = width;
                        }
                        this.toolbarHeight = this.toolbarHeight + newIcon.height + this.iconSpace;
                    }
                }
                updateToolbarSize() {
                    this.backgroundRect.attr({
                        width: this.toolbarWidth,
                        height: this.toolbarHeight
                    });
                }
                addSelector(icon, actor) {
                    let newIcon = new ToolbarSelectIcon(this.paper, icon, (action) => {
                        this.select(action);
                        actor(action);
                    });
                    this.addIcon(newIcon);
                }
                addSwitch(icon, actor) {
                    let newIcon = new ToolbarSwitchIcon(this.paper, icon, (action) => {
                        actor(action);
                    });
                    this.addIcon(newIcon);
                }
                addSeparator() {
                    let newIcon = new ToolbarSeparator(this.paper, ToolbarIconPrototype.IconWidth);
                    this.addIcon(newIcon);
                }
                addIcon(newIcon) {
                    this.icons.push(newIcon);
                    this.iconsLayer.add(newIcon.node);
                    newIcon.move(this.iconSpace, this.toolbarHeight + this.iconSpace);
                    this.recalculateToolbarSize(newIcon);
                    this.updateToolbarSize();
                }
                findIconByKeycode(keycode) {
                    return this.icons.find((icon) => {
                        return icon.description !== null && icon.description.keycode == keycode;
                    });
                }
                findIconByAction(action) {
                    return this.icons.find((icon) => {
                        return icon.description !== null && icon.description.action == action;
                    });
                }
                subscribeToKeyboardEvents() {
                    window.addEventListener("keyup", (e) => {
                        if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
                            if (this.areHotKeysEnabled && !e.ctrlKey && !e.altKey) {
                                let icon = this.findIconByKeycode(e.code);
                                if (icon !== undefined) {
                                    if (icon instanceof ToolbarSelectIcon || icon instanceof ToolbarSwitchIcon) {
                                        icon.activate();
                                    }
                                }
                            }
                        }
                    });
                }
                select(action) {
                    this.icons.forEach((icon) => {
                        if (icon instanceof ToolbarSelectIcon) {
                            if (icon.description.action !== action) {
                                icon.unselect();
                            }
                            else {
                                icon.select();
                            }
                        }
                    });
                }
                setSwitch(action, on) {
                    let switchIcon = this.findIconByAction(action);
                    if (switchIcon !== undefined && switchIcon instanceof ToolbarSwitchIcon) {
                        (on) ? switchIcon.select() : switchIcon.unselect();
                    }
                }
                enableHotkeys() {
                    this.areHotKeysEnabled = true;
                }
                disableHotkeys() {
                    this.areHotKeysEnabled = false;
                }
            }
            Toolbar_1.Toolbar = Toolbar;
        })(Toolbar = CanvasTools.Toolbar || (CanvasTools.Toolbar = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("Regions/CanvasTools.Regions.Base", ["require", "exports", "Base/CanvasTools.Base.Rect"], function (require, exports, CTBaseRect) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
    var CanvasTools;
    (function (CanvasTools) {
        var Region;
        (function (Region) {
            var RegionBase;
            (function (RegionBase) {
                let ChangeEventType;
                (function (ChangeEventType) {
                    ChangeEventType[ChangeEventType["MOVEEND"] = 0] = "MOVEEND";
                    ChangeEventType[ChangeEventType["MOVING"] = 1] = "MOVING";
                    ChangeEventType[ChangeEventType["MOVEBEGIN"] = 2] = "MOVEBEGIN";
                    ChangeEventType[ChangeEventType["SELECTIONTOGGLE"] = 3] = "SELECTIONTOGGLE";
                })(ChangeEventType = RegionBase.ChangeEventType || (RegionBase.ChangeEventType = {}));
                ;
                class RegionComponentPrototype {
                    constructor(paper, paperRect) {
                        this.isVisible = true;
                        this.isFrozen = false;
                        this.paper = paper;
                        this.paperRect = paperRect;
                        this.boundRect = new Rect(0, 0);
                    }
                    hide() {
                        this.node.node.setAttribute("visibility", "hidden");
                        this.isVisible = false;
                    }
                    show() {
                        this.node.node.setAttribute("visibility", "visible");
                        this.isVisible = true;
                    }
                    freeze() {
                        this.isFrozen = true;
                    }
                    unfreeze() {
                        this.isFrozen = false;
                    }
                    resize(width, height) {
                        this.boundRect.resize(width, height);
                    }
                    resizePaper(width, height) {
                        this.paperRect.resize(width, height);
                    }
                    move(point) {
                        this.x = point.x;
                        this.y = point.y;
                    }
                    subscribeToEvents(listeners) {
                        listeners.forEach(e => {
                            e.base.addEventListener(e.event, this.makeFreezable(e.listener.bind(this), e.bypass));
                        });
                    }
                    makeFreezable(f, bypass = false) {
                        return (args) => {
                            if (!this.isFrozen || bypass) {
                                f(args);
                            }
                        };
                    }
                }
                RegionBase.RegionComponentPrototype = RegionComponentPrototype;
            })(RegionBase = Region.RegionBase || (Region.RegionBase = {}));
        })(Region = CanvasTools.Region || (CanvasTools.Region = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("Regions/CanvasTools.Regions.RectRegion", ["require", "exports", "Base/CanvasTools.Base.Rect", "Base/CanvasTools.Base.Point2D", "Regions/CanvasTools.Regions.Base", "snapsvg"], function (require, exports, CTBaseRect, CTBasePoint, CTRegion, Snap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
    var Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
    var RegionBase = CTRegion.CanvasTools.Region.RegionBase;
    var CanvasTools;
    (function (CanvasTools) {
        var Region;
        (function (Region) {
            var RectRegion;
            (function (RectRegion_1) {
                class AnchorsElement extends RegionBase.RegionComponentPrototype {
                    constructor(paper, x, y, rect, paperRect = null, onChange, onManipulationBegin, onManipulationEnd) {
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
                    buildOn(paper) {
                        this.node = paper.g();
                        this.node.addClass("anchorsLayer");
                        this.anchors = {
                            TL: this.createAnchor(paper, "TL"),
                            TR: this.createAnchor(paper, "TR"),
                            BL: this.createAnchor(paper, "BL"),
                            BR: this.createAnchor(paper, "BR")
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
                        let listeners = [
                            { event: "pointerenter", listener: this.onGhostPointerEnter, base: this.ghostAnchor.node, bypass: false },
                            { event: "pointerleave", listener: this.onGhostPointerLeave, base: this.ghostAnchor.node, bypass: false },
                            { event: "pointerdown", listener: this.onGhostPointerDown, base: this.ghostAnchor.node, bypass: false },
                            { event: "pointerup", listener: this.onGhostPointerUp, base: this.ghostAnchor.node, bypass: false },
                        ];
                        this.subscribeToEvents(listeners);
                    }
                    subscribeAnchorToEvents(anchor, active) {
                        anchor.node.addEventListener("pointerenter", (e) => {
                            if (!this.isFrozen) {
                                this.activeAnchor = active;
                                let p = this.getDragOriginPoint();
                                this.dragOrigin = p;
                                this.rectOrigin = this.boundRect.copy();
                                this.pointOrigin = new Point2D(this.x, this.y);
                                window.requestAnimationFrame(() => {
                                    this.ghostAnchor.attr({
                                        cx: p.x,
                                        cy: p.y,
                                        display: 'block'
                                    });
                                });
                            }
                        });
                    }
                    createAnchor(paper, style = "", r = 3) {
                        let a = paper.circle(0, 0, r);
                        a.addClass("anchorStyle");
                        a.addClass(style);
                        return a;
                    }
                    move(p) {
                        super.move(p);
                        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
                    }
                    resize(width, height) {
                        super.resize(width, height);
                        this.rearrangeAnchors(this.x, this.y, this.x + this.boundRect.width, this.y + this.boundRect.height);
                    }
                    rearrangeAnchors(x1, y1, x2, y2) {
                        window.requestAnimationFrame(() => {
                            this.anchors.TL.attr({ cx: x1, cy: y1 });
                            this.anchors.TR.attr({ cx: x2, cy: y1 });
                            this.anchors.BR.attr({ cx: x2, cy: y2 });
                            this.anchors.BL.attr({ cx: x1, cy: y2 });
                        });
                    }
                    rearrangeCoord(p1, p2, flipX, flipY) {
                        let x = (p1.x < p2.x) ? p1.x : p2.x;
                        let y = (p1.y < p2.y) ? p1.y : p2.y;
                        let width = Math.abs(p1.x - p2.x);
                        let height = Math.abs(p1.y - p2.y);
                        this.flipActiveAnchor(flipX, flipY);
                        this.onChange(x, y, width, height, RegionBase.ChangeEventType.MOVING);
                    }
                    flipActiveAnchor(flipX, flipY) {
                        let ac = "";
                        if (this.activeAnchor !== "") {
                            ac += (this.activeAnchor[0] == "T") ? (flipY ? "B" : "T") : (flipY ? "T" : "B");
                            ac += (this.activeAnchor[1] == "L") ? (flipX ? "R" : "L") : (flipX ? "L" : "R");
                        }
                        if (this.activeAnchor != ac) {
                            this.ghostAnchor.removeClass(this.activeAnchor);
                            this.activeAnchor = ac;
                            this.ghostAnchor.addClass(this.activeAnchor);
                        }
                        if (flipX) {
                            if (this.activeAnchor[1] == "R") {
                                this.pointOrigin.x += this.rectOrigin.width;
                            }
                            this.rectOrigin.width = 0;
                        }
                        if (flipY) {
                            if (this.activeAnchor[0] == "B") {
                                this.pointOrigin.y += this.rectOrigin.height;
                            }
                            this.rectOrigin.height = 0;
                        }
                    }
                    anchorDragBegin() {
                        this.originalAnchor = this.activeAnchor;
                    }
                    getDragOriginPoint() {
                        let x, y;
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
                    anchorDragMove(dx, dy, x, y) {
                        let p1, p2;
                        let x1, y1, x2, y2;
                        let flipX = false;
                        let flipY = false;
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
                    ;
                    anchorDragEnd() {
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                display: "none"
                            });
                        });
                    }
                    onGhostPointerEnter(e) {
                        this.ghostAnchor.drag(this.anchorDragMove.bind(this), this.anchorDragBegin.bind(this), this.anchorDragEnd.bind(this));
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.addClass(this.activeAnchor);
                        });
                        this.onManipulationBegin();
                    }
                    onGhostPointerLeave(e) {
                        this.ghostAnchor.undrag();
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                display: "none"
                            });
                            this.ghostAnchor.removeClass(this.activeAnchor);
                        });
                        this.onManipulationEnd();
                    }
                    onGhostPointerDown(e) {
                        this.ghostAnchor.node.setPointerCapture(e.pointerId);
                        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.MOVEBEGIN);
                    }
                    onGhostPointerUp(e) {
                        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
                        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.MOVEEND);
                    }
                    freeze() {
                        super.freeze();
                        this.ghostAnchor.undrag();
                        this.onManipulationEnd();
                    }
                }
                class TagsElement extends RegionBase.RegionComponentPrototype {
                    constructor(paper, x, y, rect, paperRect, tags, styleId, styleSheet, tagsUpdateOptions) {
                        super(paper, paperRect);
                        this.styleSheet = null;
                        this.boundRect = rect;
                        this.x = x;
                        this.y = y;
                        this.styleId = styleId;
                        this.styleSheet = styleSheet;
                        this.tagsUpdateOptions = tagsUpdateOptions;
                        this.buildOn(paper, tags);
                    }
                    buildOn(paper, tags) {
                        this.node = paper.g();
                        this.node.addClass("tagsLayer");
                        this.primaryTagRect = paper.rect(0, 0, this.boundRect.width, this.boundRect.height);
                        this.primaryTagRect.addClass("primaryTagRectStyle");
                        this.primaryTagText = paper.text(0, 0, "");
                        this.primaryTagText.addClass("primaryTagTextStyle");
                        this.textBox = this.primaryTagText.getBBox();
                        this.primaryTagTextBG = paper.rect(0, 0, 0, 0);
                        this.primaryTagTextBG.addClass("primaryTagTextBGStyle");
                        this.secondaryTagsGroup = paper.g();
                        this.secondaryTagsGroup.addClass("secondatyTagsLayer");
                        this.secondaryTags = [];
                        this.node.add(this.primaryTagRect);
                        this.node.add(this.primaryTagTextBG);
                        this.node.add(this.primaryTagText);
                        this.node.add(this.secondaryTagsGroup);
                        this.updateTags(tags, this.tagsUpdateOptions);
                    }
                    updateTags(tags, options) {
                        let keepPrimaryText = false;
                        if (this.tags && this.tags.primary && tags && tags.primary) {
                            keepPrimaryText = (tags.primary.name == this.tags.primary.name);
                        }
                        this.tags = tags;
                        this.redrawTagLabels(keepPrimaryText);
                        this.clearColors();
                        let showBackground = (options !== undefined) ? options.showRegionBackground : true;
                        this.applyColors(showBackground);
                    }
                    redrawTagLabels(keepPrimaryText = true) {
                        for (let i = 0; i < this.secondaryTags.length; i++) {
                            this.secondaryTags[i].remove();
                        }
                        this.secondaryTags = [];
                        if (this.tags) {
                            if (this.tags.primary !== undefined) {
                                if (!keepPrimaryText || this.textBox == undefined) {
                                    this.primaryTagText.node.innerHTML = this.tags.primary.name;
                                    this.textBox = this.primaryTagText.getBBox();
                                }
                                let showTextLabel = (this.textBox.width + 10 <= this.boundRect.width) && (this.textBox.height <= this.boundRect.height);
                                if (showTextLabel) {
                                    window.requestAnimationFrame(() => {
                                        this.primaryTagTextBG.attr({
                                            width: this.textBox.width + 10,
                                            height: this.textBox.height + 5
                                        });
                                        this.primaryTagText.attr({
                                            x: this.x + 5,
                                            y: this.y + this.textBox.height,
                                            visibility: "visible"
                                        });
                                    });
                                }
                                else {
                                    window.requestAnimationFrame(() => {
                                        this.primaryTagTextBG.attr({
                                            width: Math.min(10, this.boundRect.width),
                                            height: Math.min(10, this.boundRect.height)
                                        });
                                        this.primaryTagText.attr({
                                            x: this.x + 5,
                                            y: this.y + this.textBox.height,
                                            visibility: "hidden"
                                        });
                                    });
                                }
                            }
                            if (this.tags.secondary && this.tags.secondary.length > 0) {
                                let length = this.tags.secondary.length;
                                for (let i = 0; i < length; i++) {
                                    let stag = this.tags.secondary[i];
                                    let s = 6;
                                    let x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                                    let y = this.y - s - 5;
                                    let tagel = this.paper.rect(x, y, s, s);
                                    window.requestAnimationFrame(() => {
                                        tagel.addClass("secondaryTagStyle");
                                        tagel.addClass(`secondaryTag-${stag.name}`);
                                    });
                                    this.secondaryTagsGroup.add(tagel);
                                    this.secondaryTags.push(tagel);
                                }
                            }
                        }
                        else {
                            window.requestAnimationFrame(() => {
                                this.primaryTagText.node.innerHTML = "";
                                this.primaryTagTextBG.attr({
                                    width: 0,
                                    height: 0
                                });
                            });
                        }
                    }
                    clearColors() {
                        while (this.styleSheet.cssRules.length > 0) {
                            this.styleSheet.deleteRule(0);
                        }
                    }
                    applyColors(showRegionBackground = true) {
                        if (this.tags && this.tags.primary !== undefined) {
                            let styleMap = [
                                {
                                    rule: `.${this.styleId} .primaryTagRectStyle`,
                                    style: `fill: ${this.tags.primary.colorShadow};
                                stroke:${this.tags.primary.colorAccent};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                                },
                                {
                                    rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                                    style: `fill:${this.tags.primary.colorAccent};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .anchorStyle`,
                                    style: `stroke:${this.tags.primary.colorDark};
                                fill: ${this.tags.primary.colorPure}`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                                    style: `stroke:#fff;`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                                    style: `fill:transparent;`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                                    style: `fill:rgba(255,255,255,0.5);`
                                }
                            ];
                            let styleMapLight = [
                                {
                                    rule: `.${this.styleId} .primaryTagRectStyle`,
                                    style: `fill: ${this.tags.primary.colorNoColor};
                                stroke:${this.tags.primary.colorAccent};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                                },
                                {
                                    rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                                    style: `fill:${this.tags.primary.colorShadow};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .primaryTagTextStyle`,
                                    style: `opacity:0.25;`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                                    style: `opacity:0.25;`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .anchorStyle`,
                                    style: `stroke:${this.tags.primary.colorDark};
                                fill: ${this.tags.primary.colorPure}`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                                    style: `stroke:#fff;`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                                    style: `fill:transparent;`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .anchorStyle.ghost:hover`,
                                    style: `fill:rgba(255,255,255,0.5);`
                                }
                            ];
                            window.requestAnimationFrame(() => {
                                let sm = (showRegionBackground ? styleMap : styleMapLight);
                                for (let i = 0; i < sm.length; i++) {
                                    let r = sm[i];
                                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                                }
                                if (this.tags && this.tags.secondary.length > 0) {
                                    for (let i = 0; i < this.tags.secondary.length; i++) {
                                        let tag = this.tags.secondary[i];
                                        let rule = `.secondaryTagStyle.secondaryTag-${tag.name}{
                                fill: ${tag.colorAccent};
                            }`;
                                        this.styleSheet.insertRule(rule, 0);
                                    }
                                }
                            });
                        }
                    }
                    move(p) {
                        super.move(p);
                        let size = 6;
                        let cx = this.x + 0.5 * this.boundRect.width;
                        let cy = this.y - size - 5;
                        window.requestAnimationFrame(() => {
                            this.primaryTagRect.attr({
                                x: p.x,
                                y: p.y
                            });
                            this.primaryTagText.attr({
                                x: p.x + 5,
                                y: p.y + this.textBox.height
                            });
                            this.primaryTagTextBG.attr({
                                x: p.x + 1,
                                y: p.y + 1
                            });
                            if (this.secondaryTags && this.secondaryTags.length > 0) {
                                let length = this.secondaryTags.length;
                                for (let i = 0; i < length; i++) {
                                    let stag = this.secondaryTags[i];
                                    let x = cx + (2 * i - length + 0.5) * size;
                                    stag.attr({
                                        x: x,
                                        y: cy
                                    });
                                }
                            }
                        });
                    }
                    resize(width, height) {
                        super.resize(width, height);
                        window.requestAnimationFrame(() => {
                            this.primaryTagRect.attr({
                                width: width,
                                height: height
                            });
                        });
                        this.redrawTagLabels();
                    }
                }
                class DragElement extends RegionBase.RegionComponentPrototype {
                    constructor(paper, x, y, rect, paperRect = null, onChange, onManipulationBegin, onManipulationEnd) {
                        super(paper, paperRect);
                        this.isDragged = false;
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
                        this.subscribeToDragEvents();
                    }
                    buildOn(paper) {
                        this.node = paper.g();
                        this.node.addClass("dragLayer");
                        this.dragRect = paper.rect(0, 0, this.boundRect.width, this.boundRect.height);
                        this.dragRect.addClass("dragRectStyle");
                        this.node.add(this.dragRect);
                    }
                    move(p) {
                        super.move(p);
                        window.requestAnimationFrame(() => {
                            this.dragRect.attr({
                                x: p.x,
                                y: p.y
                            });
                        });
                    }
                    resize(width, height) {
                        super.resize(width, height);
                        window.requestAnimationFrame(() => {
                            this.dragRect.attr({
                                width: width,
                                height: height
                            });
                        });
                    }
                    rectDragBegin() {
                        this.dragOrigin = new Point2D(this.x, this.y);
                    }
                    rectDragMove(dx, dy) {
                        if (dx != 0 && dy != 0) {
                            let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);
                            if (this.paperRect !== null) {
                                p = p.boundToRect(this.paperRect);
                            }
                            this.onChange(p.x, p.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.MOVING);
                        }
                    }
                    ;
                    rectDragEnd() {
                        this.dragOrigin = null;
                        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.MOVEEND);
                    }
                    subscribeToDragEvents() {
                        this.dragRect.node.addEventListener("pointerenter", (e) => {
                            if (!this.isFrozen) {
                                this.dragRect.undrag();
                                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                                this.isDragged = true;
                                this.onManipulationBegin();
                            }
                        });
                        this.dragRect.node.addEventListener("pointermove", (e) => {
                            if (!this.isDragged && !this.isFrozen) {
                                this.dragRect.undrag();
                                this.dragRect.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                                this.isDragged = true;
                                this.onManipulationBegin();
                            }
                        });
                        this.dragRect.node.addEventListener("pointerleave", (e) => {
                            this.dragRect.undrag();
                            this.isDragged = false;
                            this.onManipulationEnd();
                        });
                        this.dragRect.node.addEventListener("pointerdown", (e) => {
                            if (!this.isFrozen) {
                                this.dragRect.node.setPointerCapture(e.pointerId);
                                let multiselection = e.shiftKey;
                                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.MOVEBEGIN, multiselection);
                            }
                        });
                        this.dragRect.node.addEventListener("pointerup", (e) => {
                            if (!this.isFrozen) {
                                this.dragRect.node.releasePointerCapture(e.pointerId);
                                let multiselection = e.shiftKey;
                                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.SELECTIONTOGGLE, multiselection);
                            }
                        });
                    }
                    freeze() {
                        super.freeze();
                        this.dragRect.undrag();
                        this.onManipulationEnd();
                    }
                }
                class RectRegion extends RegionBase.RegionComponentPrototype {
                    constructor(paper, rect, paperRect = null, id, tagsDescriptor, onManipulationBegin, onManipulationEnd, tagsUpdateOptions) {
                        super(paper, paperRect);
                        this.styleSheet = null;
                        this.isSelected = false;
                        this.boundRect = rect;
                        this.x = 0;
                        this.y = 0;
                        this.ID = id;
                        this.tags = tagsDescriptor;
                        if (paperRect !== null) {
                            this.paperRects = {
                                host: paperRect,
                                actual: new Rect(paperRect.width - rect.width, paperRect.height - rect.height)
                            };
                        }
                        if (onManipulationBegin !== undefined) {
                            this.onManipulationBegin = () => {
                                onManipulationBegin(this);
                            };
                        }
                        if (onManipulationEnd !== undefined) {
                            this.onManipulationEnd = () => {
                                onManipulationEnd(this);
                            };
                        }
                        this.regionID = this.s8();
                        this.styleID = `region_${this.regionID}_style`;
                        this.styleSheet = this.insertStyleSheet();
                        this.tagsUpdateOptions = tagsUpdateOptions;
                        this.buildOn(paper);
                    }
                    buildOn(paper) {
                        this.node = paper.g();
                        this.node.addClass("regionStyle");
                        this.node.addClass(this.styleID);
                        this.anchorsNode = new AnchorsElement(paper, this.x, this.y, this.boundRect, this.paperRects.host, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
                        this.dragNode = new DragElement(paper, this.x, this.y, this.boundRect, this.paperRects.actual, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
                        this.tagsNode = new TagsElement(paper, this.x, this.y, this.boundRect, this.paperRects.host, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
                        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
                        this.node.append(this.toolTip);
                        this.node.add(this.tagsNode.node);
                        this.node.add(this.dragNode.node);
                        this.node.add(this.anchorsNode.node);
                        this.UI = new Array(this.tagsNode, this.dragNode, this.anchorsNode);
                    }
                    s8() {
                        return Math.floor((1 + Math.random()) * 0x100000000)
                            .toString(16)
                            .substring(1);
                    }
                    insertStyleSheet() {
                        var style = document.createElement("style");
                        style.setAttribute("id", this.styleID);
                        document.head.appendChild(style);
                        return style.sheet;
                    }
                    removeStyles() {
                        document.getElementById(this.styleID).remove();
                    }
                    onInternalChange(x, y, width, height, state, multiSelection = false) {
                        if (this.x != x || this.y != y) {
                            this.move(new Point2D(x, y));
                        }
                        if (this.boundRect.width != width || this.boundRect.height != height) {
                            this.resize(width, height);
                        }
                        this.onChange(this, state, multiSelection);
                    }
                    updateTags(tags, options) {
                        this.tagsNode.updateTags(tags, options);
                        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
                    }
                    move(p) {
                        super.move(p);
                        this.UI.forEach((element) => {
                            element.move(p);
                        });
                    }
                    resize(width, height) {
                        super.resize(width, height);
                        this.area = width * height;
                        this.paperRects.actual.width = this.paperRects.host.width - width;
                        this.paperRects.actual.height = this.paperRects.host.height - height;
                        this.UI.forEach((element) => {
                            element.resize(width, height);
                        });
                    }
                    select() {
                        this.isSelected = true;
                        this.node.addClass("selected");
                    }
                    unselect() {
                        this.isSelected = false;
                        this.node.removeClass("selected");
                    }
                    freeze() {
                        if (!this.isFrozen) {
                            this.isFrozen = true;
                            this.node.addClass('old');
                            this.dragNode.freeze();
                            this.anchorsNode.freeze();
                        }
                    }
                    unfreeze() {
                        if (this.isFrozen) {
                            this.isFrozen = false;
                            this.node.removeClass('old');
                            this.dragNode.unfreeze();
                            this.anchorsNode.unfreeze();
                        }
                    }
                }
                RectRegion_1.RectRegion = RectRegion;
            })(RectRegion = Region.RectRegion || (Region.RectRegion = {}));
        })(Region = CanvasTools.Region || (CanvasTools.Region = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("Regions/CanvasTools.Regions.PointRegion", ["require", "exports", "Base/CanvasTools.Base.Rect", "Base/CanvasTools.Base.Point2D", "Regions/CanvasTools.Regions.Base", "snapsvg"], function (require, exports, CTBaseRect, CTBasePoint, CTRegion, Snap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
    var Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
    var RegionBase = CTRegion.CanvasTools.Region.RegionBase;
    var CanvasTools;
    (function (CanvasTools) {
        var Region;
        (function (Region) {
            var PointRegion;
            (function (PointRegion_1) {
                class TagsElement extends RegionBase.RegionComponentPrototype {
                    constructor(paper, x, y, paperRect, tags, styleId, styleSheet, tagsUpdateOptions) {
                        super(paper, paperRect);
                        this.radius = 3;
                        this.styleSheet = null;
                        this.boundRect = new Rect(0, 0);
                        this.x = x;
                        this.y = y;
                        this.styleId = styleId;
                        this.styleSheet = styleSheet;
                        this.tagsUpdateOptions = tagsUpdateOptions;
                        this.buildOn(paper, tags);
                    }
                    buildOn(paper, tags) {
                        this.node = paper.g();
                        this.node.addClass("tagsLayer");
                        this.primaryTagPoint = paper.circle(0, 0, this.radius);
                        this.primaryTagPoint.addClass("primaryTagPointStyle");
                        this.secondaryTagsGroup = paper.g();
                        this.secondaryTagsGroup.addClass("secondatyTagsLayer");
                        this.secondaryTags = [];
                        this.node.add(this.primaryTagPoint);
                        this.node.add(this.secondaryTagsGroup);
                        this.updateTags(tags, this.tagsUpdateOptions);
                    }
                    updateTags(tags, options) {
                        this.tags = tags;
                        this.redrawTagLabels();
                        this.clearColors();
                        let showBackground = (options !== undefined) ? options.showRegionBackground : true;
                        this.applyColors(showBackground);
                    }
                    redrawTagLabels() {
                        for (let i = 0; i < this.secondaryTags.length; i++) {
                            this.secondaryTags[i].remove();
                        }
                        this.secondaryTags = [];
                        if (this.tags) {
                            if (this.tags.primary !== undefined) {
                            }
                            if (this.tags.secondary && this.tags.secondary.length > 0) {
                                let length = this.tags.secondary.length;
                                for (let i = 0; i < length; i++) {
                                    let stag = this.tags.secondary[i];
                                    let s = 6;
                                    let x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                                    let y = this.y - s - 5;
                                    let tagel = this.paper.rect(x, y, s, s);
                                    window.requestAnimationFrame(() => {
                                        tagel.addClass("secondaryTagStyle");
                                        tagel.addClass(`secondaryTag-${stag.name}`);
                                    });
                                    this.secondaryTagsGroup.add(tagel);
                                    this.secondaryTags.push(tagel);
                                }
                            }
                        }
                    }
                    clearColors() {
                        while (this.styleSheet.cssRules.length > 0) {
                            this.styleSheet.deleteRule(0);
                        }
                    }
                    applyColors(showRegionBackground = true) {
                        if (this.tags && this.tags.primary !== undefined) {
                            let styleMap = [
                                {
                                    rule: `.${this.styleId} .primaryTagPointStyle`,
                                    style: `fill: ${this.tags.primary.colorAccent};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                                },
                                {
                                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                                    style: `fill: ${this.tags.primary.colorAccent};
                                stroke:${this.tags.primary.colorHighlight};`
                                }
                            ];
                            let styleMapLight = [
                                {
                                    rule: `.${this.styleId} .primaryTagPointStyle`,
                                    style: `fill: ${this.tags.primary.colorNoColor};
                                stroke:${this.tags.primary.colorAccent};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                                    style: `fill: ${this.tags.primary.colorHighlight}; 
                                stroke: #fff;`
                                },
                                {
                                    rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                                    style: `fill: ${this.tags.primary.colorHighlight};
                                stroke:${this.tags.primary.colorAccent};`
                                },
                                {
                                    rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                                    style: `opacity:0.25;`
                                }
                            ];
                            window.requestAnimationFrame(() => {
                                let sm = (showRegionBackground ? styleMap : styleMapLight);
                                for (let i = 0; i < sm.length; i++) {
                                    let r = sm[i];
                                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                                }
                                if (this.tags && this.tags.secondary.length > 0) {
                                    for (let i = 0; i < this.tags.secondary.length; i++) {
                                        let tag = this.tags.secondary[i];
                                        let rule = `.secondaryTagStyle.secondaryTag-${tag.name}{
                                fill: ${tag.colorAccent};
                            }`;
                                        this.styleSheet.insertRule(rule, 0);
                                    }
                                }
                            });
                        }
                    }
                    move(p) {
                        super.move(p);
                        let size = 6;
                        let cx = this.x;
                        let cy = this.y - size - 5;
                        window.requestAnimationFrame(() => {
                            this.primaryTagPoint.attr({
                                cx: p.x,
                                cy: p.y
                            });
                            if (this.secondaryTags && this.secondaryTags.length > 0) {
                                let length = this.secondaryTags.length;
                                for (let i = 0; i < length; i++) {
                                    let stag = this.secondaryTags[i];
                                    let x = cx + (2 * i - length + 0.5) * size;
                                    stag.attr({
                                        x: x,
                                        y: cy
                                    });
                                }
                            }
                        });
                    }
                    resize(width, height) {
                    }
                }
                class DragElement extends RegionBase.RegionComponentPrototype {
                    constructor(paper, x, y, paperRect = null, onChange, onManipulationBegin, onManipulationEnd) {
                        super(paper, paperRect);
                        this.isDragged = false;
                        this.radius = 7;
                        this.x = x;
                        this.y = y;
                        this.boundRect = new Rect(0, 0);
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
                        this.subscribeToDragEvents();
                    }
                    buildOn(paper) {
                        this.node = paper.g();
                        this.node.addClass("dragLayer");
                        this.dragPoint = paper.circle(0, 0, this.radius);
                        this.dragPoint.addClass("dragPointStyle");
                        this.node.add(this.dragPoint);
                    }
                    move(p) {
                        super.move(p);
                        window.requestAnimationFrame(() => {
                            this.dragPoint.attr({
                                cx: p.x,
                                cy: p.y
                            });
                        });
                    }
                    resize(width, height) {
                    }
                    rectDragBegin() {
                        this.dragOrigin = new Point2D(this.x, this.y);
                    }
                    rectDragMove(dx, dy) {
                        if (dx != 0 && dy != 0) {
                            let p = new Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);
                            if (this.paperRect !== null) {
                                p = p.boundToRect(this.paperRect);
                            }
                            this.onChange(p.x, p.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.MOVING);
                        }
                    }
                    ;
                    rectDragEnd() {
                        this.dragOrigin = null;
                        this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.MOVEEND);
                    }
                    subscribeToDragEvents() {
                        this.dragPoint.node.addEventListener("pointerenter", (e) => {
                            if (!this.isFrozen) {
                                this.dragPoint.undrag();
                                this.dragPoint.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                                this.isDragged = true;
                                this.onManipulationBegin();
                            }
                        });
                        this.dragPoint.node.addEventListener("pointermove", (e) => {
                            if (!this.isDragged && !this.isFrozen) {
                                this.dragPoint.undrag();
                                this.dragPoint.drag(this.rectDragMove.bind(this), this.rectDragBegin.bind(this), this.rectDragEnd.bind(this));
                                this.isDragged = true;
                                this.onManipulationBegin();
                            }
                        });
                        this.dragPoint.node.addEventListener("pointerleave", (e) => {
                            this.dragPoint.undrag();
                            this.isDragged = false;
                            this.onManipulationEnd();
                        });
                        this.dragPoint.node.addEventListener("pointerdown", (e) => {
                            if (!this.isFrozen) {
                                this.dragPoint.node.setPointerCapture(e.pointerId);
                                let multiselection = e.shiftKey;
                                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.MOVEBEGIN, multiselection);
                            }
                        });
                        this.dragPoint.node.addEventListener("pointerup", (e) => {
                            if (!this.isFrozen) {
                                this.dragPoint.node.releasePointerCapture(e.pointerId);
                                let multiselection = e.shiftKey;
                                this.onChange(this.x, this.y, this.boundRect.width, this.boundRect.height, RegionBase.ChangeEventType.SELECTIONTOGGLE, multiselection);
                            }
                        });
                    }
                    freeze() {
                        super.freeze();
                        this.dragPoint.undrag();
                        this.onManipulationEnd();
                    }
                }
                class PointRegion extends RegionBase.RegionComponentPrototype {
                    constructor(paper, paperRect = null, id, tagsDescriptor, onManipulationBegin, onManipulationEnd, tagsUpdateOptions) {
                        super(paper, paperRect);
                        this.styleSheet = null;
                        this.isSelected = false;
                        this.boundRect = new Rect(0, 0);
                        this.x = 0;
                        this.y = 0;
                        this.area = 1.0;
                        this.ID = id;
                        this.tags = tagsDescriptor;
                        if (onManipulationBegin !== undefined) {
                            this.onManipulationBegin = () => {
                                onManipulationBegin(this);
                            };
                        }
                        if (onManipulationEnd !== undefined) {
                            this.onManipulationEnd = () => {
                                onManipulationEnd(this);
                            };
                        }
                        this.regionID = this.s8();
                        this.styleID = `region_${this.regionID}_style`;
                        this.styleSheet = this.insertStyleSheet();
                        this.tagsUpdateOptions = tagsUpdateOptions;
                        this.buildOn(paper);
                    }
                    buildOn(paper) {
                        this.node = paper.g();
                        this.node.addClass("regionStyle");
                        this.node.addClass(this.styleID);
                        this.dragNode = new DragElement(paper, this.x, this.y, this.paperRect, this.onInternalChange.bind(this), this.onManipulationBegin, this.onManipulationEnd);
                        this.tagsNode = new TagsElement(paper, this.x, this.y, this.paperRect, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
                        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
                        this.node.append(this.toolTip);
                        this.node.add(this.dragNode.node);
                        this.node.add(this.tagsNode.node);
                        this.UI = new Array(this.tagsNode, this.dragNode);
                    }
                    s8() {
                        return Math.floor((1 + Math.random()) * 0x100000000)
                            .toString(16)
                            .substring(1);
                    }
                    insertStyleSheet() {
                        var style = document.createElement("style");
                        style.setAttribute("id", this.styleID);
                        document.head.appendChild(style);
                        return style.sheet;
                    }
                    removeStyles() {
                        document.getElementById(this.styleID).remove();
                    }
                    onInternalChange(x, y, width, height, state, multiSelection = false) {
                        if (this.x != x || this.y != y) {
                            this.move(new Point2D(x, y));
                        }
                        if (this.boundRect.width != width || this.boundRect.height != height) {
                            this.resize(width, height);
                        }
                        this.onChange(this, state, multiSelection);
                    }
                    updateTags(tags, options) {
                        this.tagsNode.updateTags(tags, options);
                        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
                    }
                    move(p) {
                        super.move(p);
                        this.UI.forEach((element) => {
                            element.move(p);
                        });
                    }
                    resize(width, height) {
                    }
                    select() {
                        this.isSelected = true;
                        this.node.addClass("selected");
                    }
                    unselect() {
                        this.isSelected = false;
                        this.node.removeClass("selected");
                    }
                    freeze() {
                        if (!this.isFrozen) {
                            this.isFrozen = true;
                            this.node.addClass('old');
                            this.dragNode.freeze();
                        }
                    }
                    unfreeze() {
                        if (this.isFrozen) {
                            this.isFrozen = false;
                            this.node.removeClass('old');
                            this.dragNode.unfreeze();
                        }
                    }
                }
                PointRegion_1.PointRegion = PointRegion;
            })(PointRegion = Region.PointRegion || (Region.PointRegion = {}));
        })(Region = CanvasTools.Region || (CanvasTools.Region = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("Regions/CanvasTools.Regions.RegionMenu", ["require", "exports", "Regions/CanvasTools.Regions.Base", "snapsvg"], function (require, exports, CTRegion, Snap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RegionBase = CTRegion.CanvasTools.Region.RegionBase;
    var CanvasTools;
    (function (CanvasTools) {
        var Region;
        (function (Region) {
            var RegionMenu;
            (function (RegionMenu) {
                class MenuElement extends RegionBase.RegionComponentPrototype {
                    constructor(paper, x, y, rect, paperRect = null, onManipulationBegin, onManipulationEnd) {
                        super(paper, paperRect);
                        this.menuItemSize = 20;
                        this.mw = this.menuItemSize + 10;
                        this.mh = 60;
                        this.dh = 20;
                        this.dw = 5;
                        this.pathCollection = {
                            "delete": {
                                path: "M 83.4 21.1 L 74.9 12.6 L 48 39.5 L 21.1 12.6 L 12.6 21.1 L 39.5 48 L 12.6 74.9 L 21.1 83.4 L 48 56.5 L 74.9 83.4 L 83.4 74.9 L 56.5 48 Z",
                                iconSize: 96
                            }
                        };
                        this.boundRect = rect;
                        this.x = x;
                        this.y = y;
                        if (onManipulationBegin !== undefined) {
                            this.onManipulationBegin = onManipulationBegin;
                        }
                        if (onManipulationEnd !== undefined) {
                            this.onManipulationEnd = onManipulationEnd;
                        }
                        this.buildOn(this.paper);
                    }
                    buildOn(paper) {
                        let menuSVG = this.paper.svg(this.mx, this.my, this.mw, this.mh, this.mx, this.my, this.mw, this.mh);
                        this.menuGroup = Snap(menuSVG).paper;
                        this.menuGroup.addClass("menuLayer");
                        this.rearrangeMenuPosition();
                        this.menuRect = this.menuGroup.rect(0, 0, this.mw, this.mh, 5, 5);
                        this.menuRect.addClass("menuRectStyle");
                        this.menuItemsGroup = this.menuGroup.g();
                        this.menuItemsGroup.addClass("menuItems");
                        this.menuItems = new Array();
                        this.menuGroup.add(this.menuRect);
                        this.menuGroup.add(this.menuItemsGroup);
                        this.menuGroup.mouseover((e) => {
                            this.onManipulationBegin();
                        });
                        this.menuGroup.mouseout((e) => {
                            this.onManipulationEnd();
                        });
                    }
                    addAction(action, icon, actor) {
                        let item = this.menuGroup.g();
                        let itemBack = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
                        itemBack.addClass("menuItemBack");
                        let k = (this.menuItemSize - 4) / this.pathCollection.delete.iconSize;
                        let itemIcon = this.menuGroup.path(this.pathCollection.delete.path);
                        itemIcon.transform(`scale(0.2) translate(26 26)`);
                        itemIcon.addClass("menuIcon");
                        itemIcon.addClass("menuIcon-" + icon);
                        let itemRect = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
                        itemRect.addClass("menuItem");
                        item.add(itemBack);
                        item.add(itemIcon);
                        item.add(itemRect);
                        item.click((e) => {
                            actor(this.region);
                        });
                        this.menuItemsGroup.add(item);
                        this.menuItems.push(item);
                    }
                    rearrangeMenuPosition() {
                        if (this.mh <= this.boundRect.height - this.dh) {
                            this.my = this.y + this.boundRect.height / 2 - this.mh / 2;
                            if (this.x + this.boundRect.width + this.mw / 2 + this.dw < this.paperRect.width) {
                                this.mx = this.x + this.boundRect.width - this.mw / 2;
                            }
                            else if (this.x - this.mw / 2 - this.dw > 0) {
                                this.mx = this.x - this.mw / 2;
                            }
                            else {
                                this.mx = this.x + this.boundRect.width - this.mw - this.dw;
                            }
                        }
                        else {
                            if (this.y + this.mh > this.paperRect.height) {
                                this.my = this.paperRect.height - this.mh - this.dw;
                            }
                            else {
                                this.my = this.y;
                            }
                            if (this.x + this.boundRect.width + this.mw + 2 * this.dw < this.paperRect.width) {
                                this.mx = this.x + this.boundRect.width + this.dw;
                            }
                            else if (this.x - this.mw - 2 * this.dw > 0) {
                                this.mx = this.x - this.mw - this.dw;
                            }
                            else {
                                this.mx = this.x + this.boundRect.width - this.mw - this.dw;
                            }
                        }
                    }
                    attachTo(region) {
                        this.region = region;
                        this.x = region.x;
                        this.y = region.y;
                        this.boundRect = region.boundRect;
                        this.rearrangeMenuPosition();
                        window.requestAnimationFrame(() => {
                            this.menuGroup.attr({
                                x: this.mx,
                                y: this.my
                            });
                        });
                    }
                    move(p) {
                        super.move(p);
                        this.rearrangeMenuPosition();
                        window.requestAnimationFrame(() => {
                            this.menuGroup.attr({
                                x: this.mx,
                                y: this.my
                            });
                        });
                    }
                    resize(width, height) {
                        super.resize(width, height);
                        this.rearrangeMenuPosition();
                        window.requestAnimationFrame(() => {
                            this.menuGroup.attr({
                                x: this.mx,
                                y: this.my
                            });
                        });
                    }
                    hide() {
                        window.requestAnimationFrame(() => {
                            this.menuGroup.attr({
                                visibility: 'hidden'
                            });
                        });
                    }
                    show() {
                        window.requestAnimationFrame(() => {
                            this.menuGroup.attr({
                                visibility: 'visible'
                            });
                        });
                    }
                    showOnRegion(region) {
                        this.attachTo(region);
                        this.show();
                    }
                }
                RegionMenu.MenuElement = MenuElement;
            })(RegionMenu = Region.RegionMenu || (Region.RegionMenu = {}));
        })(Region = CanvasTools.Region || (CanvasTools.Region = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("Regions/CanvasTools.Regions.RegionsManager", ["require", "exports", "Base/CanvasTools.Base.Rect", "Base/CanvasTools.Base.Point2D", "Regions/CanvasTools.Regions.Base", "Regions/CanvasTools.Regions.RectRegion", "Regions/CanvasTools.Regions.PointRegion", "Regions/CanvasTools.Regions.RegionMenu", "snapsvg"], function (require, exports, CTBaseRect, CTBasePoint, CTRegion, CTRectRegion, CTPointRegion, CTRegionMenu, Snap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
    var Point2D = CTBasePoint.CanvasTools.Base.Point.Point2D;
    var RegionBase = CTRegion.CanvasTools.Region.RegionBase;
    var RectRegion = CTRectRegion.CanvasTools.Region.RectRegion.RectRegion;
    var PointRegion = CTPointRegion.CanvasTools.Region.PointRegion.PointRegion;
    var MenuElement = CTRegionMenu.CanvasTools.Region.RegionMenu.MenuElement;
    var CanvasTools;
    (function (CanvasTools) {
        var Region;
        (function (Region) {
            class RegionsManager {
                constructor(svgHost, onManipulationBegin, onManipulationEnd) {
                    this.__isFrozen = false;
                    this.tagsUpdateOptions = {
                        showRegionBackground: true
                    };
                    this.justManipulated = false;
                    this.baseParent = svgHost;
                    this.paper = Snap(svgHost);
                    this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
                    this.regions = new Array();
                    this.onManipulationBegin = onManipulationBegin;
                    this.onManipulationEnd = onManipulationEnd;
                    this.buildOn(this.paper);
                    this.subscribeToEvents();
                }
                get isFrozen() {
                    return this.__isFrozen;
                }
                buildOn(paper) {
                    this.regionManagerLayer = paper.g();
                    this.regionManagerLayer.addClass("regionManager");
                    this.menuLayer = paper.g();
                    this.menuLayer.addClass("menuManager");
                    this.menu = new MenuElement(paper, 0, 0, new Rect(0, 0), this.paperRect, this.onManipulationBegin_local.bind(this), this.onManipulationEnd_local.bind(this));
                    this.menu.addAction("delete", "trash", (region) => {
                        this.deleteRegion(region);
                        this.menu.hide();
                    });
                    this.menuLayer.add(this.menu.menuGroup);
                    this.menu.hide();
                }
                subscribeToEvents() {
                    this.regionManagerLayer.mouseover((e) => {
                        this.onManipulationBegin();
                    });
                    this.regionManagerLayer.mouseout((e) => {
                        this.onManipulationEnd();
                    });
                    window.addEventListener("keyup", (e) => {
                        if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
                            if (!this.isFrozen) {
                                switch (e.keyCode) {
                                    case 9:
                                        this.selectNextRegion();
                                        break;
                                    case 46:
                                    case 8:
                                        this.deleteSelectedRegions();
                                        break;
                                    case 38:
                                        if (e.ctrlKey) {
                                            if (!e.shiftKey && !e.altKey) {
                                                this.moveSelectedRegions(0, -5);
                                            }
                                            else if (e.shiftKey && !e.altKey) {
                                                this.resizeSelectedRegions(0, -5);
                                            }
                                            else if (e.altKey && !e.shiftKey) {
                                                this.resizeSelectedRegions(0, -5, true);
                                            }
                                        }
                                        break;
                                    case 40:
                                        if (e.ctrlKey) {
                                            if (!e.shiftKey && !e.altKey) {
                                                this.moveSelectedRegions(0, 5);
                                            }
                                            else if (e.shiftKey && !e.altKey) {
                                                this.resizeSelectedRegions(0, 5);
                                            }
                                            else if (e.altKey && !e.shiftKey) {
                                                this.resizeSelectedRegions(0, 5, true);
                                            }
                                        }
                                        break;
                                    case 37:
                                        if (e.ctrlKey) {
                                            if (!e.shiftKey && !e.altKey) {
                                                this.moveSelectedRegions(-5, 0);
                                            }
                                            else if (e.shiftKey && !e.altKey) {
                                                this.resizeSelectedRegions(-5, 0);
                                            }
                                            else if (e.altKey && !e.shiftKey) {
                                                this.resizeSelectedRegions(-5, 0, true);
                                            }
                                        }
                                        break;
                                    case 39:
                                        if (e.ctrlKey) {
                                            if (!e.shiftKey && !e.altKey) {
                                                this.moveSelectedRegions(5, 0);
                                            }
                                            else if (e.shiftKey && !e.altKey) {
                                                this.resizeSelectedRegions(5, 0);
                                            }
                                            else if (e.altKey && !e.shiftKey) {
                                                this.resizeSelectedRegions(5, 0, true);
                                            }
                                        }
                                        break;
                                    default: return;
                                }
                                e.preventDefault();
                            }
                        }
                    });
                    window.addEventListener("keydown", (e) => {
                        if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
                            if (!this.isFrozen) {
                                switch (e.code) {
                                    case "KeyA":
                                    case "Numpad1":
                                        if (e.ctrlKey) {
                                            this.selectAllRegions();
                                        }
                                        break;
                                    case "KeyB":
                                        if (e.ctrlKey) {
                                            this.toggleBackground();
                                        }
                                        break;
                                    default: return;
                                }
                            }
                        }
                    });
                }
                addRectRegion(id, pointA, pointB, tagsDescriptor) {
                    this.menu.hide();
                    let x = (pointA.x < pointB.x) ? pointA.x : pointB.x;
                    let y = (pointA.y < pointB.y) ? pointA.y : pointB.y;
                    let w = Math.abs(pointA.x - pointB.x);
                    let h = Math.abs(pointA.y - pointB.y);
                    let region = new RectRegion(this.paper, new Rect(w, h), this.paperRect, id, tagsDescriptor, this.onManipulationBegin_local.bind(this), this.onManipulationEnd_local.bind(this), this.tagsUpdateOptions);
                    region.area = w * h;
                    region.move(new Point2D(x, y));
                    region.onChange = this.onRegionUpdate.bind(this);
                    this.unselectRegions();
                    region.select();
                    this.regionManagerLayer.add(region.node);
                    this.regions.push(region);
                    this.menu.showOnRegion(region);
                }
                addPointRegion(id, point, tagsDescriptor) {
                    this.menu.hide();
                    let region = new PointRegion(this.paper, this.paperRect, id, tagsDescriptor, this.onManipulationBegin_local.bind(this), this.onManipulationEnd_local.bind(this), this.tagsUpdateOptions);
                    region.move(point);
                    region.onChange = this.onRegionUpdate.bind(this);
                    this.unselectRegions();
                    region.select();
                    this.regionManagerLayer.add(region.node);
                    this.regions.push(region);
                    this.menu.showOnRegion(region);
                }
                drawRegion(x, y, rect, id, tagsDescriptor) {
                    this.menu.hide();
                    let region = new RectRegion(this.paper, rect, this.paperRect, id, tagsDescriptor, this.onManipulationBegin_local.bind(this), this.onManipulationEnd_local.bind(this), this.tagsUpdateOptions);
                    region.area = rect.height * rect.width;
                    region.move(new Point2D(x, y));
                    region.onChange = this.onRegionUpdate.bind(this);
                    region.updateTags(region.tags, this.tagsUpdateOptions);
                    this.regionManagerLayer.add(region.node);
                    this.regions.push(region);
                    if (this.regions.length > 1) {
                        this.sortRegionsByArea();
                        this.redrawAllRegions();
                    }
                }
                redrawAllRegions() {
                    let sr = this.regions;
                    window.requestAnimationFrame((e) => {
                        this.regions.forEach((region) => {
                            let node = region.node.remove();
                            this.regionManagerLayer.add(node);
                        });
                    });
                }
                sortRegionsByArea() {
                    function quickSort(arr, left, right) {
                        var pivot, partitionIndex;
                        if (left < right) {
                            pivot = right;
                            partitionIndex = partition(arr, pivot, left, right);
                            quickSort(arr, left, partitionIndex - 1);
                            quickSort(arr, partitionIndex + 1, right);
                        }
                        return arr;
                    }
                    function partition(arr, pivot, left, right) {
                        var pivotValue = arr[pivot].area, partitionIndex = left;
                        for (var i = left; i < right; i++) {
                            if (arr[i].area > pivotValue) {
                                swap(arr, i, partitionIndex);
                                partitionIndex++;
                            }
                        }
                        swap(arr, right, partitionIndex);
                        return partitionIndex;
                    }
                    function swap(arr, i, j) {
                        var temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                    }
                    let length = this.regions.length;
                    if (length > 1) {
                        quickSort(this.regions, 0, this.regions.length - 1);
                    }
                }
                lookupRegionByID(id) {
                    let region = null;
                    let i = 0;
                    while (i < this.regions.length && region == null) {
                        if (this.regions[i].ID == id) {
                            region = this.regions[i];
                        }
                        i++;
                    }
                    return region;
                }
                lookupSelectedRegions() {
                    let collection = Array();
                    for (var i = 0; i < this.regions.length; i++) {
                        if (this.regions[i].isSelected) {
                            collection.push(this.regions[i]);
                        }
                    }
                    return collection;
                }
                getSelectedRegionsBounds() {
                    let regions = this.lookupSelectedRegions().map((region) => {
                        return {
                            id: region.ID,
                            x: region.x,
                            y: region.y,
                            width: region.boundRect.width,
                            height: region.boundRect.height
                        };
                    });
                    return regions;
                }
                deleteRegion(region) {
                    region.removeStyles();
                    region.node.remove();
                    this.regions = this.regions.filter((r) => { return r != region; });
                    if ((typeof this.onRegionDelete) == "function") {
                        this.onRegionDelete(region.ID);
                    }
                }
                deleteSelectedRegions() {
                    let collection = this.lookupSelectedRegions();
                    for (var i = 0; i < collection.length; i++) {
                        this.deleteRegion(collection[i]);
                    }
                    this.menu.hide();
                    this.selectNextRegion();
                    this.onManipulationEnd();
                }
                deleteRegionById(id) {
                    let region = this.lookupRegionByID(id);
                    if (region != null) {
                        this.deleteRegion(region);
                    }
                    this.menu.hide();
                    this.onManipulationEnd();
                }
                deleteAllRegions() {
                    for (let i = 0; i < this.regions.length; i++) {
                        let r = this.regions[i];
                        r.removeStyles();
                        r.node.remove();
                    }
                    this.regions = [];
                    this.menu.hide();
                }
                updateTagsById(id, tagsDescriptor) {
                    let region = this.lookupRegionByID(id);
                    if (region != null) {
                        region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
                    }
                }
                updateTagsForSelectedRegions(tagsDescriptor) {
                    let regions = this.lookupSelectedRegions();
                    regions.forEach(region => {
                        region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
                    });
                }
                selectRegion(region) {
                    if (region != null) {
                        this.unselectRegions(region);
                        region.select();
                        this.menu.showOnRegion(region);
                        if ((typeof this.onRegionSelected) == "function") {
                            this.onRegionSelected(region.ID);
                        }
                    }
                }
                selectAllRegions() {
                    let r = null;
                    for (let i = 0; i < this.regions.length; i++) {
                        let r = this.regions[i];
                        r.select();
                        if ((typeof this.onRegionSelected) == "function") {
                            this.onRegionSelected(r.ID);
                        }
                    }
                    if (r != null) {
                        this.menu.showOnRegion(r);
                    }
                }
                selectRegionById(id) {
                    let region = this.lookupRegionByID(id);
                    this.selectRegion(region);
                }
                selectNextRegion() {
                    let region = null;
                    let i = 0;
                    let length = this.regions.length;
                    if (length == 1) {
                        region = this.regions[0];
                    }
                    else if (length > 1) {
                        while (i < length && region == null) {
                            if (this.regions[i].isSelected) {
                                region = (i == length - 1) ? this.regions[0] : this.regions[i + 1];
                            }
                            i++;
                        }
                    }
                    if (region == null && length > 0) {
                        region = this.regions[0];
                    }
                    this.selectRegion(region);
                }
                reshapeRegion(region, dx, dy, dw, dh, inverse = false) {
                    let w;
                    let h;
                    let x;
                    let y;
                    if (!inverse) {
                        w = region.boundRect.width + Math.abs(dw);
                        h = region.boundRect.height + Math.abs(dh);
                        x = region.x + dx + (dw > 0 ? 0 : dw);
                        y = region.y + dy + (dh > 0 ? 0 : dh);
                    }
                    else {
                        w = Math.max(0, region.boundRect.width - Math.abs(dw));
                        h = Math.max(0, region.boundRect.height - Math.abs(dh));
                        x = region.x + dx + (dw < 0 ? 0 : dw);
                        y = region.y + dy + (dh < 0 ? 0 : dh);
                    }
                    let p1 = new Point2D(x, y).boundToRect(this.paperRect);
                    let p2 = new Point2D(x + w, y + h).boundToRect(this.paperRect);
                    region.move(p1);
                    region.resize(p2.x - p1.x, p2.y - p1.y);
                }
                moveSelectedRegions(dx, dy) {
                    let regions = this.lookupSelectedRegions();
                    regions.forEach(r => {
                        this.reshapeRegion(r, dx, dy, 0, 0);
                    });
                    this.menu.showOnRegion(regions[0]);
                }
                resizeSelectedRegions(dw, dh, inverse = false) {
                    let regions = this.lookupSelectedRegions();
                    regions.forEach(r => {
                        this.reshapeRegion(r, 0, 0, dw, dh, inverse);
                    });
                    this.menu.showOnRegion(regions[0]);
                }
                resize(width, height) {
                    let tw = width / this.paperRect.width;
                    let th = height / this.paperRect.height;
                    this.paperRect.resize(width, height);
                    this.menu.hide();
                    for (var i = 0; i < this.regions.length; i++) {
                        let r = this.regions[i];
                        r.move(new Point2D(r.x * tw, r.y * th));
                        r.resize(r.boundRect.width * tw, r.boundRect.height * th);
                    }
                }
                onManipulationBegin_local(region) {
                    this.onManipulationBegin();
                }
                onManipulationEnd_local(region) {
                    this.onManipulationEnd();
                }
                onRegionUpdate(region, state, multiSelection) {
                    if (state === RegionBase.ChangeEventType.MOVEBEGIN) {
                        if (!multiSelection) {
                            this.unselectRegions(region);
                        }
                        this.menu.hide();
                        if ((typeof this.onRegionSelected) == "function") {
                            this.onRegionSelected(region.ID);
                        }
                        this.justManipulated = false;
                    }
                    else if (state === RegionBase.ChangeEventType.MOVING) {
                        if ((typeof this.onRegionMove) == "function") {
                            this.onRegionMove(region.ID, region.x, region.y, region.boundRect.width, region.boundRect.height);
                        }
                        this.justManipulated = true;
                    }
                    else if (state === RegionBase.ChangeEventType.MOVEEND) {
                        if (this.justManipulated) {
                            region.select();
                            this.menu.showOnRegion(region);
                            this.sortRegionsByArea();
                            this.redrawAllRegions();
                        }
                    }
                    else if (state === RegionBase.ChangeEventType.SELECTIONTOGGLE && !this.justManipulated) {
                        if (!region.isSelected) {
                            if (!multiSelection) {
                                this.unselectRegions(region);
                            }
                            region.select();
                            this.menu.showOnRegion(region);
                            if ((typeof this.onRegionSelected) == "function") {
                                this.onRegionSelected(region.ID);
                            }
                        }
                        else {
                            region.unselect();
                            this.menu.hide();
                            if ((typeof this.onRegionSelected) == "function") {
                                this.onRegionSelected("");
                            }
                        }
                    }
                }
                unselectRegions(except) {
                    for (var i = 0; i < this.regions.length; i++) {
                        let r = this.regions[i];
                        if (r != except) {
                            r.unselect();
                        }
                    }
                }
                toggleBackground() {
                    this.tagsUpdateOptions.showRegionBackground = !this.tagsUpdateOptions.showRegionBackground;
                    this.regions.forEach((r) => {
                        r.updateTags(r.tags, this.tagsUpdateOptions);
                    });
                }
                freeze(nuance) {
                    this.regionManagerLayer.addClass("frozen");
                    if (nuance !== undefined) {
                        this.regionManagerLayer.addClass(nuance);
                        this.frozenNuance = nuance;
                    }
                    else {
                        this.frozenNuance = "";
                    }
                    this.menu.hide();
                    this.regions.forEach((region) => {
                        region.freeze();
                    });
                    this.__isFrozen = true;
                }
                unfreeze() {
                    this.regionManagerLayer.removeClass("frozen");
                    if (this.frozenNuance !== "") {
                        this.regionManagerLayer.removeClass(this.frozenNuance);
                    }
                    let selectedRegions = this.lookupSelectedRegions();
                    if (selectedRegions.length > 0) {
                        this.menu.showOnRegion(selectedRegions[0]);
                    }
                    this.regions.forEach((region) => {
                        region.unfreeze();
                    });
                    this.__isFrozen = false;
                }
                toggleFreezeMode() {
                    if (this.isFrozen) {
                        this.unfreeze();
                    }
                    else {
                        this.freeze();
                    }
                }
            }
            Region.RegionsManager = RegionsManager;
        })(Region = CanvasTools.Region || (CanvasTools.Region = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("CanvasTools.Editor", ["require", "exports", "Base/CanvasTools.Base.Rect", "CanvasTools.Selection", "Regions/CanvasTools.Regions.RegionsManager", "CanvasTools.Toolbar", "CanvasTools.Filter"], function (require, exports, CTBaseRect, CTSelection, CTRegionMgr, CTToolbar, CTFilter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;
    var Selection = CTSelection.CanvasTools.Selection;
    var RegionsManager = CTRegionMgr.CanvasTools.Region.RegionsManager;
    var Toolbar = CTToolbar.CanvasTools.Toolbar;
    var Filter = CTFilter.CanvasTools.Filter;
    var CanvasTools;
    (function (CanvasTools) {
        var Editor;
        (function (Editor_1) {
            class Editor {
                constructor(editorZone) {
                    this.isRMFrozen = false;
                    this.autoResize = true;
                    this.contentCanvas = this.createCanvasElement();
                    this.editorSVG = this.createSVGElement();
                    this.editorDiv = editorZone;
                    this.editorDiv.classList.add("CanvasToolsEditor");
                    this.editorDiv.append(this.contentCanvas);
                    this.editorDiv.append(this.editorSVG);
                    window.addEventListener("resize", (e) => {
                        if (this.autoResize) {
                            this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
                        }
                    });
                    this.regionsManager = new RegionsManager(this.editorSVG, (region) => {
                        this.areaSelector.hide();
                        this.onRegionManipulationBegin(region);
                    }, (region) => {
                        this.areaSelector.show();
                        this.onRegionManipulationEnd(region);
                    });
                    this.regionsManager.onRegionSelected = (id, multiselection) => {
                        this.onRegionSelected(id, multiselection);
                    };
                    this.regionsManager.onRegionMove = (id, x, y, width, height) => {
                        this.onRegionMove(id, x, y, width, height);
                    };
                    this.regionsManager.onRegionDelete = (id) => {
                        this.onRegionDelete(id);
                    };
                    this.areaSelector = new Selection.AreaSelector(this.editorSVG, {
                        onSelectionBegin: () => {
                            this.isRMFrozen = this.regionsManager.isFrozen;
                            this.regionsManager.freeze();
                            this.onSelectionBegin();
                        },
                        onSelectionEnd: (commit) => {
                            if (!this.isRMFrozen) {
                                this.regionsManager.unfreeze();
                            }
                            this.onSelectionEnd(commit);
                        }
                    });
                    this.filterPipeline = new Filter.FilterPipeline();
                    this.resize(editorZone.offsetWidth, editorZone.offsetHeight);
                }
                createSVGElement() {
                    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.innerHTML = Editor.SVGDefsTemplate;
                    return svg;
                }
                createCanvasElement() {
                    let canvas = document.createElement("canvas");
                    return canvas;
                }
                onRegionManipulationBegin(region) {
                }
                onRegionManipulationEnd(region) {
                }
                onRegionSelected(id, multiselection) {
                }
                onRegionMove(id, x, y, width, height) {
                }
                onRegionDelete(id) {
                }
                onSelectionBegin() {
                }
                onSelectionEnd(commit) {
                }
                addToolbar(toolbarZone, toolbarSet, iconsPath) {
                    let svg = this.createSVGElement();
                    toolbarZone.append(svg);
                    this.toolbar = new Toolbar.Toolbar(svg);
                    if (toolbarSet === null) {
                        toolbarSet = Editor.FullToolbarSet;
                    }
                    let activeSelector;
                    toolbarSet.forEach((item) => {
                        if (item.type == Toolbar.ToolbarItemType.SEPARATOR) {
                            this.toolbar.addSeparator();
                        }
                        else if (item.type == Toolbar.ToolbarItemType.SELECTOR) {
                            this.toolbar.addSelector({
                                action: item.action,
                                iconUrl: iconsPath + item.iconFile,
                                tooltip: item.tooltip,
                                keycode: item.keycode,
                                width: item.width,
                                height: item.height
                            }, (action) => {
                                item.actionCallback(action, this.regionsManager, this.areaSelector);
                            });
                            if (item.activate) {
                                activeSelector = item.action;
                            }
                        }
                        else if (item.type == Toolbar.ToolbarItemType.SWITCH) {
                            this.toolbar.addSwitch({
                                action: item.action,
                                iconUrl: iconsPath + item.iconFile,
                                tooltip: item.tooltip,
                                keycode: item.keycode,
                                width: item.width,
                                height: item.height
                            }, (action) => {
                                item.actionCallback(action, this.regionsManager, this.areaSelector);
                            });
                            this.toolbar.setSwitch(item.action, item.activate);
                        }
                    });
                    this.toolbar.select(activeSelector);
                }
                addContentSource(source) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let buffCnvs = document.createElement("canvas");
                        let context = buffCnvs.getContext("2d");
                        if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
                            buffCnvs.width = source.width;
                            buffCnvs.height = source.height;
                        }
                        else if (source instanceof HTMLVideoElement) {
                            buffCnvs.width = source.videoWidth;
                            buffCnvs.height = source.videoHeight;
                        }
                        context.drawImage(source, 0, 0, buffCnvs.width, buffCnvs.height);
                        return this.filterPipeline.applyToCanvas(buffCnvs).then((bcnvs) => {
                            this.contentCanvas.width = bcnvs.width;
                            this.contentCanvas.height = bcnvs.height;
                            let imgContext = this.contentCanvas.getContext("2d");
                            imgContext.drawImage(bcnvs, 0, 0, bcnvs.width, bcnvs.height);
                        }).then(() => {
                            this.resize(this.editorDiv.offsetWidth, this.editorDiv.offsetHeight);
                        });
                    });
                }
                resize(containerWidth, containerHeight) {
                    let imgRatio = this.contentCanvas.width / this.contentCanvas.height;
                    let containerRatio = containerWidth / containerHeight;
                    let hpadding = 0;
                    let vpadding = 0;
                    if (imgRatio > containerRatio) {
                        vpadding = (containerHeight - containerWidth / imgRatio) / 2;
                        this.editorDiv.style.height = `calc(100% - ${vpadding * 2}px)`;
                        this.editorDiv.style.width = "";
                    }
                    else {
                        hpadding = (containerWidth - containerHeight * imgRatio) / 2;
                        this.editorDiv.style.height = "";
                        this.editorDiv.style.width = `calc(100% - ${hpadding * 2}px)`;
                    }
                    this.editorDiv.style.padding = `${vpadding}px ${hpadding}px`;
                    let actualWidth = this.editorSVG.clientWidth;
                    let actualHeight = this.editorSVG.clientHeight;
                    this.areaSelector.resize(actualWidth, actualHeight);
                    this.regionsManager.resize(actualWidth, actualHeight);
                }
                get RM() {
                    return this.regionsManager;
                }
                get FilterPipeline() {
                    return this.filterPipeline;
                }
            }
            Editor.SVGDefsTemplate = `
        <defs>
            <filter id="black-glow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="0" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.8" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>`;
            Editor.FullToolbarSet = [
                {
                    type: Toolbar.ToolbarItemType.SELECTOR,
                    action: "none-select",
                    iconFile: "none-selection.svg",
                    tooltip: "Regions Manipulation (M)",
                    keycode: 'KeyM',
                    actionCallback: (action, rm, sl) => {
                        sl.setSelectionMode(Selection.SelectionMode.NONE);
                    },
                    activate: false
                },
                {
                    type: Toolbar.ToolbarItemType.SEPARATOR
                },
                {
                    type: Toolbar.ToolbarItemType.SELECTOR,
                    action: "point-select",
                    iconFile: "point-selection.svg",
                    tooltip: "Point-selection (P)",
                    keycode: 'KeyP',
                    actionCallback: (action, rm, sl) => {
                        sl.setSelectionMode(Selection.SelectionMode.POINT);
                    },
                    activate: false
                },
                {
                    type: Toolbar.ToolbarItemType.SELECTOR,
                    action: "rect-select",
                    iconFile: "rect-selection.svg",
                    tooltip: "Rectangular box (R)",
                    keycode: 'KeyR',
                    actionCallback: (action, rm, sl) => {
                        sl.setSelectionMode(Selection.SelectionMode.RECT);
                    },
                    activate: true
                },
                {
                    type: Toolbar.ToolbarItemType.SELECTOR,
                    action: "copy-select",
                    iconFile: "copy-t-selection.svg",
                    tooltip: "Template-based box (T)",
                    keycode: 'KeyT',
                    actionCallback: (action, rm, sl) => {
                        let rs = rm.getSelectedRegionsBounds();
                        if (rs !== undefined && rs.length > 0) {
                            let r = rs[0];
                            sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(r.width, r.height) });
                        }
                        else {
                            sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(40, 40) });
                        }
                    },
                    activate: false
                },
                {
                    type: Toolbar.ToolbarItemType.SELECTOR,
                    action: "polyline-select",
                    iconFile: "polyline-selection.svg",
                    tooltip: "Polyline-selection (Y)",
                    keycode: 'KeyY',
                    actionCallback: (action, rm, sl) => {
                        sl.setSelectionMode(Selection.SelectionMode.POLYLINE);
                    },
                    activate: false
                },
                {
                    type: Toolbar.ToolbarItemType.SEPARATOR
                },
                {
                    type: Toolbar.ToolbarItemType.SWITCH,
                    action: "selection-lock",
                    iconFile: "selection-lock.svg",
                    tooltip: "Lock/unlock regions (L)",
                    keycode: 'KeyL',
                    actionCallback: (action, rm, sl) => {
                        rm.toggleFreezeMode();
                    },
                    activate: false
                }
            ];
            Editor.RectToolbarSet = [
                {
                    type: Toolbar.ToolbarItemType.SELECTOR,
                    action: "none-select",
                    iconFile: "none-selection.svg",
                    tooltip: "Regions Manipulation (M)",
                    keycode: 'KeyM',
                    actionCallback: (action, rm, sl) => {
                        sl.setSelectionMode(Selection.SelectionMode.NONE);
                    },
                    activate: false
                },
                {
                    type: Toolbar.ToolbarItemType.SEPARATOR
                },
                {
                    type: Toolbar.ToolbarItemType.SELECTOR,
                    action: "rect-select",
                    iconFile: "rect-selection.svg",
                    tooltip: "Rectangular box (R)",
                    keycode: 'KeyR',
                    actionCallback: (action, rm, sl) => {
                        sl.setSelectionMode(Selection.SelectionMode.RECT);
                    },
                    activate: true
                },
                {
                    type: Toolbar.ToolbarItemType.SELECTOR,
                    action: "copy-select",
                    iconFile: "copy-t-selection.svg",
                    tooltip: "Template-based box (T)",
                    keycode: 'KeyT',
                    actionCallback: (action, rm, sl) => {
                        let rs = rm.getSelectedRegionsBounds();
                        if (rs !== undefined && rs.length > 0) {
                            let r = rs[0];
                            sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(r.width, r.height) });
                        }
                        else {
                            sl.setSelectionMode(Selection.SelectionMode.COPYRECT, { template: new Rect(40, 40) });
                        }
                    },
                    activate: false
                },
                {
                    type: Toolbar.ToolbarItemType.SEPARATOR
                },
                {
                    type: Toolbar.ToolbarItemType.SWITCH,
                    action: "selection-lock",
                    iconFile: "selection-lock.svg",
                    tooltip: "Lock/unlock regions (L)",
                    keycode: 'KeyL',
                    actionCallback: (action, rm, sl) => {
                        rm.toggleFreezeMode();
                    },
                    activate: false
                }
            ];
            Editor_1.Editor = Editor;
        })(Editor = CanvasTools.Editor || (CanvasTools.Editor = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
define("CanvasTools", ["require", "exports", "Base/CanvasTools.Base.Point2D", "Base/CanvasTools.Base.Rect", "Base/CanvasTools.Base.Tags", "CanvasTools.Selection", "CanvasTools.Filter", "CanvasTools.Toolbar", "Regions/CanvasTools.Regions.RegionsManager", "Regions/CanvasTools.Regions.PointRegion", "Regions/CanvasTools.Regions.RectRegion", "CanvasTools.Editor", "./../css/canvastools.css"], function (require, exports, Point2D, Rect, Tags, SelectionTool, FilterTool, ToolbarTools, RegionTools, PointRegion, RectRegion, EditorTools) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CanvasTools;
    (function (CanvasTools) {
        CanvasTools.Base = {
            Point: Point2D.CanvasTools.Base.Point,
            Rect: Rect.CanvasTools.Base.Rect,
            Tags: Tags.CanvasTools.Base.Tags
        };
        CanvasTools.Selection = SelectionTool.CanvasTools.Selection;
        CanvasTools.Region = {
            RegionsManager: RegionTools.CanvasTools.Region.RegionsManager,
            PointRegion: PointRegion.CanvasTools.Region.PointRegion.PointRegion,
            RectRegion: RectRegion.CanvasTools.Region.RectRegion.RectRegion
        };
        CanvasTools.Filter = FilterTool.CanvasTools.Filter;
        CanvasTools.Toolbar = ToolbarTools.CanvasTools.Toolbar;
        CanvasTools.Editor = EditorTools.CanvasTools.Editor.Editor;
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
//# sourceMappingURL=ct.amd.js.map