import { ArrowRightIcon, Clock11Icon, HeartPulseIcon, LeafIcon } from 'lucide-react';
import StarRating from './DifficultyRating';
import { useRouter } from 'next/navigation';
import { RecipeType } from '@/types/types';
import Image from 'next/image';
import CategoryBadge from './CategoryBadge';

export const dynamic = 'force-dynamic' 

interface RecipeCardProps {
    recipe: RecipeType;
    className?: string;
}

const RecipeCard = ({ recipe, className }: RecipeCardProps) => {

    const router = useRouter()

    const viewRecipe = () => {
        router.push(`/recipe/${recipe.id}`);
    };

    return (
        <div className={`relative bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full w-full`}>
            {/* Recipe Content */}
            <div className=''>
                {/* Recipe picture */}
                <div className='overflow-hidden h-[250px]'>
                    <Image 
                        rel='preload'
                        priority={true}
                        quality={70}
                        src={recipe.image}
                        width={300}
                        height={100}
                        className='w-full h-full object-cover hover:scale-110 transition duration-300'
                        alt={recipe.title}
                    />
                </div>

                <div className='p-5'>
                    {/* Recipe Title */}
                    <div className=''>
                        <div className='flex flex-wrap justify-between items-center mb-2'>
                            <h2 className="text-2xl font-semibold">{recipe.title}</h2>
                            {(recipe.isVegan || recipe.isHealthy) && (
                                <div className='absolute top-3 right-3 bg-white py-2 px-3 bg-opacity-60 rounded-full flex items-center space-x-2'>
                                    {recipe.isVegan && (
                                        <div className='flex items-center' title='Vegan'>
                                            <LeafIcon strokeWidth={1} fill='#45a864c3'  className='w-6 h-6 text-black' />
                                        </div>
                                    )}

                                    {recipe.isHealthy && (
                                        <div className='flex items-center' title='Healthy'>
                                            <HeartPulseIcon strokeWidth={1} fill='#ef074dbc'  className='w-6 h-6 text-black' />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div className='my-4'>
                        <CategoryBadge categoryName={recipe.category.name} />
                    </div>

                    {/* Preparation Time + difficulty */}
                    <div className='flex flex-col gap-2 mt-2'>
                        <div className='flex space-x-2 items-center'>
                            <Clock11Icon size={15} className='text-slate-500 dark:text-white' />
                            <p className="text-sm text-gray-700 dark:text-white"> {recipe.preparationTime} min</p>
                        </div>
                        <div className='flex space-x-2 items-center'>
                            {/* <p className="text-sm text-gray-700">Difficulty</p> */}
                            <StarRating rating={recipe.difficulty} />
                        </div>
                    </div>

                    {/* Difficulty with Star Rating */}
                    <div className="flex flex-wrap gap-2 sm:gap-0 items-center mb-4">
                    </div>

                    {/* View Recipe Button */}
                    <button 
                        onClick={viewRecipe}
                        className="group border border-slate-100 px-3 py-2 shadow-md hover:shadow-lg dark:hover:shadow-white/10 dark:hover:text-white/80 text-slate-800 dark:text-white font-semibold hover:text-slate-600 rounded-md transition duration-300 flex items-center space-x-2">
                        <span>View Recipe</span> <ArrowRightIcon className='group-hover:animate-bounce-horizontal transition duration-300' size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
