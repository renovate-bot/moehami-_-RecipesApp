"use client"

import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const RecipesPage = () => {

    const [recipes, setRecipes] = useState<any>([])

    useEffect(() => {
        try {
            const fetchRecipes = async () => {
                const response = await fetch('/api/recipe') 
                const data: any = await response.json()
                setRecipes(data)
            }

            fetchRecipes()
        } catch (error) {
            console.error(error)   
        }
    }, [])

    return (
        <div className=''>
            <h1 className='text-4xl font-bold mb-5'>Recipes</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {recipes.map((recipe: any) => (
                <div key={recipe.id}>
                    {/* <Link href={`/recipe/${recipe.id}`}>{recipe.title}</Link> */}
                    <RecipeCard recipe={recipe} />
                </div>
            ))}
            </div>
        </div>
    )
}

export default RecipesPage