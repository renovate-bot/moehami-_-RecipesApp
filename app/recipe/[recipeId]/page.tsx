"use client"

import React, { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

import { RecipeType } from '@/types/types'; // Import the RecipeType for type safety
import { generatePDF } from '@/lib/functions'; // Import a utility function to generate PDFs

// Components for the recipe page
import SectionHeader from '@/components/SectionHeader'; 
import MiniRecipeCard from '@/components/MiniRecipeCard'; 
import CommentCard from '@/components/CommentCard'; 
import RecipeHeader from '@/app/recipe/_components/RecipeHeader'; 
import CommentForm from '@/components/CommentForm'; 
import IngredientsToolsTabs from '@/components/IngredientsToolsTabs'; 
import NutritionalInfo from '@/app/recipe/_components/NutritionalInfo';
import ShareRecipe from '@/components/ShareRecipe'; 

// Icons from Lucide React
import { CookingPotIcon, LightbulbIcon, ListChecksIcon, MessageSquareQuoteIcon, WaypointsIcon, LeafIcon, OctagonAlert } from 'lucide-react';

// Swiper for creating a carousel effect
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Mousewheel, Autoplay, Navigation } from 'swiper/modules'; // Import necessary Swiper modules
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; 
import 'swiper/css/effect-coverflow'; 
import 'swiper/css/autoplay'; 
import { setSEOAttributes } from '@/lib/seo'; 

import { useUser } from '@clerk/nextjs'; 

// RecipePage component definition
const RecipePage = ({ params }: { params: { recipeId: string }}) => {
    // State for storing the recipe and suggestions
    const [recipe, setRecipe] = useState<RecipeType | null>(null); // Recipe details
    const [suggestions, setSuggestions] = useState<RecipeType[] | null>([]); // Suggested recipes
    const { user } = useUser(); // Get the currently authenticated user

    // Effect for fetching recipe data when the component mounts or recipeId changes
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                // Fetch recipe data from the API
                const response = await fetch(`/api/recipe/${params.recipeId}`);
                const data: RecipeType = await response.json();
                setRecipe(data); // Update state with the fetched recipe

                // Set the SEO attributes for the page
                if (data.title) {
                    setSEOAttributes(
                        `Recipe Page - ${data.title}`,
                        `Learn how to cook ${data.title} with detailed instructions and tips.`
                    );
                }

                // Fetch recipe suggestions based on the recipe's category
                const suggestionsResponse = await fetch(`/api/suggestions/${data.category.id}/${params.recipeId}`);
                const suggestionsData: RecipeType[] = await suggestionsResponse.json();
                setSuggestions(suggestionsData); // Update state with suggestions
                
            } catch (error) {
                console.error("Error fetching data:", error); // Log any errors during fetching
            }
        };

        fetchRecipe(); // Call the fetch function
    }, [params.recipeId]); // Dependency array ensures it runs when recipeId changes

    // Handle adding a recipe to favorites
    const handleFavorite = () => {
        window.alert("Fav !"); // Placeholder alert for favorite action
    };

    // Handle deleting a comment (placeholder function)
    const handleDelete = () => {
        window.alert("Delete !"); // Placeholder alert for delete action
    };

    // Handle submitting a new comment
    const handleCommentSubmit = async (data: { text: string }) => {
        if (!recipe || !data.text.trim()) return; // Ensure recipe exists and text is valid

        try {
            // Send a POST request to add the comment
            const response = await fetch(`/api/recipe/${params.recipeId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: data.text }),
            });

            if (response.ok) {
                const updatedComments = await response.json(); // Get updated comments
                setRecipe(prev => prev ? { ...prev, comments: updatedComments } : null); // Update recipe state with new comments
            } else {
                console.error('Error post comment'); // Log error if request fails
            }
        } catch (error) {
            console.error("Error submitting comment:", error); // Log errors during submission
        }
    };

    const [currentPage, setCurrentPage] = useState(0);
    const commentsPerPage = 3;

    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
    };

    return (
        <>
            <div className=''>
                {recipe ? (
                    <div id='recipe-detail'>
                        {/* Recipe header component */}
                        <RecipeHeader recipe={recipe} generatePDF={() => generatePDF(recipe)} handleFavorite={handleFavorite} />    

                        <div className='flex gap-7 flex-col lg:flex-row'>
                            <div className='w-full lg:w-[50%]'>
                                {/* Section for recipe instructions */}
                                <SectionHeader icon={ListChecksIcon} title="Instructions" />
                                <p className='font-thin'>{recipe.instructions}</p>
                            </div>
                            <div className='w-full lg:w-[50%]'>
                                {/* Section for recipe ingredients and tools */}
                                <SectionHeader icon={CookingPotIcon} title="Ingredients and Tools" />
                                <IngredientsToolsTabs compositions={recipe.compositions} toolsRecipe={recipe.toolsRecipe} />
                            </div>
                        </div>

                        {/* Section for recipe steps */}
                        <SectionHeader icon={WaypointsIcon} title="Steps" count={recipe.steps.length} />
                        {recipe.steps && recipe.steps.length > 0 ? (
                            <Swiper
                                modules={[EffectCoverflow, Mousewheel, Pagination, Autoplay, Navigation]} // Use Swiper modules
                                grabCursor={true}
                                mousewheel={true}
                                slidesPerView={2}
                                navigation
                                spaceBetween={20}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 1 // Adjust slides per view based on screen size
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
                            <p className='text-xs text-slate-400'>No steps</p> // Message if no steps are available
                        )}

                        {/* Nutritional info section */}
                        <SectionHeader icon={LeafIcon} title="Nutritional Infos" />
                        <NutritionalInfo compositions={recipe.compositions} />

                        {/* Section for comments */}
                        <SectionHeader icon={MessageSquareQuoteIcon} title="Comments" count={recipe.comments.length} />
                        {recipe.comments.length > 0 ? (
                            <div className='flex flex-col gap-3'>
                                {recipe.comments.slice(currentPage * commentsPerPage, (currentPage + 1) * commentsPerPage).map((comment) => (
                                    <CommentCard key={comment.id} comment={comment} onDelete={handleDelete} /> // Render each comment
                                    ))}
                                {/* Add pagination for comments */}
                                <div className='flex justify-center py-4'>
                                    <ReactPaginate
                                        previousLabel={"←"}
                                        nextLabel={"→"}
                                        breakLabel={"..."}
                                        pageCount={Math.ceil(recipe.comments.length / commentsPerPage)}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName={"flex justify-center items-center gap-2 mt-5"}
                                        pageClassName={"pagination-item"}
                                        pageLinkClassName={"pagination-link"}
                                        previousClassName={`pagination-item ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} // Opacity if no previous
                                        previousLinkClassName={"pagination-link"}
                                        nextClassName={`pagination-item ${currentPage === Math.ceil(recipe.comments.length / commentsPerPage) - 1 ? 'opacity-50 cursor-not-allowed' : ''}`} // Opacity if no next
                                        nextLinkClassName={"pagination-link"}
                                        breakClassName={"pagination-item"}
                                        breakLinkClassName={"pagination-link"}
                                        activeClassName={"pagination-active"} // Class for active page
                                        disabledClassName={"pagination-disabled"} // Class for disabled buttons
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className='text-xs text-slate-400'>No comments</p> // Message if no comments are available
                            )}

                        {/* Section for adding a new comment */}
                        <SectionHeader icon={MessageSquareQuoteIcon} title="Add a Comment" />
                        {user ? (
                            <CommentForm onSubmit={handleCommentSubmit} /> // Show comment form if user is logged in
                            ) : (
                                <div className='p-6 bg-red-200 flex justify-center rounded-lg'>
                                <p className='flex gap-2 items-center text-sm text-red-700'><OctagonAlert /> You have to sign in or sign up to comment on this recipe.</p>
                            </div>
                        )}

                        {/* Section for sharing the recipe */}
                        <ShareRecipe recipeTitle={recipe.title} />

                        {/* Suggestions section */}
                        <div>
                            <SectionHeader icon={LightbulbIcon} title="Suggestions" />
                            <div className='flex flex-wrap gap-3'>
                                {suggestions?.map((suggestion) => (
                                    <MiniRecipeCard key={suggestion.id} recipe={suggestion} /> // Render each suggestion as a mini recipe card
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p> // Loading message while the recipe data is being fetched
                )}
            </div>
        </>
    )
}

export default RecipePage;