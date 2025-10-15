import { READ_ONLY_ROLES } from "constants/global";
import i18n from "../i18n";
import { ROLES } from "utils/Enums";
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};


// Get current language code
export const getCurrentLanguage = (): string => {
    return i18n.language || i18n.options.fallbackLng?.toString() || "en";
};

export const splitFileName = (file: string) => {
    const fileNameWithExtension = decodeURIComponent(file ? file?.split('/')[3] || '' : '');
    return fileNameWithExtension;
};


export const getFileExtension = (file: string) => {
    return file ? file?.split('/')[3]?.split('.')?.pop() || '' : '';
};

export const formatFileSize = (bytes: number | undefined): number => {
    if (!bytes) return 0;
    const mb = bytes / (1024 * 1024);
    return parseFloat(mb.toFixed(2));
};

// Permission helper function
export const hasPermission = (userRole: string | undefined, permission: string): boolean => {
    if (permission === 'read_only') {
        return READ_ONLY_ROLES.includes(userRole as ROLES);
    }
    if (permission === 'finance_manager') {
        return ROLES.FINANCE_MANAGER === userRole;
    }

    return false;
};

export const getFileName = (url: string) => {
    if (!url) return "";
    try {
        const parts = url.split('/');
        return parts[parts.length - 1] || "";
    } catch {
        return "";
    }
};

export const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url) return null;

    const regex =
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);

    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export const isYoutubeUrlCorrect = (url: string | undefined) => {
    if (!url) return false;

    const regex =
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);

    return match ? true : false;
};

// Supported media types for all browsers
type SupportedImageTypes = 'jpg' | 'jpeg' | 'png';
type SupportedAudioTypes = 'mp3' | 'wav' | 'ogg' | 'aac' | 'm4a';
type SupportedVideoTypes = 'mp4' | 'webm' | 'ogg' | 'wav';

type MediaType = 'image' | 'audio' | 'video' | 'youtube';

// Helper function to extract file extension and determine media type
export const getMediaType = (mediaUrl: string): MediaType => {
    if (!mediaUrl) return 'image';
    if (isYoutubeUrlCorrect(mediaUrl)) {
        return 'youtube';
    }
    const extensionMatch = mediaUrl.split('.').pop()?.toLowerCase().split(/\#|\?/)[0];
    if (!extensionMatch) return 'image';

    const imageTypes: SupportedImageTypes[] = ['jpg', 'jpeg', 'png'];
    const audioTypes: SupportedAudioTypes[] = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
    const videoTypes: SupportedVideoTypes[] = ['mp4', 'webm', 'ogg'];

    if (imageTypes.includes(extensionMatch as SupportedImageTypes)) {
        return 'image';
    }
    if (audioTypes.includes(extensionMatch as SupportedAudioTypes)) {
        return 'audio';
    }
    if (videoTypes.includes(extensionMatch as SupportedVideoTypes)) {
        return 'video';
    }
    return 'image';
};

