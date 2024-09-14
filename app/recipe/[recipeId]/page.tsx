"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { RecipeType } from '@/types/types'

import SectionHeader from '@/components/SectionHeader'
import CategoryBadge from '@/components/CategoryBadge'
import MiniRecipeCard from '@/components/MiniRecipeCard'
import DifficultyRating from '@/components/DifficultyRating'
import { Clock10Icon, HeartIcon, CookingPotIcon, LightbulbIcon, ListChecksIcon, MessageSquareQuoteIcon, UserCircleIcon, BookmarkCheckIcon } from 'lucide-react'

import { jsPDF } from 'jspdf';

const RecipePage = ({ params }: { params: { recipeId: string }}) => {

    const [recipe, setRecipe] = useState<RecipeType | null>(null)
    const [suggestions, setSuggestions] = useState<RecipeType[] | null>([])
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(recipe?.comments || []);

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

    const generatePDF = () => {
        if (!recipe) return;

        const pdf = new jsPDF();

        // Ajout du titre de la recette
        pdf.setFontSize(22);
        pdf.text(recipe.title, 10, 20);

        // Ajout du temps de préparation
        pdf.setFontSize(12);
        pdf.text(`Preparation time : ${recipe.preparationTime} min`, 10, 30);

        // Ajout de la difficulté
        pdf.text(`Difficulty : ${recipe.difficulty}/5`, 10, 35);

        // Ajout des ingrédients
        pdf.setFontSize(16);
        pdf.text('Ingredients : ', 10, 50);

        pdf.setFontSize(12);
        let yPosition = 60;
        recipe.compositions.forEach((composition) => {
            pdf.text(`${composition.ingredient.name} - ${composition.quantity} ${composition.measureUnity}`, 10, yPosition);
            yPosition += 5;
        });

        // Ajout des instructions
        pdf.setFontSize(16);
        pdf.text('Instructions :', 10, yPosition + 10);

        pdf.setFontSize(12);
        let instructionsYPosition = yPosition + 20;
        const instructions = pdf.splitTextToSize(recipe.instructions, 180);
        pdf.text(instructions, 10, instructionsYPosition);

        // Sauvegarder le PDF
        pdf.save(`${recipe.title}.pdf`);
    };

    const handleFavorite = () => {
        window.alert("Fav !")
    }

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);
    }

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipe || !newComment.trim()) return;

        try {
            const response = await fetch(`/api/recipe/${params.recipeId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newComment }),
            });

            if (response.ok) {
                const updatedComments = await response.json();
                setRecipe(prev => prev ? { ...prev, comments: updatedComments } : null);
                setNewComment('');
            } else {
                console.error("Failed to submit comment");
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    }

    return (
        <div className=''>
            {recipe ? (
                <div id='recipe-detail'>
                    <div className='flex md:bg-slate-100 dark:md:bg-slate-100/10 rounded-lg flex-col-reverse gap-5 md:flex-row items-center my-5'>
                        {/* Recipe title */}
                        <div className='relative md:w-[50%] flex flex-col p-0 md:p-5 mt-4 mb-7 sm:justify-center sm:items-center sm:text-center'>
                            <div>
                                <h1 className='text-4xl font-thin mb-3'>{recipe.title}</h1>
                            </div>

                            <div className='flex h-full flex-wrap items-center gap-5 sm:justify-center text-center text-xl'>
                                {/* Recipe category + preparation time + difficulty */}
                                <CategoryBadge categoryName={recipe.category.name} />
                                <p className='flex gap-2 items-center'><Clock10Icon /> {recipe.preparationTime} min</p>
                                <DifficultyRating rating={recipe.difficulty} />
                            </div>
                            <div className='flex items-center space-x-3 mt-6'>
                                <button 
                                    onClick={generatePDF}
                                    className='border border-slate-400 px-4 py-2 rounded-lg hover:bg-slate-600 hover:text-slate-200 dark:hover:text-slate-200 transition duration-300'>
                                        Download Recipe
                                </button>
                                <div className='top-0 right-0'>
                                    <button onClick={handleFavorite}><BookmarkCheckIcon className='stroke-red-500 fill-red-500 hover:fill-red-600 hover:stroke-red-600 transition duration-300' /></button>
                                </div>
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

                    {/* Recipe ingredients */}
                    <div>
                        <SectionHeader icon={CookingPotIcon} title="Ingredients" />
                        <div className='flex flex-col sm:flex-wrap sm:flex-row gap-3'>
                            {recipe.compositions.map((composition) => (
                                <div className='flex sm:flex-col justify-between sm:justify-start text-right sm:gap-0 items-center sm:w-[100px] sm:text-center border-b border-gray-300 dark:border-gray-600 last:border-none sm:border-none pb-3' key={composition.id}>
                                    <div className='sm:h-[100px] sm:w-[100px] overflow-hidden rounded-lg shadow-md'>
                                        <Image 
                                            src={composition.ingredient.image} 
                                            alt={composition.ingredient.name} 
                                            height={200}
                                            width={200}
                                            className='w-[100px] h-[100px] object-cover sm:w-full sm:h-full hover:scale-105 transition duration-300'
                                        />
                                    </div>
                                    <p className='sm:mt-2'><span className='font-bold'>{composition.ingredient.name}</span><br/><span className='font-thin text-sm'>{composition.quantity} {composition.measureUnity}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recipe instructions */}
                    <SectionHeader icon={ListChecksIcon} title="Instructions" />
                    <p className='font-thin'>{recipe.instructions}</p>

                    {/* Recipe comments */}
                    <SectionHeader icon={MessageSquareQuoteIcon} title="Comments" />
                    {recipe.comments.length > 0 ? (
                        <div className='flex flex-col gap-3'>
                            {recipe.comments.map((comment) => (
                                <div key={comment.id} className='p-8 rounded-lg border border-slate-300 dark:border-slate-700'>
                                    <div className='flex space-x-2 text-slate-400'> 
                                        <UserCircleIcon />
                                        <p>
                                            {comment.userId} 
                                        </p>
                                    </div>
                                    <p className='text-slate-400'>
                                        {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
                                    </p>
                                    <p>
                                        {comment.text}
                                    </p> 
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No comments</p>
                    )}

                    {/* Add new comment */}
                    <SectionHeader icon={MessageSquareQuoteIcon} title="Add a Comment" />
                    <form onSubmit={handleCommentSubmit} className='flex flex-col gap-4'>
                        <textarea
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder='Write your comment here...'
                            rows={4}
                            className='p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition duration-300'
                        />
                        <button
                            type='submit'
                            className='self-start bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300'
                        >
                            Post Comment
                        </button>
                    </form>

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