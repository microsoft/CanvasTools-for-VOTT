import { Point2D } from "./Point2D";
import { Rect } from "./Rect";

describe("Point2D Tests", () => {
    it("Point2D - Creation", () => {
        const x = 10;
        const y = 15;
        const p1 = new Point2D(x, y);
        expect(p1.x).toBe(x);
        expect(p1.y).toBe(y);

        const p2 = new Point2D(p1);
        expect(p2.x).toBe(p1.x);
        expect(p2.y).toBe(p1.y);

        const p3 = new Point2D({ x, y });
        expect(p2.x).toBe(x);
        expect(p2.y).toBe(y);
    });

    it("Point2D - Point move and shift", () => {
        const x1 = 10;
        const y1 = 15;
        const p = new Point2D(x1, y1);

        const x2 = 20;
        const y2 = 20;

        p.move(x2, y2);
        expect(p.x).toBe(x2);
        expect(p.y).toBe(y2);

        p.move({x: x1, y: y1});
        expect(p.x).toBe(x1);
        expect(p.y).toBe(y1);

        const dx = 5;
        const dy = 10;
        p.shift(dx, dy);
        expect(p.x).toBe(x1 + dx);
        expect(p.y).toBe(y1 + dy);
    });

    it("Point2D - Bound rect", () => {
        const x1 = 10;
        const y1 = 15;
        const p1 = new Point2D(x1, y1);

        const w = 40;
        const h = 50;
        const rect = new Rect(w, h);

        const p1b = p1.boundToRect(rect);
        // Math.max(Math.min(w, x1), 0)
        expect(p1b.x).toBe(x1);
        // Math.max(Math.min(h, y1), 0)
        expect(p1b.y).toBe(y1);

        const x2 = 45;
        const y2 = 67;
        const p2 = new Point2D(x2, y2);

        const p2b = p2.boundToRect(rect);
        // Math.max(Math.min(w, x2), 0)
        expect(p2b.x).toBe(w);
        // Math.max(Math.min(h, y2), 0)
        expect(p2b.y).toBe(h);

        const x3 = -5;
        const y3 = -15;
        const p3 = new Point2D(x3, y3);

        const p3b = p3.boundToRect(rect);
        // Math.max(Math.min(w, x3), 0)
        expect(p3b.x).toBe(0);
        // Math.max(Math.min(h, y3), 0)
        expect(p3b.y).toBe(0);
    });

    it("Point2D - Copy", () => {
        const x = 10;
        const y = 15;

        const p = new Point2D(x, y);

        const pc = p.copy();
        expect(pc.x).toBe(x);
        expect(pc.y).toBe(y);
        const x1 = 20;
        const y1 = 20;
        pc.move(x1, y1);

        expect(p.x).toBe(x);
        expect(p.y).toBe(y);
    });

    it("Point2D - To/From JSON", () => {
        const x = 10;
        const y = 15;

        const p = new Point2D(x, y);

        const json = p.toJSON();
        const str = JSON.stringify(json);
        const restored = JSON.parse(str);

        const np = Point2D.BuildFromJSON(restored);
        expect(np.x).toBe(x);
        expect(np.y).toBe(y);
    });

    it("Point2D - Distance", () => {
        const x = 1;
        const y = 1;
        const p = new Point2D(x, y);

        // (1, 1) to (1, 1)
        expect(p.squareDistanceToPoint(p)).toBe(0);
        // (1, 1) to (2, 1)
        expect(p.squareDistanceToPoint(new Point2D(x + 1, y))).toBe(1.0);
        // (1, 1) to (1, 2)
        expect(p.squareDistanceToPoint(new Point2D(x, y + 2))).toBe(4.0);
        // (1, 1) to (3, 3)
        expect(p.squareDistanceToPoint(new Point2D(x + 2, y + 2))).toBe(8.0);
        // (1, 1) to (0, 0)
        expect(p.squareDistanceToPoint(new Point2D(0, 0))).toBe(2.0);

        // (1, 1) to L(0, 1) - (2, 1)
        expect(p.squareDistanceToLine(new Point2D(0, 1), new Point2D(2, 1))).toBe(0);
        // (1, 1) to L(1, -1) - (1, 4)
        expect(p.squareDistanceToLine(new Point2D(1, -1), new Point2D(1, 4))).toBe(0);
        // (1, 1) to L(0, 2) - (2, 0)
        expect(p.squareDistanceToLine(new Point2D(0, 2), new Point2D(2, 0))).toBe(0);

        // (1, 1) to L(-2, 0) - (4, 0)
        expect(p.squareDistanceToLine(new Point2D(-2, 0), new Point2D(4, 0))).toBe(1);
        // (1, 1) to L(2, -1) - (2, 5)
        expect(p.squareDistanceToLine(new Point2D(2, -1), new Point2D(2, 5))).toBe(1);
        // (1, 1) to L(2, 3) - (2, 5)
        expect(p.squareDistanceToLine(new Point2D(2, 3), new Point2D(2, 5))).toBe(5);
        // (1, 1) to L(3, 0) - (0, 3)
        expect(p.squareDistanceToLine(new Point2D(3, 0), new Point2D(0, 3))).toBe(0.5);

        // (1, 1) to L(5, 4) - (5, 4)
        expect(p.squareDistanceToLine(new Point2D(5, 4), new Point2D(5, 4))).toBe(25);
    });

    it("Point2D - To String", () => {
        const x = 10;
        const y = 15;

        const p = new Point2D(x, y);

        const str = p.toString();
        expect(str).toMatch(/\{([+-]?\d+(\.\d+)?),\s*([+-]?\d+(\.\d+)?)\}/g);
        expect(str).toBe(`{${x}, ${y}}`);
    });

});
