import { IPoint2D } from "./IPoint2D";

export interface ILineSegment {
    start: IPoint2D,
    end: IPoint2D,
    xLength: number,
    yLength: number,
    pointsAlongLine: { oneThird: IPoint2D, half: IPoint2D, twoThird: IPoint2D }
}
