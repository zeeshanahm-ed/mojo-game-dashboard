import { getDeviceId } from "./device";

export async function getAuthHeaders() {
    const fingerprint = await getDeviceId();

    return {
        "Content-Type": "application/json",
        "x-device-fingerprint": fingerprint || "unknown",
    };
}