import { Point2D } from "../../Core/CanvasTools.Point2D";
import { Rect } from "../../Core/CanvasTools.Rect";
import { RegionData } from "./../../Core/CanvasTools.RegionData";
import { TagsDescriptor } from "../../Core/CanvasTools.TagsDescriptor";

import { IEventDescriptor } from "../../Interface/IEventDescriptor";
import { IFreezable } from "../../Interface/IFreezable";
import { IHideable } from "../../Interface/IHideadble";
import { IMovable } from "../../Interface/IMovable";
import { IResizable } from "../../Interface/IResizable";
import { ITagsUpdateOptions } from "../../Interface/ITagsUpdateOptions";

import { ChangeEventType, ChangeFunction, ManipulationFunction, RegionComponent } from "./../CanvasTools.Region.RegionComponent";

import * as SNAPSVG_TYPE from "snapsvg";
declare var Snap: typeof SNAPSVG_TYPE;

/*
* TagsElement 
* Used internally to draw labels and map colors for the region
*/
export class TagsElement extends RegionComponent {
   private radius: number = 3;

   // Elements
   private primaryTagNode: Snap.Element;
   private primaryTagBoundRect: Snap.Element;

   private primaryTagPointsArray: Array<Snap.Element>;
   private primaryTagPointsGroup: Snap.Element;
   private primaryTagPolyline: Snap.Element;

   private secondaryTagsGroup: Snap.Element;
   private secondaryTags: Array<Snap.Element>;

   // Tags
   public tags: TagsDescriptor;

   // Styling
   private styleId: string;
   private styleSheet: CSSStyleSheet = null;
   private tagsUpdateOptions: ITagsUpdateOptions;

   private regionData: RegionData;

   constructor(paper: Snap.Paper, paperRect: Rect, regionData: RegionData, tags: TagsDescriptor, styleId: string, styleSheet: CSSStyleSheet, tagsUpdateOptions?: ITagsUpdateOptions) {
       super(paper, paperRect);
       this.boundRect = regionData.boundRect;
       this.x = regionData.x;
       this.y = regionData.y;
       this.regionData = regionData.copy();

       this.styleId = styleId;
       this.styleSheet = styleSheet;

       this.tagsUpdateOptions = tagsUpdateOptions;

       this.buildOn(paper, tags);
   }

   private buildOn(paper: Snap.Paper, tags: TagsDescriptor) {
       this.node = paper.g();
       this.node.addClass("tagsLayer");

       this.primaryTagNode = paper.g();

       this.primaryTagBoundRect = paper.rect(this.x, this.y, this.boundRect.width, this.boundRect.height);
       this.primaryTagBoundRect.addClass("primaryTagBoundRectStyle");
      
       this.primaryTagPointsGroup = paper.g();
       this.primaryTagPointsArray = new Array<Snap.Element>();

       let pointsData = [];
       this.regionData.points.forEach(p => {
           pointsData.push(p.x, p.y);
           let point = paper.circle(p.x, p.y, 3);

           point.addClass("primaryTagPolylinePointStyle")
           this.primaryTagPointsArray.push(point);
           this.primaryTagPointsGroup.add(point);
       });
       this.primaryTagPolyline = paper.polyline(pointsData);
       this.primaryTagPolyline.addClass("primaryTagPolylineStyle");
       
       this.regionData.points.forEach(p => {
           pointsData.push(p.x, p.y);
       });

       this.primaryTagNode.add(this.primaryTagBoundRect);
       this.primaryTagNode.add(this.primaryTagPolyline);
       this.primaryTagNode.add(this.primaryTagPointsGroup);

       //this.primaryTagPoint = paper.circle(0, 0, this.radius);
       //this.primaryTagPoint.addClass("primaryTagPointStyle");

       this.secondaryTagsGroup = paper.g();
       this.secondaryTagsGroup.addClass("secondatyTagsLayer");
       this.secondaryTags = [];

       this.node.add(this.primaryTagNode);
       this.node.add(this.secondaryTagsGroup);

       this.updateTags(tags, this.tagsUpdateOptions);
   }

   public updateTags(tags: TagsDescriptor, options?: ITagsUpdateOptions) {
       this.tags = tags;

       this.redrawTagLabels();
       this.clearColors();

       let showBackground = (options !== undefined) ? options.showRegionBackground : true;
       this.applyColors(showBackground);
   }

   private redrawTagLabels() {
       // Clear secondary tags -> redraw from scratch
       for (let i = 0; i < this.secondaryTags.length; i++) {
           this.secondaryTags[i].remove();
       }
       this.secondaryTags = [];
       // If there are tags assigned
       if (this.tags) {
           if (this.tags.primary !== undefined) {
               // Primary Tag

           }
           // Secondary Tags
           if (this.tags.secondary && this.tags.secondary.length > 0) {
               let length = this.tags.secondary.length;
               for (let i = 0; i < length; i++) {
                   let stag = this.tags.secondary[i];

                   let s = 6;
                   let x = this.x + this.boundRect.width / 2 + (2 * i - length + 1) * s - s / 2;
                   let y = this.y - s - 5;
                   let tagel = this.paper.rect(x, y, s, s);

                   window.requestAnimationFrame(() => {
                       tagel.addClass("secondaryTagStyle");
                       tagel.addClass(`secondaryTag-${stag.name}`);
                   });

                   this.secondaryTagsGroup.add(tagel);
                   this.secondaryTags.push(tagel);
               }
           }
       }
   }

   private clearColors() {
       while (this.styleSheet.cssRules.length > 0) {
           this.styleSheet.deleteRule(0);
       }
   }

   // Map colors to region
   private applyColors(showRegionBackground: boolean = true) {
       // Map primary tag color
       if (this.tags && this.tags.primary !== undefined) {
           let styleMap = [
               {
                   rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                   style: `fill: ${this.tags.primary.colorShadow};
                           stroke: ${this.tags.primary.colorDark};`
               },
               {
                   rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                   style: `fill: ${this.tags.primary.colorAccent};
                           stroke: ${this.tags.primary.colorDark};`
               },
               {
                   rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                   style: `fill: ${this.tags.primary.colorShadow};
                           stroke: ${this.tags.primary.colorAccent};`
               },
               {
                   rule: `.${this.styleId} .primaryTagPolylineStyle`,
                   style: `stroke: ${this.tags.primary.colorPure};`
               },             
               {
                   rule: `.${this.styleId} .primaryTagPolylinePointStyle`,
                   style: `fill: ${this.tags.primary.colorPure};
                           stroke:${this.tags.primary.colorAccent};`
               },
               {
                   rule: `.regionStyle.${this.styleId}:hover  .primaryTagPolylinePointStyle`,
                   style: `fill: ${this.tags.primary.colorHighlight}; 
                           stroke: #fff;`
               },
               {
                   rule: `.regionStyle.selected.${this.styleId} .primaryTagPolylinePointStyle`,
                   style: `fill: ${this.tags.primary.colorPure};
                               stroke:${this.tags.primary.colorHighlight};`
               }
           ];

           let styleMapLight = [
               {
                   rule: `.${this.styleId} .primaryTagBoundRectStyle`,
                   style: `fill: none;
                           stroke: ${this.tags.primary.colorDark};`
               },
               {
                   rule: `.regionStyle.selected.${this.styleId} .primaryTagBoundRectStyle`,
                   style: `stroke: ${this.tags.primary.colorShadow};`
               },
               {
                   rule: `.${this.styleId}:hover .primaryTagBoundRectStyle`,
                   style: `fill: none;
                           stroke: ${this.tags.primary.colorAccent};`
               },
               {
                   rule: `.${this.styleId} .primaryTagPolylineStyle`,
                   style: `stroke: ${this.tags.primary.colorPure};
                           stroke-width: 1px;`
               },
               {
                   rule: `.${this.styleId} .primaryTagPolylinePointStyle`,
                   style: `fill: ${this.tags.primary.colorPure};
                           stroke:${this.tags.primary.colorAccent};`
               },
               {
                   rule: `.regionStyle.${this.styleId}:hover  .primaryTagPolylinePointStyle`,
                   style: `fill: ${this.tags.primary.colorHighlight}; 
                               stroke: #fff;`
               },
               {
                   rule: `.regionStyle.selected.${this.styleId} .primaryTagPolylinePointStyle`,
                   style: `fill: ${this.tags.primary.colorPure};
                               stroke:${this.tags.primary.colorAccent};`
               },
               {
                   rule: `.regionStyle.${this.styleId} .secondaryTagStyle`,
                   style: `opacity:0.25;`
               }
           ];

           window.requestAnimationFrame(() => {
               let sm = (showRegionBackground ? styleMap : styleMapLight);
               for (let i = 0; i < sm.length; i++) {
                   let r = sm[i];
                   this.styleSheet.insertRule(`${r.rule}{${r.style}}`, 0);
               }

               if (this.tags && this.tags.secondary.length > 0) {
                   for (let i = 0; i < this.tags.secondary.length; i++) {
                       let tag = this.tags.secondary[i];
                       let rule = `.secondaryTagStyle.secondaryTag-${tag.name}{
                               fill: ${tag.colorAccent};
                           }`;
                       this.styleSheet.insertRule(rule, 0);
                   }
               }
           });
       }
   }

   public move(point: IMovable): void;
   public move(x: number, y: number): void;
   public move(arg1: any, arg2?: any) {
       super.move(arg1, arg2);
       this.regionData.move(arg1, arg2);

       let size = 6;
       let cx = this.x + this.boundRect.width / 2;
       let cy = this.y - size - 5;

       let pointsData = [];
       this.regionData.points.forEach(p => {
           pointsData.push(p.x, p.y);
       });

       window.requestAnimationFrame(() => {
           this.primaryTagBoundRect.attr({
               x: this.x,
               y: this.y
           });

           this.primaryTagPointsArray.forEach((p, index) => {
               p.attr({
                   cx: this.regionData.points[index].x,
                   cy: this.regionData.points[index].y
               });
           });

           this.primaryTagPolyline.attr({
               points: pointsData.toString()
           });

           // Secondary Tags
           if (this.secondaryTags && this.secondaryTags.length > 0) {
               let length = this.secondaryTags.length;
               for (let i = 0; i < length; i++) {
                   let stag = this.secondaryTags[i];
                   let x = cx + (2 * i - length + 0.5) * size;

                   stag.attr({
                       x: x,
                       y: cy
                   });
               }
           }
       });
   }

   public resize(width: number, height: number) {
       super.resize(width, height);
       this.regionData.resize(width,height);
       
       let pointsData = [];
       this.regionData.points.forEach(p => {
           pointsData.push(p.x, p.y);
       });

       window.requestAnimationFrame(() => {
           this.primaryTagBoundRect.attr({
               width: width,
               height: height
           });

           this.primaryTagPointsArray.forEach((p, index) => {
               p.attr({
                   cx: this.regionData.points[index].x,
                   cy: this.regionData.points[index].y
               });
           });

           this.primaryTagPolyline.attr({
               points: pointsData.toString()
           });
       });
   }
}