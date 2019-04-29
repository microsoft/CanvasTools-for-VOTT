import { Rect } from "./Rect";

describe("Core.Rect Tests", () => {
    it("the Rect object can be created", () => {
        const w = 10;
        const h = 15;

        const r = new Rect(w, h);
        expect(r.width).toBe(w);
        expect(r.height).toBe(h);
    });

    it("the Rect object can be resized (resize)", () => {
        const w = 10;
        const h = 15;
        const r = new Rect(w, h);

        const nw = 100;
        const nh = 150;
        r.resize(nw, nh);
        expect(r.width).toBe(nw);
        expect(r.height).toBe(nh);

        // ignore negative values
        r.resize(-nw, h);
        expect(r.width).toBe(nw);
        expect(r.height).toBe(h);

        r.resize(w, -nh);
        expect(r.width).toBe(w);
        expect(r.height).toBe(h);
    });

    it("the Rect object can be copied (copy)", () => {
        const w = 10;
        const h = 15;
        const r = new Rect(w, h);

        const r2 = r.copy();
        expect(r2.width).toBe(w);
        expect(r2.height).toBe(h);

        const nw = 100;
        const nh = 150;
        r.resize(nw, nh);

        // hard copy should not be affect by changes in the original
        expect(r2.width).toBe(w);
        expect(r2.height).toBe(h);
    });

    it("the Rect can be converted to JSON (toJSON) and restore from JSON (BuildFromJSON)", () => {
        const w = 10;
        const h = 15;
        const r = new Rect(w, h);

        const json = r.toJSON();
        const str = JSON.stringify(json);
        const restored = JSON.parse(str);

        const nr = Rect.BuildFromJSON(restored);
        expect(nr.width).toBe(w);
        expect(nr.height).toBe(h);
    });

    it("the Rect can be converted to expected string format (toString)", () => {
        const w = 10;
        const h = 15;
        const r = new Rect(w, h);

        const str = r.toString();
        // [w, h], w and h - numbers
        expect(str).toMatch(/\[([+-]?\d+(\.\d+)?),\s*([+-]?\d+(\.\d+)?)\]/g);
        expect(str).toBe(`[${w}, ${h}]`);
    });

});
