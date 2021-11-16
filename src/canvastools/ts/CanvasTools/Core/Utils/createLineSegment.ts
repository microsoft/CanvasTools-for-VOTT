import { ILineSegment } from "../../Interface/ILineSegment";
import { IPoint2D } from "../../Interface/IPoint2D";

function getPointsAlongLines(start: IPoint2D, xLength: number, yLength): { oneThird: IPoint2D, half: IPoint2D, twoThird: IPoint2D } {
    return {
        oneThird: {
            x: start.x + (xLength / 3),
            y: start.y + (yLength / 3)
        },
        half: {
            x: start.x + (xLength / 2),
            y: start.y + (yLength / 2)
        },
        twoThird: {
            x: start.x + ((2*xLength) / 3),
            y: start.y + ((2*yLength) / 3)
        },
    }
}

export function createLineSegment(start: IPoint2D, end: IPoint2D): ILineSegment {
    const xLength = end.x - start.x;
    const yLength = end.y - start.y;
    return {
        start,
        end,
        xLength,
        yLength,
        pointsAlongLine: getPointsAlongLines(start, xLength, yLength)
    };
}
