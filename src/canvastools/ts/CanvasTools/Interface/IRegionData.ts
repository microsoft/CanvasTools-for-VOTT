import { RegionDataType } from "../Core/RegionData";

export interface IRegionData {
    x: number;
    y: number;
    width: number;
    height: number;
    points: {x: number, y: number}[];
    type: RegionDataType;
}