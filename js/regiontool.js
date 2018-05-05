define(["require", "exports", "./basetool.js", "./snapsvg/snap.svg.js"], function (require, exports, CT, Snap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var base = CT.CanvasTools.Base;
    var CanvasTools;
    (function (CanvasTools) {
        var Region;
        (function (Region) {
            class AncorsRect {
                constructor(host, paper, x, y, width, height, onResize, boundRect = null) {
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                    this.onResizeCallback = onResize;
                    this.host = host;
                    this.boundRect = boundRect;
                    this.build(paper);
                    this.subscribeToEvents();
                }
                build(paper) {
                    this.rect = paper.g();
                    this.rect.addClass("ancorsLayer");
                    this.ancors = {
                        TL: this.createAncor(paper),
                        TR: this.createAncor(paper),
                        BL: this.createAncor(paper),
                        BR: this.createAncor(paper)
                    };
                    this.ghostAncor = this.createAncor(paper, 7);
                    this.ghostAncor.addClass("ghost");
                    this.rearrangeAncors();
                    this.rect.add(this.ancors.TL);
                    this.rect.add(this.ancors.TR);
                    this.rect.add(this.ancors.BR);
                    this.rect.add(this.ancors.BL);
                    this.rect.add(this.ghostAncor);
                }
                createAncor(paper, r = 3) {
                    let a = paper.circle(0, 0, r);
                    a.addClass("ancorStyle");
                    return a;
                }
                move(x, y) {
                    this.x = x;
                    this.y = y;
                    this.rearrangeAncors();
                }
                resize(width, height) {
                    this.width = width;
                    this.height = height;
                    this.rearrangeAncors();
                }
                rearrangeAncors() {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.ancors.TL.attr({ cx: self.x, cy: self.y });
                        self.ancors.TR.attr({ cx: self.x + self.width, cy: self.y });
                        self.ancors.BR.attr({ cx: self.x + self.width, cy: self.y + self.height });
                        self.ancors.BL.attr({ cx: self.x, cy: self.y + self.height });
                    });
                }
                rearrangeCoord(p1, p2) {
                    let x = (p1.x < p2.x) ? p1.x : p2.x;
                    let y = (p1.y < p2.y) ? p1.y : p2.y;
                    let width = Math.abs(p1.x - p2.x);
                    let height = Math.abs(p1.y - p2.y);
                    this.flipActiveAncor(p1.x - p2.x > 0, p1.y - p2.y > 0);
                    this.onResizeCallback(x, y, width, height);
                }
                flipActiveAncor(w, h) {
                    let ac = "";
                    if (this.activeAncor !== "") {
                        ac += (this.activeAncor[0] == "T") ? (h ? "B" : "T") : (h ? "T" : "B");
                        ac += (this.activeAncor[1] == "L") ? (w ? "R" : "L") : (w ? "L" : "R");
                    }
                    this.activeAncor = ac;
                }
                ancorDragBegin() {
                }
                getDragOriginPoint() {
                    let x, y;
                    switch (this.activeAncor) {
                        case "TL": {
                            x = this.x;
                            y = this.y;
                            break;
                        }
                        case "TR": {
                            x = this.x + this.width;
                            y = this.y;
                            break;
                        }
                        case "BL": {
                            x = this.x;
                            y = this.y + this.height;
                            break;
                        }
                        case "BR": {
                            x = this.x + this.width;
                            y = this.y + this.height;
                            break;
                        }
                    }
                    return new base.Point2D(x, y);
                }
                ancorDragMove(dx, dy, x, y) {
                    let p1, p2;
                    switch (this.activeAncor) {
                        case "TL": {
                            p1 = new base.Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);
                            p2 = new base.Point2D(this.x + this.width, this.y + this.height);
                            break;
                        }
                        case "TR": {
                            p1 = new base.Point2D(this.x, this.dragOrigin.y + dy);
                            p2 = new base.Point2D(this.dragOrigin.x + dx, this.y + this.height);
                            break;
                        }
                        case "BL": {
                            p1 = new base.Point2D(this.dragOrigin.x + dx, this.y);
                            p2 = new base.Point2D(this.x + this.width, this.dragOrigin.y + dy);
                            break;
                        }
                        case "BR": {
                            p1 = new base.Point2D(this.x, this.y);
                            p2 = new base.Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);
                            break;
                        }
                    }
                    if (this.boundRect !== null) {
                        p1 = p1.boundToRect(this.boundRect);
                        p2 = p2.boundToRect(this.boundRect);
                    }
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.ghostAncor.attr({ cx: self.dragOrigin.x + dx, cy: self.dragOrigin.y + dy });
                    });
                    this.rearrangeCoord(p1, p2);
                }
                ;
                ancorDragEnd() {
                    this.ghostAncor.attr({
                        display: "none"
                    });
                }
                subscribeToEvents() {
                    let self = this;
                    this.subscribeAncorToEvents(this.ancors.TL, "TL");
                    this.subscribeAncorToEvents(this.ancors.TR, "TR");
                    this.subscribeAncorToEvents(this.ancors.BL, "BL");
                    this.subscribeAncorToEvents(this.ancors.BR, "BR");
                    self.ghostAncor.mouseover(function (e) {
                        self.ghostAncor.drag(self.ancorDragMove.bind(self), self.ancorDragBegin.bind(self), self.ancorDragEnd.bind(self));
                        self.host.onDragBegin();
                    });
                    self.ghostAncor.mouseout(function (e) {
                        self.ghostAncor.undrag();
                        window.requestAnimationFrame(function () {
                            self.ghostAncor.attr({
                                display: "none"
                            });
                        });
                        self.host.onDragEnd();
                    });
                    self.ghostAncor.node.addEventListener("pointerdown", function (e) {
                        self.ghostAncor.node.setPointerCapture(e.pointerId);
                    });
                    self.ghostAncor.node.addEventListener("pointerup", function (e) {
                        self.ghostAncor.node.releasePointerCapture(e.pointerId);
                    });
                }
                subscribeAncorToEvents(ancor, active) {
                    let self = this;
                    ancor.mouseover(function (e) {
                        self.activeAncor = active;
                        let p = self.getDragOriginPoint();
                        self.dragOrigin = p;
                        window.requestAnimationFrame(function () {
                            self.ghostAncor.attr({
                                cx: p.x,
                                cy: p.y,
                                display: 'block'
                            });
                        });
                    });
                }
            }
            class RegionElement {
                constructor(host, paper, r, boundRect = null) {
                    this.isSelected = false;
                    this.host = host;
                    this.x = 0;
                    this.y = 0;
                    this.width = r.width;
                    this.height = r.height;
                    if (boundRect !== null) {
                        this.boundRects = {
                            host: boundRect,
                            self: new base.Rect(boundRect.width - r.width, boundRect.height - r.height)
                        };
                    }
                    this.build(host, paper, r.width, r.height);
                    this.subscribeToEvents();
                }
                build(host, paper, width, height) {
                    this.rect = paper.g();
                    this.rect.addClass("regionStyle");
                    this.regionRect = paper.rect(0, 0, width, height);
                    this.rect.add(this.regionRect);
                    this.ancors = new AncorsRect(host, paper, this.x, this.y, this.width, this.height, this.onInternalResize.bind(this), this.boundRects.host);
                    this.rect.add(this.ancors.rect);
                    this.regionRect.addClass("regionRectStyle");
                }
                onInternalResize(x, y, width, height) {
                    this.move(new base.Point2D(x, y));
                    this.resize(width, height);
                }
                move(p) {
                    let self = this;
                    this.x = p.x;
                    this.y = p.y;
                    window.requestAnimationFrame(function () {
                        self.regionRect.attr({
                            x: p.x,
                            y: p.y
                        });
                        self.ancors.move(p.x, p.y);
                    });
                }
                resize(width, height) {
                    this.width = width;
                    this.height = height;
                    this.boundRects.self.width = this.boundRects.host.width - width;
                    this.boundRects.self.height = this.boundRects.host.height - height;
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.regionRect.attr({
                            width: width,
                            height: height
                        });
                        self.ancors.resize(width, height);
                    });
                }
                hide() {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.regionRect.attr({
                            visibility: 'hidden'
                        });
                    });
                }
                show() {
                    let self = this;
                    window.requestAnimationFrame(function () {
                        self.regionRect.attr({
                            visibility: 'visible'
                        });
                    });
                }
                select() {
                    this.isSelected = true;
                    this.rect.addClass("selected");
                }
                unselect() {
                    this.isSelected = false;
                    this.rect.removeClass("selected");
                }
                rectDragBegin() {
                    this.dragOrigin = new base.Point2D(this.x, this.y);
                }
                rectDragMove(dx, dy) {
                    let p;
                    p = new base.Point2D(this.dragOrigin.x + dx, this.dragOrigin.y + dy);
                    if (this.boundRects !== null) {
                        p = p.boundToRect(this.boundRects.self);
                    }
                    this.move(p);
                }
                ;
                rectDragEnd() {
                    this.dragOrigin = null;
                }
                subscribeToEvents() {
                    let self = this;
                    self.regionRect.click(function (e) {
                        if (self.isSelected) {
                            self.unselect();
                        }
                        else {
                            self.select();
                        }
                    }, this);
                    self.regionRect.mouseover(function (e) {
                        self.regionRect.drag(self.rectDragMove.bind(self), self.rectDragBegin.bind(self), self.rectDragEnd.bind(self));
                        self.host.onDragBegin();
                    });
                    self.regionRect.mouseout(function (e) {
                        self.regionRect.undrag();
                        self.host.onDragEnd();
                    });
                    self.regionRect.node.addEventListener("pointerdown", function (e) {
                        self.regionRect.node.setPointerCapture(e.pointerId);
                    });
                    self.regionRect.node.addEventListener("pointerup", function (e) {
                        self.regionRect.node.releasePointerCapture(e.pointerId);
                    });
                }
            }
            class RegionsManager {
                constructor(svgHost, onManipulationBegin, onManipulationEnd) {
                    this.baseParent = svgHost;
                    this.paper = Snap(svgHost);
                    this.paperRect = new base.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
                    this.regionManagerLayer = this.paper.g();
                    this.regionManagerLayer.addClass("regionManager");
                    this.onManipulationBeginCallback = onManipulationBegin;
                    this.onManipulationEndCallback = onManipulationEnd;
                }
                addRegion(pointA, pointB) {
                    let x = (pointA.x < pointB.x) ? pointA.x : pointB.x;
                    let y = (pointA.y < pointB.y) ? pointA.y : pointB.y;
                    let w = Math.abs(pointA.x - pointB.x);
                    let h = Math.abs(pointA.y - pointB.y);
                    let region = new RegionElement(this, this.paper, new base.Rect(w, h), this.paperRect);
                    region.move(new base.Point2D(x, y));
                    this.regionManagerLayer.add(region.rect);
                }
                onDragBegin() {
                    this.onManipulationBeginCallback();
                }
                onDragEnd() {
                    this.onManipulationEndCallback();
                }
            }
            Region.RegionsManager = RegionsManager;
        })(Region = CanvasTools.Region || (CanvasTools.Region = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
//# sourceMappingURL=regiontool.js.map