import React from 'react';
import Image from 'next/image';
import { Clock10Icon, Download as DownloadIcon, Heart as HeartIcon } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge'; // Ensure this component exists
import DifficultyRating from '@/components/DifficultyRating'; // Ensure this component exists

interface RecipeHeaderProps {
    recipe: {
        title: string;
        category: { name: string };
        preparationTime: number;
        difficulty: number;
        image: string;
    };
    generatePDF: () => void;
    handleFavorite: () => void;
}

const RecipeHeader = ({ recipe, generatePDF, handleFavorite }: RecipeHeaderProps) => {
    return (
        <div className='flex md:bg-slate-100 dark:md:bg-slate-100/10 rounded-lg flex-col-reverse md:flex-row items-center my-5'>
            {/* Recipe title */}
            <div className='relative md:w-[50%] w-full flex flex-col md:p-5 mt-4 mb-7 sm:justify-center sm:items-center sm:text-center'>
                <div>
                    <h1 className='text-4xl font-thin mb-3'>{recipe.title}</h1>
                </div>

                <div className='flex h-full flex-wrap items-center gap-5 sm:justify-center text-center text-xl'>
                    {/* Recipe category + preparation time + difficulty */}
                    <CategoryBadge categoryName={recipe.category.name} />
                    <p className='flex gap-2 items-center'><Clock10Icon /> {recipe.preparationTime} min</p>
                    <DifficultyRating rating={recipe.difficulty} />
                </div>
                <div className='flex flex-col sm:flex-row items-center gap-2 mt-6'>
                    <button
                        onClick={generatePDF}
                        className='flex text-xs w-full sm:w-auto items-center gap-2 dark:border dark:border-slate-400 dark:md:border-none dark:hover:text-slate-400 dark:md:hover:text-slate-100 md:bg-gradient-to-r from-custom-orange to-[#f78b6d] text-slate-900 md:text-white dark:text-white px-5 py-2 p-2 rounded-full shadow-md hover:shadow-lg hover:from-[#e85c47] hover:to-[#f76f58] transition-all duration-300 ease-in-out transform'
                    >
                        <DownloadIcon /> Download
                    </button>
                    <button 
                        onClick={handleFavorite}
                        className='flex text-xs w-full sm:w-auto items-center gap-2 dark:border dark:border-slate-400 dark:md:border-none dark:hover:text-slate-400 dark:md:hover:text-slate-100 md:bg-gradient-to-r from-custom-orange to-[#f78b6d] text-slate-900 md:text-white dark:text-white px-5 py-2 p-2 rounded-full shadow-md hover:shadow-lg hover:from-[#e85c47] hover:to-[#f76f58] transition-all duration-300 ease-in-out transform'
                    >
                        <HeartIcon /> Favorite
                    </button>
                </div>
            </div>
            {/* Recipe picture */}
            <div className='h-full sm:h-[300px] overflow-hidden w-full md:w-[50%]'>
                <Image 
                    rel='eager'
                    quality={100}
                    priority={true}
                    src={recipe.image} 
                    alt={recipe.title} 
                    width={400}
                    height={200}
                    className='h-full object-cover shadow-md hover:shadow-xl transition duration-300 w-full rounded-lg'
                />
            </div>
        </div>
    );
};

export default RecipeHeader;
