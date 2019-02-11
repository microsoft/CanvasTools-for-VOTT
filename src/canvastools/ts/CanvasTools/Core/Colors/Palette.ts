import { LABColor } from "./LABColor";
import { RGBColor } from "./RGBColor";
import { color } from "snapsvg";

interface IColorPoint {
    a: number;
    b: number;
}

interface IColorGamutPoint {
    rgb: RGBColor;
    lab: LABColor;
}

export class Palette {
    private gamutCluster: IColorGamutPoint[];

    private generateClusterPromise: Promise<IColorGamutPoint[]>;

    public constructor(ligthness: number, minGrayness: number = 0, maxGrayness: number = 1) {
        this.generateClusterPromise = this.generateGamutClusterAsync(ligthness, minGrayness, maxGrayness);
    }

    public ready(): Promise<IColorGamutPoint[]> {
        if (this.gamutCluster !== undefined && this.gamutCluster !== null) {
            return new Promise((resolve) => resolve(this.gamutCluster));
        } else {
            return this.generateClusterPromise.then((cluster) => {
                this.gamutCluster = cluster;
                return cluster;
            });
        }
    }

    public swatches(colorsCount: number): Promise<IColorGamutPoint[]> {
        return this.ready().then((cluster) => {
            const swatches = new Array<IColorGamutPoint>();
            const first = Math.round(Math.random() * cluster.length);
            swatches.push(cluster[first]);

            for (let i = 0; i < colorsCount - 1; i++) {
                swatches.push(this.findNextColor(swatches, cluster));
            }

            return swatches;
        });
    }

    public more(swatches: IColorGamutPoint[], colorsCount: number): Promise<IColorGamutPoint[]> {
        if (swatches.length > 0) {
            return this.ready().then((cluster) => {
                const newSwatches = new Array<IColorGamutPoint>();
                const allSwatches = swatches.map((sw) => sw);
                for (let i = 0; i < colorsCount; i++) {
                    const swatch = this.findNextColor(allSwatches, cluster);
                    allSwatches.push(swatch);
                    newSwatches.push(swatch);
                }
                return newSwatches;
            });
        } else {
            return this.swatches(colorsCount);
        }
    }

    private findNextColor(swatches: IColorGamutPoint[], cluster: IColorGamutPoint[]): IColorGamutPoint {
        let candidate: IColorGamutPoint = cluster[0];
        let maxDistanceSQ: number = 0;

        cluster.forEach((colorPoint) => {
            const distances = swatches.map((swatchPoint) => {
                return colorPoint.lab.distanceTo(swatchPoint.lab);
            });
            const minDistanceSQ = Math.min(...distances);
            if (minDistanceSQ > maxDistanceSQ) {
                candidate = colorPoint;
                maxDistanceSQ = minDistanceSQ;
            }
        });

        return candidate;
    }

    private generateGamutClusterAsync(ligthness: number, minGrayness: number = 0, maxGrayness: number = 1):
                  Promise<IColorGamutPoint[]> {
        const promise = new Promise<IColorGamutPoint[]>((resolve) => {
            this.gamutCluster = this.generateGamutCluster(ligthness, minGrayness, maxGrayness);
            resolve(this.gamutCluster);
        });
        return promise;
    }

    private generateGamutCluster(ligthness: number, minGrayness: number = 0 , maxGrayness: number = 1):
                  IColorGamutPoint[] {
        let cluster = this.generatePointsCluster(25);
        cluster = cluster.filter((p) => {
            const d = this.distanceToGray(p);
            return d >= minGrayness && d <= maxGrayness;
        });

        const colorSpace = new Array<IColorGamutPoint>();

        cluster.forEach((p) => {
            const labcolor = new LABColor(ligthness, p.a, p.b);
            const rgbcolor = labcolor.toRGB();
            if (rgbcolor.isValidRGB()) {
                colorSpace.push({
                    rgb: rgbcolor,
                    lab: labcolor,
                });
            }
        });

        return colorSpace;
    }

    private distanceToGray(p: IColorPoint) {
        return Math.sqrt(p.a * p.a + p.b * p.b);
    }

    private generatePointsCluster(steps: number = 100): IColorPoint[] {
        steps = Math.round(steps);
        const cluster = new Array<IColorPoint>(steps * steps);

        for (let i = 0; i < steps; i++) {
            for (let j = 0; j < steps; j++) {
                cluster[i * steps + j] = {
                    a: 2.0 * i / (steps - 1) - 1.0,
                    b: 2.0 * j / (steps - 1) - 1.0,
                };
            }
        }

        return cluster;
    }
}
