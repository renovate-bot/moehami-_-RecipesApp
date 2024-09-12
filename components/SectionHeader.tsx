import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
}

const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => {
    return (
        <div className='flex space-x-4 items-center mt-8 mb-5'>
            <Icon className="text-[#f26b5a]" />
            <h2 className='text-xl font-semibold text-[#f26b5a]'>{title}</h2>
        </div>
    );
};

export default SectionHeader;