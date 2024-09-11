"use client"

import RecipeCard from '@/components/RecipeCard'
import { RecipeType } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Pagination, Scrollbar, A11y, Mousewheel, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';

const RecipesPage = () => {

    const [recipes, setRecipes] = useState<RecipeType[]>([])

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

    return (
        // <div className=''>
        //     <h1 className='text-4xl font-bold mb-5'>Recipes</h1>
        //     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        //     {recipes.map((recipe) => (
        //         <div key={recipe.id}>
        //             <RecipeCard recipe={recipe} />
        //         </div>
        //     ))}
        //     </div>
        // </div>

        <div>
            <h1 className='text-4xl font-bold mb-5'>Last Recipes</h1>
            <Swiper
                modules={[EffectCoverflow, Mousewheel, Pagination, Autoplay]}
                effect={'coverflow'}
                autoplay={{
                    delay: 2500,
                    pauseOnMouseEnter: true
                }}
                spaceBetween={50}
                mousewheel={true}
                // slidesPerView={'auto'}
                loop={true}
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
                    524: {
                        slidesPerView: 2
                    },
                    1028: {
                        slidesPerView: 3
                    },
                }}
            >
            {recipes.map((recipe) => (
                <SwiperSlide className='' key={recipe.id}>
                    <RecipeCard recipe={recipe} />
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
    )
}

export default RecipesPage