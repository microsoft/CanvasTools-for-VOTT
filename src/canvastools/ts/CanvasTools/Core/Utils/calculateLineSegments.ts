import { ILineSegment } from "../../Interface/ILineSegment";
import { IPoint2D } from "../../Interface/IPoint2D";
import { RegionDataType } from "../../Interface/RegionDataType";

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

function createLineSegment(start: IPoint2D, end: IPoint2D): ILineSegment {
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

export function calculateLineSegments(points: IPoint2D[], options?: { regionType: RegionDataType }) {
    if (points.length < 2) {
        return []
    }
    if (points.length === 2) {
        return [createLineSegment(points[0], points[1])]
    }
    const segments: ILineSegment[] = [];
    const pointsLength = points.length;
    const loopLength = pointsLength - 1;
    for (let i = 0; i < loopLength; i++) {
        const nextPointIdx = i + 1;
        if (nextPointIdx < pointsLength) {
            segments.push(createLineSegment(points[i], points[nextPointIdx]));
        }
    }
    if ([RegionDataType.Polygon, RegionDataType.Path].includes(options?.regionType)) {
        // closing line segment from last to first point
        segments.push(createLineSegment(points[pointsLength - 1], points[0]));
    }
    return segments;
}
