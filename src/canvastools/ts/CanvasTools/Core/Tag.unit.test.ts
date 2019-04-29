import { Tag } from "./Tag";
import { Color } from "./Colors/Color";
import { SRGBColor } from "./Colors/SRGBColor";

describe("Core.Tag Tests", () => {

    it("the Tag object can be created", () => {
        const name = "Some Tag";
        
        const colorCSS = "#ff0045";
        const srgbColor = SRGBColor.ParseHex(colorCSS);
        const color = new Color(srgbColor);
        const colorHue = srgbColor.toHSL().h;
        const colorHue360 = colorHue * 360;

        const id = "tag0";

        // Create tag with Color object
        const t1 = new Tag(name, color, id);
        expect(t1.name).toBe(name);
        expect(t1.id).toBe(id);
        expect(t1.color).toBe(colorCSS);

        // Create tag with Color object without id
        const t2 = new Tag(name, color);
        expect(t2.id).toBe("");

        // Create tag with CSS string color
        const t3 = new Tag(name, colorCSS);
        expect(t3.color).toBe(colorCSS);

        // Create tag with hue value (deprecated)
        const t4 = new Tag(name, colorHue360);
        expect(t3.color).toBe(colorCSS);
        expect(t3.colorHue).toBe(colorHue360);

        // Test getHueFromColor still works (deprecated)
        expect(Tag.getHueFromColor(colorCSS)).toBe(colorHue360);
    });

    it("the Tag object can be copied (copy)", () => {
        const name = "Some Tag";
        
        const colorCSS = "#ff0045";
        const color = new Color(colorCSS);
        const id = "tag0";

        const t1 = new Tag(name, color, id);

        const t2 = t1.copy();
        expect(t2.name).toBe(name);
        expect(t2.id).toBe(id);
        expect(t2.color).toBe(colorCSS);
    });

    it("the Tag object can be converted to JSON (toJSON) and restored back (BuildFromJSON)", () => {
        const name = "Some Tag";
        
        const colorCSS = "#ff0045";
        const color = new Color(colorCSS);
        const id = "tag0";

        const t1 = new Tag(name, color, id);

        const json = t1.toJSON();

        const t2 = Tag.BuildFromJSON(json);
        expect(t2.name).toBe(name);
        expect(t2.id).toBe(id);
        expect(t2.color).toBe(colorCSS);

        // Test with no id
        const jsonNoId = {
            name: json.name,
            id: undefined,
            color: json.color,
        };

        const t2NoId = Tag.BuildFromJSON(jsonNoId);
        expect(t2NoId.id).toBe("");

        // Test deprecated color restoration with "colorHue" value instead of "color"
        console.log(json.id);
        const jsonHue = {
            name: json.name,
            id: json.id,
            colorHue: color.HSL.h * 360,
            color: undefined,
        };
        const t3 = Tag.BuildFromJSON(jsonHue);
        expect(t3.name).toBe(name);
        expect(t3.id).toBe(id);
        expect(t3.color).toBe(colorCSS);

        // Test with no id
        const jsonHueNoID = {
            name: json.name,
            id: undefined,
            colorHue: color.HSL.h * 360,
            color: undefined,
        };
        const t3NoId = Tag.BuildFromJSON(jsonHueNoID);
        expect(t3NoId.id).toBe("");
    })

    it("the Tag object generates color variations", () => {
        const name = "Some Tag";
        
        const colorCSS = "#ff0045";
        const color = new Color(colorCSS);
        const id = "tag0";

        const t1 = new Tag(name, color, id);

        // Original color
        expect(t1.colorPure).toBe(color.sRGB.toCSSString());
        // No color (transparent)
        expect(t1.colorNoColor).toBe("rgba(0, 0, 0, 0.0)");

        // Accent should be the same color + alpha (0.8);
        const accentColor = SRGBColor.ParseCSSString(t1.colorAccent);
        const accentColorAlpha = SRGBColor.ParseCSSStringAlpha(t1.colorAccent);
        expect(accentColor.toHex()).toBe(colorCSS);
        expect(accentColorAlpha).toBe(0.8);

        expect(t1.colorDark.match(/rgba?\((.*)\)/)).toBeDefined();
        expect(t1.colorHighlight.match(/rgba?\((.*)\)/)).toBeDefined();
        expect(t1.colorShadow.match(/rgba?\((.*)\)/)).toBeDefined();
    });
});