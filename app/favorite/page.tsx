"use client"

import RecipeCard from '@/components/RecipeCard';
import { RecipeType } from '@/types/types';
import React, { useEffect, useState } from 'react';

const FavoritePage = () => {

    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    // Fetch favorite recipes from localStorage when the component mounts
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        setFavoriteRecipes(savedFavorites);
    }, []);

    return (
        <div>
            <h1 className='text-4xl font-bold mb-5'>Favorite Recipes</h1>
            {favoriteRecipes.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {favoriteRecipes.map((recipe: RecipeType) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <p>You haven't saved any favorite recipes yet.</p>
            )}
        </div>
    )
}

export default FavoritePage