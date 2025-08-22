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
