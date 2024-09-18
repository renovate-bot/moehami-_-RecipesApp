"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Clock10Icon, Download as DownloadIcon, Heart as HeartIcon } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';
import DifficultyRating from '@/components/DifficultyRating'; 
import Button from '@/components/Button'; 

interface RecipeHeaderProps {
    recipe: {
        id: string,
        title: string;
        category: { name: string };
        preparationTime: number;
        difficulty: number;
        image: string;
    };
    generatePDF: () => void;
    handleFavorite: () => void;
}

const RecipeHeader = ({ recipe, generatePDF }: RecipeHeaderProps) => {

    const [isFavorite, setIsFavorite] = useState(false);

    // Check if recipe is already bookmarked
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        const isAlreadyFavorite = savedFavorites.some((savedRecipe: { id: string }) => savedRecipe.id === recipe.id);
        setIsFavorite(isAlreadyFavorite);
    }, [recipe.id]);

     // Handle bookmarking/unbookmarking
    const handleFavorite = () => {
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');

        if (isFavorite) {
            // Remove from favorites
            const updatedFavorites = savedFavorites.filter((savedRecipe: { id: string }) => savedRecipe.id !== recipe.id);
            localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
            setIsFavorite(false);
        } else {
            // Add to favorites
            savedFavorites.push(recipe);
            localStorage.setItem('favoriteRecipes', JSON.stringify(savedFavorites));
            setIsFavorite(true);
        }
    };

    return (
        <div className='flex md:bg-slate-100 dark:md:bg-slate-100/10 rounded-lg flex-col-reverse md:flex-row items-center my-5'>
            {/* Recipe title */}
            <div className='relative md:w-[50%] w-full flex flex-col md:p-5 mt-4 mb-7 sm:justify-center sm:items-center sm:text-center'>
                <div>
                    <h1 className='text-4xl font-thin mb-3'>{recipe.title}</h1>
                </div>

                <div className='flex h-full flex-wrap items-center gap-5 sm:justify-center text-center text-xl'>
                    {/* Recipe category + preparation time + difficulty */}
                    <CategoryBadge categoryName={recipe.category.name} />
                    <p className='flex gap-2 items-center'><Clock10Icon /> {recipe.preparationTime} min</p>
                    <DifficultyRating rating={recipe.difficulty} />
                </div>
                {/* Buttons */}
                <div className='flex flex-col sm:flex-row items-center gap-2 mt-6'>
                    <Button
                        onClick={generatePDF}
                        icon={DownloadIcon}
                        label="Download"
                    />
                    <Button
                        onClick={handleFavorite}
                        icon={HeartIcon}
                        label={isFavorite ? "Unfavorite" : "Favorite"}
                        customStyles={isFavorite ? 'bg-red-500 hover:bg-red-600 border-none hover:text-white' : 'bg-green-700 hover:bg-green-800 border-none hover:text-white'}
                    />
                </div>
            </div>
            {/* Recipe picture */}
            <div className='h-full sm:h-[300px] overflow-hidden w-full md:w-[50%]'>
                <Image 
                    rel='eager'
                    quality={100}
                    priority={true}
                    src={recipe.image} 
                    alt={recipe.title} 
                    width={400}
                    height={200}
                    className='h-full object-cover shadow-md hover:shadow-xl transition duration-300 w-full rounded-lg'
                />
            </div>
        </div>
    );
};

export default RecipeHeader;
