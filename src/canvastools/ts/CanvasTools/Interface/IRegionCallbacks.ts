import { RegionData } from "../Core/RegionData";
import { RegionComponent } from "../Region/RegionComponent";

export type ManipulationFunction = (UIElement?: RegionComponent) => void;

export enum ChangeEventType { MOVEEND, MOVING, MOVEBEGIN, SELECTIONTOGGLE }

export type ChangeFunction = (region: RegionComponent, regionData: RegionData,
                              eventType?: ChangeEventType, multiSelection?: boolean) => void;

export interface IRegionCallbacks {
    onManipulationBegin: ManipulationFunction;
    onManipulationEnd: ManipulationFunction;
    onChange: ChangeFunction;
}
