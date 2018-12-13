import { Toolbar as CTToolbar } from "./CanvasTools.Toolbar";
import { RegionsManager } from "./CanvasTools.RegionsManager";
import { PointRegion } from "./CanvasTools.PointRegion";
import { RectRegion } from "./CanvasTools.RectRegion";
import { AreaSelector, SelectionMode } from "./CanvasTools.Selection";
import { FilterPipeline } from "./CanvasTools.Filter";
import { Rect } from "./Core/CanvasTools.Rect";
import { Point2D } from "./Core/CanvasTools.Point2D";
import { TagsDescriptor, Tag } from "./Core/CanvasTools.Tags";
import { Editor as CTEditor } from "./CanvasTools.Editor";
export declare module CanvasTools {
    const Core: {
        Rect: typeof Rect;
        Point2D: typeof Point2D;
        TagsDescriptor: typeof TagsDescriptor;
        Tag: typeof Tag;
    };
    const Selection: {
        AreaSelector: typeof AreaSelector;
        SelectionMode: typeof SelectionMode;
    };
    const Region: {
        RegionsManager: typeof RegionsManager;
        PointRegion: typeof PointRegion;
        RectRegion: typeof RectRegion;
    };
    const Filter: typeof FilterPipeline;
    const Editor: typeof CTEditor;
    const Toolbar: typeof CTToolbar;
}
import "./../css/canvastools.css";
