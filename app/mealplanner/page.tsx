"use client"

import MealSection from '@/components/MealSection';
import { useAuth } from '@clerk/nextjs';
import React, { useState, useCallback } from 'react';

const MealPlanner = () => {
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today's date
    const { userId, isLoaded } = useAuth();
    const [mealPlans, setMealPlans] = useState<{ mealType: string; recipes: { id: string; title: string; }[] }[]>([
        { mealType: 'Breakfast', recipes: [] },
        { mealType: 'Lunch', recipes: [] },
        { mealType: 'Dinner', recipes: [] },
    ]);

    // Function to handle date change (you can enhance this to include a date picker)
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
    };

    const handleRecipesUpdate = useCallback((mealType: string, recipes: { id: string; title: string; }[]) => {
        setMealPlans((prev) =>
            prev.map((mealPlan) =>
                mealPlan.mealType === mealType ? { ...mealPlan, recipes } : mealPlan
            )
        );
    }, []);

    // Validate and save the meal plan
    const validateMealPlan = async () => {
        const mealPlanRecipes = mealPlans.flatMap((mealPlan) =>
            mealPlan.recipes.map((recipe, index) => ({
                recipeId: recipe.id,
                mealType: mealPlan.mealType,
                order: index + 1, // 1-based index
            }))
        );

        console.log(mealPlanRecipes)

        const mealPlanData = {
            date: new Date(date).toISOString(),
            userId: userId,
            mealPlanRecipes,
        };

        // Call your API to save the meal plan
        try {
            const response = await fetch('/api/mealplan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mealPlanData),
            });

            if (!response.ok) {
                throw new Error('Failed to save meal plan');
            }

            console.log('Meal plan saved successfully');
            // Optionally reset meal plans here or provide feedback
        } catch (error) {
            console.error('Error saving meal plan:', error);
        }
    };

    return (
        <div className="mx-auto p-6 dark:bg-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Meal Planner
            </h1>

            <div className="mb-4">
                <label htmlFor="date" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                    Select Date:
                </label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={handleDateChange}
                    className="mt-1 p-2 text-slate-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mealPlans.map((mealPlan) => (
                    <div className="shadow-md rounded-lg p-4" key={mealPlan.mealType}>
                        <MealSection
                            mealType={mealPlan.mealType}
                            onRecipesUpdate={handleRecipesUpdate}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={validateMealPlan}
                className="mt-4 px-4 py-2 bg-green-700 hover:bg-green-800 transition duration-300 text-white rounded"
            >
                Validate Meal Plan
            </button>
        </div>
    );
};

export default MealPlanner;
