import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    count?: number;
}

const SectionHeader = ({ icon: Icon, title, count }: SectionHeaderProps) => {
    return (
        <div className='flex space-x-4 items-center mt-8 mb-5 text-custom_orange font-semibold'>
            <Icon className="" />
            <h2 className='text-xl'>{title} MOe</h2>
            {count !== undefined && count !== null && <p className=''>({count})</p>}
        </div>
    );
};

export default SectionHeader;
