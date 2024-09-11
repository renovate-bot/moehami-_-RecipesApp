import { LucideIcon } from 'lucide-react';  // Type for Lucide icons

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
}

const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => {
    return (
        <div className='flex space-x-4 items-center mt-8 mb-3'>
            <Icon className="text-[#f26b5a]" /> {/* Icon will be dynamic */}
            <h2 className='text-xl font-semibold text-[#f26b5a]'>{title}</h2>
        </div>
    );
};

export default SectionHeader;