import { DEFAULT_DEVICE } from "../constants";

export class DeviceSelectionService {
    private currentActiveDevice: string = DEFAULT_DEVICE;

    public getCurrentActiveDevice(): string {
        return this.currentActiveDevice;
    }
    public setCurrentActiveDevice(newActiveDevice: string) {
        this.currentActiveDevice = newActiveDevice;
    }
}
