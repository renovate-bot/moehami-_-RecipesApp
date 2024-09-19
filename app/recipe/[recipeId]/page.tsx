"use client"

import React, { useEffect, useState } from 'react'

import { NutritionalInfoType, RecipeType } from '@/types/types'
import { generatePDF } from '@/lib/functions'

// components
import SectionHeader from '@/components/SectionHeader'
import MiniRecipeCard from '@/components/MiniRecipeCard'
import CommentCard from '@/components/CommentCard'
import RecipeHeader from '@/app/recipe/_components/RecipeHeader'
import CommentForm from '@/components/CommentForm'
import IngredientsToolsTabs from '@/components/IngredientsToolsTabs'

// Lucide React
import { CookingPotIcon, LightbulbIcon, ListChecksIcon, MessageSquareQuoteIcon, UserCircleIcon, BookmarkCheckIcon, Trash2Icon, WaypointsIcon, DownloadIcon, HeartIcon, LeafIcon } from 'lucide-react'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Mousewheel, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import ShareRecipe from '@/components/ShareRecipe'
import NutritionalInfo from '@/components/NutritionalInfo'

const RecipePage = ({ params }: { params: { recipeId: string }}) => {

    const [recipe, setRecipe] = useState<RecipeType | null>(null)
    const [suggestions, setSuggestions] = useState<RecipeType[] | null>([])
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

    const handleFavorite = () => {
        window.alert("Fav !")
    }

    const handleDelete = () => {
        window.alert("Delete !")
    }

    const handleCommentSubmit = async (data: { text: string }) => {
        if (!recipe || !data.text.trim()) return;

        try {
            const response = await fetch(`/api/recipe/${params.recipeId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: data.text }),
            });

            if (response.ok) {
                const updatedComments = await response.json();
                setRecipe(prev => prev ? { ...prev, comments: updatedComments } : null); 
            } else {
                console.error('Error post comment')
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    }

    return (
        <div className=''>
            {recipe ? (
                <div id='recipe-detail'>
                    {/* Recipe header */}
                    <RecipeHeader recipe={recipe} generatePDF={() => generatePDF(recipe)} handleFavorite={handleFavorite} />    

                    <div className='flex gap-7 flex-col lg:flex-row'>
                        <div className='w-full lg:w-[50%]'>
                            {/* Recipe instructions */}
                            <SectionHeader icon={ListChecksIcon} title="Instructions" />
                            <p className='font-thin'>{recipe.instructions}</p>
                        </div>
                        <div className='w-full lg:w-[50%]'>
                            {/* Recipe ingredients */}
                            <SectionHeader icon={CookingPotIcon} title="Ingredients and Tools" />
                            <IngredientsToolsTabs compositions={recipe.compositions} toolsRecipe={recipe.toolsRecipe} />
                        </div>
                    </div>

                    {/* Recipe steps */}
                    <SectionHeader icon={WaypointsIcon} title="Steps" count={recipe.steps.length} />
                    {recipe.steps && recipe.steps.length > 0 ? (
                        <Swiper
                            modules={[EffectCoverflow, Mousewheel, Pagination, Autoplay, Navigation]}
                            grabCursor={true}
                            mousewheel={true}
                            slidesPerView={2}
                            navigation
                            // pagination={{clickable: true}}
                            spaceBetween={20}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1
                                },
                                900: {
                                    slidesPerView: 2
                                },
                            }}
                        >
                        {recipe.steps.map((step) => (
                            <SwiperSlide key={step.id}>
                                <div className='px-8 py-10 flex flex-col items-center justify-center w-full h-[450px] sm:h-[350px] rounded-md text-center bg-slate-100 dark:bg-slate-800 dark:border-slate-800'>
                                    <h3 className='font-bold text-4xl mb-3 text-custom-orange'>{step.number}</h3>
                                    <p className='font-thin'>{step.description}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                        </Swiper>
                    ) : (
                        <p className='text-xs text-slate-400'>No steps</p>
                    )}

                    {/* Recipe comments */}
                    <SectionHeader icon={MessageSquareQuoteIcon} title="Comments" count={recipe.comments.length} />
                    {recipe.comments.length > 0 ? (
                        <div className='flex flex-col gap-3'>
                            {recipe.comments.map((comment) => (
                                <CommentCard key={comment.id} comment={comment} onDelete={handleDelete} />
                            ))}
                        </div>
                    ) : (
                        <p className='text-xs text-slate-400'>No comments</p>
                    )}

                    {/* Add new comment */}
                    <SectionHeader icon={MessageSquareQuoteIcon} title="Add a Comment" />
                    <CommentForm onSubmit={handleCommentSubmit} />

                    {/* Share social networks */}
                    <ShareRecipe recipeTitle={recipe.title} />

                    <SectionHeader icon={LeafIcon} title="Nutritional Infos" />
                    <NutritionalInfo compositions={recipe.compositions} />

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