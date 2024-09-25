import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
    onClick: () => void;
    icon: LucideIcon;
    label: string;
    customStyles?: string;
}

const Button = ({ onClick, icon: Icon, label, customStyles }: ButtonProps) => {
    return (
        <button
            aria-label='button'
            onClick={onClick}
            className={`flex text-xs w-full sm:w-auto items-center gap-2 dark:md:border-none bg-gradient-to-r ${customStyles ? customStyles : 'from-custom_orange to-[#f78b6d] hover:from-[#e85c47] hover:to-[#f76f58]'} text-white dark:text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform`}
        >
            <Icon /> {label}
        </button>
    );
};

export default Button;
