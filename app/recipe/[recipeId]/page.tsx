"use client"

import DifficultyRating from '@/components/DifficultyRating'
import { Clock10Icon, CookingPotIcon, LightbulbIcon, ListChecksIcon } from 'lucide-react'
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
                            rel='eager'
                            quality={100}
                            priority={true}
                            src={recipe.image} 
                            alt={recipe.title} 
                            width={400}
                            height={200}
                            className='shadow-md hover:shadow-xl transition duration-300 w-full md:w-[500px] rounded-lg my-5'
                        />
                    </div>

                    <div className='flex flex-wrap items-center gap-5 text-center text-xl'>
                        {/* Recipe category + preparation time + difficulty */}
                        <CategoryBadge categoryName={recipe.category.name} />
                        <p className='flex gap-2 items-center'><Clock10Icon /> {recipe.preparationTime} min</p>
                        <DifficultyRating rating={recipe.difficulty} />
                    </div>
                    
                    {/* Recipe instructions */}
                    <SectionHeader icon={ListChecksIcon} title="Instructions" />
                    <p>{recipe.instructions}</p>
                    {/* Recipe ingredients */}
                    <div>
                        <SectionHeader icon={CookingPotIcon} title="Ingredients" />
                        <div className='flex flex-col sm:flex-wrap sm:flex-row gap-3'>
                            {recipe.compositions.map((composition) => (
                                <div className='flex sm:flex-col justify-between text-right sm:gap-0 items-center sm:w-[100px] sm:text-center border-b border-gray-600 last:border-none sm:border-none pb-3' key={composition.id}>
                                    <div className='h-full sm:h-[100px] sm:w-[100px] overflow-hidden rounded-lg shadow-md'>
                                        <Image 
                                            src={composition.ingredient.image} 
                                            alt={composition.ingredient.name} 
                                            height={200}
                                            width={200}
                                            className='w-[100px] h-[100px] object-cover sm:w-full sm:h-full hover:scale-105 transition duration-300'
                                        />
                                    </div>
                                    <p className='sm:mt-2'><span className='font-semibold'>{composition.ingredient.name}</span><br/>{composition.quantity} {composition.measureUnity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                        <SectionHeader icon={LightbulbIcon} title="Suggestions" />
                        <div className='flex flex-wrap gap-3'>
                        {suggestions?.map((suggestion) => (
                            <MiniRecipeCard key={suggestion.id} recipe={suggestion} />
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