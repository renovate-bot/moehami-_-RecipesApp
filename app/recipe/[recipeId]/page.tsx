"use client"

import StarRating from '@/components/DifficultyRating'
import { CookingPotIcon, ListChecksIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { RecipeType } from '@/types/types'
import Image from 'next/image'
import SectionHeader from '@/components/SectionHeader'
import { getCategoryColor } from '@/lib/functions'

const RecipePage = ({ params }: { params: { recipeId: string }}) => {

    const [recipe, setRecipe] = useState<RecipeType | null>(null)

    useEffect(() => {
        const fetchRecipe = async () => {
            const response = await fetch(`/api/recipe/${params.recipeId}`)
            const data: RecipeType = await response.json()
            setRecipe(data)
        }

        fetchRecipe()
    }, [params.recipeId])

    return (
        <div className=''>
            {recipe ? (
                <div>
                    <h1 className='text-4xl font-bold mb-5'>{recipe.title}</h1>
                    <p className={`text-sm font-semibold inline-block px-3 py-1 text-white rounded-full mb-2 ${getCategoryColor(recipe.category.name)}`}>{recipe.category.name}</p>
                    <p><span className='font-semibold'>Preparation time :</span> {recipe.preparationTime} min</p>
                    <StarRating rating={recipe.difficulty} />
                    
                    <SectionHeader icon={ListChecksIcon} title="Instructions" />
                    <p>{recipe.instructions}</p>
                    <div>
                        <SectionHeader icon={CookingPotIcon} title="Ingredients" />
                        <div className='flex flex-wrap gap-3'>
                            {recipe.compositions.map((composition) => (
                                <div className='w-[100px] text-center' key={composition.id}>
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
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default RecipePage