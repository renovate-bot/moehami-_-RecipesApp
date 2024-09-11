import { ArrowRightIcon, Clock11Icon } from 'lucide-react';
import StarRating from './DifficultyRating';
import { useRouter } from 'next/navigation';
import { RecipeType } from '@/types/types';
import Image from 'next/image';
import { cn } from '@/lib/utlis';

const RecipeCard = ({ recipe }: { recipe: RecipeType }) => {

    const router = useRouter()

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'starter':
                return 'bg-green-600/60';  // green for starters
            case 'main':
                return 'bg-blue-600/60';  // blue for main course
            case 'dessert':
                return 'bg-pink-600/60';  // pink for dessert
            default:
                return 'bg-gray-600';  // fallback color
        }
    };

    const viewRecipe = () => {
        router.push(`/recipe/${recipe.id}`);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full w-full">
        {/* Recipe Image */}
        {/* <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover"
        /> */}

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
                    <p className={cn(`text-white rounded-full mb-2 inline-block px-3 py-1`, getCategoryColor(recipe.category.name))}>{recipe.category.name}</p>

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
