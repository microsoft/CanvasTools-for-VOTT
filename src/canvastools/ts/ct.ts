import { Editor as CTEditor } from "./CanvasTools/CanvasTools.Editor";
import { BlurDiffFilter, BrightnessFilter, ContrastFilter, GrayscaleFilter,
         InvertFilter, SaturationFilter } from "./CanvasTools/CanvasTools.Filter";
import { Color } from "./CanvasTools/Core/Colors/Color";
import { HSLColor } from "./CanvasTools/Core/Colors/HSLColor";
import { LABColor } from "./CanvasTools/Core/Colors/LABColor";
import { Palette } from "./CanvasTools/Core/Colors/Palette";
import { RGBColor } from "./CanvasTools/Core/Colors/RGBColor";
import { XYZColor } from "./CanvasTools/Core/Colors/XYZColor";
import { Point2D } from "./CanvasTools/Core/Point2D";
import { Rect } from "./CanvasTools/Core/Rect";
import { RegionData } from "./CanvasTools/Core/RegionData";
import { Tag } from "./CanvasTools/Core/Tag";
import { TagsDescriptor } from "./CanvasTools/Core/TagsDescriptor";
import { SelectionMode } from "./CanvasTools/Interface/ISelectorSettings";
import { PointRegion } from "./CanvasTools/Region/Point/PointRegion";
import { RectRegion } from "./CanvasTools/Region/Rect/RectRegion";
import { RegionsManager } from "./CanvasTools/Region/RegionsManager";
import { AreaSelector } from "./CanvasTools/Selection/AreaSelector";
import { Toolbar as CTToolbar } from "./CanvasTools/Toolbar/Toolbar";

// Snap adds itself to the window
import "snapsvg-cjs";

export class CanvasTools {
    /**
     * Core internal classes.
     */
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
            Color,
        },
    };

    /**
     * Classes for new region selection (creation).
     */
    public static Selection = {
        AreaSelector,
        SelectionMode,
    };

    /**
     * Classes for regions management.
     */
    public static Region = {
        RegionsManager,
        PointRegion,
        RectRegion,
    };

    /**
     * Classes and functions to apply filters to the source image.
     */
    public static Filters = {
        InvertFilter,
        GrayscaleFilter,
        BlurDiffFilter,
        ContrastFilter,
        BrightnessFilter,
        SaturationFilter,
    };

    /**
     * The Editor component.
     */
    public static Editor = CTEditor;

    /**
     * The Toolbar component.
     */
    public static Toolbar = CTToolbar;
}

/* CSS */
import "./../css/canvastools.css";
