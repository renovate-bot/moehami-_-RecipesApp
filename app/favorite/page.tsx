"use client"

import RecipeCard from '@/components/RecipeCard';
import { useAuth } from "@clerk/nextjs";
import { RecipeType } from '@/types/types';
import React, { useEffect, useState } from 'react';

const FavoritePage = () => {

    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const { isLoaded, userId } = useAuth(); // Get userId from Clerk

    // Fetch favorite recipes from localStorage when the component mounts
    useEffect(() => {

        if (!isLoaded || !userId) {
            // If the authentication is not yet loaded or the user is not authenticated, don't proceed
            return;
        }

        const savedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        setFavoriteRecipes(savedFavorites);
    }, [isLoaded, userId]);

    if (!isLoaded) {
        return <p>Loading...</p>; // Show loading state while Clerk is loading
    }

    if (!userId) {
        return <p>You need to log in to see your favorite recipes.</p>; // Message for unauthenticated users
    }

    return (
        <div>
            <h1 className='text-4xl font-bold mb-5'>Favorite Recipes</h1>
            {favoriteRecipes.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
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