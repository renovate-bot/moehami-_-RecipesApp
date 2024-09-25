"use client"

import { MealPlan, RecipeType } from '@/types/types';
import { useAuth } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'

const MealPlanPage = () => {
    
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const { userId } = useAuth();

    useEffect(() => {

        const fetchMealPlans = async () => {
            const response = await fetch(`/api/mealplan?userId=${userId}`)
            const data: MealPlan[] = await response.json(); 
            setMealPlans(data);
        };

        fetchMealPlans()
    }, [])
    
    return (
        <div>
            {mealPlans.map((mealPlan) => (
                <div key={mealPlan.id}>
                    <h1 className='font-bold text-xl my-5'>{new Date(mealPlan.createdAt).toLocaleDateString()}</h1>
                    {mealPlan.mealPlanRecipes.map((mealPlanRecipe) => (
                        <p key={mealPlanRecipe.id}>
                            <p className='font-semi-bold my-2'>{mealPlanRecipe.mealType}</p>
                            {mealPlanRecipe.recipe.title}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MealPlanPage