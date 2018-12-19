import { RegionData } from "../Core/RegionData";

export interface ISelectorCallbacks {
    onSelectionBegin: () => void;
    onSelectionEnd: (regionData: RegionData) => void;
    onLocked?: () => void;
    onUnlocked?: () => void;
}
