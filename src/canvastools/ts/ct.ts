import { ToolbarItemType } from "./CanvasTools/Toolbar/ToolbarIcon";
import { Toolbar as CTToolbar } from "./CanvasTools/Toolbar/Toolbar";
import { RegionsManager } from "./CanvasTools/Region/RegionsManager";
import { PointRegion } from "./CanvasTools/Region/Point/PointRegion";
import { RectRegion } from "./CanvasTools/Region/Rect/RectRegion";
import { AreaSelector, SelectionMode } from "./CanvasTools/Selection/AreaSelector";
import { FilterPipeline, InvertFilter, GrayscaleFilter, BlurDiffFilter, ContrastFilter,
         BrightnessFilter, SaturationFilter } from "./CanvasTools/CanvasTools.Filter";
import { Rect } from "./CanvasTools/Core/Rect";
import { Point2D } from "./CanvasTools/Core/Point2D";
import { RegionData } from "./CanvasTools/Core/RegionData";
import { Tag } from "./CanvasTools/Core/Tag";
import { TagsDescriptor } from "./CanvasTools/Core/TagsDescriptor";
import { Editor as CTEditor } from "./CanvasTools/CanvasTools.Editor";
import { RGBColor } from "./CanvasTools/Core/Colors/RGBColor";
import { LABColor } from "./CanvasTools/Core/Colors/LABColor";
import { XYZColor } from "./CanvasTools/Core/Colors/XYZColor";
import { HSLColor } from "./CanvasTools/Core/Colors/HSLColor";
import { Palette } from "./CanvasTools/Core/Colors/Palette";

import "snapsvg-cjs";
/* import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE; */

export class CanvasTools {
    public static Core = {
        Rect,
        Point2D,
        RegionData,
        TagsDescriptor,
        Tag,
        Colors: {
            RGBColor,
            LABColor,
            XYZColor,
            HSLColor,
            Palette,
        },
    };

    public static Selection = {
        AreaSelector,
        SelectionMode,
    };

    public static Region = {
        RegionsManager,
        PointRegion,
        RectRegion,
    };

    public static Filters = {
        InvertFilter,
        GrayscaleFilter,
        BlurDiffFilter,
        ContrastFilter,
        BrightnessFilter,
        SaturationFilter,
    };

    public static Editor = CTEditor;
    public static Toolbar = CTToolbar;
}

/* CSS */
import "./../css/canvastools.css";
