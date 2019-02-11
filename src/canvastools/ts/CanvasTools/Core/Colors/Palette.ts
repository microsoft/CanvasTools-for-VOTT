import { LABColor } from "./LABColor";
import { RGBColor } from "./RGBColor";
import { color } from "snapsvg";

interface IColorPoint {
    a: number;
    b: number;
}

export interface IColorGamutPoint {
    rgb: RGBColor;
    lab: LABColor;
}

export interface IPaletteSettings {
    lightness: number;
    lightnessVariation: number;
    minGrayness: number;
    maxGrayness: number;
    granularity: number;
    abRange: number;
}

export class Palette {
    private gamutCluster: IColorGamutPoint[];

    private generateClusterPromise: Promise<IColorGamutPoint[]>;

    private settings: IPaletteSettings;

    public constructor(settings: IPaletteSettings) {
        this.settings = {
            lightness: (settings.lightness === undefined) ?
                        0.65 : Math.max(0, Math.min(1, settings.lightness)),
            lightnessVariation: (settings.lightnessVariation === undefined) ?
                        0 : Math.max(0, Math.min(1, settings.lightnessVariation)),
            minGrayness: (settings.minGrayness === undefined) ?
                        0 : Math.max(0, Math.min(1, settings.minGrayness)),
            maxGrayness: (settings.maxGrayness === undefined) ?
                        2 : Math.max(0, Math.min(2, settings.maxGrayness)),
            granularity: (settings.granularity === undefined) ?
                        50 : Math.max(10, settings.granularity),
            abRange: (settings.abRange === undefined) ?
                        1.3 : Math.max(0, Math.min(2, settings.abRange)),
        };

        this.generateClusterPromise = this.generateGamutClusterAsync();
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

    private generateGamutClusterAsync(): Promise<IColorGamutPoint[]> {
        const promise = new Promise<IColorGamutPoint[]>((resolve) => {
            this.gamutCluster = this.generateGamutCluster();
            resolve(this.gamutCluster);
        });
        return promise;
    }

    private generateGamutCluster(): IColorGamutPoint[] {
        let cluster = this.generatePointsCluster(this.settings.granularity);
        cluster = cluster.filter((p) => {
            const d = this.distanceToGray(p);
            return d >= this.settings.minGrayness && d <= this.settings.maxGrayness;
        });

        const colorSpace = new Array<IColorGamutPoint>();

        cluster.forEach((p) => {
            let lightness = this.settings.lightness;
            if (this.settings.lightnessVariation > 0) {
                lightness += this.settings.lightnessVariation * (Math.random() - 0.5);
                lightness = Math.max(0, Math.min(1, lightness));
            }

            const labcolor = new LABColor(lightness, p.a, p.b);
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

    private generatePointsCluster(steps): IColorPoint[] {
        steps = Math.round(steps);
        const cluster = new Array<IColorPoint>(steps * steps);

        const range = this.settings.abRange;

        for (let i = 0; i < steps; i++) {
            for (let j = 0; j < steps; j++) {
                cluster[i * steps + j] = {
                    a: range * 2 * i / (steps - 1) - range,
                    b: range * 2 * j / (steps - 1) - range,
                };
            }
        }

        return cluster;
    }
}
