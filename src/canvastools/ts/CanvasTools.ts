import { Toolbar as CTToolbar, ToolbarItemType } from "./CanvasTools/CanvasTools.Toolbar";
import { RegionsManager } from "./CanvasTools/CanvasTools.RegionsManager";
import { PointRegion } from "./CanvasTools/CanvasTools.PointRegion";
import { RectRegion } from "./CanvasTools/CanvasTools.RectRegion";
import { AreaSelector, SelectionMode } from "./CanvasTools/CanvasTools.Selection";
import { FilterPipeline, InvertFilter, GrayscaleFilter } from "./CanvasTools/CanvasTools.Filter";
import { RegionComponent } from "./CanvasTools/CanvasTools.RegionComponent";
import { Rect } from "./CanvasTools/Core/CanvasTools.Rect";
import { Point2D } from "./CanvasTools/Core/CanvasTools.Point2D";
import { TagsDescriptor, Tag } from "./CanvasTools/Core/CanvasTools.Tags";
import { Editor as CTEditor } from "./CanvasTools/CanvasTools.Editor";
import * as Snap from "snapsvg";

export module CanvasTools {
    export const Core = {
        Rect: Rect,
        Point2D: Point2D,
        TagsDescriptor: TagsDescriptor,
        Tag: Tag
    }

    export const Selection = {
        AreaSelector: AreaSelector,
        SelectionMode: SelectionMode
    }
    export const Region = {
        RegionsManager: RegionsManager,
        PointRegion: PointRegion,
        RectRegion: RectRegion
    }
    
    export const Filters = {
        InvertFilter: InvertFilter,
        GrayscaleFilter: GrayscaleFilter
    };
    export const Editor = CTEditor;
    export const Toolbar = CTToolbar;
}

/* CSS */
import "./../css/canvastools.css";
