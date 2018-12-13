import { Toolbar as CTToolbar, ToolbarItemType } from "./CanvasTools.Toolbar";
import { RegionsManager } from "./CanvasTools.RegionsManager";
import { PointRegion } from "./CanvasTools.PointRegion";
import { RectRegion } from "./CanvasTools.RectRegion";
import { AreaSelector, SelectionMode } from "./CanvasTools.Selection";
import { FilterPipeline, InvertFilter, GrayscaleFilter } from "./CanvasTools.Filter";
import { RegionComponent } from "./CanvasTools.RegionComponent";
import { Rect } from "./Core/CanvasTools.Rect";
import { Point2D } from "./Core/CanvasTools.Point2D";
import { TagsDescriptor, Tag } from "./Core/CanvasTools.Tags";
import { Editor as CTEditor } from "./CanvasTools.Editor";
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
