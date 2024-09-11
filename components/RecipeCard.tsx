import { ArrowRightIcon, Clock11Icon } from 'lucide-react';
import StarRating from './DifficultyRating';
import { useRouter } from 'next/navigation';
import { RecipeType } from '@/types/types';
import Image from 'next/image';
import { cn } from '@/lib/utlis';
import CategoryBadge from './CategoryBadge';

const RecipeCard = ({ recipe }: { recipe: RecipeType }) => {

    const router = useRouter()

    const viewRecipe = () => {
        router.push(`/recipe/${recipe.id}`);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full w-full">
            {/* Recipe Content */}
            <div className=''>
                {/* Recipe picture */}
                <div className='overflow-hidden h-[250px]'>
                    <Image 
                        src={recipe.image}
                        width={500}
                        height={200}
                        className='w-full h-full object-cover hover:scale-110 transition duration-300'
                        alt={recipe.title}
                    />
                </div>

                <div className='p-5'>
                    {/* Recipe Title */}
                    <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>

                    {/* Category */}
                    <CategoryBadge categoryName={recipe.category.name} />

                    {/* Preparation Time */}
                    <div className='flex space-x-2 items-center my-2'>
                        <Clock11Icon size={15} className='text-slate-500' />
                        <p className="text-gray-700"> {recipe.preparationTime} min</p>
                    </div>

                    {/* Difficulty with Star Rating */}
                    <div className="flex flex-wrap gap-2 sm:gap-0 items-center mb-4">
                        <p className="mr-2 text-gray-700">Difficulty:</p>
                        <StarRating rating={recipe.difficulty} />
                    </div>

                    {/* View Recipe Button */}
                    <button 
                        onClick={viewRecipe}
                        className="text-slate-800 font-semibold hover:text-slate-600 py-2 rounded-mdtransition-colors duration-300 flex items-center space-x-2">
                        <span>View Recipe</span> <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
