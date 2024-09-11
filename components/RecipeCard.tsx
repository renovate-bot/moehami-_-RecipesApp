import { Clock11Icon } from 'lucide-react';
import StarRating from './StarRating';
import { useRouter } from 'next/navigation';
import { RecipeType } from '@/types/types';

const RecipeCard = ({ recipe }: { recipe: RecipeType }) => {

    const router = useRouter()

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
            <div className="p-5">
                {/* Recipe Title */}
                <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>

                {/* Category */}
                <p className="text-gray-500 mb-2">{recipe.category.name}</p>

                {/* Preparation Time */}
                <div className='flex space-x-4 items-center my-2'>
                    <Clock11Icon />
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
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                    View Recipe
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;
