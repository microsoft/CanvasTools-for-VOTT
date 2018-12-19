import { ToolbarItemType } from "./CanvasTools/Toolbar/CanvasTools.ToolbarIcon";
import { Toolbar as CTToolbar } from "./CanvasTools/Toolbar/CanvasTools.Toolbar";
import { RegionsManager } from "./CanvasTools/Region/CanvasTools.Region.RegionsManager";
import { PointRegion } from "./CanvasTools/Region/Point/CanvasTools.Region.PointRegion";
import { RectRegion } from "./CanvasTools/Region/Rect/CanvasTools.Region.RectRegion";
import { AreaSelector, SelectionMode } from "./CanvasTools/Selection/CanvasTools.Selection.AreaSelector";
import { FilterPipeline, InvertFilter, GrayscaleFilter } from "./CanvasTools/CanvasTools.Filter";
import { RegionComponent } from "./CanvasTools/Region/CanvasTools.Region.RegionComponent";
import { Rect } from "./CanvasTools/Core/CanvasTools.Rect";
import { Point2D } from "./CanvasTools/Core/CanvasTools.Point2D";
import { RegionData } from "./CanvasTools/Core/CanvasTools.RegionData";
import { Tag } from "./CanvasTools/Core/CanvasTools.Tag";
import { TagsDescriptor } from "./CanvasTools/Core/CanvasTools.TagsDescriptor";
import { Editor as CTEditor } from "./CanvasTools/CanvasTools.Editor";

import "snapsvg-cjs";
import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

export module CanvasTools {
    export const Core = {
        Rect: Rect,
        Point2D: Point2D,
        RegionData: RegionData,
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
