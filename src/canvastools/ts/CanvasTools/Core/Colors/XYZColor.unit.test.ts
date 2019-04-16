import { XYZColor } from "./XYZColor";

describe("Core.Colors.XYZColor Tests", () => {
    it("the XYZ color can be created", () => {
        const x = 0.1;
        const y = 0.2;
        const z = 0.3;

        const c = new XYZColor(x, y, z);
        expect(c.x).toBe(x);
        expect(c.y).toBe(y);
        expect(c.z).toBe(z);
    });

    it ("the XYZ color is correcly normalized", () => {
        // check normalize values;
        const xw = -0.1;
        const yw = 1.2;
        const zw = -1.3;
        const cw = new XYZColor(xw, yw, zw);
        expect(cw.x).toBe(xw);
        expect(cw.y).toBe(yw);
        expect(cw.z).toBe(zw);
        const cn = cw.normalize();
        expect(cn.x).toBe(0);
        expect(cn.y).toBe(1);
        expect(cn.z).toBe(0);
    });

    it("the XYZ color can be exported to array", () => {
        const x = 0.1;
        const y = 0.2;
        const z = 0.3;

        const c = new XYZColor(x, y, z);

        const array = c.toArray();
        expect(array.length).toBe(3);
        expect(array).toContain(x);
        expect(array).toContain(y);
        expect(array).toContain(z);

        // check the array is a copy and does not impact original color
        array[0] = 0.2;
        array[1] = 0.4;
        array[2] = 0.6;
        expect(c.x).toBe(x);
        expect(c.y).toBe(y);
        expect(c.z).toBe(z);
    });

    it("the XYZ color can be converted to RGB space", () => {
        // XYZ(0, 0, 0) => RGB(0, 0, 0)
        const xb = 0.0;
        const yb = 0.0;
        const zb = 0.0;

        const cb = new XYZColor(xb, yb, zb);

        const rgbBlack = cb.toRGB();
        expect(rgbBlack.r).toBe(0);
        expect(rgbBlack.g).toBe(0);
        expect(rgbBlack.b).toBe(0);

        // XYZ(1, 1, 1) => RGB (1.2047843, 0.9483008, 0.9088427)
        const xw = 1.0;
        const yw = 1.0;
        const zw = 1.0;

        const cw = new XYZColor(xw, yw, zw);

        const rgbWhite = cw.toRGB();
        expect(rgbWhite.r).toBeCloseTo(1.2047843, 5);
        expect(rgbWhite.g).toBeCloseTo(0.9483008, 5);
        expect(rgbWhite.b).toBeCloseTo(0.9088427, 5);
    });

    it("the XYZ color can be converted to sRGB space", () => {
        // XYZ(0, 0, 0) => sRGB(0, 0, 0)
        const xb = 0.0;
        const yb = 0.0;
        const zb = 0.0;

        const cb = new XYZColor(xb, yb, zb);

        const srgbBlack = cb.toSRGB();
        expect(srgbBlack.r).toBe(0);
        expect(srgbBlack.g).toBe(0);
        expect(srgbBlack.b).toBe(0);

        // XYZ(1, 1, 1) => sRGB (1.085157,  0.976921  0.958808)
        const xw = 1.0;
        const yw = 1.0;
        const zw = 1.0;

        const cw = new XYZColor(xw, yw, zw);

        const srgbWhite = cw.toSRGB();
        expect(srgbWhite.r).toBeCloseTo(1.085157, 5);
        expect(srgbWhite.g).toBeCloseTo(0.976921, 5);
        expect(srgbWhite.b).toBeCloseTo(0.958808, 5);
    });

    it("the XYZ color can be converted to LAB space", () => {
        // XYZ(0, 0, 0) => LAB(0, 0, 0)
        const xb = 0.0;
        const yb = 0.0;
        const zb = 0.0;

        const cb = new XYZColor(xb, yb, zb);

        const labBlack = cb.toLAB();
        expect(labBlack.l).toBe(0);
        expect(labBlack.a).toBe(0);
        expect(labBlack.b).toBe(0);

        // XYZ(1, 1, 1) => LAB (1, 0.08539 ,  0.05594)
        const xw = 1.0;
        const yw = 1.0;
        const zw = 1.0;

        const cw = new XYZColor(xw, yw, zw);

        const labWhite = cw.toLAB();
        expect(labWhite.l).toBeCloseTo(1, 5);
        expect(labWhite.a).toBeCloseTo(0.08539, 4);
        expect(labWhite.b).toBeCloseTo(0.05594, 4);

        // XYZ D65 => LAB(1, 0, 0)
        const cd65 = XYZColor.D65;
        const labd65 = cd65.toLAB();
        expect(labd65.l).toBeCloseTo(1, 5);
        expect(labd65.a).toBeCloseTo(0.0, 4);
        expect(labd65.b).toBeCloseTo(0.0, 4);
    });
});
