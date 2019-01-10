import { RegionDataType } from "../Core/RegionData";
import { IPoint2D } from "./IPoint2D";

export interface IRegionData {
    x: number;
    y: number;
    width: number;
    height: number;
    points: IPoint2D[];
    type: RegionDataType;
}
