define(["require", "exports", "./basetool.js", "./snapsvg/snap.svg.js"], function (require, exports, CT, Snap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var base = CT.CanvasTools.Base;
    var CanvasTools;
    (function (CanvasTools) {
        var Selection;
        (function (Selection) {
            class CrossElement {
                constructor(paper, rect) {
                    this.build(paper, rect.width, rect.height, 0, 0);
                }
                build(paper, width, height, x, y) {
                    let verticalLine = paper.line(0, 0, 0, height);
                    let horizontalLine = paper.line(0, 0, width, 0);
                    this.cross = paper.g();
                    this.cross.addClass("crossStyle");
                    this.cross.add(verticalLine);
                    this.cross.add(horizontalLine);
                    this.hl = horizontalLine;
                    this.vl = verticalLine;
                    this.x = x;
                    this.y = y;
                }
                boundToRect(rect) {
                    return new base.Point2D(this.x, this.y).boundToRect(rect);
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
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.vl.attr({
                            x1: np.x,
                            x2: np.x,
                            y2: rect.height
                        });
                        self.hl.attr({
                            y1: np.y,
                            x2: rect.width,
                            y2: np.y
                        });
                    });
                }
                resize(width, height) {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.vl.attr({
                            y2: height
                        });
                        self.hl.attr({
                            x2: width,
                        });
                    });
                }
                hide() {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.cross.attr({
                            visibility: 'hidden'
                        });
                    });
                }
                show() {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.cross.attr({
                            visibility: 'visible'
                        });
                    });
                }
            }
            class RectElement {
                constructor(paper, rect) {
                    this.build(paper, rect.width, rect.height);
                }
                build(paper, width, height) {
                    this.rect = paper.rect(0, 0, width, height);
                    this.width = width;
                    this.height = height;
                }
                move(p) {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.rect.attr({
                            x: p.x,
                            y: p.y
                        });
                    });
                }
                resize(width, height) {
                    this.width = width;
                    this.height = height;
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.rect.attr({
                            width: width,
                            height: height
                        });
                    });
                }
                hide() {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.rect.attr({
                            visibility: 'hidden'
                        });
                    });
                }
                show() {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.rect.attr({
                            visibility: 'visible'
                        });
                    });
                }
            }
            class AreaSelector {
                constructor(svgHost, onSelectionBegin, onSelectionEnd) {
                    this.capturingState = false;
                    this.isEnabled = true;
                    this.squareMode = false;
                    this.twoPointsMode = false;
                    this.buildUIElements(svgHost);
                    this.subscribeToEvents();
                    this.onSelectionEndCallback = onSelectionEnd;
                    this.onSelectionBeginCallback = onSelectionBegin;
                }
                buildUIElements(svgHost) {
                    this.baseParent = svgHost;
                    this.paper = Snap(svgHost);
                    this.paperRect = new base.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
                    this.areaSelectorLayer = this.paper.g();
                    this.areaSelectorLayer.addClass("areaSelector");
                    this.overlay = this.createOverlay();
                    this.mask = this.createMask();
                    this.selectionBox = this.createSelectionBoxMask();
                    let combinedMask = this.paper.g();
                    combinedMask.add(this.mask.rect);
                    combinedMask.add(this.selectionBox.rect);
                    this.overlay.rect.attr({
                        mask: combinedMask
                    });
                    this.crossA = this.createCross();
                    this.crossB = this.createCross();
                    this.areaSelectorLayer.add(this.overlay.rect);
                    this.areaSelectorLayer.add(this.crossA.cross);
                    this.areaSelectorLayer.add(this.crossB.cross);
                }
                createOverlay() {
                    let r = new RectElement(this.paper, this.paperRect);
                    r.rect.addClass("overlayStyle");
                    r.hide();
                    return r;
                }
                createMask() {
                    let r = new RectElement(this.paper, this.paperRect);
                    r.rect.addClass("overlayMaskStyle");
                    return r;
                }
                createSelectionBoxMask() {
                    let r = new RectElement(this.paper, new base.Rect(0, 0));
                    r.rect.addClass("selectionBoxMaskStyle");
                    return r;
                }
                createCross() {
                    let cr = new CrossElement(this.paper, this.paperRect);
                    cr.hide();
                    return cr;
                }
                resize(width, height) {
                    if (width !== undefined && height !== undefined) {
                        this.paperRect.resize(width, height);
                        this.baseParent.style.width = width.toString();
                        this.baseParent.style.height = height.toString();
                    }
                    else {
                        this.paperRect.resize(this.baseParent.width.baseVal.value, this.baseParent.height.baseVal.value);
                    }
                    this.resizeAll([this.overlay, this.mask, this.crossA, this.crossB]);
                }
                resizeAll(elementSet) {
                    elementSet.forEach(element => {
                        element.resize(this.paperRect.width, this.paperRect.height);
                    });
                }
                showAll(elementSet) {
                    elementSet.forEach(element => {
                        element.show();
                    });
                }
                hideAll(elementSet) {
                    elementSet.forEach(element => {
                        element.hide();
                    });
                }
                onPointerEnter(e) {
                    this.crossA.show();
                }
                onPointerLeave(e) {
                    let rect = this.baseParent.getClientRects();
                    let p = new base.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    if (!this.twoPointsMode && !this.capturingState) {
                        this.hideAll([this.crossA, this.crossB, this.selectionBox]);
                    }
                    else if (this.twoPointsMode && this.capturingState) {
                        this.moveCross(this.crossB, p);
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                    }
                }
                onPointerDown(e) {
                    if (!this.twoPointsMode) {
                        this.capturingState = true;
                        this.baseParent.setPointerCapture(e.pointerId);
                        this.moveCross(this.crossB, this.crossA);
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                        this.showAll([this.overlay, this.crossB, this.selectionBox]);
                        if (typeof this.onSelectionBeginCallback === "function") {
                            this.onSelectionBeginCallback();
                        }
                    }
                }
                onPointerUp(e) {
                    let rect = this.baseParent.getClientRects();
                    let p = new base.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    if (!this.twoPointsMode) {
                        this.capturingState = false;
                        this.baseParent.releasePointerCapture(e.pointerId);
                        this.hideAll([this.crossB, this.overlay]);
                        if (typeof this.onSelectionEndCallback === "function") {
                            this.onSelectionEndCallback(this.crossA.x, this.crossA.y, this.crossB.x, this.crossB.y);
                        }
                    }
                    else if (this.twoPointsMode && !this.capturingState) {
                        this.capturingState = true;
                        this.moveCross(this.crossB, p);
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                        this.showAll([this.crossA, this.crossB, this.selectionBox, this.overlay]);
                        if (typeof this.onSelectionBeginCallback === "function") {
                            this.onSelectionBeginCallback();
                        }
                    }
                    else {
                        this.capturingState = false;
                        this.hideAll([this.crossB, this.overlay]);
                        if (typeof this.onSelectionEndCallback === "function") {
                            this.onSelectionEndCallback(this.crossA.x, this.crossA.y, this.crossB.x, this.crossB.y);
                        }
                        this.moveCross(this.crossA, p);
                        this.moveCross(this.crossB, p);
                    }
                }
                onPointerMove(e) {
                    let rect = this.baseParent.getClientRects();
                    let p = new base.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.crossA.show();
                    if (!this.twoPointsMode && !this.capturingState) {
                        this.moveCross(this.crossA, p);
                    }
                    else if (!this.twoPointsMode && this.capturingState) {
                        this.moveCross(this.crossB, p, this.squareMode, this.crossA);
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                    }
                    else if (this.twoPointsMode && this.capturingState) {
                        this.moveCross(this.crossB, p, this.squareMode, this.crossA);
                        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                    }
                    else {
                        this.moveCross(this.crossA, p);
                        this.moveCross(this.crossB, p);
                    }
                }
                onKeyDown(e) {
                    if (e.shiftKey) {
                        this.squareMode = true;
                    }
                    if (e.ctrlKey && !this.capturingState) {
                        this.twoPointsMode = true;
                    }
                }
                onKeyUp(e) {
                    if (!e.shiftKey) {
                        this.squareMode = false;
                    }
                    if (!e.ctrlKey && this.twoPointsMode) {
                        this.twoPointsMode = false;
                        this.capturingState = false;
                        this.moveCross(this.crossA, this.crossB);
                        this.hideAll([this.crossB, this.selectionBox, this.overlay]);
                    }
                }
                subscribeToEvents() {
                    let self = this;
                    let listeners = [
                        { event: "pointerenter", listener: this.onPointerEnter, base: this.baseParent },
                        { event: "pointerleave", listener: this.onPointerLeave, base: this.baseParent },
                        { event: "pointerdown", listener: this.onPointerDown, base: this.baseParent },
                        { event: "pointerup", listener: this.onPointerUp, base: this.baseParent },
                        { event: "pointermove", listener: this.onPointerMove, base: this.baseParent },
                        { event: "keydown", listener: this.onKeyDown, base: window },
                        { event: "keyup", listener: this.onKeyUp, base: window },
                    ];
                    listeners.forEach(e => {
                        e.base.addEventListener(e.event, this.enablify(e.listener.bind(this)));
                    });
                }
                moveCross(cross, p, square = false, refCross = null) {
                    cross.move(p, this.paperRect, square, refCross);
                }
                moveSelectionBox(box, crossA, crossB) {
                    var x = (crossA.x < crossB.x) ? crossA.x : crossB.x;
                    var y = (crossA.y < crossB.y) ? crossA.y : crossB.y;
                    var w = Math.abs(crossA.x - crossB.x);
                    var h = Math.abs(crossA.y - crossB.y);
                    box.move(new base.Point2D(x, y));
                    box.resize(w, h);
                }
                enable() {
                    this.isEnabled = true;
                    this.areaSelectorLayer.attr({
                        display: "block"
                    });
                }
                disable() {
                    this.isEnabled = false;
                    this.areaSelectorLayer.attr({
                        display: "none"
                    });
                }
                enablify(f) {
                    let self = this;
                    return function (args) {
                        if (this.isEnabled) {
                            f(args);
                        }
                    }.bind(self);
                }
            }
            Selection.AreaSelector = AreaSelector;
        })(Selection = CanvasTools.Selection || (CanvasTools.Selection = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
//# sourceMappingURL=selectiontool.js.map