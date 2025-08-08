import React from 'react'

interface HeaderSectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
    title,
    subtitle,
    children
}) => {
    return (
        <div className="mb-6">
            <div className=" bg-medium-gray h-15 px-4 py-3 rounded-t-lg flex justify-between items-center">
                <h3 className="text-white text-xl">{title}</h3>
                {subtitle && (
                    <span className="text-white text-base opacity-90">{subtitle}</span>
                )}
            </div>
            <div className="bg-white p-6">
                {children}
            </div>
        </div>
    );
};


export default HeaderSection;