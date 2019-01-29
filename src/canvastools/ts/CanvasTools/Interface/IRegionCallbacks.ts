import { RegionData } from "../Core/RegionData";
import { RegionComponent } from "../Region/Component/RegionComponent";

export type ManipulationFunction = (UIElement?: RegionComponent) => void;

export enum ChangeEventType { MOVEEND, MOVING, MOVEBEGIN, SELECTIONTOGGLE }

export type ChangeFunction = (region: RegionComponent, regionData: RegionData,
                              eventType?: ChangeEventType, multiSelection?: boolean) => void;

export type RegionUpdateFunction = (id: string, regionData?: RegionData) => void;
export type RegionSelectionFunction = (id: string, multiselection?: boolean) => void;

export interface IRegionCallbacks {
    onManipulationBegin: ManipulationFunction;
    onManipulationEnd: ManipulationFunction;
    onChange: ChangeFunction;

    onRegionSelected?: RegionSelectionFunction;
    onRegionMove?: RegionUpdateFunction;
    onRegionMoveBegin?: RegionUpdateFunction;
    onRegionMoveEnd?: RegionUpdateFunction;
    onRegionDelete?: RegionUpdateFunction;
}
