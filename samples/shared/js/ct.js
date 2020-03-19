(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Point2D {
    static BuildFromJSON(data) {
        return new Point2D(data.x, data.y);
    }
    constructor(arg1, arg2) {
        if (typeof arg1 === "number" && typeof arg2 === "number") {
            this.x = arg1;
            this.y = arg2;
        }
        else if (arg1.x !== undefined && arg1.y !== undefined) {
            this.x = arg1.x;
            this.y = arg1.y;
        }
    }
    move(arg1, arg2) {
        if (typeof arg1 === "number" && typeof arg2 === "number") {
            this.x = arg1;
            this.y = arg2;
        }
        else if (arg1.x !== undefined && arg1.y !== undefined) {
            this.x = arg1.x;
            this.y = arg1.y;
        }
    }
    shift(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    boundToRect(r) {
        return new Point2D((this.x < 0) ? 0 : ((this.x > r.width) ? r.width : this.x), (this.y < 0) ? 0 : ((this.y > r.height) ? r.height : this.y));
    }
    squareDistanceToPoint(p) {
        return (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y);
    }
    squareDistanceToLine(p1, p2) {
        const lineLength2 = p1.squareDistanceToPoint(p2);
        let dist;
        if (lineLength2 === 0.0) {
            dist = this.squareDistanceToPoint(p1);
        }
        else {
            const t = ((this.x - p1.x) * (p2.x - p1.x) + (this.y - p1.y) * (p2.y - p1.y)) / lineLength2;
            const k = Math.max(0, Math.min(1, t));
            const p = new Point2D(p1.x + k * (p2.x - p1.x), p1.y + k * (p2.y - p1.y));
            dist = this.squareDistanceToPoint(p);
        }
        return dist;
    }
    copy() {
        return new Point2D(this.x, this.y);
    }
    toString() {
        return `{${this.x.toString()}, ${this.y.toString()}}`;
    }
    toJSON() {
        return {
            x: this.x,
            y: this.y,
        };
    }
}
exports.Point2D = Point2D;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Rect {
    static BuildFromJSON(data) {
        return new Rect(data.width, data.height);
    }
    constructor(width, height) {
        this.width = 0;
        this.height = 0;
        this.resize(width, height);
    }
    resize(width, height) {
        if (width >= 0 && height >= 0) {
            this.width = width;
            this.height = height;
        }
    }
    copy() {
        return new Rect(this.width, this.height);
    }
    toString() {
        return `[${this.width.toString()}, ${this.height.toString()}]`;
    }
    toJSON() {
        return {
            width: this.width,
            height: this.height,
        };
    }
}
exports.Rect = Rect;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
var RegionDataType;
(function (RegionDataType) {
    RegionDataType["Point"] = "point";
    RegionDataType["Rect"] = "rect";
    RegionDataType["Polyline"] = "polyline";
    RegionDataType["Polygon"] = "polygon";
})(RegionDataType = exports.RegionDataType || (exports.RegionDataType = {}));
class RegionData {
    static BuildPointRegionData(x, y) {
        return new RegionData(x, y, 0, 0, [new Point2D_1.Point2D(x, y)], RegionDataType.Point);
    }
    static BuildRectRegionData(x, y, width, height) {
        return new RegionData(x, y, width, height, [new Point2D_1.Point2D(x, y), new Point2D_1.Point2D(x + width, y),
            new Point2D_1.Point2D(x + width, y + height), new Point2D_1.Point2D(x, y + height)], RegionDataType.Rect);
    }
    static BuildFromJson(data) {
        return new RegionData(data.x, data.y, data.width, data.height, data.points.map((p) => new Point2D_1.Point2D(p.x, p.y)), data.type);
    }
    get x() {
        return this.corner.x;
    }
    set x(x) {
        this.move(x, this.y);
    }
    get y() {
        return this.corner.y;
    }
    set y(y) {
        this.move(this.x, y);
    }
    get width() {
        return this.regionRect.width;
    }
    set width(width) {
        this.resize(width, this.height);
    }
    get height() {
        return this.regionRect.height;
    }
    set height(height) {
        this.resize(this.width, height);
    }
    get area() {
        let area;
        if (this.regionType === RegionDataType.Point) {
            area = 1.0;
        }
        else {
            area = this.regionRect.width * this.regionRect.height;
        }
        return area;
    }
    get boundRect() {
        return this.regionRect.copy();
    }
    set boundRect(rect) {
        this.resize(rect.width, rect.height);
    }
    get points() {
        return this.regionPoints.map((p) => p.copy());
    }
    set points(points) {
        this.setPoints(points);
    }
    get type() {
        return this.regionType;
    }
    constructor(x, y, width, height, points, type) {
        this.corner = new Point2D_1.Point2D(x, y);
        this.regionRect = new Rect_1.Rect(width, height);
        this.regionPoints = (points !== undefined && points !== null) ? points : new Array();
        this.regionType = (type !== undefined) ? type : RegionDataType.Point;
    }
    move(arg1, arg2) {
        const oldx = this.x;
        const oldy = this.y;
        this.corner.move(arg1, arg2);
        const dx = this.x - oldx;
        const dy = this.y - oldy;
        this.regionPoints.forEach((p) => {
            p.shift(dx, dy);
        });
    }
    resize(width, height) {
        const sx = width / this.width;
        const sy = height / this.height;
        this.regionRect.resize(width, height);
        this.regionPoints.forEach((p) => {
            const px = (p.x - this.x) * sx + this.x;
            const py = (p.y - this.y) * sy + this.y;
            p.move(px, py);
        });
    }
    setPoint(point, index) {
        if (index >= 0 && index < this.regionPoints.length) {
            this.regionPoints[index] = new Point2D_1.Point2D(point);
        }
        let xmin = Number.MAX_VALUE;
        let xmax = 0;
        let ymin = Number.MAX_VALUE;
        let ymax = 0;
        this.regionPoints.forEach((point) => {
            if (point.x > xmax) {
                xmax = point.x;
            }
            if (point.x < xmin) {
                xmin = point.x;
            }
            if (point.y > ymax) {
                ymax = point.y;
            }
            if (point.y < ymin) {
                ymin = point.y;
            }
        });
        this.corner.move(xmin, ymin);
        this.regionRect.resize(xmax - xmin, ymax - ymin);
    }
    setPoints(points) {
        let xmin = Number.MAX_VALUE;
        let xmax = 0;
        let ymin = Number.MAX_VALUE;
        let ymax = 0;
        points.forEach((point) => {
            if (point.x > xmax) {
                xmax = point.x;
            }
            if (point.x < xmin) {
                xmin = point.x;
            }
            if (point.y > ymax) {
                ymax = point.y;
            }
            if (point.y < ymin) {
                ymin = point.y;
            }
        });
        this.regionPoints = points.map((p) => new Point2D_1.Point2D(p));
        this.corner.move(xmin, ymin);
        this.regionRect.resize(xmax - xmin, ymax - ymin);
    }
    initFrom(regionData) {
        this.corner = new Point2D_1.Point2D(regionData.x, regionData.y);
        this.regionRect = new Rect_1.Rect(regionData.width, regionData.height);
        this.regionPoints = regionData.points.map((p) => new Point2D_1.Point2D(p.x, p.y));
    }
    boundToRect(rect) {
        const brCorner = (new Point2D_1.Point2D(this.x + this.width, this.y + this.height)).boundToRect(rect);
        const tlCorner = this.corner.boundToRect(rect);
        const width = brCorner.x - tlCorner.x;
        const height = brCorner.y - tlCorner.y;
        return new RegionData(tlCorner.x, tlCorner.y, width, height, this.regionPoints.map((p) => p.boundToRect(rect)), this.regionType);
    }
    scale(f1, f2) {
        const xf = f1;
        const yf = (f2 !== undefined) ? f2 : f1;
        this.corner = new Point2D_1.Point2D(this.x * xf, this.y * yf);
        this.regionRect = new Rect_1.Rect(this.width * xf, this.height * yf);
        this.regionPoints = this.regionPoints.map((p) => new Point2D_1.Point2D(p.x * xf, p.y * yf));
    }
    copy() {
        return new RegionData(this.x, this.y, this.width, this.height, this.regionPoints.map((p) => p.copy()), this.regionType);
    }
    toString() {
        return `${this.corner.toString()} x ${this.boundRect.toString()}: {${this.regionPoints.toString()}}`;
    }
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            points: this.regionPoints.map((point) => {
                return { x: point.x, y: point.y };
            }),
            type: this.regionType,
        };
    }
}
exports.RegionData = RegionData;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ToolbarItemType;
(function (ToolbarItemType) {
    ToolbarItemType[ToolbarItemType["SELECTOR"] = 0] = "SELECTOR";
    ToolbarItemType[ToolbarItemType["SWITCH"] = 1] = "SWITCH";
    ToolbarItemType[ToolbarItemType["SEPARATOR"] = 2] = "SEPARATOR";
    ToolbarItemType[ToolbarItemType["TRIGGER"] = 3] = "TRIGGER";
})(ToolbarItemType = exports.ToolbarItemType || (exports.ToolbarItemType = {}));
class ToolbarIcon {
    constructor(paper, icon) {
        this.isSelected = false;
        this.paper = paper;
        if (icon !== undefined && icon !== null) {
            this.description = icon;
            if (icon.width !== undefined) {
                this.width = icon.width;
            }
            else {
                this.width = ToolbarIcon.IconWidth;
            }
            if (icon.height !== undefined) {
                this.height = icon.height;
            }
            else {
                this.height = ToolbarIcon.IconHeight;
            }
        }
        else {
            this.description = null;
            this.width = ToolbarIcon.IconWidth;
            this.height = ToolbarIcon.IconHeight;
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
ToolbarIcon.IconWidth = 48;
ToolbarIcon.IconHeight = 48;
exports.ToolbarIcon = ToolbarIcon;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChangeEventType;
(function (ChangeEventType) {
    ChangeEventType[ChangeEventType["MOVEEND"] = 0] = "MOVEEND";
    ChangeEventType[ChangeEventType["MOVING"] = 1] = "MOVING";
    ChangeEventType[ChangeEventType["MOVEBEGIN"] = 2] = "MOVEBEGIN";
    ChangeEventType[ChangeEventType["SELECTIONTOGGLE"] = 3] = "SELECTIONTOGGLE";
})(ChangeEventType = exports.ChangeEventType || (exports.ChangeEventType = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class RegionComponent {
    constructor(paper, paperRect, regionData, callbacks = null) {
        this.isVisible = true;
        this.isFrozen = false;
        this.isSelected = false;
        this.paper = paper;
        this.paperRect = paperRect;
        this.regionData = regionData;
        this.callbacks = callbacks;
    }
    get x() {
        return this.regionData.x;
    }
    get y() {
        return this.regionData.y;
    }
    get width() {
        return this.regionData.boundRect.width;
    }
    get height() {
        return this.regionData.boundRect.height;
    }
    get area() {
        return this.regionData.area;
    }
    get boundRect() {
        return this.regionData.boundRect;
    }
    hide() {
        this.node.node.setAttribute("visibility", "hidden");
        this.isVisible = false;
    }
    show() {
        this.node.node.setAttribute("visibility", "visible");
        this.isVisible = true;
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
        this.isFrozen = true;
    }
    unfreeze() {
        this.isFrozen = false;
    }
    move(arg1, arg2) {
        this.regionData.move(arg1, arg2);
        this.redraw();
    }
    resize(width, height) {
        this.regionData.resize(width, height);
        this.redraw();
    }
    resizePaper(width, height) {
        this.paperRect.resize(width, height);
    }
    subscribeToEvents(listeners) {
        listeners.forEach((e) => {
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
exports.RegionComponent = RegionComponent;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const Element_1 = __webpack_require__(17);
class CrossElement extends Element_1.Element {
    get x() {
        return this.center.x;
    }
    get y() {
        return this.center.y;
    }
    constructor(paper, boundRect) {
        super(paper, boundRect);
        this.buildUIElements();
        this.hide();
    }
    boundToRect(rect) {
        return new Point2D_1.Point2D(this.x, this.y).boundToRect(rect);
    }
    move(p, boundRect, square = false, ref = null) {
        const np = new Point2D_1.Point2D(p).boundToRect(boundRect);
        if (square) {
            const dx = Math.abs(np.x - ref.x);
            const vx = Math.sign(np.x - ref.x);
            const dy = Math.abs(np.y - ref.y);
            const vy = Math.sign(np.y - ref.y);
            const d = Math.min(dx, dy);
            np.x = ref.x + d * vx;
            np.y = ref.y + d * vy;
        }
        this.center.move(np);
        this.vl.node.setAttribute("x1", np.x.toString());
        this.vl.node.setAttribute("x2", np.x.toString());
        this.vl.node.setAttribute("y2", boundRect.height.toString());
        this.hl.node.setAttribute("y1", np.y.toString());
        this.hl.node.setAttribute("x2", boundRect.width.toString());
        this.hl.node.setAttribute("y2", np.y.toString());
    }
    resize(width, height) {
        super.resize(width, height);
        this.vl.node.setAttribute("y2", height.toString());
        this.hl.node.setAttribute("x2", width.toString());
    }
    buildUIElements() {
        const verticalLine = this.paper.line(0, 0, 0, this.boundRect.height);
        const horizontalLine = this.paper.line(0, 0, this.boundRect.width, 0);
        this.node = this.paper.g();
        this.node.addClass("crossStyle");
        this.node.add(verticalLine);
        this.node.add(horizontalLine);
        this.hl = horizontalLine;
        this.vl = verticalLine;
        this.center = new Point2D_1.Point2D(0, 0);
    }
}
exports.CrossElement = CrossElement;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Element_1 = __webpack_require__(17);
class Selector extends Element_1.Element {
    constructor(parent, paper, boundRect, callbacks) {
        super(paper, boundRect);
        this.isEnabled = true;
        this.parentNode = parent;
        if (callbacks !== undefined) {
            this.callbacks = callbacks;
        }
        else {
            this.callbacks = {
                onLocked: null,
                onSelectionBegin: null,
                onSelectionEnd: null,
                onUnlocked: null,
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
        listeners.forEach((e) => {
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
            elements.forEach((element) => {
                if (element.show !== undefined) {
                    element.show();
                }
                else {
                    element.node.setAttribute("visibility", "visible");
                }
            });
        });
    }
    hideAll(elements) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                if (element.hide !== undefined) {
                    element.hide();
                }
                else {
                    element.node.setAttribute("visibility", "hidden");
                }
            });
        });
    }
    resizeAll(elements) {
        window.requestAnimationFrame(() => {
            elements.forEach((element) => {
                element.resize(this.boundRect.width, this.boundRect.height);
            });
        });
    }
    moveCross(cross, pointTo, square = false, ref = null) {
        cross.move(pointTo, this.boundRect, square, ref);
    }
    movePoint(point, pointTo) {
        point.attr({
            cx: pointTo.x,
            cy: pointTo.y,
        });
    }
    moveLine(line, pointFrom, pointTo) {
        line.attr({
            x1: pointFrom.x,
            x2: pointTo.x,
            y1: pointFrom.y,
            y2: pointTo.y,
        });
    }
}
exports.Selector = Selector;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const XYZColor_1 = __webpack_require__(13);
class LABColor {
    get l() {
        return this.values[0];
    }
    get a() {
        return this.values[1];
    }
    get b() {
        return this.values[2];
    }
    constructor(l, a, b) {
        this.values = [l, a, b];
    }
    distanceTo(color) {
        const deltaL = this.values[0] - color.values[0];
        const deltaA = this.values[1] - color.values[1];
        const deltaB = this.values[2] - color.values[2];
        const c1 = Math.sqrt(this.values[1] * this.values[1] + this.values[2] * this.values[2]);
        const c2 = Math.sqrt(color.values[1] * color.values[1] + color.values[2] * color.values[2]);
        const deltaC = c1 - c2;
        let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
        deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
        const sc = 1.0 + 0.045 * c1;
        const sh = 1.0 + 0.015 * c1;
        const deltaLKlsl = deltaL / (1.0);
        const deltaCkcsc = deltaC / (sc);
        const deltaHkhsh = deltaH / (sh);
        const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
    }
    distanceTo_00(color) {
        const [L1, a1, b1] = this.values;
        const [L2, a2, b2] = color.values;
        const kL = 1.0;
        const kC = 1.0;
        const kH = 1.0;
        const K1 = 0.045;
        const K2 = 0.015;
        const deg2rad = Math.PI / 180.0;
        const rad2deg = 180.0 / Math.PI;
        const deltaL = L2 - L1;
        const midL = (L1 + L2) / 2;
        const C1 = Math.sqrt(a1 * a1 + b1 * b1);
        const C2 = Math.sqrt(a2 * a2 + b2 * b2);
        const midC = (C1 + C2) / 2;
        const midC7 = midC ** 7;
        const midC7Root = Math.sqrt(midC7 / (midC7 + 25 ** 7));
        const a1t = a1 + 0.5 * a1 * (1 - midC7Root);
        const a2t = a2 + 0.5 * a2 * (1 - midC7Root);
        const C1t = Math.sqrt(a1t * a1t + b1 * b1);
        const C2t = Math.sqrt(a2t * a2t + b2 * b2);
        const midCt = (C1t + C2t) / 2;
        const deltaCt = C2t - C1t;
        const h1 = (b1 === 0 && a1t === 0) ? 0 : (Math.atan2(b1, a1t) * rad2deg) % 360;
        const h2 = (b2 === 0 && a2t === 0) ? 0 : (Math.atan2(b2, a2t) * rad2deg) % 360;
        let deltah = h2 - h1;
        const absDeltah = Math.abs(deltah);
        if (h2 <= h1 && absDeltah > 180) {
            deltah += 360;
        }
        if (h2 > h1 && absDeltah > 180) {
            deltah -= 360;
        }
        const deltaH = 2 * Math.sqrt(C1t * C2t) * Math.sin(0.5 * deltah * deg2rad);
        let H = (h1 + h2) / 2;
        if (absDeltah > 180 && h1 + h2 < 360) {
            H += 180;
        }
        if (absDeltah > 180 && h1 + h2 >= 360) {
            H -= 180;
        }
        const T = 1 - 0.17 * Math.cos((H - 30) * deg2rad)
            + 0.24 * Math.cos((2 * H) * deg2rad)
            + 0.32 * Math.cos((3 * H + 6) * deg2rad)
            - 0.20 * Math.cos((4 * H - 63) * deg2rad);
        const SL = 1 + (K2 * (midL - 50)) / (Math.sqrt(20 + (midL - 50) * (midL - 50)));
        const SC = 1 + K1 * midCt;
        const SH = 1 + K2 * midCt * T;
        const RT = -2 * midC7Root * Math.sin((60 * Math.exp(-((H - 275) / 25) * ((H - 275) / 25))) * deg2rad);
        const diff = Math.sqrt((deltaL / (kL * SL)) ** 2
            + (deltaCt / (kC * SC)) ** 2
            + (deltaH / (kH * SH)) ** 2
            + RT * (deltaCt / (kC * SC)) * (deltaH / (kH * SH)));
        return diff;
    }
    distanceToGray() {
        return Math.sqrt(this.a * this.a + this.b * this.b);
    }
    toArray() {
        return this.values.map((v) => v);
    }
    toXYZ() {
        let y = (this.l * 100 + 16) / 116;
        let x = this.a / 5 + y;
        let z = y - this.b / 2;
        [x, y, z] = [x, y, z].map((v) => {
            const v3 = v * v * v;
            return (v3 > 0.008856451) ? v3 : (v - 16 / 116) / 7.787037;
        });
        return new XYZColor_1.XYZColor(x * XYZColor_1.XYZColor.D65.x, y * XYZColor_1.XYZColor.D65.y, z * XYZColor_1.XYZColor.D65.z);
    }
    toRGB() {
        return this.toXYZ().toRGB();
    }
    toSRGB() {
        return this.toXYZ().toRGB().toSRGB();
    }
}
exports.LABColor = LABColor;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RegionComponent_1 = __webpack_require__(5);
class Region extends RegionComponent_1.RegionComponent {
    constructor(paper, paperRect = null, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions) {
        super(paper, paperRect, regionData, Object.assign({}, callbacks));
        this.styleSheet = null;
        this.ID = id;
        this.tags = tagsDescriptor;
        this.regionID = this.s8();
        this.styleID = `region_${this.regionID}_style`;
        this.styleSheet = this.insertStyleSheet();
        this.tagsUpdateOptions = tagsUpdateOptions;
        this.UI = [];
        const onChange = this.callbacks.onChange;
        this.callbacks.onChange = (region, regionData, ...args) => {
            this.regionData.initFrom(regionData);
            this.redraw();
            onChange(this, this.regionData, ...args);
        };
    }
    removeStyles() {
        document.getElementById(this.styleID).remove();
    }
    updateTags(tags, options) {
        this.tags = tags;
        this.tagsUpdateOptions = options;
    }
    move(arg1, arg2) {
        super.move(arg1, arg2);
        this.redraw();
    }
    resize(width, height) {
        super.resize(width, height);
        this.redraw();
    }
    redraw() {
        this.UI.forEach((element) => {
            element.redraw();
        });
    }
    freeze() {
        super.freeze();
        this.node.addClass("old");
        this.UI.forEach((element) => {
            element.freeze();
        });
    }
    unfreeze() {
        super.unfreeze();
        this.node.removeClass("old");
        this.UI.forEach((element) => {
            element.unfreeze();
        });
    }
    s8() {
        return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
    }
    insertStyleSheet() {
        const style = document.createElement("style");
        style.setAttribute("id", this.styleID);
        document.head.appendChild(style);
        return style.sheet;
    }
}
exports.Region = Region;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(4);
const RegionComponent_1 = __webpack_require__(5);
class DragComponent extends RegionComponent_1.RegionComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.isDragged = false;
        this.node = paper.g();
        this.node.addClass("dragLayer");
    }
    freeze() {
        super.freeze();
        this.isDragged = false;
        this.dragOrigin = null;
    }
    subscribeToDragEvents() {
        const listeners = [
            {
                event: "pointerenter",
                base: this.dragNode.node,
                listener: (e) => {
                    if (this.isDragged) {
                        e.stopPropagation();
                    }
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.dragNode.node,
                listener: (e) => {
                    if (this.isDragged) {
                        const rect = e.target.getBoundingClientRect();
                        const rdx = e.clientX - rect.left;
                        const rdy = e.clientY - rect.top;
                        let dx = e.clientX - this.dragOrigin.x;
                        let dy = e.clientY - this.dragOrigin.y;
                        if ((rdx < 0 && dx > 0) || (rdx > this.width && dx < 0)) {
                            dx = 0;
                        }
                        if ((rdy < 0 && dy > 0) || (rdy > this.height && dy < 0)) {
                            dy = 0;
                        }
                        let p = new Point2D_1.Point2D(this.x + dx, this.y + dy);
                        if (this.paperRect !== null) {
                            p = p.boundToRect(this.paperRect);
                        }
                        this.dragOrigin = new Point2D_1.Point2D(e.clientX, e.clientY);
                        const rd = this.regionData.copy();
                        rd.move(p);
                        this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVING);
                    }
                },
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.dragNode.node,
                listener: (e) => {
                },
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.dragNode.node,
                listener: (e) => {
                    this.dragNode.node.setPointerCapture(e.pointerId);
                    const multiselection = e.ctrlKey;
                    this.isDragged = true;
                    this.dragOrigin = new Point2D_1.Point2D(e.clientX, e.clientY);
                    this.callbacks.onManipulationLockRequest(this);
                    this.callbacks.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEBEGIN, multiselection);
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.dragNode.node,
                listener: (e) => {
                    this.dragNode.node.releasePointerCapture(e.pointerId);
                    const multiselection = e.ctrlKey;
                    if (this.isDragged) {
                        this.callbacks.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEEND, multiselection);
                        this.isDragged = false;
                        this.dragOrigin = null;
                    }
                    this.callbacks.onManipulationLockRelease(this);
                    this.callbacks.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.SELECTIONTOGGLE, multiselection);
                },
                bypass: false,
            },
        ];
        this.subscribeToEvents(listeners);
    }
}
exports.DragComponent = DragComponent;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RegionComponent_1 = __webpack_require__(5);
class TagsComponent extends RegionComponent_1.RegionComponent {
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, null);
        this.styleSheet = null;
        this.styleMap = [];
        this.styleLightMap = [];
        this.styleId = styleId;
        this.styleSheet = styleSheet;
        this.tags = tags;
        this.tagsUpdateOptions = tagsUpdateOptions;
        this.node = paper.g();
        this.node.addClass("tagsLayer");
    }
    updateTags(tags, options) {
        this.tags = tags;
        this.tagsUpdateOptions = options;
        this.rebuildTagLabels();
        this.clearStyleMaps();
        this.initStyleMaps(tags);
        const showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyStyleMaps(showBackground);
    }
    clearStyleMaps() {
        while (this.styleSheet.cssRules.length > 0) {
            this.styleSheet.deleteRule(0);
        }
    }
    applyStyleMaps(showRegionBackground = true) {
        if (this.tags && this.tags.primary !== undefined) {
            window.requestAnimationFrame(() => {
                const sm = (showRegionBackground ? this.styleMap : this.styleLightMap);
                for (const r of sm) {
                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                }
            });
        }
    }
}
exports.TagsComponent = TagsComponent;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const XYZColor_1 = __webpack_require__(13);
const SRGBColor_1 = __webpack_require__(19);
class RGBColor {
    get r() {
        return this.values[0];
    }
    get g() {
        return this.values[1];
    }
    get b() {
        return this.values[2];
    }
    constructor(r, g, b) {
        this.values = [r, g, b];
    }
    toArray() {
        return this.values.map((v) => v);
    }
    toXYZ() {
        const [r, g, b] = this.values;
        const x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
        const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
        return new XYZColor_1.XYZColor(x, y, z);
    }
    toSRGB() {
        const values = this.values.map((v) => {
            if (v < 0.0031308) {
                return 12.92 * v;
            }
            else {
                return 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
            }
        });
        return new SRGBColor_1.SRGBColor(values[0], values[1], values[2]);
    }
    toLAB() {
        return this.toXYZ().toLAB();
    }
}
exports.RGBColor = RGBColor;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RGBColor_1 = __webpack_require__(12);
const LABColor_1 = __webpack_require__(8);
class XYZColor {
    constructor(x, y, z) {
        this.values = [x, y, z];
    }
    get x() {
        return this.values[0];
    }
    get y() {
        return this.values[1];
    }
    get z() {
        return this.values[2];
    }
    toArray() {
        return this.values.map((v) => v);
    }
    toRGB() {
        const [x, y, z] = this.values;
        const r = +3.2406255 * x - 1.5372080 * y - 0.4986286 * z;
        const g = -0.9689307 * x + 1.8757561 * y + 0.0415175 * z;
        const b = +0.0557101 * x - 0.2040211 * y + 1.0569959 * z;
        return new RGBColor_1.RGBColor(r, g, b);
    }
    toSRGB() {
        return this.toRGB().toSRGB();
    }
    toLAB() {
        const x = this.x / XYZColor.D65.x;
        const y = this.y / XYZColor.D65.y;
        const z = this.z / XYZColor.D65.z;
        const xyz = [x, y, z].map((v) => {
            if (v > 0.008856451) {
                return v ** (1 / 3);
            }
            else {
                return 7.787037 * v + 16 / 116;
            }
        });
        return new LABColor_1.LABColor((116 * xyz[1] - 16) / 100, 5 * (xyz[0] - xyz[1]), 2 * (xyz[1] - xyz[2]));
    }
}
XYZColor.D65 = new XYZColor(0.95047, 1.000, 1.08883);
XYZColor.D50 = new XYZColor(0.966797, 1.000, 0.825188);
exports.XYZColor = XYZColor;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SRGBColor_1 = __webpack_require__(19);
class HSLColor {
    get h() {
        return this.values[0];
    }
    get s() {
        return this.values[1];
    }
    get l() {
        return this.values[2];
    }
    constructor(h, s, l) {
        this.values = [h, s, l];
    }
    toArray() {
        return this.values.map((v) => v);
    }
    toCSSValues() {
        return [this.h * 360, this.s * 100, this.l * 100];
    }
    toCSSString(alpha) {
        const [h, s, l] = this.toCSSValues();
        if (alpha !== undefined) {
            alpha = Math.min(1, Math.max(0, alpha));
            return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
        }
        else {
            return `hsl(${h}, ${s}%, ${l}%)`;
        }
    }
    toSRGB() {
        let m1;
        let m2;
        const [h, s, l] = this.values;
        if (l <= 0.5) {
            m2 = l * (s + 1);
        }
        else {
            m2 = l + s - l * s;
        }
        m1 = l * 2 - m2;
        const r = this.hue2rgb(m1, m2, h + 1 / 3);
        const g = this.hue2rgb(m1, m2, h);
        const b = this.hue2rgb(m1, m2, h - 1 / 3);
        return new SRGBColor_1.SRGBColor(r, g, b);
    }
    hue2rgb(m1, m2, h) {
        if (h < 0) {
            h = h + 1;
        }
        if (h > 1) {
            h = h - 1;
        }
        if (h * 6 < 1) {
            return m1 + (m2 - m1) * h * 6;
        }
        else if (h * 2 < 1) {
            return m2;
        }
        else if (h * 3 < 2) {
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        }
        else {
            return m1;
        }
    }
}
exports.HSLColor = HSLColor;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(4);
const RegionComponent_1 = __webpack_require__(5);
class AnchorsComponent extends RegionComponent_1.RegionComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.activeAnchorIndex = 0;
        this.isDragged = false;
        this.node = this.paper.g();
        this.node.addClass("anchorsLayer");
        this.anchors = [];
        this.anchorsNode = this.paper.g();
        this.node.add(this.anchorsNode);
        this.buildAnchors();
    }
    redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
            window.requestAnimationFrame(() => {
                this.regionData.points.forEach((p, index) => {
                    this.anchors[index].attr({
                        cx: p.x,
                        cy: p.y,
                    });
                });
            });
        }
    }
    freeze() {
        super.freeze();
    }
    buildAnchors() {
        this.buildPointAnchors();
        this.buildGhostAnchor();
        this.subscribeToEvents([
            {
                event: "pointerleave",
                base: this.node.node,
                listener: (e) => {
                    if (!this.isDragged) {
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                display: "none",
                            });
                        });
                    }
                },
                bypass: true,
            },
        ]);
    }
    buildPointAnchors() {
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);
            this.subscribeAnchorToEvents(anchor, index + 1);
        });
    }
    buildGhostAnchor() {
        this.ghostAnchor = this.createAnchor(this.paper, 0, 0, "ghost", AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS);
        this.ghostAnchor.attr({
            display: "none",
        });
        this.node.add(this.ghostAnchor);
        this.subscribeGhostToEvents();
    }
    subscribeAnchorToEvents(anchor, index) {
        this.subscribeToEvents([
            {
                event: "pointerenter",
                base: anchor.node,
                listener: (e) => {
                    this.activeAnchorIndex = index;
                    const anchorPoint = this.getActiveAnchorPoint(e);
                    window.requestAnimationFrame(() => {
                        this.ghostAnchor.attr({
                            cx: anchorPoint.x,
                            cy: anchorPoint.y,
                            display: "block",
                        });
                    });
                },
                bypass: false,
            },
        ]);
    }
    createAnchor(paper, x, y, style, r = AnchorsComponent.DEFAULT_ANCHOR_RADIUS) {
        const a = paper.circle(x, y, r);
        a.addClass("anchorStyle");
        if (style !== undefined && style !== "") {
            a.addClass(style);
        }
        return a;
    }
    onGhostPointerEnter(e) {
    }
    onGhostPointerLeave(e) {
        if (!this.isDragged) {
            window.requestAnimationFrame(() => {
                this.ghostAnchor.attr({
                    display: "none",
                });
            });
            this.activeAnchorIndex = 0;
        }
    }
    onGhostPointerDown(e) {
        this.ghostAnchor.node.setPointerCapture(e.pointerId);
        const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
        const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
        this.dragOrigin = new Point2D_1.Point2D(offsetX, offsetY);
        this.isDragged = true;
        this.callbacks.onManipulationLockRequest(this);
        this.callbacks.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEBEGIN);
    }
    onGhostPointerMove(e) {
        if (this.isDragged) {
            const ghost = e.target.getBoundingClientRect();
            const rdx = e.clientX - ghost.left;
            const rdy = e.clientY - ghost.top;
            const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
            let dx = offsetX - this.dragOrigin.x;
            let dy = offsetY - this.dragOrigin.y;
            if ((rdx < 0 && dx > 0) || (rdx > 0 && dx < 0)) {
                dx = 0;
            }
            if ((rdy < 0 && dy > 0) || (rdy > 0 && dy < 0)) {
                dy = 0;
            }
            if (this.activeAnchorIndex !== 0) {
                const anchorPoint = this.getActiveAnchorPoint(e);
                let p = new Point2D_1.Point2D(anchorPoint.x + dx, anchorPoint.y + dy);
                if (this.paperRect !== null) {
                    p = p.boundToRect(this.paperRect);
                }
                window.requestAnimationFrame(() => {
                    this.ghostAnchor.attr({ cx: p.x, cy: p.y });
                });
                this.updateRegion(p);
            }
            this.dragOrigin = new Point2D_1.Point2D(offsetX, offsetY);
        }
    }
    onGhostPointerUp(e) {
        this.ghostAnchor.node.releasePointerCapture(e.pointerId);
        this.callbacks.onManipulationLockRelease(this);
        this.callbacks.onChange(this, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEEND);
        this.activeAnchorIndex = 0;
        this.dragOrigin = null;
        this.isDragged = false;
        window.requestAnimationFrame(() => {
            this.ghostAnchor.attr({
                display: "none",
            });
        });
    }
    subscribeGhostToEvents() {
        const listeners = [
            {
                event: "pointerenter",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerEnter,
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerLeave,
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerDown,
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerUp,
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.ghostAnchor.node,
                listener: this.onGhostPointerMove,
                bypass: false,
            },
        ];
        this.subscribeToEvents(listeners);
    }
    getActiveAnchorPoint(e) {
        if (this.activeAnchorIndex > 0) {
            return this.regionData.points[this.activeAnchorIndex - 1];
        }
        else {
            return null;
        }
    }
}
AnchorsComponent.DEFAULT_ANCHOR_RADIUS = 3;
AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS = 7;
exports.AnchorsComponent = AnchorsComponent;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SelectionMode;
(function (SelectionMode) {
    SelectionMode[SelectionMode["NONE"] = 0] = "NONE";
    SelectionMode[SelectionMode["POINT"] = 1] = "POINT";
    SelectionMode[SelectionMode["RECT"] = 2] = "RECT";
    SelectionMode[SelectionMode["COPYRECT"] = 3] = "COPYRECT";
    SelectionMode[SelectionMode["POLYLINE"] = 4] = "POLYLINE";
    SelectionMode[SelectionMode["POLYGON"] = 5] = "POLYGON";
})(SelectionMode = exports.SelectionMode || (exports.SelectionMode = {}));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Element {
    constructor(paper, boundRect) {
        this.isVisible = true;
        this.paper = paper;
        this.boundRect = boundRect;
    }
    get width() {
        return this.boundRect.width;
    }
    get height() {
        return this.boundRect.height;
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
exports.Element = Element;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RGBColor_1 = __webpack_require__(12);
const SRGBColor_1 = __webpack_require__(19);
const XYZColor_1 = __webpack_require__(13);
const LABColor_1 = __webpack_require__(8);
const HSLColor_1 = __webpack_require__(14);
class Color {
    get sRGB() {
        return this.srgbColor;
    }
    get RGB() {
        if (this.rgbColor === undefined) {
            this.rgbColor = this.srgbColor.toRGB();
        }
        return this.rgbColor;
    }
    get XYZ() {
        if (this.xyzColor === undefined) {
            this.xyzColor = this.RGB.toXYZ();
        }
        return this.xyzColor;
    }
    get LAB() {
        if (this.labColor === undefined) {
            this.labColor = this.XYZ.toLAB();
        }
        return this.labColor;
    }
    get HSL() {
        if (this.hslColor === undefined) {
            this.hslColor = this.srgbColor.toHSL();
        }
        return this.hslColor;
    }
    constructor(...args) {
        if (args.length === 1) {
            const c = args[0];
            if (c instanceof SRGBColor_1.SRGBColor) {
                this.srgbColor = c;
            }
            else if (c instanceof RGBColor_1.RGBColor) {
                this.rgbColor = c;
                this.srgbColor = c.toSRGB();
            }
            else if (c instanceof HSLColor_1.HSLColor) {
                this.hslColor = c;
                this.srgbColor = c.toSRGB();
            }
            else if (c instanceof XYZColor_1.XYZColor) {
                this.xyzColor = c;
                this.rgbColor = c.toRGB();
                this.srgbColor = this.rgbColor.toSRGB();
            }
            else if (c instanceof LABColor_1.LABColor) {
                this.labColor = c;
                this.xyzColor = c.toXYZ();
                this.rgbColor = this.xyzColor.toRGB();
                this.srgbColor = this.rgbColor.toSRGB();
            }
            else if (typeof c === "string") {
                this.srgbColor = SRGBColor_1.SRGBColor.ParseHex(c);
            }
            else {
                throw new Error("Wrong arg type. Expected one of the '***Color' types.");
            }
        }
        else if (args.length === 3) {
            if (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number") {
                this.srgbColor = new SRGBColor_1.SRGBColor(args[0], args[1], args[2]);
            }
            else {
                throw new Error("Wrong arg type. Expected 3 args of the 'number' type.");
            }
        }
        else {
            throw new Error("Wrong args for Color constructor.");
        }
    }
}
exports.Color = Color;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const HSLColor_1 = __webpack_require__(14);
const RGBColor_1 = __webpack_require__(12);
class SRGBColor {
    static ParseHex(hex) {
        const isValidColor = /#([a-f0-9]{3,4}){1,2}\b/i.test(hex);
        if (!isValidColor) {
            throw new Error(`Invalid CSS RGB color: ${hex}`);
        }
        let r;
        let g;
        let b;
        if (hex.length === 7 || hex.length === 9) {
            r = parseInt(hex.substring(1, 3), 16) / 255;
            g = parseInt(hex.substring(3, 5), 16) / 255;
            b = parseInt(hex.substring(5, 7), 16) / 255;
        }
        else if (hex.length === 4 || hex.length === 5) {
            r = parseInt(hex.charAt(1), 16) / 16;
            g = parseInt(hex.charAt(2), 16) / 16;
            b = parseInt(hex.charAt(3), 16) / 16;
        }
        return new SRGBColor(r, g, b);
    }
    get r() {
        return this.values[0];
    }
    get g() {
        return this.values[1];
    }
    get b() {
        return this.values[2];
    }
    constructor(r, g, b) {
        this.values = [r, g, b];
    }
    isValidColor() {
        return (this.r >= 0) && (this.r <= 1) &&
            (this.g >= 0) && (this.g <= 1) &&
            (this.b >= 0) && (this.b <= 1);
    }
    truncate() {
        return new SRGBColor(Math.min(1, Math.max(0, this.r)), Math.min(1, Math.max(0, this.g)), Math.min(1, Math.max(0, this.b)));
    }
    toArray() {
        return this.values.map((v) => v);
    }
    toCSSString(alpha) {
        const [r, g, b] = this.to255();
        if (alpha !== undefined) {
            alpha = Math.min(1, Math.max(0, alpha));
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        else {
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
    toHex(alpha) {
        const [r, g, b] = this.toFF();
        if (alpha !== undefined) {
            alpha = Math.min(1, Math.max(0, alpha));
            const alphaFF = Math.round(alpha * 255).toString(16);
            return `#${r}${g}${b}${alphaFF}`;
        }
        else {
            return `#${r}${g}${b}`;
        }
    }
    toHSL() {
        const [r, g, b] = this.values;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;
        let s;
        const l = (max + min) / 2;
        if (max === min) {
            h = 0;
            s = 0;
        }
        else {
            const d = max - min;
            s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
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
        return new HSLColor_1.HSLColor(h, s, l);
    }
    toXYZ() {
        return this.toRGB().toXYZ();
    }
    toRGB() {
        const [r, g, b] = this.values.map((v) => {
            if (v < 0.04045) {
                return v / 12.92;
            }
            else {
                return ((v + 0.055) / 1.055) ** 2.4;
            }
        });
        return new RGBColor_1.RGBColor(r, g, b);
    }
    toLAB() {
        return this.toRGB().toXYZ().toLAB();
    }
    to255() {
        const rgb = this.truncate();
        return rgb.values.map((v) => Math.round(255 * v));
    }
    toFF() {
        const rgb = this.truncate();
        return rgb.values.map((v) => Math.round(255 * v).toString(16).padStart(2, "0"));
    }
}
exports.SRGBColor = SRGBColor;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = __webpack_require__(1);
const ToolbarIcon_1 = __webpack_require__(3);
const ToolbarSelectIcon_1 = __webpack_require__(30);
const ToolbarSeparator_1 = __webpack_require__(31);
const ToolbarSwitchIcon_1 = __webpack_require__(32);
const ToolbarTriggerIcon_1 = __webpack_require__(33);
class Toolbar {
    constructor(svgHost) {
        this.iconSpace = 8;
        this.areHotKeysEnabled = true;
        this.icons = new Array();
        this.buildUIElements(svgHost);
    }
    addSelector(icon, actor) {
        const newIcon = new ToolbarSelectIcon_1.ToolbarSelectIcon(this.paper, icon, (action) => {
            this.select(action);
            actor(action);
        });
        this.addIcon(newIcon);
    }
    addSwitch(icon, actor) {
        const newIcon = new ToolbarSwitchIcon_1.ToolbarSwitchIcon(this.paper, icon, (action) => {
            actor(action);
        });
        this.addIcon(newIcon);
    }
    addSeparator() {
        const newIcon = new ToolbarSeparator_1.ToolbarSeparator(this.paper, ToolbarIcon_1.ToolbarIcon.IconWidth);
        this.addIcon(newIcon);
    }
    addTrigger(icon, actor) {
        const newIcon = new ToolbarTriggerIcon_1.ToolbarTriggerIcon(this.paper, icon, (action) => {
            actor(action);
        });
        this.addIcon(newIcon);
    }
    select(action) {
        this.icons.forEach((icon) => {
            if (icon instanceof ToolbarSelectIcon_1.ToolbarSelectIcon) {
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
        const switchIcon = this.findIconByAction(action);
        if (switchIcon !== undefined && switchIcon instanceof ToolbarSwitchIcon_1.ToolbarSwitchIcon) {
            (on) ? switchIcon.select() : switchIcon.unselect();
        }
    }
    enableHotkeys() {
        this.areHotKeysEnabled = true;
    }
    disableHotkeys() {
        this.areHotKeysEnabled = false;
    }
    buildUIElements(svgHost) {
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect_1.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
        const toolbarGroup = this.paper.g();
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
        if (newIcon === undefined) {
            this.toolbarWidth = ToolbarIcon_1.ToolbarIcon.IconWidth + 2 * this.iconSpace;
            this.toolbarHeight = this.icons.length * (ToolbarIcon_1.ToolbarIcon.IconHeight + this.iconSpace) + this.iconSpace;
        }
        else {
            const width = newIcon.width + 2 * this.iconSpace;
            if (width > this.toolbarWidth) {
                this.toolbarWidth = width;
            }
            this.toolbarHeight = this.toolbarHeight + newIcon.height + this.iconSpace;
        }
    }
    updateToolbarSize() {
        this.backgroundRect.attr({
            height: this.toolbarHeight,
            width: this.toolbarWidth,
        });
    }
    addIcon(newIcon) {
        this.icons.push(newIcon);
        this.iconsLayer.add(newIcon.node);
        newIcon.move(this.iconSpace, this.toolbarHeight + this.iconSpace);
        this.recalculateToolbarSize(newIcon);
        this.updateToolbarSize();
    }
    findIconByKey(key) {
        return this.icons.find((icon) => {
            if (icon.description !== null) {
                return icon.description.key.includes(key);
            }
            return false;
        });
    }
    findIconByAction(action) {
        return this.icons.find((icon) => {
            return icon.description !== null && icon.description.action === action;
        });
    }
    subscribeToKeyboardEvents() {
        window.addEventListener("keyup", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (this.areHotKeysEnabled && !e.ctrlKey && !e.altKey) {
                    const icon = this.findIconByKey(e.key);
                    if (icon !== undefined) {
                        if (icon instanceof ToolbarSelectIcon_1.ToolbarSelectIcon || icon instanceof ToolbarSwitchIcon_1.ToolbarSwitchIcon
                            || icon instanceof ToolbarTriggerIcon_1.ToolbarTriggerIcon) {
                            icon.activate();
                        }
                    }
                }
            }
        });
    }
}
exports.Toolbar = Toolbar;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ZoomManager_1 = __webpack_require__(22);
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const IRegionCallbacks_1 = __webpack_require__(4);
const RectRegion_1 = __webpack_require__(23);
const PointRegion_1 = __webpack_require__(24);
const PolygonRegion_1 = __webpack_require__(39);
const PolylineRegion_1 = __webpack_require__(43);
const RegionMenu_1 = __webpack_require__(47);
const RegionData_1 = __webpack_require__(2);
class RegionsManager {
    constructor(svgHost, callbacks) {
        this.isFrozenState = false;
        this.justManipulated = false;
        this.manipulationLock = false;
        this.tagsUpdateOptions = {
            showRegionBackground: true,
        };
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect_1.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
        this.regions = new Array();
        this.callbacks = {
            onChange: (region, regionData, state, multiSelection = false) => {
                this.onRegionChange(region, regionData, state, multiSelection);
                if (typeof callbacks.onChange === "function") {
                    callbacks.onChange(region, regionData, state, multiSelection);
                }
            },
            onManipulationLockRequest: (region) => {
                this.manipulationLock = true;
                if (typeof callbacks.onManipulationLockRequest === "function") {
                    callbacks.onManipulationLockRequest(region);
                }
            },
            onManipulationLockRelease: (region) => {
                this.manipulationLock = false;
                if (typeof callbacks.onManipulationLockRelease === "function") {
                    callbacks.onManipulationLockRelease(region);
                }
            },
            onManipulationBegin: this.functionGuard(callbacks.onManipulationBegin),
            onManipulationEnd: (region) => {
                if (!this.manipulationLock && typeof callbacks.onManipulationEnd === "function") {
                    callbacks.onManipulationEnd(region);
                }
            },
            onRegionDelete: this.functionGuard(callbacks.onRegionDelete),
            onRegionMoveBegin: this.functionGuard(callbacks.onRegionMoveBegin),
            onRegionMove: this.functionGuard(callbacks.onRegionMove),
            onRegionMoveEnd: this.functionGuard(callbacks.onRegionMoveEnd),
            onRegionSelected: this.functionGuard(callbacks.onRegionSelected),
        };
        this.buildOn(this.paper);
        this.subscribeToEvents();
    }
    get isFrozen() {
        return this.isFrozenState;
    }
    addRegion(id, regionData, tagsDescriptor) {
        if (regionData.type === RegionData_1.RegionDataType.Point) {
            this.addPointRegion(id, regionData, tagsDescriptor);
        }
        else if (regionData.type === RegionData_1.RegionDataType.Polyline) {
            this.addPolylineRegion(id, regionData, tagsDescriptor);
        }
        else if (regionData.type === RegionData_1.RegionDataType.Rect) {
            this.addRectRegion(id, regionData, tagsDescriptor);
        }
        else if (regionData.type === RegionData_1.RegionDataType.Polygon) {
            this.addPolygonRegion(id, regionData, tagsDescriptor);
        }
        this.sortRegionsByArea();
        this.redrawAllRegions();
    }
    addRectRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new RectRegion_1.RectRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
        this.registerRegion(region);
    }
    addPointRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new PointRegion_1.PointRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
        this.registerRegion(region);
    }
    addPolylineRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new PolylineRegion_1.PolylineRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
        this.registerRegion(region);
    }
    addPolygonRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new PolygonRegion_1.PolygonRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
        this.registerRegion(region);
    }
    redrawAllRegions() {
        window.requestAnimationFrame((e) => {
            this.regions.forEach((region) => {
                const node = region.node.remove();
                this.regionManagerLayer.add(node);
            });
        });
    }
    getSelectedRegionsBounds() {
        const regions = this.lookupSelectedRegions().map((region) => {
            return {
                id: region.ID,
                x: region.x,
                y: region.y,
                width: region.boundRect.width,
                height: region.boundRect.height,
            };
        });
        return regions;
    }
    getAllRegions() {
        return this.regions.map((region) => {
            return {
                id: region.ID,
                tags: region.tags,
                regionData: this.scaleRegionToOriginalSize(region.regionData),
            };
        });
    }
    getSelectedRegions() {
        return this.lookupSelectedRegions().map((region) => {
            return {
                id: region.ID,
                tags: region.tags,
                regionData: this.scaleRegionToOriginalSize(region.regionData),
            };
        });
    }
    getSelectedRegionsWithZoomScale() {
        return this.lookupSelectedRegions().map((region) => {
            return {
                id: region.ID,
                tags: region.tags,
                regionData: region.regionData,
            };
        });
    }
    deleteRegionById(id) {
        const region = this.lookupRegionByID(id);
        if (region != null) {
            this.deleteRegion(region);
        }
        this.callbacks.onManipulationEnd();
    }
    deleteAllRegions() {
        for (const region of this.regions) {
            region.removeStyles();
            region.node.remove();
        }
        this.regions = [];
        this.menu.hide();
        this.callbacks.onManipulationEnd();
    }
    updateTagsById(id, tagsDescriptor) {
        const region = this.lookupRegionByID(id);
        if (region != null) {
            region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
        }
    }
    updateTagsForSelectedRegions(tagsDescriptor) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((region) => {
            region.updateTags(tagsDescriptor, this.tagsUpdateOptions);
        });
        regions.forEach((region) => {
            region.unselect();
        });
    }
    selectRegionById(id) {
        const region = this.lookupRegionByID(id);
        this.selectRegion(region);
    }
    resize(width, height) {
        const tw = width / this.paperRect.width;
        const th = height / this.paperRect.height;
        this.paperRect.resize(width, height);
        this.menu.hide();
        for (const region of this.regions) {
            region.move(new Point2D_1.Point2D(region.x * tw, region.y * th));
            region.resize(region.boundRect.width * tw, region.boundRect.height * th);
        }
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
        this.isFrozenState = true;
    }
    unfreeze() {
        this.regionManagerLayer.removeClass("frozen");
        if (this.frozenNuance !== "") {
            this.regionManagerLayer.removeClass(this.frozenNuance);
        }
        const selectedRegions = this.lookupSelectedRegions();
        if (selectedRegions.length > 0) {
            this.menu.showOnRegion(selectedRegions[0]);
        }
        this.regions.forEach((region) => {
            region.unfreeze();
        });
        this.isFrozenState = false;
    }
    toggleFreezeMode() {
        if (this.isFrozen) {
            this.unfreeze();
        }
        else {
            this.freeze();
        }
    }
    toggleBackground() {
        this.tagsUpdateOptions.showRegionBackground = !this.tagsUpdateOptions.showRegionBackground;
        this.regions.forEach((r) => {
            r.updateTags(r.tags, this.tagsUpdateOptions);
        });
    }
    scaleRegion(regionData, sf) {
        const rd = regionData.copy();
        rd.scale(sf, sf);
        return rd;
    }
    scaleRegionToOriginalSize(regionData) {
        const zm = ZoomManager_1.ZoomManager.getInstance();
        if (zm && zm.isZoomEnabled) {
            const sf = 1 / zm.getZoomData().currentZoomScale;
            return this.scaleRegion(regionData, sf);
        }
        return regionData;
    }
    lookupRegionByID(id) {
        let region = null;
        let i = 0;
        while (i < this.regions.length && region == null) {
            if (this.regions[i].ID === id) {
                region = this.regions[i];
            }
            i++;
        }
        return region;
    }
    sortRegionsByArea() {
        function quickSort(arr, left, right) {
            let pivot;
            let partitionIndex;
            if (left < right) {
                pivot = right;
                partitionIndex = partition(arr, pivot, left, right);
                quickSort(arr, left, partitionIndex - 1);
                quickSort(arr, partitionIndex + 1, right);
            }
            return arr;
        }
        function partition(arr, pivot, left, right) {
            const pivotValue = arr[pivot].area;
            let partitionIndex = left;
            for (let i = left; i < right; i++) {
                if (arr[i].area > pivotValue) {
                    swap(arr, i, partitionIndex);
                    partitionIndex++;
                }
            }
            swap(arr, right, partitionIndex);
            return partitionIndex;
        }
        function swap(arr, i, j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        const length = this.regions.length;
        if (length > 1) {
            quickSort(this.regions, 0, this.regions.length - 1);
        }
    }
    lookupSelectedRegions() {
        const collection = Array();
        for (const region of this.regions) {
            if (region.isSelected) {
                collection.push(region);
            }
        }
        return collection;
    }
    deleteRegion(region) {
        region.removeStyles();
        region.node.remove();
        this.regions = this.regions.filter((r) => {
            return r !== region;
        });
        this.menu.hide();
        this.callbacks.onRegionDelete(region.ID, region.regionData);
    }
    deleteSelectedRegions() {
        const collection = this.lookupSelectedRegions();
        for (const region of collection) {
            this.deleteRegion(region);
        }
        this.selectNextRegion();
        this.callbacks.onManipulationEnd();
    }
    selectRegion(region) {
        if (region !== null) {
            this.unselectRegions(region);
            region.select();
            this.menu.showOnRegion(region);
            this.callbacks.onRegionSelected(region.ID);
        }
    }
    selectAllRegions() {
        let r = null;
        for (const region of this.regions) {
            r = region;
            r.select();
            this.callbacks.onRegionSelected(r.ID);
        }
        if (r != null) {
            this.menu.showOnRegion(r);
        }
    }
    selectNextRegion() {
        let region = null;
        let i = 0;
        const length = this.regions.length;
        if (length === 1) {
            region = this.regions[0];
        }
        else if (length > 1) {
            while (i < length && region == null) {
                if (this.regions[i].isSelected) {
                    region = (i === length - 1) ? this.regions[0] : this.regions[i + 1];
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
        const p1 = new Point2D_1.Point2D(x, y).boundToRect(this.paperRect);
        const p2 = new Point2D_1.Point2D(x + w, y + h).boundToRect(this.paperRect);
        region.move(p1);
        region.resize(p2.x - p1.x, p2.y - p1.y);
    }
    moveSelectedRegions(dx, dy) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((r) => {
            this.reshapeRegion(r, dx, dy, 0, 0);
        });
        this.menu.showOnRegion(regions[0]);
    }
    resizeSelectedRegions(dw, dh, inverse = false) {
        const regions = this.lookupSelectedRegions();
        regions.forEach((r) => {
            this.reshapeRegion(r, 0, 0, dw, dh, inverse);
        });
        this.menu.showOnRegion(regions[0]);
    }
    onRegionChange(region, regionData, state, multiSelection = false) {
        if (state === IRegionCallbacks_1.ChangeEventType.MOVEBEGIN) {
            if (!multiSelection) {
                this.unselectRegions(region);
            }
            this.menu.hide();
            this.callbacks.onRegionSelected(region.ID, multiSelection);
            this.callbacks.onRegionMoveBegin(region.ID, regionData);
            this.justManipulated = false;
        }
        else if (state === IRegionCallbacks_1.ChangeEventType.MOVING) {
            this.callbacks.onRegionMove(region.ID, regionData);
            this.justManipulated = true;
        }
        else if (state === IRegionCallbacks_1.ChangeEventType.MOVEEND) {
            if (this.justManipulated) {
                region.select();
                this.menu.showOnRegion(region);
                this.sortRegionsByArea();
                this.redrawAllRegions();
                this.callbacks.onRegionMoveEnd(region.ID, regionData);
            }
        }
        else if (state === IRegionCallbacks_1.ChangeEventType.SELECTIONTOGGLE && !this.justManipulated) {
            if (!region.isSelected) {
                if (!multiSelection) {
                    this.unselectRegions(region);
                }
                region.select();
                this.menu.showOnRegion(region);
                this.callbacks.onRegionSelected(region.ID, multiSelection);
            }
            else {
                region.unselect();
                this.menu.hide();
                this.callbacks.onRegionSelected("", multiSelection);
            }
        }
    }
    unselectRegions(except) {
        for (const region of this.regions) {
            if (region !== except) {
                region.unselect();
            }
        }
    }
    buildOn(paper) {
        this.regionManagerLayer = paper.g();
        this.regionManagerLayer.addClass("regionManager");
        this.menuLayer = paper.g();
        this.menuLayer.addClass("menuManager");
        this.menu = new RegionMenu_1.MenuElement(paper, this.paperRect, new RegionData_1.RegionData(0, 0, 0, 0), this.callbacks);
        this.menu.addAction("delete", "trash", (region) => {
            this.deleteRegion(region);
            this.menu.hide();
        });
        this.menuLayer.add(this.menu.menuGroup);
        this.menu.hide();
    }
    subscribeToEvents() {
        this.regionManagerLayer.node.addEventListener("pointerenter", (e) => {
            this.callbacks.onManipulationBegin();
        });
        this.regionManagerLayer.node.addEventListener("pointerleave", (e) => {
            this.callbacks.onManipulationEnd();
        });
        window.addEventListener("keyup", (e) => {
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
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
            if (!(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement) &&
                !(e.target instanceof HTMLSelectElement)) {
                if (!this.isFrozen) {
                    switch (e.code) {
                        case "KeyA":
                        case "Numpad1":
                            if (e.ctrlKey) {
                                this.selectAllRegions();
                            }
                            break;
                    }
                }
            }
        });
    }
    registerRegion(region) {
        this.unselectRegions();
        region.select();
        this.regionManagerLayer.add(region.node);
        this.regions.push(region);
        this.menu.showOnRegion(region);
        region.unselect();
    }
    functionGuard(f) {
        return (...args) => {
            if (typeof f === "function") {
                f(...args);
            }
        };
    }
}
exports.RegionsManager = RegionsManager;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ZoomDirection;
(function (ZoomDirection) {
    ZoomDirection[ZoomDirection["In"] = 0] = "In";
    ZoomDirection[ZoomDirection["Out"] = 1] = "Out";
})(ZoomDirection = exports.ZoomDirection || (exports.ZoomDirection = {}));
class ZoomManager {
    constructor(isZoomEnabled = false, zoomCallbacks, maxZoom, zoomScale) {
        this.minZoomScale = 1;
        this.maxZoomScale = 4;
        this.zoomScale = 0.5;
        this.isZoomEnabled = isZoomEnabled;
        this.maxZoomScale = maxZoom ? maxZoom : this.maxZoomScale;
        this.zoomScale = zoomScale ? zoomScale : this.zoomScale;
        this.currentZoomScale = this.minZoomScale;
        this.previousZoomScale = this.minZoomScale;
        this.callbacks = zoomCallbacks;
        this._resetZoomOnContentLoad = false;
    }
    get resetZoomOnContentLoad() {
        return this._resetZoomOnContentLoad;
    }
    set resetZoomOnContentLoad(reset) {
        this._resetZoomOnContentLoad = reset;
        if (reset) {
            this.previousZoomScale = this.currentZoomScale = 1;
        }
    }
    static getInstance(isZoomEnabled = false, zoomCallbacks, maxZoom, zoomScale) {
        if (!ZoomManager.instance) {
            ZoomManager.instance = new ZoomManager(isZoomEnabled, zoomCallbacks, maxZoom, zoomScale);
        }
        return ZoomManager.instance;
    }
    updateZoomScale(zoomType) {
        this.previousZoomScale = this.currentZoomScale;
        let zoomData = this.getZoomData();
        let updatedZoomScale;
        if (zoomType == ZoomDirection.In) {
            updatedZoomScale = this.currentZoomScale + this.zoomScale;
        }
        if (zoomType == ZoomDirection.Out) {
            updatedZoomScale = this.currentZoomScale - this.zoomScale;
        }
        if (updatedZoomScale >= this.minZoomScale && updatedZoomScale <= this.maxZoomScale) {
            this.currentZoomScale = updatedZoomScale;
            zoomData.currentZoomScale = updatedZoomScale;
            return zoomData;
        }
    }
    setMaxZoomScale(maxZoomScale) {
        this.maxZoomScale = maxZoomScale;
    }
    setZoomScale(zoomScale) {
        this.zoomScale = zoomScale;
    }
    getZoomData() {
        let zoomData = {
            minZoomScale: this.minZoomScale,
            maxZoomScale: this.maxZoomScale,
            currentZoomScale: this.currentZoomScale,
            previousZoomScale: this.previousZoomScale
        };
        return zoomData;
    }
    deleteInstance() {
        if (ZoomManager.instance) {
            delete ZoomManager.instance;
        }
    }
}
exports.ZoomManager = ZoomManager;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = __webpack_require__(1);
const Region_1 = __webpack_require__(9);
const AnchorsElements_1 = __webpack_require__(34);
const DragElement_1 = __webpack_require__(35);
const TagsElement_1 = __webpack_require__(36);
class RectRegion extends Region_1.Region {
    constructor(paper, paperRect = null, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions) {
        super(paper, paperRect, regionData, Object.assign({}, callbacks), id, tagsDescriptor, tagsUpdateOptions);
        if (paperRect !== null) {
            this.paperRects = {
                actual: new Rect_1.Rect(paperRect.width - regionData.width, paperRect.height - regionData.height),
                host: paperRect,
            };
        }
        this.buildOn(paper);
        const onChange = this.callbacks.onChange;
        this.callbacks.onChange = (region, regionData, ...args) => {
            this.paperRects.actual.resize(this.paperRects.host.width - regionData.width, this.paperRects.host.height - regionData.height);
            onChange(this, regionData, ...args);
        };
    }
    updateTags(tags, options) {
        super.updateTags(tags, options);
        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }
    resize(width, height) {
        this.paperRects.actual.resize(this.paperRects.host.width - width, this.paperRects.host.height - height);
        super.resize(width, height);
    }
    buildOn(paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);
        this.anchorNode = new AnchorsElements_1.AnchorsElement(paper, this.paperRects.host, this.regionData, this.callbacks);
        this.dragNode = new DragElement_1.DragElement(paper, this.paperRects.actual, this.regionData, this.callbacks);
        this.tagsNode = new TagsElement_1.TagsElement(paper, this.paperRects.host, this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.tagsNode.node);
        this.node.add(this.dragNode.node);
        this.node.add(this.anchorNode.node);
        this.UI.push(this.tagsNode, this.dragNode, this.anchorNode);
    }
}
exports.RectRegion = RectRegion;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Region_1 = __webpack_require__(9);
const DragElement_1 = __webpack_require__(37);
const TagsElement_1 = __webpack_require__(38);
class PointRegion extends Region_1.Region {
    constructor(paper, paperRect = null, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions) {
        super(paper, paperRect, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions);
        this.buildOn(paper);
    }
    updateTags(tags, options) {
        super.updateTags(tags, options);
        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }
    buildOn(paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);
        this.dragNode = new DragElement_1.DragElement(paper, this.paperRect, this.regionData, this.callbacks);
        this.tagsNode = new TagsElement_1.TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.UI.push(this.tagsNode, this.dragNode);
    }
}
exports.PointRegion = PointRegion;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = __webpack_require__(1);
const ISelectorSettings_1 = __webpack_require__(16);
const PointSelector_1 = __webpack_require__(48);
const PolylineSelector_1 = __webpack_require__(49);
const PolygonSelector_1 = __webpack_require__(50);
const RectCopySelector_1 = __webpack_require__(51);
const RectSelector_1 = __webpack_require__(52);
class AreaSelector {
    constructor(svgHost, callbacks) {
        this.isVisible = true;
        this.parentNode = svgHost;
        if (callbacks !== undefined) {
            this.callbacks = callbacks;
        }
        else {
            this.callbacks = {
                onLocked: null,
                onSelectionBegin: null,
                onSelectionEnd: null,
                onUnlocked: null,
            };
        }
        this.buildUIElements();
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
            this.selector.resize(this.boundRect.width, this.boundRect.height);
        }
    }
    disable() {
        if (this.selector !== null) {
            this.selector.disable();
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
    setSelectionMode(settings) {
        let selectionSettings;
        if (settings === null || settings === undefined) {
            selectionSettings = {
                mode: ISelectorSettings_1.SelectionMode.NONE,
            };
        }
        else if (settings.mode !== undefined) {
            selectionSettings = settings;
        }
        else {
            selectionSettings = { mode: settings };
        }
        if (this.selectorSettings === undefined || this.selectorSettings.mode !== selectionSettings.mode) {
            this.disable();
            this.selectorSettings = selectionSettings;
            if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.NONE) {
                this.selector = null;
                return;
            }
            else if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.COPYRECT) {
                this.selector = this.rectCopySelector;
                const template = this.selectorSettings.template;
                if (template !== undefined) {
                    this.rectCopySelector.setTemplate(template);
                }
                else {
                    this.rectCopySelector.setTemplate(AreaSelector.DefaultTemplateSize);
                }
            }
            else if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.RECT) {
                this.selector = this.rectSelector;
            }
            else if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.POINT) {
                this.selector = this.pointSelector;
            }
            else if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.POLYLINE) {
                this.selector = this.polylineSelector;
            }
            else if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.POLYGON) {
                this.selector = this.polygonSelector;
            }
            this.enable();
            if (this.isVisible) {
                this.show();
            }
            else {
                this.hide();
            }
        }
    }
    getSelectorSettings() {
        return this.selectorSettings;
    }
    updateRectCopyTemplateSelector(template) {
        if (template !== undefined) {
            this.rectCopySelector.setTemplate(template);
        }
        else {
            this.rectCopySelector.setTemplate(AreaSelector.DefaultTemplateSize);
        }
    }
    getRectCopyTemplate(regions) {
        if (regions !== undefined && regions.length > 0) {
            const r = regions[0];
            return new Rect_1.Rect(r.regionData.width, r.regionData.height);
        }
        else {
            return new Rect_1.Rect(40, 40);
        }
    }
    buildUIElements() {
        this.paper = Snap(this.parentNode);
        this.boundRect = new Rect_1.Rect(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
        this.areaSelectorLayer = this.paper.g();
        this.areaSelectorLayer.addClass("areaSelector");
        this.rectSelector = new RectSelector_1.RectSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.rectCopySelector = new RectCopySelector_1.RectCopySelector(this.parentNode, this.paper, this.boundRect, new Rect_1.Rect(0, 0), this.callbacks);
        this.pointSelector = new PointSelector_1.PointSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.polylineSelector = new PolylineSelector_1.PolylineSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
        this.polygonSelector = new PolygonSelector_1.PolygonSelector(this.parentNode, this.paper, this.boundRect, this.callbacks);
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
AreaSelector.DefaultTemplateSize = new Rect_1.Rect(20, 20);
exports.AreaSelector = AreaSelector;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const Element_1 = __webpack_require__(17);
class RectElement extends Element_1.Element {
    get x() {
        return this.originPoint.x;
    }
    get y() {
        return this.originPoint.y;
    }
    constructor(paper, boundRect, rect) {
        super(paper, boundRect);
        this.rect = new Rect_1.Rect(rect.width, rect.height);
        this.originPoint = new Point2D_1.Point2D(0, 0);
        this.buildUIElements();
        this.hide();
    }
    move(p) {
        this.node.node.setAttribute("x", p.x.toString());
        this.node.node.setAttribute("y", p.y.toString());
        this.originPoint.move(p);
    }
    resize(width, height) {
        this.rect.resize(width, height);
        this.node.node.setAttribute("height", height.toString());
        this.node.node.setAttribute("width", width.toString());
    }
    buildUIElements() {
        this.node = this.paper.rect(0, 0, this.rect.width, this.rect.height);
    }
}
exports.RectElement = RectElement;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function InvertFilter(canvas) {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const buff = document.createElement("canvas");
    buff.width = canvas.width;
    buff.height = canvas.height;
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    buff.getContext("2d").putImageData(imageData, 0, 0);
    return new Promise((resolve, reject) => {
        return resolve(buff);
    });
}
exports.InvertFilter = InvertFilter;
function GrayscaleFilter(canvas) {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const buff = document.createElement("canvas");
    buff.width = canvas.width;
    buff.height = canvas.height;
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
    buff.getContext("2d").putImageData(imageData, 0, 0);
    return new Promise((resolve, reject) => {
        return resolve(buff);
    });
}
exports.GrayscaleFilter = GrayscaleFilter;
function BlurDiffFilter(factor) {
    function boxesForGauss(sigma, n) {
        const wIdeal = Math.sqrt((12 * sigma * sigma / n) + 1);
        let wl = Math.floor(wIdeal);
        if (wl % 2 === 0) {
            wl--;
        }
        const wu = wl + 2;
        const mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
        const m = Math.round(mIdeal);
        const sizes = [];
        for (let i = 0; i < n; i++) {
            sizes.push(i < m ? wl : wu);
        }
        return sizes;
    }
    function gaussBlur_4(scl, tcl, w, h, r) {
        const bxs = boxesForGauss(r, 3);
        boxBlur_4(scl, tcl, w, h, (bxs[0] - 1) / 2);
        boxBlur_4(tcl, scl, w, h, (bxs[1] - 1) / 2);
        boxBlur_4(scl, tcl, w, h, (bxs[2] - 1) / 2);
    }
    function boxBlur_4(scl, tcl, w, h, r) {
        for (let i = 0; i < scl.length; i++) {
            tcl[i] = scl[i];
        }
        boxBlurH_4(tcl, scl, w, h, r);
        boxBlurT_4(scl, tcl, w, h, r);
    }
    function boxBlurH_4(scl, tcl, w, h, r) {
        const iarr = 1 / (r + r + 1);
        for (let i = 0; i < h; i++) {
            let ti = i * w;
            let li = ti;
            let ri = ti + r;
            const fv = scl[ti];
            const lv = scl[ti + w - 1];
            let val = (r + 1) * fv;
            for (let j = 0; j < r; j++) {
                val += scl[ti + j];
            }
            for (let j = 0; j <= r; j++) {
                val += scl[ri++] - fv;
                tcl[ti++] = Math.round(val * iarr);
            }
            for (let j = r + 1; j < w - r; j++) {
                val += scl[ri++] - scl[li++];
                tcl[ti++] = Math.round(val * iarr);
            }
            for (let j = w - r; j < w; j++) {
                val += lv - scl[li++];
                tcl[ti++] = Math.round(val * iarr);
            }
        }
    }
    function boxBlurT_4(scl, tcl, w, h, r) {
        const iarr = 1 / (r + r + 1);
        for (let i = 0; i < w; i++) {
            let ti = i;
            let li = ti;
            let ri = ti + r * w;
            const fv = scl[ti];
            const lv = scl[ti + w * (h - 1)];
            let val = (r + 1) * fv;
            for (let j = 0; j < r; j++) {
                val += scl[ti + j * w];
            }
            for (let j = 0; j <= r; j++) {
                val += scl[ri] - fv;
                tcl[ti] = Math.round(val * iarr);
                ri += w;
                ti += w;
            }
            for (let j = r + 1; j < h - r; j++) {
                val += scl[ri] - scl[li];
                tcl[ti] = Math.round(val * iarr);
                li += w;
                ri += w;
                ti += w;
            }
            for (let j = h - r; j < h; j++) {
                val += lv - scl[li];
                tcl[ti] = Math.round(val * iarr);
                li += w;
                ti += w;
            }
        }
    }
    return (canvas) => {
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;
        const bludData = buff.getContext("2d").createImageData(buff.width, buff.height);
        const idata = imageData.data;
        const bdata = bludData.data;
        const pixelsNumber = canvas.width * canvas.height;
        const dataR = new Uint8ClampedArray(pixelsNumber);
        const dataG = new Uint8ClampedArray(pixelsNumber);
        const dataB = new Uint8ClampedArray(pixelsNumber);
        const dataA = new Uint8ClampedArray(pixelsNumber);
        for (let i = 0; i < pixelsNumber; i++) {
            dataR[i] = idata[4 * i];
            dataG[i] = idata[4 * i + 1];
            dataB[i] = idata[4 * i + 2];
            dataA[i] = idata[4 * i + 3];
        }
        const blurR = new Uint8ClampedArray(pixelsNumber);
        const blurG = new Uint8ClampedArray(pixelsNumber);
        const blurB = new Uint8ClampedArray(pixelsNumber);
        const blurR2 = new Uint8ClampedArray(pixelsNumber);
        const blurG2 = new Uint8ClampedArray(pixelsNumber);
        const blurB2 = new Uint8ClampedArray(pixelsNumber);
        const halfFactor = factor / 2;
        gaussBlur_4(dataR, blurR, buff.width, buff.height, halfFactor);
        gaussBlur_4(dataG, blurG, buff.width, buff.height, halfFactor);
        gaussBlur_4(dataB, blurB, buff.width, buff.height, halfFactor);
        gaussBlur_4(dataR, blurR2, buff.width, buff.height, factor);
        gaussBlur_4(dataG, blurG2, buff.width, buff.height, factor);
        gaussBlur_4(dataB, blurB2, buff.width, buff.height, factor);
        const alphaStep = 127 / factor;
        for (let i = 0; i < pixelsNumber; i++) {
            const dr = Math.abs(blurR2[i] - blurR[i]);
            const dg = Math.abs(blurG2[i] - blurG[i]);
            const db = Math.abs(blurB2[i] - blurB[i]);
            const d = 0.2358 * dr + 0.0700 * dg + 0.6742 * db;
            const g = Math.round(0.2358 * idata[4 * i + 0] + 0.0700 * idata[4 * i + 1] + 0.6742 * idata[4 * i + 2]);
            bdata[4 * i + 0] = (dr >= 0.2358 * halfFactor) ?
                idata[4 * i + 0] : Math.round(g / factor) * factor;
            bdata[4 * i + 1] = (dg >= 0.0700 * halfFactor) ?
                idata[4 * i + 1] : Math.round(g / factor) * factor;
            bdata[4 * i + 2] = (db >= 0.6742 * halfFactor) ?
                idata[4 * i + 2] : Math.round(g / factor) * factor;
            bdata[4 * i + 3] = (d >= factor) ? 255 : 0 + Math.round(d * alphaStep);
        }
        buff.getContext("2d").putImageData(bludData, 0, 0);
        return new Promise((resolve, reject) => {
            return resolve(buff);
        });
    };
}
exports.BlurDiffFilter = BlurDiffFilter;
function BrightnessFilter(brightness) {
    return (canvas) => {
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i + 0] = Math.max(0, Math.min(data[i + 0] + brightness, 255));
            data[i + 1] = Math.max(0, Math.min(data[i + 1] + brightness, 255));
            data[i + 2] = Math.max(0, Math.min(data[i + 2] + brightness, 255));
        }
        buff.getContext("2d").putImageData(imageData, 0, 0);
        return new Promise((resolve, reject) => {
            return resolve(buff);
        });
    };
}
exports.BrightnessFilter = BrightnessFilter;
function ContrastFilter(contrast) {
    return (canvas) => {
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;
        const data = imageData.data;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        for (let i = 0; i < data.length; i += 4) {
            data[i + 0] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
        }
        buff.getContext("2d").putImageData(imageData, 0, 0);
        return new Promise((resolve, reject) => {
            return resolve(buff);
        });
    };
}
exports.ContrastFilter = ContrastFilter;
function SaturationFilter(saturation) {
    return (canvas) => {
        const context = canvas.getContext("2d");
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const buff = document.createElement("canvas");
        buff.width = canvas.width;
        buff.height = canvas.height;
        const s = saturation / 255;
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i + 0];
            const g = data[i + 1];
            const b = data[i + 2];
            const gr = 0.213 * r + 0.715 * g + 0.072 * b;
            const nr = gr + s * (+0.787 * r - 0.715 * g - 0.072 * b);
            const ng = gr + s * (-0.213 * r + 0.285 * g - 0.072 * b);
            const nb = gr + s * (-0.213 * r - 0.715 * g + 0.928 * b);
            data[i] = Math.round(nr);
            data[i + 1] = Math.round(ng);
            data[i + 2] = Math.round(nb);
        }
        buff.getContext("2d").putImageData(imageData, 0, 0);
        return new Promise((resolve, reject) => {
            return resolve(buff);
        });
    };
}
exports.SaturationFilter = SaturationFilter;
class FilterPipeline {
    constructor() {
        this.pipeline = new Array();
    }
    addFilter(filter) {
        this.pipeline.push(filter);
    }
    clearFilters() {
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
exports.FilterPipeline = FilterPipeline;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __webpack_require__(18);
const HSLColor_1 = __webpack_require__(14);
const LABColor_1 = __webpack_require__(8);
class Tag {
    constructor(name, color, id = "") {
        this.tagColorPure = "";
        this.tagColorAccent = "";
        this.tagColorHighlight = "";
        this.tagColorShadow = "";
        this.tagColorNoColor = "";
        this.tagColorDark = "";
        this.tagName = name;
        if (typeof color === "number") {
            this.colorObj = new Color_1.Color(new HSLColor_1.HSLColor((color % 360) / 360.0, 1, 0.5));
        }
        else if (typeof color === "string") {
            this.colorObj = new Color_1.Color(color);
        }
        else if (color instanceof Color_1.Color) {
            this.colorObj = color;
        }
        this.tagID = id;
    }
    static BuildFromJSON(data) {
        if (data.color !== undefined) {
            return new Tag(data.name, new Color_1.Color(data.color), (data.id === undefined) ? "" : data.id);
        }
        else if (data.colorHue !== undefined) {
            return new Tag(data.name, new Color_1.Color(new HSLColor_1.HSLColor((data.colorHue % 360) / 360.0, 1, 0.5)), (data.id === undefined) ? "" : data.id);
        }
    }
    static getHueFromColor(color) {
        const c = new Color_1.Color(color);
        return c.HSL.h * 360;
    }
    get colorHue() {
        return this.colorObj.HSL.h * 360;
    }
    get color() {
        return this.colorObj.sRGB.toHex();
    }
    get name() {
        return this.tagName;
    }
    get id() {
        return this.tagID;
    }
    get colorPure() {
        if (this.tagColorPure === "") {
            this.tagColorPure = this.colorObj.sRGB.toCSSString();
        }
        return this.tagColorPure;
    }
    get colorAccent() {
        if (this.tagColorAccent === "") {
            this.tagColorAccent = this.colorObj.sRGB.toCSSString(0.8);
        }
        return this.tagColorAccent;
    }
    get colorHighlight() {
        if (this.tagColorHighlight === "") {
            const lab = this.colorObj.LAB.toArray();
            const highlight = new LABColor_1.LABColor(lab[0] * 0.7, lab[1] * 0.7, lab[2] * 0.7);
            this.tagColorHighlight = highlight.toSRGB().truncate().toCSSString(0.4);
        }
        return this.tagColorHighlight;
    }
    get colorShadow() {
        if (this.tagColorShadow === "") {
            const lab = this.colorObj.LAB.toArray();
            const shadow = new LABColor_1.LABColor(lab[0] * 0.6, lab[1] * 0.6, lab[2] * 0.6);
            this.tagColorShadow = shadow.toSRGB().truncate().toCSSString(0.2);
        }
        return this.tagColorShadow;
    }
    get colorDark() {
        if (this.tagColorDark === "") {
            const lab = this.colorObj.LAB.toArray();
            const dark = new LABColor_1.LABColor(lab[0] * 0.5, lab[1] * 0.5, lab[2] * 0.5);
            this.tagColorDark = dark.toSRGB().truncate().toCSSString(0.8);
        }
        return this.tagColorDark;
    }
    get colorNoColor() {
        if (this.tagColorNoColor === "") {
            this.tagColorNoColor = `rgba(0, 0, 0, 0.0)`;
        }
        return this.tagColorNoColor;
    }
    copy() {
        return new Tag(this.tagName, this.colorObj, this.tagID);
    }
    toJSON() {
        return {
            name: this.tagName,
            colorHue: this.colorHue,
            color: this.colorObj.sRGB.toHex(),
            id: this.tagID,
        };
    }
}
exports.Tag = Tag;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Toolbar_1 = __webpack_require__(20);
const RegionsManager_1 = __webpack_require__(21);
const PointRegion_1 = __webpack_require__(24);
const RectRegion_1 = __webpack_require__(23);
const AreaSelector_1 = __webpack_require__(25);
const ISelectorSettings_1 = __webpack_require__(16);
const CanvasTools_Filter_1 = __webpack_require__(27);
const Rect_1 = __webpack_require__(1);
const Point2D_1 = __webpack_require__(0);
const RegionData_1 = __webpack_require__(2);
const Tag_1 = __webpack_require__(28);
const TagsDescriptor_1 = __webpack_require__(54);
const CanvasTools_Editor_1 = __webpack_require__(55);
const RGBColor_1 = __webpack_require__(12);
const LABColor_1 = __webpack_require__(8);
const XYZColor_1 = __webpack_require__(13);
const HSLColor_1 = __webpack_require__(14);
const Palette_1 = __webpack_require__(56);
const Color_1 = __webpack_require__(18);
__webpack_require__(57);
class CanvasTools {
}
CanvasTools.Core = {
    Rect: Rect_1.Rect,
    Point2D: Point2D_1.Point2D,
    RegionData: RegionData_1.RegionData,
    TagsDescriptor: TagsDescriptor_1.TagsDescriptor,
    Tag: Tag_1.Tag,
    Colors: {
        RGBColor: RGBColor_1.RGBColor,
        LABColor: LABColor_1.LABColor,
        XYZColor: XYZColor_1.XYZColor,
        HSLColor: HSLColor_1.HSLColor,
        Palette: Palette_1.Palette,
        Color: Color_1.Color,
    },
};
CanvasTools.Selection = {
    AreaSelector: AreaSelector_1.AreaSelector,
    SelectionMode: ISelectorSettings_1.SelectionMode,
};
CanvasTools.Region = {
    RegionsManager: RegionsManager_1.RegionsManager,
    PointRegion: PointRegion_1.PointRegion,
    RectRegion: RectRegion_1.RectRegion,
};
CanvasTools.Filters = {
    InvertFilter: CanvasTools_Filter_1.InvertFilter,
    GrayscaleFilter: CanvasTools_Filter_1.GrayscaleFilter,
    BlurDiffFilter: CanvasTools_Filter_1.BlurDiffFilter,
    ContrastFilter: CanvasTools_Filter_1.ContrastFilter,
    BrightnessFilter: CanvasTools_Filter_1.BrightnessFilter,
    SaturationFilter: CanvasTools_Filter_1.SaturationFilter,
};
CanvasTools.Editor = CanvasTools_Editor_1.Editor;
CanvasTools.Toolbar = Toolbar_1.Toolbar;
exports.CanvasTools = CanvasTools;
__webpack_require__(59);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ToolbarIcon_1 = __webpack_require__(3);
class ToolbarSelectIcon extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, icon, onAction) {
        super(paper, icon);
        this.onAction = onAction;
        this.buildIconUI();
    }
    activate() {
        this.onAction(this.description.action);
        this.select();
    }
    move(x, y) {
        super.move(x, y);
        this.iconBackgrounRect.attr({ x, y });
        if (this.iconImageSVG !== undefined) {
            this.iconImageSVG.attr({ x, y });
        }
    }
    resize(width, height) {
        super.resize(width, height);
        this.iconBackgrounRect.attr({
            height: this.height,
            width: this.width,
        });
        this.iconImageSVG.attr({
            height: this.height,
            width: this.width,
        });
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
                        height: this.height,
                        width: this.width,
                    });
                    this.move(this.x, this.y);
                }
            });
        }
        this.iconImage.addClass("iconImageStyle");
        const title = Snap.parse(`<title>${this.description.tooltip}</title>`);
        this.node.add(this.iconBackgrounRect);
        this.node.add(this.iconImage);
        this.node.append(title);
        this.node.click((e) => {
            this.activate();
        });
    }
}
exports.ToolbarSelectIcon = ToolbarSelectIcon;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ToolbarIcon_1 = __webpack_require__(3);
class ToolbarSeparator extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, width) {
        super(paper, null);
        this.buildIconUI();
        this.resize(width, 1);
    }
    move(x, y) {
        super.move(x, y);
        this.iconSeparator.attr({
            x1: x,
            x2: x + this.width,
            y1: y,
            y2: y,
        });
    }
    resize(width, height) {
        super.resize(width, 1);
        this.iconSeparator.attr({
            width: this.width,
        });
    }
    buildIconUI() {
        this.node = this.paper.g();
        this.node.addClass("iconStyle");
        this.node.addClass("separator");
        this.iconSeparator = this.paper.line(0, 0, this.width, 0);
        this.node.add(this.iconSeparator);
    }
}
exports.ToolbarSeparator = ToolbarSeparator;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ToolbarIcon_1 = __webpack_require__(3);
class ToolbarSwitchIcon extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, icon, onAction) {
        super(paper, icon);
        this.onAction = onAction;
        this.buildIconUI();
    }
    activate() {
        this.onAction(this.description.action);
        this.toggleSelection();
    }
    move(x, y) {
        super.move(x, y);
        this.iconBackgrounRect.attr({ x, y });
        if (this.iconImageSVG !== undefined) {
            this.iconImageSVG.attr({ x, y });
        }
    }
    resize(width, height) {
        super.resize(width, height);
        this.iconBackgrounRect.attr({
            height: this.height,
            width: this.width,
        });
        this.iconImageSVG.attr({
            height: this.height,
            width: this.width,
        });
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
                        height: this.height,
                        width: this.width,
                    });
                    this.move(this.x, this.y);
                }
            });
        }
        this.iconImage.addClass("iconImageStyle");
        const title = Snap.parse(`<title>${this.description.tooltip}</title>`);
        this.node.add(this.iconBackgrounRect);
        this.node.add(this.iconImage);
        this.node.append(title);
        this.node.click((e) => {
            this.activate();
        });
    }
}
exports.ToolbarSwitchIcon = ToolbarSwitchIcon;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ToolbarIcon_1 = __webpack_require__(3);
class ToolbarTriggerIcon extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, icon, onAction) {
        super(paper, icon);
        this.onAction = onAction;
        this.buildIconUI();
    }
    activate() {
        this.onAction(this.description.action);
    }
    move(x, y) {
        super.move(x, y);
        this.iconBackgrounRect.attr({ x, y });
        if (this.iconImageSVG !== undefined) {
            this.iconImageSVG.attr({ x, y });
        }
    }
    resize(width, height) {
        super.resize(width, height);
        this.iconBackgrounRect.attr({
            height: this.height,
            width: this.width,
        });
        this.iconImageSVG.attr({
            height: this.height,
            width: this.width,
        });
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
                        height: this.height,
                        width: this.width,
                    });
                    this.move(this.x, this.y);
                }
            });
        }
        this.iconImage.addClass("iconImageStyle");
        const title = Snap.parse(`<title>${this.description.tooltip}</title>`);
        this.node.add(this.iconBackgrounRect);
        this.node.add(this.iconImage);
        this.node.append(title);
        this.node.click((e) => {
            this.activate();
        });
    }
}
exports.ToolbarTriggerIcon = ToolbarTriggerIcon;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(4);
const AnchorsComponent_1 = __webpack_require__(15);
class AnchorsElement extends AnchorsComponent_1.AnchorsComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
    }
    redraw() {
        super.redraw();
        const [x, y, width, height] = [this.regionData.x, this.regionData.y,
            this.regionData.width, this.regionData.height];
        const [tBone, rBone, bBone, lBone] = this.anchorBones;
        window.requestAnimationFrame(() => {
            tBone.attr({ x, y: y - this.boneThickness / 2, width, height: this.boneThickness });
            rBone.attr({ x: x + width - this.boneThickness / 2, y, width: this.boneThickness, height });
            bBone.attr({ x, y: y + height - this.boneThickness / 2, width, height: this.boneThickness });
            lBone.attr({ x: x - this.boneThickness / 2, y, width: this.boneThickness, height });
        });
    }
    buildAnchors() {
        this.buildBoneAnchors();
        super.buildAnchors();
    }
    buildPointAnchors() {
        this.anchorPointStyles = ["TL", "TR", "BR", "BL"];
        this.regionData.points.forEach((point, index) => {
            const anchor = this.createAnchor(this.paper, point.x, point.y, this.anchorPointStyles[index]);
            this.anchors.push(anchor);
            this.anchorsNode.add(anchor);
            this.subscribeAnchorToEvents(anchor, index + 1);
        });
    }
    buildBoneAnchors() {
        this.anchorBoneStyles = ["T", "R", "B", "L"];
        this.anchorBones = [];
        this.boneThickness = AnchorsComponent_1.AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS;
        const [x, y, w, h] = [this.regionData.x, this.regionData.y, this.regionData.width, this.regionData.height];
        const tBone = this.createAnchorBone(this.paper, x, y, w, 0, "T", this.boneThickness);
        const rBone = this.createAnchorBone(this.paper, x + w, y, 0, h, "R", this.boneThickness);
        const bBone = this.createAnchorBone(this.paper, x, y + h, w, 0, "B", this.boneThickness);
        const lBone = this.createAnchorBone(this.paper, x, y, 0, h, "L", this.boneThickness);
        const bones = [tBone, rBone, bBone, lBone];
        this.anchorBones.push(...bones);
        bones.forEach((bone, index) => {
            this.anchorsNode.add(bone);
            this.subscribeAnchorBoneToEvents(bone, -(index + 1));
        });
    }
    createAnchorBone(paper, x, y, width, height, style, thickness = AnchorsComponent_1.AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS) {
        let bone;
        if (width === 0) {
            bone = paper.rect(x - thickness / 2, y, thickness, height);
        }
        else if (height === 0) {
            bone = paper.rect(x, y - thickness / 2, width, thickness);
        }
        else {
            throw Error("Rect bones that are neither vertical or horizontal are not supported.");
            return null;
        }
        bone.addClass("anchorBoneStyle");
        if (style !== undefined && style !== "") {
            bone.addClass(style);
        }
        return bone;
    }
    updateRegion(p) {
        let x1 = p.x;
        let y1 = p.y;
        let x2;
        let y2;
        let flipX = false;
        let flipY = false;
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
        let newAA = "";
        if (activeAnchor !== "" && activeAnchor.length === 2) {
            newAA += (activeAnchor[0] === "T") ? (flipY ? "B" : "T") : (flipY ? "T" : "B");
            newAA += (activeAnchor[1] === "L") ? (flipX ? "R" : "L") : (flipX ? "L" : "R");
        }
        if (activeAnchor !== "" && activeAnchor.length === 1) {
            if (flipX) {
                newAA = (activeAnchor === "R") ? "L" : "R";
            }
            else if (flipY) {
                newAA = (activeAnchor === "T") ? "B" : "T";
            }
            else {
                newAA = activeAnchor;
            }
        }
        if (activeAnchor !== newAA) {
            this.ghostAnchor.removeClass(activeAnchor);
            if (newAA.length === 2) {
                this.activeAnchorIndex = this.anchorPointStyles.indexOf(newAA) + 1;
            }
            else {
                this.activeAnchorIndex = -(this.anchorBoneStyles.indexOf(newAA) + 1);
            }
            activeAnchor = newAA;
            this.ghostAnchor.addClass(newAA);
        }
        const p1 = new Point2D_1.Point2D(Math.min(x1, x2), Math.min(y1, y2)).boundToRect(this.paperRect);
        const p2 = new Point2D_1.Point2D(Math.max(x1, x2), Math.max(y1, y2)).boundToRect(this.paperRect);
        const rd = this.regionData.copy();
        rd.setPoints([p1, new Point2D_1.Point2D(p2.x, p1.y), p2, new Point2D_1.Point2D(p1.x, p2.y)]);
        this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVING);
    }
    onGhostPointerEnter(e) {
        this.ghostAnchor.addClass(this.getActiveAnchor());
        super.onGhostPointerEnter(e);
    }
    onGhostPointerLeave(e) {
        this.ghostAnchor.removeClass(this.getActiveAnchor());
        super.onGhostPointerLeave(e);
    }
    subscribeAnchorBoneToEvents(bone, index) {
        this.subscribeToEvents([
            {
                event: "pointerenter",
                base: bone.node,
                listener: (e) => {
                    if (!this.isFrozen) {
                        this.activeAnchorIndex = index;
                        const anchorPoint = this.getActiveAnchorPoint(e);
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
    getActiveAnchorPoint(e) {
        if (this.activeAnchorIndex > 0) {
            return this.regionData.points[this.activeAnchorIndex - 1];
        }
        else if (this.activeAnchorIndex < 0) {
            if (e !== undefined) {
                const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
                const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
                return new Point2D_1.Point2D(offsetX, offsetY);
            }
            else {
                const boneBox = this.anchorBones[-this.activeAnchorIndex - 1].getBBox();
                return new Point2D_1.Point2D(boneBox.cx, boneBox.cy);
            }
        }
        else {
            return null;
        }
    }
    getActiveAnchor() {
        if (this.activeAnchorIndex > 0) {
            return this.anchorPointStyles[this.activeAnchorIndex - 1];
        }
        else if (this.activeAnchorIndex < 0) {
            return this.anchorBoneStyles[-this.activeAnchorIndex - 1];
        }
        else {
            return "";
        }
    }
}
exports.AnchorsElement = AnchorsElement;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DragComponent_1 = __webpack_require__(10);
class DragElement extends DragComponent_1.DragComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.dragNode = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.dragNode.addClass("dragRectStyle");
        this.node.add(this.dragNode);
        this.subscribeToDragEvents();
    }
    redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                height: this.height,
                width: this.width,
                x: this.x,
                y: this.y,
            });
        });
    }
}
exports.DragElement = DragElement;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TagsComponent_1 = __webpack_require__(11);
class TagsElement extends TagsComponent_1.TagsComponent {
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);
        this.buildOn(paper, tags);
    }
    redraw(rebuildTags = false) {
        if (this.tags) {
            window.requestAnimationFrame(() => {
                if (this.tags.primary !== undefined && this.tags.primary !== null) {
                    this.primaryTagRect.attr({
                        height: this.height,
                        width: this.width,
                        x: this.x,
                        y: this.y,
                    });
                    if (rebuildTags) {
                        this.primaryTagText.node.innerHTML = (this.tags.primary !== null) ? this.tags.primary.name : "";
                        this.textBox = this.primaryTagText.getBBox();
                    }
                    const showTextLabel = (this.textBox.width + 10 <= this.width)
                        && (this.textBox.height <= this.height);
                    if (showTextLabel) {
                        this.primaryTagTextBG.attr({
                            height: this.textBox.height + 5,
                            width: this.textBox.width + 10,
                            x: this.x + 1,
                            y: this.y + 1,
                        });
                        this.primaryTagText.attr({
                            visibility: "visible",
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                        });
                    }
                    else {
                        this.primaryTagTextBG.attr({
                            height: Math.min(10, this.height),
                            width: Math.min(10, this.width),
                            x: this.x,
                            y: this.y,
                        });
                        this.primaryTagText.attr({
                            visibility: "hidden",
                            x: this.x + 5,
                            y: this.y + this.textBox.height,
                        });
                    }
                }
                else {
                    this.primaryTagRect.attr({
                        height: this.height,
                        width: this.width,
                        x: this.x,
                        y: this.y,
                    });
                    this.primaryTagTextBG.attr({
                        height: 0,
                        width: 0,
                    });
                    this.primaryTagText.attr({
                        visibility: "hidden",
                        x: this.x + 5,
                        y: this.y + this.textBox.height,
                    });
                }
                if (rebuildTags) {
                    this.secondaryTags.forEach((tag) => {
                        tag.remove();
                    });
                    this.secondaryTags = [];
                }
                if (this.tags.secondary && this.tags.secondary.length > 0) {
                    const s = 6;
                    const cx = this.x + 0.5 * this.boundRect.width;
                    const cy = this.y - s - 5;
                    const length = this.tags.secondary.length;
                    for (let i = 0; i < length; i++) {
                        const stag = this.tags.secondary[i];
                        const x = cx + (2 * i - length + 1) * s - s / 2;
                        if (rebuildTags) {
                            const tagel = this.paper.rect(x, cy, s, s);
                            tagel.addClass("secondaryTagStyle");
                            tagel.addClass(`secondaryTag-${stag.name}`);
                            this.secondaryTagsNode.add(tagel);
                            this.secondaryTags.push(tagel);
                        }
                        else {
                            const tagel = this.secondaryTags[i];
                            tagel.attr({
                                x,
                                y: cy,
                            });
                        }
                    }
                }
            });
        }
        else {
            window.requestAnimationFrame(() => {
                this.primaryTagRect.attr({
                    height: this.height,
                    width: this.width,
                    x: this.x,
                    y: this.y,
                });
                this.primaryTagText.node.innerHTML = "";
                this.primaryTagTextBG.attr({
                    height: 0,
                    width: 0,
                });
                this.secondaryTags.forEach((tag) => {
                    tag.remove();
                });
                this.secondaryTags = [];
            });
        }
    }
    initStyleMaps(tags) {
        if (tags !== null) {
            if (tags.primary !== null) {
                this.styleMap = [
                    {
                        rule: `.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: #fff;`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure}`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);`,
                    },
                ];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorNoColor};
                                stroke:${tags.primary.colorAccent};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover  .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: #fff;`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: ${tags.primary.colorNoColor};
                                stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${tags.primary.colorNoColor};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .primaryTagTextStyle`,
                        style: `fill:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                        style: `opacity:0.25;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);`,
                    },
                ];
            }
            else {
                this.styleMap = [];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: var(--default-color-transparent);
                                stroke: var(--default-color-pure);
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagRectStyle`,
                        style: `fill: var(--default-color-transparent);
                                stroke: var(--default-color-pure);`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);`,
                    },
                ];
            }
            if (tags.secondary !== null && tags.secondary !== undefined) {
                tags.secondary.forEach((tag) => {
                    const rule = {
                        rule: `.secondaryTagStyle.secondaryTag-${tag.name}`,
                        style: `fill: ${tag.colorAccent};`,
                    };
                    this.styleMap.push(rule);
                    this.styleLightMap.push(rule);
                });
            }
        }
    }
    rebuildTagLabels() {
        this.redraw(true);
    }
    buildOn(paper, tags) {
        this.primaryTagNode = paper.g();
        this.primaryTagRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.primaryTagRect.addClass("primaryTagRectStyle");
        this.primaryTagText = paper.text(this.x, this.y, "");
        this.primaryTagText.addClass("primaryTagTextStyle");
        this.textBox = this.primaryTagText.getBBox();
        this.primaryTagTextBG = paper.rect(this.x, this.y, 0, 0);
        this.primaryTagTextBG.addClass("primaryTagTextBGStyle");
        this.primaryTagNode.add(this.primaryTagRect);
        this.primaryTagNode.add(this.primaryTagTextBG);
        this.primaryTagNode.add(this.primaryTagText);
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondatyTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
exports.TagsElement = TagsElement;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DragComponent_1 = __webpack_require__(10);
class DragElement extends DragComponent_1.DragComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.dragNode = paper.circle(this.x, this.y, DragElement.DEFAULT_DRAG_RADIUS);
        this.dragNode.addClass("dragPointStyle");
        this.node.add(this.dragNode);
        this.subscribeToDragEvents();
    }
    redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                cx: this.x,
                cy: this.y,
            });
        });
    }
}
DragElement.DEFAULT_DRAG_RADIUS = 6;
exports.DragElement = DragElement;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TagsComponent_1 = __webpack_require__(11);
class TagsElement extends TagsComponent_1.TagsComponent {
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);
        this.buildOn(paper, tags);
    }
    redraw() {
        const size = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
        const cx = this.x;
        const cy = this.y - size - TagsElement.DEFAULT_SECONDARY_TAG_DY;
        window.requestAnimationFrame(() => {
            this.primaryTagNode.attr({
                cx: this.x,
                cy: this.y,
            });
            if (this.secondaryTags && this.secondaryTags.length > 0) {
                const length = this.secondaryTags.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.secondaryTags[i];
                    const x = cx + (2 * i - length + 0.5) * size;
                    stag.attr({
                        x,
                        y: cy,
                    });
                }
            }
        });
    }
    initStyleMaps(tags) {
        if (tags !== null) {
            if (tags.primary !== null) {
                this.styleMap = [
                    {
                        rule: `.${this.styleId} .primaryTagPointStyle`,
                        style: `fill: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                    stroke: #fff;`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                        style: `fill: ${tags.primary.colorAccent};
                                stroke:${tags.primary.colorHighlight};`,
                    },
                ];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagPointStyle`,
                        style: `fill: ${tags.primary.colorNoColor};
                                stroke:${tags.primary.colorAccent};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover  .primaryTagPointStyle`,
                        style: `stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPointStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke:${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                        style: `opacity:0.25;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .dragPointStyle`,
                        style: `opacity:0.25;`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .dragPointStyle`,
                        style: `opacity:0.5;`,
                    },
                ];
            }
            else {
                this.styleMap = [];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagPointStyle`,
                        style: `fill: var(--default-color-transparent);
                                stroke: var(--default-color-pure);
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .dragPointStyle`,
                        style: `opacity:0.25;`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .dragPointStyle`,
                        style: `opacity:0.5;`,
                    },
                ];
            }
            if (tags.secondary !== null && tags.secondary !== undefined) {
                tags.secondary.forEach((tag) => {
                    const rule = {
                        rule: `.secondaryTagStyle.secondaryTag-${tag.name}`,
                        style: `fill: ${tag.colorAccent};`,
                    };
                    this.styleMap.push(rule);
                    this.styleLightMap.push(rule);
                });
            }
        }
    }
    rebuildTagLabels() {
        for (const tag of this.secondaryTags) {
            tag.remove();
        }
        this.secondaryTags = [];
        if (this.tags) {
            if (this.tags.primary !== undefined && this.tags.primary !== null) {
            }
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                const length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.tags.secondary[i];
                    const size = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
                    const x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * size - size / 2;
                    const y = this.y - size - TagsElement.DEFAULT_SECONDARY_TAG_DY;
                    const tagel = this.paper.rect(x, y, size, size);
                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });
                    this.secondaryTagsNode.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
        }
    }
    buildOn(paper, tags) {
        this.primaryTagNode = paper.circle(this.x, this.y, TagsElement.DEFAULT_PRIMARY_TAG_RADIUS);
        this.primaryTagNode.addClass("primaryTagPointStyle");
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondatyTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
TagsElement.DEFAULT_PRIMARY_TAG_RADIUS = 3;
TagsElement.DEFAULT_SECONDARY_TAG_SIZE = 6;
TagsElement.DEFAULT_SECONDARY_TAG_DY = 6;
exports.TagsElement = TagsElement;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = __webpack_require__(1);
const Region_1 = __webpack_require__(9);
const AnchorsElement_1 = __webpack_require__(40);
const DragElement_1 = __webpack_require__(41);
const TagsElement_1 = __webpack_require__(42);
class PolygonRegion extends Region_1.Region {
    constructor(paper, paperRect = null, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions) {
        super(paper, paperRect, regionData, Object.assign({}, callbacks), id, tagsDescriptor, tagsUpdateOptions);
        if (paperRect !== null) {
            this.paperRects = {
                actual: new Rect_1.Rect(paperRect.width - regionData.width, paperRect.height - regionData.height),
                host: paperRect,
            };
        }
        this.buildOn(paper);
        const onChange = this.callbacks.onChange;
        this.callbacks.onChange = (region, regionData, ...args) => {
            this.paperRects.actual.resize(this.paperRects.host.width - regionData.width, this.paperRects.host.height - regionData.height);
            onChange(this, regionData, ...args);
        };
    }
    updateTags(tags, options) {
        super.updateTags(tags, options);
        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }
    resize(width, height) {
        this.paperRects.actual.resize(this.paperRects.host.width - width, this.paperRects.host.height - height);
        super.resize(width, height);
    }
    buildOn(paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);
        this.dragNode = new DragElement_1.DragElement(paper, this.paperRects.actual, this.regionData, this.callbacks);
        this.tagsNode = new TagsElement_1.TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.anchorNode = new AnchorsElement_1.AnchorsElement(paper, this.paperRect, this.regionData, this.callbacks);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.node.add(this.anchorNode.node);
        this.UI.push(this.tagsNode, this.dragNode, this.anchorNode);
    }
}
exports.PolygonRegion = PolygonRegion;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(4);
const AnchorsComponent_1 = __webpack_require__(15);
class AnchorsElement extends AnchorsComponent_1.AnchorsComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.deleteOnPointerUp = false;
        this.addOnPointerUp = false;
        this.anchorsLength = regionData.points.length;
    }
    redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
            const points = this.regionData.points;
            if (this.anchorsLength !== points.length) {
                window.requestAnimationFrame(() => {
                    this.anchors.forEach((anchor) => {
                        anchor.remove();
                    });
                    this.anchors = [];
                    this.buildPointAnchors();
                });
                this.anchorsLength = points.length;
            }
            else {
                window.requestAnimationFrame(() => {
                    this.regionData.points.forEach((p, index) => {
                        this.anchors[index].attr({
                            cx: p.x,
                            cy: p.y,
                        });
                    });
                });
            }
            const pointsData = [];
            this.regionData.points.forEach((p) => {
                pointsData.push(p.x, p.y);
            });
            pointsData.push(this.regionData.points[0].x, this.regionData.points[0].y);
            this.anchorsPolyline.attr({
                points: pointsData.toString(),
            });
        }
    }
    buildAnchors() {
        this.buildPolylineAnchors();
        super.buildAnchors();
    }
    buildPolylineAnchors() {
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        pointsData.push(this.regionData.points[0].x, this.regionData.points[0].y);
        this.anchorsPolyline = this.paper.polyline(pointsData);
        this.anchorsPolyline.addClass("anchorLineStyle");
        this.subscribeLineToEvents(this.anchorsPolyline);
        this.anchorsNode.add(this.anchorsPolyline);
    }
    subscribeLineToEvents(anchor) {
        this.subscribeToEvents([
            {
                base: anchor.node,
                event: "pointermove",
                listener: (e) => {
                    if (e.ctrlKey) {
                        this.activeAnchorIndex = -1;
                        const anchorPoint = this.getActiveAnchorPoint(e);
                        this.dragOrigin = anchorPoint;
                        this.addOnPointerUp = true;
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                cx: anchorPoint.x,
                                cy: anchorPoint.y,
                                display: "block",
                            });
                        });
                    }
                    else {
                        this.addOnPointerUp = false;
                    }
                },
                bypass: false,
            },
        ]);
    }
    updateRegion(p) {
        const rd = this.regionData.copy();
        if (this.activeAnchorIndex > 0 && this.activeAnchorIndex <= this.regionData.points.length) {
            rd.setPoint(p, this.activeAnchorIndex - 1);
        }
        this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVING);
    }
    onGhostPointerEnter(e) {
        if (e.ctrlKey) {
            if (this.addOnPointerUp && this.activeAnchorIndex < 0) {
                this.ghostAnchor.addClass("add");
            }
            else if (this.regionData.points.length > 2) {
                this.ghostAnchor.addClass("delete");
                this.deleteOnPointerUp = true;
                this.addOnPointerUp = false;
            }
        }
        else {
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
            this.deleteOnPointerUp = false;
        }
        super.onGhostPointerEnter(e);
    }
    onGhostPointerMove(e) {
        if (e.ctrlKey && this.activeAnchorIndex !== 0) {
            const p = this.getActiveAnchorPoint(e);
            let dist = Number.MAX_VALUE;
            let index = -1;
            this.regionData.points.forEach((point, i) => {
                const d = p.squareDistanceToPoint(point);
                if (d < dist) {
                    dist = d;
                    index = i;
                }
            });
            const swapToDelete = dist < AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD;
            if (this.addOnPointerUp && this.activeAnchorIndex <= 0 && !swapToDelete) {
                this.ghostAnchor.addClass("add");
                this.activeAnchorIndex = -1;
            }
            else if (this.regionData.points.length > 2 || swapToDelete) {
                this.ghostAnchor.removeClass("add");
                this.ghostAnchor.addClass("delete");
                this.activeAnchorIndex = index + 1;
                this.deleteOnPointerUp = true;
                this.addOnPointerUp = false;
            }
        }
        else {
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
        }
        super.onGhostPointerMove(e);
    }
    onGhostPointerUp(e) {
        const rd = this.regionData.copy();
        if (this.deleteOnPointerUp) {
            if (this.activeAnchorIndex > 0 && this.activeAnchorIndex <= this.regionData.points.length) {
                const points = rd.points;
                points.splice(this.activeAnchorIndex - 1, 1);
                rd.setPoints(points);
            }
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
            this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVEEND);
        }
        else if (this.addOnPointerUp) {
            const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
            const point = new Point2D_1.Point2D(offsetX, offsetY);
            const points = rd.points;
            let index = 0;
            let distance = Number.MAX_VALUE;
            for (let i = 0; i < points.length; i++) {
                let d;
                if (i < points.length - 1) {
                    d = this.dragOrigin.squareDistanceToLine(points[i], points[i + 1]);
                }
                else {
                    d = this.dragOrigin.squareDistanceToLine(points[i], points[0]);
                }
                if (d < distance) {
                    index = i;
                    distance = d;
                }
            }
            points.splice(index + 1, 0, point);
            rd.setPoints(points);
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
            this.ghostAnchor.addClass("delete");
            this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVEEND);
        }
        super.onGhostPointerUp(e);
    }
    getActiveAnchorPoint(e) {
        if (this.activeAnchorIndex > 0) {
            return this.regionData.points[this.activeAnchorIndex - 1];
        }
        else if (this.activeAnchorIndex < 0) {
            const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
            return new Point2D_1.Point2D(offsetX, offsetY);
        }
        else {
            return null;
        }
    }
}
AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD = 5;
exports.AnchorsElement = AnchorsElement;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DragComponent_1 = __webpack_require__(10);
class DragElement extends DragComponent_1.DragComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.dragNode = paper.rect(this.x, this.y, this.width, this.height);
        this.dragNode.addClass("dragRectStyle");
        this.node.add(this.dragNode);
        this.subscribeToDragEvents();
    }
    redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            });
        });
    }
}
exports.DragElement = DragElement;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TagsComponent_1 = __webpack_require__(11);
class TagsElement extends TagsComponent_1.TagsComponent {
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);
        this.buildOn(paper, tags);
    }
    redraw() {
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        const size = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
        const cx = this.x + this.width / 2;
        const cy = this.y - size - 5;
        window.requestAnimationFrame(() => {
            this.primaryTagBoundRect.attr({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            });
            this.primaryTagPolygon.attr({
                points: pointsData.toString(),
            });
            if (this.secondaryTags && this.secondaryTags.length > 0) {
                const length = this.secondaryTags.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.secondaryTags[i];
                    const x = cx + (2 * i - length + 0.5) * size;
                    stag.attr({
                        x,
                        y: cy,
                    });
                }
            }
        });
    }
    initStyleMaps(tags) {
        if (tags !== null) {
            if (tags.primary !== null) {
                this.styleMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure}`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);`,
                    },
                ];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: none;
                                stroke: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorNoColor};
                                stroke: ${tags.primary.colorPure};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorHighlight};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: ${tags.primary.colorNoColor};
                                stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                        style: `opacity:0.25;`,
                    },
                ];
            }
            else {
                this.styleMap = [];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: var(--default-color-transparent);`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagPolygonStyle`,
                        style: `fill: var(--default-color-transparent);`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: none;`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolylineStyle`,
                        style: `stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);`,
                    },
                ];
            }
            if (tags.secondary !== null && tags.secondary !== undefined) {
                tags.secondary.forEach((tag) => {
                    const rule = {
                        rule: `.secondaryTagStyle.secondaryTag-${tag.name}`,
                        style: `fill: ${tag.colorAccent};`,
                    };
                    this.styleMap.push(rule);
                    this.styleLightMap.push(rule);
                });
            }
        }
    }
    rebuildTagLabels() {
        for (const tag of this.secondaryTags) {
            tag.remove();
        }
        this.secondaryTags = [];
        if (this.tags) {
            if (this.tags.primary !== undefined && this.tags.primary !== null) {
            }
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                const length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.tags.secondary[i];
                    const s = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
                    const x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                    const y = this.y - s - 5;
                    const tagel = this.paper.rect(x, y, s, s);
                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });
                    this.secondaryTagsNode.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
        }
    }
    buildOn(paper, tags) {
        this.primaryTagNode = paper.g();
        this.primaryTagBoundRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.primaryTagBoundRect.addClass("primaryTagBoundRectStyle");
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagPolygon = paper.polygon(pointsData);
        this.primaryTagPolygon.addClass("primaryTagPolygonStyle");
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagNode.add(this.primaryTagBoundRect);
        this.primaryTagNode.add(this.primaryTagPolygon);
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondatyTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
TagsElement.DEFAULT_PRIMARY_TAG_RADIUS = 3;
TagsElement.DEFAULT_SECONDARY_TAG_SIZE = 6;
TagsElement.DEFAULT_SECONDARY_TAG_DY = 6;
exports.TagsElement = TagsElement;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = __webpack_require__(1);
const Region_1 = __webpack_require__(9);
const AnchorsElement_1 = __webpack_require__(44);
const DragElement_1 = __webpack_require__(45);
const TagsElement_1 = __webpack_require__(46);
class PolylineRegion extends Region_1.Region {
    constructor(paper, paperRect = null, regionData, callbacks, id, tagsDescriptor, tagsUpdateOptions) {
        super(paper, paperRect, regionData, Object.assign({}, callbacks), id, tagsDescriptor, tagsUpdateOptions);
        if (paperRect !== null) {
            this.paperRects = {
                actual: new Rect_1.Rect(paperRect.width - regionData.width, paperRect.height - regionData.height),
                host: paperRect,
            };
        }
        this.buildOn(paper);
        const onChange = this.callbacks.onChange;
        this.callbacks.onChange = (region, regionData, ...args) => {
            this.paperRects.actual.resize(this.paperRects.host.width - regionData.width, this.paperRects.host.height - regionData.height);
            onChange(this, regionData, ...args);
        };
    }
    updateTags(tags, options) {
        super.updateTags(tags, options);
        this.tagsNode.updateTags(tags, options);
        this.node.select("title").node.innerHTML = (tags !== null) ? tags.toString() : "";
    }
    resize(width, height) {
        this.paperRects.actual.resize(this.paperRects.host.width - width, this.paperRects.host.height - height);
        super.resize(width, height);
    }
    buildOn(paper) {
        this.node = paper.g();
        this.node.addClass("regionStyle");
        this.node.addClass(this.styleID);
        this.dragNode = new DragElement_1.DragElement(paper, this.paperRects.actual, this.regionData, this.callbacks);
        this.tagsNode = new TagsElement_1.TagsElement(paper, this.paperRect, this.regionData, this.tags, this.styleID, this.styleSheet, this.tagsUpdateOptions);
        this.anchorNode = new AnchorsElement_1.AnchorsElement(paper, this.paperRect, this.regionData, this.callbacks);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.node.add(this.anchorNode.node);
        this.UI.push(this.tagsNode, this.dragNode, this.anchorNode);
    }
}
exports.PolylineRegion = PolylineRegion;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(4);
const AnchorsComponent_1 = __webpack_require__(15);
class AnchorsElement extends AnchorsComponent_1.AnchorsComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.deleteOnPointerUp = false;
        this.addOnPointerUp = false;
        this.anchorsLength = regionData.points.length;
    }
    redraw() {
        if (this.regionData.points !== null && this.regionData.points.length > 0) {
            const points = this.regionData.points;
            if (this.anchorsLength !== points.length) {
                window.requestAnimationFrame(() => {
                    this.anchors.forEach((anchor) => {
                        anchor.remove();
                    });
                    this.anchors = [];
                    this.buildPointAnchors();
                });
                this.anchorsLength = points.length;
            }
            else {
                window.requestAnimationFrame(() => {
                    this.regionData.points.forEach((p, index) => {
                        this.anchors[index].attr({
                            cx: p.x,
                            cy: p.y,
                        });
                    });
                });
            }
            const pointsData = [];
            this.regionData.points.forEach((p) => {
                pointsData.push(p.x, p.y);
            });
            this.anchorsPolyline.attr({
                points: pointsData.toString(),
            });
        }
    }
    buildAnchors() {
        this.buildPolylineAnchors();
        super.buildAnchors();
    }
    buildPolylineAnchors() {
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.anchorsPolyline = this.paper.polyline(pointsData);
        this.anchorsPolyline.addClass("anchorLineStyle");
        this.subscribeLineToEvents(this.anchorsPolyline);
        this.anchorsNode.add(this.anchorsPolyline);
    }
    subscribeLineToEvents(anchor) {
        this.subscribeToEvents([
            {
                base: anchor.node,
                event: "pointermove",
                listener: (e) => {
                    if (e.ctrlKey) {
                        this.activeAnchorIndex = -1;
                        const anchorPoint = this.getActiveAnchorPoint(e);
                        this.dragOrigin = anchorPoint;
                        this.addOnPointerUp = true;
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                cx: anchorPoint.x,
                                cy: anchorPoint.y,
                                display: "block",
                            });
                        });
                    }
                    else {
                        this.addOnPointerUp = false;
                    }
                },
                bypass: false,
            },
        ]);
    }
    updateRegion(p) {
        const rd = this.regionData.copy();
        if (this.activeAnchorIndex >= 0 && this.activeAnchorIndex <= this.regionData.points.length) {
            rd.setPoint(p, this.activeAnchorIndex - 1);
        }
        this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVING);
    }
    onGhostPointerEnter(e) {
        if (e.ctrlKey) {
            if (this.addOnPointerUp && this.activeAnchorIndex < 0) {
                this.ghostAnchor.addClass("add");
            }
            else if (this.regionData.points.length > 2) {
                this.ghostAnchor.addClass("delete");
                this.deleteOnPointerUp = true;
                this.addOnPointerUp = false;
            }
        }
        else {
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
            this.deleteOnPointerUp = false;
        }
        super.onGhostPointerEnter(e);
    }
    onGhostPointerMove(e) {
        if (e.ctrlKey && this.activeAnchorIndex !== 0) {
            const p = this.getActiveAnchorPoint(e);
            let dist = Number.MAX_VALUE;
            let index = -1;
            this.regionData.points.forEach((point, i) => {
                const d = p.squareDistanceToPoint(point);
                if (d < dist) {
                    dist = d;
                    index = i;
                }
            });
            const swapToDelete = dist < AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD;
            if (this.addOnPointerUp && this.activeAnchorIndex < 0 && !swapToDelete) {
                this.ghostAnchor.addClass("add");
                this.activeAnchorIndex = -1;
            }
            else if (this.regionData.points.length > 2 || swapToDelete) {
                this.ghostAnchor.removeClass("add");
                this.ghostAnchor.addClass("delete");
                this.activeAnchorIndex = index + 1;
                this.deleteOnPointerUp = true;
                this.addOnPointerUp = false;
            }
        }
        else {
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
        }
        super.onGhostPointerMove(e);
    }
    onGhostPointerUp(e) {
        const rd = this.regionData.copy();
        if (this.deleteOnPointerUp) {
            if (this.activeAnchorIndex > 0 && this.activeAnchorIndex <= this.regionData.points.length) {
                const points = rd.points;
                points.splice(this.activeAnchorIndex - 1, 1);
                rd.setPoints(points);
            }
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
            this.ghostAnchor.removeClass("delete");
            this.ghostAnchor.removeClass("add");
            this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVEEND);
        }
        else if (this.addOnPointerUp) {
            const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
            const point = new Point2D_1.Point2D(offsetX, offsetY);
            const points = rd.points;
            let index = 0;
            let distance = Number.MAX_VALUE;
            for (let i = 0; i < points.length - 1; i++) {
                const d = this.dragOrigin.squareDistanceToLine(points[i], points[i + 1]);
                if (d < distance) {
                    index = i;
                    distance = d;
                }
            }
            points.splice(index + 1, 0, point);
            rd.setPoints(points);
            this.deleteOnPointerUp = false;
            this.addOnPointerUp = false;
            this.ghostAnchor.addClass("delete");
            this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVEEND);
        }
        super.onGhostPointerUp(e);
    }
    getActiveAnchorPoint(e) {
        if (this.activeAnchorIndex > 0) {
            return this.regionData.points[this.activeAnchorIndex - 1];
        }
        else if (this.activeAnchorIndex < 0) {
            const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
            return new Point2D_1.Point2D(offsetX, offsetY);
        }
        else {
            return null;
        }
    }
}
AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD = 5;
exports.AnchorsElement = AnchorsElement;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DragComponent_1 = __webpack_require__(10);
class DragElement extends DragComponent_1.DragComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.dragNode = paper.rect(this.x, this.y, this.width, this.height);
        this.dragNode.addClass("dragRectStyle");
        this.node.add(this.dragNode);
        this.subscribeToDragEvents();
    }
    redraw() {
        window.requestAnimationFrame(() => {
            this.dragNode.attr({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            });
        });
    }
}
exports.DragElement = DragElement;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TagsComponent_1 = __webpack_require__(11);
class TagsElement extends TagsComponent_1.TagsComponent {
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);
        this.buildOn(paper, tags);
    }
    redraw() {
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        const size = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
        const cx = this.x + this.width / 2;
        const cy = this.y - size - 5;
        window.requestAnimationFrame(() => {
            this.primaryTagBoundRect.attr({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            });
            this.primaryTagPolyline.attr({
                points: pointsData.toString(),
            });
            if (this.secondaryTags && this.secondaryTags.length > 0) {
                const length = this.secondaryTags.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.secondaryTags[i];
                    const x = cx + (2 * i - length + 0.5) * size;
                    stag.attr({
                        x,
                        y: cy,
                    });
                }
            }
        });
    }
    initStyleMaps(tags) {
        if (tags !== null) {
            if (tags.primary !== null) {
                this.styleMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorShadow};
                                stroke: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};`,
                    },
                    {
                        rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                        style: `fill: ${tags.primary.colorHighlight};`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolylineStyle`,
                        style: `stroke: ${tags.primary.colorPure};`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure}`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);`,
                    },
                ];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: none;
                                stroke: ${tags.primary.colorAccent};`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolylineStyle`,
                        style: `stroke: ${tags.primary.colorPure};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke:${tags.primary.colorDark};
                                fill: ${tags.primary.colorPure};
                                stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId}:hover .anchorStyle`,
                        style: `stroke:#fff;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);
                                stroke-width: 0px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                        style: `opacity:0.25;`,
                    },
                ];
            }
            else {
                this.styleMap = [];
                this.styleLightMap = [
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: none;
                                stroke: var(--default-color-accent);`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                        style: `fill: none;`,
                    },
                    {
                        rule: `.${this.styleId} .primaryTagPolylineStyle`,
                        style: `stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle`,
                        style: `stroke-width: 1px;`,
                    },
                    {
                        rule: `.regionStyle.${this.styleId} .anchorStyle.ghost`,
                        style: `fill: var(--default-color-ghost);`,
                    },
                ];
            }
            if (tags.secondary !== null && tags.secondary !== undefined) {
                tags.secondary.forEach((tag) => {
                    const rule = {
                        rule: `.secondaryTagStyle.secondaryTag-${tag.name}`,
                        style: `fill: ${tag.colorAccent};`,
                    };
                    this.styleMap.push(rule);
                    this.styleLightMap.push(rule);
                });
            }
        }
    }
    rebuildTagLabels() {
        for (const tag of this.secondaryTags) {
            tag.remove();
        }
        this.secondaryTags = [];
        if (this.tags) {
            if (this.tags.primary !== undefined && this.tags.primary !== null) {
            }
            if (this.tags.secondary && this.tags.secondary.length > 0) {
                const length = this.tags.secondary.length;
                for (let i = 0; i < length; i++) {
                    const stag = this.tags.secondary[i];
                    const s = TagsElement.DEFAULT_SECONDARY_TAG_SIZE;
                    const x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                    const y = this.y - s - 5;
                    const tagel = this.paper.rect(x, y, s, s);
                    window.requestAnimationFrame(() => {
                        tagel.addClass("secondaryTagStyle");
                        tagel.addClass(`secondaryTag-${stag.name}`);
                    });
                    this.secondaryTagsNode.add(tagel);
                    this.secondaryTags.push(tagel);
                }
            }
        }
    }
    buildOn(paper, tags) {
        this.primaryTagNode = paper.g();
        this.primaryTagBoundRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
        this.primaryTagBoundRect.addClass("primaryTagBoundRectStyle");
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagPolyline = paper.polyline(pointsData);
        this.primaryTagPolyline.addClass("primaryTagPolylineStyle");
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagNode.add(this.primaryTagBoundRect);
        this.primaryTagNode.add(this.primaryTagPolyline);
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondatyTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
TagsElement.DEFAULT_PRIMARY_TAG_RADIUS = 3;
TagsElement.DEFAULT_SECONDARY_TAG_SIZE = 6;
TagsElement.DEFAULT_SECONDARY_TAG_DY = 6;
exports.TagsElement = TagsElement;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RegionComponent_1 = __webpack_require__(5);
class MenuElement extends RegionComponent_1.RegionComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.menuItemSize = 20;
        this.mw = this.menuItemSize + 10;
        this.mh = this.menuItemSize + 10;
        this.dh = 20;
        this.dw = 5;
        this.buildUI();
    }
    addAction(action, icon, actor) {
        const item = this.menuGroup.g();
        const itemBack = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemBack.addClass("menuItemBack");
        const itemIcon = this.menuGroup.path(MenuElement.PathCollection.delete.path);
        itemIcon.transform(`scale(0.2) translate(26 26)`);
        itemIcon.addClass("menuIcon");
        itemIcon.addClass("menuIcon-" + icon);
        const itemRect = this.menuGroup.rect(5, 5, this.menuItemSize, this.menuItemSize, 5, 5);
        itemRect.addClass("menuItem");
        item.add(itemBack);
        item.add(itemIcon);
        item.add(itemRect);
        item.click((e) => {
            actor(this.region, action);
        });
        this.menuItemsGroup.add(item);
        this.menuItems.push(item);
    }
    attachTo(region) {
        this.region = region;
        this.regionData.initFrom(region.regionData);
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }
    move(arg1, arg2) {
        super.move(arg1, arg2);
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }
    resize(width, height) {
        super.resize(width, height);
        this.rearrangeMenuPosition();
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                x: this.mx,
                y: this.my,
            });
        });
    }
    redraw() {
    }
    hide() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: "hidden",
            });
        });
    }
    show() {
        window.requestAnimationFrame(() => {
            this.menuGroup.attr({
                visibility: "visible",
            });
        });
    }
    showOnRegion(region) {
        this.attachTo(region);
        this.show();
    }
    buildUI() {
        const menuSVG = this.paper.svg(this.mx, this.my, this.mw, this.mh, this.mx, this.my, this.mw, this.mh);
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
            this.callbacks.onManipulationBegin();
        });
        this.menuGroup.mouseout((e) => {
            this.callbacks.onManipulationEnd();
        });
    }
    rearrangeMenuPosition() {
        if (this.y + this.mh + this.dw > this.paperRect.height) {
            this.my = this.paperRect.height - this.mh - this.dw;
        }
        else {
            this.my = this.y + this.dw;
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
MenuElement.PathCollection = {
    delete: {
        iconSize: 96,
        path: "M 83.4 21.1 L 74.9 12.6 L 48 39.5 L 21.1 12.6 L 12.6 21.1 L 39.5 48 L 12.6 74.9 " +
            "L 21.1 83.4 L 48 56.5 L 74.9 83.4 L 83.4 74.9 L 56.5 48 Z",
    },
};
exports.MenuElement = MenuElement;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const RegionData_1 = __webpack_require__(2);
const CrossElement_1 = __webpack_require__(6);
const Selector_1 = __webpack_require__(7);
class PointSelector extends Selector_1.Selector {
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.buildUIElements();
        this.hide();
    }
    resize(width, height) {
        super.resize(width, height);
        this.crossA.resize(width, height);
    }
    hide() {
        super.hide();
        this.hideAll([this.crossA, this.point]);
    }
    show() {
        super.show();
        this.showAll([this.crossA, this.point]);
    }
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("pointSelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.point = this.paper.circle(0, 0, PointSelector.DEFAULT_POINT_RADIUS);
        this.point.addClass("pointStyle");
        this.node.add(this.crossA.node);
        this.node.add(this.point);
        const listeners = [
            {
                event: "pointerenter",
                base: this.parentNode,
                listener: () => this.show(),
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.parentNode,
                listener: () => this.hide(),
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.parentNode,
                listener: (e) => {
                    this.show();
                    this.movePoint(this.point, this.crossA);
                    if (typeof this.callbacks.onSelectionBegin === "function") {
                        this.callbacks.onSelectionBegin();
                    }
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: this.parentNode,
                listener: (e) => {
                    if (typeof this.callbacks.onSelectionEnd === "function") {
                        this.callbacks.onSelectionEnd(RegionData_1.RegionData.BuildPointRegionData(this.crossA.x, this.crossA.y));
                    }
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.parentNode,
                listener: (e) => {
                    const rect = this.parentNode.getClientRects();
                    const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                    this.moveCross(this.crossA, p);
                    this.movePoint(this.point, this.crossA);
                    e.preventDefault();
                },
                bypass: false,
            },
        ];
        this.subscribeToEvents(listeners);
    }
}
PointSelector.DEFAULT_POINT_RADIUS = 6;
exports.PointSelector = PointSelector;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const RegionData_1 = __webpack_require__(2);
const CrossElement_1 = __webpack_require__(6);
const Selector_1 = __webpack_require__(7);
class PolylineSelector extends Selector_1.Selector {
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.isCapturing = false;
        this.buildUIElements();
        this.reset();
        this.hide();
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
    disable() {
        this.reset();
        super.disable();
    }
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("polylineSelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.nextPoint = this.paper.circle(0, 0, PolylineSelector.DEFAULT_SELECTOR_RADIUS);
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
        const listeners = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "click", listener: this.onClick, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "dblclick", listener: this.onDoubleClick, base: this.parentNode, bypass: false },
            { event: "keyup", listener: this.onKeyUp, base: window, bypass: true },
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
            points: "",
        });
        if (this.isCapturing) {
            this.isCapturing = false;
        }
    }
    addPoint(x, y) {
        this.points.push(new Point2D_1.Point2D(x, y));
        const point = this.paper.circle(x, y, PolylineSelector.DEFAULT_POINT_RADIUS);
        point.addClass("polylinePointStyle");
        this.pointsGroup.add(point);
        let pointsStr = "";
        this.points.forEach((p) => {
            pointsStr += `${p.x},${p.y},`;
        });
        this.polyline.attr({
            points: pointsStr.substr(0, pointsStr.length - 1),
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
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
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
                const p = new Point2D_1.Point2D(this.crossA.x, this.crossA.y);
                this.addPoint(p.x, p.y);
                this.lastPoint = p;
            });
        }
    }
    onPointerMove(e) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
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
            const box = this.polyline.getBBox();
            this.callbacks.onSelectionEnd(new RegionData_1.RegionData(box.x, box.y, box.width, box.height, this.getPolylinePoints(), RegionData_1.RegionDataType.Polyline));
        }
        this.reset();
    }
    getPolylinePoints(close = true, threshold = 5) {
        const points = this.points.map((p) => p.copy());
        if (points.length >= 3 && close) {
            const fp = points[0];
            const lp = points[points.length - 1];
            const distanceSquare = (fp.x - lp.x) * (fp.x - lp.x) + (fp.y - lp.y) * (fp.y - lp.y);
            if (distanceSquare <= threshold * threshold) {
                points[points.length - 1] = fp.copy();
            }
        }
        return points;
    }
    onKeyUp(e) {
        if (e.code === "Escape") {
            this.submitPolyline();
        }
    }
}
PolylineSelector.DEFAULT_POINT_RADIUS = 3;
PolylineSelector.DEFAULT_SELECTOR_RADIUS = 6;
exports.PolylineSelector = PolylineSelector;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const RegionData_1 = __webpack_require__(2);
const CrossElement_1 = __webpack_require__(6);
const Selector_1 = __webpack_require__(7);
class PolygonSelector extends Selector_1.Selector {
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.isCapturing = false;
        this.buildUIElements();
        this.reset();
        this.hide();
    }
    resize(width, height) {
        super.resize(width, height);
        this.crossA.resize(width, height);
    }
    hide() {
        super.hide();
        this.hideAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }
    show() {
        super.show();
        this.showAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }
    disable() {
        super.disable();
        this.reset();
    }
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("polygonSelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.nextPoint = this.paper.circle(0, 0, PolygonSelector.DEFAULT_SELECTOR_RADIUS);
        this.nextPoint.addClass("nextPointStyle");
        this.nextSegment = this.paper.g();
        this.nextL1 = this.paper.line(0, 0, 0, 0);
        this.nextLN = this.paper.line(0, 0, 0, 0);
        this.nextL1.addClass("nextSegmentStyle");
        this.nextLN.addClass("nextSegmentStyle");
        this.nextSegment.add(this.nextL1);
        this.nextSegment.add(this.nextLN);
        this.pointsGroup = this.paper.g();
        this.pointsGroup.addClass("polygonGroupStyle");
        this.polygon = this.paper.polygon([]);
        this.polygon.addClass("polygonStyle");
        this.node.add(this.polygon);
        this.node.add(this.pointsGroup);
        this.node.add(this.crossA.node);
        this.node.add(this.nextSegment);
        this.node.add(this.nextPoint);
        const listeners = [
            {
                event: "pointerenter",
                base: this.parentNode,
                listener: () => this.show(),
                bypass: false,
            },
            {
                event: "pointerleave",
                base: this.parentNode,
                listener: (e) => {
                    if (!this.isCapturing) {
                        this.hide();
                    }
                    else {
                        const rect = this.parentNode.getClientRects();
                        const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.nextPoint, p);
                    }
                },
                bypass: false,
            },
            {
                event: "pointerdown",
                base: this.parentNode,
                listener: (e) => {
                    if (!this.isCapturing) {
                        this.isCapturing = true;
                        if (typeof this.callbacks.onSelectionBegin === "function") {
                            this.callbacks.onSelectionBegin();
                        }
                    }
                },
                bypass: false,
            },
            {
                event: "click",
                base: this.parentNode,
                listener: (e) => {
                    if (e.detail <= 1) {
                        window.requestAnimationFrame(() => {
                            const p = new Point2D_1.Point2D(this.crossA.x, this.crossA.y);
                            this.addPoint(p.x, p.y);
                            this.lastPoint = p;
                        });
                    }
                },
                bypass: false,
            },
            {
                event: "pointermove",
                base: this.parentNode,
                listener: (e) => {
                    window.requestAnimationFrame(() => {
                        const rect = this.parentNode.getClientRects();
                        const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
                        this.moveCross(this.crossA, p);
                        this.movePoint(this.nextPoint, p);
                        if (this.lastPoint != null) {
                            this.moveLine(this.nextLN, this.lastPoint, p);
                            this.moveLine(this.nextL1, this.points[0], p);
                        }
                        else {
                            this.moveLine(this.nextLN, p, p);
                            this.moveLine(this.nextL1, p, p);
                        }
                    });
                    e.preventDefault();
                },
                bypass: false,
            },
            {
                event: "dblclick",
                base: this.parentNode,
                listener: () => this.submitPolygon(),
                bypass: false,
            },
            {
                event: "keyup",
                base: window,
                listener: (e) => {
                    if (e.code === "Escape") {
                        this.submitPolygon();
                    }
                },
                bypass: true,
            },
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
        this.polygon.attr({
            points: "",
        });
        if (this.isCapturing) {
            this.isCapturing = false;
        }
    }
    addPoint(x, y) {
        this.points.push(new Point2D_1.Point2D(x, y));
        const point = this.paper.circle(x, y, PolygonSelector.DEFAULT_POINT_RADIUS);
        point.addClass("polygonPointStyle");
        this.pointsGroup.add(point);
        let pointsStr = "";
        this.points.forEach((p) => {
            pointsStr += `${p.x},${p.y},`;
        });
        this.polygon.attr({
            points: pointsStr.substr(0, pointsStr.length - 1),
        });
    }
    submitPolygon() {
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const box = this.polygon.getBBox();
            this.callbacks.onSelectionEnd(new RegionData_1.RegionData(box.x, box.y, box.width, box.height, this.points.map((p) => p.copy()), RegionData_1.RegionDataType.Polygon));
        }
        this.reset();
    }
}
PolygonSelector.DEFAULT_POINT_RADIUS = 3;
PolygonSelector.DEFAULT_SELECTOR_RADIUS = 6;
exports.PolygonSelector = PolygonSelector;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const RegionData_1 = __webpack_require__(2);
const CrossElement_1 = __webpack_require__(6);
const RectElement_1 = __webpack_require__(26);
const Selector_1 = __webpack_require__(7);
class RectCopySelector extends Selector_1.Selector {
    constructor(parent, paper, boundRect, copyRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.copyRect = copyRect;
        this.buildUIElements();
        this.hide();
    }
    setTemplate(copyRect) {
        this.copyRect = new Rect_1.Rect(copyRect.width, copyRect.height);
        this.copyRectEl.resize(copyRect.width, copyRect.height);
        this.moveCopyRect(this.copyRectEl, this.crossA);
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
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectCopySelector");
        this.crossA = new CrossElement_1.CrossElement(this.paper, this.boundRect);
        this.copyRectEl = new RectElement_1.RectElement(this.paper, this.boundRect, this.copyRect);
        this.copyRectEl.node.addClass("copyRectStyle");
        this.node.add(this.crossA.node);
        this.node.add(this.copyRectEl.node);
        const listeners = [
            { event: "pointerenter", listener: this.onPointerEnter, base: this.parentNode, bypass: false },
            { event: "pointerleave", listener: this.onPointerLeave, base: this.parentNode, bypass: false },
            { event: "pointerdown", listener: this.onPointerDown, base: this.parentNode, bypass: false },
            { event: "pointerup", listener: this.onPointerUp, base: this.parentNode, bypass: false },
            { event: "pointermove", listener: this.onPointerMove, base: this.parentNode, bypass: false },
            { event: "wheel", listener: this.onWheel, base: this.parentNode, bypass: false },
        ];
        this.subscribeToEvents(listeners);
    }
    moveCopyRect(copyRect, p) {
        const x = p.x - copyRect.rect.width / 2;
        const y = p.y - copyRect.rect.height / 2;
        copyRect.move(new Point2D_1.Point2D(x, y));
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
                let p1 = new Point2D_1.Point2D(this.crossA.x - this.copyRect.width / 2, this.crossA.y - this.copyRect.height / 2);
                let p2 = new Point2D_1.Point2D(this.crossA.x + this.copyRect.width / 2, this.crossA.y + this.copyRect.height / 2);
                p1 = p1.boundToRect(this.boundRect);
                p2 = p2.boundToRect(this.boundRect);
                const width = p2.x - p1.x;
                const height = p2.y - p1.y;
                const regionData = RegionData_1.RegionData.BuildRectRegionData(p1.x, p1.y, width, height);
                this.callbacks.onSelectionEnd(regionData);
            }
        });
    }
    onPointerMove(e) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
            this.moveCross(this.crossA, p);
            this.moveCopyRect(this.copyRectEl, this.crossA);
        });
        e.preventDefault();
    }
    onWheel(e) {
        let width = this.copyRect.width;
        let height = this.copyRect.height;
        const k = height / width;
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
}
exports.RectCopySelector = RectCopySelector;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const RegionData_1 = __webpack_require__(2);
const AlternatingCrossElement_1 = __webpack_require__(53);
const RectElement_1 = __webpack_require__(26);
const Selector_1 = __webpack_require__(7);
var SelectionModificator;
(function (SelectionModificator) {
    SelectionModificator[SelectionModificator["RECT"] = 0] = "RECT";
    SelectionModificator[SelectionModificator["SQUARE"] = 1] = "SQUARE";
})(SelectionModificator = exports.SelectionModificator || (exports.SelectionModificator = {}));
class RectSelector extends Selector_1.Selector {
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.capturingState = false;
        this.pointerCaptureId = -1;
        this.isTwoPoints = false;
        this.selectionModificator = SelectionModificator.RECT;
        this.usingKeyboardCursor = false;
        this.buildUIElements();
        this.hide();
    }
    resize(width, height) {
        super.resize(width, height);
        this.resizeAll([this.selectionBox, this.crossA, this.crossB]);
    }
    hide() {
        super.hide();
        this.hideAll([this.crossA, this.crossB, this.selectionBox]);
        if (this.pointerCaptureId >= 0) {
            this.parentNode.releasePointerCapture(this.pointerCaptureId);
            this.pointerCaptureId = -1;
        }
    }
    show() {
        super.show();
        this.crossA.show();
    }
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectSelector");
        this.crossA = new AlternatingCrossElement_1.AlternatingCrossElement(this.paper, this.boundRect);
        this.crossB = new AlternatingCrossElement_1.AlternatingCrossElement(this.paper, this.boundRect);
        this.selectionBox = new RectElement_1.RectElement(this.paper, this.boundRect, new Rect_1.Rect(0, 0));
        this.selectionBox.node.addClass("selectionBoxStyle");
        this.node.add(this.crossA.node);
        this.node.add(this.crossB.node);
        this.node.add(this.selectionBox.node);
        const listeners = [
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
    moveSelectionBox(box, pa, pb) {
        const x = (pa.x < pb.x) ? pa.x : pb.x;
        const y = (pa.y < pb.y) ? pa.y : pb.y;
        const w = Math.abs(pa.x - pb.x);
        const h = Math.abs(pa.y - pb.y);
        box.move(new Point2D_1.Point2D(x, y));
        box.resize(w, h);
    }
    onPointerEnter(e) {
        window.requestAnimationFrame(() => {
            this.crossA.show();
        });
    }
    onPointerLeave(e) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
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
            this.deactivateKeyboardCursor();
            if (!this.isTwoPoints) {
                this.capturingState = true;
                this.pointerCaptureId = e.pointerId;
                this.parentNode.setPointerCapture(this.pointerCaptureId);
                this.moveCross(this.crossB, this.crossA);
                this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
                this.showAll([this.crossA, this.crossB, this.selectionBox]);
                if (typeof this.callbacks.onSelectionBegin === "function") {
                    this.callbacks.onSelectionBegin();
                }
            }
        });
    }
    onPointerUp(e) {
        window.requestAnimationFrame(() => {
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
            if (!this.isTwoPoints) {
                this.capturingState = false;
                if (this.pointerCaptureId >= 0) {
                    this.parentNode.releasePointerCapture(this.pointerCaptureId);
                    this.pointerCaptureId = -1;
                }
                this.hideAll([this.crossB, this.selectionBox]);
                if (typeof this.callbacks.onSelectionEnd === "function") {
                    const x = Math.min(this.crossA.x, this.crossB.x);
                    const y = Math.min(this.crossA.y, this.crossB.y);
                    const w = Math.abs(this.crossA.x - this.crossB.x);
                    const h = Math.abs(this.crossA.y - this.crossB.y);
                    this.callbacks.onSelectionEnd(RegionData_1.RegionData.BuildRectRegionData(x, y, w, h));
                }
            }
            else {
                if (this.capturingState) {
                    this.endTwoPointSelection(p);
                }
                else {
                    this.startTwoPointSelection(p);
                }
            }
        });
    }
    onPointerMove(e) {
        window.requestAnimationFrame(() => {
            this.deactivateKeyboardCursor();
            const rect = this.parentNode.getClientRects();
            const p = new Point2D_1.Point2D(e.clientX - rect[0].left, e.clientY - rect[0].top);
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
        if (e.key === "k" || e.key === "K") {
            if (!this.usingKeyboardCursor) {
                this.activateKeyboardCursor();
            }
            else if (this.usingKeyboardCursor && !this.capturingState) {
                this.startTwoPointSelection(this.curKeyboardCross);
                this.curKeyboardCross = this.crossB;
            }
            else if (this.usingKeyboardCursor && this.capturingState) {
                this.endTwoPointSelection(this.curKeyboardCross);
                this.curKeyboardCross = this.crossA;
            }
        }
        if (!e.ctrlKey && e.shiftKey && this.isKeyboardControlKey(e.key) && this.usingKeyboardCursor) {
            e.preventDefault();
            this.moveKeyboardCursor(e.key);
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
            this.hideAll([this.crossB, this.selectionBox]);
        }
    }
    activateKeyboardCursor() {
        this.usingKeyboardCursor = true;
        this.curKeyboardCross = this.crossA;
        this.isTwoPoints = true;
        this.capturingState = false;
        this.showAll([this.crossA]);
        this.hideAll([this.crossB, this.selectionBox]);
    }
    deactivateKeyboardCursor() {
        this.usingKeyboardCursor = false;
        this.curKeyboardCross = null;
    }
    startTwoPointSelection(curPoint) {
        this.capturingState = true;
        this.moveCross(this.crossB, curPoint);
        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
        this.showAll([this.crossA, this.crossB, this.selectionBox]);
        if (typeof this.callbacks.onSelectionBegin === "function") {
            this.callbacks.onSelectionBegin();
        }
    }
    endTwoPointSelection(curPoint) {
        this.capturingState = false;
        this.hideAll([this.crossB, this.selectionBox]);
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const x = Math.min(this.crossA.x, this.crossB.x);
            const y = Math.min(this.crossA.y, this.crossB.y);
            const w = Math.abs(this.crossA.x - this.crossB.x);
            const h = Math.abs(this.crossA.y - this.crossB.y);
            this.callbacks.onSelectionEnd(RegionData_1.RegionData.BuildRectRegionData(x, y, w, h));
        }
        this.moveCross(this.crossA, curPoint);
        this.moveCross(this.crossB, curPoint);
    }
    isKeyboardControlKey(key) {
        return key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";
    }
    moveKeyboardCursor(key) {
        const nextPos = { x: this.curKeyboardCross.x, y: this.curKeyboardCross.y };
        switch (key) {
            case "ArrowUp":
                nextPos.y -= 20;
                break;
            case "ArrowDown":
                nextPos.y += 20;
                break;
            case "ArrowLeft":
                nextPos.x -= 20;
                break;
            case "ArrowRight":
                nextPos.x += 20;
                break;
            default:
                break;
        }
        this.moveCross(this.curKeyboardCross, nextPos);
        this.moveSelectionBox(this.selectionBox, this.crossA, this.crossB);
    }
}
exports.RectSelector = RectSelector;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CrossElement_1 = __webpack_require__(6);
class AlternatingCrossElement extends CrossElement_1.CrossElement {
    constructor(paper, boundRect) {
        super(paper, boundRect);
        this.buildUIElements();
        this.hide();
    }
    move(p, boundRect, square = false, ref = null) {
        super.move(p, boundRect, square, ref);
        this.vl2.node.setAttribute("x1", this.vl.attr("x1"));
        this.vl2.node.setAttribute("x2", this.vl.attr("x2"));
        this.vl2.node.setAttribute("y2", this.vl.attr("y2"));
        this.hl2.node.setAttribute("y1", this.hl.attr("y1"));
        this.hl2.node.setAttribute("x2", this.hl.attr("x2"));
        this.hl2.node.setAttribute("y2", this.hl.attr("y2"));
    }
    resize(width, height) {
        super.resize(width, height);
    }
    buildUIElements() {
        super.buildUIElements();
        const verticalLine2 = this.paper.line(0, 0, 0, this.boundRect.height);
        const horizontalLine2 = this.paper.line(0, 0, this.boundRect.width, 0);
        this.node.add(verticalLine2);
        this.node.add(horizontalLine2);
        this.vl2 = verticalLine2;
        this.hl2 = horizontalLine2;
        this.vl.addClass("blackDashes");
        this.hl.addClass("blackDashes");
        this.vl2.addClass("whiteDashes");
        this.hl2.addClass("whiteDashes");
    }
}
exports.AlternatingCrossElement = AlternatingCrossElement;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tag_1 = __webpack_require__(28);
class TagsDescriptor {
    static BuildFromJSON(data) {
        let p = null;
        if (data.primary !== null && data.primary !== undefined) {
            p = Tag_1.Tag.BuildFromJSON(data.primary);
        }
        const s = (data.secondary === undefined) ? [] : data.secondary.map((tag) => Tag_1.Tag.BuildFromJSON(tag));
        return new TagsDescriptor(p, s);
    }
    get all() {
        return this.allTags.map((tag) => tag.copy());
    }
    get primary() {
        if (this.primaryTag !== null) {
            return this.primaryTag.copy();
        }
        else {
            return null;
        }
    }
    get secondary() {
        if (this.primaryTag !== null) {
            return this.all.filter((tag) => {
                return (tag.name !== this.primary.name);
            });
        }
        else {
            return this.all;
        }
    }
    constructor(arg1, arg2 = []) {
        if (arg1 === undefined) {
            this.primaryTag = null;
            this.allTags = [];
        }
        else if (arg1 instanceof Tag_1.Tag) {
            if (arg2 instanceof Array) {
                this.allTags = new Array(arg1, ...arg2);
            }
            else {
                this.allTags = [arg1];
            }
            this.primaryTag = arg1;
        }
        else if (arg1 instanceof Array) {
            this.allTags = arg1.map((tag) => tag.copy());
            if (arg1.length > 0) {
                this.primaryTag = arg1[0];
            }
            else {
                this.primaryTag = null;
            }
        }
        else if (arg1 === null) {
            if (arg2 instanceof Array) {
                this.allTags = arg2.map((tag) => tag.copy());
            }
            else {
                this.allTags = [];
            }
            this.primaryTag = null;
        }
    }
    toString() {
        let str = "";
        if (this.primaryTag !== null) {
            str += this.primaryTag.name;
            this.secondary.forEach((tag) => {
                str += ", " + tag.name;
            });
        }
        else {
            this.secondary.forEach((tag) => {
                str += ", " + tag.name;
            });
            str = str.substring(2, str.length);
        }
        return str;
    }
    toJSON() {
        if (this.primaryTag !== null) {
            return {
                primary: this.primaryTag.toJSON(),
                secondary: this.secondary.map((tag) => tag.toJSON()),
            };
        }
        else {
            return {
                primary: null,
                secondary: this.secondary.map((tag) => tag.toJSON()),
            };
        }
    }
}
exports.TagsDescriptor = TagsDescriptor;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTools_Filter_1 = __webpack_require__(27);
const Rect_1 = __webpack_require__(1);
const ISelectorSettings_1 = __webpack_require__(16);
const RegionsManager_1 = __webpack_require__(21);
const ZoomManager_1 = __webpack_require__(22);
const AreaSelector_1 = __webpack_require__(25);
const ToolbarIcon_1 = __webpack_require__(3);
const Toolbar_1 = __webpack_require__(20);
class Editor {
    constructor(container, areaSelector, regionsManager, filterPipeline, isZoomEnabled) {
        this.autoResize = true;
        this.isRMFrozen = false;
        this.contentCanvas = this.createCanvasElement();
        this.editorSVG = this.createSVGElement();
        this.editorContainerDiv = container;
        this.editorContainerDiv.classList.add("CanvasToolsContainer");
        this.editorContainerDiv.tabIndex = 0;
        this.editorDiv = this.createDivElement();
        this.editorDiv.classList.add("CanvasToolsEditor");
        this.editorDiv.append(this.contentCanvas);
        this.editorDiv.append(this.editorSVG);
        this.editorContainerDiv.append(this.editorDiv);
        const rmCallbacks = {
            onChange: null,
            onManipulationBegin: (region) => {
                this.areaSelector.hide();
                if (typeof this.onManipulationBegin === "function") {
                    this.onManipulationBegin(region);
                }
            },
            onManipulationEnd: (region) => {
                this.areaSelector.show();
                if (typeof this.onManipulationEnd === "function") {
                    this.onManipulationEnd(region);
                }
            },
            onRegionSelected: (id, multiselection) => {
                if (typeof this.onRegionSelected === "function") {
                    this.onRegionSelected(id, multiselection);
                }
            },
            onRegionMove: (id, regionData) => {
                if (typeof this.onRegionMove === "function") {
                    this.onRegionMove(id, regionData);
                }
            },
            onRegionMoveBegin: (id, regionData) => {
                if (typeof this.onRegionMoveBegin === "function") {
                    this.onRegionMoveBegin(id, regionData);
                }
            },
            onRegionMoveEnd: (id, regionData) => {
                if (typeof this.onRegionMoveEnd === "function") {
                    this.onRegionMoveEnd(id, regionData);
                }
            },
            onRegionDelete: (id, regionData) => {
                if (typeof this.onRegionDelete === "function") {
                    this.onRegionDelete(id, regionData);
                }
            },
        };
        if (regionsManager !== null && regionsManager !== undefined) {
            this.regionsManager = regionsManager;
            regionsManager.callbacks = rmCallbacks;
        }
        else {
            this.regionsManager = new RegionsManager_1.RegionsManager(this.editorSVG, rmCallbacks);
        }
        const asCallbacks = {
            onSelectionBegin: () => {
                this.isRMFrozen = this.regionsManager.isFrozen;
                this.regionsManager.freeze();
                if (typeof this.onSelectionBegin === "function") {
                    this.onSelectionBegin();
                }
            },
            onSelectionEnd: (regionData) => {
                if (!this.isRMFrozen) {
                    this.regionsManager.unfreeze();
                }
                if (typeof this.onSelectionEnd === "function") {
                    this.onSelectionEnd(regionData);
                }
            },
        };
        if (areaSelector !== null && areaSelector !== undefined) {
            this.areaSelector = areaSelector;
            this.areaSelector.callbacks = asCallbacks;
        }
        else {
            this.areaSelector = new AreaSelector_1.AreaSelector(this.editorSVG, asCallbacks);
        }
        if (filterPipeline !== undefined && filterPipeline !== null) {
            this.filterPipeline = filterPipeline;
        }
        else {
            this.filterPipeline = new CanvasTools_Filter_1.FilterPipeline();
        }
        const initZoomCallbacks = {
            onZoomingOut: () => {
                this.onZoom(ZoomManager_1.ZoomDirection.Out);
            },
            onZoomingIn: () => {
                this.onZoom(ZoomManager_1.ZoomDirection.In);
            }
        };
        this.zoomManager = ZoomManager_1.ZoomManager.getInstance(false, initZoomCallbacks);
        this.zoomManager.deleteInstance();
        this.zoomManager = ZoomManager_1.ZoomManager.getInstance(false, initZoomCallbacks);
        if (isZoomEnabled) {
            this.zoomManager.isZoomEnabled = true;
        }
        this.resize(container.offsetWidth, container.offsetHeight);
        this.mergedAPI = new Proxy(this, {
            get: (target, prop) => {
                let p;
                let t;
                if (prop in target) {
                    t = target;
                    p = t[prop];
                }
                else if (prop in target.regionsManager) {
                    t = target.RM;
                    p = t[prop];
                }
                else if (prop in target.areaSelector) {
                    t = target.AS;
                    p = t[prop];
                }
                else if (prop in target.filterPipeline) {
                    t = target.FP;
                    p = t[prop];
                }
                else if (prop in target.zoomManager) {
                    t = target.FP;
                    p = t[prop];
                }
                else {
                    p = undefined;
                }
                if (typeof p === "function") {
                    return (...args) => {
                        p.apply(t, args);
                    };
                }
                else {
                    return p;
                }
            },
        });
        this.subscribeToEvents();
    }
    get api() {
        return this.mergedAPI;
    }
    addToolbar(container, toolbarSet, iconsPath) {
        const svg = this.createSVGElement();
        container.append(svg);
        this.toolbar = new Toolbar_1.Toolbar(svg);
        if (toolbarSet === null || toolbarSet === undefined) {
            toolbarSet = Editor.FullToolbarSet;
        }
        if (this.zoomManager.isZoomEnabled && toolbarSet === Editor.RectToolbarSet) {
            toolbarSet = toolbarSet.concat(Editor.SeparatorIconGroupToolbar).concat(Editor.ZoomIconGroupToolbar);
        }
        let activeSelector;
        toolbarSet.forEach((item) => {
            if (item.type === ToolbarIcon_1.ToolbarItemType.SEPARATOR) {
                this.toolbar.addSeparator();
            }
            else {
                const toolbarItem = {
                    action: item.action,
                    iconUrl: iconsPath + item.iconFile,
                    tooltip: item.tooltip,
                    key: item.key,
                    width: item.width,
                    height: item.height,
                };
                const actionFn = (action) => {
                    item.actionCallback(action, this.regionsManager, this.areaSelector, this.zoomManager);
                };
                if (item.type === ToolbarIcon_1.ToolbarItemType.SELECTOR) {
                    this.toolbar.addSelector(toolbarItem, actionFn);
                    if (item.activate) {
                        activeSelector = item.action;
                    }
                }
                else if (item.type === ToolbarIcon_1.ToolbarItemType.SWITCH) {
                    this.toolbar.addSwitch(toolbarItem, actionFn);
                    this.toolbar.setSwitch(item.action, item.activate);
                }
                else if (item.type === ToolbarIcon_1.ToolbarItemType.TRIGGER) {
                    this.toolbar.addTrigger(toolbarItem, actionFn);
                }
            }
        });
        this.toolbar.select(activeSelector);
    }
    async addContentSource(source) {
        const buffCnvs = document.createElement("canvas");
        const context = buffCnvs.getContext("2d");
        if (source instanceof HTMLImageElement || source instanceof HTMLCanvasElement) {
            this.sourceWidth = source.width;
            this.sourceHeight = source.height;
        }
        else if (source instanceof HTMLVideoElement) {
            this.sourceWidth = source.videoWidth;
            this.sourceHeight = source.videoHeight;
        }
        buffCnvs.width = this.sourceWidth;
        buffCnvs.height = this.sourceHeight;
        context.drawImage(source, 0, 0, buffCnvs.width, buffCnvs.height);
        return this.filterPipeline.applyToCanvas(buffCnvs).then((bcnvs) => {
            this.contentCanvas.width = bcnvs.width;
            this.contentCanvas.height = bcnvs.height;
            const imgContext = this.contentCanvas.getContext("2d");
            imgContext.drawImage(bcnvs, 0, 0, bcnvs.width, bcnvs.height);
        }).then(() => {
            this.resize(this.editorContainerDiv.offsetWidth, this.editorContainerDiv.offsetHeight);
            this.handleZoomAfterContentUpdate();
        });
    }
    resize(containerWidth, containerHeight) {
        this.frameWidth = containerWidth;
        this.frameHeight = containerHeight;
        const imgRatio = this.contentCanvas.width / this.contentCanvas.height;
        const containerRatio = containerWidth / containerHeight;
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
        this.frameWidth = containerWidth - hpadding * 2;
        this.frameHeight = containerHeight - vpadding * 2;
        this.areaSelector.resize(this.frameWidth, this.frameHeight);
        this.regionsManager.resize(this.frameWidth, this.frameHeight);
    }
    get RM() {
        return this.regionsManager;
    }
    get AS() {
        return this.areaSelector;
    }
    get FP() {
        return this.filterPipeline;
    }
    get ZM() {
        return this.zoomManager;
    }
    scaleRegionToSourceSize(regionData, sourceWidth, sourceHeight) {
        const sw = (sourceWidth !== undefined) ? sourceWidth : this.sourceWidth;
        const sh = (sourceHeight !== undefined) ? sourceHeight : this.sourceHeight;
        const xf = sw / this.frameWidth;
        const yf = sh / this.frameHeight;
        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }
    scaleRegionToFrameSize(regionData, sourceWidth, sourceHeight) {
        const sw = (sourceWidth !== undefined) ? sourceWidth : this.sourceWidth;
        const sh = (sourceHeight !== undefined) ? sourceHeight : this.sourceHeight;
        const xf = this.frameWidth / sw;
        const yf = this.frameHeight / sh;
        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }
    createSVGElement() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.innerHTML = Editor.SVGDefsTemplate;
        svg.ondragstart = () => {
            return false;
        };
        svg.ondragend = () => {
            return false;
        };
        return svg;
    }
    createCanvasElement() {
        const canvas = document.createElement("canvas");
        return canvas;
    }
    createDivElement() {
        const div = document.createElement("div");
        return div;
    }
    onZoom(zoomType) {
        if (!this.zoomManager.isZoomEnabled) {
            throw new Error("Zoom feature is not enabled");
        }
        const zoomData = this.zoomManager.updateZoomScale(zoomType);
        if (zoomData) {
            const scaledFrameWidth = (this.frameWidth / zoomData.previousZoomScale) * zoomData.currentZoomScale;
            const scaledFrameHeight = (this.frameHeight / zoomData.previousZoomScale) * zoomData.currentZoomScale;
            this.frameWidth = scaledFrameWidth;
            this.frameHeight = scaledFrameHeight;
            this.zoomEditorToScale(scaledFrameWidth, scaledFrameHeight);
            this.areaSelector.resize(scaledFrameWidth, scaledFrameHeight);
            this.regionsManager.resize(scaledFrameWidth, scaledFrameHeight);
            const regions = this.regionsManager.getSelectedRegionsWithZoomScale();
            this.areaSelector.updateRectCopyTemplateSelector(this.areaSelector.getRectCopyTemplate(regions));
            if (typeof this.onZoomEnd == "function") {
                this.onZoomEnd(zoomData);
            }
        }
    }
    handleZoomAfterContentUpdate() {
        if (this.zoomManager.isZoomEnabled && !this.zoomManager.resetZoomOnContentLoad) {
            let zoomData = this.zoomManager.getZoomData();
            const scaledFrameWidth = this.frameWidth * zoomData.currentZoomScale;
            const scaledFrameHeight = this.frameHeight * zoomData.currentZoomScale;
            this.frameWidth = scaledFrameWidth;
            this.frameHeight = scaledFrameHeight;
            this.zoomEditorToScale(scaledFrameWidth, scaledFrameHeight);
            this.areaSelector.resize(scaledFrameWidth, scaledFrameHeight);
            this.regionsManager.resize(scaledFrameWidth, scaledFrameHeight);
        }
    }
    zoomEditorToScale(scaledFrameWidth, scaledFrameHeight) {
        if (!this.editorContainerDiv.offsetWidth) {
            this.editorContainerDiv = document.getElementsByClassName("CanvasToolsContainer")[0];
            this.editorDiv = document.getElementsByClassName("CanvasToolsEditor")[0];
        }
        const containerWidth = this.editorContainerDiv.offsetWidth;
        const containerHeight = this.editorContainerDiv.offsetHeight;
        let hpadding = 0;
        let vpadding = 0;
        if (scaledFrameWidth < containerWidth) {
            hpadding = (containerWidth - scaledFrameWidth) / 2;
            this.editorDiv.style.width = `calc(100% - ${hpadding * 2}px)`;
        }
        else {
            this.editorDiv.style.width = `${scaledFrameWidth}px`;
        }
        if (scaledFrameHeight < containerHeight) {
            vpadding = (containerHeight - scaledFrameHeight) / 2;
            this.editorDiv.style.height = `calc(100% - ${vpadding * 2}px)`;
        }
        else {
            this.editorDiv.style.height = `${scaledFrameHeight}px`;
        }
        if (hpadding && !vpadding) {
            hpadding = (this.editorContainerDiv.clientWidth - scaledFrameWidth) / 2;
            this.editorDiv.style.width = `calc(100% - ${hpadding * 2}px)`;
        }
        if (!hpadding && vpadding) {
            vpadding = (this.editorContainerDiv.clientHeight - scaledFrameHeight) / 2;
            this.editorDiv.style.height = `calc(100% - ${vpadding * 2}px)`;
        }
        this.editorDiv.style.padding = `${vpadding}px ${hpadding}px`;
        this.editorContainerDiv.focus();
    }
    subscribeToEvents() {
        window.addEventListener("resize", (e) => {
            if (this.autoResize) {
                this.resize(this.editorContainerDiv.offsetWidth, this.editorContainerDiv.offsetHeight);
            }
        });
    }
}
Editor.FullToolbarSet = [
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "none-select",
        iconFile: "none-selection.svg",
        tooltip: "Regions Manipulation (M)",
        key: ["M", "m"],
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.NONE });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "point-select",
        iconFile: "point-selection.svg",
        tooltip: "Point-selection (P)",
        key: ["P", "p"],
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POINT });
            sl.show();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "rect-select",
        iconFile: "rect-selection.svg",
        tooltip: "Rectangular box (R)",
        key: ["R", "r"],
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.RECT });
            sl.show();
        },
        activate: true,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "copy-select",
        iconFile: "copy-t-selection.svg",
        tooltip: "Template-based box (T)",
        key: ["T", "t"],
        actionCallback: (action, rm, sl) => {
            const regions = rm.getSelectedRegions();
            if (regions !== undefined && regions.length > 0) {
                const r = regions[0];
                sl.setSelectionMode({
                    mode: ISelectorSettings_1.SelectionMode.COPYRECT,
                    template: new Rect_1.Rect(r.regionData.width, r.regionData.height),
                });
            }
            else {
                sl.setSelectionMode({
                    mode: ISelectorSettings_1.SelectionMode.COPYRECT,
                    template: new Rect_1.Rect(40, 40),
                });
            }
            sl.show();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "polyline-select",
        iconFile: "polyline-selection.svg",
        tooltip: "Polyline-selection (Y)",
        key: ["Y", "y"],
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POLYLINE });
            sl.show();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "polygon-select",
        iconFile: "polygon-selection.svg",
        tooltip: "Polygon-selection (O)",
        key: ["O", "o"],
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POLYGON });
            sl.show();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.TRIGGER,
        action: "delete-all-select",
        iconFile: "delete-all-selection.svg",
        tooltip: "Delete all regions",
        key: ["D", "d"],
        actionCallback: (action, rm, sl) => {
            rm.deleteAllRegions();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SWITCH,
        action: "selection-lock",
        iconFile: "selection-lock.svg",
        tooltip: "Lock/unlock regions (L)",
        key: ["L", "l"],
        actionCallback: (action, rm, sl) => {
            rm.toggleFreezeMode();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SWITCH,
        action: "background-toggle",
        iconFile: "background-toggle.svg",
        tooltip: "Toggle Region Background (B)",
        key: ["B", "b"],
        actionCallback: (action, rm, sl) => {
            rm.toggleBackground();
        },
        activate: false,
    },
];
Editor.RectToolbarSet = [
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "none-select",
        iconFile: "none-selection.svg",
        tooltip: "Regions Manipulation (M)",
        key: ["M", "m"],
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.NONE });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "rect-select",
        iconFile: "rect-selection.svg",
        tooltip: "Rectangular box (R)",
        key: ["R", "r"],
        actionCallback: (action, rm, sl) => {
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.RECT });
            sl.show();
        },
        activate: true,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: "copy-select",
        iconFile: "copy-t-selection.svg",
        tooltip: "Template-based box (T)",
        key: ["T", "t"],
        actionCallback: (action, rm, sl) => {
            const regions = rm.getSelectedRegionsWithZoomScale();
            if (regions !== undefined && regions.length > 0) {
                const r = regions[0];
                sl.setSelectionMode({
                    mode: ISelectorSettings_1.SelectionMode.COPYRECT,
                    template: new Rect_1.Rect(r.regionData.width, r.regionData.height),
                });
            }
            else {
                sl.setSelectionMode({
                    mode: ISelectorSettings_1.SelectionMode.COPYRECT,
                    template: new Rect_1.Rect(40, 40),
                });
            }
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.TRIGGER,
        action: "delete-all-select",
        iconFile: "delete-all-selection.svg",
        tooltip: "Delete all regions (D)",
        key: ["D", "d"],
        actionCallback: (action, rm, sl) => {
            rm.deleteAllRegions();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SWITCH,
        action: "selection-lock",
        iconFile: "selection-lock.svg",
        tooltip: "Lock/unlock regions (L)",
        key: ["L", "l"],
        actionCallback: (action, rm, sl) => {
            rm.toggleFreezeMode();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SWITCH,
        action: "background-toggle",
        iconFile: "background-toggle.svg",
        tooltip: "Toggle Region Background (B)",
        key: ["B", "b"],
        actionCallback: (action, rm, sl) => {
            rm.toggleBackground();
        },
        activate: false,
    }
];
Editor.ZoomIconGroupToolbar = [
    {
        type: ToolbarIcon_1.ToolbarItemType.TRIGGER,
        action: "zoom-in",
        iconFile: "zoom-in.svg",
        tooltip: "Zoom in (+)",
        key: ["+"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onZoomingIn();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.TRIGGER,
        action: "zoom-out",
        iconFile: "zoom-out.svg",
        tooltip: "Zoom out (-)",
        key: ["-"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onZoomingOut();
        },
        activate: false,
    }
];
Editor.SeparatorIconGroupToolbar = [
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    }
];
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
exports.Editor = Editor;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const LABColor_1 = __webpack_require__(8);
const Color_1 = __webpack_require__(18);
class Palette {
    constructor(settings) {
        this.settings = {
            lightness: (settings.lightness === undefined) ?
                0.65 : Math.max(0, Math.min(1, settings.lightness)),
            lightnessVariation: (settings.lightnessVariation === undefined) ?
                0 : Math.max(0, Math.min(1, settings.lightnessVariation)),
            minGrayness: (settings.minGrayness === undefined) ?
                0 : Math.max(0, Math.min(1, settings.minGrayness)),
            maxGrayness: (settings.maxGrayness === undefined) ?
                2 : Math.max(0, Math.min(2, settings.maxGrayness)),
            granularity: (settings.granularity === undefined) ?
                50 : Math.max(10, settings.granularity),
            abRange: (settings.abRange === undefined) ?
                1.3 : Math.max(0, Math.min(2, settings.abRange)),
        };
        this.generateClusterPromise = this.generateGamutClusterAsync();
    }
    async gamut() {
        if (this.gamutCluster !== undefined && this.gamutCluster !== null) {
            return new Promise((resolve) => resolve(this.gamutCluster));
        }
        else {
            return this.generateClusterPromise.then((cluster) => {
                this.gamutCluster = cluster;
                return cluster;
            });
        }
    }
    async swatches(colorsCount) {
        return this.gamut().then((cluster) => {
            const swatches = new Array();
            const first = Math.round(Math.random() * cluster.length);
            swatches.push(cluster[first]);
            for (let i = 0; i < colorsCount - 1; i++) {
                swatches.push(this.findNextColor(swatches, cluster));
            }
            return swatches;
        });
    }
    async more(swatches, colorsCount) {
        if (swatches.length > 0) {
            return this.gamut().then((cluster) => {
                const newSwatches = new Array();
                const allSwatches = swatches.map((sw) => sw);
                for (let i = 0; i < colorsCount; i++) {
                    const swatch = this.findNextColor(allSwatches, cluster);
                    allSwatches.push(swatch);
                    newSwatches.push(swatch);
                }
                return newSwatches;
            });
        }
        else {
            return this.swatches(colorsCount);
        }
    }
    swatchIterator() {
        return __asyncGenerator(this, arguments, function* swatchIterator_1() {
            const gamut = yield __await(this.gamut());
            const firstIndex = Math.round(Math.random() * gamut.length);
            const firstColor = gamut[firstIndex];
            yield yield __await(firstColor);
            const swatches = [firstColor];
            let lastColor = firstColor;
            let distance = 1.0;
            while ((distance) > 0) {
                const nextColor = this.findNextColor(swatches, gamut);
                swatches.push(nextColor);
                distance = nextColor.LAB.distanceTo_00(lastColor.LAB);
                lastColor = nextColor;
                if (distance > 0) {
                    yield yield __await(nextColor);
                }
            }
        });
    }
    findNextColor(swatches, cluster) {
        let candidate = cluster[0];
        let maxDistanceSQ = 0;
        cluster.forEach((colorPoint) => {
            const distances = swatches.map((swatchPoint) => {
                return colorPoint.LAB.distanceTo_00(swatchPoint.LAB);
            });
            const minDistanceSQ = Math.min(...distances);
            if (minDistanceSQ > maxDistanceSQ) {
                candidate = colorPoint;
                maxDistanceSQ = minDistanceSQ;
            }
        });
        return candidate;
    }
    generateGamutClusterAsync() {
        const promise = new Promise((resolve) => {
            this.gamutCluster = this.generateGamutCluster();
            resolve(this.gamutCluster);
        });
        return promise;
    }
    generateGamutCluster() {
        let cluster = this.generatePointsCluster(this.settings.granularity);
        cluster = cluster.filter((p) => {
            const d = this.distanceToGray(p);
            return d >= this.settings.minGrayness && d <= this.settings.maxGrayness;
        });
        const colorSpace = new Array();
        cluster.forEach((p) => {
            let lightness = this.settings.lightness;
            if (this.settings.lightnessVariation > 0) {
                lightness += this.settings.lightnessVariation * (Math.random() - 0.5);
                lightness = Math.max(0, Math.min(1, lightness));
            }
            const labcolor = new LABColor_1.LABColor(lightness, p.a, p.b);
            const color = new Color_1.Color(labcolor);
            if (color.sRGB.isValidColor()) {
                colorSpace.push(color);
            }
        });
        return colorSpace;
    }
    distanceToGray(p) {
        return Math.sqrt(p.a * p.a + p.b * p.b);
    }
    generatePointsCluster(granularity) {
        granularity = Math.round(granularity);
        const cluster = new Array(granularity * granularity);
        const range = this.settings.abRange;
        for (let i = 0; i < granularity; i++) {
            for (let j = 0; j < granularity; j++) {
                cluster[i * granularity + j] = {
                    a: range * 2 * i / (granularity - 1) - range,
                    b: range * 2 * j / (granularity - 1) - range,
                };
            }
        }
        return cluster;
    }
}
exports.Palette = Palette;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

window.eve = __webpack_require__(58)

// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var mina = (function (eve) {
    var animations = {},
    requestAnimFrame = window.requestAnimationFrame       ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame    ||
                       window.oRequestAnimationFrame      ||
                       window.msRequestAnimationFrame     ||
                       function (callback) {
                           setTimeout(callback, 16, new Date().getTime());
                           return true;
                       },
    requestID,
    isArray = Array.isArray || function (a) {
        return a instanceof Array ||
            Object.prototype.toString.call(a) == "[object Array]";
    },
    idgen = 0,
    idprefix = "M" + (+new Date).toString(36),
    ID = function () {
        return idprefix + (idgen++).toString(36);
    },
    diff = function (a, b, A, B) {
        if (isArray(a)) {
            res = [];
            for (var i = 0, ii = a.length; i < ii; i++) {
                res[i] = diff(a[i], b, A[i], B);
            }
            return res;
        }
        var dif = (A - a) / (B - b);
        return function (bb) {
            return a + dif * (bb - b);
        };
    },
    timer = Date.now || function () {
        return +new Date;
    },
    sta = function (val) {
        var a = this;
        if (val == null) {
            return a.s;
        }
        var ds = a.s - val;
        a.b += a.dur * ds;
        a.B += a.dur * ds;
        a.s = val;
    },
    speed = function (val) {
        var a = this;
        if (val == null) {
            return a.spd;
        }
        a.spd = val;
    },
    duration = function (val) {
        var a = this;
        if (val == null) {
            return a.dur;
        }
        a.s = a.s * val / a.dur;
        a.dur = val;
    },
    stopit = function () {
        var a = this;
        delete animations[a.id];
        a.update();
        eve("mina.stop." + a.id, a);
    },
    pause = function () {
        var a = this;
        if (a.pdif) {
            return;
        }
        delete animations[a.id];
        a.update();
        a.pdif = a.get() - a.b;
    },
    resume = function () {
        var a = this;
        if (!a.pdif) {
            return;
        }
        a.b = a.get() - a.pdif;
        delete a.pdif;
        animations[a.id] = a;
        frame();
    },
    update = function () {
        var a = this,
            res;
        if (isArray(a.start)) {
            res = [];
            for (var j = 0, jj = a.start.length; j < jj; j++) {
                res[j] = +a.start[j] +
                    (a.end[j] - a.start[j]) * a.easing(a.s);
            }
        } else {
            res = +a.start + (a.end - a.start) * a.easing(a.s);
        }
        a.set(res);
    },
    frame = function (timeStamp) {
        // Manual invokation?
        if (!timeStamp) {
            // Frame loop stopped?
            if (!requestID) {
                // Start frame loop...
                requestID = requestAnimFrame(frame);
            }
            return;
        }
        var len = 0;
        for (var i in animations) if (animations.hasOwnProperty(i)) {
            var a = animations[i],
                b = a.get(),
                res;
            len++;
            a.s = (b - a.b) / (a.dur / a.spd);
            if (a.s >= 1) {
                delete animations[i];
                a.s = 1;
                len--;
                (function (a) {
                    setTimeout(function () {
                        eve("mina.finish." + a.id, a);
                    });
                }(a));
            }
            a.update();
        }
        requestID = len ? requestAnimFrame(frame) : false;
    },
    /*\
     * mina
     [ method ]
     **
     * Generic animation of numbers
     **
     - a (number) start _slave_ number
     - A (number) end _slave_ number
     - b (number) start _master_ number (start time in general case)
     - B (number) end _master_ number (end time in general case)
     - get (function) getter of _master_ number (see @mina.time)
     - set (function) setter of _slave_ number
     - easing (function) #optional easing function, default is @mina.linear
     = (object) animation descriptor
     o {
     o         id (string) animation id,
     o         start (number) start _slave_ number,
     o         end (number) end _slave_ number,
     o         b (number) start _master_ number,
     o         s (number) animation status (0..1),
     o         dur (number) animation duration,
     o         spd (number) animation speed,
     o         get (function) getter of _master_ number (see @mina.time),
     o         set (function) setter of _slave_ number,
     o         easing (function) easing function, default is @mina.linear,
     o         status (function) status getter/setter,
     o         speed (function) speed getter/setter,
     o         duration (function) duration getter/setter,
     o         stop (function) animation stopper
     o         pause (function) pauses the animation
     o         resume (function) resumes the animation
     o         update (function) calles setter with the right value of the animation
     o }
    \*/
    mina = function (a, A, b, B, get, set, easing) {
        var anim = {
            id: ID(),
            start: a,
            end: A,
            b: b,
            s: 0,
            dur: B - b,
            spd: 1,
            get: get,
            set: set,
            easing: easing || mina.linear,
            status: sta,
            speed: speed,
            duration: duration,
            stop: stopit,
            pause: pause,
            resume: resume,
            update: update
        };
        animations[anim.id] = anim;
        var len = 0, i;
        for (i in animations) if (animations.hasOwnProperty(i)) {
            len++;
            if (len == 2) {
                break;
            }
        }
        len == 1 && frame();
        return anim;
    };
    /*\
     * mina.time
     [ method ]
     **
     * Returns the current time. Equivalent to:
     | function () {
     |     return (new Date).getTime();
     | }
    \*/
    mina.time = timer;
    /*\
     * mina.getById
     [ method ]
     **
     * Returns an animation by its id
     - id (string) animation's id
     = (object) See @mina
    \*/
    mina.getById = function (id) {
        return animations[id] || null;
    };

    /*\
     * mina.linear
     [ method ]
     **
     * Default linear easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.linear = function (n) {
        return n;
    };
    /*\
     * mina.easeout
     [ method ]
     **
     * Easeout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easeout = function (n) {
        return Math.pow(n, 1.7);
    };
    /*\
     * mina.easein
     [ method ]
     **
     * Easein easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easein = function (n) {
        return Math.pow(n, .48);
    };
    /*\
     * mina.easeinout
     [ method ]
     **
     * Easeinout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easeinout = function (n) {
        if (n == 1) {
            return 1;
        }
        if (n == 0) {
            return 0;
        }
        var q = .48 - n / 1.04,
            Q = Math.sqrt(.1734 + q * q),
            x = Q - q,
            X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
            y = -Q - q,
            Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
            t = X + Y + .5;
        return (1 - t) * 3 * t * t + t * t * t;
    };
    /*\
     * mina.backin
     [ method ]
     **
     * Backin easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.backin = function (n) {
        if (n == 1) {
            return 1;
        }
        var s = 1.70158;
        return n * n * ((s + 1) * n - s);
    };
    /*\
     * mina.backout
     [ method ]
     **
     * Backout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.backout = function (n) {
        if (n == 0) {
            return 0;
        }
        n = n - 1;
        var s = 1.70158;
        return n * n * ((s + 1) * n + s) + 1;
    };
    /*\
     * mina.elastic
     [ method ]
     **
     * Elastic easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.elastic = function (n) {
        if (n == !!n) {
            return n;
        }
        return Math.pow(2, -10 * n) * Math.sin((n - .075) *
            (2 * Math.PI) / .3) + 1;
    };
    /*\
     * mina.bounce
     [ method ]
     **
     * Bounce easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.bounce = function (n) {
        var s = 7.5625,
            p = 2.75,
            l;
        if (n < 1 / p) {
            l = s * n * n;
        } else {
            if (n < 2 / p) {
                n -= 1.5 / p;
                l = s * n * n + .75;
            } else {
                if (n < 2.5 / p) {
                    n -= 2.25 / p;
                    l = s * n * n + .9375;
                } else {
                    n -= 2.625 / p;
                    l = s * n * n + .984375;
                }
            }
        }
        return l;
    };
    window.mina = mina;
    return mina;
})(typeof eve == "undefined" ? function () {} : eve);

// Copyright (c) 2013 - 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var Snap = (function(root) {
Snap.version = "0.5.1";
/*\
 * Snap
 [ method ]
 **
 * Creates a drawing surface or wraps existing SVG element.
 **
 - width (number|string) width of surface
 - height (number|string) height of surface
 * or
 - DOM (SVGElement) element to be wrapped into Snap structure
 * or
 - array (array) array of elements (will return set of elements)
 * or
 - query (string) CSS query selector
 = (object) @Element
\*/
function Snap(w, h) {
    if (w) {
        if (w.nodeType) {
            return wrap(w);
        }
        if (is(w, "array") && Snap.set) {
            return Snap.set.apply(Snap, w);
        }
        if (w instanceof Element) {
            return w;
        }
        if (h == null) {
            try {
                w = glob.doc.querySelector(String(w));
                return wrap(w);
            } catch (e) {
                return null;
            }
        }
    }
    w = w == null ? "100%" : w;
    h = h == null ? "100%" : h;
    return new Paper(w, h);
}
Snap.toString = function () {
    return "Snap v" + this.version;
};
Snap._ = {};
var glob = {
    win: root.window,
    doc: root.window.document
};
Snap._.glob = glob;
var has = "hasOwnProperty",
    Str = String,
    toFloat = parseFloat,
    toInt = parseInt,
    math = Math,
    mmax = math.max,
    mmin = math.min,
    abs = math.abs,
    pow = math.pow,
    PI = math.PI,
    round = math.round,
    E = "",
    S = " ",
    objectToString = Object.prototype.toString,
    ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
    colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
    bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
    separator = Snap._.separator = /[,\s]+/,
    whitespace = /[\s]/g,
    commaSpaces = /[\s]*,[\s]*/,
    hsrg = {hs: 1, rg: 1},
    pathCommand = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
    tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
    pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\s]*,?[\s]*/ig,
    idgen = 0,
    idprefix = "S" + (+new Date).toString(36),
    ID = function (el) {
        return (el && el.type ? el.type : E) + idprefix + (idgen++).toString(36);
    },
    xlink = "http://www.w3.org/1999/xlink",
    xmlns = "http://www.w3.org/2000/svg",
    hub = {},
    /*\
     * Snap.url
     [ method ]
     **
     * Wraps path into `"url('<path>')"`.
     - value (string) path
     = (string) wrapped path
    \*/
    URL = Snap.url = function (url) {
        return "url('#" + url + "')";
    };

function $(el, attr) {
    if (attr) {
        if (el == "#text") {
            el = glob.doc.createTextNode(attr.text || attr["#text"] || "");
        }
        if (el == "#comment") {
            el = glob.doc.createComment(attr.text || attr["#text"] || "");
        }
        if (typeof el == "string") {
            el = $(el);
        }
        if (typeof attr == "string") {
            if (el.nodeType == 1) {
                if (attr.substring(0, 6) == "xlink:") {
                    return el.getAttributeNS(xlink, attr.substring(6));
                }
                if (attr.substring(0, 4) == "xml:") {
                    return el.getAttributeNS(xmlns, attr.substring(4));
                }
                return el.getAttribute(attr);
            } else if (attr == "text") {
                return el.nodeValue;
            } else {
                return null;
            }
        }
        if (el.nodeType == 1) {
            for (var key in attr) if (attr[has](key)) {
                var val = Str(attr[key]);
                if (val) {
                    if (key.substring(0, 6) == "xlink:") {
                        el.setAttributeNS(xlink, key.substring(6), val);
                    } else if (key.substring(0, 4) == "xml:") {
                        el.setAttributeNS(xmlns, key.substring(4), val);
                    } else {
                        el.setAttribute(key, val);
                    }
                } else {
                    el.removeAttribute(key);
                }
            }
        } else if ("text" in attr) {
            el.nodeValue = attr.text;
        }
    } else {
        el = glob.doc.createElementNS(xmlns, el);
    }
    return el;
}
Snap._.$ = $;
Snap._.id = ID;
function getAttrs(el) {
    var attrs = el.attributes,
        name,
        out = {};
    for (var i = 0; i < attrs.length; i++) {
        if (attrs[i].namespaceURI == xlink) {
            name = "xlink:";
        } else {
            name = "";
        }
        name += attrs[i].name;
        out[name] = attrs[i].textContent;
    }
    return out;
}
function is(o, type) {
    type = Str.prototype.toLowerCase.call(type);
    if (type == "finite") {
        return isFinite(o);
    }
    if (type == "array" &&
        (o instanceof Array || Array.isArray && Array.isArray(o))) {
        return true;
    }
    return  type == "null" && o === null ||
            type == typeof o && o !== null ||
            type == "object" && o === Object(o) ||
            objectToString.call(o).slice(8, -1).toLowerCase() == type;
}
/*\
 * Snap.format
 [ method ]
 **
 * Replaces construction of type `{<name>}` to the corresponding argument
 **
 - token (string) string to format
 - json (object) object which properties are used as a replacement
 = (string) formatted string
 > Usage
 | // this draws a rectangular shape equivalent to "M10,20h40v50h-40z"
 | paper.path(Snap.format("M{x},{y}h{dim.width}v{dim.height}h{dim['negative width']}z", {
 |     x: 10,
 |     y: 20,
 |     dim: {
 |         width: 40,
 |         height: 50,
 |         "negative width": -40
 |     }
 | }));
\*/
Snap.format = (function () {
    var tokenRegex = /\{([^\}]+)\}/g,
        objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
        replacer = function (all, key, obj) {
            var res = obj;
            key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                name = name || quotedName;
                if (res) {
                    if (name in res) {
                        res = res[name];
                    }
                    typeof res == "function" && isFunc && (res = res());
                }
            });
            res = (res == null || res == obj ? all : res) + "";
            return res;
        };
    return function (str, obj) {
        return Str(str).replace(tokenRegex, function (all, key) {
            return replacer(all, key, obj);
        });
    };
})();
function clone(obj) {
    if (typeof obj == "function" || Object(obj) !== obj) {
        return obj;
    }
    var res = new obj.constructor;
    for (var key in obj) if (obj[has](key)) {
        res[key] = clone(obj[key]);
    }
    return res;
}
Snap._.clone = clone;
function repush(array, item) {
    for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) {
        return array.push(array.splice(i, 1)[0]);
    }
}
function cacher(f, scope, postprocessor) {
    function newf() {
        var arg = Array.prototype.slice.call(arguments, 0),
            args = arg.join("\u2400"),
            cache = newf.cache = newf.cache || {},
            count = newf.count = newf.count || [];
        if (cache[has](args)) {
            repush(count, args);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        count.length >= 1e3 && delete cache[count.shift()];
        count.push(args);
        cache[args] = f.apply(scope, arg);
        return postprocessor ? postprocessor(cache[args]) : cache[args];
    }
    return newf;
}
Snap._.cacher = cacher;
function angle(x1, y1, x2, y2, x3, y3) {
    if (x3 == null) {
        var x = x1 - x2,
            y = y1 - y2;
        if (!x && !y) {
            return 0;
        }
        return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
    } else {
        return angle(x1, y1, x3, y3) - angle(x2, y2, x3, y3);
    }
}
function rad(deg) {
    return deg % 360 * PI / 180;
}
function deg(rad) {
    return rad * 180 / PI % 360;
}
function x_y() {
    return this.x + S + this.y;
}
function x_y_w_h() {
    return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
}

/*\
 * Snap.rad
 [ method ]
 **
 * Transform angle to radians
 - deg (number) angle in degrees
 = (number) angle in radians
\*/
Snap.rad = rad;
/*\
 * Snap.deg
 [ method ]
 **
 * Transform angle to degrees
 - rad (number) angle in radians
 = (number) angle in degrees
\*/
Snap.deg = deg;
/*\
 * Snap.sin
 [ method ]
 **
 * Equivalent to `Math.sin()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) sin
\*/
Snap.sin = function (angle) {
    return math.sin(Snap.rad(angle));
};
/*\
 * Snap.tan
 [ method ]
 **
 * Equivalent to `Math.tan()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) tan
\*/
Snap.tan = function (angle) {
    return math.tan(Snap.rad(angle));
};
/*\
 * Snap.cos
 [ method ]
 **
 * Equivalent to `Math.cos()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) cos
\*/
Snap.cos = function (angle) {
    return math.cos(Snap.rad(angle));
};
/*\
 * Snap.asin
 [ method ]
 **
 * Equivalent to `Math.asin()` only works with degrees, not radians.
 - num (number) value
 = (number) asin in degrees
\*/
Snap.asin = function (num) {
    return Snap.deg(math.asin(num));
};
/*\
 * Snap.acos
 [ method ]
 **
 * Equivalent to `Math.acos()` only works with degrees, not radians.
 - num (number) value
 = (number) acos in degrees
\*/
Snap.acos = function (num) {
    return Snap.deg(math.acos(num));
};
/*\
 * Snap.atan
 [ method ]
 **
 * Equivalent to `Math.atan()` only works with degrees, not radians.
 - num (number) value
 = (number) atan in degrees
\*/
Snap.atan = function (num) {
    return Snap.deg(math.atan(num));
};
/*\
 * Snap.atan2
 [ method ]
 **
 * Equivalent to `Math.atan2()` only works with degrees, not radians.
 - num (number) value
 = (number) atan2 in degrees
\*/
Snap.atan2 = function (num) {
    return Snap.deg(math.atan2(num));
};
/*\
 * Snap.angle
 [ method ]
 **
 * Returns an angle between two or three points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 - x3 (number) #optional x coord of third point
 - y3 (number) #optional y coord of third point
 = (number) angle in degrees
\*/
Snap.angle = angle;
/*\
 * Snap.len
 [ method ]
 **
 * Returns distance between two points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 = (number) distance
\*/
Snap.len = function (x1, y1, x2, y2) {
    return Math.sqrt(Snap.len2(x1, y1, x2, y2));
};
/*\
 * Snap.len2
 [ method ]
 **
 * Returns squared distance between two points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 = (number) distance
\*/
Snap.len2 = function (x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
};
/*\
 * Snap.closestPoint
 [ method ]
 **
 * Returns closest point to a given one on a given path.
 - path (Element) path element
 - x (number) x coord of a point
 - y (number) y coord of a point
 = (object) in format
 {
    x (number) x coord of the point on the path
    y (number) y coord of the point on the path
    length (number) length of the path to the point
    distance (number) distance from the given point to the path
 }
\*/
// Copied from http://bl.ocks.org/mbostock/8027637
Snap.closestPoint = function (path, x, y) {
    function distance2(p) {
        var dx = p.x - x,
            dy = p.y - y;
        return dx * dx + dy * dy;
    }
    var pathNode = path.node,
        pathLength = pathNode.getTotalLength(),
        precision = pathLength / pathNode.pathSegList.numberOfItems * .125,
        best,
        bestLength,
        bestDistance = Infinity;

    // linear scan for coarse approximation
    for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
        if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
            best = scan;
            bestLength = scanLength;
            bestDistance = scanDistance;
        }
    }

    // binary search for precise estimate
    precision *= .5;
    while (precision > .5) {
        var before,
            after,
            beforeLength,
            afterLength,
            beforeDistance,
            afterDistance;
        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
            best = before;
            bestLength = beforeLength;
            bestDistance = beforeDistance;
        } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
            best = after;
            bestLength = afterLength;
            bestDistance = afterDistance;
        } else {
            precision *= .5;
        }
    }

    best = {
        x: best.x,
        y: best.y,
        length: bestLength,
        distance: Math.sqrt(bestDistance)
    };
    return best;
}
/*\
 * Snap.is
 [ method ]
 **
 * Handy replacement for the `typeof` operator
 - o (…) any object or primitive
 - type (string) name of the type, e.g., `string`, `function`, `number`, etc.
 = (boolean) `true` if given value is of given type
\*/
Snap.is = is;
/*\
 * Snap.snapTo
 [ method ]
 **
 * Snaps given value to given grid
 - values (array|number) given array of values or step of the grid
 - value (number) value to adjust
 - tolerance (number) #optional maximum distance to the target value that would trigger the snap. Default is `10`.
 = (number) adjusted value
\*/
Snap.snapTo = function (values, value, tolerance) {
    tolerance = is(tolerance, "finite") ? tolerance : 10;
    if (is(values, "array")) {
        var i = values.length;
        while (i--) if (abs(values[i] - value) <= tolerance) {
            return values[i];
        }
    } else {
        values = +values;
        var rem = value % values;
        if (rem < tolerance) {
            return value - rem;
        }
        if (rem > values - tolerance) {
            return value - rem + values;
        }
    }
    return value;
};
// Colour
/*\
 * Snap.getRGB
 [ method ]
 **
 * Parses color string as RGB object
 - color (string) color string in one of the following formats:
 # <ul>
 #     <li>Color name (<code>red</code>, <code>green</code>, <code>cornflowerblue</code>, etc)</li>
 #     <li>#••• — shortened HTML color: (<code>#000</code>, <code>#fc0</code>, etc.)</li>
 #     <li>#•••••• — full length HTML color: (<code>#000000</code>, <code>#bd2300</code>)</li>
 #     <li>rgb(•••, •••, •••) — red, green and blue channels values: (<code>rgb(200,&nbsp;100,&nbsp;0)</code>)</li>
 #     <li>rgba(•••, •••, •••, •••) — also with opacity</li>
 #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>)</li>
 #     <li>rgba(•••%, •••%, •••%, •••%) — also with opacity</li>
 #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>)</li>
 #     <li>hsba(•••, •••, •••, •••) — also with opacity</li>
 #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
 #     <li>hsba(•••%, •••%, •••%, •••%) — also with opacity</li>
 #     <li>hsl(•••, •••, •••) — hue, saturation and luminosity values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;0.5)</code>)</li>
 #     <li>hsla(•••, •••, •••, •••) — also with opacity</li>
 #     <li>hsl(•••%, •••%, •••%) — same as above, but in %</li>
 #     <li>hsla(•••%, •••%, •••%, •••%) — also with opacity</li>
 # </ul>
 * Note that `%` can be used any time: `rgb(20%, 255, 50%)`.
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••,
 o     error (boolean) true if string can't be parsed
 o }
\*/
Snap.getRGB = cacher(function (colour) {
    if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
    }
    if (colour == "none") {
        return {r: -1, g: -1, b: -1, hex: "none", toString: rgbtoString};
    }
    !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
    if (!colour) {
        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
    }
    var res,
        red,
        green,
        blue,
        opacity,
        t,
        values,
        rgb = colour.match(colourRegExp);
    if (rgb) {
        if (rgb[2]) {
            blue = toInt(rgb[2].substring(5), 16);
            green = toInt(rgb[2].substring(3, 5), 16);
            red = toInt(rgb[2].substring(1, 3), 16);
        }
        if (rgb[3]) {
            blue = toInt((t = rgb[3].charAt(3)) + t, 16);
            green = toInt((t = rgb[3].charAt(2)) + t, 16);
            red = toInt((t = rgb[3].charAt(1)) + t, 16);
        }
        if (rgb[4]) {
            values = rgb[4].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red *= 2.55);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green *= 2.55);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue *= 2.55);
            rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
        }
        if (rgb[5]) {
            values = rgb[5].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red /= 100);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green /= 100);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue /= 100);
            (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
            rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            return Snap.hsb2rgb(red, green, blue, opacity);
        }
        if (rgb[6]) {
            values = rgb[6].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red /= 100);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green /= 100);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue /= 100);
            (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
            rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            return Snap.hsl2rgb(red, green, blue, opacity);
        }
        red = mmin(math.round(red), 255);
        green = mmin(math.round(green), 255);
        blue = mmin(math.round(blue), 255);
        opacity = mmin(mmax(opacity, 0), 1);
        rgb = {r: red, g: green, b: blue, toString: rgbtoString};
        rgb.hex = "#" + (16777216 | blue | green << 8 | red << 16).toString(16).slice(1);
        rgb.opacity = is(opacity, "finite") ? opacity : 1;
        return rgb;
    }
    return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
}, Snap);
/*\
 * Snap.hsb
 [ method ]
 **
 * Converts HSB values to a hex representation of the color
 - h (number) hue
 - s (number) saturation
 - b (number) value or brightness
 = (string) hex representation of the color
\*/
Snap.hsb = cacher(function (h, s, b) {
    return Snap.hsb2rgb(h, s, b).hex;
});
/*\
 * Snap.hsl
 [ method ]
 **
 * Converts HSL values to a hex representation of the color
 - h (number) hue
 - s (number) saturation
 - l (number) luminosity
 = (string) hex representation of the color
\*/
Snap.hsl = cacher(function (h, s, l) {
    return Snap.hsl2rgb(h, s, l).hex;
});
/*\
 * Snap.rgb
 [ method ]
 **
 * Converts RGB values to a hex representation of the color
 - r (number) red
 - g (number) green
 - b (number) blue
 = (string) hex representation of the color
\*/
Snap.rgb = cacher(function (r, g, b, o) {
    if (is(o, "finite")) {
        var round = math.round;
        return "rgba(" + [round(r), round(g), round(b), +o.toFixed(2)] + ")";
    }
    return "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1);
});
var toHex = function (color) {
    var i = glob.doc.getElementsByTagName("head")[0] || glob.doc.getElementsByTagName("svg")[0],
        red = "rgb(255, 0, 0)";
    toHex = cacher(function (color) {
        if (color.toLowerCase() == "red") {
            return red;
        }
        i.style.color = red;
        i.style.color = color;
        var out = glob.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
        return out == red ? null : out;
    });
    return toHex(color);
},
hsbtoString = function () {
    return "hsb(" + [this.h, this.s, this.b] + ")";
},
hsltoString = function () {
    return "hsl(" + [this.h, this.s, this.l] + ")";
},
rgbtoString = function () {
    return this.opacity == 1 || this.opacity == null ?
            this.hex :
            "rgba(" + [this.r, this.g, this.b, this.opacity] + ")";
},
prepareRGB = function (r, g, b) {
    if (g == null && is(r, "object") && "r" in r && "g" in r && "b" in r) {
        b = r.b;
        g = r.g;
        r = r.r;
    }
    if (g == null && is(r, string)) {
        var clr = Snap.getRGB(r);
        r = clr.r;
        g = clr.g;
        b = clr.b;
    }
    if (r > 1 || g > 1 || b > 1) {
        r /= 255;
        g /= 255;
        b /= 255;
    }

    return [r, g, b];
},
packageRGB = function (r, g, b, o) {
    r = math.round(r * 255);
    g = math.round(g * 255);
    b = math.round(b * 255);
    var rgb = {
        r: r,
        g: g,
        b: b,
        opacity: is(o, "finite") ? o : 1,
        hex: Snap.rgb(r, g, b),
        toString: rgbtoString
    };
    is(o, "finite") && (rgb.opacity = o);
    return rgb;
};
/*\
 * Snap.color
 [ method ]
 **
 * Parses the color string and returns an object featuring the color's component values
 - clr (string) color string in one of the supported formats (see @Snap.getRGB)
 = (object) Combined RGB/HSB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••,
 o     error (boolean) `true` if string can't be parsed,
 o     h (number) hue,
 o     s (number) saturation,
 o     v (number) value (brightness),
 o     l (number) lightness
 o }
\*/
Snap.color = function (clr) {
    var rgb;
    if (is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
        rgb = Snap.hsb2rgb(clr);
        clr.r = rgb.r;
        clr.g = rgb.g;
        clr.b = rgb.b;
        clr.opacity = 1;
        clr.hex = rgb.hex;
    } else if (is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
        rgb = Snap.hsl2rgb(clr);
        clr.r = rgb.r;
        clr.g = rgb.g;
        clr.b = rgb.b;
        clr.opacity = 1;
        clr.hex = rgb.hex;
    } else {
        if (is(clr, "string")) {
            clr = Snap.getRGB(clr);
        }
        if (is(clr, "object") && "r" in clr && "g" in clr && "b" in clr && !("error" in clr)) {
            rgb = Snap.rgb2hsl(clr);
            clr.h = rgb.h;
            clr.s = rgb.s;
            clr.l = rgb.l;
            rgb = Snap.rgb2hsb(clr);
            clr.v = rgb.b;
        } else {
            clr = {hex: "none"};
            clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
            clr.error = 1;
        }
    }
    clr.toString = rgbtoString;
    return clr;
};
/*\
 * Snap.hsb2rgb
 [ method ]
 **
 * Converts HSB values to an RGB object
 - h (number) hue
 - s (number) saturation
 - v (number) value or brightness
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••
 o }
\*/
Snap.hsb2rgb = function (h, s, v, o) {
    if (is(h, "object") && "h" in h && "s" in h && "b" in h) {
        v = h.b;
        s = h.s;
        o = h.o;
        h = h.h;
    }
    h *= 360;
    var R, G, B, X, C;
    h = h % 360 / 60;
    C = v * s;
    X = C * (1 - abs(h % 2 - 1));
    R = G = B = v - C;

    h = ~~h;
    R += [C, X, 0, 0, X, C][h];
    G += [X, C, C, X, 0, 0][h];
    B += [0, 0, X, C, C, X][h];
    return packageRGB(R, G, B, o);
};
/*\
 * Snap.hsl2rgb
 [ method ]
 **
 * Converts HSL values to an RGB object
 - h (number) hue
 - s (number) saturation
 - l (number) luminosity
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••
 o }
\*/
Snap.hsl2rgb = function (h, s, l, o) {
    if (is(h, "object") && "h" in h && "s" in h && "l" in h) {
        l = h.l;
        s = h.s;
        h = h.h;
    }
    if (h > 1 || s > 1 || l > 1) {
        h /= 360;
        s /= 100;
        l /= 100;
    }
    h *= 360;
    var R, G, B, X, C;
    h = h % 360 / 60;
    C = 2 * s * (l < .5 ? l : 1 - l);
    X = C * (1 - abs(h % 2 - 1));
    R = G = B = l - C / 2;

    h = ~~h;
    R += [C, X, 0, 0, X, C][h];
    G += [X, C, C, X, 0, 0][h];
    B += [0, 0, X, C, C, X][h];
    return packageRGB(R, G, B, o);
};
/*\
 * Snap.rgb2hsb
 [ method ]
 **
 * Converts RGB values to an HSB object
 - r (number) red
 - g (number) green
 - b (number) blue
 = (object) HSB object in the following format:
 o {
 o     h (number) hue,
 o     s (number) saturation,
 o     b (number) brightness
 o }
\*/
Snap.rgb2hsb = function (r, g, b) {
    b = prepareRGB(r, g, b);
    r = b[0];
    g = b[1];
    b = b[2];

    var H, S, V, C;
    V = mmax(r, g, b);
    C = V - mmin(r, g, b);
    H = C == 0 ? null :
        V == r ? (g - b) / C :
        V == g ? (b - r) / C + 2 :
                 (r - g) / C + 4;
    H = (H + 360) % 6 * 60 / 360;
    S = C == 0 ? 0 : C / V;
    return {h: H, s: S, b: V, toString: hsbtoString};
};
/*\
 * Snap.rgb2hsl
 [ method ]
 **
 * Converts RGB values to an HSL object
 - r (number) red
 - g (number) green
 - b (number) blue
 = (object) HSL object in the following format:
 o {
 o     h (number) hue,
 o     s (number) saturation,
 o     l (number) luminosity
 o }
\*/
Snap.rgb2hsl = function (r, g, b) {
    b = prepareRGB(r, g, b);
    r = b[0];
    g = b[1];
    b = b[2];

    var H, S, L, M, m, C;
    M = mmax(r, g, b);
    m = mmin(r, g, b);
    C = M - m;
    H = C == 0 ? null :
        M == r ? (g - b) / C :
        M == g ? (b - r) / C + 2 :
                 (r - g) / C + 4;
    H = (H + 360) % 6 * 60 / 360;
    L = (M + m) / 2;
    S = C == 0 ? 0 :
         L < .5 ? C / (2 * L) :
                  C / (2 - 2 * L);
    return {h: H, s: S, l: L, toString: hsltoString};
};

// Transformations
/*\
 * Snap.parsePathString
 [ method ]
 **
 * Utility method
 **
 * Parses given path string into an array of arrays of path segments
 - pathString (string|array) path string or array of segments (in the last case it is returned straight away)
 = (array) array of segments
\*/
Snap.parsePathString = function (pathString) {
    if (!pathString) {
        return null;
    }
    var pth = Snap.path(pathString);
    if (pth.arr) {
        return Snap.path.clone(pth.arr);
    }

    var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
        data = [];
    if (is(pathString, "array") && is(pathString[0], "array")) { // rough assumption
        data = Snap.path.clone(pathString);
    }
    if (!data.length) {
        Str(pathString).replace(pathCommand, function (a, b, c) {
            var params = [],
                name = b.toLowerCase();
            c.replace(pathValues, function (a, b) {
                b && params.push(+b);
            });
            if (name == "m" && params.length > 2) {
                data.push([b].concat(params.splice(0, 2)));
                name = "l";
                b = b == "m" ? "l" : "L";
            }
            if (name == "o" && params.length == 1) {
                data.push([b, params[0]]);
            }
            if (name == "r") {
                data.push([b].concat(params));
            } else while (params.length >= paramCounts[name]) {
                data.push([b].concat(params.splice(0, paramCounts[name])));
                if (!paramCounts[name]) {
                    break;
                }
            }
        });
    }
    data.toString = Snap.path.toString;
    pth.arr = Snap.path.clone(data);
    return data;
};
/*\
 * Snap.parseTransformString
 [ method ]
 **
 * Utility method
 **
 * Parses given transform string into an array of transformations
 - TString (string|array) transform string or array of transformations (in the last case it is returned straight away)
 = (array) array of transformations
\*/
var parseTransformString = Snap.parseTransformString = function (TString) {
    if (!TString) {
        return null;
    }
    var paramCounts = {r: 3, s: 4, t: 2, m: 6},
        data = [];
    if (is(TString, "array") && is(TString[0], "array")) { // rough assumption
        data = Snap.path.clone(TString);
    }
    if (!data.length) {
        Str(TString).replace(tCommand, function (a, b, c) {
            var params = [],
                name = b.toLowerCase();
            c.replace(pathValues, function (a, b) {
                b && params.push(+b);
            });
            data.push([b].concat(params));
        });
    }
    data.toString = Snap.path.toString;
    return data;
};
function svgTransform2string(tstr) {
    var res = [];
    tstr = tstr.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (all, name, params) {
        params = params.split(/\s*,\s*|\s+/);
        if (name == "rotate" && params.length == 1) {
            params.push(0, 0);
        }
        if (name == "scale") {
            if (params.length > 2) {
                params = params.slice(0, 2);
            } else if (params.length == 2) {
                params.push(0, 0);
            }
            if (params.length == 1) {
                params.push(params[0], 0, 0);
            }
        }
        if (name == "skewX") {
            res.push(["m", 1, 0, math.tan(rad(params[0])), 1, 0, 0]);
        } else if (name == "skewY") {
            res.push(["m", 1, math.tan(rad(params[0])), 0, 1, 0, 0]);
        } else {
            res.push([name.charAt(0)].concat(params));
        }
        return all;
    });
    return res;
}
Snap._.svgTransform2string = svgTransform2string;
Snap._.rgTransform = /^[a-z][\s]*-?\.?\d/i;
function transform2matrix(tstr, bbox) {
    var tdata = parseTransformString(tstr),
        m = new Snap.Matrix;
    if (tdata) {
        for (var i = 0, ii = tdata.length; i < ii; i++) {
            var t = tdata[i],
                tlen = t.length,
                command = Str(t[0]).toLowerCase(),
                absolute = t[0] != command,
                inver = absolute ? m.invert() : 0,
                x1,
                y1,
                x2,
                y2,
                bb;
            if (command == "t" && tlen == 2){
                m.translate(t[1], 0);
            } else if (command == "t" && tlen == 3) {
                if (absolute) {
                    x1 = inver.x(0, 0);
                    y1 = inver.y(0, 0);
                    x2 = inver.x(t[1], t[2]);
                    y2 = inver.y(t[1], t[2]);
                    m.translate(x2 - x1, y2 - y1);
                } else {
                    m.translate(t[1], t[2]);
                }
            } else if (command == "r") {
                if (tlen == 2) {
                    bb = bb || bbox;
                    m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                } else if (tlen == 4) {
                    if (absolute) {
                        x2 = inver.x(t[2], t[3]);
                        y2 = inver.y(t[2], t[3]);
                        m.rotate(t[1], x2, y2);
                    } else {
                        m.rotate(t[1], t[2], t[3]);
                    }
                }
            } else if (command == "s") {
                if (tlen == 2 || tlen == 3) {
                    bb = bb || bbox;
                    m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                } else if (tlen == 4) {
                    if (absolute) {
                        x2 = inver.x(t[2], t[3]);
                        y2 = inver.y(t[2], t[3]);
                        m.scale(t[1], t[1], x2, y2);
                    } else {
                        m.scale(t[1], t[1], t[2], t[3]);
                    }
                } else if (tlen == 5) {
                    if (absolute) {
                        x2 = inver.x(t[3], t[4]);
                        y2 = inver.y(t[3], t[4]);
                        m.scale(t[1], t[2], x2, y2);
                    } else {
                        m.scale(t[1], t[2], t[3], t[4]);
                    }
                }
            } else if (command == "m" && tlen == 7) {
                m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
            }
        }
    }
    return m;
}
Snap._.transform2matrix = transform2matrix;
Snap._unit2px = unit2px;
var contains = glob.doc.contains || glob.doc.compareDocumentPosition ?
    function (a, b) {
        var adown = a.nodeType == 9 ? a.documentElement : a,
            bup = b && b.parentNode;
            return a == bup || !!(bup && bup.nodeType == 1 && (
                adown.contains ?
                    adown.contains(bup) :
                    a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
            ));
    } :
    function (a, b) {
        if (b) {
            while (b) {
                b = b.parentNode;
                if (b == a) {
                    return true;
                }
            }
        }
        return false;
    };
function getSomeDefs(el) {
    var p = el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) ||
            el.node.parentNode && wrap(el.node.parentNode) ||
            Snap.select("svg") ||
            Snap(0, 0),
        pdefs = p.select("defs"),
        defs  = pdefs == null ? false : pdefs.node;
    if (!defs) {
        defs = make("defs", p.node).node;
    }
    return defs;
}
function getSomeSVG(el) {
    return el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) || Snap.select("svg");
}
Snap._.getSomeDefs = getSomeDefs;
Snap._.getSomeSVG = getSomeSVG;
function unit2px(el, name, value) {
    var svg = getSomeSVG(el).node,
        out = {},
        mgr = svg.querySelector(".svg---mgr");
    if (!mgr) {
        mgr = $("rect");
        $(mgr, {x: -9e9, y: -9e9, width: 10, height: 10, "class": "svg---mgr", fill: "none"});
        svg.appendChild(mgr);
    }
    function getW(val) {
        if (val == null) {
            return E;
        }
        if (val == +val) {
            return val;
        }
        $(mgr, {width: val});
        try {
            return mgr.getBBox().width;
        } catch (e) {
            return 0;
        }
    }
    function getH(val) {
        if (val == null) {
            return E;
        }
        if (val == +val) {
            return val;
        }
        $(mgr, {height: val});
        try {
            return mgr.getBBox().height;
        } catch (e) {
            return 0;
        }
    }
    function set(nam, f) {
        if (name == null) {
            out[nam] = f(el.attr(nam) || 0);
        } else if (nam == name) {
            out = f(value == null ? el.attr(nam) || 0 : value);
        }
    }
    switch (el.type) {
        case "rect":
            set("rx", getW);
            set("ry", getH);
        case "image":
            set("width", getW);
            set("height", getH);
        case "text":
            set("x", getW);
            set("y", getH);
        break;
        case "circle":
            set("cx", getW);
            set("cy", getH);
            set("r", getW);
        break;
        case "ellipse":
            set("cx", getW);
            set("cy", getH);
            set("rx", getW);
            set("ry", getH);
        break;
        case "line":
            set("x1", getW);
            set("x2", getW);
            set("y1", getH);
            set("y2", getH);
        break;
        case "marker":
            set("refX", getW);
            set("markerWidth", getW);
            set("refY", getH);
            set("markerHeight", getH);
        break;
        case "radialGradient":
            set("fx", getW);
            set("fy", getH);
        break;
        case "tspan":
            set("dx", getW);
            set("dy", getH);
        break;
        default:
            set(name, getW);
    }
    svg.removeChild(mgr);
    return out;
}
/*\
 * Snap.select
 [ method ]
 **
 * Wraps a DOM element specified by CSS selector as @Element
 - query (string) CSS selector of the element
 = (Element) the current element
\*/
Snap.select = function (query) {
    query = Str(query).replace(/([^\\]):/g, "$1\\:");
    return wrap(glob.doc.querySelector(query));
};
/*\
 * Snap.selectAll
 [ method ]
 **
 * Wraps DOM elements specified by CSS selector as set or array of @Element
 - query (string) CSS selector of the element
 = (Element) the current element
\*/
Snap.selectAll = function (query) {
    var nodelist = glob.doc.querySelectorAll(query),
        set = (Snap.set || Array)();
    for (var i = 0; i < nodelist.length; i++) {
        set.push(wrap(nodelist[i]));
    }
    return set;
};

function add2group(list) {
    if (!is(list, "array")) {
        list = Array.prototype.slice.call(arguments, 0);
    }
    var i = 0,
        j = 0,
        node = this.node;
    while (this[i]) delete this[i++];
    for (i = 0; i < list.length; i++) {
        if (list[i].type == "set") {
            list[i].forEach(function (el) {
                node.appendChild(el.node);
            });
        } else {
            node.appendChild(list[i].node);
        }
    }
    var children = node.childNodes;
    for (i = 0; i < children.length; i++) {
        this[j++] = wrap(children[i]);
    }
    return this;
}
// Hub garbage collector every 10s
setInterval(function () {
    for (var key in hub) if (hub[has](key)) {
        var el = hub[key],
            node = el.node;
        if (el.type != "svg" && !node.ownerSVGElement || el.type == "svg" && (!node.parentNode || "ownerSVGElement" in node.parentNode && !node.ownerSVGElement)) {
            delete hub[key];
        }
    }
}, 1e4);
function Element(el) {
    if (el.snap in hub) {
        return hub[el.snap];
    }
    var svg;
    try {
        svg = el.ownerSVGElement;
    } catch(e) {}
    /*\
     * Element.node
     [ property (object) ]
     **
     * Gives you a reference to the DOM object, so you can assign event handlers or just mess around.
     > Usage
     | // draw a circle at coordinate 10,10 with radius of 10
     | var c = paper.circle(10, 10, 10);
     | c.node.onclick = function () {
     |     c.attr("fill", "red");
     | };
    \*/
    this.node = el;
    if (svg) {
        this.paper = new Paper(svg);
    }
    /*\
     * Element.type
     [ property (string) ]
     **
     * SVG tag name of the given element.
    \*/
    this.type = el.tagName || el.nodeName;
    var id = this.id = ID(this);
    this.anims = {};
    this._ = {
        transform: []
    };
    el.snap = id;
    hub[id] = this;
    if (this.type == "g") {
        this.add = add2group;
    }
    if (this.type in {g: 1, mask: 1, pattern: 1, symbol: 1}) {
        for (var method in Paper.prototype) if (Paper.prototype[has](method)) {
            this[method] = Paper.prototype[method];
        }
    }
}
   /*\
     * Element.attr
     [ method ]
     **
     * Gets or sets given attributes of the element.
     **
     - params (object) contains key-value pairs of attributes you want to set
     * or
     - param (string) name of the attribute
     = (Element) the current element
     * or
     = (string) value of attribute
     > Usage
     | el.attr({
     |     fill: "#fc0",
     |     stroke: "#000",
     |     strokeWidth: 2, // CamelCase...
     |     "fill-opacity": 0.5, // or dash-separated names
     |     width: "*=2" // prefixed values
     | });
     | console.log(el.attr("fill")); // #fc0
     * Prefixed values in format `"+=10"` supported. All four operations
     * (`+`, `-`, `*` and `/`) could be used. Optionally you can use units for `+`
     * and `-`: `"+=2em"`.
    \*/
    Element.prototype.attr = function (params, value) {
        var el = this,
            node = el.node;
        if (!params) {
            if (node.nodeType != 1) {
                return {
                    text: node.nodeValue
                };
            }
            var attr = node.attributes,
                out = {};
            for (var i = 0, ii = attr.length; i < ii; i++) {
                out[attr[i].nodeName] = attr[i].nodeValue;
            }
            return out;
        }
        if (is(params, "string")) {
            if (arguments.length > 1) {
                var json = {};
                json[params] = value;
                params = json;
            } else {
                return eve("snap.util.getattr." + params, el).firstDefined();
            }
        }
        for (var att in params) {
            if (params[has](att)) {
                eve("snap.util.attr." + att, el, params[att]);
            }
        }
        return el;
    };
/*\
 * Snap.parse
 [ method ]
 **
 * Parses SVG fragment and converts it into a @Fragment
 **
 - svg (string) SVG string
 = (Fragment) the @Fragment
\*/
Snap.parse = function (svg) {
    var f = glob.doc.createDocumentFragment(),
        full = true,
        div = glob.doc.createElement("div");
    svg = Str(svg);
    if (!svg.match(/^\s*<\s*svg(?:\s|>)/)) {
        svg = "<svg>" + svg + "</svg>";
        full = false;
    }
    div.innerHTML = svg;
    svg = div.getElementsByTagName("svg")[0];
    if (svg) {
        if (full) {
            f = svg;
        } else {
            while (svg.firstChild) {
                f.appendChild(svg.firstChild);
            }
        }
    }
    return new Fragment(f);
};
function Fragment(frag) {
    this.node = frag;
}
/*\
 * Snap.fragment
 [ method ]
 **
 * Creates a DOM fragment from a given list of elements or strings
 **
 - varargs (…) SVG string
 = (Fragment) the @Fragment
\*/
Snap.fragment = function () {
    var args = Array.prototype.slice.call(arguments, 0),
        f = glob.doc.createDocumentFragment();
    for (var i = 0, ii = args.length; i < ii; i++) {
        var item = args[i];
        if (item.node && item.node.nodeType) {
            f.appendChild(item.node);
        }
        if (item.nodeType) {
            f.appendChild(item);
        }
        if (typeof item == "string") {
            f.appendChild(Snap.parse(item).node);
        }
    }
    return new Fragment(f);
};

function make(name, parent) {
    var res = $(name);
    parent.appendChild(res);
    var el = wrap(res);
    return el;
}
function Paper(w, h) {
    var res,
        desc,
        defs,
        proto = Paper.prototype;
    if (w && w.tagName && w.tagName.toLowerCase() == "svg") {
        if (w.snap in hub) {
            return hub[w.snap];
        }
        var doc = w.ownerDocument;
        res = new Element(w);
        desc = w.getElementsByTagName("desc")[0];
        defs = w.getElementsByTagName("defs")[0];
        if (!desc) {
            desc = $("desc");
            desc.appendChild(doc.createTextNode("Created with Snap"));
            res.node.appendChild(desc);
        }
        if (!defs) {
            defs = $("defs");
            res.node.appendChild(defs);
        }
        res.defs = defs;
        for (var key in proto) if (proto[has](key)) {
            res[key] = proto[key];
        }
        res.paper = res.root = res;
    } else {
        res = make("svg", glob.doc.body);
        $(res.node, {
            height: h,
            version: 1.1,
            width: w,
            xmlns: xmlns
        });
    }
    return res;
}
function wrap(dom) {
    if (!dom) {
        return dom;
    }
    if (dom instanceof Element || dom instanceof Fragment) {
        return dom;
    }
    if (dom.tagName && dom.tagName.toLowerCase() == "svg") {
        return new Paper(dom);
    }
    if (dom.tagName && dom.tagName.toLowerCase() == "object" && dom.type == "image/svg+xml") {
        return new Paper(dom.contentDocument.getElementsByTagName("svg")[0]);
    }
    return new Element(dom);
}

Snap._.make = make;
Snap._.wrap = wrap;
/*\
 * Paper.el
 [ method ]
 **
 * Creates an element on paper with a given name and no attributes
 **
 - name (string) tag name
 - attr (object) attributes
 = (Element) the current element
 > Usage
 | var c = paper.circle(10, 10, 10); // is the same as...
 | var c = paper.el("circle").attr({
 |     cx: 10,
 |     cy: 10,
 |     r: 10
 | });
 | // and the same as
 | var c = paper.el("circle", {
 |     cx: 10,
 |     cy: 10,
 |     r: 10
 | });
\*/
Paper.prototype.el = function (name, attr) {
    var el = make(name, this.node);
    attr && el.attr(attr);
    return el;
};
/*\
 * Element.children
 [ method ]
 **
 * Returns array of all the children of the element.
 = (array) array of Elements
\*/
Element.prototype.children = function () {
    var out = [],
        ch = this.node.childNodes;
    for (var i = 0, ii = ch.length; i < ii; i++) {
        out[i] = Snap(ch[i]);
    }
    return out;
};
function jsonFiller(root, o) {
    for (var i = 0, ii = root.length; i < ii; i++) {
        var item = {
                type: root[i].type,
                attr: root[i].attr()
            },
            children = root[i].children();
        o.push(item);
        if (children.length) {
            jsonFiller(children, item.childNodes = []);
        }
    }
}
/*\
 * Element.toJSON
 [ method ]
 **
 * Returns object representation of the given element and all its children.
 = (object) in format
 o {
 o     type (string) this.type,
 o     attr (object) attributes map,
 o     childNodes (array) optional array of children in the same format
 o }
\*/
Element.prototype.toJSON = function () {
    var out = [];
    jsonFiller([this], out);
    return out[0];
};
// default
eve.on("snap.util.getattr", function () {
    var att = eve.nt();
    att = att.substring(att.lastIndexOf(".") + 1);
    var css = att.replace(/[A-Z]/g, function (letter) {
        return "-" + letter.toLowerCase();
    });
    if (cssAttr[has](css)) {
        return this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(css);
    } else {
        return $(this.node, att);
    }
});
var cssAttr = {
    "alignment-baseline": 0,
    "baseline-shift": 0,
    "clip": 0,
    "clip-path": 0,
    "clip-rule": 0,
    "color": 0,
    "color-interpolation": 0,
    "color-interpolation-filters": 0,
    "color-profile": 0,
    "color-rendering": 0,
    "cursor": 0,
    "direction": 0,
    "display": 0,
    "dominant-baseline": 0,
    "enable-background": 0,
    "fill": 0,
    "fill-opacity": 0,
    "fill-rule": 0,
    "filter": 0,
    "flood-color": 0,
    "flood-opacity": 0,
    "font": 0,
    "font-family": 0,
    "font-size": 0,
    "font-size-adjust": 0,
    "font-stretch": 0,
    "font-style": 0,
    "font-variant": 0,
    "font-weight": 0,
    "glyph-orientation-horizontal": 0,
    "glyph-orientation-vertical": 0,
    "image-rendering": 0,
    "kerning": 0,
    "letter-spacing": 0,
    "lighting-color": 0,
    "marker": 0,
    "marker-end": 0,
    "marker-mid": 0,
    "marker-start": 0,
    "mask": 0,
    "opacity": 0,
    "overflow": 0,
    "pointer-events": 0,
    "shape-rendering": 0,
    "stop-color": 0,
    "stop-opacity": 0,
    "stroke": 0,
    "stroke-dasharray": 0,
    "stroke-dashoffset": 0,
    "stroke-linecap": 0,
    "stroke-linejoin": 0,
    "stroke-miterlimit": 0,
    "stroke-opacity": 0,
    "stroke-width": 0,
    "text-anchor": 0,
    "text-decoration": 0,
    "text-rendering": 0,
    "unicode-bidi": 0,
    "visibility": 0,
    "word-spacing": 0,
    "writing-mode": 0
};

eve.on("snap.util.attr", function (value) {
    var att = eve.nt(),
        attr = {};
    att = att.substring(att.lastIndexOf(".") + 1);
    attr[att] = value;
    var style = att.replace(/-(\w)/gi, function (all, letter) {
            return letter.toUpperCase();
        }),
        css = att.replace(/[A-Z]/g, function (letter) {
            return "-" + letter.toLowerCase();
        });
    if (cssAttr[has](css)) {
        this.node.style[style] = value == null ? E : value;
    } else {
        $(this.node, attr);
    }
});
(function (proto) {}(Paper.prototype));

// simple ajax
/*\
 * Snap.ajax
 [ method ]
 **
 * Simple implementation of Ajax
 **
 - url (string) URL
 - postData (object|string) data for post request
 - callback (function) callback
 - scope (object) #optional scope of callback
 * or
 - url (string) URL
 - callback (function) callback
 - scope (object) #optional scope of callback
 = (XMLHttpRequest) the XMLHttpRequest object, just in case
\*/
Snap.ajax = function (url, postData, callback, scope){
    var req = new XMLHttpRequest,
        id = ID();
    if (req) {
        if (is(postData, "function")) {
            scope = callback;
            callback = postData;
            postData = null;
        } else if (is(postData, "object")) {
            var pd = [];
            for (var key in postData) if (postData.hasOwnProperty(key)) {
                pd.push(encodeURIComponent(key) + "=" + encodeURIComponent(postData[key]));
            }
            postData = pd.join("&");
        }
        req.open(postData ? "POST" : "GET", url, true);
        if (postData) {
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        if (callback) {
            eve.once("snap.ajax." + id + ".0", callback);
            eve.once("snap.ajax." + id + ".200", callback);
            eve.once("snap.ajax." + id + ".304", callback);
        }
        req.onreadystatechange = function() {
            if (req.readyState != 4) return;
            eve("snap.ajax." + id + "." + req.status, scope, req);
        };
        if (req.readyState == 4) {
            return req;
        }
        req.send(postData);
        return req;
    }
};
/*\
 * Snap.load
 [ method ]
 **
 * Loads external SVG file as a @Fragment (see @Snap.ajax for more advanced AJAX)
 **
 - url (string) URL
 - callback (function) callback
 - scope (object) #optional scope of callback
\*/
Snap.load = function (url, callback, scope) {
    Snap.ajax(url, function (req) {
        var f = Snap.parse(req.responseText);
        scope ? callback.call(scope, f) : callback(f);
    });
};
var getOffset = function (elem) {
    var box = elem.getBoundingClientRect(),
        doc = elem.ownerDocument,
        body = doc.body,
        docElem = doc.documentElement,
        clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
        top  = box.top  + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop ) - clientTop,
        left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
    return {
        y: top,
        x: left
    };
};
/*\
 * Snap.getElementByPoint
 [ method ]
 **
 * Returns you topmost element under given point.
 **
 = (object) Snap element object
 - x (number) x coordinate from the top left corner of the window
 - y (number) y coordinate from the top left corner of the window
 > Usage
 | Snap.getElementByPoint(mouseX, mouseY).attr({stroke: "#f00"});
\*/
Snap.getElementByPoint = function (x, y) {
    var paper = this,
        svg = paper.canvas,
        target = glob.doc.elementFromPoint(x, y);
    if (glob.win.opera && target.tagName == "svg") {
        var so = getOffset(target),
   