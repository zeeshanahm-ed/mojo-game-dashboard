// utils/device.ts
import FingerprintJS from "@fingerprintjs/fingerprintjs";
export async function getDeviceId(): Promise<string> {
    try {
        // Initialize the FingerprintJS agent
        const fp = await FingerprintJS.load();

        // Get the visitor identifier
        const result = await fp.get();

        // This ID will stay the same across sessions for the same device+browser
        return result.visitorId;
    } catch (error) {
        console.error("Error generating device ID:", error);
        // Fallback in case FingerprintJS fails
        return `fallback-${Math.random().toString(36).substring(2, 15)}`;
    }
}
