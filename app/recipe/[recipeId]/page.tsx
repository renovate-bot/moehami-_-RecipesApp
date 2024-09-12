"use client"

import DifficultyRating from '@/components/DifficultyRating'
import { CookingPotIcon, LightbulbIcon, ListChecksIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { RecipeType } from '@/types/types'
import Image from 'next/image'
import SectionHeader from '@/components/SectionHeader'
import CategoryBadge from '@/components/CategoryBadge'
import MiniRecipeCard from '@/components/MiniRecipeCard'

const RecipePage = ({ params }: { params: { recipeId: string }}) => {

    const [recipe, setRecipe] = useState<RecipeType | null>(null)
    const [suggestions, setSuggestions] = useState<RecipeType[] | null>([])

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`/api/recipe/${params.recipeId}`);
                const data: RecipeType = await response.json();
                setRecipe(data);

                // Fetch suggestions after recipe is fetched
                const suggestionsResponse = await fetch(`/api/suggestions/${data.category.id}/${params.recipeId}`);
                const suggestionsData: RecipeType[] = await suggestionsResponse.json();
                setSuggestions(suggestionsData);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchRecipe();
    }, [params.recipeId]);

    return (
        <div className=''>
            {recipe ? (
                <div>
                    {/* Recipe title */}
                    <h1 className='text-4xl font-bold mb-5'>{recipe.title}</h1>
                    {/* Recipe picture */}
                    <div className=''>
                        <Image 
                            src={recipe.image} 
                            alt={recipe.title} 
                            width={200}
                            height={200}
                            className='shadow-md hover:shadow-xl transition duration-300 w-full md:w-[500px] rounded-lg my-5'
                        />
                    </div>
                    {/* Recipe category + preparation time + difficulty */}
                    <CategoryBadge categoryName={recipe.category.name} />
                    <p><span className='font-semibold'>Preparation time :</span> {recipe.preparationTime} min</p>
                    <DifficultyRating rating={recipe.difficulty} />
                    
                    {/* Recipe instructions */}
                    <SectionHeader icon={ListChecksIcon} title="Instructions" />
                    <p>{recipe.instructions}</p>
                    {/* Recipe ingredients */}
                    <div>
                        <SectionHeader icon={CookingPotIcon} title="Ingredients" />
                        <div className='flex flex-wrap gap-3'>
                            {recipe.compositions.map((composition) => (
                                <div className='w-full sm:w-[100px] text-center' key={composition.id}>
                                    <div className='h-[100px] overflow-hidden rounded-lg shadow-md'>
                                        <Image 
                                            src={composition.ingredient.image} 
                                            alt={composition.ingredient.name} 
                                            height={200}
                                            width={200}
                                            className='object-cover w-full h-full hover:scale-105 transition duration-300'
                                        />
                                    </div>
                                    <p className='mt-2'><span className='font-semibold'>{composition.ingredient.name}</span><br/>{composition.quantity} {composition.measureUnity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                        <SectionHeader icon={LightbulbIcon} title="Suggestions" />
                        <div className='flex flex-wrap gap-3'>
                        {suggestions?.map((suggestion) => (
                            <MiniRecipeCard recipe={suggestion} />
                        ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default RecipePage