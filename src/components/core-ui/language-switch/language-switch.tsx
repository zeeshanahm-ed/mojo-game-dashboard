import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
import LanguageIcon from '../../../assets/icons/translate-icon.svg?react';

export interface ILanguageSwitchProps {
    className?: string;
    showFlags?: boolean;
    showLabels?: boolean;
    variant?: 'dropdown' | 'toggle' | 'buttons';
}


const languages = [
    { code: 'en', label: 'ENG', },
    { code: 'ar', label: 'ARABIC', }
];


const LanguageSwitch = ({ }: ILanguageSwitchProps) => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState<string>('en');

    // Get default value from localStorage or default to 'en'
    useEffect(() => {
        const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
        const validLanguage = languages.find(lang => lang.code === savedLanguage) ? savedLanguage : 'en';
        setCurrentLanguage(validLanguage);

        // Set initial font based on language
        document.body.className = validLanguage === 'ar' ? 'font-arabic' : 'font-primary';

        // Set initial language if not already set
        if (i18n.language !== validLanguage) {
            i18n.changeLanguage(validLanguage);
        }
    }, [i18n]);

    useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            const language = languages.find(lang => lang.code === lng);
            if (language) {
                setCurrentLanguage(lng);
                // Set body font based on language
                document.body.className = lng === 'ar' ? 'font-arabic' : 'font-primary';
            }
        };

        // Listen for language changes
        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    const handleLanguageChange = (value: string) => {
        i18n.changeLanguage(value);
    };

    const getSelectOptions = () => {
        return languages.map(language => ({
            label: language.label,
            value: language.code
        }));
    };

    return (
        <div className='flex items-center gap-2'>
            <Select
                prefix={<LanguageIcon className='w-5 h-5 mr-3' />}
                value={currentLanguage}
                onChange={handleLanguageChange}
                className='min-w-[150px] h-10'
                size="small"
                variant="outlined"
                options={getSelectOptions()}
            />
        </div>
    )
};

export default LanguageSwitch;
