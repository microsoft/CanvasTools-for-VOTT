export * from "@CTBase/CanvasTools.Base.Interfaces";
import * as IBase from "@CTBase/CanvasTools.Base.Interfaces";
import * as Point2D from "@CTBase/CanvasTools.Base.Point2D";
import * as Rect from "@CTBase/CanvasTools.Base.Rect";
import * as Tags from "@CTBase/CanvasTools.Base.Tags";

import * as SelectionTool from "@canvastools/CanvasTools.Selection";
import * as RegionTool from "@canvastools/CanvasTools.Region";
import * as FilterTool from "@canvastools/CanvasTools.Filter";

export namespace CanvasTools {
    export const Base = {
        Point: Point2D.CanvasTools.Base.Point,
        Rect: Rect.CanvasTools.Base.Rect,
        Tags: Tags.CanvasTools.Base.Tags
    }

    export const Selection = SelectionTool.CanvasTools.Selection;
    export const Region = RegionTool.CanvasTools.Region;
    export const Filter = FilterTool.CanvasTools.Filter;
}
