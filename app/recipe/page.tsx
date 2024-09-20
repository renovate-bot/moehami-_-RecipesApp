"use client"

import RecipeCard from '@/components/RecipeCard'; 
import ArticleCard from '@/components/ArticleCard'; 
import { RecipeType, ArticleWithTagsAndComments } from '@/types/types'; 
import React, { useEffect, useMemo, useState } from 'react'; 
import { Swiper, SwiperSlide } from 'swiper/react'; 
import { Navigation, EffectCoverflow, Pagination, Mousewheel, Autoplay } from 'swiper/modules'; 

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

export const dynamic = 'force-dynamic'; // Enable dynamic rendering

const RecipesPage = () => {
    // State for storing recipes, articles, and loading status
    const [recipes, setRecipes] = useState<RecipeType[]>([]); 
    const [articles, setArticles] = useState<ArticleWithTagsAndComments[]>([]); 
    const [loading, setLoading] = useState<boolean>(true); 

    // Effect to fetch recipes and articles when the component mounts
    useEffect(() => {
        try {
            const fetchRecipes = async () => {
                const response = await fetch('/api/recipe'); 
                const data: RecipeType[] = await response.json(); 
                setRecipes(data);
            };

            const fetchArticles = async () => {
                const response = await fetch('/api/article'); 
                const data: ArticleWithTagsAndComments[] = await response.json(); 
                setArticles(data); 
            };

            fetchRecipes(); 
            fetchArticles(); 
        } catch (error) {
            console.error(error); // Log any errors during fetching
        } finally {
            setLoading(false); // Set loading to false after fetching attempts
        }
    }, []); 

    // Memoize Swiper slides to optimize performance and prevent re-renders
    const swiperSlides = useMemo(() => {
        return recipes.map((recipe) => (
            <SwiperSlide className='' key={recipe.id}>
                <RecipeCard recipe={recipe} />
            </SwiperSlide>
        ));
    }, [recipes]); // Recompute slides when recipes change

    // Determine if looping should be enabled based on the number of recipes
    const shouldEnableLoop = recipes.length > 1; 

    return (
        <div className='pb-5'>
            <h1 className='text-4xl font-bold mb-5'>Latest Recipes</h1>

            <div className='swiper-container'> 
                {loading ? ( 
                    <div className='min-h-screen flex justify-center items-center'>
                        <p>Loading...</p> 
                    </div>
                ) : recipes.length > 0 ? ( 
                    <Swiper
                        className='p-6' 
                        modules={[EffectCoverflow, Mousewheel, Pagination, Autoplay, Navigation]} 
                        effect={'coverflow'} 
                        spaceBetween={50} 
                        mousewheel={true} 
                        navigation 
                        loop={shouldEnableLoop} 
                        pagination={{ clickable: true }} 
                        centeredSlides={true} 
                        grabCursor={true} 
                        coverflowEffect={{
                            rotate: 15,
                            modifier: 1, 
                            slideShadows: false 
                        }}
                        breakpoints={{ 
                            0: {
                                slidesPerView: 1 
                            },
                            600: {
                                slidesPerView: 2 
                            },
                            850: {
                                slidesPerView: 3 
                            },
                            1285: {
                                slidesPerView: 4 
                            },
                        }}
                    >
                        {swiperSlides}
                    </Swiper>            
                ) : (
                    // Loading message if no recipes are available
                    <div className='min-h-screen flex justify-center items-center'>
                        <p>Loading...</p> 
                    </div>
                )}
            </div>

            <h1 className='text-4xl font-bold mb-5 mt-10'>Latest Articles</h1> 
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'> 
                {/* Check if there are articles */}
                {articles.length > 0 ? ( 
                    // Display the first three articles
                    articles.slice(0, 3).map((article) => ( 
                        <ArticleCard key={article.id} article={article} />
                    ))
                ) : (
                    // Message if no articles are available
                    <p>No articles</p> 
                )}
            </div>
        </div>
    );
}

export default RecipesPage;