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
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Point2D = void 0;
class Point2D {
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
    static BuildFromJSON(data) {
        return new Point2D(data.x, data.y);
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
exports.Rect = void 0;
class Rect {
    constructor(width, height) {
        this.width = 0;
        this.height = 0;
        this.resize(width, height);
    }
    static BuildFromJSON(data) {
        return new Rect(data.width, data.height);
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
exports.ChangeEventType = void 0;
var ChangeEventType;
(function (ChangeEventType) {
    ChangeEventType[ChangeEventType["MOVEEND"] = 0] = "MOVEEND";
    ChangeEventType[ChangeEventType["MOVING"] = 1] = "MOVING";
    ChangeEventType[ChangeEventType["MOVEBEGIN"] = 2] = "MOVEBEGIN";
    ChangeEventType[ChangeEventType["SELECTIONTOGGLE"] = 3] = "SELECTIONTOGGLE";
})(ChangeEventType = exports.ChangeEventType || (exports.ChangeEventType = {}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionData = exports.RegionDataType = void 0;
const calculateLineSegments_1 = __webpack_require__(37);
const RegionDataType_1 = __webpack_require__(25);
Object.defineProperty(exports, "RegionDataType", { enumerable: true, get: function () { return RegionDataType_1.RegionDataType; } });
const CubicBezierControl_1 = __webpack_require__(18);
const CubicBezierIndex_1 = __webpack_require__(38);
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
class RegionData {
    constructor(x, y, width, height, points, type, bezierControls) {
        this.corner = new Point2D_1.Point2D(x, y);
        this.regionRect = new Rect_1.Rect(width, height);
        this.regionPoints = points !== null && points !== void 0 ? points : [];
        this.regionBezierControls = new CubicBezierIndex_1.CubicBezierIndex(bezierControls);
        this.regionType = type !== null && type !== void 0 ? type : RegionDataType_1.RegionDataType.Point;
    }
    static BuildPointRegionData(x, y) {
        return new RegionData(x, y, 0, 0, [new Point2D_1.Point2D(x, y)], RegionDataType_1.RegionDataType.Point);
    }
    static BuildRectRegionData(x, y, width, height) {
        return new RegionData(x, y, width, height, [
            new Point2D_1.Point2D(x, y),
            new Point2D_1.Point2D(x + width, y),
            new Point2D_1.Point2D(x + width, y + height),
            new Point2D_1.Point2D(x, y + height),
        ], RegionDataType_1.RegionDataType.Rect);
    }
    static BuildPolygonRegionData(x, y, width, height, points) {
        const region = new RegionData(x, y, width, height, points.map((p) => new Point2D_1.Point2D(p.x, p.y)), RegionDataType_1.RegionDataType.Polygon);
        return region;
    }
    static BuildPathRegionData(x, y, width, height, points, bezierControls) {
        const region = new RegionData(x, y, width, height, points.map((p) => new Point2D_1.Point2D(p.x, p.y)), RegionDataType_1.RegionDataType.Path, CubicBezierIndex_1.CubicBezierIndex.buildFromJSON(bezierControls));
        return region;
    }
    static BuildFromJson(data) {
        return new RegionData(data.x, data.y, data.width, data.height, data.points.map((p) => new Point2D_1.Point2D(p.x, p.y)), data.type, CubicBezierIndex_1.CubicBezierIndex.buildFromJSON(data.bezierControls));
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
        if (this.regionType === RegionDataType_1.RegionDataType.Point) {
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
    get bezierControls() {
        return this.regionBezierControls.copy();
    }
    get type() {
        return this.regionType;
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
        this.regionBezierControls = this.regionBezierControls.shift(dx, dy);
    }
    resize(width, height) {
        const sx = width / this.width;
        const sy = height / this.height;
        this.regionRect.resize(width, height);
        const movePoint = (p) => {
            const px = (p.x - this.x) * sx + this.x;
            const py = (p.y - this.y) * sy + this.y;
            return new Point2D_1.Point2D(px, py);
        };
        this.regionPoints = this.regionPoints.map(movePoint);
        this.regionBezierControls = this.regionBezierControls.move(movePoint);
    }
    setPoint(point, index) {
        if (index >= 0 && index < this.regionPoints.length) {
            this.regionPoints[index] = new Point2D_1.Point2D(point);
        }
        this.resetBBox();
    }
    splicePoints(start, deleteCount = 0, ...points) {
        const pointCount = this.regionPoints.length;
        const spliceStart = start < 0 ? start : start > pointCount ? pointCount : start;
        const bezDeleteIndexes = [];
        if (spliceStart === 0) {
            bezDeleteIndexes.push(pointCount - 1);
        }
        else {
            bezDeleteIndexes.push(spliceStart - 1);
        }
        for (let i = spliceStart; i < spliceStart + deleteCount; i++) {
            bezDeleteIndexes.push(i);
        }
        const idxDiff = points.length - deleteCount;
        const newBezierRecord = {};
        this.regionBezierControls.forEach((control, idx) => {
            if (bezDeleteIndexes.includes(idx)) {
                return undefined;
            }
            if (idx >= spliceStart) {
                newBezierRecord[idx + idxDiff] = control.copy();
                return;
            }
            return (newBezierRecord[idx] = control.copy());
        });
        this.regionBezierControls = new CubicBezierIndex_1.CubicBezierIndex(newBezierRecord);
        this.regionPoints.splice(spliceStart, deleteCount, ...points.map((p) => new Point2D_1.Point2D(p)));
        this.resetBBox();
    }
    setBezierControl(index, control) {
        this.setBezierControls({ [index]: control });
    }
    setBezierControls(controls) {
        this._setBezierControls(controls);
        this.resetBBox();
    }
    deleteBezierControls(index) {
        this._deleteBezierControls(index);
        this.resetBBox();
    }
    setPoints(points) {
        this.regionPoints = points.map((p) => new Point2D_1.Point2D(p));
        this.resetBBox();
    }
    initFrom(regionData) {
        this.corner = new Point2D_1.Point2D(regionData.x, regionData.y);
        this.regionRect = new Rect_1.Rect(regionData.width, regionData.height);
        this.regionPoints = regionData.points.map((p) => new Point2D_1.Point2D(p.x, p.y));
        this.regionBezierControls = CubicBezierIndex_1.CubicBezierIndex.buildFromJSON(regionData.bezierControls);
    }
    boundToRect(rect) {
        const brCorner = new Point2D_1.Point2D(this.x + this.width, this.y + this.height).boundToRect(rect);
        const tlCorner = this.corner.boundToRect(rect);
        const width = brCorner.x - tlCorner.x;
        const height = brCorner.y - tlCorner.y;
        return new RegionData(tlCorner.x, tlCorner.y, width, height, this.regionPoints.map((p) => p.boundToRect(rect)), this.regionType, this.regionBezierControls.boundToRect(rect));
    }
    scale(f1, f2) {
        const xf = f1;
        const yf = f2 !== undefined ? f2 : f1;
        const scalePoint = (p) => {
            return new Point2D_1.Point2D(p.x * xf, p.y * yf);
        };
        const scaleRect = (r) => {
            return new Rect_1.Rect(r.width * xf, r.height * yf);
        };
        this.corner = scalePoint(this);
        this.regionRect = scaleRect(this);
        this.regionPoints = this.regionPoints.map(scalePoint);
        this.regionBezierControls = this.regionBezierControls.scale(scalePoint);
    }
    copy() {
        return new RegionData(this.x, this.y, this.width, this.height, this.regionPoints.map((p) => p.copy()), this.regionType, this.regionBezierControls.copy());
    }
    getLineSegments() {
        return calculateLineSegments_1.calculateLineSegments(this.regionPoints, { regionType: this.regionType });
    }
    toString() {
        return `${this.corner.toString()} x ${this.boundRect.toString()}: {${this.regionPoints.toString()}}, {${this.regionBezierControls.toString()}}`;
    }
    toPath() {
        const lineSegments = this.getLineSegments();
        const lineSegmentsLength = lineSegments.length;
        const points = this.regionPoints;
        const controlPoints = this.regionBezierControls;
        if (points.length === 1) {
            return `M${points[0].x},${points[0].y} m-1,0 a1,1 0 1 0 2,0 a1,1 0 1 0 -2,0`;
        }
        const pathSegments = [];
        for (let i = 0; i < lineSegmentsLength; i++) {
            const line = lineSegments[i];
            if (i === 0) {
                pathSegments.push(`M${line.start.x},${line.start.y}`);
            }
            if (controlPoints[i]) {
                pathSegments.push(`C${controlPoints[i].c1.x},${controlPoints[i].c1.y} ${controlPoints[i].c2.x},${controlPoints[i].c2.y} ${line.end.x},${line.end.y}`);
            }
            else {
                pathSegments.push(`L${line.end.x},${line.end.y}`);
            }
        }
        return pathSegments.join(" ");
    }
    toLinePathSegments() {
        const lineSegments = this.getLineSegments();
        const lineSegmentsLength = lineSegments.length;
        const controlPoints = this.regionBezierControls;
        const pathSegments = [];
        for (let i = 0; i < lineSegmentsLength; i++) {
            const line = lineSegments[i];
            if (controlPoints[i]) {
                pathSegments.push(`M${line.start.x},${line.start.y} C${controlPoints[i].c1.x},${controlPoints[i].c1.y} ${controlPoints[i].c2.x},${controlPoints[i].c2.y} ${line.end.x},${line.end.y}`);
            }
            else {
                pathSegments.push(`M${line.start.x},${line.start.y} L${line.end.x},${line.end.y}`);
            }
        }
        return pathSegments;
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
            bezierControls: this.regionBezierControls.toJSON(),
            type: this.regionType,
        };
    }
    _deleteBezierControls(index) {
        const delIndexes = Array.isArray(index) ? index : [index];
        delIndexes.forEach((i) => delete this.regionBezierControls[i]);
    }
    _setBezierControls(controls) {
        const lineCount = this.getLineSegmentCount();
        Object.entries(controls).forEach(([index, control]) => {
            const iIndex = Number(index);
            if (iIndex < 0 || iIndex >= lineCount) {
                return;
            }
            this.regionBezierControls[iIndex] = new CubicBezierControl_1.CubicBezierControl(control);
        });
    }
    resetBBox() {
        const { x: xmin, y: ymin, height, width } = Snap.path.getBBox(this.toPath());
        this.corner.move(xmin, ymin);
        this.regionRect.resize(width, height);
    }
    getLineSegmentCount() {
        const pointCount = this.regionPoints.length;
        if ([RegionDataType_1.RegionDataType.Polygon, RegionDataType_1.RegionDataType.Path].includes(this.regionType)) {
            return pointCount;
        }
        return pointCount - 1;
    }
}
exports.RegionData = RegionData;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionComponent = void 0;
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
        this.node.node.setAttribute("display", "none");
        this.isVisible = false;
    }
    show() {
        this.node.node.setAttribute("display", "inherit");
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarIcon = exports.ToolbarItemType = void 0;
const ToolbarSelect_1 = __webpack_require__(33);
var ToolbarItemType;
(function (ToolbarItemType) {
    ToolbarItemType[ToolbarItemType["SELECTOR"] = 0] = "SELECTOR";
    ToolbarItemType[ToolbarItemType["SWITCH"] = 1] = "SWITCH";
    ToolbarItemType[ToolbarItemType["SEPARATOR"] = 2] = "SEPARATOR";
    ToolbarItemType[ToolbarItemType["TRIGGER"] = 3] = "TRIGGER";
})(ToolbarItemType = exports.ToolbarItemType || (exports.ToolbarItemType = {}));
class ToolbarIcon extends ToolbarSelect_1.ToolbarSelect {
    constructor(paper, icon, onAction, action, key) {
        super(onAction, action, key);
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
        super.select();
        this.node.addClass("selected");
    }
    unselect() {
        super.unselect();
        this.node.removeClass("selected");
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
exports.ToolbarIcon = ToolbarIcon;
ToolbarIcon.IconWidth = 48;
ToolbarIcon.IconHeight = 48;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Region = void 0;
const RegionComponent_1 = __webpack_require__(4);
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorsComponent = void 0;
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(2);
const RegionComponent_1 = __webpack_require__(4);
class AnchorsComponent extends RegionComponent_1.RegionComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.mixins = [];
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
        this.mixins.forEach(m => m.redraw());
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
        this.mixins.forEach(m => m.buildAnchors());
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
exports.AnchorsComponent = AnchorsComponent;
AnchorsComponent.DEFAULT_ANCHOR_RADIUS = 3;
AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS = 7;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsComponent = void 0;
const RegionComponent_1 = __webpack_require__(4);
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
    static getCachedBBox(primaryTagNode) {
        const tagName = primaryTagNode.node.innerHTML;
        if (TagsComponent.bboxCache[tagName]) {
            return TagsComponent.bboxCache[tagName];
        }
        TagsComponent.bboxCache[tagName] = primaryTagNode.getBBox();
        return TagsComponent.bboxCache[tagName];
    }
    updateTags(tags, options) {
        this.tags = tags;
        this.tagsUpdateOptions = options;
        this.rebuildTagLabels();
        this.clearStyleMaps();
        this.initStyleMaps(tags);
        const showBackground = (options !== undefined) ? options.showRegionBackground : true;
        this.applyStyleMaps(showBackground);
        const showTagsText = (options !== undefined) ? options.showTagsText : true;
        this.applyStyleForTagsVisibility(showTagsText);
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
    applyStyleForTagsVisibility(showTagsText = true) {
        if (this.tags && this.tags.primary !== undefined) {
            const visibility = showTagsText ? "block" : "none";
            const sm = [
                {
                    rule: `.${this.styleId} .primaryTagTextBGStyle`,
                    style: `display: ${visibility};`,
                },
                {
                    rule: `.${this.styleId} .primaryTagTextStyle`,
                    style: `display: ${visibility};`,
                },
            ];
            window.requestAnimationFrame(() => {
                for (const r of sm) {
                    this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
                }
            });
        }
    }
}
exports.TagsComponent = TagsComponent;
TagsComponent.bboxCache = {};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Selector = void 0;
const Element_1 = __webpack_require__(19);
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LABColor = void 0;
const XYZColor_1 = __webpack_require__(16);
class LABColor {
    constructor(l, a, b) {
        this.values = [l, a, b];
    }
    get l() {
        return this.values[0];
    }
    get a() {
        return this.values[1];
    }
    get b() {
        return this.values[2];
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationManager = void 0;
class ConfigurationManager {
}
exports.ConfigurationManager = ConfigurationManager;
ConfigurationManager.isModifyRegionOnlyMode = false;
ConfigurationManager.isPathRegionEnabled = false;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DragComponent = void 0;
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(2);
const RegionComponent_1 = __webpack_require__(4);
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossElement = void 0;
const Point2D_1 = __webpack_require__(0);
const Element_1 = __webpack_require__(19);
class CrossElement extends Element_1.Element {
    constructor(paper, boundRect) {
        super(paper, boundRect);
        this.buildUIElements();
        this.hide();
    }
    get x() {
        return this.center.x;
    }
    get y() {
        return this.center.y;
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HSLColor = void 0;
const SRGBColor_1 = __webpack_require__(21);
class HSLColor {
    constructor(h, s, l) {
        this.values = [h, s, l];
    }
    get h() {
        return this.values[0];
    }
    get s() {
        return this.values[1];
    }
    get l() {
        return this.values[2];
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
exports.RGBColor = void 0;
const SRGBColor_1 = __webpack_require__(21);
const XYZColor_1 = __webpack_require__(16);
class RGBColor {
    constructor(r, g, b) {
        this.values = [r, g, b];
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.XYZColor = void 0;
const LABColor_1 = __webpack_require__(10);
const RGBColor_1 = __webpack_require__(15);
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
exports.XYZColor = XYZColor;
XYZColor.D65 = new XYZColor(0.95047, 1.000, 1.08883);
XYZColor.D50 = new XYZColor(0.966797, 1.000, 0.825188);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionMode = void 0;
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CubicBezierControl = void 0;
const Point2D_1 = __webpack_require__(0);
class CubicBezierControl {
    constructor({ c1, c2 }) {
        this.c1 = new Point2D_1.Point2D(c1);
        this.c2 = new Point2D_1.Point2D(c2);
    }
    static BuildFromJSON({ c1, c2 }) {
        return new CubicBezierControl({ c1, c2 });
    }
    boundToRect(r) {
        return new CubicBezierControl({ c1: this.c1.boundToRect(r), c2: this.c2.boundToRect(r) });
    }
    shift(dx, dy) {
        this.c1.shift(dx, dy);
        this.c2.shift(dx, dy);
    }
    copy() {
        return new CubicBezierControl(this);
    }
    toString() {
        return `{${this.c1.toString()}, ${this.c2.toString()}}`;
    }
    toJSON() {
        return {
            c1: this.c1.toJSON(),
            c2: this.c2.toJSON(),
        };
    }
}
exports.CubicBezierControl = CubicBezierControl;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
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
    resize(width, height, oldWidth, oldHeight) {
        this.boundRect.resize(width, height);
    }
}
exports.Element = Element;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
const HSLColor_1 = __webpack_require__(14);
const LABColor_1 = __webpack_require__(10);
const RGBColor_1 = __webpack_require__(15);
const SRGBColor_1 = __webpack_require__(21);
const XYZColor_1 = __webpack_require__(16);
class Color {
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
}
exports.Color = Color;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SRGBColor = void 0;
const HSLColor_1 = __webpack_require__(14);
const RGBColor_1 = __webpack_require__(15);
class SRGBColor {
    constructor(r, g, b) {
        this.values = [r, g, b];
    }
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterPipeline = exports.SaturationFilter = exports.ContrastFilter = exports.BrightnessFilter = exports.BlurDiffFilter = exports.GrayscaleFilter = exports.InvertFilter = void 0;
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomManager = exports.ZoomType = exports.ZoomDirection = void 0;
var ZoomDirection;
(function (ZoomDirection) {
    ZoomDirection[ZoomDirection["In"] = 0] = "In";
    ZoomDirection[ZoomDirection["Out"] = 1] = "Out";
})(ZoomDirection = exports.ZoomDirection || (exports.ZoomDirection = {}));
var ZoomType;
(function (ZoomType) {
    ZoomType[ZoomType["Default"] = 0] = "Default";
    ZoomType[ZoomType["ImageCenter"] = 1] = "ImageCenter";
    ZoomType[ZoomType["ViewportCenter"] = 2] = "ViewportCenter";
    ZoomType[ZoomType["CursorCenter"] = 3] = "CursorCenter";
})(ZoomType = exports.ZoomType || (exports.ZoomType = {}));
class ZoomManager {
    constructor(isZoomEnabled = false, zoomCanvas, zoomCallbacks, maxZoom, zoomScale) {
        this.minZoomScale = 1;
        this.maxZoomScale = 4;
        this.zoomScale = 0.1;
        this.pos = { top: 0, left: 0, x: 0, y: 0 };
        this.mouseDownHandler = (e) => {
            if (this.zoomCanvas) {
                document.getElementById('svgCanvas').style.cursor = 'grabbing';
                this.zoomCanvas.style.userSelect = 'none';
                this.pos = {
                    left: this.zoomCanvas.scrollLeft,
                    top: this.zoomCanvas.scrollTop,
                    x: e.clientX,
                    y: e.clientY,
                };
            }
        };
        this.mouseUpHandler = () => {
            if (this.zoomCanvas) {
                document.getElementById('svgCanvas').style.cursor = 'grab';
                this.zoomCanvas.style.removeProperty('user-select');
            }
        };
        this.mouseMoveHandler = (e) => {
            if (this.zoomCanvas && this.zoomCanvas.style.getPropertyValue('user-select')) {
                const dx = e.clientX - this.pos.x;
                const dy = e.clientY - this.pos.y;
                this.zoomCanvas.scrollTop = this.pos.top - dy;
                this.zoomCanvas.scrollLeft = this.pos.left - dx;
            }
        };
        this.isZoomEnabled = isZoomEnabled;
        this.zoomCanvas = zoomCanvas;
        this.maxZoomScale = maxZoom ? maxZoom : this.maxZoomScale;
        this.zoomScale = zoomScale ? zoomScale : this.zoomScale;
        this.currentZoomScale = this.minZoomScale;
        this.previousZoomScale = this.minZoomScale;
        this.callbacks = zoomCallbacks;
        this.shouldResetZoomOnContentLoad = false;
    }
    get resetZoomOnContentLoad() {
        return this.shouldResetZoomOnContentLoad;
    }
    set resetZoomOnContentLoad(reset) {
        this.shouldResetZoomOnContentLoad = reset;
        if (reset) {
            this.previousZoomScale = this.currentZoomScale = 1;
        }
    }
    ;
    static getInstance(isZoomEnabled = false, editorContainerDiv, zoomCallbacks, maxZoom, zoomScale) {
        if (!ZoomManager.instance) {
            ZoomManager.instance = new ZoomManager(isZoomEnabled, editorContainerDiv, zoomCallbacks, maxZoom, zoomScale);
        }
        return ZoomManager.instance;
    }
    updateZoomScale(zoomType, newScale) {
        this.previousZoomScale = this.currentZoomScale;
        const zoomData = this.getZoomData();
        let updatedZoomScale;
        if (newScale) {
            updatedZoomScale = newScale;
        }
        else {
            if (zoomType === ZoomDirection.In) {
                updatedZoomScale = this.currentZoomScale + this.zoomScale;
            }
            if (zoomType === ZoomDirection.Out) {
                updatedZoomScale = this.currentZoomScale - this.zoomScale;
            }
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
        return {
            minZoomScale: this.minZoomScale,
            maxZoomScale: this.maxZoomScale,
            currentZoomScale: this.currentZoomScale,
            previousZoomScale: this.previousZoomScale,
        };
    }
    deleteInstance() {
        if (ZoomManager.instance) {
            delete ZoomManager.instance;
        }
    }
    setDragging(activate) {
        this.isDraggingEnabled = activate;
        if (activate) {
            document.getElementById('svgCanvas').style.cursor = 'grab';
            this.zoomCanvas.addEventListener('mousemove', this.mouseMoveHandler);
            window.addEventListener('mousedown', this.mouseDownHandler);
            window.addEventListener('mouseup', this.mouseUpHandler);
        }
        else {
            document.getElementById('svgCanvas').style.cursor = 'var(--cursor-pointer)';
            this.zoomCanvas.style.removeProperty('user-select');
            this.zoomCanvas.removeEventListener('mousemove', this.mouseMoveHandler);
            window.removeEventListener('mousedown', this.mouseDownHandler);
            window.removeEventListener('mouseup', this.mouseUpHandler);
        }
    }
}
exports.ZoomManager = ZoomManager;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionsManager = void 0;
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const RegionData_1 = __webpack_require__(3);
const IRegionCallbacks_1 = __webpack_require__(2);
const ZoomManager_1 = __webpack_require__(23);
const PathRegion_1 = __webpack_require__(40);
const PointRegion_1 = __webpack_require__(27);
const PolygonRegion_1 = __webpack_require__(48);
const PolylineRegion_1 = __webpack_require__(51);
const RectRegion_1 = __webpack_require__(28);
const RegionMenu_1 = __webpack_require__(58);
class RegionsManager {
    constructor(svgHost, callbacks) {
        this.isFrozenState = false;
        this.isFocusedState = true;
        this.justManipulated = false;
        this.manipulationLock = false;
        this.tagsUpdateOptions = {
            showRegionBackground: true,
            showTagsText: true,
        };
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect_1.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
        this.regionAnnouncer = document.getElementById("regionAnnouncer");
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
    get isFocused() {
        return this.isFocusedState;
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
        else if (regionData.type === RegionData_1.RegionDataType.Path) {
            this.addPathRegion(id, regionData, tagsDescriptor);
        }
        this.sortRegionsByArea();
        if (this.regionAnnouncer) {
            this.regionAnnouncer.innerHTML = tagsDescriptor.toString();
        }
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
    addPathRegion(id, regionData, tagsDescriptor) {
        this.menu.hide();
        const region = new PathRegion_1.PathRegion(this.paper, this.paperRect, regionData, this.callbacks, id, tagsDescriptor, this.tagsUpdateOptions);
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
    updateRegionVisibility(shouldHideThisRegion, shouldShow) {
        this.regions.forEach((region) => {
            if (shouldHideThisRegion(region.tags, region)) {
                if (shouldShow) {
                    region.show();
                }
                else {
                    region.hide();
                }
            }
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
    focus() {
        this.isFocusedState = true;
    }
    unfocus() {
        this.isFocusedState = false;
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
    toggleTagsTextVisibility() {
        this.tagsUpdateOptions.showTagsText = !this.tagsUpdateOptions.showTagsText;
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
        const firstIndex = this.getIndexOfFirstSelectedRegion();
        if (this.regionSelectedAndValidNextRegion()) {
            region = this.regions[firstIndex + 1];
        }
        else if (this.noRegionSelectedAndValidFirstRegion()) {
            region = this.regions[0];
        }
        this.selectRegion(region);
    }
    selectPrevRegion() {
        let region = null;
        const firstIndex = this.getIndexOfFirstSelectedRegion();
        if (this.regionSelectedAndValidPrevRegion()) {
            region = this.regions[firstIndex - 1];
        }
        else if (this.noRegionSelectedAndValidFirstRegion()) {
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
            }
            this.callbacks.onRegionMoveEnd(region.ID, regionData);
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
                            if (this.isFocused) {
                                if (!e.shiftKey && this.shouldPreventTabDefault()) {
                                    this.selectNextRegion();
                                }
                                else if (e.shiftKey && this.shouldPreventShiftTabDefault()) {
                                    this.selectPrevRegion();
                                }
                            }
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
                    switch (e.key) {
                        case "a":
                        case "A":
                            if (e.ctrlKey) {
                                this.selectAllRegions();
                            }
                            break;
                        case "Tab":
                            if (this.isFocused) {
                                if (!e.shiftKey && this.shouldPreventTabDefault()) {
                                    e.preventDefault();
                                }
                                else if (e.shiftKey && this.shouldPreventShiftTabDefault()) {
                                    e.preventDefault();
                                }
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
    shouldPreventTabDefault() {
        const firstIndex = this.getIndexOfFirstSelectedRegion();
        return this.regionSelectedAndValidNextRegion() || this.noRegionSelectedAndValidFirstRegion();
    }
    regionSelectedAndValidNextRegion() {
        const firstIndex = this.getIndexOfFirstSelectedRegion();
        return (0 <= firstIndex) && (firstIndex < this.regions.length - 1);
    }
    shouldPreventShiftTabDefault() {
        const firstIndex = this.getIndexOfFirstSelectedRegion();
        return this.regionSelectedAndValidPrevRegion() || this.noRegionSelectedAndValidFirstRegion();
    }
    regionSelectedAndValidPrevRegion() {
        const firstIndex = this.getIndexOfFirstSelectedRegion();
        return (1 <= firstIndex);
    }
    noRegionSelectedAndValidFirstRegion() {
        const firstIndex = this.getIndexOfFirstSelectedRegion();
        return (firstIndex < 0) && (this.regions.length > 0);
    }
    getIndexOfFirstSelectedRegion() {
        let indexOfFirstSelectedRegion = -1;
        for (let i = 0; i < this.regions.length; i++) {
            if (this.regions[i].isSelected) {
                indexOfFirstSelectedRegion = i;
                break;
            }
        }
        return indexOfFirstSelectedRegion;
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionDataType = void 0;
var RegionDataType;
(function (RegionDataType) {
    RegionDataType["Point"] = "point";
    RegionDataType["Rect"] = "rect";
    RegionDataType["Polyline"] = "polyline";
    RegionDataType["Polygon"] = "polygon";
    RegionDataType["Path"] = "Path";
})(RegionDataType = exports.RegionDataType || (exports.RegionDataType = {}));


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DragElement = void 0;
const DragComponent_1 = __webpack_require__(12);
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PointRegion = void 0;
const Region_1 = __webpack_require__(6);
const DragElement_1 = __webpack_require__(46);
const TagsElement_1 = __webpack_require__(47);
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RectRegion = void 0;
const Rect_1 = __webpack_require__(1);
const Region_1 = __webpack_require__(6);
const AnchorsElements_1 = __webpack_require__(55);
const DragElement_1 = __webpack_require__(56);
const TagsElement_1 = __webpack_require__(57);
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaSelector = void 0;
const Rect_1 = __webpack_require__(1);
const ISelectorSettings_1 = __webpack_require__(17);
const PointSelector_1 = __webpack_require__(59);
const PolygonSelector_1 = __webpack_require__(60);
const PolylineSelector_1 = __webpack_require__(61);
const RectCopySelector_1 = __webpack_require__(62);
const RectSelector_1 = __webpack_require__(63);
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
                onNextSelectionPoint: null,
                onUnlocked: null,
            };
        }
        this.buildUIElements();
    }
    resize(width, height) {
        const [oldWidth, oldHeight] = [this.boundRect.width, this.boundRect.height];
        if (width !== undefined && height !== undefined) {
            this.boundRect.resize(width, height);
        }
        else {
            this.boundRect.resize(this.parentNode.width.baseVal.value, this.parentNode.height.baseVal.value);
        }
        if (this.selector !== null) {
            this.selector.resize(width, height, oldWidth, oldHeight);
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
    undo() {
        if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.POLYGON) {
            this.polygonSelector.undo();
        }
    }
    redo() {
        if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.POLYGON) {
            this.polygonSelector.redo();
        }
    }
    canRedo() {
        if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.POLYGON) {
            return this.polygonSelector.canRedo();
        }
        return false;
    }
    canUndo() {
        if (this.selectorSettings.mode === ISelectorSettings_1.SelectionMode.POLYGON) {
            return this.polygonSelector.canUndo();
        }
        return false;
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
    reset() {
        if (this.selector !== null) {
            this.selector.reset();
        }
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
exports.AreaSelector = AreaSelector;
AreaSelector.DefaultTemplateSize = new Rect_1.Rect(20, 20);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AlternatingCrossElement = void 0;
const CrossElement_1 = __webpack_require__(13);
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
        this.vl2.node.setAttribute("y2", height.toString());
        this.hl2.node.setAttribute("x2", width.toString());
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RectElement = void 0;
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const Element_1 = __webpack_require__(19);
class RectElement extends Element_1.Element {
    constructor(paper, boundRect, rect) {
        super(paper, boundRect);
        this.rect = new Rect_1.Rect(rect.width, rect.height);
        this.originPoint = new Point2D_1.Point2D(0, 0);
        this.buildUIElements();
        this.hide();
    }
    get x() {
        return this.originPoint.x;
    }
    get y() {
        return this.originPoint.y;
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
const Rect_1 = __webpack_require__(1);
const ToolbarIcon_1 = __webpack_require__(5);
const ToolbarSelect_1 = __webpack_require__(33);
const ToolbarSelectIcon_1 = __webpack_require__(64);
const ToolbarSeparator_1 = __webpack_require__(65);
const ToolbarSwitchIcon_1 = __webpack_require__(66);
const ToolbarTriggerIcon_1 = __webpack_require__(67);
class Toolbar {
    constructor(svgHost, isVertical = true) {
        this.iconSpace = 8;
        this.areHotKeysEnabled = true;
        this.isVertical = true;
        this.icons = new Array();
        this.isVertical = isVertical;
        this.buildUIElements(svgHost, isVertical);
    }
    addSelector(icon, actor) {
        const newIcon = new ToolbarSelectIcon_1.ToolbarSelectIcon(this.paper, icon, (action) => {
            this.select(action);
            actor(action);
        }, icon.action ? icon.action : undefined, icon.key ? icon.key : undefined);
        this.addIcon(newIcon);
    }
    addSwitch(icon, actor) {
        const newIcon = new ToolbarSwitchIcon_1.ToolbarSwitchIcon(this.paper, icon, (action) => {
            actor(action);
        }, icon.action ? icon.action : undefined, icon.key ? icon.key : undefined);
        this.addIcon(newIcon);
    }
    addSeparator() {
        const newIcon = new ToolbarSeparator_1.ToolbarSeparator(this.paper, ToolbarIcon_1.ToolbarIcon.IconWidth, this.isVertical);
        this.addIcon(newIcon);
    }
    addTrigger(icon, actor) {
        const newIcon = new ToolbarTriggerIcon_1.ToolbarTriggerIcon(this.paper, icon, (action) => {
            actor(action);
        }, icon.action ? icon.action : undefined, icon.key ? icon.key : undefined);
        this.addIcon(newIcon);
    }
    select(action) {
        this.icons.forEach((icon) => {
            if (icon instanceof ToolbarSelect_1.ToolbarSelect) {
                if (icon.action !== action) {
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
    buildUIElements(svgHost, isVertical) {
        this.baseParent = svgHost;
        this.paper = Snap(svgHost);
        this.paperRect = new Rect_1.Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
        const toolbarGroup = this.paper.g();
        toolbarGroup.addClass("toolbarLayer");
        this.recalculateToolbarSize(isVertical);
        this.backgroundRect = this.paper.rect(0, 0, this.toolbarWidth, this.toolbarHeight);
        this.backgroundRect.addClass("toolbarBGStyle");
        toolbarGroup.add(this.backgroundRect);
        this.iconsLayer = this.paper.g();
        this.iconsLayer.addClass("iconsLayerStyle");
        toolbarGroup.add(this.iconsLayer);
        this.subscribeToKeyboardEvents();
    }
    recalculateToolbarSize(isVertical, newIcon) {
        if (isVertical) {
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
        else {
            if (newIcon === undefined) {
                this.toolbarHeight = ToolbarIcon_1.ToolbarIcon.IconHeight + 2 * this.iconSpace;
                this.toolbarWidth = this.icons.length * (ToolbarIcon_1.ToolbarIcon.IconWidth + this.iconSpace) + this.iconSpace;
            }
            else {
                const height = newIcon.height + 2 * this.iconSpace;
                if (height > this.toolbarHeight) {
                    this.toolbarHeight = height;
                }
                this.toolbarWidth = this.toolbarWidth + newIcon.width + this.iconSpace;
            }
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
        if (this.isVertical) {
            newIcon.move(this.iconSpace, this.toolbarHeight + this.iconSpace);
        }
        else {
            newIcon.move(this.toolbarWidth + this.iconSpace, this.iconSpace);
        }
        this.recalculateToolbarSize(this.isVertical, newIcon);
        this.updateToolbarSize();
    }
    findIconByKey(key) {
        return this.icons.find((icon) => { if (icon.key) {
            return icon.key.includes(key);
        } });
    }
    findIconByAction(action) {
        return this.icons.find((icon) => {
            return icon.action !== null && icon.action === action;
        });
    }
    findFocusedIcon() {
        return this.icons.find((icon) => {
            return icon.isFocused();
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
                if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    const icon = this.findFocusedIcon();
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarSelect = void 0;
class ToolbarSelect {
    constructor(onAction, action, key) {
        this.focused = false;
        this.isSelected = false;
        this.onfocusCallback = () => {
            this.focused = true;
        };
        this.onfocusoutCallback = () => {
            this.focused = false;
        };
        this.onAction = onAction;
        this.action = action;
        this.key = key;
    }
    select() {
        this.isSelected = true;
    }
    unselect() {
        this.isSelected = false;
    }
    activate() {
        if (this.action) {
            this.onAction(this.action);
            this.select();
        }
    }
    isFocused() {
        return this.focused;
    }
}
exports.ToolbarSelect = ToolbarSelect;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
const Color_1 = __webpack_require__(20);
const HSLColor_1 = __webpack_require__(14);
const LABColor_1 = __webpack_require__(10);
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasTools = void 0;
const CanvasTools_Editor_1 = __webpack_require__(36);
const CanvasTools_Filter_1 = __webpack_require__(22);
const Color_1 = __webpack_require__(20);
const HSLColor_1 = __webpack_require__(14);
const LABColor_1 = __webpack_require__(10);
const Palette_1 = __webpack_require__(69);
const RGBColor_1 = __webpack_require__(15);
const XYZColor_1 = __webpack_require__(16);
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const RegionData_1 = __webpack_require__(3);
const Tag_1 = __webpack_require__(34);
const TagsDescriptor_1 = __webpack_require__(70);
const ISelectorSettings_1 = __webpack_require__(17);
const PointRegion_1 = __webpack_require__(27);
const RectRegion_1 = __webpack_require__(28);
const RegionsManager_1 = __webpack_require__(24);
const AreaSelector_1 = __webpack_require__(29);
const Toolbar_1 = __webpack_require__(32);
__webpack_require__(71);
class CanvasTools {
}
exports.CanvasTools = CanvasTools;
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
__webpack_require__(73);


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const CanvasTools_Filter_1 = __webpack_require__(22);
const ConfigurationManager_1 = __webpack_require__(11);
const Rect_1 = __webpack_require__(1);
const ZoomManager_1 = __webpack_require__(23);
const ISelectorSettings_1 = __webpack_require__(17);
const RegionsManager_1 = __webpack_require__(24);
const AreaSelector_1 = __webpack_require__(29);
const Toolbar_1 = __webpack_require__(32);
const ToolbarAction_1 = __webpack_require__(68);
const ToolbarIcon_1 = __webpack_require__(5);
;
class Editor {
    constructor(container, areaSelector, regionsManager, filterPipeline, zoomProperties) {
        this.autoResize = true;
        this.isRMFrozen = false;
        this.contentCanvas = this.createCanvasElement();
        this.editorSVG = this.createSVGElement();
        this.editorSVG.setAttribute('id', 'svgCanvas');
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
            onNextSelectionPoint: (point) => {
                if (typeof this.onNextSelectionPoint === "function") {
                    this.onNextSelectionPoint(point);
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
            onZoomingOut: (cursorPos) => {
                this.onZoom(ZoomManager_1.ZoomDirection.Out, undefined, cursorPos);
            },
            onZoomingIn: (cursorPos) => {
                this.onZoom(ZoomManager_1.ZoomDirection.In, undefined, cursorPos);
            },
            getZoomLevel: () => {
                return this.zoomManager.getZoomData().currentZoomScale;
            },
            setZoomLevel: (newZoomScale) => {
                this.onZoom(ZoomManager_1.ZoomDirection.In, newZoomScale);
                return this.zoomManager.getZoomData();
            },
            toggleDragging: () => {
                if (!this.zoomManager.isDraggingEnabled) {
                    this.AS.setSelectionMode(ISelectorSettings_1.SelectionMode.NONE);
                    this.RM.freeze();
                    this.zoomManager.setDragging(true);
                }
                else {
                    this.regionsManager.unfreeze();
                    this.zoomManager.setDragging(false);
                }
            },
            onEndDragging: () => {
                this.regionsManager.unfreeze();
                this.zoomManager.setDragging(false);
            }
        };
        this.zoomManager = ZoomManager_1.ZoomManager.getInstance(false, this.editorContainerDiv, initZoomCallbacks);
        this.zoomManager.deleteInstance();
        this.zoomManager = ZoomManager_1.ZoomManager.getInstance(false, this.editorContainerDiv, initZoomCallbacks);
        if (zoomProperties && zoomProperties.isZoomEnabled) {
            this.zoomManager.isZoomEnabled = true;
            this.zoomManager.zoomType = zoomProperties.zoomType || ZoomManager_1.ZoomType.Default;
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
        const regionAnnouncer = document.createElement("div");
        regionAnnouncer.setAttribute("aria-live", "assertive");
        regionAnnouncer.setAttribute("tabindex", "-1");
        regionAnnouncer.id = "regionAnnouncer";
        container.appendChild(regionAnnouncer);
    }
    get api() {
        return this.mergedAPI;
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
    set isModifyRegionOnlyMode(value) {
        ConfigurationManager_1.ConfigurationManager.isModifyRegionOnlyMode = value;
    }
    get isModifyRegionOnlyMode() {
        return ConfigurationManager_1.ConfigurationManager.isModifyRegionOnlyMode;
    }
    get getFrameSize() {
        return [this.frameWidth, this.frameHeight];
    }
    addToolbar(container, toolbarSet, iconsPath, isVertical = true) {
        const svg = this.createSVGElement();
        container.append(svg);
        this.toolbar = new Toolbar_1.Toolbar(svg, isVertical);
        if (toolbarSet === null || toolbarSet === undefined) {
            toolbarSet = Editor.FullToolbarSet;
        }
        if (this.zoomManager.isZoomEnabled) {
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
        return this.filterPipeline
            .applyToCanvas(buffCnvs)
            .then((bcnvs) => {
            this.contentCanvas.width = bcnvs.width;
            this.contentCanvas.height = bcnvs.height;
            const imgContext = this.contentCanvas.getContext("2d");
            imgContext.drawImage(bcnvs, 0, 0, bcnvs.width, bcnvs.height);
        })
            .then(() => {
            this.resize(this.editorContainerDiv.offsetWidth, this.editorContainerDiv.offsetHeight);
            this.handleZoomAfterContentUpdate();
        });
    }
    enablePathRegions(enable) {
        ConfigurationManager_1.ConfigurationManager.isPathRegionEnabled = enable;
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
    scaleRegionToSourceSize(regionData, sourceWidth, sourceHeight) {
        const sw = sourceWidth !== undefined ? sourceWidth : this.sourceWidth;
        const sh = sourceHeight !== undefined ? sourceHeight : this.sourceHeight;
        const xf = sw / this.frameWidth;
        const yf = sh / this.frameHeight;
        const rd = regionData.copy();
        rd.scale(xf, yf);
        return rd;
    }
    scaleRegionToFrameSize(regionData, sourceWidth, sourceHeight) {
        const sw = sourceWidth !== undefined ? sourceWidth : this.sourceWidth;
        const sh = sourceHeight !== undefined ? sourceHeight : this.sourceHeight;
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
    onZoom(zoomType, newScale, cursorPos) {
        if (!this.zoomManager.isZoomEnabled) {
            throw new Error("Zoom feature is not enabled");
        }
        const zoomData = this.zoomManager.updateZoomScale(zoomType, newScale);
        if (zoomData) {
            const scaledFrameWidth = (this.frameWidth / zoomData.previousZoomScale) * zoomData.currentZoomScale;
            const scaledFrameHeight = (this.frameHeight / zoomData.previousZoomScale) * zoomData.currentZoomScale;
            this.frameWidth = scaledFrameWidth;
            this.frameHeight = scaledFrameHeight;
            this.zoomEditorToScale(scaledFrameWidth, scaledFrameHeight, zoomData, cursorPos);
            this.areaSelector.resize(scaledFrameWidth, scaledFrameHeight);
            this.regionsManager.resize(scaledFrameWidth, scaledFrameHeight);
            const regions = this.regionsManager.getSelectedRegionsWithZoomScale();
            this.areaSelector.updateRectCopyTemplateSelector(this.areaSelector.getRectCopyTemplate(regions));
            if (typeof this.onZoomEnd === "function") {
                this.onZoomEnd(zoomData);
            }
        }
    }
    handleZoomAfterContentUpdate() {
        if (this.zoomManager.isZoomEnabled) {
            const zoomData = this.zoomManager.getZoomData();
            const scaledFrameWidth = this.frameWidth * zoomData.currentZoomScale;
            const scaledFrameHeight = this.frameHeight * zoomData.currentZoomScale;
            this.frameWidth = scaledFrameWidth;
            this.frameHeight = scaledFrameHeight;
            this.zoomEditorToScale(scaledFrameWidth, scaledFrameHeight, zoomData);
            this.areaSelector.resize(scaledFrameWidth, scaledFrameHeight);
            this.regionsManager.resize(scaledFrameWidth, scaledFrameHeight);
        }
    }
    zoomEditorToScale(scaledFrameWidth, scaledFrameHeight, zoomData, cursorPos) {
        if (!this.editorContainerDiv && !this.editorContainerDiv.offsetWidth) {
            this.editorContainerDiv = document.getElementsByClassName("CanvasToolsContainer")[0];
            this.editorDiv = document.getElementsByClassName("CanvasToolsEditor")[0];
        }
        if (this.editorContainerDiv) {
            this.editorContainerDiv.style.overflow = zoomData.currentZoomScale === 1 ? "hidden" : "auto";
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
            if (this.zoomManager.zoomType === ZoomManager_1.ZoomType.ImageCenter) {
                if (this.editorContainerDiv.scrollHeight > this.editorContainerDiv.clientHeight) {
                    this.editorContainerDiv.scrollTop =
                        (this.editorDiv.clientHeight - this.editorContainerDiv.clientHeight) / 2;
                }
                if (this.editorContainerDiv.scrollWidth > this.editorContainerDiv.clientWidth) {
                    this.editorContainerDiv.scrollLeft =
                        (this.editorDiv.clientWidth - this.editorContainerDiv.clientWidth) / 2;
                }
            }
            if (this.zoomManager.zoomType === ZoomManager_1.ZoomType.CursorCenter && cursorPos) {
                const currentScrollPos = {
                    left: this.editorContainerDiv.scrollLeft,
                    top: this.editorContainerDiv.scrollTop,
                };
                const mousePos = {
                    x: cursorPos.x,
                    y: cursorPos.y
                };
                const scaledMousePos = {
                    x: (mousePos.x / zoomData.previousZoomScale) * zoomData.currentZoomScale,
                    y: (mousePos.y / zoomData.previousZoomScale) * zoomData.currentZoomScale
                };
                const expectedScrollPosDifference = {
                    left: scaledMousePos.x - mousePos.x,
                    top: scaledMousePos.y - mousePos.y,
                };
                const expectedScrollPos = {
                    left: currentScrollPos.left + expectedScrollPosDifference.left,
                    top: currentScrollPos.top + expectedScrollPosDifference.top,
                };
                this.editorContainerDiv.scrollLeft = expectedScrollPos.left;
                this.editorContainerDiv.scrollTop = expectedScrollPos.top;
            }
            if (this.zoomManager.zoomType === ZoomManager_1.ZoomType.ViewportCenter || !cursorPos) {
                const currentScrollPos = {
                    left: this.editorContainerDiv.scrollLeft,
                    top: this.editorContainerDiv.scrollTop,
                };
                const currentCenterInView = {
                    x: this.editorContainerDiv.clientWidth / 2 + currentScrollPos.left,
                    y: this.editorContainerDiv.clientHeight / 2 + currentScrollPos.top,
                };
                const zoomedCenterInView = {
                    x: (currentCenterInView.x / zoomData.previousZoomScale) * zoomData.currentZoomScale,
                    y: (currentCenterInView.y / zoomData.previousZoomScale) * zoomData.currentZoomScale
                };
                const expectedScrollPosDifference = {
                    left: zoomedCenterInView.x - currentCenterInView.x,
                    top: zoomedCenterInView.y - currentCenterInView.y,
                };
                const expectedScrollPos = {
                    left: currentScrollPos.left + expectedScrollPosDifference.left,
                    top: currentScrollPos.top + expectedScrollPosDifference.top,
                };
                this.editorContainerDiv.scrollLeft = expectedScrollPos.left;
                this.editorContainerDiv.scrollTop = expectedScrollPos.top;
            }
        }
    }
    subscribeToEvents() {
        window.addEventListener("resize", (e) => {
            if (this.autoResize) {
                this.resize(this.editorContainerDiv.offsetWidth, this.editorContainerDiv.offsetHeight);
                this.handleZoomAfterContentUpdate();
            }
        });
    }
}
exports.Editor = Editor;
Editor.FullToolbarSet = [
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: ToolbarAction_1.ToolbarAction.NONE,
        iconFile: "none-selection.svg",
        tooltip: "Regions Manipulation (M)",
        key: ["M", "m"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.NONE });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: ToolbarAction_1.ToolbarAction.POINT,
        iconFile: "point-selection.svg",
        tooltip: "Point-selection (P)",
        key: ["P", "p"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POINT });
            sl.show();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: ToolbarAction_1.ToolbarAction.RECT,
        iconFile: "rect-selection.svg",
        tooltip: "Rectangular box (R)",
        key: ["R", "r"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.RECT });
            sl.show();
        },
        activate: true,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: ToolbarAction_1.ToolbarAction.COPY,
        iconFile: "copy-t-selection.svg",
        tooltip: "Template-based box (T)",
        key: ["T", "t"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
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
        action: ToolbarAction_1.ToolbarAction.POLYLINE,
        iconFile: "polyline-selection.svg",
        tooltip: "Polyline-selection (Y)",
        key: ["Y", "y"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POLYLINE });
            sl.show();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: ToolbarAction_1.ToolbarAction.POLYGON,
        iconFile: "polygon-selection.svg",
        tooltip: "Polygon-selection (O)",
        key: ["O", "o"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
            ConfigurationManager_1.ConfigurationManager.isModifyRegionOnlyMode = false;
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POLYGON });
            sl.show();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: ToolbarAction_1.ToolbarAction.ADD_REMOVE_POINTS,
        iconFile: "pointer-add-polygon-point.svg",
        tooltip: "Polygon add/remove points (U)",
        key: ["U", "u"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
            if (!ConfigurationManager_1.ConfigurationManager.isModifyRegionOnlyMode) {
                ConfigurationManager_1.ConfigurationManager.isModifyRegionOnlyMode = true;
                sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.POLYGON });
                sl.show();
            }
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.TRIGGER,
        action: ToolbarAction_1.ToolbarAction.DELETE_ALL,
        iconFile: "delete-all-selection.svg",
        tooltip: "Delete all regions",
        key: ["D", "d"],
        actionCallback: (action, rm, sl, zm) => {
            rm.deleteAllRegions();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SWITCH,
        action: ToolbarAction_1.ToolbarAction.SELECTION_LOCK,
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
        action: ToolbarAction_1.ToolbarAction.BACKGROUND_TOGGLE,
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
        action: ToolbarAction_1.ToolbarAction.NONE,
        iconFile: "none-selection.svg",
        tooltip: "Regions Manipulation (M)",
        key: ["M", "m"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.NONE });
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: ToolbarAction_1.ToolbarAction.RECT,
        iconFile: "rect-selection.svg",
        tooltip: "Rectangular box (R)",
        key: ["R", "r"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
            sl.setSelectionMode({ mode: ISelectorSettings_1.SelectionMode.RECT });
            sl.show();
        },
        activate: true,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SELECTOR,
        action: ToolbarAction_1.ToolbarAction.COPY,
        iconFile: "copy-t-selection.svg",
        tooltip: "Template-based box (T)",
        key: ["T", "t"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onEndDragging();
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
        action: ToolbarAction_1.ToolbarAction.DELETE_ALL,
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
        action: ToolbarAction_1.ToolbarAction.SELECTION_LOCK,
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
        action: ToolbarAction_1.ToolbarAction.BACKGROUND_TOGGLE,
        iconFile: "background-toggle.svg",
        tooltip: "Toggle Region Background (B)",
        key: ["B", "b"],
        actionCallback: (action, rm, sl) => {
            rm.toggleBackground();
        },
        activate: false,
    },
];
Editor.ZoomIconGroupToolbar = [
    {
        type: ToolbarIcon_1.ToolbarItemType.TRIGGER,
        action: ToolbarAction_1.ToolbarAction.ZOOM_IN,
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
        action: ToolbarAction_1.ToolbarAction.ZOOM_OUT,
        iconFile: "zoom-out.svg",
        tooltip: "Zoom out (-)",
        key: ["-"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.onZoomingOut();
        },
        activate: false,
    },
    {
        type: ToolbarIcon_1.ToolbarItemType.SWITCH,
        action: ToolbarAction_1.ToolbarAction.ZOOM_DRAG,
        iconFile: "zoom-drag.svg",
        tooltip: "Dragging for zoom-in (U)",
        key: ["Z", "z"],
        actionCallback: (action, rm, sl, zm) => {
            zm.callbacks.toggleDragging();
        },
        activate: false,
    },
];
Editor.SeparatorIconGroupToolbar = [
    {
        type: ToolbarIcon_1.ToolbarItemType.SEPARATOR,
    },
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


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLineSegments = void 0;
const RegionDataType_1 = __webpack_require__(25);
function getPointsAlongLines(start, xLength, yLength) {
    return {
        oneThird: {
            x: start.x + xLength / 3,
            y: start.y + yLength / 3,
        },
        half: {
            x: start.x + xLength / 2,
            y: start.y + yLength / 2,
        },
        twoThird: {
            x: start.x + (2 * xLength) / 3,
            y: start.y + (2 * yLength) / 3,
        },
    };
}
function createLineSegment(start, end) {
    const xLength = end.x - start.x;
    const yLength = end.y - start.y;
    return {
        start,
        end,
        xLength,
        yLength,
        pointsAlongLine: getPointsAlongLines(start, xLength, yLength),
    };
}
function calculateLineSegments(points, options) {
    if (points.length < 2) {
        return [];
    }
    if (points.length === 2) {
        return [createLineSegment(points[0], points[1])];
    }
    const segments = [];
    const pointsLength = points.length;
    const loopLength = pointsLength - 1;
    for (let i = 0; i < loopLength; i++) {
        const nextPointIdx = i + 1;
        if (nextPointIdx < pointsLength) {
            segments.push(createLineSegment(points[i], points[nextPointIdx]));
        }
    }
    if ([RegionDataType_1.RegionDataType.Polygon, RegionDataType_1.RegionDataType.Path].includes(options === null || options === void 0 ? void 0 : options.regionType)) {
        segments.push(createLineSegment(points[pointsLength - 1], points[0]));
    }
    return segments;
}
exports.calculateLineSegments = calculateLineSegments;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CubicBezierIndex = void 0;
const CubicBezierControl_1 = __webpack_require__(18);
const mapIndexRecord_1 = __webpack_require__(39);
function buildCopy(controls) {
    const record = mapIndexRecord_1.mapIndexRecord(controls, (c) => new CubicBezierControl_1.CubicBezierControl(c));
    return new CubicBezierIndex(record);
}
function modifyControlPoints(controls, modifyPoint) {
    return new CubicBezierIndex(mapIndexRecord_1.mapIndexRecord(controls, (c) => new CubicBezierControl_1.CubicBezierControl({ c1: modifyPoint(c.c1), c2: modifyPoint(c.c2) })));
}
class CubicBezierIndex {
    static buildFromJSON(controls) {
        return buildCopy(controls);
    }
    constructor(controls) {
        if (controls) {
            Object.entries(controls).forEach(([idx, control]) => {
                const iIdx = Number(idx);
                if (Number.isSafeInteger(iIdx)) {
                    this[iIdx] = control;
                }
            });
        }
    }
    copy() {
        return buildCopy(this);
    }
    scale(scalePoint) {
        return modifyControlPoints(this, scalePoint);
    }
    move(movePoint) {
        return modifyControlPoints(this, movePoint);
    }
    shift(dx, dy) {
        return new CubicBezierIndex(mapIndexRecord_1.mapIndexRecord(this, (c) => {
            const control = c.copy();
            control.shift(dx, dy);
            return control;
        }));
    }
    boundToRect(rect) {
        return new CubicBezierIndex(mapIndexRecord_1.mapIndexRecord(this, (c) => c.boundToRect(rect)));
    }
    toJSON() {
        return mapIndexRecord_1.mapIndexRecord(this, (c) => c.toJSON());
    }
    forEach(fn) {
        mapIndexRecord_1.mapIndexRecord(this, fn);
    }
}
exports.CubicBezierIndex = CubicBezierIndex;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.mapIndexRecord = void 0;
function mapIndexRecord(record, mapFn) {
    const next = {};
    Object.entries(record).forEach(([idx, c]) => {
        const iIdx = Number(idx);
        if (Number.isSafeInteger(iIdx)) {
            next[iIdx] = mapFn(c, iIdx);
        }
    });
    return next;
}
exports.mapIndexRecord = mapIndexRecord;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PathRegion = void 0;
const Rect_1 = __webpack_require__(1);
const DragElement_1 = __webpack_require__(26);
const Region_1 = __webpack_require__(6);
const AnchorsElement_1 = __webpack_require__(41);
const MidpointElement_1 = __webpack_require__(43);
const TagsElement_1 = __webpack_require__(45);
class PathRegion extends Region_1.Region {
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
        this.midpointNode = new MidpointElement_1.MidpointElement(paper, this.paperRect, this.regionData, this.callbacks);
        this.toolTip = Snap.parse(`<title>${(this.tags !== null) ? this.tags.toString() : ""}</title>`);
        this.node.append(this.toolTip);
        this.node.add(this.dragNode.node);
        this.node.add(this.tagsNode.node);
        this.node.add(this.anchorNode.node);
        this.node.add(this.midpointNode.node);
        this.UI.push(this.tagsNode, this.dragNode, this.anchorNode, this.midpointNode);
    }
}
exports.PathRegion = PathRegion;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorsElement = void 0;
const ConfigurationManager_1 = __webpack_require__(11);
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(2);
const AnchorsComponent_1 = __webpack_require__(7);
const BezierController_1 = __webpack_require__(42);
var GhostAnchorAction;
(function (GhostAnchorAction) {
    GhostAnchorAction["Add"] = "add";
    GhostAnchorAction["Delete"] = "delete";
    GhostAnchorAction["None"] = "";
})(GhostAnchorAction || (GhostAnchorAction = {}));
class AnchorsElement extends AnchorsComponent_1.AnchorsComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.ghostAnchorActionState = GhostAnchorAction.None;
        this.anchorsLength = regionData.points.length;
        const bezierController = new BezierController_1.BezierController(this, paper, paperRect, regionData, this.anchorsNode, callbacks, this.createAnchor.bind(this), this.subscribeToEvents.bind(this));
        bezierController.buildAnchors();
        this.mixins.push(bezierController);
    }
    set ghostAnchorAction(newValue) {
        this.ghostAnchor.removeClass("add");
        this.ghostAnchor.removeClass("delete");
        this.ghostAnchor.addClass(newValue);
        this.ghostAnchorActionState = newValue;
    }
    get ghostAnchorAction() {
        return this.ghostAnchorActionState;
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
            this.updateAnchorLines();
        }
        this.mixins.forEach((m) => m.redraw());
    }
    buildAnchors() {
        this.buildAnchorLines();
        super.buildAnchors();
    }
    buildAnchorLines() {
        const g = this.paper.g();
        g.addClass("anchorLineStyle");
        this.anchorsPolyline = g;
        this.regionData.toLinePathSegments().forEach((segment, idx) => {
            const path = this.paper.path(segment);
            g.add(path);
            this.subscribeLineToEvents(path, idx);
        });
        this.anchorsNode.add(this.anchorsPolyline);
    }
    updateAnchorLines() {
        this.anchorsPolyline.remove();
        this.buildAnchorLines();
    }
    subscribeLineToEvents(anchor, index) {
        this.subscribeToEvents([
            {
                base: anchor.node,
                event: "pointermove",
                listener: (e) => {
                    if (this.isModifyRegionOnlyModeEnabled(e)) {
                        this.activeAnchorIndex = -1;
                        const anchorPoint = this.getActiveAnchorPoint(e);
                        this.ghostAnchorLineIdx = index;
                        this.dragOrigin = anchorPoint;
                        this.ghostAnchorAction = GhostAnchorAction.Add;
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                cx: anchorPoint.x,
                                cy: anchorPoint.y,
                                display: "block",
                            });
                        });
                    }
                    else {
                        this.ghostAnchorAction = GhostAnchorAction.None;
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
        if (this.isModifyRegionOnlyModeEnabled(e)) {
            if (this.regionData.points.length <= AnchorsElement.MIN_NUMBERS_OF_POINTS_PER_POLYGON) {
                this.ghostAnchorAction = GhostAnchorAction.Delete;
            }
        }
        else {
            this.ghostAnchorAction = GhostAnchorAction.None;
        }
        super.onGhostPointerEnter(e);
    }
    onGhostPointerMove(e) {
        if (this.isModifyRegionOnlyModeEnabled(e) && this.activeAnchorIndex !== 0) {
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
            if (this.activeAnchorIndex <= 0 && !swapToDelete) {
                this.ghostAnchorAction = GhostAnchorAction.Add;
                this.activeAnchorIndex = -1;
            }
            else if (this.regionData.points.length > AnchorsElement.MIN_NUMBERS_OF_POINTS_PER_POLYGON &&
                swapToDelete) {
                this.activeAnchorIndex = index + 1;
                this.ghostAnchorAction = GhostAnchorAction.Delete;
            }
        }
        else {
            this.ghostAnchorAction = GhostAnchorAction.None;
        }
        super.onGhostPointerMove(e);
    }
    onGhostPointerUp(e) {
        const rd = this.regionData.copy();
        if (this.ghostAnchorAction === GhostAnchorAction.Delete) {
            if (this.activeAnchorIndex > 0 && this.activeAnchorIndex <= this.regionData.points.length) {
                rd.splicePoints(this.activeAnchorIndex - 1, 1);
            }
            this.ghostAnchorAction = GhostAnchorAction.None;
            this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVEEND);
        }
        else if (this.ghostAnchorAction === GhostAnchorAction.Add) {
            const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
            const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
            const point = new Point2D_1.Point2D(offsetX, offsetY);
            const index = this.ghostAnchorLineIdx;
            rd.splicePoints(index + 1, 0, point);
            this.ghostAnchorAction = GhostAnchorAction.Delete;
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
    isModifyRegionOnlyModeEnabled(event) {
        return ConfigurationManager_1.ConfigurationManager.isModifyRegionOnlyMode || (event === null || event === void 0 ? void 0 : event.ctrlKey);
    }
}
exports.AnchorsElement = AnchorsElement;
AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD = 5;
AnchorsElement.MIN_NUMBERS_OF_POINTS_PER_POLYGON = 3;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BezierController = void 0;
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(2);
const AnchorsComponent_1 = __webpack_require__(7);
const DEFAULT_RADIUS = 6;
class BezierController {
    constructor(anchorComponent, paper, paperRect, regionData, anchorsNode, callbacks, createAnchor, subscribeToEvents) {
        this.anchorComponent = anchorComponent;
        this.paper = paper;
        this.paperRect = paperRect;
        this.regionData = regionData;
        this.anchorsNode = anchorsNode;
        this.callbacks = callbacks;
        this.createAnchor = createAnchor;
        this.subscribeToEvents = subscribeToEvents;
        this.isDragged = false;
        this.controlPoints = [];
    }
    buildAnchors() {
        this.buildControlPoints();
        this.controlGhostAnchor = this.createAnchor(this.paper, 0, 0, "ghost", AnchorsComponent_1.AnchorsComponent.DEFAULT_GHOST_ANCHOR_RADIUS);
        this.controlGhostAnchor.attr({
            display: "none",
        });
        this.anchorComponent.node.add(this.controlGhostAnchor);
        this.subscribeControlGhostToEvents(this.controlGhostAnchor);
    }
    redraw() {
        this.updateControlPoints();
    }
    updateControlPoints() {
        this.controlPoints.forEach((cp) => {
            cp.remove();
        });
        this.controlPoints = [];
        this.buildControlPoints();
    }
    subscribeControlPointToEvents(controlPoint, index, controlPointName) {
        this.subscribeToEvents([
            {
                event: "pointerenter",
                base: controlPoint.node,
                listener: () => {
                    this.activeControlPointId = { index, name: controlPointName };
                    const controlPoint = this.getActiveControlPoint();
                    if (controlPoint) {
                        window.requestAnimationFrame(() => {
                            this.controlGhostAnchor.attr({
                                cx: controlPoint.x,
                                cy: controlPoint.y,
                                display: "block",
                            });
                        });
                    }
                },
                bypass: false,
            },
        ]);
    }
    createControlPoint(paper, x, y, r = DEFAULT_RADIUS) {
        const point = paper.circle(x, y, r);
        point.addClass("bezierControlPointStyle");
        return point;
    }
    createControlPointTangent(paper, polylinePoints) {
        const line = paper.polyline(polylinePoints);
        line.addClass("bezierControlPointTangentStyle");
        return line;
    }
    createControlPointGroup(index, line, control, pointName) {
        const g = this.paper.g();
        const pointBase = pointName === "c1" ? line.start : line.end;
        const controlPoint = control[pointName];
        const controlPointElem = this.createControlPoint(this.paper, controlPoint.x, controlPoint.y);
        const controlPointTangentElem = this.createControlPointTangent(this.paper, [
            pointBase.x,
            pointBase.y,
            controlPoint.x,
            controlPoint.y,
        ]);
        g.add(controlPointTangentElem);
        g.add(controlPointElem);
        this.subscribeControlPointToEvents(controlPointElem, index, pointName);
        return g;
    }
    buildControlPoints() {
        const lineSegments = this.regionData.getLineSegments();
        this.regionData.bezierControls.forEach((control, index) => {
            const line = lineSegments[index];
            const c1Group = this.createControlPointGroup(index, line, control, "c1");
            this.anchorsNode.add(c1Group);
            const c2Group = this.createControlPointGroup(index, line, control, "c2");
            this.anchorsNode.add(c2Group);
            this.controlPoints.push(c1Group, c2Group);
        });
    }
    subscribeControlGhostToEvents(controlGhostAnchor) {
        const listeners = [
            {
                event: "pointerleave",
                base: controlGhostAnchor.node,
                listener: (e) => {
                    if (!this.isDragged) {
                        window.requestAnimationFrame(() => {
                            this.controlGhostAnchor.attr({
                                display: "none",
                            });
                        });
                    }
                },
                bypass: true,
            },
            {
                event: "pointermove",
                base: controlGhostAnchor.node,
                listener: (e) => {
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
                        if (this.activeControlPointId) {
                            const controlPoint = this.getActiveControlPoint();
                            let p = new Point2D_1.Point2D(controlPoint.x + dx, controlPoint.y + dy);
                            if (this.paperRect !== null) {
                                p = p.boundToRect(this.paperRect);
                            }
                            window.requestAnimationFrame(() => {
                                this.controlGhostAnchor.attr({ cx: p.x, cy: p.y });
                            });
                            this.updateRegion(p);
                        }
                        this.dragOrigin = new Point2D_1.Point2D(offsetX, offsetY);
                    }
                },
                bypass: false,
            },
            {
                event: "pointerdown",
                base: controlGhostAnchor.node,
                listener: (e) => {
                    this.controlGhostAnchor.node.setPointerCapture(e.pointerId);
                    const offsetX = e.clientX - e.target.closest("svg").getBoundingClientRect().left;
                    const offsetY = e.clientY - e.target.closest("svg").getBoundingClientRect().top;
                    this.dragOrigin = new Point2D_1.Point2D(offsetX, offsetY);
                    this.isDragged = true;
                    this.callbacks.onManipulationLockRequest(this.anchorComponent);
                    this.callbacks.onChange(this.anchorComponent, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEBEGIN);
                },
                bypass: false,
            },
            {
                event: "pointerup",
                base: controlGhostAnchor.node,
                listener: (e) => {
                    this.controlGhostAnchor.node.releasePointerCapture(e.pointerId);
                    this.callbacks.onManipulationLockRelease(this.anchorComponent);
                    this.callbacks.onChange(this.anchorComponent, this.regionData.copy(), IRegionCallbacks_1.ChangeEventType.MOVEEND);
                    this.activeControlPointId = undefined;
                    this.dragOrigin = null;
                    this.isDragged = false;
                    window.requestAnimationFrame(() => {
                        this.controlGhostAnchor.attr({
                            display: "none",
                        });
                    });
                },
                bypass: false,
            },
        ];
        this.subscribeToEvents(listeners);
    }
    getActiveControlPoint() {
        if (this.activeControlPointId) {
            return this.regionData.bezierControls[this.activeControlPointId.index][this.activeControlPointId.name];
        }
        else {
            return null;
        }
    }
    updateRegion(p) {
        if (this.activeControlPointId) {
            const rd = this.regionData.copy();
            if (this.activeControlPointId) {
                const control = rd.bezierControls[this.activeControlPointId.index];
                if (control) {
                    control[this.activeControlPointId.name].move(p);
                    rd.setBezierControl(this.activeControlPointId.index, control);
                }
            }
            this.callbacks.onChange(this.anchorComponent, rd, IRegionCallbacks_1.ChangeEventType.MOVING);
        }
    }
}
exports.BezierController = BezierController;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MidpointElement = void 0;
const CubicBezierControl_1 = __webpack_require__(18);
const MidpointComponent_1 = __webpack_require__(44);
class MidpointElement extends MidpointComponent_1.MidpointComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
    }
    subscribeMidpointToEvents(midpoint, index) {
        const listeners = [
            {
                event: "click",
                base: midpoint.node,
                listener: (e) => {
                    e.stopPropagation();
                    this.createBezierControl(index);
                },
                bypass: false,
            },
        ];
        this.subscribeToEvents(listeners);
    }
    createBezierControl(index) {
        const rd = this.regionData.copy();
        const line = rd.getLineSegments()[index];
        rd.setBezierControl(index, new CubicBezierControl_1.CubicBezierControl({ c1: line.pointsAlongLine.oneThird, c2: line.pointsAlongLine.twoThird }));
        this.callbacks.onChange(this, rd);
    }
}
exports.MidpointElement = MidpointElement;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MidpointComponent = void 0;
const RegionComponent_1 = __webpack_require__(4);
class MidpointComponent extends RegionComponent_1.RegionComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.node = paper.g();
        this.node.addClass("midpointLayer");
        this.midpointElements = {};
        this.midpointNode = this.paper.g();
        this.node.add(this.midpointNode);
        const regionLineSegments = this.regionData.getLineSegments();
        this.buildMidpoints(regionLineSegments);
    }
    redraw() {
        const bezierControls = this.regionData.bezierControls;
        const regionLineSegments = this.regionData.getLineSegments();
        window.requestAnimationFrame(() => {
            this.updateMidpoints(bezierControls, regionLineSegments);
        });
    }
    createMidpoint(paper, x, y, style, r = MidpointComponent.DEFAULT_RADIUS) {
        const midpoint = paper.circle(x, y, r);
        midpoint.addClass("midpointStyle");
        if (style !== undefined && style !== "") {
            midpoint.addClass(style);
        }
        return midpoint;
    }
    teardownMidpoints() {
        Object.values(this.midpointElements).forEach((midpointElement) => {
            midpointElement.remove();
        });
        this.midpointElements = {};
    }
    buildMidpoints(regionLineSegments) {
        this.teardownMidpoints();
        const bezierControls = this.regionData.bezierControls;
        regionLineSegments.forEach((line, index) => {
            if (bezierControls[index]) {
                return;
            }
            const midpoint = this.createMidpoint(this.paper, line.pointsAlongLine.half.x, line.pointsAlongLine.half.y);
            this.midpointElements[index] = midpoint;
            this.midpointNode.add(midpoint);
            this.subscribeMidpointToEvents(midpoint, index);
        });
    }
    updateMidpoints(bezierControls, regionLineSegments) {
        const toDelete = [];
        const toAdd = [];
        const toUpdate = [];
        regionLineSegments.forEach((_line, idx) => {
            if (!bezierControls[idx] && !this.midpointElements[idx]) {
                toAdd.push(idx);
            }
            else if (!bezierControls[idx] && this.midpointElements[idx]) {
                toUpdate.push(idx);
            }
            else if (bezierControls[idx] && this.midpointElements[idx]) {
                toDelete.push(idx);
            }
        });
        Object.entries(this.midpointElements).forEach(([idx]) => {
            if (!regionLineSegments[idx]) {
                toDelete.push(Number(idx));
            }
        });
        toDelete.forEach((idx) => {
            this.midpointElements[idx].remove();
            delete this.midpointElements[idx];
        });
        toAdd.forEach((idx) => {
            if (this.midpointElements[idx]) {
                this.midpointElements[idx].remove();
            }
            const midpoint = this.createMidpoint(this.paper, regionLineSegments[idx].pointsAlongLine.half.x, regionLineSegments[idx].pointsAlongLine.half.y);
            this.midpointElements[idx] = midpoint;
            this.midpointNode.add(midpoint);
            this.subscribeMidpointToEvents(midpoint, idx);
        });
        toUpdate.forEach((idx) => {
            const line = regionLineSegments[idx];
            this.midpointElements[idx].attr({
                cx: line.pointsAlongLine.half.x,
                cy: line.pointsAlongLine.half.y,
            });
        });
    }
}
exports.MidpointComponent = MidpointComponent;
MidpointComponent.DEFAULT_RADIUS = 6;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsElement = void 0;
const TagsComponent_1 = __webpack_require__(8);
class TagsElement extends TagsComponent_1.TagsComponent {
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);
        this.buildOn(paper, tags);
    }
    redraw(rebuildTags = false) {
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
                d: this.regionData.toPath(),
            });
            if (rebuildTags) {
                this.primaryTagText.node.innerHTML = (this.tags.primary !== null) ? this.tags.primary.name : "";
                this.textBox = TagsComponent_1.TagsComponent.getCachedBBox(this.primaryTagText);
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
                        style: `fill: ${tags.primary.colorHighlight}; opacity: 1;`,
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
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${tags.primary.colorAccent};`,
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
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${tags.primary.colorNoColor};`,
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
                this.redraw(true);
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
        this.primaryTagText = paper.text(this.x, this.y, "");
        this.primaryTagText.addClass("primaryTagTextStyle");
        this.textBox = TagsComponent_1.TagsComponent.getCachedBBox(this.primaryTagText);
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagPolygon = paper.path(this.regionData.toPath());
        this.primaryTagPolygon.addClass("primaryTagPolygonStyle");
        this.primaryTagTextBG = paper.rect(this.x, this.y, 0, 0);
        this.primaryTagTextBG.addClass("primaryTagTextBGStyle");
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagNode.add(this.primaryTagBoundRect);
        this.primaryTagNode.add(this.primaryTagPolygon);
        this.primaryTagNode.add(this.primaryTagTextBG);
        this.primaryTagNode.add(this.primaryTagText);
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondaryTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
exports.TagsElement = TagsElement;
TagsElement.DEFAULT_PRIMARY_TAG_RADIUS = 3;
TagsElement.DEFAULT_SECONDARY_TAG_SIZE = 6;
TagsElement.DEFAULT_SECONDARY_TAG_DY = 6;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DragElement = void 0;
const DragComponent_1 = __webpack_require__(12);
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
exports.DragElement = DragElement;
DragElement.DEFAULT_DRAG_RADIUS = 6;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsElement = void 0;
const TagsComponent_1 = __webpack_require__(8);
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
        this.secondaryTagsNode.addClass("secondaryTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
exports.TagsElement = TagsElement;
TagsElement.DEFAULT_PRIMARY_TAG_RADIUS = 3;
TagsElement.DEFAULT_SECONDARY_TAG_SIZE = 6;
TagsElement.DEFAULT_SECONDARY_TAG_DY = 6;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonRegion = void 0;
const Rect_1 = __webpack_require__(1);
const Region_1 = __webpack_require__(6);
const AnchorsElement_1 = __webpack_require__(49);
const DragElement_1 = __webpack_require__(26);
const TagsElement_1 = __webpack_require__(50);
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
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorsElement = void 0;
const ConfigurationManager_1 = __webpack_require__(11);
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(2);
const AnchorsComponent_1 = __webpack_require__(7);
var GhostAnchorAction;
(function (GhostAnchorAction) {
    GhostAnchorAction["Add"] = "add";
    GhostAnchorAction["Delete"] = "delete";
    GhostAnchorAction["None"] = "";
})(GhostAnchorAction || (GhostAnchorAction = {}));
class AnchorsElement extends AnchorsComponent_1.AnchorsComponent {
    constructor(paper, paperRect = null, regionData, callbacks) {
        super(paper, paperRect, regionData, callbacks);
        this.ghostAnchorActionState = GhostAnchorAction.None;
        this.anchorsLength = regionData.points.length;
    }
    set ghostAnchorAction(newValue) {
        this.ghostAnchor.removeClass("add");
        this.ghostAnchor.removeClass("delete");
        this.ghostAnchor.addClass(newValue);
        this.ghostAnchorActionState = newValue;
    }
    get ghostAnchorAction() {
        return this.ghostAnchorActionState;
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
                    if (this.isModifyRegionOnlyModeEnabled(e)) {
                        this.activeAnchorIndex = -1;
                        const anchorPoint = this.getActiveAnchorPoint(e);
                        this.dragOrigin = anchorPoint;
                        this.ghostAnchorAction = GhostAnchorAction.Add;
                        window.requestAnimationFrame(() => {
                            this.ghostAnchor.attr({
                                cx: anchorPoint.x,
                                cy: anchorPoint.y,
                                display: "block",
                            });
                        });
                    }
                    else {
                        this.ghostAnchorAction = GhostAnchorAction.None;
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
        if (this.isModifyRegionOnlyModeEnabled(e)) {
            if (this.regionData.points.length <= AnchorsElement.MIN_NUMBERS_OF_POINTS_PER_POLYGON) {
                this.ghostAnchorAction = GhostAnchorAction.Delete;
            }
        }
        else {
            this.ghostAnchorAction = GhostAnchorAction.None;
        }
        super.onGhostPointerEnter(e);
    }
    onGhostPointerMove(e) {
        if (this.isModifyRegionOnlyModeEnabled(e) && this.activeAnchorIndex !== 0) {
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
            if (this.activeAnchorIndex <= 0 && !swapToDelete) {
                this.ghostAnchorAction = GhostAnchorAction.Add;
                this.activeAnchorIndex = -1;
            }
            else if (this.regionData.points.length > AnchorsElement.MIN_NUMBERS_OF_POINTS_PER_POLYGON
                && swapToDelete) {
                this.activeAnchorIndex = index + 1;
                this.ghostAnchorAction = GhostAnchorAction.Delete;
            }
        }
        else {
            this.ghostAnchorAction = GhostAnchorAction.None;
        }
        super.onGhostPointerMove(e);
    }
    onGhostPointerUp(e) {
        const rd = this.regionData.copy();
        if (this.ghostAnchorAction === GhostAnchorAction.Delete) {
            if (this.activeAnchorIndex > 0 && this.activeAnchorIndex <= this.regionData.points.length) {
                const points = rd.points;
                points.splice(this.activeAnchorIndex - 1, 1);
                rd.setPoints(points);
            }
            this.ghostAnchorAction = GhostAnchorAction.None;
            this.callbacks.onChange(this, rd, IRegionCallbacks_1.ChangeEventType.MOVEEND);
        }
        else if (this.ghostAnchorAction === GhostAnchorAction.Add) {
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
            this.ghostAnchorAction = GhostAnchorAction.Delete;
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
    isModifyRegionOnlyModeEnabled(event) {
        return ConfigurationManager_1.ConfigurationManager.isModifyRegionOnlyMode || (event === null || event === void 0 ? void 0 : event.ctrlKey);
    }
}
exports.AnchorsElement = AnchorsElement;
AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD = 5;
AnchorsElement.MIN_NUMBERS_OF_POINTS_PER_POLYGON = 3;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsElement = void 0;
const TagsComponent_1 = __webpack_require__(8);
class TagsElement extends TagsComponent_1.TagsComponent {
    constructor(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions) {
        super(paper, paperRect, regionData, tags, styleId, styleSheet, tagsUpdateOptions);
        this.buildOn(paper, tags);
    }
    redraw(rebuildTags = false) {
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
            if (rebuildTags) {
                this.primaryTagText.node.innerHTML = (this.tags.primary !== null) ? this.tags.primary.name : "";
                this.textBox = TagsComponent_1.TagsComponent.getCachedBBox(this.primaryTagText);
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
                        style: `fill: ${tags.primary.colorHighlight}; opacity: 1;`,
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
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${tags.primary.colorAccent};`,
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
                        rule: `.regionStyle.${this.styleId} .primaryTagTextBGStyle`,
                        style: `fill:${tags.primary.colorNoColor};`,
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
                this.redraw(true);
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
        this.primaryTagText = paper.text(this.x, this.y, "");
        this.primaryTagText.addClass("primaryTagTextStyle");
        this.textBox = TagsComponent_1.TagsComponent.getCachedBBox(this.primaryTagText);
        const pointsData = [];
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagPolygon = paper.polygon(pointsData);
        this.primaryTagPolygon.addClass("primaryTagPolygonStyle");
        this.primaryTagTextBG = paper.rect(this.x, this.y, 0, 0);
        this.primaryTagTextBG.addClass("primaryTagTextBGStyle");
        this.regionData.points.forEach((p) => {
            pointsData.push(p.x, p.y);
        });
        this.primaryTagNode.add(this.primaryTagBoundRect);
        this.primaryTagNode.add(this.primaryTagPolygon);
        this.primaryTagNode.add(this.primaryTagTextBG);
        this.primaryTagNode.add(this.primaryTagText);
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondaryTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
exports.TagsElement = TagsElement;
TagsElement.DEFAULT_PRIMARY_TAG_RADIUS = 3;
TagsElement.DEFAULT_SECONDARY_TAG_SIZE = 6;
TagsElement.DEFAULT_SECONDARY_TAG_DY = 6;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PolylineRegion = void 0;
const Rect_1 = __webpack_require__(1);
const Region_1 = __webpack_require__(6);
const AnchorsElement_1 = __webpack_require__(52);
const DragElement_1 = __webpack_require__(53);
const TagsElement_1 = __webpack_require__(54);
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorsElement = void 0;
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(2);
const AnchorsComponent_1 = __webpack_require__(7);
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
exports.AnchorsElement = AnchorsElement;
AnchorsElement.ANCHOR_POINT_LINE_SWITCH_THRESHOLD = 5;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DragElement = void 0;
const DragComponent_1 = __webpack_require__(12);
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
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsElement = void 0;
const TagsComponent_1 = __webpack_require__(8);
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
        this.secondaryTagsNode.addClass("secondaryTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
exports.TagsElement = TagsElement;
TagsElement.DEFAULT_PRIMARY_TAG_RADIUS = 3;
TagsElement.DEFAULT_SECONDARY_TAG_SIZE = 6;
TagsElement.DEFAULT_SECONDARY_TAG_DY = 6;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorsElement = void 0;
const Point2D_1 = __webpack_require__(0);
const IRegionCallbacks_1 = __webpack_require__(2);
const AnchorsComponent_1 = __webpack_require__(7);
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DragElement = void 0;
const DragComponent_1 = __webpack_require__(12);
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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsElement = void 0;
const TagsComponent_1 = __webpack_require__(8);
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
                        this.textBox = TagsComponent_1.TagsComponent.getCachedBBox(this.primaryTagText);
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
        this.textBox = TagsComponent_1.TagsComponent.getCachedBBox(this.primaryTagText);
        this.primaryTagTextBG = paper.rect(this.x, this.y, 0, 0);
        this.primaryTagTextBG.addClass("primaryTagTextBGStyle");
        this.primaryTagNode.add(this.primaryTagRect);
        this.primaryTagNode.add(this.primaryTagTextBG);
        this.primaryTagNode.add(this.primaryTagText);
        this.secondaryTagsNode = paper.g();
        this.secondaryTagsNode.addClass("secondaryTagsLayer");
        this.secondaryTags = [];
        this.node.add(this.primaryTagNode);
        this.node.add(this.secondaryTagsNode);
        this.initStyleMaps(tags);
        this.updateTags(tags, this.tagsUpdateOptions);
    }
}
exports.TagsElement = TagsElement;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuElement = void 0;
const RegionComponent_1 = __webpack_require__(4);
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
exports.MenuElement = MenuElement;
MenuElement.PathCollection = {
    delete: {
        iconSize: 96,
        path: "M 83.4 21.1 L 74.9 12.6 L 48 39.5 L 21.1 12.6 L 12.6 21.1 L 39.5 48 L 12.6 74.9 " +
            "L 21.1 83.4 L 48 56.5 L 74.9 83.4 L 83.4 74.9 L 56.5 48 Z",
    },
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PointSelector = void 0;
const Point2D_1 = __webpack_require__(0);
const RegionData_1 = __webpack_require__(3);
const CrossElement_1 = __webpack_require__(13);
const Selector_1 = __webpack_require__(9);
class PointSelector extends Selector_1.Selector {
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.buildUIElements();
        this.hide();
    }
    reset() {
        this.buildUIElements();
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
exports.PointSelector = PointSelector;
PointSelector.DEFAULT_POINT_RADIUS = 6;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonSelector = void 0;
const ConfigurationManager_1 = __webpack_require__(11);
const Point2D_1 = __webpack_require__(0);
const RegionData_1 = __webpack_require__(3);
const CrossElement_1 = __webpack_require__(13);
const Selector_1 = __webpack_require__(9);
class PolygonSelector extends Selector_1.Selector {
    constructor(parent, paper, boundRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.isCapturing = false;
        this.redoQueue = [];
        this.buildUIElements();
        this.reset();
        this.hide();
    }
    resize(newWidth, newHeight, oldWidth, oldHeight) {
        const [xScale, yScale] = [newWidth / oldWidth, newHeight / oldHeight];
        super.resize(newWidth, newHeight);
        this.crossA.resize(newWidth, newHeight);
        if (oldWidth !== undefined || oldHeight !== undefined) {
            if (this.lastPoint != null) {
                this.lastPoint.x = Math.round(this.lastPoint.x * xScale);
                this.lastPoint.y = Math.round(this.lastPoint.y * yScale);
            }
            this.points = this.points.map((p) => new Point2D_1.Point2D(Math.round(p.x * xScale), Math.round(p.y * yScale)));
            this.redrawPoints();
        }
    }
    hide() {
        super.hide();
        this.hideAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }
    show() {
        super.show();
        this.showAll([this.crossA, this.nextPoint, this.nextSegment, this.polygon, this.pointsGroup]);
    }
    undo() {
        if (this.canUndo()) {
            const pointToUndo = this.points.pop();
            this.pointsGroup.children().pop().remove();
            this.lastPoint = this.points[this.points.length - 1];
            this.redoQueue.push(pointToUndo);
            this.redrawPoints();
        }
    }
    redo() {
        if (this.canRedo()) {
            const pointToRedo = this.redoQueue.pop();
            this.addPoint(pointToRedo.x, pointToRedo.y);
        }
    }
    canRedo() {
        return this.redoQueue.length > 0;
    }
    canUndo() {
        return this.points.length > 1;
    }
    disable() {
        super.disable();
        this.reset();
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
                    if (e.detail <= 1 && this.isCapturing) {
                        window.requestAnimationFrame(() => {
                            const p = new Point2D_1.Point2D(this.crossA.x, this.crossA.y);
                            this.addPoint(p.x, p.y);
                            this.lastPoint = p;
                            this.redoQueue = [];
                        });
                        if (typeof this.callbacks.onNextSelectionPoint === "function") {
                            this.callbacks.onNextSelectionPoint(new Point2D_1.Point2D(this.crossA.x, this.crossA.y));
                        }
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
    addPoint(x, y) {
        this.points.push(new Point2D_1.Point2D(x, y));
        const point = this.paper.circle(x, y, PolygonSelector.DEFAULT_POINT_RADIUS);
        point.addClass("polygonPointStyle");
        this.pointsGroup.add(point);
        this.redrawPoints();
    }
    redrawPoints() {
        this.polygon.attr({
            points: this.points.map((p) => `${p.x},${p.y}`).join(","),
        });
        this.pointsGroup.children().forEach((child, index) => {
            if (this.points[index]) {
                child.attr({ cx: this.points[index].x, cy: this.points[index].y });
            }
        });
    }
    submitPolygon() {
        if (typeof this.callbacks.onSelectionEnd === "function") {
            const box = this.polygon.getBBox();
            const regionType = ConfigurationManager_1.ConfigurationManager.isPathRegionEnabled ? RegionData_1.RegionDataType.Path : RegionData_1.RegionDataType.Polygon;
            this.callbacks.onSelectionEnd(new RegionData_1.RegionData(box.x, box.y, box.width, box.height, this.points.map((p) => p.copy()), regionType));
        }
        this.reset();
    }
}
exports.PolygonSelector = PolygonSelector;
PolygonSelector.DEFAULT_POINT_RADIUS = 3;
PolygonSelector.DEFAULT_SELECTOR_RADIUS = 6;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PolylineSelector = void 0;
const Point2D_1 = __webpack_require__(0);
const RegionData_1 = __webpack_require__(3);
const CrossElement_1 = __webpack_require__(13);
const Selector_1 = __webpack_require__(9);
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
            const points = this.getPolylinePoints();
            if (points.length <= 0) {
                return;
            }
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
exports.PolylineSelector = PolylineSelector;
PolylineSelector.DEFAULT_POINT_RADIUS = 3;
PolylineSelector.DEFAULT_SELECTOR_RADIUS = 6;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RectCopySelector = void 0;
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const RegionData_1 = __webpack_require__(3);
const AlternatingCrossElement_1 = __webpack_require__(30);
const RectElement_1 = __webpack_require__(31);
const Selector_1 = __webpack_require__(9);
class RectCopySelector extends Selector_1.Selector {
    constructor(parent, paper, boundRect, copyRect, callbacks) {
        super(parent, paper, boundRect, callbacks);
        this.usingKeyboardCursor = false;
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
    reset() {
        this.buildUIElements();
    }
    hide() {
        super.hide();
        this.hideAll([this.crossA, this.copyRectEl]);
    }
    show() {
        super.show();
        this.showAll([this.crossA, this.copyRectEl]);
    }
    getUsingKeyboardCursor() {
        return this.usingKeyboardCursor;
    }
    activateKeyboardCursor() {
        this.usingKeyboardCursor = true;
    }
    deactivateKeyboardCursor() {
        this.usingKeyboardCursor = false;
    }
    buildUIElements() {
        this.node = this.paper.g();
        this.node.addClass("rectCopySelector");
        this.crossA = new AlternatingCrossElement_1.AlternatingCrossElement(this.paper, this.boundRect);
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
            { event: "keydown", listener: this.onKeyDown, base: window, bypass: false },
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
            this.deactivateKeyboardCursor();
            this.show();
            this.moveCopyRect(this.copyRectEl, this.crossA);
            if (typeof this.callbacks.onSelectionBegin === "function") {
                this.callbacks.onSelectionBegin();
            }
        });
    }
    onPointerUp(e) {
        window.requestAnimationFrame(() => {
            this.createCopyRectBoundingBox();
        });
    }
    onPointerMove(e) {
        window.requestAnimationFrame(() => {
            this.deactivateKeyboardCursor();
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
    onKeyDown(e) {
        if (e.key === "k" || e.key.toLocaleUpperCase() === "K") {
            if (!this.usingKeyboardCursor) {
                this.activateKeyboardCursor();
            }
            else {
                this.createCopyRectBoundingBox();
            }
        }
        if (!e.ctrlKey && e.shiftKey && this.isKeyboardControlKey(e.key) && this.usingKeyboardCursor) {
            e.preventDefault();
            this.moveKeyboardCursor(e.key);
        }
    }
    isKeyboardControlKey(key) {
        return key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";
    }
    moveKeyboardCursor(key) {
        const nextPos = { x: this.crossA.x, y: this.crossA.y };
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
        this.moveCross(this.crossA, nextPos);
        this.moveCopyRect(this.copyRectEl, this.crossA);
    }
    createCopyRectBoundingBox() {
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
    }
}
exports.RectCopySelector = RectCopySelector;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RectSelector = exports.SelectionModificator = void 0;
const Point2D_1 = __webpack_require__(0);
const Rect_1 = __webpack_require__(1);
const RegionData_1 = __webpack_require__(3);
const AlternatingCrossElement_1 = __webpack_require__(30);
const RectElement_1 = __webpack_require__(31);
const Selector_1 = __webpack_require__(9);
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
    reset() {
        this.buildUIElements();
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
    getUsingKeyboardCursor() {
        return this.usingKeyboardCursor;
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
        if (e.key === "k" || e.key.toLocaleUpperCase() === "K") {
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
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarSelectIcon = void 0;
const ToolbarIcon_1 = __webpack_require__(5);
class ToolbarSelectIcon extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, icon, onAction, action, key) {
        super(paper, icon, onAction, action, key);
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
        this.node.attr({ tabindex: 0, role: "button" });
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
        this.node.node.addEventListener("focus", this.onfocusCallback);
        this.node.node.addEventListener("focusout", this.onfocusoutCallback);
    }
}
exports.ToolbarSelectIcon = ToolbarSelectIcon;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarSeparator = void 0;
const ToolbarIcon_1 = __webpack_require__(5);
class ToolbarSeparator extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, width, isVertical = true) {
        super(paper, null);
        this.buildIconUI();
        if (isVertical) {
            this.resize(width, 1);
        }
        else {
            this.resize(1, width);
        }
        this.isVertical = isVertical;
    }
    move(x, y) {
        super.move(x, y);
        if (this.isVertical) {
            this.iconSeparator.attr({
                x1: x,
                x2: x + this.width,
                y1: y,
                y2: y,
            });
        }
        else {
            this.iconSeparator.attr({
                x1: x,
                x2: x,
                y1: y,
                y2: y + this.width,
            });
        }
    }
    resize(width, height) {
        if (this.isVertical) {
            super.resize(width, 1);
            this.iconSeparator.attr({
                width: this.width,
            });
        }
        else {
            super.resize(1, height);
            this.iconSeparator.attr({
                height: this.height,
            });
        }
    }
    buildIconUI() {
        this.node = this.paper.g();
        this.node.addClass("separator");
        this.iconSeparator = this.isVertical ? this.paper.line(0, 0, this.width, 0) : this.paper.line(0, 0, 0, this.width);
        this.node.add(this.iconSeparator);
    }
}
exports.ToolbarSeparator = ToolbarSeparator;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarSwitchIcon = void 0;
const ToolbarIcon_1 = __webpack_require__(5);
class ToolbarSwitchIcon extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, icon, onAction, action, key) {
        super(paper, icon, onAction, action, key);
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
        this.node.attr({ tabindex: 0, role: "button" });
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
        this.node.node.addEventListener("focus", this.onfocusCallback);
        this.node.node.addEventListener("focusout", this.onfocusoutCallback);
    }
}
exports.ToolbarSwitchIcon = ToolbarSwitchIcon;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarTriggerIcon = void 0;
const ToolbarIcon_1 = __webpack_require__(5);
class ToolbarTriggerIcon extends ToolbarIcon_1.ToolbarIcon {
    constructor(paper, icon, onAction, action, key) {
        super(paper, icon, onAction, action, key);
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
        this.node.attr({ tabindex: 0, role: "button" });
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
        this.node.node.addEventListener("focus", this.onfocusCallback);
        this.node.node.addEventListener("focusout", this.onfocusoutCallback);
    }
}
exports.ToolbarTriggerIcon = ToolbarTriggerIcon;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarAction = void 0;
var ToolbarAction;
(function (ToolbarAction) {
    ToolbarAction["NONE"] = "none-select";
    ToolbarAction["POINT"] = "point-select";
    ToolbarAction["RECT"] = "rect-select";
    ToolbarAction["COPY"] = "copy-select";
    ToolbarAction["POLYLINE"] = "polyline-select";
    ToolbarAction["POLYGON"] = "polygon-select";
    ToolbarAction["ADD_REMOVE_POINTS"] = "pointer-add-remove-points-on-polygons";
    ToolbarAction["DELETE_ALL"] = "delete-all-select";
    ToolbarAction["SELECTION_LOCK"] = "selection-lock";
    ToolbarAction["BACKGROUND_TOGGLE"] = "background-toggle";
    ToolbarAction["ZOOM_IN"] = "zoom-in";
    ToolbarAction["ZOOM_OUT"] = "zoom-out";
    ToolbarAction["ZOOM_DRAG"] = "zoom-drag";
})(ToolbarAction = exports.ToolbarAction || (exports.ToolbarAction = {}));


/***/ }),
/* 69 */
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
exports.Palette = void 0;
const Color_1 = __webpack_require__(20);
const LABColor_1 = __webpack_require__(10);
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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsDescriptor = void 0;
const Tag_1 = __webpack_require__(34);
class TagsDescriptor {
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

window.eve = __webpack_require__(72)

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
            sr = target.createSVGRect();
        sr.x = x - so.x;
        sr.y = y - so.y;
        sr.width = sr.height = 1;
        var hits = target.getIntersectionList(sr, null);
        if (hits.length) {
            target = hits[hits.length - 1];
        }
    }
    if (!target) {
        return null;
    }
    return wrap(target);
};
/*\
 * Snap.plugin
 [ method ]
 **
 * Let you write plugins. You pass in a function with five arguments, like this:
 | Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
 |     Snap.newmethod = function () {};
 |     Element.prototype.newmethod = function () {};
 |     Paper.prototype.newmethod = function () {};
 | });
 * Inside the function you have access to all main objects (and their
 * prototypes). This allow you to extend anything you want.
 **
 - f (function) your plugin body
\*/
Snap.plugin = function (f) {
    f(Snap, Element, Paper, glob, Fragment);
};
glob.win.Snap = Snap;
return Snap;
}(window || this));

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var elproto = Element.prototype,
        is = Snap.is,
        Str = String,
        unit2px = Snap._unit2px,
        $ = Snap._.$,
        make = Snap._.make,
        getSomeDefs = Snap._.getSomeDefs,
        has = "hasOwnProperty",
        wrap = Snap._.wrap;
    /*\
     * Element.getBBox
     [ method ]
     **
     * Returns the bounding box descriptor for the given element
     **
     = (object) bounding box descriptor:
     o {
     o     cx: (number) x of the center,
     o     cy: (number) x of the center,
     o     h: (number) height,
     o     height: (number) height,
     o     path: (string) path command for the box,
     o     r0: (number) radius of a circle that fully encloses the box,
     o     r1: (number) radius of the smallest circle that can be enclosed,
     o     r2: (number) radius of the largest circle that can be enclosed,
     o     vb: (string) box as a viewbox command,
     o     w: (number) width,
     o     width: (number) width,
     o     x2: (number) x of the right side,
     o     x: (number) x of the left side,
     o     y2: (number) y of the bottom edge,
     o     y: (number) y of the top edge
     o }
    \*/
    elproto.getBBox = function (isWithoutTransform) {
        if (this.type == "tspan") {
            return Snap._.box(this.node.getClientRects().item(0));
        }
        if (!Snap.Matrix || !Snap.path) {
            return this.node.getBBox();
        }
        var el = this,
            m = new Snap.Matrix;
        if (el.removed) {
            return Snap._.box();
        }
        while (el.type == "use") {
            if (!isWithoutTransform) {
                m = m.add(el.transform().localMatrix.translate(el.attr("x") || 0, el.attr("y") || 0));
            }
            if (el.original) {
                el = el.original;
            } else {
                var href = el.attr("xlink:href");
                el = el.original = el.node.ownerDocument.getElementById(href.substring(href.indexOf("#") + 1));
            }
        }
        var _ = el._,
            pathfinder = Snap.path.get[el.type] || Snap.path.get.deflt;
        try {
            if (isWithoutTransform) {
                _.bboxwt = pathfinder ? Snap.path.getBBox(el.realPath = pathfinder(el)) : Snap._.box(el.node.getBBox());
                return Snap._.box(_.bboxwt);
            } else {
                el.realPath = pathfinder(el);
                el.matrix = el.transform().localMatrix;
                _.bbox = Snap.path.getBBox(Snap.path.map(el.realPath, m.add(el.matrix)));
                return Snap._.box(_.bbox);
            }
        } catch (e) {
            // Firefox doesn’t give you bbox of hidden element
            return Snap._.box();
        }
    };
    var propString = function () {
        return this.string;
    };
    function extractTransform(el, tstr) {
        if (tstr == null) {
            var doReturn = true;
            if (el.type == "linearGradient" || el.type == "radialGradient") {
                tstr = el.node.getAttribute("gradientTransform");
            } else if (el.type == "pattern") {
                tstr = el.node.getAttribute("patternTransform");
            } else {
                tstr = el.node.getAttribute("transform");
            }
            if (!tstr) {
                return new Snap.Matrix;
            }
            tstr = Snap._.svgTransform2string(tstr);
        } else {
            if (!Snap._.rgTransform.test(tstr)) {
                tstr = Snap._.svgTransform2string(tstr);
            } else {
                tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || "");
            }
            if (is(tstr, "array")) {
                tstr = Snap.path ? Snap.path.toString.call(tstr) : Str(tstr);
            }
            el._.transform = tstr;
        }
        var m = Snap._.transform2matrix(tstr, el.getBBox(1));
        if (doReturn) {
            return m;
        } else {
            el.matrix = m;
        }
    }
    /*\
     * Element.transform
     [ method ]
     **
     * Gets or sets transformation of the element
     **
     - tstr (string) transform string in Snap or SVG format
     = (Element) the current element
     * or
     = (object) transformation descriptor:
     o {
     o     string (string) transform string,
     o     globalMatrix (Matrix) matrix of all transformations applied to element or its parents,
     o     localMatrix (Matrix) matrix of transformations applied only to the element,
     o     diffMatrix (Matrix) matrix of difference between global and local transformations,
     o     global (string) global transformation as string,
     o     local (string) local transformation as string,
     o     toString (function) returns `string` property
     o }
    \*/
    elproto.transform = function (tstr) {
        var _ = this._;
        if (tstr == null) {
            var papa = this,
                global = new Snap.Matrix(this.node.getCTM()),
                local = extractTransform(this),
                ms = [local],
                m = new Snap.Matrix,
                i,
                localString = local.toTransformString(),
                string = Str(local) == Str(this.matrix) ?
                            Str(_.transform) : localString;
            while (papa.type != "svg" && (papa = papa.parent())) {
                ms.push(extractTransform(papa));
            }
            i = ms.length;
            while (i--) {
                m.add(ms[i]);
            }
            return {
                string: string,
                globalMatrix: global,
                totalMatrix: m,
                localMatrix: local,
                diffMatrix: global.clone().add(local.invert()),
                global: global.toTransformString(),
                total: m.toTransformString(),
                local: localString,
                toString: propString
            };
        }
        if (tstr instanceof Snap.Matrix) {
            this.matrix = tstr;
            this._.transform = tstr.toTransformString();
        } else {
            extractTransform(this, tstr);
        }

        if (this.node) {
            if (this.type == "linearGradient" || this.type == "radialGradient") {
                $(this.node, {gradientTransform: this.matrix});
            } else if (this.type == "pattern") {
                $(this.node, {patternTransform: this.matrix});
            } else {
                $(this.node, {transform: this.matrix});
            }
        }

        return this;
    };
    /*\
     * Element.parent
     [ method ]
     **
     * Returns the element's parent
     **
     = (Element) the parent element
    \*/
    elproto.parent = function () {
        return wrap(this.node.parentNode);
    };
    /*\
     * Element.append
     [ method ]
     **
     * Appends the given element to current one
     **
     - el (Element|Set) element to append
     = (Element) the parent element
    \*/
    /*\
     * Element.add
     [ method ]
     **
     * See @Element.append
    \*/
    elproto.append = elproto.add = function (el) {
        if (el) {
            if (el.type == "set") {
                var it = this;
                el.forEach(function (el) {
                    it.add(el);
                });
                return this;
            }
            el = wrap(el);
            this.node.appendChild(el.node);
            el.paper = this.paper;
        }
        return this;
    };
    /*\
     * Element.appendTo
     [ method ]
     **
     * Appends the current element to the given one
     **
     - el (Element) parent element to append to
     = (Element) the child element
    \*/
    elproto.appendTo = function (el) {
        if (el) {
            el = wrap(el);
            el.append(this);
        }
        return this;
    };
    /*\
     * Element.prepend
     [ method ]
     **
     * Prepends the given element to the current one
     **
     - el (Element) element to prepend
     = (Element) the parent element
    \*/
    elproto.prepend = function (el) {
        if (el) {
            if (el.type == "set") {
                var it = this,
                    first;
                el.forEach(function (el) {
                    if (first) {
                        first.after(el);
                    } else {
                        it.prepend(el);
                    }
                    first = el;
                });
                return this;
            }
            el = wrap(el);
            var parent = el.parent();
            this.node.insertBefore(el.node, this.node.firstChild);
            this.add && this.add();
            el.paper = this.paper;
            this.parent() && this.parent().add();
            parent && parent.add();
        }
        return this;
    };
    /*\
     * Element.prependTo
     [ method ]
     **
     * Prepends the current element to the given one
     **
     - el (Element) parent element to prepend to
     = (Element) the child element
    \*/
    elproto.prependTo = function (el) {
        el = wrap(el);
        el.prepend(this);
        return this;
    };
    /*\
     * Element.before
     [ method ]
     **
     * Inserts given element before the current one
     **
     - el (Element) element to insert
     = (Element) the parent element
    \*/
    elproto.before = function (el) {
        if (el.type == "set") {
            var it = this;
            el.forEach(function (el) {
                var parent = el.parent();
                it.node.parentNode.insertBefore(el.node, it.node);
                parent && parent.add();
            });
            this.parent().add();
            return this;
        }
        el = wrap(el);
        var parent = el.parent();
        this.node.parentNode.insertBefore(el.node, this.node);
        this.parent() && this.parent().add();
        parent && parent.add();
        el.paper = this.paper;
        return this;
    };
    /*\
     * Element.after
     [ method ]
     **
     * Inserts given element after the current one
     **
     - el (Element) element to insert
     = (Element) the parent element
    \*/
    elproto.after = function (el) {
        el = wrap(el);
        var parent = el.parent();
        if (this.node.nextSibling) {
            this.node.parentNode.insertBefore(el.node, this.node.nextSibling);
        } else {
            this.node.parentNode.appendChild(el.node);
        }
        this.parent() && this.parent().add();
        parent && parent.add();
        el.paper = this.paper;
        return this;
    };
    /*\
     * Element.insertBefore
     [ method ]
     **
     * Inserts the element after the given one
     **
     - el (Element) element next to whom insert to
     = (Element) the parent element
    \*/
    elproto.insertBefore = function (el) {
        el = wrap(el);
        var parent = this.parent();
        el.node.parentNode.insertBefore(this.node, el.node);
        this.paper = el.paper;
        parent && parent.add();
        el.parent() && el.parent().add();
        return this;
    };
    /*\
     * Element.insertAfter
     [ method ]
     **
     * Inserts the element after the given one
     **
     - el (Element) element next to whom insert to
     = (Element) the parent element
    \*/
    elproto.insertAfter = function (el) {
        el = wrap(el);
        var parent = this.parent();
        el.node.parentNode.insertBefore(this.node, el.node.nextSibling);
        this.paper = el.paper;
        parent && parent.add();
        el.parent() && el.parent().add();
        return this;
    };
    /*\
     * Element.remove
     [ method ]
     **
     * Removes element from the DOM
     = (Element) the detached element
    \*/
    elproto.remove = function () {
        var parent = this.parent();
        this.node.parentNode && this.node.parentNode.removeChild(this.node);
        delete this.paper;
        this.removed = true;
        parent && parent.add();
        return this;
    };
    /*\
     * Element.select
     [ method ]
     **
     * Gathers the nested @Element matching the given set of CSS selectors
     **
     - query (string) CSS selector
     = (Element) result of query selection
    \*/
    elproto.select = function (query) {
        return wrap(this.node.querySelector(query));
    };
    /*\
     * Element.selectAll
     [ method ]
     **
     * Gathers nested @Element objects matching the given set of CSS selectors
     **
     - query (string) CSS selector
     = (Set|array) result of query selection
    \*/
    elproto.selectAll = function (query) {
        var nodelist = this.node.querySelectorAll(query),
            set = (Snap.set || Array)();
        for (var i = 0; i < nodelist.length; i++) {
            set.push(wrap(nodelist[i]));
        }
        return set;
    };
    /*\
     * Element.asPX
     [ method ]
     **
     * Returns given attribute of the element as a `px` value (not %, em, etc.)
     **
     - attr (string) attribute name
     - value (string) #optional attribute value
     = (Element) result of query selection
    \*/
    elproto.asPX = function (attr, value) {
        if (value == null) {
            value = this.attr(attr);
        }
        return +unit2px(this, attr, value);
    };
    // SIERRA Element.use(): I suggest adding a note about how to access the original element the returned <use> instantiates. It's a part of SVG with which ordinary web developers may be least familiar.
    /*\
     * Element.use
     [ method ]
     **
     * Creates a `<use>` element linked to the current element
     **
     = (Element) the `<use>` element
    \*/
    elproto.use = function () {
        var use,
            id = this.node.id;
        if (!id) {
            id = this.id;
            $(this.node, {
                id: id
            });
        }
        if (this.type == "linearGradient" || this.type == "radialGradient" ||
            this.type == "pattern") {
            use = make(this.type, this.node.parentNode);
        } else {
            use = make("use", this.node.parentNode);
        }
        $(use.node, {
            "xlink:href": "#" + id
        });
        use.original = this;
        return use;
    };
    function fixids(el) {
        var els = el.selectAll("*"),
            it,
            url = /^\s*url\(("|'|)(.*)\1\)\s*$/,
            ids = [],
            uses = {};
        function urltest(it, name) {
            var val = $(it.node, name);
            val = val && val.match(url);
            val = val && val[2];
            if (val && val.charAt() == "#") {
                val = val.substring(1);
            } else {
                return;
            }
            if (val) {
                uses[val] = (uses[val] || []).concat(function (id) {
                    var attr = {};
                    attr[name] = Snap.url(id);
                    $(it.node, attr);
                });
            }
        }
        function linktest(it) {
            var val = $(it.node, "xlink:href");
            if (val && val.charAt() == "#") {
                val = val.substring(1);
            } else {
                return;
            }
            if (val) {
                uses[val] = (uses[val] || []).concat(function (id) {
                    it.attr("xlink:href", "#" + id);
                });
            }
        }
        for (var i = 0, ii = els.length; i < ii; i++) {
            it = els[i];
            urltest(it, "fill");
            urltest(it, "stroke");
            urltest(it, "filter");
            urltest(it, "mask");
            urltest(it, "clip-path");
            linktest(it);
            var oldid = $(it.node, "id");
            if (oldid) {
                $(it.node, {id: it.id});
                ids.push({
                    old: oldid,
                    id: it.id
                });
            }
        }
        for (i = 0, ii = ids.length; i < ii; i++) {
            var fs = uses[ids[i].old];
            if (fs) {
                for (var j = 0, jj = fs.length; j < jj; j++) {
                    fs[j](ids[i].id);
                }
            }
        }
    }
    /*\
     * Element.clone
     [ method ]
     **
     * Creates a clone of the element and inserts it after the element
     **
     = (Element) the clone
    \*/
    elproto.clone = function () {
        var clone = wrap(this.node.cloneNode(true));
        if ($(clone.node, "id")) {
            $(clone.node, {id: clone.id});
        }
        fixids(clone);
        clone.insertAfter(this);
        return clone;
    };
    /*\
     * Element.toDefs
     [ method ]
     **
     * Moves element to the shared `<defs>` area
     **
     = (Element) the element
    \*/
    elproto.toDefs = function () {
        var defs = getSomeDefs(this);
        defs.appendChild(this.node);
        return this;
    };
    /*\
     * Element.toPattern
     [ method ]
     **
     * Creates a `<pattern>` element from the current element
     **
     * To create a pattern you have to specify the pattern rect:
     - x (string|number)
     - y (string|number)
     - width (string|number)
     - height (string|number)
     = (Element) the `<pattern>` element
     * You can use pattern later on as an argument for `fill` attribute:
     | var p = paper.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
     |         fill: "none",
     |         stroke: "#bada55",
     |         strokeWidth: 5
     |     }).pattern(0, 0, 10, 10),
     |     c = paper.circle(200, 200, 100);
     | c.attr({
     |     fill: p
     | });
    \*/
    elproto.pattern = elproto.toPattern = function (x, y, width, height) {
        var p = make("pattern", getSomeDefs(this));
        if (x == null) {
            x = this.getBBox();
        }
        if (is(x, "object") && "x" in x) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }
        $(p.node, {
            x: x,
            y: y,
            width: width,
            height: height,
            patternUnits: "userSpaceOnUse",
            id: p.id,
            viewBox: [x, y, width, height].join(" ")
        });
        p.node.appendChild(this.node);
        return p;
    };
// SIERRA Element.marker(): clarify what a reference point is. E.g., helps you offset the object from its edge such as when centering it over a path.
// SIERRA Element.marker(): I suggest the method should accept default reference point values.  Perhaps centered with (refX = width/2) and (refY = height/2)? Also, couldn't it assume the element's current _width_ and _height_? And please specify what _x_ and _y_ mean: offsets? If so, from where?  Couldn't they also be assigned default values?
    /*\
     * Element.marker
     [ method ]
     **
     * Creates a `<marker>` element from the current element
     **
     * To create a marker you have to specify the bounding rect and reference point:
     - x (number)
     - y (number)
     - width (number)
     - height (number)
     - refX (number)
     - refY (number)
     = (Element) the `<marker>` element
     * You can specify the marker later as an argument for `marker-start`, `marker-end`, `marker-mid`, and `marker` attributes. The `marker` attribute places the marker at every point along the path, and `marker-mid` places them at every point except the start and end.
    \*/
    // TODO add usage for markers
    elproto.marker = function (x, y, width, height, refX, refY) {
        var p = make("marker", getSomeDefs(this));
        if (x == null) {
            x = this.getBBox();
        }
        if (is(x, "object") && "x" in x) {
            y = x.y;
            width = x.width;
            height = x.height;
            refX = x.refX || x.cx;
            refY = x.refY || x.cy;
            x = x.x;
        }
        $(p.node, {
            viewBox: [x, y, width, height].join(" "),
            markerWidth: width,
            markerHeight: height,
            orient: "auto",
            refX: refX || 0,
            refY: refY || 0,
            id: p.id
        });
        p.node.appendChild(this.node);
        return p;
    };
    var eldata = {};
    /*\
     * Element.data
     [ method ]
     **
     * Adds or retrieves given value associated with given key. (Don’t confuse
     * with `data-` attributes)
     *
     * See also @Element.removeData
     - key (string) key to store data
     - value (any) #optional value to store
     = (object) @Element
     * or, if value is not specified:
     = (any) value
     > Usage
     | for (var i = 0, i < 5, i++) {
     |     paper.circle(10 + 15 * i, 10, 10)
     |          .attr({fill: "#000"})
     |          .data("i", i)
     |          .click(function () {
     |             alert(this.data("i"));
     |          });
     | }
    \*/
    elproto.data = function (key, value) {
        var data = eldata[this.id] = eldata[this.id] || {};
        if (arguments.length == 0){
            eve("snap.data.get." + this.id, this, data, null);
            return data;
        }
        if (arguments.length == 1) {
            if (Snap.is(key, "object")) {
                for (var i in key) if (key[has](i)) {
                    this.data(i, key[i]);
                }
                return this;
            }
            eve("snap.data.get." + this.id, this, data[key], key);
            return data[key];
        }
        data[key] = value;
        eve("snap.data.set." + this.id, this, value, key);
        return this;
    };
    /*\
     * Element.removeData
     [ method ]
     **
     * Removes value associated with an element by given key.
     * If key is not provided, removes all the data of the element.
     - key (string) #optional key
     = (object) @Element
    \*/
    elproto.removeData = function (key) {
        if (key == null) {
            eldata[this.id] = {};
        } else {
            eldata[this.id] && delete eldata[this.id][key];
        }
        return this;
    };
    /*\
     * Element.outerSVG
     [ method ]
     **
     * Returns SVG code for the element, equivalent to HTML's `outerHTML`.
     *
     * See also @Element.innerSVG
     = (string) SVG code for the element
    \*/
    /*\
     * Element.toString
     [ method ]
     **
     * See @Element.outerSVG
    \*/
    elproto.outerSVG = elproto.toString = toString(1);
    /*\
     * Element.innerSVG
     [ method ]
     **
     * Returns SVG code for the element's contents, equivalent to HTML's `innerHTML`
     = (string) SVG code for the element
    \*/
    elproto.innerSVG = toString();
    function toString(type) {
        return function () {
            var res = type ? "<" + this.type : "",
                attr = this.node.attributes,
                chld = this.node.childNodes;
            if (type) {
                for (var i = 0, ii = attr.length; i < ii; i++) {
                    res += " " + attr[i].name + '="' +
                            attr[i].value.replace(/"/g, '\\"') + '"';
                }
            }
            if (chld.length) {
                type && (res += ">");
                for (i = 0, ii = chld.length; i < ii; i++) {
                    if (chld[i].nodeType == 3) {
                        res += chld[i].nodeValue;
                    } else if (chld[i].nodeType == 1) {
                        res += wrap(chld[i]).toString();
                    }
                }
                type && (res += "</" + this.type + ">");
            } else {
                type && (res += "/>");
            }
            return res;
        };
    }
    elproto.toDataURL = function () {
        if (window && window.btoa) {
            var bb = this.getBBox(),
                svg = Snap.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
                x: +bb.x.toFixed(3),
                y: +bb.y.toFixed(3),
                width: +bb.width.toFixed(3),
                height: +bb.height.toFixed(3),
                contents: this.outerSVG()
            });
            return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
        }
    };
    /*\
     * Fragment.select
     [ method ]
     **
     * See @Element.select
    \*/
    Fragment.prototype.select = elproto.select;
    /*\
     * Fragment.selectAll
     [ method ]
     **
     * See @Element.selectAll
    \*/
    Fragment.prototype.selectAll = elproto.selectAll;
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var objectToString = Object.prototype.toString,
        Str = String,
        math = Math,
        E = "";
    function Matrix(a, b, c, d, e, f) {
        if (b == null && objectToString.call(a) == "[object SVGMatrix]") {
            this.a = a.a;
            this.b = a.b;
            this.c = a.c;
            this.d = a.d;
            this.e = a.e;
            this.f = a.f;
            return;
        }
        if (a != null) {
            this.a = +a;
            this.b = +b;
            this.c = +c;
            this.d = +d;
            this.e = +e;
            this.f = +f;
        } else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
    }
    (function (matrixproto) {
        /*\
         * Matrix.add
         [ method ]
         **
         * Adds the given matrix to existing one
         - a (number)
         - b (number)
         - c (number)
         - d (number)
         - e (number)
         - f (number)
         * or
         - matrix (object) @Matrix
        \*/
        matrixproto.add = function (a, b, c, d, e, f) {
            if (a && a instanceof Matrix) {
                return this.add(a.a, a.b, a.c, a.d, a.e, a.f);
            }
            var aNew = a * this.a + b * this.c,
                bNew = a * this.b + b * this.d;
            this.e += e * this.a + f * this.c;
            this.f += e * this.b + f * this.d;
            this.c = c * this.a + d * this.c;
            this.d = c * this.b + d * this.d;

            this.a = aNew;
            this.b = bNew;
            return this;
        };
        /*\
         * Matrix.multLeft
         [ method ]
         **
         * Multiplies a passed affine transform to the left: M * this.
         - a (number)
         - b (number)
         - c (number)
         - d (number)
         - e (number)
         - f (number)
         * or
         - matrix (object) @Matrix
        \*/
        Matrix.prototype.multLeft = function (a, b, c, d, e, f) {
            if (a && a instanceof Matrix) {
                return this.multLeft(a.a, a.b, a.c, a.d, a.e, a.f);
            }
            var aNew = a * this.a + c * this.b,
                cNew = a * this.c + c * this.d,
                eNew = a * this.e + c * this.f + e;
            this.b = b * this.a + d * this.b;
            this.d = b * this.c + d * this.d;
            this.f = b * this.e + d * this.f + f;

            this.a = aNew;
            this.c = cNew;
            this.e = eNew;
            return this;
        };
        /*\
         * Matrix.invert
         [ method ]
         **
         * Returns an inverted version of the matrix
         = (object) @Matrix
        \*/
        matrixproto.invert = function () {
            var me = this,
                x = me.a * me.d - me.b * me.c;
            return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
        };
        /*\
         * Matrix.clone
         [ method ]
         **
         * Returns a copy of the matrix
         = (object) @Matrix
        \*/
        matrixproto.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
        };
        /*\
         * Matrix.translate
         [ method ]
         **
         * Translate the matrix
         - x (number) horizontal offset distance
         - y (number) vertical offset distance
        \*/
        matrixproto.translate = function (x, y) {
            this.e += x * this.a + y * this.c;
            this.f += x * this.b + y * this.d;
            return this;
        };
        /*\
         * Matrix.scale
         [ method ]
         **
         * Scales the matrix
         - x (number) amount to be scaled, with `1` resulting in no change
         - y (number) #optional amount to scale along the vertical axis. (Otherwise `x` applies to both axes.)
         - cx (number) #optional horizontal origin point from which to scale
         - cy (number) #optional vertical origin point from which to scale
         * Default cx, cy is the middle point of the element.
        \*/
        matrixproto.scale = function (x, y, cx, cy) {
            y == null && (y = x);
            (cx || cy) && this.translate(cx, cy);
            this.a *= x;
            this.b *= x;
            this.c *= y;
            this.d *= y;
            (cx || cy) && this.translate(-cx, -cy);
            return this;
        };
        /*\
         * Matrix.rotate
         [ method ]
         **
         * Rotates the matrix
         - a (number) angle of rotation, in degrees
         - x (number) horizontal origin point from which to rotate
         - y (number) vertical origin point from which to rotate
        \*/
        matrixproto.rotate = function (a, x, y) {
            a = Snap.rad(a);
            x = x || 0;
            y = y || 0;
            var cos = +math.cos(a).toFixed(9),
                sin = +math.sin(a).toFixed(9);
            this.add(cos, sin, -sin, cos, x, y);
            return this.add(1, 0, 0, 1, -x, -y);
        };
        /*\
         * Matrix.skewX
         [ method ]
         **
         * Skews the matrix along the x-axis
         - x (number) Angle to skew along the x-axis (in degrees).
        \*/
        matrixproto.skewX = function (x) {
            return this.skew(x, 0);
        };
        /*\
         * Matrix.skewY
         [ method ]
         **
         * Skews the matrix along the y-axis
         - y (number) Angle to skew along the y-axis (in degrees).
        \*/
        matrixproto.skewY = function (y) {
            return this.skew(0, y);
        };
        /*\
         * Matrix.skew
         [ method ]
         **
         * Skews the matrix
         - y (number) Angle to skew along the y-axis (in degrees).
         - x (number) Angle to skew along the x-axis (in degrees).
        \*/
        matrixproto.skew = function (x, y) {
            x = x || 0;
            y = y || 0;
            x = Snap.rad(x);
            y = Snap.rad(y);
            var c = math.tan(x).toFixed(9);
            var b = math.tan(y).toFixed(9);
            return this.add(1, b, c, 1, 0, 0);
        };
        /*\
         * Matrix.x
         [ method ]
         **
         * Returns x coordinate for given point after transformation described by the matrix. See also @Matrix.y
         - x (number)
         - y (number)
         = (number) x
        \*/
        matrixproto.x = function (x, y) {
            return x * this.a + y * this.c + this.e;
        };
        /*\
         * Matrix.y
         [ method ]
         **
         * Returns y coordinate for given point after transformation described by the matrix. See also @Matrix.x
         - x (number)
         - y (number)
         = (number) y
        \*/
        matrixproto.y = function (x, y) {
            return x * this.b + y * this.d + this.f;
        };
        matrixproto.get = function (i) {
            return +this[Str.fromCharCode(97 + i)].toFixed(4);
        };
        matrixproto.toString = function () {
            return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")";
        };
        matrixproto.offset = function () {
            return [this.e.toFixed(4), this.f.toFixed(4)];
        };
        function norm(a) {
            return a[0] * a[0] + a[1] * a[1];
        }
        function normalize(a) {
            var mag = math.sqrt(norm(a));
            a[0] && (a[0] /= mag);
            a[1] && (a[1] /= mag);
        }
        /*\
         * Matrix.determinant
         [ method ]
         **
         * Finds determinant of the given matrix.
         = (number) determinant
        \*/
        matrixproto.determinant = function () {
            return this.a * this.d - this.b * this.c;
        };
        /*\
         * Matrix.split
         [ method ]
         **
         * Splits matrix into primitive transformations
         = (object) in format:
         o dx (number) translation by x
         o dy (number) translation by y
         o scalex (number) scale by x
         o scaley (number) scale by y
         o shear (number) shear
         o rotate (number) rotation in deg
         o isSimple (boolean) could it be represented via simple transformations
        \*/
        matrixproto.split = function () {
            var out = {};
            // translation
            out.dx = this.e;
            out.dy = this.f;

            // scale and shear
            var row = [[this.a, this.b], [this.c, this.d]];
            out.scalex = math.sqrt(norm(row[0]));
            normalize(row[0]);

            out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
            row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

            out.scaley = math.sqrt(norm(row[1]));
            normalize(row[1]);
            out.shear /= out.scaley;

            if (this.determinant() < 0) {
                out.scalex = -out.scalex;
            }

            // rotation
            var sin = row[0][1],
                cos = row[1][1];
            if (cos < 0) {
                out.rotate = Snap.deg(math.acos(cos));
                if (sin < 0) {
                    out.rotate = 360 - out.rotate;
                }
            } else {
                out.rotate = Snap.deg(math.asin(sin));
            }

            out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
            out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
            out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
            return out;
        };
        /*\
         * Matrix.toTransformString
         [ method ]
         **
         * Returns transform string that represents given matrix
         = (string) transform string
        \*/
        matrixproto.toTransformString = function (shorter) {
            var s = shorter || this.split();
            if (!+s.shear.toFixed(9)) {
                s.scalex = +s.scalex.toFixed(4);
                s.scaley = +s.scaley.toFixed(4);
                s.rotate = +s.rotate.toFixed(4);
                return  (s.dx || s.dy ? "t" + [+s.dx.toFixed(4), +s.dy.toFixed(4)] : E) +
                        (s.rotate ? "r" + [+s.rotate.toFixed(4), 0, 0] : E) +
                        (s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : E);
            } else {
                return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
            }
        };
    })(Matrix.prototype);
    /*\
     * Snap.Matrix
     [ method ]
     **
     * Matrix constructor, extend on your own risk.
     * To create matrices use @Snap.matrix.
    \*/
    Snap.Matrix = Matrix;
    /*\
     * Snap.matrix
     [ method ]
     **
     * Utility method
     **
     * Returns a matrix based on the given parameters
     - a (number)
     - b (number)
     - c (number)
     - d (number)
     - e (number)
     - f (number)
     * or
     - svgMatrix (SVGMatrix)
     = (object) @Matrix
    \*/
    Snap.matrix = function (a, b, c, d, e, f) {
        return new Matrix(a, b, c, d, e, f);
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var has = "hasOwnProperty",
        make = Snap._.make,
        wrap = Snap._.wrap,
        is = Snap.is,
        getSomeDefs = Snap._.getSomeDefs,
        reURLValue = /^url\((['"]?)([^)]+)\1\)$/,
        $ = Snap._.$,
        URL = Snap.url,
        Str = String,
        separator = Snap._.separator,
        E = "";
    /*\
     * Snap.deurl
     [ method ]
     **
     * Unwraps path from `"url(<path>)"`.
     - value (string) url path
     = (string) unwrapped path
    \*/
    Snap.deurl = function (value) {
        var res = String(value).match(reURLValue);
        return res ? res[2] : value;
    }
    // Attributes event handlers
    eve.on("snap.util.attr.mask", function (value) {
        if (value instanceof Element || value instanceof Fragment) {
            eve.stop();
            if (value instanceof Fragment && value.node.childNodes.length == 1) {
                value = value.node.firstChild;
                getSomeDefs(this).appendChild(value);
                value = wrap(value);
            }
            if (value.type == "mask") {
                var mask = value;
            } else {
                mask = make("mask", getSomeDefs(this));
                mask.node.appendChild(value.node);
            }
            !mask.node.id && $(mask.node, {
                id: mask.id
            });
            $(this.node, {
                mask: URL(mask.id)
            });
        }
    });
    (function (clipIt) {
        eve.on("snap.util.attr.clip", clipIt);
        eve.on("snap.util.attr.clip-path", clipIt);
        eve.on("snap.util.attr.clipPath", clipIt);
    }(function (value) {
        if (value instanceof Element || value instanceof Fragment) {
            eve.stop();
            var clip,
                node = value.node;
            while (node) {
                if (node.nodeName === "clipPath") {
                    clip = new Element(node);
                    break;
                }
                if (node.nodeName === "svg") {
                    clip = undefined;
                    break;
                }
                node = node.parentNode;
            }
            if (!clip) {
                clip = make("clipPath", getSomeDefs(this));
                clip.node.appendChild(value.node);
                !clip.node.id && $(clip.node, {
                    id: clip.id
                });
            }
            $(this.node, {
                "clip-path": URL(clip.node.id || clip.id)
            });
        }
    }));
    function fillStroke(name) {
        return function (value) {
            eve.stop();
            if (value instanceof Fragment && value.node.childNodes.length == 1 &&
                (value.node.firstChild.tagName == "radialGradient" ||
                value.node.firstChild.tagName == "linearGradient" ||
                value.node.firstChild.tagName == "pattern")) {
                value = value.node.firstChild;
                getSomeDefs(this).appendChild(value);
                value = wrap(value);
            }
            if (value instanceof Element) {
                if (value.type == "radialGradient" || value.type == "linearGradient"
                   || value.type == "pattern") {
                    if (!value.node.id) {
                        $(value.node, {
                            id: value.id
                        });
                    }
                    var fill = URL(value.node.id);
                } else {
                    fill = value.attr(name);
                }
            } else {
                fill = Snap.color(value);
                if (fill.error) {
                    var grad = Snap(getSomeDefs(this).ownerSVGElement).gradient(value);
                    if (grad) {
                        if (!grad.node.id) {
                            $(grad.node, {
                                id: grad.id
                            });
                        }
                        fill = URL(grad.node.id);
                    } else {
                        fill = value;
                    }
                } else {
                    fill = Str(fill);
                }
            }
            var attrs = {};
            attrs[name] = fill;
            $(this.node, attrs);
            this.node.style[name] = E;
        };
    }
    eve.on("snap.util.attr.fill", fillStroke("fill"));
    eve.on("snap.util.attr.stroke", fillStroke("stroke"));
    var gradrg = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
    eve.on("snap.util.grad.parse", function parseGrad(string) {
        string = Str(string);
        var tokens = string.match(gradrg);
        if (!tokens) {
            return null;
        }
        var type = tokens[1],
            params = tokens[2],
            stops = tokens[3];
        params = params.split(/\s*,\s*/).map(function (el) {
            return +el == el ? +el : el;
        });
        if (params.length == 1 && params[0] == 0) {
            params = [];
        }
        stops = stops.split("-");
        stops = stops.map(function (el) {
            el = el.split(":");
            var out = {
                color: el[0]
            };
            if (el[1]) {
                out.offset = parseFloat(el[1]);
            }
            return out;
        });
        var len = stops.length,
            start = 0,
            j = 0;
        function seed(i, end) {
            var step = (end - start) / (i - j);
            for (var k = j; k < i; k++) {
                stops[k].offset = +(+start + step * (k - j)).toFixed(2);
            }
            j = i;
            start = end;
        }
        len--;
        for (var i = 0; i < len; i++) if ("offset" in stops[i]) {
            seed(i, stops[i].offset);
        }
        stops[len].offset = stops[len].offset || 100;
        seed(len, stops[len].offset);
        return {
            type: type,
            params: params,
            stops: stops
        };
    });

    eve.on("snap.util.attr.d", function (value) {
        eve.stop();
        if (is(value, "array") && is(value[0], "array")) {
            value = Snap.path.toString.call(value);
        }
        value = Str(value);
        if (value.match(/[ruo]/i)) {
            value = Snap.path.toAbsolute(value);
        }
        $(this.node, {d: value});
    })(-1);
    eve.on("snap.util.attr.#text", function (value) {
        eve.stop();
        value = Str(value);
        var txt = glob.doc.createTextNode(value);
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
        this.node.appendChild(txt);
    })(-1);
    eve.on("snap.util.attr.path", function (value) {
        eve.stop();
        this.attr({d: value});
    })(-1);
    eve.on("snap.util.attr.class", function (value) {
        eve.stop();
        this.node.className.baseVal = value;
    })(-1);
    eve.on("snap.util.attr.viewBox", function (value) {
        var vb;
        if (is(value, "object") && "x" in value) {
            vb = [value.x, value.y, value.width, value.height].join(" ");
        } else if (is(value, "array")) {
            vb = value.join(" ");
        } else {
            vb = value;
        }
        $(this.node, {
            viewBox: vb
        });
        eve.stop();
    })(-1);
    eve.on("snap.util.attr.transform", function (value) {
        this.transform(value);
        eve.stop();
    })(-1);
    eve.on("snap.util.attr.r", function (value) {
        if (this.type == "rect") {
            eve.stop();
            $(this.node, {
                rx: value,
                ry: value
            });
        }
    })(-1);
    eve.on("snap.util.attr.textpath", function (value) {
        eve.stop();
        if (this.type == "text") {
            var id, tp, node;
            if (!value && this.textPath) {
                tp = this.textPath;
                while (tp.node.firstChild) {
                    this.node.appendChild(tp.node.firstChild);
                }
                tp.remove();
                delete this.textPath;
                return;
            }
            if (is(value, "string")) {
                var defs = getSomeDefs(this),
                    path = wrap(defs.parentNode).path(value);
                defs.appendChild(path.node);
                id = path.id;
                path.attr({id: id});
            } else {
                value = wrap(value);
                if (value instanceof Element) {
                    id = value.attr("id");
                    if (!id) {
                        id = value.id;
                        value.attr({id: id});
                    }
                }
            }
            if (id) {
                tp = this.textPath;
                node = this.node;
                if (tp) {
                    tp.attr({"xlink:href": "#" + id});
                } else {
                    tp = $("textPath", {
                        "xlink:href": "#" + id
                    });
                    while (node.firstChild) {
                        tp.appendChild(node.firstChild);
                    }
                    node.appendChild(tp);
                    this.textPath = wrap(tp);
                }
            }
        }
    })(-1);
    eve.on("snap.util.attr.text", function (value) {
        if (this.type == "text") {
            var i = 0,
                node = this.node,
                tuner = function (chunk) {
                    var out = $("tspan");
                    if (is(chunk, "array")) {
                        for (var i = 0; i < chunk.length; i++) {
                            out.appendChild(tuner(chunk[i]));
                        }
                    } else {
                        out.appendChild(glob.doc.createTextNode(chunk));
                    }
                    out.normalize && out.normalize();
                    return out;
                };
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            var tuned = tuner(value);
            while (tuned.firstChild) {
                node.appendChild(tuned.firstChild);
            }
        }
        eve.stop();
    })(-1);
    function setFontSize(value) {
        eve.stop();
        if (value == +value) {
            value += "px";
        }
        this.node.style.fontSize = value;
    }
    eve.on("snap.util.attr.fontSize", setFontSize)(-1);
    eve.on("snap.util.attr.font-size", setFontSize)(-1);


    eve.on("snap.util.getattr.transform", function () {
        eve.stop();
        return this.transform();
    })(-1);
    eve.on("snap.util.getattr.textpath", function () {
        eve.stop();
        return this.textPath;
    })(-1);
    // Markers
    (function () {
        function getter(end) {
            return function () {
                eve.stop();
                var style = glob.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + end);
                if (style == "none") {
                    return style;
                } else {
                    return Snap(glob.doc.getElementById(style.match(reURLValue)[1]));
                }
            };
        }
        function setter(end) {
            return function (value) {
                eve.stop();
                var name = "marker" + end.charAt(0).toUpperCase() + end.substring(1);
                if (value == "" || !value) {
                    this.node.style[name] = "none";
                    return;
                }
                if (value.type == "marker") {
                    var id = value.node.id;
                    if (!id) {
                        $(value.node, {id: value.id});
                    }
                    this.node.style[name] = URL(id);
                    return;
                }
            };
        }
        eve.on("snap.util.getattr.marker-end", getter("end"))(-1);
        eve.on("snap.util.getattr.markerEnd", getter("end"))(-1);
        eve.on("snap.util.getattr.marker-start", getter("start"))(-1);
        eve.on("snap.util.getattr.markerStart", getter("start"))(-1);
        eve.on("snap.util.getattr.marker-mid", getter("mid"))(-1);
        eve.on("snap.util.getattr.markerMid", getter("mid"))(-1);
        eve.on("snap.util.attr.marker-end", setter("end"))(-1);
        eve.on("snap.util.attr.markerEnd", setter("end"))(-1);
        eve.on("snap.util.attr.marker-start", setter("start"))(-1);
        eve.on("snap.util.attr.markerStart", setter("start"))(-1);
        eve.on("snap.util.attr.marker-mid", setter("mid"))(-1);
        eve.on("snap.util.attr.markerMid", setter("mid"))(-1);
    }());
    eve.on("snap.util.getattr.r", function () {
        if (this.type == "rect" && $(this.node, "rx") == $(this.node, "ry")) {
            eve.stop();
            return $(this.node, "rx");
        }
    })(-1);
    function textExtract(node) {
        var out = [];
        var children = node.childNodes;
        for (var i = 0, ii = children.length; i < ii; i++) {
            var chi = children[i];
            if (chi.nodeType == 3) {
                out.push(chi.nodeValue);
            }
            if (chi.tagName == "tspan") {
                if (chi.childNodes.length == 1 && chi.firstChild.nodeType == 3) {
                    out.push(chi.firstChild.nodeValue);
                } else {
                    out.push(textExtract(chi));
                }
            }
        }
        return out;
    }
    eve.on("snap.util.getattr.text", function () {
        if (this.type == "text" || this.type == "tspan") {
            eve.stop();
            var out = textExtract(this.node);
            return out.length == 1 ? out[0] : out;
        }
    })(-1);
    eve.on("snap.util.getattr.#text", function () {
        return this.node.textContent;
    })(-1);
    eve.on("snap.util.getattr.fill", function (internal) {
        if (internal) {
            return;
        }
        eve.stop();
        var value = eve("snap.util.getattr.fill", this, true).firstDefined();
        return Snap(Snap.deurl(value)) || value;
    })(-1);
    eve.on("snap.util.getattr.stroke", function (internal) {
        if (internal) {
            return;
        }
        eve.stop();
        var value = eve("snap.util.getattr.stroke", this, true).firstDefined();
        return Snap(Snap.deurl(value)) || value;
    })(-1);
    eve.on("snap.util.getattr.viewBox", function () {
        eve.stop();
        var vb = $(this.node, "viewBox");
        if (vb) {
            vb = vb.split(separator);
            return Snap._.box(+vb[0], +vb[1], +vb[2], +vb[3]);
        } else {
            return;
        }
    })(-1);
    eve.on("snap.util.getattr.points", function () {
        var p = $(this.node, "points");
        eve.stop();
        if (p) {
            return p.split(separator);
        } else {
            return;
        }
    })(-1);
    eve.on("snap.util.getattr.path", function () {
        var p = $(this.node, "d");
        eve.stop();
        return p;
    })(-1);
    eve.on("snap.util.getattr.class", function () {
        return this.node.className.baseVal;
    })(-1);
    function getFontSize() {
        eve.stop();
        return this.node.style.fontSize;
    }
    eve.on("snap.util.getattr.fontSize", getFontSize)(-1);
    eve.on("snap.util.getattr.font-size", getFontSize)(-1);
});

// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var rgNotSpace = /\S+/g,
        rgBadSpace = /[\t\r\n\f]/g,
        rgTrim = /(^\s+|\s+$)/g,
        Str = String,
        elproto = Element.prototype;
    /*\
     * Element.addClass
     [ method ]
     **
     * Adds given class name or list of class names to the element.
     - value (string) class name or space separated list of class names
     **
     = (Element) original element.
    \*/
    elproto.addClass = function (value) {
        var classes = Str(value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;

        if (classes.length) {
            j = 0;
            while (clazz = classes[j++]) {
                pos = curClasses.indexOf(clazz);
                if (!~pos) {
                    curClasses.push(clazz);
                }
            }

            finalValue = curClasses.join(" ");
            if (className != finalValue) {
                elem.className.baseVal = finalValue;
            }
        }
        return this;
    };
    /*\
     * Element.removeClass
     [ method ]
     **
     * Removes given class name or list of class names from the element.
     - value (string) class name or space separated list of class names
     **
     = (Element) original element.
    \*/
    elproto.removeClass = function (value) {
        var classes = Str(value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;
        if (curClasses.length) {
            j = 0;
            while (clazz = classes[j++]) {
                pos = curClasses.indexOf(clazz);
                if (~pos) {
                    curClasses.splice(pos, 1);
                }
            }

            finalValue = curClasses.join(" ");
            if (className != finalValue) {
                elem.className.baseVal = finalValue;
            }
        }
        return this;
    };
    /*\
     * Element.hasClass
     [ method ]
     **
     * Checks if the element has a given class name in the list of class names applied to it.
     - value (string) class name
     **
     = (boolean) `true` if the element has given class
    \*/
    elproto.hasClass = function (value) {
        var elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [];
        return !!~curClasses.indexOf(value);
    };
    /*\
     * Element.toggleClass
     [ method ]
     **
     * Add or remove one or more classes from the element, depending on either
     * the class’s presence or the value of the `flag` argument.
     - value (string) class name or space separated list of class names
     - flag (boolean) value to determine whether the class should be added or removed
     **
     = (Element) original element.
    \*/
    elproto.toggleClass = function (value, flag) {
        if (flag != null) {
            if (flag) {
                return this.addClass(value);
            } else {
                return this.removeClass(value);
            }
        }
        var classes = (value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;
        j = 0;
        while (clazz = classes[j++]) {
            pos = curClasses.indexOf(clazz);
            if (~pos) {
                curClasses.splice(pos, 1);
            } else {
                curClasses.push(clazz);
            }
        }

        finalValue = curClasses.join(" ");
        if (className != finalValue) {
            elem.className.baseVal = finalValue;
        }
        return this;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var operators = {
            "+": function (x, y) {
                    return x + y;
                },
            "-": function (x, y) {
                    return x - y;
                },
            "/": function (x, y) {
                    return x / y;
                },
            "*": function (x, y) {
                    return x * y;
                }
        },
        Str = String,
        reUnit = /[a-z]+$/i,
        reAddon = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
    function getNumber(val) {
        return val;
    }
    function getUnit(unit) {
        return function (val) {
            return +val.toFixed(3) + unit;
        };
    }
    eve.on("snap.util.attr", function (val) {
        var plus = Str(val).match(reAddon);
        if (plus) {
            var evnt = eve.nt(),
                name = evnt.substring(evnt.lastIndexOf(".") + 1),
                a = this.attr(name),
                atr = {};
            eve.stop();
            var unit = plus[3] || "",
                aUnit = a.match(reUnit),
                op = operators[plus[1]];
            if (aUnit && aUnit == unit) {
                val = op(parseFloat(a), +plus[2]);
            } else {
                a = this.asPX(name);
                val = op(this.asPX(name), this.asPX(name, plus[2] + unit));
            }
            if (isNaN(a) || isNaN(val)) {
                return;
            }
            atr[name] = val;
            this.attr(atr);
        }
    })(-10);
    eve.on("snap.util.equal", function (name, b) {
        var A, B, a = Str(this.attr(name) || ""),
            el = this,
            bplus = Str(b).match(reAddon);
        if (bplus) {
            eve.stop();
            var unit = bplus[3] || "",
                aUnit = a.match(reUnit),
                op = operators[bplus[1]];
            if (aUnit && aUnit == unit) {
                return {
                    from: parseFloat(a),
                    to: op(parseFloat(a), +bplus[2]),
                    f: getUnit(aUnit)
                };
            } else {
                a = this.asPX(name);
                return {
                    from: a,
                    to: op(a, this.asPX(name, bplus[2] + unit)),
                    f: getNumber
                };
            }
        }
    })(-10);
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var proto = Paper.prototype,
        is = Snap.is;
    /*\
     * Paper.rect
     [ method ]
     *
     * Draws a rectangle
     **
     - x (number) x coordinate of the top left corner
     - y (number) y coordinate of the top left corner
     - width (number) width
     - height (number) height
     - rx (number) #optional horizontal radius for rounded corners, default is 0
     - ry (number) #optional vertical radius for rounded corners, default is rx or 0
     = (object) the `rect` element
     **
     > Usage
     | // regular rectangle
     | var c = paper.rect(10, 10, 50, 50);
     | // rectangle with rounded corners
     | var c = paper.rect(40, 40, 50, 50, 10);
    \*/
    proto.rect = function (x, y, w, h, rx, ry) {
        var attr;
        if (ry == null) {
            ry = rx;
        }
        if (is(x, "object") && x == "[object Object]") {
            attr = x;
        } else if (x != null) {
            attr = {
                x: x,
                y: y,
                width: w,
                height: h
            };
            if (rx != null) {
                attr.rx = rx;
                attr.ry = ry;
            }
        }
        return this.el("rect", attr);
    };
    /*\
     * Paper.circle
     [ method ]
     **
     * Draws a circle
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - r (number) radius
     = (object) the `circle` element
     **
     > Usage
     | var c = paper.circle(50, 50, 40);
    \*/
    proto.circle = function (cx, cy, r) {
        var attr;
        if (is(cx, "object") && cx == "[object Object]") {
            attr = cx;
        } else if (cx != null) {
            attr = {
                cx: cx,
                cy: cy,
                r: r
            };
        }
        return this.el("circle", attr);
    };

    var preload = (function () {
        function onerror() {
            this.parentNode.removeChild(this);
        }
        return function (src, f) {
            var img = glob.doc.createElement("img"),
                body = glob.doc.body;
            img.style.cssText = "position:absolute;left:-9999em;top:-9999em";
            img.onload = function () {
                f.call(img);
                img.onload = img.onerror = null;
                body.removeChild(img);
            };
            img.onerror = onerror;
            body.appendChild(img);
            img.src = src;
        };
    }());

    /*\
     * Paper.image
     [ method ]
     **
     * Places an image on the surface
     **
     - src (string) URI of the source image
     - x (number) x offset position
     - y (number) y offset position
     - width (number) width of the image
     - height (number) height of the image
     = (object) the `image` element
     * or
     = (object) Snap element object with type `image`
     **
     > Usage
     | var c = paper.image("apple.png", 10, 10, 80, 80);
    \*/
    proto.image = function (src, x, y, width, height) {
        var el = this.el("image");
        if (is(src, "object") && "src" in src) {
            el.attr(src);
        } else if (src != null) {
            var set = {
                "xlink:href": src,
                preserveAspectRatio: "none"
            };
            if (x != null && y != null) {
                set.x = x;
                set.y = y;
            }
            if (width != null && height != null) {
                set.width = width;
                set.height = height;
            } else {
                preload(src, function () {
                    Snap._.$(el.node, {
                        width: this.offsetWidth,
                        height: this.offsetHeight
                    });
                });
            }
            Snap._.$(el.node, set);
        }
        return el;
    };
    /*\
     * Paper.ellipse
     [ method ]
     **
     * Draws an ellipse
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - rx (number) horizontal radius
     - ry (number) vertical radius
     = (object) the `ellipse` element
     **
     > Usage
     | var c = paper.ellipse(50, 50, 40, 20);
    \*/
    proto.ellipse = function (cx, cy, rx, ry) {
        var attr;
        if (is(cx, "object") && cx == "[object Object]") {
            attr = cx;
        } else if (cx != null) {
            attr ={
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry
            };
        }
        return this.el("ellipse", attr);
    };
    // SIERRA Paper.path(): Unclear from the link what a Catmull-Rom curveto is, and why it would make life any easier.
    /*\
     * Paper.path
     [ method ]
     **
     * Creates a `<path>` element using the given string as the path's definition
     - pathString (string) #optional path string in SVG format
     * Path string consists of one-letter commands, followed by comma seprarated arguments in numerical form. Example:
     | "M10,20L30,40"
     * This example features two commands: `M`, with arguments `(10, 20)` and `L` with arguments `(30, 40)`. Uppercase letter commands express coordinates in absolute terms, while lowercase commands express them in relative terms from the most recently declared coordinates.
     *
     # <p>Here is short list of commands available, for more details see <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path's data attribute's format are described in the SVG specification.">SVG path string format</a> or <a href="https://developer.mozilla.org/en/SVG/Tutorial/Paths">article about path strings at MDN</a>.</p>
     # <table><thead><tr><th>Command</th><th>Name</th><th>Parameters</th></tr></thead><tbody>
     # <tr><td>M</td><td>moveto</td><td>(x y)+</td></tr>
     # <tr><td>Z</td><td>closepath</td><td>(none)</td></tr>
     # <tr><td>L</td><td>lineto</td><td>(x y)+</td></tr>
     # <tr><td>H</td><td>horizontal lineto</td><td>x+</td></tr>
     # <tr><td>V</td><td>vertical lineto</td><td>y+</td></tr>
     # <tr><td>C</td><td>curveto</td><td>(x1 y1 x2 y2 x y)+</td></tr>
     # <tr><td>S</td><td>smooth curveto</td><td>(x2 y2 x y)+</td></tr>
     # <tr><td>Q</td><td>quadratic Bézier curveto</td><td>(x1 y1 x y)+</td></tr>
     # <tr><td>T</td><td>smooth quadratic Bézier curveto</td><td>(x y)+</td></tr>
     # <tr><td>A</td><td>elliptical arc</td><td>(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+</td></tr>
     # <tr><td>R</td><td><a href="http://en.wikipedia.org/wiki/Catmull–Rom_spline#Catmull.E2.80.93Rom_spline">Catmull-Rom curveto</a>*</td><td>x1 y1 (x y)+</td></tr></tbody></table>
     * * _Catmull-Rom curveto_ is a not standard SVG command and added to make life easier.
     * Note: there is a special case when a path consists of only three commands: `M10,10R…z`. In this case the path connects back to its starting point.
     > Usage
     | var c = paper.path("M10 10L90 90");
     | // draw a diagonal line:
     | // move to 10,10, line to 90,90
    \*/
    proto.path = function (d) {
        var attr;
        if (is(d, "object") && !is(d, "array")) {
            attr = d;
        } else if (d) {
            attr = {d: d};
        }
        return this.el("path", attr);
    };
    /*\
     * Paper.g
     [ method ]
     **
     * Creates a group element
     **
     - varargs (…) #optional elements to nest within the group
     = (object) the `g` element
     **
     > Usage
     | var c1 = paper.circle(),
     |     c2 = paper.rect(),
     |     g = paper.g(c2, c1); // note that the order of elements is different
     * or
     | var c1 = paper.circle(),
     |     c2 = paper.rect(),
     |     g = paper.g();
     | g.add(c2, c1);
    \*/
    /*\
     * Paper.group
     [ method ]
     **
     * See @Paper.g
    \*/
    proto.group = proto.g = function (first) {
        var attr,
            el = this.el("g");
        if (arguments.length == 1 && first && !first.type) {
            el.attr(first);
        } else if (arguments.length) {
            el.add(Array.prototype.slice.call(arguments, 0));
        }
        return el;
    };
    /*\
     * Paper.svg
     [ method ]
     **
     * Creates a nested SVG element.
     - x (number) @optional X of the element
     - y (number) @optional Y of the element
     - width (number) @optional width of the element
     - height (number) @optional height of the element
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     **
     = (object) the `svg` element
     **
    \*/
    proto.svg = function (x, y, width, height, vbx, vby, vbw, vbh) {
        var attrs = {};
        if (is(x, "object") && y == null) {
            attrs = x;
        } else {
            if (x != null) {
                attrs.x = x;
            }
            if (y != null) {
                attrs.y = y;
            }
            if (width != null) {
                attrs.width = width;
            }
            if (height != null) {
                attrs.height = height;
            }
            if (vbx != null && vby != null && vbw != null && vbh != null) {
                attrs.viewBox = [vbx, vby, vbw, vbh];
            }
        }
        return this.el("svg", attrs);
    };
    /*\
     * Paper.mask
     [ method ]
     **
     * Equivalent in behaviour to @Paper.g, except it’s a mask.
     **
     = (object) the `mask` element
     **
    \*/
    proto.mask = function (first) {
        var attr,
            el = this.el("mask");
        if (arguments.length == 1 && first && !first.type) {
            el.attr(first);
        } else if (arguments.length) {
            el.add(Array.prototype.slice.call(arguments, 0));
        }
        return el;
    };
    /*\
     * Paper.ptrn
     [ method ]
     **
     * Equivalent in behaviour to @Paper.g, except it’s a pattern.
     - x (number) @optional X of the element
     - y (number) @optional Y of the element
     - width (number) @optional width of the element
     - height (number) @optional height of the element
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     **
     = (object) the `pattern` element
     **
    \*/
    proto.ptrn = function (x, y, width, height, vx, vy, vw, vh) {
        if (is(x, "object")) {
            var attr = x;
        } else {
            attr = {patternUnits: "userSpaceOnUse"};
            if (x) {
                attr.x = x;
            }
            if (y) {
                attr.y = y;
            }
            if (width != null) {
                attr.width = width;
            }
            if (height != null) {
                attr.height = height;
            }
            if (vx != null && vy != null && vw != null && vh != null) {
                attr.viewBox = [vx, vy, vw, vh];
            } else {
                attr.viewBox = [x || 0, y || 0, width || 0, height || 0];
            }
        }
        return this.el("pattern", attr);
    };
    /*\
     * Paper.use
     [ method ]
     **
     * Creates a <use> element.
     - id (string) @optional id of element to link
     * or
     - id (Element) @optional element to link
     **
     = (object) the `use` element
     **
    \*/
    proto.use = function (id) {
        if (id != null) {
            if (id instanceof Element) {
                if (!id.attr("id")) {
                    id.attr({id: Snap._.id(id)});
                }
                id = id.attr("id");
            }
            if (String(id).charAt() == "#") {
                id = id.substring(1);
            }
            return this.el("use", {"xlink:href": "#" + id});
        } else {
            return Element.prototype.use.call(this);
        }
    };
    /*\
     * Paper.symbol
     [ method ]
     **
     * Creates a <symbol> element.
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     = (object) the `symbol` element
     **
    \*/
    proto.symbol = function (vx, vy, vw, vh) {
        var attr = {};
        if (vx != null && vy != null && vw != null && vh != null) {
            attr.viewBox = [vx, vy, vw, vh];
        }

        return this.el("symbol", attr);
    };
    /*\
     * Paper.text
     [ method ]
     **
     * Draws a text string
     **
     - x (number) x coordinate position
     - y (number) y coordinate position
     - text (string|array) The text string to draw or array of strings to nest within separate `<tspan>` elements
     = (object) the `text` element
     **
     > Usage
     | var t1 = paper.text(50, 50, "Snap");
     | var t2 = paper.text(50, 50, ["S","n","a","p"]);
     | // Text path usage
     | t1.attr({textpath: "M10,10L100,100"});
     | // or
     | var pth = paper.path("M10,10L100,100");
     | t1.attr({textpath: pth});
    \*/
    proto.text = function (x, y, text) {
        var attr = {};
        if (is(x, "object")) {
            attr = x;
        } else if (x != null) {
            attr = {
                x: x,
                y: y,
                text: text || ""
            };
        }
        return this.el("text", attr);
    };
    /*\
     * Paper.line
     [ method ]
     **
     * Draws a line
     **
     - x1 (number) x coordinate position of the start
     - y1 (number) y coordinate position of the start
     - x2 (number) x coordinate position of the end
     - y2 (number) y coordinate position of the end
     = (object) the `line` element
     **
     > Usage
     | var t1 = paper.line(50, 50, 100, 100);
    \*/
    proto.line = function (x1, y1, x2, y2) {
        var attr = {};
        if (is(x1, "object")) {
            attr = x1;
        } else if (x1 != null) {
            attr = {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            };
        }
        return this.el("line", attr);
    };
    /*\
     * Paper.polyline
     [ method ]
     **
     * Draws a polyline
     **
     - points (array) array of points
     * or
     - varargs (…) points
     = (object) the `polyline` element
     **
     > Usage
     | var p1 = paper.polyline([10, 10, 100, 100]);
     | var p2 = paper.polyline(10, 10, 100, 100);
    \*/
    proto.polyline = function (points) {
        if (arguments.length > 1) {
            points = Array.prototype.slice.call(arguments, 0);
        }
        var attr = {};
        if (is(points, "object") && !is(points, "array")) {
            attr = points;
        } else if (points != null) {
            attr = {points: points};
        }
        return this.el("polyline", attr);
    };
    /*\
     * Paper.polygon
     [ method ]
     **
     * Draws a polygon. See @Paper.polyline
    \*/
    proto.polygon = function (points) {
        if (arguments.length > 1) {
            points = Array.prototype.slice.call(arguments, 0);
        }
        var attr = {};
        if (is(points, "object") && !is(points, "array")) {
            attr = points;
        } else if (points != null) {
            attr = {points: points};
        }
        return this.el("polygon", attr);
    };
    // gradients
    (function () {
        var $ = Snap._.$;
        // gradients' helpers
        /*\
         * Element.stops
         [ method ]
         **
         * Only for gradients!
         * Returns array of gradient stops elements.
         = (array) the stops array.
        \*/
        function Gstops() {
            return this.selectAll("stop");
        }
        /*\
         * Element.addStop
         [ method ]
         **
         * Only for gradients!
         * Adds another stop to the gradient.
         - color (string) stops color
         - offset (number) stops offset 0..100
         = (object) gradient element
        \*/
        function GaddStop(color, offset) {
            var stop = $("stop"),
                attr = {
                    offset: +offset + "%"
                };
            color = Snap.color(color);
            attr["stop-color"] = color.hex;
            if (color.opacity < 1) {
                attr["stop-opacity"] = color.opacity;
            }
            $(stop, attr);
            var stops = this.stops(),
                inserted;
            for (var i = 0; i < stops.length; i++) {
                var stopOffset = parseFloat(stops[i].attr("offset"));
                if (stopOffset > offset) {
                    this.node.insertBefore(stop, stops[i].node);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                this.node.appendChild(stop);
            }
            return this;
        }
        function GgetBBox() {
            if (this.type == "linearGradient") {
                var x1 = $(this.node, "x1") || 0,
                    x2 = $(this.node, "x2") || 1,
                    y1 = $(this.node, "y1") || 0,
                    y2 = $(this.node, "y2") || 0;
                return Snap._.box(x1, y1, math.abs(x2 - x1), math.abs(y2 - y1));
            } else {
                var cx = this.node.cx || .5,
                    cy = this.node.cy || .5,
                    r = this.node.r || 0;
                return Snap._.box(cx - r, cy - r, r * 2, r * 2);
            }
        }
        /*\
         * Element.setStops
         [ method ]
         **
         * Only for gradients!
         * Updates stops of the gradient based on passed gradient descriptor. See @Ppaer.gradient
         - str (string) gradient descriptor part after `()`.
         = (object) gradient element
         | var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
         | g.setStops("#fff-#000-#f00-#fc0");
        \*/
        function GsetStops(str) {
            var grad = str,
                stops = this.stops();
            if (typeof str == "string") {
                grad = eve("snap.util.grad.parse", null, "l(0,0,0,1)" + str).firstDefined().stops;
            }
            if (!Snap.is(grad, "array")) {
                return;
            }
            for (var i = 0; i < stops.length; i++) {
                if (grad[i]) {
                    var color = Snap.color(grad[i].color),
                        attr = {"offset": grad[i].offset + "%"};
                    attr["stop-color"] = color.hex;
                    if (color.opacity < 1) {
                        attr["stop-opacity"] = color.opacity;
                    }
                    stops[i].attr(attr);
                } else {
                    stops[i].remove();
                }
            }
            for (i = stops.length; i < grad.length; i++) {
                this.addStop(grad[i].color, grad[i].offset);
            }
            return this;
        }
        function gradient(defs, str) {
            var grad = eve("snap.util.grad.parse", null, str).firstDefined(),
                el;
            if (!grad) {
                return null;
            }
            grad.params.unshift(defs);
            if (grad.type.toLowerCase() == "l") {
                el = gradientLinear.apply(0, grad.params);
            } else {
                el = gradientRadial.apply(0, grad.params);
            }
            if (grad.type != grad.type.toLowerCase()) {
                $(el.node, {
                    gradientUnits: "userSpaceOnUse"
                });
            }
            var stops = grad.stops,
                len = stops.length;
            for (var i = 0; i < len; i++) {
                var stop = stops[i];
                el.addStop(stop.color, stop.offset);
            }
            return el;
        }
        function gradientLinear(defs, x1, y1, x2, y2) {
            var el = Snap._.make("linearGradient", defs);
            el.stops = Gstops;
            el.addStop = GaddStop;
            el.getBBox = GgetBBox;
            el.setStops = GsetStops;
            if (x1 != null) {
                $(el.node, {
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
            }
            return el;
        }
        function gradientRadial(defs, cx, cy, r, fx, fy) {
            var el = Snap._.make("radialGradient", defs);
            el.stops = Gstops;
            el.addStop = GaddStop;
            el.getBBox = GgetBBox;
            if (cx != null) {
                $(el.node, {
                    cx: cx,
                    cy: cy,
                    r: r
                });
            }
            if (fx != null && fy != null) {
                $(el.node, {
                    fx: fx,
                    fy: fy
                });
            }
            return el;
        }
        /*\
         * Paper.gradient
         [ method ]
         **
         * Creates a gradient element
         **
         - gradient (string) gradient descriptor
         > Gradient Descriptor
         * The gradient descriptor is an expression formatted as
         * follows: `<type>(<coords>)<colors>`.  The `<type>` can be
         * either linear or radial.  The uppercase `L` or `R` letters
         * indicate absolute coordinates offset from the SVG surface.
         * Lowercase `l` or `r` letters indicate coordinates
         * calculated relative to the element to which the gradient is
         * applied.  Coordinates specify a linear gradient vector as
         * `x1`, `y1`, `x2`, `y2`, or a radial gradient as `cx`, `cy`,
         * `r` and optional `fx`, `fy` specifying a focal point away
         * from the center of the circle. Specify `<colors>` as a list
         * of dash-separated CSS color values.  Each color may be
         * followed by a custom offset value, separated with a colon
         * character.
         > Examples
         * Linear gradient, relative from top-left corner to bottom-right
         * corner, from black through red to white:
         | var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
         * Linear gradient, absolute from (0, 0) to (100, 100), from black
         * through red at 25% to white:
         | var g = paper.gradient("L(0, 0, 100, 100)#000-#f00:25-#fff");
         * Radial gradient, relative from the center of the element with radius
         * half the width, from black to white:
         | var g = paper.gradient("r(0.5, 0.5, 0.5)#000-#fff");
         * To apply the gradient:
         | paper.circle(50, 50, 40).attr({
         |     fill: g
         | });
         = (object) the `gradient` element
        \*/
        proto.gradient = function (str) {
            return gradient(this.defs, str);
        };
        proto.gradientLinear = function (x1, y1, x2, y2) {
            return gradientLinear(this.defs, x1, y1, x2, y2);
        };
        proto.gradientRadial = function (cx, cy, r, fx, fy) {
            return gradientRadial(this.defs, cx, cy, r, fx, fy);
        };
        /*\
         * Paper.toString
         [ method ]
         **
         * Returns SVG code for the @Paper
         = (string) SVG code for the @Paper
        \*/
        proto.toString = function () {
            var doc = this.node.ownerDocument,
                f = doc.createDocumentFragment(),
                d = doc.createElement("div"),
                svg = this.node.cloneNode(true),
                res;
            f.appendChild(d);
            d.appendChild(svg);
            Snap._.$(svg, {xmlns: "http://www.w3.org/2000/svg"});
            res = d.innerHTML;
            f.removeChild(f.firstChild);
            return res;
        };
        /*\
         * Paper.toDataURL
         [ method ]
         **
         * Returns SVG code for the @Paper as Data URI string.
         = (string) Data URI string
        \*/
        proto.toDataURL = function () {
            if (window && window.btoa) {
                return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this)));
            }
        };
        /*\
         * Paper.clear
         [ method ]
         **
         * Removes all child nodes of the paper, except <defs>.
        \*/
        proto.clear = function () {
            var node = this.node.firstChild,
                next;
            while (node) {
                next = node.nextSibling;
                if (node.tagName != "defs") {
                    node.parentNode.removeChild(node);
                } else {
                    proto.clear.call({node: node});
                }
                node = next;
            }
        };
    }());
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
        is = Snap.is,
        clone = Snap._.clone,
        has = "hasOwnProperty",
        p2s = /,?([a-z]),?/gi,
        toFloat = parseFloat,
        math = Math,
        PI = math.PI,
        mmin = math.min,
        mmax = math.max,
        pow = math.pow,
        abs = math.abs;
    function paths(ps) {
        var p = paths.ps = paths.ps || {};
        if (p[ps]) {
            p[ps].sleep = 100;
        } else {
            p[ps] = {
                sleep: 100
            };
        }
        setTimeout(function () {
            for (var key in p) if (p[has](key) && key != ps) {
                p[key].sleep--;
                !p[key].sleep && delete p[key];
            }
        });
        return p[ps];
    }
    function box(x, y, width, height) {
        if (x == null) {
            x = y = width = height = 0;
        }
        if (y == null) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }
        return {
            x: x,
            y: y,
            width: width,
            w: width,
            height: height,
            h: height,
            x2: x + width,
            y2: y + height,
            cx: x + width / 2,
            cy: y + height / 2,
            r1: math.min(width, height) / 2,
            r2: math.max(width, height) / 2,
            r0: math.sqrt(width * width + height * height) / 2,
            path: rectPath(x, y, width, height),
            vb: [x, y, width, height].join(" ")
        };
    }
    function toString() {
        return this.join(",").replace(p2s, "$1");
    }
    function pathClone(pathArray) {
        var res = clone(pathArray);
        res.toString = toString;
        return res;
    }
    function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        if (length == null) {
            return bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
        } else {
            return findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y,
                getTotLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
        }
    }
    function getLengthFactory(istotal, subpath) {
        function O(val) {
            return +(+val).toFixed(3);
        }
        return Snap._.cacher(function (path, length, onlystart) {
            if (path instanceof Element) {
                path = path.attr("d");
            }
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += [
                                "C" + O(point.start.x),
                                O(point.start.y),
                                O(point.m.x),
                                O(point.m.y),
                                O(point.x),
                                O(point.y)
                            ];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = [
                                "M" + O(point.x),
                                O(point.y) + "C" + O(point.n.x),
                                O(point.n.y),
                                O(point.end.x),
                                O(point.end.y),
                                O(p[5]),
                                O(p[6])
                            ].join();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return point;
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p.shift() + p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
            return point;
        }, null, Snap._.clone);
    }
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            t13 = pow(t1, 3),
            t12 = pow(t1, 2),
            t2 = t * t,
            t3 = t2 * t,
            x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
            y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
            ax = t1 * p1x + t * c1x,
            ay = t1 * p1y + t * c1y,
            cx = t1 * c2x + t * p2x,
            cy = t1 * c2y + t * p2y,
            alpha = 90 - math.atan2(mx - nx, my - ny) * 180 / PI;
        // (mx > nx || my < ny) && (alpha += 180);
        return {
            x: x,
            y: y,
            m: {x: mx, y: my},
            n: {x: nx, y: ny},
            start: {x: ax, y: ay},
            end: {x: cx, y: cy},
            alpha: alpha
        };
    }
    function bezierBBox(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
        if (!Snap.is(p1x, "array")) {
            p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
        }
        var bbox = curveDim.apply(null, p1x);
        return box(
            bbox.min.x,
            bbox.min.y,
            bbox.max.x - bbox.min.x,
            bbox.max.y - bbox.min.y
        );
    }
    function isPointInsideBBox(bbox, x, y) {
        return  x >= bbox.x &&
                x <= bbox.x + bbox.width &&
                y >= bbox.y &&
                y <= bbox.y + bbox.height;
    }
    function isBBoxIntersect(bbox1, bbox2) {
        bbox1 = box(bbox1);
        bbox2 = box(bbox2);
        return isPointInsideBBox(bbox2, bbox1.x, bbox1.y)
            || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y)
            || isPointInsideBBox(bbox2, bbox1.x, bbox1.y2)
            || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2)
            || isPointInsideBBox(bbox1, bbox2.x, bbox2.y)
            || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y)
            || isPointInsideBBox(bbox1, bbox2.x, bbox2.y2)
            || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2)
            || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x
                || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x)
            && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y
                || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
    }
    function base3(t, p1, p2, p3, p4) {
        var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
            t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
        return t * t2 - 3 * p1 + 3 * p2;
    }
    function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
        if (z == null) {
            z = 1;
        }
        z = z > 1 ? 1 : z < 0 ? 0 : z;
        var z2 = z / 2,
            n = 12,
            Tvalues = [-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],
            Cvalues = [0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472],
            sum = 0;
        for (var i = 0; i < n; i++) {
            var ct = z2 * Tvalues[i] + z2,
                xbase = base3(ct, x1, x2, x3, x4),
                ybase = base3(ct, y1, y2, y3, y4),
                comb = xbase * xbase + ybase * ybase;
            sum += Cvalues[i] * math.sqrt(comb);
        }
        return z2 * sum;
    }
    function getTotLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
        if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
            return;
        }
        var t = 1,
            step = t / 2,
            t2 = t - step,
            l,
            e = .01;
        l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
        while (abs(l - ll) > e) {
            step /= 2;
            t2 += (l < ll ? 1 : -1) * step;
            l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
        }
        return t2;
    }
    function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        if (
            mmax(x1, x2) < mmin(x3, x4) ||
            mmin(x1, x2) > mmax(x3, x4) ||
            mmax(y1, y2) < mmin(y3, y4) ||
            mmin(y1, y2) > mmax(y3, y4)
        ) {
            return;
        }
        var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
            ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
            denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (!denominator) {
            return;
        }
        var px = nx / denominator,
            py = ny / denominator,
            px2 = +px.toFixed(2),
            py2 = +py.toFixed(2);
        if (
            px2 < +mmin(x1, x2).toFixed(2) ||
            px2 > +mmax(x1, x2).toFixed(2) ||
            px2 < +mmin(x3, x4).toFixed(2) ||
            px2 > +mmax(x3, x4).toFixed(2) ||
            py2 < +mmin(y1, y2).toFixed(2) ||
            py2 > +mmax(y1, y2).toFixed(2) ||
            py2 < +mmin(y3, y4).toFixed(2) ||
            py2 > +mmax(y3, y4).toFixed(2)
        ) {
            return;
        }
        return {x: px, y: py};
    }
    function inter(bez1, bez2) {
        return interHelper(bez1, bez2);
    }
    function interCount(bez1, bez2) {
        return interHelper(bez1, bez2, 1);
    }
    function interHelper(bez1, bez2, justCount) {
        var bbox1 = bezierBBox(bez1),
            bbox2 = bezierBBox(bez2);
        if (!isBBoxIntersect(bbox1, bbox2)) {
            return justCount ? 0 : [];
        }
        var l1 = bezlen.apply(0, bez1),
            l2 = bezlen.apply(0, bez2),
            n1 = ~~(l1 / 8),
            n2 = ~~(l2 / 8),
            dots1 = [],
            dots2 = [],
            xy = {},
            res = justCount ? 0 : [];
        for (var i = 0; i < n1 + 1; i++) {
            var p = findDotsAtSegment.apply(0, bez1.concat(i / n1));
            dots1.push({x: p.x, y: p.y, t: i / n1});
        }
        for (i = 0; i < n2 + 1; i++) {
            p = findDotsAtSegment.apply(0, bez2.concat(i / n2));
            dots2.push({x: p.x, y: p.y, t: i / n2});
        }
        for (i = 0; i < n1; i++) {
            for (var j = 0; j < n2; j++) {
                var di = dots1[i],
                    di1 = dots1[i + 1],
                    dj = dots2[j],
                    dj1 = dots2[j + 1],
                    ci = abs(di1.x - di.x) < .001 ? "y" : "x",
                    cj = abs(dj1.x - dj.x) < .001 ? "y" : "x",
                    is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
                if (is) {
                    if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
                        continue;
                    }
                    xy[is.x.toFixed(4)] = is.y.toFixed(4);
                    var t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
                        t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
                    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
                        if (justCount) {
                            res++;
                        } else {
                            res.push({
                                x: is.x,
                                y: is.y,
                                t1: t1,
                                t2: t2
                            });
                        }
                    }
                }
            }
        }
        return res;
    }
    function pathIntersection(path1, path2) {
        return interPathHelper(path1, path2);
    }
    function pathIntersectionNumber(path1, path2) {
        return interPathHelper(path1, path2, 1);
    }
    function interPathHelper(path1, path2, justCount) {
        path1 = path2curve(path1);
        path2 = path2curve(path2);
        var x1, y1, x2, y2, x1m, y1m, x2m, y2m, bez1, bez2,
            res = justCount ? 0 : [];
        for (var i = 0, ii = path1.length; i < ii; i++) {
            var pi = path1[i];
            if (pi[0] == "M") {
                x1 = x1m = pi[1];
                y1 = y1m = pi[2];
            } else {
                if (pi[0] == "C") {
                    bez1 = [x1, y1].concat(pi.slice(1));
                    x1 = bez1[6];
                    y1 = bez1[7];
                } else {
                    bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
                    x1 = x1m;
                    y1 = y1m;
                }
                for (var j = 0, jj = path2.length; j < jj; j++) {
                    var pj = path2[j];
                    if (pj[0] == "M") {
                        x2 = x2m = pj[1];
                        y2 = y2m = pj[2];
                    } else {
                        if (pj[0] == "C") {
                            bez2 = [x2, y2].concat(pj.slice(1));
                            x2 = bez2[6];
                            y2 = bez2[7];
                        } else {
                            bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
                            x2 = x2m;
                            y2 = y2m;
                        }
                        var intr = interHelper(bez1, bez2, justCount);
                        if (justCount) {
                            res += intr;
                        } else {
                            for (var k = 0, kk = intr.length; k < kk; k++) {
                                intr[k].segment1 = i;
                                intr[k].segment2 = j;
                                intr[k].bez1 = bez1;
                                intr[k].bez2 = bez2;
                            }
                            res = res.concat(intr);
                        }
                    }
                }
            }
        }
        return res;
    }
    function isPointInsidePath(path, x, y) {
        var bbox = pathBBox(path);
        return isPointInsideBBox(bbox, x, y) &&
               interPathHelper(path, [["M", x, y], ["H", bbox.x2 + 10]], 1) % 2 == 1;
    }
    function pathBBox(path) {
        var pth = paths(path);
        if (pth.bbox) {
            return clone(pth.bbox);
        }
        if (!path) {
            return box();
        }
        path = path2curve(path);
        var x = 0,
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path.length; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X.push(x);
                Y.push(y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X.concat(dim.min.x, dim.max.x);
                Y = Y.concat(dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin.apply(0, X),
            ymin = mmin.apply(0, Y),
            xmax = mmax.apply(0, X),
            ymax = mmax.apply(0, Y),
            bb = box(xmin, ymin, xmax - xmin, ymax - ymin);
        pth.bbox = clone(bb);
        return bb;
    }
    function rectPath(x, y, w, h, r) {
        if (r) {
            return [
                ["M", +x + +r, y],
                ["l", w - r * 2, 0],
                ["a", r, r, 0, 0, 1, r, r],
                ["l", 0, h - r * 2],
                ["a", r, r, 0, 0, 1, -r, r],
                ["l", r * 2 - w, 0],
                ["a", r, r, 0, 0, 1, -r, -r],
                ["l", 0, r * 2 - h],
                ["a", r, r, 0, 0, 1, r, -r],
                ["z"]
            ];
        }
        var res = [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
        res.toString = toString;
        return res;
    }
    function ellipsePath(x, y, rx, ry, a) {
        if (a == null && ry == null) {
            ry = rx;
        }
        x = +x;
        y = +y;
        rx = +rx;
        ry = +ry;
        if (a != null) {
            var rad = Math.PI / 180,
                x1 = x + rx * Math.cos(-ry * rad),
                x2 = x + rx * Math.cos(-a * rad),
                y1 = y + rx * Math.sin(-ry * rad),
                y2 = y + rx * Math.sin(-a * rad),
                res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
        } else {
            res = [
                ["M", x, y],
                ["m", 0, -ry],
                ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
                ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
                ["z"]
            ];
        }
        res.toString = toString;
        return res;
    }
    var unit2px = Snap._unit2px,
        getPath = {
        path: function (el) {
            return el.attr("path");
        },
        circle: function (el) {
            var attr = unit2px(el);
            return ellipsePath(attr.cx, attr.cy, attr.r);
        },
        ellipse: function (el) {
            var attr = unit2px(el);
            return ellipsePath(attr.cx || 0, attr.cy || 0, attr.rx, attr.ry);
        },
        rect: function (el) {
            var attr = unit2px(el);
            return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height, attr.rx, attr.ry);
        },
        image: function (el) {
            var attr = unit2px(el);
            return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height);
        },
        line: function (el) {
            return "M" + [el.attr("x1") || 0, el.attr("y1") || 0, el.attr("x2"), el.attr("y2")];
        },
        polyline: function (el) {
            return "M" + el.attr("points");
        },
        polygon: function (el) {
            return "M" + el.attr("points") + "z";
        },
        deflt: function (el) {
            var bbox = el.node.getBBox();
            return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
        }
    };
    function pathToRelative(pathArray) {
        var pth = paths(pathArray),
            lowerCase = String.prototype.toLowerCase;
        if (pth.rel) {
            return pathClone(pth.rel);
        }
        if (!Snap.is(pathArray, "array") || !Snap.is(pathArray && pathArray[0], "array")) {
            pathArray = Snap.parsePathString(pathArray);
        }
        var res = [],
            x = 0,
            y = 0,
            mx = 0,
            my = 0,
            start = 0;
        if (pathArray[0][0] == "M") {
            x = pathArray[0][1];
            y = pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res.push(["M", x, y]);
        }
        for (var i = start, ii = pathArray.length; i < ii; i++) {
            var r = res[i] = [],
                pa = pathArray[i];
            if (pa[0] != lowerCase.call(pa[0])) {
                r[0] = lowerCase.call(pa[0]);
                switch (r[0]) {
                    case "a":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +(pa[6] - x).toFixed(3);
                        r[7] = +(pa[7] - y).toFixed(3);
                        break;
                    case "v":
                        r[1] = +(pa[1] - y).toFixed(3);
                        break;
                    case "m":
                        mx = pa[1];
                        my = pa[2];
                    default:
                        for (var j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +(pa[j] - (j % 2 ? x : y)).toFixed(3);
                        }
                }
            } else {
                r = res[i] = [];
                if (pa[0] == "m") {
                    mx = pa[1] + x;
                    my = pa[2] + y;
                }
                for (var k = 0, kk = pa.length; k < kk; k++) {
                    res[i][k] = pa[k];
                }
            }
            var len = res[i].length;
            switch (res[i][0]) {
                case "z":
                    x = mx;
                    y = my;
                    break;
                case "h":
                    x += +res[i][len - 1];
                    break;
                case "v":
                    y += +res[i][len - 1];
                    break;
                default:
                    x += +res[i][len - 2];
                    y += +res[i][len - 1];
            }
        }
        res.toString = toString;
        pth.rel = pathClone(res);
        return res;
    }
    function pathToAbsolute(pathArray) {
        var pth = paths(pathArray);
        if (pth.abs) {
            return pathClone(pth.abs);
        }
        if (!is(pathArray, "array") || !is(pathArray && pathArray[0], "array")) { // rough assumption
            pathArray = Snap.parsePathString(pathArray);
        }
        if (!pathArray || !pathArray.length) {
            return [["M", 0, 0]];
        }
        var res = [],
            x = 0,
            y = 0,
            mx = 0,
            my = 0,
            start = 0,
            pa0;
        if (pathArray[0][0] == "M") {
            x = +pathArray[0][1];
            y = +pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res[0] = ["M", x, y];
        }
        var crz = pathArray.length == 3 &&
            pathArray[0][0] == "M" &&
            pathArray[1][0].toUpperCase() == "R" &&
            pathArray[2][0].toUpperCase() == "Z";
        for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
            res.push(r = []);
            pa = pathArray[i];
            pa0 = pa[0];
            if (pa0 != pa0.toUpperCase()) {
                r[0] = pa0.toUpperCase();
                switch (r[0]) {
                    case "A":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +pa[6] + x;
                        r[7] = +pa[7] + y;
                        break;
                    case "V":
                        r[1] = +pa[1] + y;
                        break;
                    case "H":
                        r[1] = +pa[1] + x;
                        break;
                    case "R":
                        var dots = [x, y].concat(pa.slice(1));
                        for (var j = 2, jj = dots.length; j < jj; j++) {
                            dots[j] = +dots[j] + x;
                            dots[++j] = +dots[j] + y;
                        }
                        res.pop();
                        res = res.concat(catmullRom2bezier(dots, crz));
                        break;
                    case "O":
                        res.pop();
                        dots = ellipsePath(x, y, pa[1], pa[2]);
                        dots.push(dots[0]);
                        res = res.concat(dots);
                        break;
                    case "U":
                        res.pop();
                        res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                        r = ["U"].concat(res[res.length - 1].slice(-2));
                        break;
                    case "M":
                        mx = +pa[1] + x;
                        my = +pa[2] + y;
                    default:
                        for (j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +pa[j] + (j % 2 ? x : y);
                        }
                }
            } else if (pa0 == "R") {
                dots = [x, y].concat(pa.slice(1));
                res.pop();
                res = res.concat(catmullRom2bezier(dots, crz));
                r = ["R"].concat(pa.slice(-2));
            } else if (pa0 == "O") {
                res.pop();
                dots = ellipsePath(x, y, pa[1], pa[2]);
                dots.push(dots[0]);
                res = res.concat(dots);
            } else if (pa0 == "U") {
                res.pop();
                res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                r = ["U"].concat(res[res.length - 1].slice(-2));
            } else {
                for (var k = 0, kk = pa.length; k < kk; k++) {
                    r[k] = pa[k];
                }
            }
            pa0 = pa0.toUpperCase();
            if (pa0 != "O") {
                switch (r[0]) {
                    case "Z":
                        x = +mx;
                        y = +my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    case "M":
                        mx = r[r.length - 2];
                        my = r[r.length - 1];
                    default:
                        x = r[r.length - 2];
                        y = r[r.length - 1];
                }
            }
        }
        res.toString = toString;
        pth.abs = pathClone(res);
        return res;
    }
    function l2c(x1, y1, x2, y2) {
        return [x1, y1, x2, y2, x2, y2];
    }
    function q2c(x1, y1, ax, ay, x2, y2) {
        var _13 = 1 / 3,
            _23 = 2 / 3;
        return [
                _13 * x1 + _23 * ax,
                _13 * y1 + _23 * ay,
                _13 * x2 + _23 * ax,
                _13 * y2 + _23 * ay,
                x2,
                y2
            ];
    }
    function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
        // for more information of where this math came from visit:
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
        var _120 = PI * 120 / 180,
            rad = PI / 180 * (+angle || 0),
            res = [],
            xy,
            rotate = Snap._.cacher(function (x, y, rad) {
                var X = x * math.cos(rad) - y * math.sin(rad),
                    Y = x * math.sin(rad) + y * math.cos(rad);
                return {x: X, y: Y};
            });
        if (!rx || !ry) {
            return [x1, y1, x2, y2, x2, y2];
        }
        if (!recursive) {
            xy = rotate(x1, y1, -rad);
            x1 = xy.x;
            y1 = xy.y;
            xy = rotate(x2, y2, -rad);
            x2 = xy.x;
            y2 = xy.y;
            var cos = math.cos(PI / 180 * angle),
                sin = math.sin(PI / 180 * angle),
                x = (x1 - x2) / 2,
                y = (y1 - y2) / 2;
            var h = x * x / (rx * rx) + y * y / (ry * ry);
            if (h > 1) {
                h = math.sqrt(h);
                rx = h * rx;
                ry = h * ry;
            }
            var rx2 = rx * rx,
                ry2 = ry * ry,
                k = (large_arc_flag == sweep_flag ? -1 : 1) *
                    math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                cx = k * rx * y / ry + (x1 + x2) / 2,
                cy = k * -ry * x / rx + (y1 + y2) / 2,
                f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                f2 = math.asin(((y2 - cy) / ry).toFixed(9));

            f1 = x1 < cx ? PI - f1 : f1;
            f2 = x2 < cx ? PI - f2 : f2;
            f1 < 0 && (f1 = PI * 2 + f1);
            f2 < 0 && (f2 = PI * 2 + f2);
            if (sweep_flag && f1 > f2) {
                f1 = f1 - PI * 2;
            }
            if (!sweep_flag && f2 > f1) {
                f2 = f2 - PI * 2;
            }
        } else {
            f1 = recursive[0];
            f2 = recursive[1];
            cx = recursive[2];
            cy = recursive[3];
        }
        var df = f2 - f1;
        if (abs(df) > _120) {
            var f2old = f2,
                x2old = x2,
                y2old = y2;
            f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
            x2 = cx + rx * math.cos(f2);
            y2 = cy + ry * math.sin(f2);
            res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
        }
        df = f2 - f1;
        var c1 = math.cos(f1),
            s1 = math.sin(f1),
            c2 = math.cos(f2),
            s2 = math.sin(f2),
            t = math.tan(df / 4),
            hx = 4 / 3 * rx * t,
            hy = 4 / 3 * ry * t,
            m1 = [x1, y1],
            m2 = [x1 + hx * s1, y1 - hy * c1],
            m3 = [x2 + hx * s2, y2 - hy * c2],
            m4 = [x2, y2];
        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];
        if (recursive) {
            return [m2, m3, m4].concat(res);
        } else {
            res = [m2, m3, m4].concat(res).join().split(",");
            var newres = [];
            for (var i = 0, ii = res.length; i < ii; i++) {
                newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
            }
            return newres;
        }
    }
    function findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t;
        return {
            x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
            y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
        };
    }

    // Returns bounding box of cubic bezier curve.
    // Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
    // Original version: NISHIO Hirokazu
    // Modifications: https://github.com/timo22345
    function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
        var tvalues = [],
            bounds = [[], []],
            a, b, c, t, t1, t2, b2ac, sqrtb2ac;
        for (var i = 0; i < 2; ++i) {
            if (i == 0) {
                b = 6 * x0 - 12 * x1 + 6 * x2;
                a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
                c = 3 * x1 - 3 * x0;
            } else {
                b = 6 * y0 - 12 * y1 + 6 * y2;
                a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                c = 3 * y1 - 3 * y0;
            }
            if (abs(a) < 1e-12) {
                if (abs(b) < 1e-12) {
                    continue;
                }
                t = -c / b;
                if (0 < t && t < 1) {
                    tvalues.push(t);
                }
                continue;
            }
            b2ac = b * b - 4 * c * a;
            sqrtb2ac = math.sqrt(b2ac);
            if (b2ac < 0) {
                continue;
            }
            t1 = (-b + sqrtb2ac) / (2 * a);
            if (0 < t1 && t1 < 1) {
                tvalues.push(t1);
            }
            t2 = (-b - sqrtb2ac) / (2 * a);
            if (0 < t2 && t2 < 1) {
                tvalues.push(t2);
            }
        }

        var x, y, j = tvalues.length,
            jlen = j,
            mt;
        while (j--) {
            t = tvalues[j];
            mt = 1 - t;
            bounds[0][j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
            bounds[1][j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
        }

        bounds[0][jlen] = x0;
        bounds[1][jlen] = y0;
        bounds[0][jlen + 1] = x3;
        bounds[1][jlen + 1] = y3;
        bounds[0].length = bounds[1].length = jlen + 2;


        return {
          min: {x: mmin.apply(0, bounds[0]), y: mmin.apply(0, bounds[1])},
          max: {x: mmax.apply(0, bounds[0]), y: mmax.apply(0, bounds[1])}
        };
    }

    function path2curve(path, path2) {
        var pth = !path2 && paths(path);
        if (!path2 && pth.curve) {
            return pathClone(pth.curve);
        }
        var p = pathToAbsolute(path),
            p2 = path2 && pathToAbsolute(path2),
            attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
            attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
            processPath = function (path, d, pcom) {
                var nx, ny;
                if (!path) {
                    return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                }
                !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
                switch (path[0]) {
                    case "M":
                        d.X = path[1];
                        d.Y = path[2];
                        break;
                    case "A":
                        path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
                        break;
                    case "S":
                        if (pcom == "C" || pcom == "S") { // In "S" case we have to take into account, if the previous command is C/S.
                            nx = d.x * 2 - d.bx;          // And reflect the previous
                            ny = d.y * 2 - d.by;          // command's control point relative to the current point.
                        }
                        else {                            // or some else or nothing
                            nx = d.x;
                            ny = d.y;
                        }
                        path = ["C", nx, ny].concat(path.slice(1));
                        break;
                    case "T":
                        if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
                            d.qx = d.x * 2 - d.qx;        // And make a reflection similar
                            d.qy = d.y * 2 - d.qy;        // to case "S".
                        }
                        else {                            // or something else or nothing
                            d.qx = d.x;
                            d.qy = d.y;
                        }
                        path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                        break;
                    case "Q":
                        d.qx = path[1];
                        d.qy = path[2];
                        path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                        break;
                    case "L":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
                        break;
                    case "H":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
                        break;
                    case "V":
                        path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
                        break;
                    case "Z":
                        path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
                        break;
                }
                return path;
            },
            fixArc = function (pp, i) {
                if (pp[i].length > 7) {
                    pp[i].shift();
                    var pi = pp[i];
                    while (pi.length) {
                        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
                        p2 && (pcoms2[i] = "A"); // the same as above
                        pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
                    }
                    pp.splice(i, 1);
                    ii = mmax(p.length, p2 && p2.length || 0);
                }
            },
            fixM = function (path1, path2, a1, a2, i) {
                if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                    path2.splice(i, 0, ["M", a2.x, a2.y]);
                    a1.bx = 0;
                    a1.by = 0;
                    a1.x = path1[i][1];
                    a1.y = path1[i][2];
                    ii = mmax(p.length, p2 && p2.length || 0);
                }
            },
            pcoms1 = [], // path commands of original path p
            pcoms2 = [], // path commands of original path p2
            pfirst = "", // temporary holder for original path command
            pcom = ""; // holder for previous path command of original path
        for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
            p[i] && (pfirst = p[i][0]); // save current path command

            if (pfirst != "C") // C is not saved yet, because it may be result of conversion
            {
                pcoms1[i] = pfirst; // Save current path command
                i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
            }
            p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

            if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
            // which may produce multiple C:s
            // so we have to make sure that C is also C in original path

            fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

            if (p2) { // the same procedures is done to p2
                p2[i] && (pfirst = p2[i][0]);
                if (pfirst != "C") {
                    pcoms2[i] = pfirst;
                    i && (pcom = pcoms2[i - 1]);
                }
                p2[i] = processPath(p2[i], attrs2, pcom);

                if (pcoms2[i] != "A" && pfirst == "C") {
                    pcoms2[i] = "C";
                }

                fixArc(p2, i);
            }
            fixM(p, p2, attrs, attrs2, i);
            fixM(p2, p, attrs2, attrs, i);
            var seg = p[i],
                seg2 = p2 && p2[i],
                seglen = seg.length,
                seg2len = p2 && seg2.length;
            attrs.x = seg[seglen - 2];
            attrs.y = seg[seglen - 1];
            attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
            attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
            attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
            attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
            attrs2.x = p2 && seg2[seg2len - 2];
            attrs2.y = p2 && seg2[seg2len - 1];
        }
        if (!p2) {
            pth.curve = pathClone(p);
        }
        return p2 ? [p, p2] : p;
    }
    function mapPath(path, matrix) {
        if (!matrix) {
            return path;
        }
        var x, y, i, j, ii, jj, pathi;
        path = path2curve(path);
        for (i = 0, ii = path.length; i < ii; i++) {
            pathi = path[i];
            for (j = 1, jj = pathi.length; j < jj; j += 2) {
                x = matrix.x(pathi[j], pathi[j + 1]);
                y = matrix.y(pathi[j], pathi[j + 1]);
                pathi[j] = x;
                pathi[j + 1] = y;
            }
        }
        return path;
    }

    // http://schepers.cc/getting-to-the-point
    function catmullRom2bezier(crp, z) {
        var d = [];
        for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
            var p = [
                        {x: +crp[i - 2], y: +crp[i - 1]},
                        {x: +crp[i],     y: +crp[i + 1]},
                        {x: +crp[i + 2], y: +crp[i + 3]},
                        {x: +crp[i + 4], y: +crp[i + 5]}
                    ];
            if (z) {
                if (!i) {
                    p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
                } else if (iLen - 4 == i) {
                    p[3] = {x: +crp[0], y: +crp[1]};
                } else if (iLen - 2 == i) {
                    p[2] = {x: +crp[0], y: +crp[1]};
                    p[3] = {x: +crp[2], y: +crp[3]};
                }
            } else {
                if (iLen - 4 == i) {
                    p[3] = p[2];
                } else if (!i) {
                    p[0] = {x: +crp[i], y: +crp[i + 1]};
                }
            }
            d.push(["C",
                  (-p[0].x + 6 * p[1].x + p[2].x) / 6,
                  (-p[0].y + 6 * p[1].y + p[2].y) / 6,
                  (p[1].x + 6 * p[2].x - p[3].x) / 6,
                  (p[1].y + 6*p[2].y - p[3].y) / 6,
                  p[2].x,
                  p[2].y
            ]);
        }

        return d;
    }

    // export
    Snap.path = paths;

    /*\
     * Snap.path.getTotalLength
     [ method ]
     **
     * Returns the length of the given path in pixels
     **
     - path (string) SVG path string
     **
     = (number) length
    \*/
    Snap.path.getTotalLength = getTotalLength;
    /*\
     * Snap.path.getPointAtLength
     [ method ]
     **
     * Returns the coordinates of the point located at the given length along the given path
     **
     - path (string) SVG path string
     - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate,
     o     y: (number) y coordinate,
     o     alpha: (number) angle of derivative
     o }
    \*/
    Snap.path.getPointAtLength = getPointAtLength;
    /*\
     * Snap.path.getSubpath
     [ method ]
     **
     * Returns the subpath of a given path between given start and end lengths
     **
     - path (string) SVG path string
     - from (number) length, in pixels, from the start of the path to the start of the segment
     - to (number) length, in pixels, from the start of the path to the end of the segment
     **
     = (string) path string definition for the segment
    \*/
    Snap.path.getSubpath = function (path, from, to) {
        if (this.getTotalLength(path) - to < 1e-6) {
            return getSubpathsAtLength(path, from).end;
        }
        var a = getSubpathsAtLength(path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };
    /*\
     * Element.getTotalLength
     [ method ]
     **
     * Returns the length of the path in pixels (only works for `path` elements)
     = (number) length
    \*/
    elproto.getTotalLength = function () {
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
    };
    // SIERRA Element.getPointAtLength()/Element.getTotalLength(): If a <path> is broken into different segments, is the jump distance to the new coordinates set by the _M_ or _m_ commands calculated as part of the path's total length?
    /*\
     * Element.getPointAtLength
     [ method ]
     **
     * Returns coordinates of the point located at the given length on the given path (only works for `path` elements)
     **
     - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate,
     o     y: (number) y coordinate,
     o     alpha: (number) angle of derivative
     o }
    \*/
    elproto.getPointAtLength = function (length) {
        return getPointAtLength(this.attr("d"), length);
    };
    // SIERRA Element.getSubpath(): Similar to the problem for Element.getPointAtLength(). Unclear how this would work for a segmented path. Overall, the concept of _subpath_ and what I'm calling a _segment_ (series of non-_M_ or _Z_ commands) is unclear.
    /*\
     * Element.getSubpath
     [ method ]
     **
     * Returns subpath of a given element from given start and end lengths (only works for `path` elements)
     **
     - from (number) length, in pixels, from the start of the path to the start of the segment
     - to (number) length, in pixels, from the start of the path to the end of the segment
     **
     = (string) path string definition for the segment
    \*/
    elproto.getSubpath = function (from, to) {
        return Snap.path.getSubpath(this.attr("d"), from, to);
    };
    Snap._.box = box;
    /*\
     * Snap.path.findDotsAtSegment
     [ method ]
     **
     * Utility method
     **
     * Finds dot coordinates on the given cubic beziér curve at the given t
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     - t (number) position on the curve (0..1)
     = (object) point information in format:
     o {
     o     x: (number) x coordinate of the point,
     o     y: (number) y coordinate of the point,
     o     m: {
     o         x: (number) x coordinate of the left anchor,
     o         y: (number) y coordinate of the left anchor
     o     },
     o     n: {
     o         x: (number) x coordinate of the right anchor,
     o         y: (number) y coordinate of the right anchor
     o     },
     o     start: {
     o         x: (number) x coordinate of the start of the curve,
     o         y: (number) y coordinate of the start of the curve
     o     },
     o     end: {
     o         x: (number) x coordinate of the end of the curve,
     o         y: (number) y coordinate of the end of the curve
     o     },
     o     alpha: (number) angle of the curve derivative at the point
     o }
    \*/
    Snap.path.findDotsAtSegment = findDotsAtSegment;
    /*\
     * Snap.path.bezierBBox
     [ method ]
     **
     * Utility method
     **
     * Returns the bounding box of a given cubic beziér curve
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     * or
     - bez (array) array of six points for beziér curve
     = (object) bounding box
     o {
     o     x: (number) x coordinate of the left top point of the box,
     o     y: (number) y coordinate of the left top point of the box,
     o     x2: (number) x coordinate of the right bottom point of the box,
     o     y2: (number) y coordinate of the right bottom point of the box,
     o     width: (number) width of the box,
     o     height: (number) height of the box
     o }
    \*/
    Snap.path.bezierBBox = bezierBBox;
    /*\
     * Snap.path.isPointInsideBBox
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if given point is inside bounding box
     - bbox (string) bounding box
     - x (string) x coordinate of the point
     - y (string) y coordinate of the point
     = (boolean) `true` if point is inside
    \*/
    Snap.path.isPointInsideBBox = isPointInsideBBox;
    Snap.closest = function (x, y, X, Y) {
        var r = 100,
            b = box(x - r / 2, y - r / 2, r, r),
            inside = [],
            getter = X[0].hasOwnProperty("x") ? function (i) {
                return {
                    x: X[i].x,
                    y: X[i].y
                };
            } : function (i) {
                return {
                    x: X[i],
                    y: Y[i]
                };
            },
            found = 0;
        while (r <= 1e6 && !found) {
            for (var i = 0, ii = X.length; i < ii; i++) {
                var xy = getter(i);
                if (isPointInsideBBox(b, xy.x, xy.y)) {
                    found++;
                    inside.push(xy);
                    break;
                }
            }
            if (!found) {
                r *= 2;
                b = box(x - r / 2, y - r / 2, r, r)
            }
        }
        if (r == 1e6) {
            return;
        }
        var len = Infinity,
            res;
        for (i = 0, ii = inside.length; i < ii; i++) {
            var l = Snap.len(x, y, inside[i].x, inside[i].y);
            if (len > l) {
                len = l;
                inside[i].len = l;
                res = inside[i];
            }
        }
        return res;
    };
    /*\
     * Snap.path.isBBoxIntersect
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if two bounding boxes intersect
     - bbox1 (string) first bounding box
     - bbox2 (string) second bounding box
     = (boolean) `true` if bounding boxes intersect
    \*/
    Snap.path.isBBoxIntersect = isBBoxIntersect;
    /*\
     * Snap.path.intersection
     [ method ]
     **
     * Utility method
     **
     * Finds intersections of two paths
     - path1 (string) path string
     - path2 (string) path string
     = (array) dots of intersection
     o [
     o     {
     o         x: (number) x coordinate of the point,
     o         y: (number) y coordinate of the point,
     o         t1: (number) t value for segment of path1,
     o         t2: (number) t value for segment of path2,
     o         segment1: (number) order number for segment of path1,
     o         segment2: (number) order number for segment of path2,
     o         bez1: (array) eight coordinates representing beziér curve for the segment of path1,
     o         bez2: (array) eight coordinates representing beziér curve for the segment of path2
     o     }
     o ]
    \*/
    Snap.path.intersection = pathIntersection;
    Snap.path.intersectionNumber = pathIntersectionNumber;
    /*\
     * Snap.path.isPointInside
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if given point is inside a given closed path.
     *
     * Note: fill mode doesn’t affect the result of this method.
     - path (string) path string
     - x (number) x of the point
     - y (number) y of the point
     = (boolean) `true` if point is inside the path
    \*/
    Snap.path.isPointInside = isPointInsidePath;
    /*\
     * Snap.path.getBBox
     [ method ]
     **
     * Utility method
     **
     * Returns the bounding box of a given path
     - path (string) path string
     = (object) bounding box
     o {
     o     x: (number) x coordinate of the left top point of the box,
     o     y: (number) y coordinate of the left top point of the box,
     o     x2: (number) x coordinate of the right bottom point of the box,
     o     y2: (number) y coordinate of the right bottom point of the box,
     o     width: (number) width of the box,
     o     height: (number) height of the box
     o }
    \*/
    Snap.path.getBBox = pathBBox;
    Snap.path.get = getPath;
    /*\
     * Snap.path.toRelative
     [ method ]
     **
     * Utility method
     **
     * Converts path coordinates into relative values
     - path (string) path string
     = (array) path string
    \*/
    Snap.path.toRelative = pathToRelative;
    /*\
     * Snap.path.toAbsolute
     [ method ]
     **
     * Utility method
     **
     * Converts path coordinates into absolute values
     - path (string) path string
     = (array) path string
    \*/
    Snap.path.toAbsolute = pathToAbsolute;
    /*\
     * Snap.path.toCubic
     [ method ]
     **
     * Utility method
     **
     * Converts path to a new path where all segments are cubic beziér curves
     - pathString (string|array) path string or array of segments
     = (array) array of segments
    \*/
    Snap.path.toCubic = path2curve;
    /*\
     * Snap.path.map
     [ method ]
     **
     * Transform the path string with the given matrix
     - path (string) path string
     - matrix (object) see @Matrix
     = (string) transformed path string
    \*/
    Snap.path.map = mapPath;
    Snap.path.toString = toString;
    Snap.path.clone = pathClone;
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob) {
    var mmax = Math.max,
        mmin = Math.min;

    // Set
    var Set = function (items) {
        this.items = [];
	this.bindings = {};
        this.length = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items.length; i < ii; i++) {
                if (items[i]) {
                    this[this.items.length] = this.items[this.items.length] = items[i];
                    this.length++;
                }
            }
        }
    },
    setproto = Set.prototype;
    /*\
     * Set.push
     [ method ]
     **
     * Adds each argument to the current set
     = (object) original element
    \*/
    setproto.push = function () {
        var item,
            len;
        for (var i = 0, ii = arguments.length; i < ii; i++) {
            item = arguments[i];
            if (item) {
                len = this.items.length;
                this[len] = this.items[len] = item;
                this.length++;
            }
        }
        return this;
    };
    /*\
     * Set.pop
     [ method ]
     **
     * Removes last element and returns it
     = (object) element
    \*/
    setproto.pop = function () {
        this.length && delete this[this.length--];
        return this.items.pop();
    };
    /*\
     * Set.forEach
     [ method ]
     **
     * Executes given function for each element in the set
     *
     * If the function returns `false`, the loop stops running.
     **
     - callback (function) function to run
     - thisArg (object) context object for the callback
     = (object) Set object
    \*/
    setproto.forEach = function (callback, thisArg) {
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            if (callback.call(thisArg, this.items[i], i) === false) {
                return this;
            }
        }
        return this;
    };
    /*\
     * Set.animate
     [ method ]
     **
     * Animates each element in set in sync.
     *
     **
     - attrs (object) key-value pairs of destination attributes
     - duration (number) duration of the animation in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function that executes when the animation ends
     * or
     - animation (array) array of animation parameter for each element in set in format `[attrs, duration, easing, callback]`
     > Usage
     | // animate all elements in set to radius 10
     | set.animate({r: 10}, 500, mina.easein);
     | // or
     | // animate first element to radius 10, but second to radius 20 and in different time
     | set.animate([{r: 10}, 500, mina.easein], [{r: 20}, 1500, mina.easein]);
     = (Element) the current element
    \*/
    setproto.animate = function (attrs, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        if (attrs instanceof Snap._.Animation) {
            callback = attrs.callback;
            easing = attrs.easing;
            ms = easing.dur;
            attrs = attrs.attr;
        }
        var args = arguments;
        if (Snap.is(attrs, "array") && Snap.is(args[args.length - 1], "array")) {
            var each = true;
        }
        var begin,
            handler = function () {
                if (begin) {
                    this.b = begin;
                } else {
                    begin = this.b;
                }
            },
            cb = 0,
            set = this,
            callbacker = callback && function () {
                if (++cb == set.length) {
                    callback.call(this);
                }
            };
        return this.forEach(function (el, i) {
            eve.once("snap.animcreated." + el.id, handler);
            if (each) {
                args[i] && el.animate.apply(el, args[i]);
            } else {
                el.animate(attrs, ms, easing, callbacker);
            }
        });
    };
    /*\
     * Set.remove
     [ method ]
     **
     * Removes all children of the set.
     *
     = (object) Set object
    \*/
    setproto.remove = function () {
        while (this.length) {
            this.pop().remove();
        }
        return this;
    };
    /*\
     * Set.bind
     [ method ]
     **
     * Specifies how to handle a specific attribute when applied
     * to a set.
     *
     **
     - attr (string) attribute name
     - callback (function) function to run
     * or
     - attr (string) attribute name
     - element (Element) specific element in the set to apply the attribute to
     * or
     - attr (string) attribute name
     - element (Element) specific element in the set to apply the attribute to
     - eattr (string) attribute on the element to bind the attribute to
     = (object) Set object
    \*/
    setproto.bind = function (attr, a, b) {
        var data = {};
        if (typeof a == "function") {
            this.bindings[attr] = a;
        } else {
            var aname = b || attr;
            this.bindings[attr] = function (v) {
                data[aname] = v;
                a.attr(data);
            };
        }
        return this;
    };
    /*\
     * Set.attr
     [ method ]
     **
     * Equivalent of @Element.attr.
     = (object) Set object
    \*/
    setproto.attr = function (value) {
        var unbound = {};
        for (var k in value) {
            if (this.bindings[k]) {
                this.bindings[k](value[k]);
            } else {
                unbound[k] = value[k];
            }
        }
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            this.items[i].attr(unbound);
        }
        return this;
    };
    /*\
     * Set.clear
     [ method ]
     **
     * Removes all elements from the set
    \*/
    setproto.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
    /*\
     * Set.splice
     [ method ]
     **
     * Removes range of elements from the set
     **
     - index (number) position of the deletion
     - count (number) number of element to remove
     - insertion… (object) #optional elements to insert
     = (object) set elements that were deleted
    \*/
    setproto.splice = function (index, count, insertion) {
        index = index < 0 ? mmax(this.length + index, 0) : index;
        count = mmax(0, mmin(this.length - index, count));
        var tail = [],
            todel = [],
            args = [],
            i;
        for (i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        for (i = 0; i < count; i++) {
            todel.push(this[index + i]);
        }
        for (; i < this.length - index; i++) {
            tail.push(this[index + i]);
        }
        var arglen = args.length;
        for (i = 0; i < arglen + tail.length; i++) {
            this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
        }
        i = this.items.length = this.length -= count - arglen;
        while (this[i]) {
            delete this[i++];
        }
        return new Set(todel);
    };
    /*\
     * Set.exclude
     [ method ]
     **
     * Removes given element from the set
     **
     - element (object) element to remove
     = (boolean) `true` if object was found and removed from the set
    \*/
    setproto.exclude = function (el) {
        for (var i = 0, ii = this.length; i < ii; i++) if (this[i] == el) {
            this.splice(i, 1);
            return true;
        }
        return false;
    };
    /*\
     * Set.insertAfter
     [ method ]
     **
     * Inserts set elements after given element.
     **
     - element (object) set will be inserted after this element
     = (object) Set object
    \*/
    setproto.insertAfter = function (el) {
        var i = this.items.length;
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    /*\
     * Set.getBBox
     [ method ]
     **
     * Union of all bboxes of the set. See @Element.getBBox.
     = (object) bounding box descriptor. See @Element.getBBox.
    \*/
    setproto.getBBox = function () {
        var x = [],
            y = [],
            x2 = [],
            y2 = [];
        for (var i = this.items.length; i--;) if (!this.items[i].removed) {
            var box = this.items[i].getBBox();
            x.push(box.x);
            y.push(box.y);
            x2.push(box.x + box.width);
            y2.push(box.y + box.height);
        }
        x = mmin.apply(0, x);
        y = mmin.apply(0, y);
        x2 = mmax.apply(0, x2);
        y2 = mmax.apply(0, y2);
        return {
            x: x,
            y: y,
            x2: x2,
            y2: y2,
            width: x2 - x,
            height: y2 - y,
            cx: x + (x2 - x) / 2,
            cy: y + (y2 - y) / 2
        };
    };
    /*\
     * Set.insertAfter
     [ method ]
     **
     * Creates a clone of the set.
     **
     = (object) New Set object
    \*/
    setproto.clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            s.push(this.items[i].clone());
        }
        return s;
    };
    setproto.toString = function () {
        return "Snap\u2018s set";
    };
    setproto.type = "set";
    // export
    /*\
     * Snap.Set
     [ property ]
     **
     * Set constructor.
    \*/
    Snap.Set = Set;
    /*\
     * Snap.set
     [ method ]
     **
     * Creates a set and fills it with list of arguments.
     **
     = (object) New Set object
     | var r = paper.rect(0, 0, 10, 10),
     |     s1 = Snap.set(), // empty set
     |     s2 = Snap.set(r, paper.circle(100, 100, 20)); // prefilled set
    \*/
    Snap.set = function () {
        var set = new Set;
        if (arguments.length) {
            set.push.apply(set, Array.prototype.slice.call(arguments, 0));
        }
        return set;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob) {
    var names = {},
        reUnit = /[%a-z]+$/i,
        Str = String;
    names.stroke = names.fill = "colour";
    function getEmpty(item) {
        var l = item[0];
        switch (l.toLowerCase()) {
            case "t": return [l, 0, 0];
            case "m": return [l, 1, 0, 0, 1, 0, 0];
            case "r": if (item.length == 4) {
                return [l, 0, item[2], item[3]];
            } else {
                return [l, 0];
            }
            case "s": if (item.length == 5) {
                return [l, 1, 1, item[3], item[4]];
            } else if (item.length == 3) {
                return [l, 1, 1];
            } else {
                return [l, 1];
            }
        }
    }
    function equaliseTransform(t1, t2, getBBox) {
        t1 = t1 || new Snap.Matrix;
        t2 = t2 || new Snap.Matrix;
        t1 = Snap.parseTransformString(t1.toTransformString()) || [];
        t2 = Snap.parseTransformString(t2.toTransformString()) || [];
        var maxlength = Math.max(t1.length, t2.length),
            from = [],
            to = [],
            i = 0, j, jj,
            tt1, tt2;
        for (; i < maxlength; i++) {
            tt1 = t1[i] || getEmpty(t2[i]);
            tt2 = t2[i] || getEmpty(tt1);
            if (tt1[0] != tt2[0] ||
                tt1[0].toLowerCase() == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3]) ||
                tt1[0].toLowerCase() == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4])
                ) {
                    t1 = Snap._.transform2matrix(t1, getBBox());
                    t2 = Snap._.transform2matrix(t2, getBBox());
                    from = [["m", t1.a, t1.b, t1.c, t1.d, t1.e, t1.f]];
                    to = [["m", t2.a, t2.b, t2.c, t2.d, t2.e, t2.f]];
                    break;
            }
            from[i] = [];
            to[i] = [];
            for (j = 0, jj = Math.max(tt1.length, tt2.length); j < jj; j++) {
                j in tt1 && (from[i][j] = tt1[j]);
                j in tt2 && (to[i][j] = tt2[j]);
            }
        }
        return {
            from: path2array(from),
            to: path2array(to),
            f: getPath(from)
        };
    }
    function getNumber(val) {
        return val;
    }
    function getUnit(unit) {
        return function (val) {
            return +val.toFixed(3) + unit;
        };
    }
    function getViewBox(val) {
        return val.join(" ");
    }
    function getColour(clr) {
        return Snap.rgb(clr[0], clr[1], clr[2], clr[3]);
    }
    function getPath(path) {
        var k = 0, i, ii, j, jj, out, a, b = [];
        for (i = 0, ii = path.length; i < ii; i++) {
            out = "[";
            a = ['"' + path[i][0] + '"'];
            for (j = 1, jj = path[i].length; j < jj; j++) {
                a[j] = "val[" + k++ + "]";
            }
            out += a + "]";
            b[i] = out;
        }
        return Function("val", "return Snap.path.toString.call([" + b + "])");
    }
    function path2array(path) {
        var out = [];
        for (var i = 0, ii = path.length; i < ii; i++) {
            for (var j = 1, jj = path[i].length; j < jj; j++) {
                out.push(path[i][j]);
            }
        }
        return out;
    }
    function isNumeric(obj) {
        return isFinite(obj);
    }
    function arrayEqual(arr1, arr2) {
        if (!Snap.is(arr1, "array") || !Snap.is(arr2, "array")) {
            return false;
        }
        return arr1.toString() == arr2.toString();
    }
    Element.prototype.equal = function (name, b) {
        return eve("snap.util.equal", this, name, b).firstDefined();
    };
    eve.on("snap.util.equal", function (name, b) {
        var A, B, a = Str(this.attr(name) || ""),
            el = this;
        if (names[name] == "colour") {
            A = Snap.color(a);
            B = Snap.color(b);
            return {
                from: [A.r, A.g, A.b, A.opacity],
                to: [B.r, B.g, B.b, B.opacity],
                f: getColour
            };
        }
        if (name == "viewBox") {
            A = this.attr(name).vb.split(" ").map(Number);
            B = b.split(" ").map(Number);
            return {
                from: A,
                to: B,
                f: getViewBox
            };
        }
        if (name == "transform" || name == "gradientTransform" || name == "patternTransform") {
            if (typeof b == "string") {
                b = Str(b).replace(/\.{3}|\u2026/g, a);
            }
            a = this.matrix;
            if (!Snap._.rgTransform.test(b)) {
                b = Snap._.transform2matrix(Snap._.svgTransform2string(b), this.getBBox());
            } else {
                b = Snap._.transform2matrix(b, this.getBBox());
            }
            return equaliseTransform(a, b, function () {
                return el.getBBox(1);
            });
        }
        if (name == "d" || name == "path") {
            A = Snap.path.toCubic(a, b);
            return {
                from: path2array(A[0]),
                to: path2array(A[1]),
                f: getPath(A[0])
            };
        }
        if (name == "points") {
            A = Str(a).split(Snap._.separator);
            B = Str(b).split(Snap._.separator);
            return {
                from: A,
                to: B,
                f: function (val) { return val; }
            };
        }
        if (isNumeric(a) && isNumeric(b)) {
            return {
                from: parseFloat(a),
                to: parseFloat(b),
                f: getNumber
            };
        }
        var aUnit = a.match(reUnit),
            bUnit = Str(b).match(reUnit);
        if (aUnit && arrayEqual(aUnit, bUnit)) {
            return {
                from: parseFloat(a),
                to: parseFloat(b),
                f: getUnit(aUnit)
            };
        } else {
            return {
                from: this.asPX(name),
                to: this.asPX(name, b),
                f: getNumber
            };
        }
    });
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
    has = "hasOwnProperty",
    supportsTouch = "createTouch" in glob.doc,
    events = [
        "click", "dblclick", "mousedown", "mousemove", "mouseout",
        "mouseover", "mouseup", "touchstart", "touchmove", "touchend",
        "touchcancel"
    ],
    touchMap = {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
    },
    getScroll = function (xy, el) {
        var name = xy == "y" ? "scrollTop" : "scrollLeft",
            doc = el && el.node ? el.node.ownerDocument : glob.doc;
        return doc[name in doc.documentElement ? "documentElement" : "body"][name];
    },
    preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = function (obj, type, fn, element) {
        var realName = supportsTouch && touchMap[type] ? touchMap[type] : type,
            f = function (e) {
                var scrollY = getScroll("y", element),
                    scrollX = getScroll("x", element);
                if (supportsTouch && touchMap[has](type)) {
                    for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                        if (e.targetTouches[i].target == obj || obj.contains(e.targetTouches[i].target)) {
                            var olde = e;
                            e = e.targetTouches[i];
                            e.originalEvent = olde;
                            e.preventDefault = preventTouch;
                            e.stopPropagation = stopTouch;
                            break;
                        }
                    }
                }
                var x = e.clientX + scrollX,
                    y = e.clientY + scrollY;
                return fn.call(element, e, x, y);
            };

        if (type !== realName) {
            obj.addEventListener(type, f, false);
        }

        obj.addEventListener(realName, f, false);

        return function () {
            if (type !== realName) {
                obj.removeEventListener(type, f, false);
            }

            obj.removeEventListener(realName, f, false);
            return true;
        };
    },
    drag = [],
    dragMove = function (e) {
        var x = e.clientX,
            y = e.clientY,
            scrollY = getScroll("y"),
            scrollX = getScroll("x"),
            dragi,
            j = drag.length;
        while (j--) {
            dragi = drag[j];
            if (supportsTouch) {
                var i = e.touches && e.touches.length,
                    touch;
                while (i--) {
                    touch = e.touches[i];
                    if (touch.identifier == dragi.el._drag.id || dragi.el.node.contains(touch.target)) {
                        x = touch.clientX;
                        y = touch.clientY;
                        (e.originalEvent ? e.originalEvent : e).preventDefault();
                        break;
                    }
                }
            } else {
                e.preventDefault();
            }
            var node = dragi.el.node,
                o,
                next = node.nextSibling,
                parent = node.parentNode,
                display = node.style.display;
            // glob.win.opera && parent.removeChild(node);
            // node.style.display = "none";
            // o = dragi.el.paper.getElementByPoint(x, y);
            // node.style.display = display;
            // glob.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
            // o && eve("snap.drag.over." + dragi.el.id, dragi.el, o);
            x += scrollX;
            y += scrollY;
            eve("snap.drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
        }
    },
    dragUp = function (e) {
        Snap.unmousemove(dragMove).unmouseup(dragUp);
        var i = drag.length,
            dragi;
        while (i--) {
            dragi = drag[i];
            dragi.el._drag = {};
            eve("snap.drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
            eve.off("snap.drag.*." + dragi.el.id);
        }
        drag = [];
    };
    /*\
     * Element.click
     [ method ]
     **
     * Adds a click event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unclick
     [ method ]
     **
     * Removes a click event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.dblclick
     [ method ]
     **
     * Adds a double click event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.undblclick
     [ method ]
     **
     * Removes a double click event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mousedown
     [ method ]
     **
     * Adds a mousedown event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmousedown
     [ method ]
     **
     * Removes a mousedown event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mousemove
     [ method ]
     **
     * Adds a mousemove event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmousemove
     [ method ]
     **
     * Removes a mousemove event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseout
     [ method ]
     **
     * Adds a mouseout event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseout
     [ method ]
     **
     * Removes a mouseout event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseover
     [ method ]
     **
     * Adds a mouseover event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseover
     [ method ]
     **
     * Removes a mouseover event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseup
     [ method ]
     **
     * Adds a mouseup event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseup
     [ method ]
     **
     * Removes a mouseup event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchstart
     [ method ]
     **
     * Adds a touchstart event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchstart
     [ method ]
     **
     * Removes a touchstart event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchmove
     [ method ]
     **
     * Adds a touchmove event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchmove
     [ method ]
     **
     * Removes a touchmove event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchend
     [ method ]
     **
     * Adds a touchend event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchend
     [ method ]
     **
     * Removes a touchend event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchcancel
     [ method ]
     **
     * Adds a touchcancel event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchcancel
     [ method ]
     **
     * Removes a touchcancel event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    for (var i = events.length; i--;) {
        (function (eventName) {
            Snap[eventName] = elproto[eventName] = function (fn, scope) {
                if (Snap.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({
                        name: eventName,
                        f: fn,
                        unbind: addEvent(this.node || document, eventName, fn, scope || this)
                    });
                } else {
                    for (var i = 0, ii = this.events.length; i < ii; i++) if (this.events[i].name == eventName) {
                        try {
                            this.events[i].f.call(this);
                        } catch (e) {}
                    }
                }
                return this;
            };
            Snap["un" + eventName] =
            elproto["un" + eventName] = function (fn) {
                var events = this.events || [],
                    l = events.length;
                while (l--) if (events[l].name == eventName &&
                               (events[l].f == fn || !fn)) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    /*\
     * Element.hover
     [ method ]
     **
     * Adds hover event handlers to the element
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     - icontext (object) #optional context for hover in handler
     - ocontext (object) #optional context for hover out handler
     = (object) @Element
    \*/
    elproto.hover = function (f_in, f_out, scope_in, scope_out) {
        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
    };
    /*\
     * Element.unhover
     [ method ]
     **
     * Removes hover event handlers from the element
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     = (object) @Element
    \*/
    elproto.unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    var draggable = [];
    // SIERRA unclear what _context_ refers to for starting, ending, moving the drag gesture.
    // SIERRA Element.drag(): _x position of the mouse_: Where are the x/y values offset from?
    // SIERRA Element.drag(): much of this member's doc appears to be duplicated for some reason.
    // SIERRA Unclear about this sentence: _Additionally following drag events will be triggered: drag.start.<id> on start, drag.end.<id> on end and drag.move.<id> on every move._ Is there a global _drag_ object to which you can assign handlers keyed by an element's ID?
    /*\
     * Element.drag
     [ method ]
     **
     * Adds event handlers for an element's drag gesture
     **
     - onmove (function) handler for moving
     - onstart (function) handler for drag start
     - onend (function) handler for drag end
     - mcontext (object) #optional context for moving handler
     - scontext (object) #optional context for drag start handler
     - econtext (object) #optional context for drag end handler
     * Additionaly following `drag` events are triggered: `drag.start.<id>` on start, 
     * `drag.end.<id>` on end and `drag.move.<id>` on every move. When element is dragged over another element 
     * `drag.over.<id>` fires as well.
     *
     * Start event and start handler are called in specified context or in context of the element with following parameters:
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * Move event and move handler are called in specified context or in context of the element with following parameters:
     o dx (number) shift by x from the start point
     o dy (number) shift by y from the start point
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * End event and end handler are called in specified context or in context of the element with following parameters:
     o event (object) DOM event object
     = (object) @Element
    \*/
    elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
        var el = this;
        if (!arguments.length) {
            var origTransform;
            return el.drag(function (dx, dy) {
                this.attr({
                    transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
                });
            }, function () {
                origTransform = this.transform().local;
            });
        }
        function start(e, x, y) {
            (e.originalEvent || e).preventDefault();
            el._drag.x = x;
            el._drag.y = y;
            el._drag.id = e.identifier;
            !drag.length && Snap.mousemove(dragMove).mouseup(dragUp);
            drag.push({el: el, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope});
            onstart && eve.on("snap.drag.start." + el.id, onstart);
            onmove && eve.on("snap.drag.move." + el.id, onmove);
            onend && eve.on("snap.drag.end." + el.id, onend);
            eve("snap.drag.start." + el.id, start_scope || move_scope || el, x, y, e);
        }
        function init(e, x, y) {
            eve("snap.draginit." + el.id, el, e, x, y);
        }
        eve.on("snap.draginit." + el.id, start);
        el._drag = {};
        draggable.push({el: el, start: start, init: init});
        el.mousedown(init);
        return el;
    };
    /*
     * Element.onDragOver
     [ method ]
     **
     * Shortcut to assign event handler for `drag.over.<id>` event, where `id` is the element's `id` (see @Element.id)
     - f (function) handler for event, first argument would be the element you are dragging over
    \*/
    // elproto.onDragOver = function (f) {
    //     f ? eve.on("snap.drag.over." + this.id, f) : eve.unbind("snap.drag.over." + this.id);
    // };
    /*\
     * Element.undrag
     [ method ]
     **
     * Removes all drag event handlers from the given element
    \*/
    elproto.undrag = function () {
        var i = draggable.length;
        while (i--) if (draggable[i].el == this) {
            this.unmousedown(draggable[i].init);
            draggable.splice(i, 1);
            eve.unbind("snap.drag.*." + this.id);
            eve.unbind("snap.draginit." + this.id);
        }
        !draggable.length && Snap.unmousemove(dragMove).unmouseup(dragUp);
        return this;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
        pproto = Paper.prototype,
        rgurl = /^\s*url\((.+)\)/,
        Str = String,
        $ = Snap._.$;
    Snap.filter = {};
    /*\
     * Paper.filter
     [ method ]
     **
     * Creates a `<filter>` element
     **
     - filstr (string) SVG fragment of filter provided as a string
     = (object) @Element
     * Note: It is recommended to use filters embedded into the page inside an empty SVG element.
     > Usage
     | var f = paper.filter('<feGaussianBlur stdDeviation="2"/>'),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    pproto.filter = function (filstr) {
        var paper = this;
        if (paper.type != "svg") {
            paper = paper.paper;
        }
        var f = Snap.parse(Str(filstr)),
            id = Snap._.id(),
            width = paper.node.offsetWidth,
            height = paper.node.offsetHeight,
            filter = $("filter");
        $(filter, {
            id: id,
            filterUnits: "userSpaceOnUse"
        });
        filter.appendChild(f.node);
        paper.defs.appendChild(filter);
        return new Element(filter);
    };

    eve.on("snap.util.getattr.filter", function () {
        eve.stop();
        var p = $(this.node, "filter");
        if (p) {
            var match = Str(p).match(rgurl);
            return match && Snap.select(match[1]);
        }
    });
    eve.on("snap.util.attr.filter", function (value) {
        if (value instanceof Element && value.type == "filter") {
            eve.stop();
            var id = value.node.id;
            if (!id) {
                $(value.node, {id: value.id});
                id = value.id;
            }
            $(this.node, {
                filter: Snap.url(id)
            });
        }
        if (!value || value == "none") {
            eve.stop();
            this.node.removeAttribute("filter");
        }
    });
    /*\
     * Snap.filter.blur
     [ method ]
     **
     * Returns an SVG markup string for the blur filter
     **
     - x (number) amount of horizontal blur, in pixels
     - y (number) #optional amount of vertical blur, in pixels
     = (string) filter representation
     > Usage
     | var f = paper.filter(Snap.filter.blur(5, 10)),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    Snap.filter.blur = function (x, y) {
        if (x == null) {
            x = 2;
        }
        var def = y == null ? x : [x, y];
        return Snap.format('\<feGaussianBlur stdDeviation="{def}"/>', {
            def: def
        });
    };
    Snap.filter.blur.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.shadow
     [ method ]
     **
     * Returns an SVG markup string for the shadow filter
     **
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - blur (number) #optional amount of blur
     - color (string) #optional color of the shadow
     - opacity (number) #optional `0..1` opacity of the shadow
     * or
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - color (string) #optional color of the shadow
     - opacity (number) #optional `0..1` opacity of the shadow
     * which makes blur default to `4`. Or
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - opacity (number) #optional `0..1` opacity of the shadow
     = (string) filter representation
     > Usage
     | var f = paper.filter(Snap.filter.shadow(0, 2, .3)),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    Snap.filter.shadow = function (dx, dy, blur, color, opacity) {
        if (opacity == null) {
            if (color == null) {
                opacity = blur;
                blur = 4;
                color = "#000";
            } else {
                opacity = color;
                color = blur;
                blur = 4;
            }
        }
        if (blur == null) {
            blur = 4;
        }
        if (opacity == null) {
            opacity = 1;
        }
        if (dx == null) {
            dx = 0;
            dy = 2;
        }
        if (dy == null) {
            dy = dx;
        }
        color = Snap.color(color);
        return Snap.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>', {
            color: color,
            dx: dx,
            dy: dy,
            blur: blur,
            opacity: opacity
        });
    };
    Snap.filter.shadow.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.grayscale
     [ method ]
     **
     * Returns an SVG markup string for the grayscale filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.grayscale = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
            a: 0.2126 + 0.7874 * (1 - amount),
            b: 0.7152 - 0.7152 * (1 - amount),
            c: 0.0722 - 0.0722 * (1 - amount),
            d: 0.2126 - 0.2126 * (1 - amount),
            e: 0.7152 + 0.2848 * (1 - amount),
            f: 0.0722 - 0.0722 * (1 - amount),
            g: 0.2126 - 0.2126 * (1 - amount),
            h: 0.0722 + 0.9278 * (1 - amount)
        });
    };
    Snap.filter.grayscale.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.sepia
     [ method ]
     **
     * Returns an SVG markup string for the sepia filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.sepia = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
            a: 0.393 + 0.607 * (1 - amount),
            b: 0.769 - 0.769 * (1 - amount),
            c: 0.189 - 0.189 * (1 - amount),
            d: 0.349 - 0.349 * (1 - amount),
            e: 0.686 + 0.314 * (1 - amount),
            f: 0.168 - 0.168 * (1 - amount),
            g: 0.272 - 0.272 * (1 - amount),
            h: 0.534 - 0.534 * (1 - amount),
            i: 0.131 + 0.869 * (1 - amount)
        });
    };
    Snap.filter.sepia.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.saturate
     [ method ]
     **
     * Returns an SVG markup string for the saturate filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.saturate = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="saturate" values="{amount}"/>', {
            amount: 1 - amount
        });
    };
    Snap.filter.saturate.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.hueRotate
     [ method ]
     **
     * Returns an SVG markup string for the hue-rotate filter
     **
     - angle (number) angle of rotation
     = (string) filter representation
    \*/
    Snap.filter.hueRotate = function (angle) {
        angle = angle || 0;
        return Snap.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {
            angle: angle
        });
    };
    Snap.filter.hueRotate.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.invert
     [ method ]
     **
     * Returns an SVG markup string for the invert filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.invert = function (amount) {
        if (amount == null) {
            amount = 1;
        }
//        <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" color-interpolation-filters="sRGB"/>
        return Snap.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>', {
            amount: amount,
            amount2: 1 - amount
        });
    };
    Snap.filter.invert.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.brightness
     [ method ]
     **
     * Returns an SVG markup string for the brightness filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.brightness = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', {
            amount: amount
        });
    };
    Snap.filter.brightness.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.contrast
     [ method ]
     **
     * Returns an SVG markup string for the contrast filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.contrast = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>', {
            amount: amount,
            amount2: .5 - amount / 2
        });
    };
    Snap.filter.contrast.toString = function () {
        return this();
    };
});

// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var box = Snap._.box,
        is = Snap.is,
        firstLetter = /^[^a-z]*([tbmlrc])/i,
        toString = function () {
            return "T" + this.dx + "," + this.dy;
        };
    /*\
     * Element.getAlign
     [ method ]
     **
     * Returns shift needed to align the element relatively to given element.
     * If no elements specified, parent `<svg>` container will be used.
     - el (object) @optional alignment element
     - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
     = (object|string) Object in format `{dx: , dy: }` also has a string representation as a transformation string
     > Usage
     | el.transform(el.getAlign(el2, "top"));
     * or
     | var dy = el.getAlign(el2, "top").dy;
    \*/
    Element.prototype.getAlign = function (el, way) {
        if (way == null && is(el, "string")) {
            way = el;
            el = null;
        }
        el = el || this.paper;
        var bx = el.getBBox ? el.getBBox() : box(el),
            bb = this.getBBox(),
            out = {};
        way = way && way.match(firstLetter);
        way = way ? way[1].toLowerCase() : "c";
        switch (way) {
            case "t":
                out.dx = 0;
                out.dy = bx.y - bb.y;
            break;
            case "b":
                out.dx = 0;
                out.dy = bx.y2 - bb.y2;
            break;
            case "m":
                out.dx = 0;
                out.dy = bx.cy - bb.cy;
            break;
            case "l":
                out.dx = bx.x - bb.x;
                out.dy = 0;
            break;
            case "r":
                out.dx = bx.x2 - bb.x2;
                out.dy = 0;
            break;
            default:
                out.dx = bx.cx - bb.cx;
                out.dy = 0;
            break;
        }
        out.toString = toString;
        return out;
    };
    /*\
     * Element.align
     [ method ]
     **
     * Aligns the element relatively to given one via transformation.
     * If no elements specified, parent `<svg>` container will be used.
     - el (object) @optional alignment element
     - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
     = (object) this element
     > Usage
     | el.align(el2, "top");
     * or
     | el.align("middle");
    \*/
    Element.prototype.align = function (el, way) {
        return this.transform("..." + this.getAlign(el, way));
    };
});

// Copyright (c) 2016 Adobe Systems Incorporated. All rights reserved.
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
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var elproto = Element.prototype,
        is = Snap.is,
        Str = String,
        has = "hasOwnProperty";
    function slice(from, to, f) {
        return function (arr) {
            var res = arr.slice(from, to);
            if (res.length == 1) {
                res = res[0];
            }
            return f ? f(res) : res;
        };
    }
    var Animation = function (attr, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        this.attr = attr;
        this.dur = ms;
        easing && (this.easing = easing);
        callback && (this.callback = callback);
    };
    Snap._.Animation = Animation;
    /*\
     * Snap.animation
     [ method ]
     **
     * Creates an animation object
     **
     - attr (object) attributes of final destination
     - duration (number) duration of the animation, in milliseconds
     - easing (function) #optional one of easing functions of @mina or custom one
     - callback (function) #optional callback function that fires when animation ends
     = (object) animation object
    \*/
    Snap.animation = function (attr, ms, easing, callback) {
        return new Animation(attr, ms, easing, callback);
    };
    /*\
     * Element.inAnim
     [ method ]
     **
     * Returns a set of animations that may be able to manipulate the current element
     **
     = (object) in format:
     o {
     o     anim (object) animation object,
     o     mina (object) @mina object,
     o     curStatus (number) 0..1 — status of the animation: 0 — just started, 1 — just finished,
     o     status (function) gets or sets the status of the animation,
     o     stop (function) stops the animation
     o }
    \*/
    elproto.inAnim = function () {
        var el = this,
            res = [];
        for (var id in el.anims) if (el.anims[has](id)) {
            (function (a) {
                res.push({
                    anim: new Animation(a._attrs, a.dur, a.easing, a._callback),
                    mina: a,
                    curStatus: a.status(),
                    status: function (val) {
                        return a.status(val);
                    },
                    stop: function () {
                        a.stop();
                    }
                });
            }(el.anims[id]));
        }
        return res;
    };
    /*\
     * Snap.animate
     [ method ]
     **
     * Runs generic animation of one number into another with a caring function
     **
     - from (number|array) number or array of numbers
     - to (number|array) number or array of numbers
     - setter (function) caring function that accepts one number argument
     - duration (number) duration, in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function to execute when animation ends
     = (object) animation object in @mina format
     o {
     o     id (string) animation id, consider it read-only,
     o     duration (function) gets or sets the duration of the animation,
     o     easing (function) easing,
     o     speed (function) gets or sets the speed of the animation,
     o     status (function) gets or sets the status of the animation,
     o     stop (function) stops the animation
     o }
     | var rect = Snap().rect(0, 0, 10, 10);
     | Snap.animate(0, 10, function (val) {
     |     rect.attr({
     |         x: val
     |     });
     | }, 1000);
     | // in given context is equivalent to
     | rect.animate({x: 10}, 1000);
    \*/
    Snap.animate = function (from, to, setter, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        var now = mina.time(),
            anim = mina(from, to, now, now + ms, mina.time, setter, easing);
        callback && eve.once("mina.finish." + anim.id, callback);
        return anim;
    };
    /*\
     * Element.stop
     [ method ]
     **
     * Stops all the animations for the current element
     **
     = (Element) the current element
    \*/
    elproto.stop = function () {
        var anims = this.inAnim();
        for (var i = 0, ii = anims.length; i < ii; i++) {
            anims[i].stop();
        }
        return this;
    };
    /*\
     * Element.animate
     [ method ]
     **
     * Animates the given attributes of the element
     **
     - attrs (object) key-value pairs of destination attributes
     - duration (number) duration of the animation in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function that executes when the animation ends
     = (Element) the current element
    \*/
    elproto.animate = function (attrs, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        if (attrs instanceof Animation) {
            callback = attrs.callback;
            easing = attrs.easing;
            ms = attrs.dur;
            attrs = attrs.attr;
        }
        var fkeys = [], tkeys = [], keys = {}, from, to, f, eq,
            el = this;
        for (var key in attrs) if (attrs[has](key)) {
            if (el.equal) {
                eq = el.equal(key, Str(attrs[key]));
                from = eq.from;
                to = eq.to;
                f = eq.f;
            } else {
                from = +el.attr(key);
                to = +attrs[key];
            }
            var len = is(from, "array") ? from.length : 1;
            keys[key] = slice(fkeys.length, fkeys.length + len, f);
            fkeys = fkeys.concat(from);
            tkeys = tkeys.concat(to);
        }
        var now = mina.time(),
            anim = mina(fkeys, tkeys, now, now + ms, mina.time, function (val) {
                var attr = {};
                for (var key in keys) if (keys[has](key)) {
                    attr[key] = keys[key](val);
                }
                el.attr(attr);
            }, easing);
        el.anims[anim.id] = anim;
        anim._attrs = attrs;
        anim._callback = callback;
        eve("snap.animcreated." + el.id, anim);
        eve.once("mina.finish." + anim.id, function () {
            eve.off("mina.*." + anim.id);
            delete el.anims[anim.id];
            callback && callback.call(el);
        });
        eve.once("mina.stop." + anim.id, function () {
            eve.off("mina.*." + anim.id);
            delete el.anims[anim.id];
        });
        return el;
    };
});

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
Snap.plugin(function (Snap, Element, Paper, glob) {
    // Colours are from https://www.materialui.co
    var red         = "#ffebee#ffcdd2#ef9a9a#e57373#ef5350#f44336#e53935#d32f2f#c62828#b71c1c#ff8a80#ff5252#ff1744#d50000",
        pink        = "#FCE4EC#F8BBD0#F48FB1#F06292#EC407A#E91E63#D81B60#C2185B#AD1457#880E4F#FF80AB#FF4081#F50057#C51162",
        purple      = "#F3E5F5#E1BEE7#CE93D8#BA68C8#AB47BC#9C27B0#8E24AA#7B1FA2#6A1B9A#4A148C#EA80FC#E040FB#D500F9#AA00FF",
        deeppurple  = "#EDE7F6#D1C4E9#B39DDB#9575CD#7E57C2#673AB7#5E35B1#512DA8#4527A0#311B92#B388FF#7C4DFF#651FFF#6200EA",
        indigo      = "#E8EAF6#C5CAE9#9FA8DA#7986CB#5C6BC0#3F51B5#3949AB#303F9F#283593#1A237E#8C9EFF#536DFE#3D5AFE#304FFE",
        blue        = "#E3F2FD#BBDEFB#90CAF9#64B5F6#64B5F6#2196F3#1E88E5#1976D2#1565C0#0D47A1#82B1FF#448AFF#2979FF#2962FF",
        lightblue   = "#E1F5FE#B3E5FC#81D4FA#4FC3F7#29B6F6#03A9F4#039BE5#0288D1#0277BD#01579B#80D8FF#40C4FF#00B0FF#0091EA",
        cyan        = "#E0F7FA#B2EBF2#80DEEA#4DD0E1#26C6DA#00BCD4#00ACC1#0097A7#00838F#006064#84FFFF#18FFFF#00E5FF#00B8D4",
        teal        = "#E0F2F1#B2DFDB#80CBC4#4DB6AC#26A69A#009688#00897B#00796B#00695C#004D40#A7FFEB#64FFDA#1DE9B6#00BFA5",
        green       = "#E8F5E9#C8E6C9#A5D6A7#81C784#66BB6A#4CAF50#43A047#388E3C#2E7D32#1B5E20#B9F6CA#69F0AE#00E676#00C853",
        lightgreen  = "#F1F8E9#DCEDC8#C5E1A5#AED581#9CCC65#8BC34A#7CB342#689F38#558B2F#33691E#CCFF90#B2FF59#76FF03#64DD17",
        lime        = "#F9FBE7#F0F4C3#E6EE9C#DCE775#D4E157#CDDC39#C0CA33#AFB42B#9E9D24#827717#F4FF81#EEFF41#C6FF00#AEEA00",
        yellow      = "#FFFDE7#FFF9C4#FFF59D#FFF176#FFEE58#FFEB3B#FDD835#FBC02D#F9A825#F57F17#FFFF8D#FFFF00#FFEA00#FFD600",
        amber       = "#FFF8E1#FFECB3#FFE082#FFD54F#FFCA28#FFC107#FFB300#FFA000#FF8F00#FF6F00#FFE57F#FFD740#FFC400#FFAB00",
        orange      = "#FFF3E0#FFE0B2#FFCC80#FFB74D#FFA726#FF9800#FB8C00#F57C00#EF6C00#E65100#FFD180#FFAB40#FF9100#FF6D00",
        deeporange  = "#FBE9E7#FFCCBC#FFAB91#FF8A65#FF7043#FF5722#F4511E#E64A19#D84315#BF360C#FF9E80#FF6E40#FF3D00#DD2C00",
        brown       = "#EFEBE9#D7CCC8#BCAAA4#A1887F#8D6E63#795548#6D4C41#5D4037#4E342E#3E2723",
        grey        = "#FAFAFA#F5F5F5#EEEEEE#E0E0E0#BDBDBD#9E9E9E#757575#616161#424242#212121",
        bluegrey    = "#ECEFF1#CFD8DC#B0BEC5#90A4AE#78909C#607D8B#546E7A#455A64#37474F#263238";
    /*\
     * Snap.mui
     [ property ]
     **
     * Contain Material UI colours.
     | Snap().rect(0, 0, 10, 10).attr({fill: Snap.mui.deeppurple, stroke: Snap.mui.amber[600]});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.mui = {};
    /*\
     * Snap.flat
     [ property ]
     **
     * Contain Flat UI colours.
     | Snap().rect(0, 0, 10, 10).attr({fill: Snap.flat.carrot, stroke: Snap.flat.wetasphalt});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.flat = {};
    function saveColor(colors) {
        colors = colors.split(/(?=#)/);
        var color = new String(colors[5]);
        color[50] = colors[0];
        color[100] = colors[1];
        color[200] = colors[2];
        color[300] = colors[3];
        color[400] = colors[4];
        color[500] = colors[5];
        color[600] = colors[6];
        color[700] = colors[7];
        color[800] = colors[8];
        color[900] = colors[9];
        if (colors[10]) {
            color.A100 = colors[10];
            color.A200 = colors[11];
            color.A400 = colors[12];
            color.A700 = colors[13];
        }
        return color;
    }
    Snap.mui.red = saveColor(red);
    Snap.mui.pink = saveColor(pink);
    Snap.mui.purple = saveColor(purple);
    Snap.mui.deeppurple = saveColor(deeppurple);
    Snap.mui.indigo = saveColor(indigo);
    Snap.mui.blue = saveColor(blue);
    Snap.mui.lightblue = saveColor(lightblue);
    Snap.mui.cyan = saveColor(cyan);
    Snap.mui.teal = saveColor(teal);
    Snap.mui.green = saveColor(green);
    Snap.mui.lightgreen = saveColor(lightgreen);
    Snap.mui.lime = saveColor(lime);
    Snap.mui.yellow = saveColor(yellow);
    Snap.mui.amber = saveColor(amber);
    Snap.mui.orange = saveColor(orange);
    Snap.mui.deeporange = saveColor(deeporange);
    Snap.mui.brown = saveColor(brown);
    Snap.mui.grey = saveColor(grey);
    Snap.mui.bluegrey = saveColor(bluegrey);
    Snap.flat.turquoise = "#1abc9c";
    Snap.flat.greensea = "#16a085";
    Snap.flat.sunflower = "#f1c40f";
    Snap.flat.orange = "#f39c12";
    Snap.flat.emerland = "#2ecc71";
    Snap.flat.nephritis = "#27ae60";
    Snap.flat.carrot = "#e67e22";
    Snap.flat.pumpkin = "#d35400";
    Snap.flat.peterriver = "#3498db";
    Snap.flat.belizehole = "#2980b9";
    Snap.flat.alizarin = "#e74c3c";
    Snap.flat.pomegranate = "#c0392b";
    Snap.flat.amethyst = "#9b59b6";
    Snap.flat.wisteria = "#8e44ad";
    Snap.flat.clouds = "#ecf0f1";
    Snap.flat.silver = "#bdc3c7";
    Snap.flat.wetasphalt = "#34495e";
    Snap.flat.midnightblue = "#2c3e50";
    Snap.flat.concrete = "#95a5a6";
    Snap.flat.asbestos = "#7f8c8d";
    /*\
     * Snap.importMUIColors
     [ method ]
     **
     * Imports Material UI colours into global object.
     | Snap.importMUIColors();
     | Snap().rect(0, 0, 10, 10).attr({fill: deeppurple, stroke: amber[600]});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.importMUIColors = function () {
        for (var color in Snap.mui) {
            if (Snap.mui.hasOwnProperty(color)) {
                window[color] = Snap.mui[color];
            }
        }
    };
});

module.exports = Snap


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
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
// ┌────────────────────────────────────────────────────────────┐ \\
// │ Eve 0.5.4 - JavaScript Events Library                      │ \\
// ├────────────────────────────────────────────────────────────┤ \\
// │ Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/) │ \\
// └────────────────────────────────────────────────────────────┘ \\

(function (glob) {
    var version = "0.5.4",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        comaseparator = /\s*,\s*/,
        wildcard = "*",
        numsort = function (a, b) {
            return a - b;
        },
        current_event,
        stop,
        events = {n: {}},
        firstDefined = function () {
            for (var i = 0, ii = this.length; i < ii; i++) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        lastDefined = function () {
            var i = this.length;
            while (--i) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        objtos = Object.prototype.toString,
        Str = String,
        isArray = Array.isArray || function (ar) {
            return ar instanceof Array || objtos.call(ar) == "[object Array]";
        },
    /*\
     * eve
     [ method ]

     * Fires event with given `name`, given scope and other parameters.

     - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
     - scope (object) context for the event handlers
     - varargs (...) the rest of arguments will be sent to event handlers

     = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
    \*/
        eve = function (name, scope) {
            var oldstop = stop,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                z = 0,
                l,
                indexed = [],
                queue = {},
                out = [],
                ce = current_event;
            out.firstDefined = firstDefined;
            out.lastDefined = lastDefined;
            current_event = name;
            stop = 0;
            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
            indexed.sort(numsort);
            while (indexed[z] < 0) {
                l = queue[indexed[z++]];
                out.push(l.apply(scope, args));
                if (stop) {
                    stop = oldstop;
                    return out;
                }
            }
            for (i = 0; i < ii; i++) {
                l = listeners[i];
                if ("zIndex" in l) {
                    if (l.zIndex == indexed[z]) {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            break;
                        }
                        do {
                            z++;
                            l = queue[indexed[z]];
                            l && out.push(l.apply(scope, args));
                            if (stop) {
                                break;
                            }
                        } while (l)
                    } else {
                        queue[l.zIndex] = l;
                    }
                } else {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        break;
                    }
                }
            }
            stop = oldstop;
            current_event = ce;
            return out;
        };
    // Undocumented. Debug only.
    eve._events = events;
    /*\
     * eve.listeners
     [ method ]

     * Internal method which gives you array of all event handlers that will be triggered by the given `name`.

     - name (string) name of the event, dot (`.`) or slash (`/`) separated

     = (array) array of event handlers
    \*/
    eve.listeners = function (name) {
        var names = isArray(name) ? name : name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    /*\
     * eve.separator
     [ method ]

     * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours
     * here. Be aware that if you pass a string longer than one character it will be treated as
     * a list of characters.

     - separator (string) new separator. Empty string resets to default: `.` or `/`.
    \*/
    eve.separator = function (sep) {
        if (sep) {
            sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, "\\");
            sep = "[" + sep + "]";
            separator = new RegExp(sep);
        } else {
            separator = /[\.\/]/;
        }
    };
    /*\
     * eve.on
     [ method ]
     **
     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
     | eve.on("*.under.*", f);
     | eve("mouse.under.floor"); // triggers f
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     - name (array) if you don’t want to use separators, you can use array of strings
     - f (function) event handler function
     **
     = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment.
     > Example:
     | eve.on("mouse", eatIt)(2);
     | eve.on("mouse", scream);
     | eve.on("mouse", catchIt)(1);
     * This will ensure that `catchIt` function will be called before `eatIt`.
     *
     * If you want to put your handler before non-indexed handlers, specify a negative value.
     * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
    \*/
    eve.on = function (name, f) {
        if (typeof f != "function") {
            return function () {};
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
        for (var i = 0, ii = names.length; i < ii; i++) {
            (function (name) {
                var names = isArray(name) ? name : Str(name).split(separator),
                    e = events,
                    exist;
                for (var i = 0, ii = names.length; i < ii; i++) {
                    e = e.n;
                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {n: {}});
                }
                e.f = e.f || [];
                for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                    exist = true;
                    break;
                }
                !exist && e.f.push(f);
            }(names[i]));
        }
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    /*\
     * eve.f
     [ method ]
     **
     * Returns function that will fire given event with optional arguments.
     * Arguments that will be passed to the result function will be also
     * concated to the list of final arguments.
     | el.onclick = eve.f("click", 1, 2);
     | eve.on("click", function (a, b, c) {
     |     console.log(a, b, c); // 1, 2, [event object]
     | });
     - event (string) event name
     - varargs (…) and any other arguments
     = (function) possible event handler function
    \*/
    eve.f = function (event) {
        var attrs = [].slice.call(arguments, 1);
        return function () {
            eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)));
        };
    };
    /*\
     * eve.stop
     [ method ]
     **
     * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
    \*/
    eve.stop = function () {
        stop = 1;
    };
    /*\
     * eve.nt
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     - subname (string) #optional subname of the event
     **
     = (string) name of the event, if `subname` is not specified
     * or
     = (boolean) `true`, if current event’s name contains `subname`
    \*/
    eve.nt = function (subname) {
        var cur = isArray(current_event) ? current_event.join(".") : current_event;
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(cur);
        }
        return cur;
    };
    /*\
     * eve.nts
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     **
     = (array) names of the event
    \*/
    eve.nts = function () {
        return isArray(current_event) ? current_event : current_event.split(separator);
    };
    /*\
     * eve.off
     [ method ]
     **
     * Removes given function from the list of event listeners assigned to given name.
     * If no arguments specified all the events will be cleared.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
    \*/
    /*\
     * eve.unbind
     [ method ]
     **
     * See @eve.off
    \*/
    eve.off = eve.unbind = function (name, f) {
        if (!name) {
            eve._events = events = {n: {}};
            return;
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
        if (names.length > 1) {
            for (var i = 0, ii = names.length; i < ii; i++) {
                eve.off(names[i], f);
            }
            return;
        }
        names = isArray(name) ? name : Str(name).split(separator);
        var e,
            key,
            splice,
            i, ii, j, jj,
            cur = [events],
            inodes = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            for (j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                        inodes.unshift({
                            n: e,
                            name: names[i]
                        });
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                        inodes.unshift({
                            n: e,
                            name: key
                        });
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                            e.f.splice(j, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                            funcs.splice(j, 1);
                            break;
                        }
                        !funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        delete e.n[key].f;
                    }
                }
                e = e.n;
            }
        }
        // prune inner nodes in path
        prune: for (i = 0, ii = inodes.length; i < ii; i++) {
            e = inodes[i];
            for (key in e.n[e.name].f) {
                // not empty (has listeners)
                continue prune;
            }
            for (key in e.n[e.name].n) {
                // not empty (has children)
                continue prune;
            }
            // is empty
            delete e.n[e.name];
        }
    };
    /*\
     * eve.once
     [ method ]
     **
     * Binds given event handler with a given name to only run once then unbind itself.
     | eve.once("login", f);
     | eve("login"); // triggers f
     | eve("login"); // no listeners
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (function) same return function as @eve.on
    \*/
    eve.once = function (name, f) {
        var f2 = function () {
            eve.off(name, f2);
            return f.apply(this, arguments);
        };
        return eve.on(name, f2);
    };
    /*\
     * eve.version
     [ property (string) ]
     **
     * Current version of the library.
    \*/
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    glob.eve = eve;
     true && module.exports ? module.exports = eve :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () { return eve; }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;
})(typeof window != "undefined" ? window : this);


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(74);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(76)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(75)(false);
// imports


// module
exports.push([module.i, "/* CanvasTools.css */\n\n/* 1. Editor */\n/* 1.1. Cursors */\n.CanvasToolsEditor {\n    --cursor-pointer: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABUklEQVRoQ+3YMW6EMBAF0NkTmNOkTkVtCjdUcIFcAY4CNQ1HSNqkSx8JpBwATpDIllhptezCekg8XzIVErI1bz62JZ+MMa9d1z0T6HMioh9jzBsqwgFs81ERDqCUonmeIREOUFUVDcNAbdvCIc6Auq6pKAo4xAXArgU0xBUADbEKQELcBKAg7gIQEJsA6YhdAMmI3QCpiIcAEhEPA6QhvACSEN4AKQgWQAKCDQiNOAQQEnEYIBTiUEAIxOGA/0bsApRlSU3TeN0c/fVtxyZgKT5N0y+l1LePIsuylzzPP33Gbo25C1iK11p/9H3/tDVZiO83AQjF24atAlCKXwUgFX8FQCv+AjCOo9sqJS/YtU3CrYEkSWiaJrjizwnYF7TOL2m4BFCLdwlord+lHlJ7DkabAPQTAaHjiwnEBJgdiL8Qs4Hs4TEBdguZE8QEmA1kD/8FUOpiQO9zcnQAAAAASUVORK5CYII=') 2x), pointer;\n    --cursor-move: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACgElEQVRoQ+2ZS27CMBCGyQFygnZJb1Ep6SY3yJpHeweWQNVjVAHWvkE2hXtQVlwAcQCqiQhygsceP8bqAkuoqpqM/88ez/wuySDwmE6n38fjMavr+iVwaGW4JOQkIL6qqneIWRTFPgZEMIBW/Gg0atZks9lEgQgCIItfr9cNwHg8jgLhDaAS36ZlDAgvAJ34WBDOABTxMSCcAGzEc0NYA7iI54SwApDrvKp/zOfzwWKxaP4EP5fLJdpmQvUJMsBsNns9HA5fmCIhRKYCKMtyh72Tpum+qqoPn2ZKAoCVP5/PQyFErpnsguwAOkdZltvT6fTk07GNAG3awEpyAMDO+aSTFkDOeU4AH++EAsjVBnwNJwD4J1fvpATol8okSVgBLpeLs3e6A1DV+RgArgawA4A1qVgALhA3AF2HBQDKsGlkcjxIIXnYuNhGmcketN3VBJHn+QA+MLbbbfOhDFV8KkRiEk8RwPUMBeIGAA+vVisuLU5xJ5PJAG54RVH81nU9VAXppBAGoTNlctAsyzoptNuhNqijBc5Of1DEwzt3h1gFEfsQU8V3AOTD3IeIWUZtxN8BYBCxAGzFKwFUEDEAXMSjAH0IqAScZg5S1lRtsDL2n+w0Wip1NdjoESJdaJzEa1NIpma+Uj5jTYrS/Yw70Aa5Xuo/saBCiDfkUv+DvZOm6SHKpb4VEPjfKs5pIy8IeQf6EC7eybVUeh1i1cvtTthAcIgnH2JfCC7xXgA67yQDc4r3BjBBcIsPAoBBxBAfDKAPAb+7ehtK8/Iqo7oJel+zBqnzJiDrPmAKeP2iO/exB6Y52HbAZuJQzwbfgVDCqHEeANSV4nrusQNcK0uN+wdgZhRePQu00wAAAABJRU5ErkJggg==') 2x) 8 8, move;\n    --cursor-resize: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADKElEQVRoQ+2ZK6waQRSGB8W25iJBgWiTrQKNKWo1ZF1LwuM2teARgMCDbxdIqCSgUSgsoLqiTWhCAhLUBbXN2bBkgN15MWy5KVjm8X9zHvMPBJDkT7FY/LZcLj+ORqP3kpd2XS4gcxMQbxjGM6ypadovPyCkATjic7mcfSbdbtcXCCkAuPhOp2MD5PN5XyCuBnAT76SlHxBXAZDE+wUhDMAi3g8IIQBHfCgUQuVymamRNZtNtNlspBc2NwDeKpmUuwyS2WK5AURF32reA+BWJ8u6LjUCh5z/wrqgyLhDTbwTmUsEwAqWCiqyOTbHEi1sT2Fn3ebmAKIG0FWYI/7p6Qltt1tYmwoAcyaTySfTNN/ABFVVX5LJZM8wjK8M0bGcvXgjcSEMv2FjsRiq1+tEgEqlEu33+z9BeDweR6lUytY7Ho/RfD63QXRd/9BoNP4QQKxqtYoWiwW3ATwBOLcHtVqNCgACV6uVAi40nU6faBwOh7YrjUQiL6ZpvqUBwH68BvAI4OZtaADZbHbQ6/XSg8HgQrwjFiAymQwqFovfDcPw6mZ2BGA/XituA3gZMxoAnH4wGFRmsxkxzROJBNrv96QonADwQARIrpIGgBCySqUSAqNG+oDha7VapFq6AGCFOAJA7rXb7RMddwTwezQauV50Jyl0DkEDgBRSFEWZTqcsKbRzWqzLYFIKeYo/CamTSjgEDcCHIiaKv8jJcwgagHNhrddrBdLPrY0WCgUUDodJpw/LHCOAtVGqeNeiwiGi0Sj1HjhcZKZpmgp0G/wig+6kqupO13WV8yJjEu/ZFfAnIzwDOazEZwA5RGaXTCZ/EHo/XgoWPE8PT05m8URh/8jMcYmnnqzPdppbPBUAu6Vf54OG2Nzv5Euqz78TnZ4y/j8AST9sCRWsWxiEIoDfE+BGWT7gWOF5qmmaNPFMXchLnJt38hrLaw9YDsQZIxQBZzILxC3FXxUBFohbi5cCgF12z7gV90O8NIBzCMuynJ9HpBastC5EK2z4Xna38drzqiJ2W/TwR3fK6w3L02FYxkoHYNlU5pgHgMzTFFnrEQGRU5M559VH4C9ocYlPRB5IuQAAAABJRU5ErkJggg==') 2x) 8 8, nesw-resize;\n    --cursor-delete: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABn0lEQVRoQ+3YMW6EMBAAwL0XmNekhYraFG6o4AP5AvATqGl4ArRJlz4SSHkAvIDIljjlBHesAQevhKuTzpidXa8R3IQQdVmWHhAdNwAYhRANVYQCyORTRSgAYwyGYSCJUIAkSaBtWyiKghziDkjTFKIoIod4AMhe0ESo/tk45L13jxlAEzG6rguehz+F67qGpmnkbcwBNBCqf+T2ww45N8sy8wAkwm4AAjHK7aO7heQ2Mr6F/m6JF41tZxMv7WfN0wnbErvnLZ5Cz1a1EaEFQPTE7ozqLqANsA2xCWATYjPAFsQugA2I3YCzEYcAzkQcBjgLcSjgDMThgP9GoABxHEOe57oPSTXf9NeOVcAUvO/734yxny2KIAjewzD82nLt2jUvAVPwnPPPqqre1hY74/+nAArBT29Fs9dCKsEvAigFPwNQC/4B0HWdOiptbtilQ0I1seM40Pc9ueDvFZA/qGV+qoaqANXgVQU45x+2PqQwD8ZDPrBibmRqzgUwlVnsulcFsJkyNe+qgKnMYte9KoDNlKl5VwVMZRa7LvkK/AIya4BAvmH9YQAAAABJRU5ErkJggg==') 2x), pointer;\n    --cursor-add: -webkit-image-set(url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACEElEQVRoQ+2YsW7CMBCGnZEs4Wm6hol2DEOkKkMEL9BXAN4EmCqxMLZbsrZb90og9QFggTHVWZgGY+JLbNexlJOQIsU+33f/ne3gxXGcrdfrAXHUPEJIEcdxrgNitVo9H4/HRz4Xvu+/p2n6aiJHFAAc64A4qxnygerwfQ+eAgRBQA6HgzIEAygKmhNqnucp+61SjgJMp1Oy3W7JcrlUWswqwGw2I+PxWAnCOgBIVRPir1ZKOvMldKcEQH1lu5QQKMCsBkQRhiEZDK534bKv8jP4z7KM5HlO20M5+rMT2gP8QkgI4dyqwGCd+XxuHgBZTu0GQEAUUD58CYGizCDjsJUygxKCn/ESKpdBRTm1s4lFNYzpiVZso1UNKINoPYCsJ5wAqIKwdpkTnQOyQ0ZUTnCdPp1OT/zcXq/3ZvQ63QRAVk6yBOh6L7xK1HEua+w6vpqMVQawrYQWAJsQ2gBsQWgFsAGhHeC/IVAAk8mELBaLJpuE0jc2ZkEpAAt+OBx+B0Hwg3HKjxmNRi9Jknw1mSubUwnAgo+i6HOz2TzInNl4fxfAheDZV9HNZ6ErwQsBXAr+BsC14K8Adrsd3Srb3LCiTYI2cb/fJ/v93rngLwrAg2uZZ2pQBVwNnioQRdFHWw8pzMGo5Q9WzEKmxnQApjKL9dspgM2UqXGdAqYyi/XbKYDNlKlxnQKmMov167wCv7Mu7kBLP7biAAAAAElFTkSuQmCC') 2x), pointer;\n}\n\n/* 1.2. Layout */\n.CanvasToolsEditor {\n    display: grid;\n    grid-template-rows: 1fr;\n    grid-template-columns: 1fr; \n    width: 100%;\n    height: 100%;\n    box-sizing: content-box;\n}\n\n.CanvasToolsEditor * {\n    box-sizing: content-box;\n}\n\n.CanvasToolsEditor canvas {\n    position: relative;\n    grid-row: 1;\n    grid-column: 1;\n    z-index: 100;\n    width: 100%;\n    height: 100%;\n    pointer-events: none;\n    background-color: #111;\n}\n\n.CanvasToolsEditor svg {\n    position: relative;\n    grid-row: 1;\n    grid-column: 1;\n    z-index: 101;\n    width: 100%;\n    height: 100%;\n}\n\n.CanvasToolsEditor svg {\n    cursor: var(--cursor-pointer);\n}\n\n.CanvasToolsEditor svg title {\n    -moz-user-select: none; /* Firefox */\n    -ms-user-select: none; /* Internet Explorer/Edge */\n    user-select: none;\n    pointer-events: none;\n}\n\n.CanvasToolsContainer {\n    overflow: auto;\n    height: 100%;\n    width: 100%;\n}\n\n.CanvasToolsContainer:focus {\n    outline: none;\n}\n\n/* 2. RegionsManager\n\n.regionManager\n-->.regionStyle\n    --> .tagsLayer\n    --> .dragLayer\n    --> .anchorsLayer\n    \n--> .menuLayer\n    --> .menuRectStyle\n*/\n\n/* 2.1. General settings and layout */\n.regionManager {\n    pointer-events: none;\n}\n\n.regionStyle {\n    pointer-events: visiblePainted;\n}\n\n.dragRectStyle {\n    fill: transparent; \n    stroke-width: 0;\n    pointer-events: all;\n    cursor: var(--cursor-move);\n}\n\n.dragPointStyle {\n    stroke-width: 0;\n    pointer-events: all;\n    cursor: var(--cursor-move);\n    filter: url(#black-glow);\n}\n\n.tagsLayer {\n    pointer-events: none;\n}\n\n.primaryTagRectStyle {\n    stroke-width: 2;\n    stroke-dasharray: 0.5 4;\n    stroke-linecap: round;\n    filter: url(#black-glow);\n}\n\n.primaryTagPointStyle {\n    stroke-width: 1; \n}\n\n.primaryTagTextStyle {\n    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n    font-size: 9pt;\n    fill: #fff;\n    -moz-user-select: none; /* Firefox */\n    -ms-user-select: none; /* Internet Explorer/Edge */\n    user-select: none;\n    pointer-events: none;\n}\n\n.primaryTagTextStyle::selection {\n    background: none;\n    fill: #fff;\n}\n\n.secondaryTagStyle {\n    stroke-width: 0;\n    pointer-events: none;\n}\n\n.midpointStyle {\n    stroke-width: 2;\n}\n\n.bezierControlPointTangentStyle,\n.bezierControlPointStyle {\n    stroke-width: 2;\n}\n\n.anchorStyle {\n    stroke-width: 2;\n}\n\n.anchorStyle.ghost {\n    cursor: var(--cursor-resize);\n}\n\n.anchorStyle.ghost.delete {\n    cursor: var(--cursor-delete);\n}\n\n.anchorStyle.ghost.add {\n    cursor: var(--cursor-add);\n}\n\n.anchorStyle.ghost {\n    stroke-width: 0;\n}\n\n.primaryTagBoundRectStyle {\n    stroke-width: 2;\n}\n\n.primaryTagPolylineStyle, .primaryTagPolygonStyle {\n    stroke-width: 2;\n    stroke-linecap: round;\n    stroke-dasharray: 0.5 4;\n}\n\n/* 2.2. Default colors */\n.regionManager {\n    --default-color-pure: rgb(128, 128, 128);\n    --default-color-accent: rgba(128, 128, 128, 0.8);\n    --default-color-dark: rgba(64, 64, 64, 0.8);\n    --default-color-shadow: rgba(128, 128, 128, 0.4);\n    --default-color-highlight: rgba(128, 128, 128, 0.2);\n    --default-color-white: rgb(255, 255, 255);\n    --default-color-transparent: rgba(255, 255, 255, 0);\n    --default-color-ghost: rgba(255, 255, 255, 0.5);\n    --default-color-delete: rgba(216, 24, 65, 1.0);\n    --default-color-add: rgba(21, 127, 240, 1.0);\n    --default-color-control: rgb(253, 128, 45);\n}\n\n/* 2.2.1. Shared colors */\n.secondaryTagStyle {\n    fill: var(--default-color-accent);\n}\n\n.midpointStyle {\n    stroke: none;\n    fill: none;\n}\n\n.bezierControlPointTangentStyle,\n.bezierControlPointStyle {\n    stroke: none;\n    fill: none;\n}\n\n.anchorStyle {\n    stroke: var(--default-color-dark);\n    fill: var(--default-color-pure);\n}\n\n.regionStyle:hover .anchorStyle {\n    stroke: var(--default-color-white);\n}\n\n.regionStyle:hover .midpointStyle {\n    stroke: var(--default-color-white);\n    fill: var(--default-color-white);\n}\n\n.regionStyle:hover .midpointStyle:hover {\n    stroke: var(--default-color-accent);\n}\n\n.regionStyle.selected .bezierControlPointTangentStyle,\n.regionStyle:hover .bezierControlPointTangentStyle {\n    stroke: var(--default-color-control);\n    stroke-dasharray: 4;\n}\n\n.regionStyle.selected .bezierControlPointStyle,\n.regionStyle:hover .bezierControlPointStyle {\n    stroke: var(--default-color-control);\n    fill: var(--default-color-pure);\n}\n\n.regionStyle.selected .bezierControlPointStyle:hover,\n.regionStyle:hover .bezierControlPointStyle:hover {\n    cursor: var(--cursor-resize);\n    stroke: var(--default-color-control);\n    fill: var(--default-color-control);\n}\n\n.anchorStyle.ghost,\n.anchorStyle.ghost:hover,\n.regionStyle.selected .anchorStyle.ghost,\n.regionStyle.selected .anchorStyle.ghost:hover {\n    fill: var(--default-color-ghost);\n}\n\n.anchorStyle:hover {\n    stroke: var(--default-color-white);\n}\n\n/* 2.2.2. Rect region colors */\n.primaryTagRectStyle {\n    fill: var(--default-color-shadow);\n    stroke:var(--default-color-accent);\n}\n\n.regionStyle:hover .primaryTagRectStyle {\n    fill: var(--default-color-highlight);\n    stroke: var(--default-color-white);\n}\n\n.regionStyle.selected .primaryTagRectStyle {\n    fill: var(--default-color-highlight);\n    stroke-dasharray: none;\n}\n\n.primaryTagTextBGStyle {\n    fill: var(--default-color-dark);\n}\n\n.anchorBoneStyle {\n    fill: var(--default-color-transparent);\n}\n\n/* 2.2.3. Point region  colors */\n.primaryTagPointStyle {\n    fill: var(--default-color-pure);\n    stroke:var(--default-color-white);\n}\n\n.dragPointStyle {\n    fill: var(--default-color-ghost);\n    opacity: 0.5;\n}\n\n.regionStyle:hover .dragPointStyle,\n.regionStyle.selected .dragPointStyle {\n    fill: var(--default-color-ghost);\n    opacity: 1.0;\n}\n\n/* 2.2.4. Polyline, polygon region colors */\n.primaryTagBoundRectStyle {\n    fill: var(--default-color-shadow);\n    stroke:var(--default-color-accent);\n    opacity: 0.25;\n}\n\n.regionStyle.selected .primaryTagBoundRectStyle {\n    fill: var(--default-color-highlight);\n    opacity: 1;\n}\n\n.regionStyle:hover .primaryTagBoundRectStyle {\n    fill: var(--default-color-highlight);\n    stroke: var(--default-color-white);\n    opacity: 0.75;\n}\n\n.primaryTagPolylineStyle {\n    fill: var(--default-color-transparent);\n    stroke: var(--default-color-pure);\n}\n\n.regionStyle.selected .primaryTagPolylineStyle {\n    filter: url(#black-glow);\n    stroke-dasharray: none;\n}\n\n.primaryTagPolygonStyle {\n    fill: var(--default-color-shadow);\n    stroke: var(--default-color-pure);\n}\n\n.regionStyle.selected .primaryTagPolygonStyle {\n    fill: var(--default-color-highlight);\n    filter: url(#black-glow);\n    stroke-dasharray: none;\n}\n\n.regionStyle:hover .primaryTagPolygonStyle {\n    fill: var(--default-color-highlight);\n}\n\n.regionStyle:hover .anchorStyle.ghost.delete,\n.regionStyle.selected .anchorStyle.ghost.delete,\n.anchorStyle.ghost.delete,\n.anchorStyle.ghost.delete:hover {\n    stroke: var(--default-color-delete);\n    stroke-width: 2px;\n    fill: var(--default-color-transparent);\n}\n\n.regionStyle:hover .anchorStyle.ghost.add,\n.regionStyle.selected .anchorStyle.ghost.add,\n.anchorStyle.ghost.add,\n.anchorStyle.ghost.add:hover {\n    stroke: var(--default-color-add);\n    stroke-width: 2px;\n    fill: var(--default-color-transparent);\n}\n\n.anchorLineStyle {\n    fill: none;\n    stroke-width: 5;\n    stroke: var(--default-color-transparent);  \n}\n\nsvg:not(:root) .menuLayer {\n    overflow: visible;\n}\n\n.menuRectStyle { \n    stroke-width:0;\n    fill: #000;\n    filter: url(#black-glow); \n}\n\n.menuItemBack {\n    stroke-width: 1.5;\n    stroke: rgba(198, 198, 198, 0.2);\n    fill:  #000;\n}\n\n.menuIcon {\n    font-family: 'Segoe UI Emoji', Tahoma, Geneva, Verdana, sans-serif;\n    font-size: 10pt;\n    fill: #fff;\n}\n\n.menuItem {\n    stroke-width: 1.5;\n    stroke: #fff;\n    fill:transparent;\n}\n\n.menuItem:hover {\n    stroke: #157ff0;\n}\n\n/* Freezing regions */ \n\n.regionManager.frozen .regionStyle.old,\n.regionManager.frozen .regionStyle.old .dragRectStyle,\n.regionManager.frozen .regionStyle.old .dragPointStyle {\n    pointer-events: none;\n}\n\n.regionManager.frozen .regionStyle.old .dragRectStyle, \n.regionManager.frozen .regionStyle.old .anchorStyle.TL, \n.regionManager.frozen .regionStyle.old .anchorStyle.BR, \n.regionManager.frozen .regionStyle.old .anchorStyle.TR, \n.regionManager.frozen .regionStyle.old .anchorStyle.BL {\n    cursor: default; \n}\n\n.regionManager.frozen .anchorStyle.ghost {\n    display: none;\n}\n\n.regionManager.frozen .regionStyle.old, \n.regionManager.frozen .regionStyle.old:hover{\n    opacity: 0.5;\n}\n\n.regionManager.frozen .regionStyle.old .primaryTagRectStyle,\n.regionManager.frozen .regionStyle.old .primaryTagPointStyle,\n.regionManager.frozen .regionStyle.old .primaryTagPolylineStyle,\n.regionManager.frozen .regionStyle.old .primaryTagPolygonStyle {\n    stroke-width: 1;\n    stroke-dasharray: 0 0;\n}\n\n.regionManager.frozen .regionStyle.old .anchorStyle {\n    display: none;\n}\n\n.regionManager.frozen .regionStyle.old .primaryTagTextStyle,\n.regionManager.frozen .regionStyle.old .primaryTagTextBGStyle {\n    opacity: 0.25;\n}\n\n/* AreaSelector\n\n.areaSelector\n-->.rectSelector\n    --> .maskStyle\n        [mask]\n            .maskInStyle\n            .maskOutStyle\n        .crossStyle\n            line\n            line\n-->.rectCopySelector\n    --> .crossStyle\n            line\n            line\n        .copyRectStyle\n-->.pointSelector\n    --> .crossStyle\n        .pointStyle\n-->.polylineSelector\n    --> .polylineStyle\n        .polylineGroupStyle\n        --> .polylinePointStyle\n        .nextSegmentStyle\n        .nextPointStyle\n-->.polygonSelector\n    --> .polygonStyle\n        .polygonGroupStyle\n        --> .polygonPointStyle\n        .nextSegmentStyle\n        .nextPointStyle\n*/\n\n#selectionOverlay {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    pointer-events: none;\n}\n\n.crossStyle line {\n    stroke-width:1;\n    stroke-dasharray: 3 3;\n    stroke: #666;\n    pointer-events: none; \n}\n\n.crossStyle .blackDashes {\n    stroke-width:3;\n    stroke-dasharray: 3 3;\n    stroke: #000;\n    pointer-events: none; \n}\n\n.crossStyle .whiteDashes {\n    stroke-width:3;\n    stroke-dasharray: 0 3 0;\n    stroke: #fff;\n    pointer-events: none; \n}\n\n.selectionBoxStyle {\n    fill: #fff;\n    fill-opacity: 0.25;\n    stroke-width: 0;\n    pointer-events: none;\n}\n\n.rectCopySelector .copyRectStyle {\n    stroke-width:3;\n    stroke: #000;\n    fill: transparent;\n    pointer-events: none; \n}\n\n.pointSelector .pointStyle {\n    stroke-width:2;\n    stroke: rgba(21, 127, 240, 1.0);\n    fill: transparent;\n    pointer-events: none; \n}\n\n.polylineSelector .polylineStyle {\n    fill: transparent;\n    stroke-width: 2px;\n    stroke:  rgba(21, 127, 240, 0.5);\n    pointer-events: none;\n}\n\n.polylineSelector .polylinePointStyle {\n    fill:  rgba(21, 127, 240, 1.0);\n    stroke-width: 0;\n    pointer-events: none;\n}\n\n.polylineSelector .nextSegmentStyle {\n    stroke-width:2;\n    stroke-dasharray: 3 3;\n    stroke: rgba(21, 127, 240, 1.0);\n    pointer-events: none;\n}\n.polylineSelector .nextPointStyle {\n    stroke-width:2;\n    r: 6px;\n    stroke: rgba(21, 127, 240, 1.0);\n    fill: transparent;\n    pointer-events: none;\n}\n\n.polygonSelector .polygonStyle {\n    fill: rgba(255,255,255, 0.2);\n    stroke-width: 2px;\n    stroke:  rgba(21, 127, 240, 0.5);\n    pointer-events: none;\n}\n\n.polygonSelector .polygonPointStyle {\n    fill:  rgba(21, 127, 240, 1.0);\n    stroke-width: 0;\n    pointer-events: none;\n}\n\n.polygonSelector .nextSegmentStyle {\n    stroke-width:2;\n    stroke-dasharray: 3 3;\n    stroke: rgba(21, 127, 240, 1.0);\n    pointer-events: none;\n}\n.polygonSelector .nextPointStyle {\n    stroke-width:2;\n    r: 6px;\n    stroke: rgba(21, 127, 240, 1.0);\n    fill: transparent;\n    pointer-events: none;\n}\n\n/* Toolbar \n\n.toolbarLayer\n--> .toolbarBGStyle\n--> .iconsLayerStyle\n    --> .iconStyle\n        --> .iconBGRectStyle\n            .iconImageStyle\n*/\n.toolbarBGStyle {\n    fill: #000;\n}\n\n.iconStyle {\n    pointer-events: all;\n}\n\n.iconStyle.selector .iconBGRectStyle{\n    fill: transparent;\n}\n\n.iconStyle.selector:hover .iconBGRectStyle {\n    fill: #157ff0;\n}\n\n.iconStyle.selector.selected .iconBGRectStyle {\n    fill: #157ff0;\n}\n\n.iconStyle .iconImageStyle * {\n    stroke: #fff;\n}\n\n\n.iconStyle.switch .iconBGRectStyle{\n    fill: transparent;\n}\n\n.iconStyle.switch:hover .iconBGRectStyle{\n    fill: #157ff0;\n}\n\n.iconStyle.switch .iconImageStyle * {\n    stroke: #fff;\n}\n\n.iconStyle.switch.selected .iconImageStyle * {\n    stroke: rgb(14, 186, 253);\n    stroke-width: 1.5;\n}\n\n.iconStyle .iconImageStyle .accent-f {\n    fill: rgba(21, 127, 240, 1.0);\n}\n\n.iconStyle .iconImageStyle .accent-s {\n    stroke: rgba(21, 127, 240, 1.0);\n}\n\n.iconStyle.separator line {\n    stroke: #fff;\n    stroke-width: 0.5px;\n}\n\n/* Announcer */\n#regionAnnouncer {\n    position: absolute !important;\n    height: 0px; \n    width: 0px;\n    overflow: hidden;\n    clip: rect(0px, 0px, 0px, 0px);\n    clip-path: polygon(0px 0px, 0px 0px, 0px 0px);\n    -webkit-clip-path: polygon(0px 0px, 0px 0px, 0px 0px);\n    white-space: nowrap;\n}\n", ""]);

// exports


/***/ }),
/* 75 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(77);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 77 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
});
//# sourceMappingURL=ct.js.map