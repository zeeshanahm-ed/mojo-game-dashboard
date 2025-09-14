import { EDITOR_ONLY_ROLES, READ_ONLY_ROLES } from "constants/global";
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
export const hasPermission = (userRole: string | undefined, permission: 'read_only' | 'editor'): boolean => {
    if (permission === 'read_only') {
        return READ_ONLY_ROLES.includes(userRole as ROLES);
    }

    if (permission === 'editor') {
        return EDITOR_ONLY_ROLES.includes(userRole as ROLES);
    }

    return false;
};

