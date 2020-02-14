import { ZoomManager, ZoomDirection} from "./ZoomManager";

describe("Zoom manager tests", () => {
    let maxZoom = 5;
    let zoomScale = 2;
    let getZoomManager = () => {
        let zoomManagerInstance = ZoomManager.getInstance(true, undefined, maxZoom, zoomScale);
        return zoomManagerInstance;
    };

    it("check if the zoom manager instance is initialized with default values", () => {
        let zoomManagerInstance = ZoomManager.getInstance();
        expect(zoomManagerInstance).toBeDefined();
        expect(zoomManagerInstance.isZoomEnabled).toBeFalsy();
        let zoomData = zoomManagerInstance.getZoomData();
        expect(zoomData.minZoomScale).toEqual(1);
        expect(zoomData.maxZoomScale).toEqual(4);
        expect(zoomData.currentZoomScale).toEqual(1);
        expect(zoomData.previousZoomScale).toEqual(1);
        zoomManagerInstance.deleteInstance();
    });

    it("check if the zoom manager instance is initialized with provided values", () => {
        let zoomManagerInstance = getZoomManager();
        expect(zoomManagerInstance).toBeDefined();
        expect(zoomManagerInstance.isZoomEnabled).toBeTruthy();
        let zoomData = zoomManagerInstance.getZoomData();
        expect(zoomData.minZoomScale).toEqual(1);
        expect(zoomData.maxZoomScale).toEqual(maxZoom);
        zoomManagerInstance.deleteInstance();
    });

    it("check if the zoom in and zoom out works properly", () => {
        let zoomManagerInstance = getZoomManager();
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
        let zoomManagerInstance = getZoomManager();
        let zoomData = zoomManagerInstance.getZoomData();
        expect(zoomData.maxZoomScale).toEqual(maxZoom);
        zoomManagerInstance.setMaxZoomScale(20);
        expect(zoomManagerInstance.getZoomData().maxZoomScale).toEqual(20);

        let newZoomScale = 5;
        zoomManagerInstance.setZoomScale(newZoomScale);
        zoomManagerInstance.updateZoomScale(ZoomDirection.In);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1 + newZoomScale);
        zoomManagerInstance.deleteInstance();
    });

    it("check if the resetting on content load as expected", () => {
        let zoomManagerInstance = getZoomManager();
        expect(zoomManagerInstance.resetZoomOnContentLoad).toBeFalsy();

        zoomManagerInstance.updateZoomScale(ZoomDirection.In);
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1 + zoomScale);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1);

        zoomManagerInstance.resetZoomOnContentLoad = true;
        expect(zoomManagerInstance.getZoomData().currentZoomScale).toEqual(1);
        expect(zoomManagerInstance.getZoomData().previousZoomScale).toEqual(1);
    });
});