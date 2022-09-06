import Konva from "konva";
import { Color } from "../../Core/Colors/Color";
import { RegionData } from "../../Core/RegionData";
import { Tag } from "../../Core/Tag";
import { TagsDescriptor } from "../../Core/TagsDescriptor";
import { DisabledMaskHostZIndex, EnabledMaskHostZIndex, KonvaContainerId } from "../../Core/Utils/constants";
import { ZoomDirection, ZoomManager } from "../../Core/ZoomManager";
import { IMaskManagerCallbacks } from "../../Interface/IMask";
import { SelectionMode } from "../../Interface/ISelectorSettings";
import { MasksManager } from "./MaskManager";

describe("Mask manager tests", () => {
    let maskManager: MasksManager;
    let editorDiv;
    beforeAll(() => {
        editorDiv = document.createElement("div");
        editorDiv.style["width"] = "100px";
        editorDiv.style["height"] = "100px";
        const hostDiv = document.createElement("div");
        hostDiv.setAttribute("id", KonvaContainerId);
        editorDiv.appendChild(hostDiv);
        document.body.append(editorDiv);

        const tag = new Tag("Awesome", new Color("#c48de7"));
        const callbacks: IMaskManagerCallbacks = {
            onMaskDrawingBegin: () => {
                return new TagsDescriptor([tag]);
            },
            onMaskDrawingEnd: () => {},
            getAllRegions: (): Array<{
                id: string;
                tags: TagsDescriptor;
                regionData: RegionData;
            }> => {
                return [];
            },
        };
        maskManager = new MasksManager(editorDiv, hostDiv, callbacks);
    });
    it("check if the mask manager is initialized with default values", () => {
        expect(maskManager.brushSize).toEqual({
            brush: 30,
            erase: 30,
        });
        expect(maskManager.konvaContainerHostElement.style["z-index"]).toEqual(DisabledMaskHostZIndex.toString());
    });
    it("set selection mode", () => {
        maskManager.setSelection(true, SelectionMode.BRUSH);
        expect(maskManager.konvaContainerHostElement.style["z-index"]).toEqual(EnabledMaskHostZIndex.toString());

        maskManager.setSelection(true, SelectionMode.ERASER);
        expect(maskManager.konvaContainerHostElement.style["z-index"]).toEqual(EnabledMaskHostZIndex.toString());

        maskManager.setSelection(false);
        expect(maskManager.konvaContainerHostElement.style["z-index"]).toEqual(DisabledMaskHostZIndex.toString());
    });

    it("set brushSize", () => {
        maskManager.setBrushSize({
            brush: 20,
            erase: 20,
        });
        expect(maskManager.brushSize).toEqual({
            brush: 20,
            erase: 20,
        });
    });

    it("erase all masks", () => {
        const canvasLayer = maskManager.konvaStage.getChildren()[0];
        let shapesDrawn = canvasLayer.getChildren();
        canvasLayer.add(new Konva.Shape());
        expect(shapesDrawn.length).toBe(1);
        maskManager.eraseAllMasks();
        shapesDrawn = canvasLayer.getChildren();
        expect(shapesDrawn.length).toBe(0);
    });

    it("zoom/resize/scale", () => {
        ZoomManager.getInstance().updateZoomScale(ZoomDirection.In, 2);
        expect(maskManager.konvaStage.width()).toBe(100);
        expect(maskManager.konvaStage.height()).toBe(100);
        maskManager.resize(200, 200, true);
        expect(maskManager.konvaStage.width()).toBe(200);
        expect(maskManager.konvaStage.height()).toBe(200);
        expect(maskManager.konvaStage.scale()).toEqual({
            x: 2,
            y: 2,
        });
    });
});
