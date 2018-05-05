define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CanvasTools;
    (function (CanvasTools) {
        var Base;
        (function (Base) {
            class Rect {
                constructor(width, height) {
                    this.resize(width, height);
                }
                resize(width, height) {
                    this.width = width;
                    this.height = height;
                }
            }
            Base.Rect = Rect;
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
            Base.Point2D = Point2D;
        })(Base = CanvasTools.Base || (CanvasTools.Base = {}));
    })(CanvasTools = exports.CanvasTools || (exports.CanvasTools = {}));
});
//# sourceMappingURL=basetool.js.map