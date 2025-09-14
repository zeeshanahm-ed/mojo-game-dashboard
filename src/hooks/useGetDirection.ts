'use client';

import { useState, useEffect } from 'react';
import i18n from 'i18next';

type Direction = 'ltr' | 'rtl';

const resolveDirection = (lang: string | null): Direction =>
    lang === 'ar' || lang?.startsWith('ar') ? 'rtl' : 'ltr';

export function useDirection(): Direction {
    const [direction, setDirection] = useState<Direction>(
        resolveDirection(i18n.language)
    );

    useEffect(() => {
        const handleLanguageChange = (lang: string) => {
            setDirection(resolveDirection(lang));
        };

        i18n.on('languageChanged', handleLanguageChange);

        // Cleanup on unmount
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    return direction;
}
