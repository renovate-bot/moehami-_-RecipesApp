"use client"

import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar'
import { RecipeType } from '@/types/types'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const SearchPage = () => {

    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const searchParams = useSearchParams();
    const router = useRouter();

    const searchRecipes = async (query: string = '') => {
        try {
            let url = '/api/recipe';
            if (query.length >= 3) {
                url = `/api/search?query=${query}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error('Failed to fetch recipes', error);
        }
    };

    // Fetch recipes on initial load or when the query changes
    useEffect(() => {
        const query = searchParams.get('query') || '';
        if (query) {
            searchRecipes(query);
        } else {
            searchRecipes(); 
        }
    }, [searchParams]);

    
    // Handle search from SearchBar and update URL query parameter
    const handleSearch = (query: string) => {
        // If query is empty, remove the query parameter
        if (query.trim().length === 0) {
            router.push(`/search`, undefined);
            searchRecipes();
        } else {
            // Update the URL with the search query without navigating
            router.push(`/search?query=${query}`, undefined);
            searchRecipes(query);
        }
    };

    return (
        <section>
            <SearchBar onSearch={handleSearch} />

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                ) : (
                    <p>No recipes found !</p>
                )}
            </div>
        </section>
    )
}

export default SearchPage