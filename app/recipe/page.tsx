"use client"

import RecipeCard from '@/components/RecipeCard'
import { RecipeType } from '@/types/types'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Mousewheel, Autoplay } from 'swiper/modules';
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '@/components/SearchBar'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

export const dynamic = 'force-dynamic' 

const RecipesPage = () => {

    const [recipes, setRecipes] = useState<RecipeType[]>([])

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        try {
            const fetchRecipes = async () => {
                const response = await fetch('/api/recipe') 
                const data: RecipeType[] = await response.json()
                setRecipes(data)
            }

            fetchRecipes()
        } catch (error) {
            console.error(error)   
        }
    }, [])

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
            router.push(`/recipe`, undefined);
            searchRecipes();
        } else {
            // Update the URL with the search query without navigating
            router.push(`/recipe?query=${query}`, undefined);
            searchRecipes(query);
        }
    };


    const shouldEnableLoop = recipes.length > 1;

    return (
        <div>
            <h1 className='text-4xl font-bold mb-5'>Last Recipes</h1>

            <Suspense fallback={<div>Loading...</div>}>
                <SearchBar onSearch={handleSearch} />
            </Suspense>

            <Swiper
                className=''
                modules={[EffectCoverflow, Mousewheel, Pagination, Autoplay]}
                effect={'coverflow'}
                autoplay={{
                    delay: 2500,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false
                }}
                spaceBetween={50}
                mousewheel={true}
                // slidesPerView={'auto'}
                loop={shouldEnableLoop}
                // pagination={{ clickable: true }}
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
                <div>
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <SwiperSlide className='' key={recipe.id}>
                                <RecipeCard recipe={recipe} />
                            </SwiperSlide>
                        ))
                    ) : (
                        <p>No recipes found</p>
                    )}
                </div>
            </Swiper>            
        </div>
    )
}

export default RecipesPage