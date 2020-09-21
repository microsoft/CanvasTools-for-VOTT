import { ZoomDirection, ZoomManager} from "./ZoomManager";

describe("Zoom manager tests", () => {
    const maxZoom = 5;
    const zoomScale = 2;
    const getZoomManager = () => {
        const zoomManagerInstance = ZoomManager.getInstance(true, undefined, maxZoom, zoomScale);
        return zoomManagerInstance;
    };

    it("check if the zoom manager instance is initialized with default values", () => {
        const zoomManagerInstance = ZoomManager.getInstance();
        expect(zoomManagerInstance).toBeDefined();
        expect(zoomManagerInstance.isZoomEnabled).toBeFalsy();
        const zoomData = zoomManagerInstance.getZoomData();
        expect(zoomData.minZoomScale).toEqual(1);
        expect(zoomData.maxZoomScale).toEqual(4);
        expect(zoomData.currentZoomScale).toEqual(1);
        expect(zoomData.previousZoomScale).toEqual(1);
        zoomManagerInstance.deleteInstance();
    });

    it("check if the zoom manager instance is initialized with provided values", () => {
        const zoomManagerInstance = getZoomManager();
        expect(zoomManagerInstance).toBeDefined();
        expect(zoomManagerInstance.isZoomEnabled).toBeTruthy();
        const zoomData = zoomManagerInstance.getZoomData();
        expect(zoomData.minZoomScale).toEqual(1);
        expect(zoomData.maxZoomScale).toEqual(maxZoom);
        zoomManagerInstance.deleteInstance();
    });

    it("check if the zoom in and zoom out works properly", () => {
        const zoomManagerInstance = getZoomManager();
        expect(zoomManagerInstance).toBeDefined();
        expect(zoomManagerInstance.isZoomEnabled).toBeTruthy();
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1);

        zoomManagerInstance.updateZoomScale(ZoomDirection.Out);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1);

        zoomManagerInstance.updateZoomScale(ZoomDirection.In);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1 + zoomScale);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1);

        zoomManagerInstance.updateZoomScale(ZoomDirection.In);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1 + zoomScale + zoomScale);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1 + zoomScale);

        zoomManagerInstance.updateZoomScale(ZoomDirection.In);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1 + zoomScale + zoomScale);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1 + zoomScale + zoomScale);

        zoomManagerInstance.updateZoomScale(ZoomDirection.Out);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1 + zoomScale + zoomScale - zoomScale);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1 + zoomScale + zoomScale);
        zoomManagerInstance.deleteInstance();
    });

    it("check if the setting zoom scale works as expected", () => {
        const zoomManagerInstance = getZoomManager();
        const zoomData = zoomManagerInstance.getZoomData();
        expect(zoomData.maxZoomScale).toEqual(maxZoom);
        zoomManagerInstance.setMaxZoomScale(20);
        expect(zoomManagerInstance.getZoomData().maxZoomScale).toEqual(20);

        const newZoomScale = 5;
        zoomManagerInstance.setZoomScale(newZoomScale);
        zoomManagerInstance.updateZoomScale(ZoomDirection.In);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1 + newZoomScale);
        zoomManagerInstance.deleteInstance();
    });

    it("check if the resetting on content load as expected", () => {
        const zoomManagerInstance = getZoomManager();
        expect(zoomManagerInstance.resetZoomOnContentLoad).toBeFalsy();

        zoomManagerInstance.updateZoomScale(ZoomDirection.In);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1 + zoomScale);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1);

        zoomManagerInstance.resetZoomOnContentLoad = true;
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1);
    });
});
