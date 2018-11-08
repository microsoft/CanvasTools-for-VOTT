import * as Snap from "snapsvg";
import * as CTBaseRect from "./Base/CanvasTools.Base.Rect";
import Rect = CTBaseRect.CanvasTools.Base.Rect.Rect;

export module CanvasTools.Toolbar {
    export type ToolbarPositionMode = "fixed";

    export class Toolbar {
        private baseParent: SVGSVGElement;
        private paper: Snap.Paper;
        private paperRect: Rect;

        private positionMode: ToolbarPositionMode;

        private toolbarWidth: number = 50;

        constructor(svgHost: SVGSVGElement, positionMode:ToolbarPositionMode = "fixed"){
            this.buildUIElements(svgHost);
            this.positionMode = positionMode;
        }

        private buildUIElements(svgHost: SVGSVGElement) {
            this.baseParent = svgHost;
            this.paper = Snap(svgHost);      
            this.paperRect = new Rect(svgHost.width.baseVal.value, svgHost.height.baseVal.value);
            
            let toolbarLayer = this.paper.g();
            toolbarLayer.addClass("toolbarLayer");

            let backgroundRect = this.paper.rect(0, 0, this.toolbarWidth, this.paperRect.height);
            backgroundRect.addClass("toolbarBGStyle");
        }
    }
}