/// <reference types="snapsvg" />
export * from "./Base/CanvasTools.Base.Interfaces";
import IBase = require("./Base/CanvasTools.Base.Interfaces");
import Point2D = require("./Base/CanvasTools.Base.Point2D");
import Rect = require("./Base/CanvasTools.Base.Rect");
import Tags = require("./Base/CanvasTools.Base.Tags");

import SelectionTool = require("./CanvasTools.Selection");
import RegionTool = require("./CanvasTools.Region");
import FilterTool = require("./CanvasTools.Filter");
import ToolbarTools = require("./CanvasTools.Toolbar");

export module CanvasTools {
    export const Base = {
        Point: Point2D.CanvasTools.Base.Point,
        Rect: Rect.CanvasTools.Base.Rect,
        Tags: Tags.CanvasTools.Base.Tags
    } 

    export const Selection = SelectionTool.CanvasTools.Selection;
    export const Region = RegionTool.CanvasTools.Region;
    export const Filter = FilterTool.CanvasTools.Filter;
    export const Toolbar = ToolbarTools.CanvasTools.Toolbar;
}


/* CSS */
import "./../css/canvastools.css";
