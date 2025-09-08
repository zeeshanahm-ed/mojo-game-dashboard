import i18n from "../i18n";
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

export const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return "0";
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2);
};
