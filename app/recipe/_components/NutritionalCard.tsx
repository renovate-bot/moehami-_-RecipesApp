import React from 'react';
import { LucideIcon } from 'lucide-react';

type NutritionalCardProps = {
    icon: LucideIcon;
    title: string;
    value: string;
    bgColor: string; 
    iconColor: string;
};

const NutritionalCard = ({ icon: Icon, title, value, bgColor, iconColor }: NutritionalCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm flex flex-col items-center">
            <div className={`${bgColor} p-2 rounded-full`}>
                <Icon strokeWidth={1} className={`${iconColor} w-8 h-8`} />
            </div>
            <h3 className="text-md text-gray-800 dark:text-gray-200 mt-3">{title}</h3>
            <p className="text-sm text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    );
};

export default NutritionalCard;
