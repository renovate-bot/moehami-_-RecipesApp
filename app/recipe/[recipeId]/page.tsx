"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { RecipeType } from '@/types/types'

import SectionHeader from '@/components/SectionHeader'
import MiniRecipeCard from '@/components/MiniRecipeCard'
import RecipeHeader from '@/components/RecipeHeader'
import { CookingPotIcon, LightbulbIcon, ListChecksIcon, MessageSquareQuoteIcon, UserCircleIcon, BookmarkCheckIcon, Trash2Icon, WaypointsIcon, DownloadIcon, HeartIcon } from 'lucide-react'

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Mousewheel, Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

import { jsPDF } from 'jspdf';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import CommentCard from '@/components/CommentCard'

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

    const handleDelete = () => {
        window.alert("Delete !")
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
        // window.alert("T'as cru que tu pouvais commenter sur mon site ?")
    }

    return (
        <div className=''>
            {recipe ? (
                <div id='recipe-detail'>
                    <RecipeHeader recipe={recipe} generatePDF={generatePDF} handleFavorite={handleFavorite} />

                    <div className='flex gap-7 flex-col lg:flex-row'>
                        <div className='w-full lg:w-[50%]'>
                            {/* Recipe instructions */}
                            <SectionHeader icon={ListChecksIcon} title="Instructions" />
                            <p className='font-thin'>{recipe.instructions}</p>
                        </div>
                        <div className='w-full lg:w-[50%]'>
                            {/* Recipe ingredients */}
                            <SectionHeader icon={CookingPotIcon} title="Ingredients and Tools" />

                            <TabGroup className='border border-slate-200 dark:border-slate-800 rounded-lg'>
                                <TabList className="flex flex-wrap bg-slate-200 dark:bg-slate-800 p-2 rounded-lg">
                                    <Tab className={({ selected }) => `w-full sm:w-auto px-4 py-2 rounded-lg ${selected ? 'bg-gradient-to-r from-custom-orange to-[#f78b6d] text-white focus:outline-none' : ''}`}>Ingredients</Tab>
                                    
                                    <Tab className={({ selected }) => `w-full sm:w-auto px-4 py-2 rounded-lg ${selected ? 'bg-gradient-to-r from-custom-orange to-[#f78b6d] text-white focus:outline-none' : ''}`}>Tools</Tab>  
                                </TabList>
                                <TabPanels>
                                    <TabPanel className='p-6'>
                                        <div className='flex flex-col sm:flex-wrap sm:flex-row gap-3'>
                                            {recipe.compositions.map((composition) => (
                                                <div className='flex flex-wrap sm:flex-col justify-between sm:justify-start text-right sm:gap-0 items-center sm:w-[100px] sm:text-center border-b border-gray-300 dark:border-gray-600 last:border-none sm:border-none pb-3' key={composition.id}>
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
                                    </TabPanel>
                                    <TabPanel className='p-6'>
                                        <div className='flex flex-col sm:flex-wrap sm:flex-row gap-3'>
                                            {recipe.toolsRecipe && recipe.toolsRecipe.length > 0 ? (
                                                recipe.toolsRecipe.map((toolRecipe) => (
                                                    <div className='flex flex-wrap sm:flex-col justify-between sm:justify-start text-right sm:gap-0 items-center sm:w-[100px] sm:text-center border-b border-gray-300 dark:border-gray-600 last:border-none sm:border-none pb-3' key={toolRecipe.id}>
                                                        <div className='sm:h-[100px] sm:w-[100px] overflow-hidden rounded-lg shadow-md'>
                                                            <Image 
                                                                src={toolRecipe.tool.image} 
                                                                alt={toolRecipe.tool.name} 
                                                                height={200}
                                                                width={200}
                                                                className='w-[100px] h-[100px] object-cover sm:w-full sm:h-full hover:scale-105 transition duration-300'
                                                            />
                                                        </div>
                                                        <p className='sm:mt-2'><span className='font-bold'>{toolRecipe.tool.name}</span></p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className='text-xs text-slate-400'>No tools</p>
                                            )}
                                        </div>
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
                        </div>
                    </div>

                    {/* Recipe steps */}
                    <SectionHeader icon={WaypointsIcon} title="Steps" count={recipe.steps.length} />
                    {recipe.steps && recipe.steps.length > 0 ? (
                        <Swiper
                            modules={[EffectCoverflow, Mousewheel, Pagination, Autoplay, Navigation]}
                            grabCursor={true}
                            mousewheel={true}
                            // navigation
                            slidesPerView={2}
                            pagination={{clickable: true}}
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