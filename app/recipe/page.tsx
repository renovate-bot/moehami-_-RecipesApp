"use client"

import RecipeCard from '@/components/RecipeCard'
import ArticleCard from '@/components/ArticleCard'
import { RecipeType, ArticleWithTagsAndComments } from '@/types/types'
import React, { useEffect, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, EffectCoverflow, Pagination, Mousewheel, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

export const dynamic = 'force-dynamic' 

const RecipesPage = () => {

    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [articles, setArticles] = useState<ArticleWithTagsAndComments[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        try {
            const fetchRecipes = async () => {
                const response = await fetch('/api/recipe') 
                const data: RecipeType[] = await response.json()
                setRecipes(data)
            }

            const fetchArticles = async () => {
                const response = await fetch('/api/article') 
                const data: ArticleWithTagsAndComments[] = await response.json()
                setArticles(data)
            }

            fetchRecipes()
            fetchArticles()
        } catch (error) {
            console.error(error)   
        }
        finally {
            setLoading(false)
        }
    },[])

    // Memoize Swiper slides to prevent re-renders when recipes change
    const swiperSlides = useMemo(() => {
        return recipes.map((recipe) => (
            <SwiperSlide className='' key={recipe.id}>
                <RecipeCard recipe={recipe} />
            </SwiperSlide>
        ));
    }, [recipes]);

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
                        // autoplay={{
                        //     delay: 2500,
                        //     pauseOnMouseEnter: true,
                        //     disableOnInteraction: false
                        // }}
                        spaceBetween={50}
                        mousewheel={true}
                        navigation
                        // slidesPerView={'auto'}
                        loop={shouldEnableLoop}
                        pagination={{clickable: true}}
                        centeredSlides={true}
                        grabCursor={true}
                        coverflowEffect={{
                            rotate: 15,
                            // stretch: 0,
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
                    <div className='min-h-screen flex justify-center items-center'>
                        <p>Loading...</p>
                    </div>
                )}
            </div>

            <h1 className='text-4xl font-bold mb-5 mt-10'>Latest Articles</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {articles.length > 0 ? (
                articles.slice(0,3).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))
            ) : (
                <p>No articles</p>
            )}
            </div>
        </div>
    )
}

export default RecipesPage