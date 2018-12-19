import { RegionData } from "./../Core/CanvasTools.RegionData";

export interface ISelectorCallbacks {
    onSelectionBegin: () => void;
    onSelectionEnd: (regionData: RegionData) => void;
    onLocked?: () => void;
    onUnlocked?: () => void;
}
