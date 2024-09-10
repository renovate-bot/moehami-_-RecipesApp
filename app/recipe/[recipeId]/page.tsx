"use client"

import StarRating from '@/components/StarRating'
import { CookingPotIcon, ListChecksIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const RecipePage = ({ params }: { params: { recipeId: string }}) => {

    const [recipe, setRecipe] = useState<any>(null)

    useEffect(() => {
        const fetchRecipe = async () => {
            const response = await fetch(`/api/recipe/${params.recipeId}`)
            const data: any  = await response.json()
            setRecipe(data)
        }

        fetchRecipe()
    }, [params.recipeId])

    return (
        <div className=''>
            {recipe ? (
                <div>
                    <h1 className='text-4xl font-bold mb-5'>{recipe.title}</h1>
                    <p className='font-bold'>{recipe.category.name}</p>
                    <p>Preparation time : {recipe.preparationTime} min</p>
                    <StarRating rating={recipe.difficulty} />
                    
                    <div className='flex space-x-4 items-center'>
                        <ListChecksIcon />
                        <h2 className='text-xl font-semibold my-3'>Instructions</h2>
                    </div>
                    <p>{recipe.instructions}</p>
                    <div>
                        <div className='flex space-x-4 items-center my-3'>
                            <CookingPotIcon />
                            <h2 className='text-xl font-semibold'>Composition</h2>
                        </div>
                        <div>
                            <ul className='pl-5 list-disc'>
                            {recipe.compositions.map((composition: any) => (
                                <li className='' key={composition.id}>{composition.quantity} {composition.measureUnity} {composition.ingredient.name}</li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Recipe not found</p>
            )}
        </div>
    )
}

export default RecipePage