"use client";

import { MealPlan, RecipeType } from '@/types/types';
import { useAuth } from '@clerk/nextjs';
import { Clock10Icon, CroissantIcon, EggFriedIcon, HamIcon, Trash2Icon } from 'lucide-react'; // Trash icon for delete
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const MealPlanPage = () => {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const { userId } = useAuth();

    useEffect(() => {
        const fetchMealPlans = async () => {
            const response = await fetch(`/api/mealplan?userId=${userId}`);
            const data: MealPlan[] = await response.json();
            setMealPlans(data);
        };

        if (userId) {
            fetchMealPlans();
        }
    }, [userId]);

    // Helper function to return the appropriate icon based on meal type
    const getMealTypeIcon = (mealType: string) => {
        switch (mealType.toLowerCase()) {
        case "breakfast":
            return <CroissantIcon className="w-6 h-6 text-custom_orange inline-block mr-2" />;
        case "lunch":
            return <HamIcon className="w-6 h-6 text-custom_orange inline-block mr-2" />;
        case "dinner":
            return <EggFriedIcon className="w-6 h-6 text-custom_orange inline-block mr-2" />;
        default:
            return null; // No icon for unknown meal types
        }
    };

    // Function to handle deletion of meal plans
    const handleDelete = async (mealPlanId: string) => {
        
        try {
            await fetch(`/api/mealplan?mealPlanId=${mealPlanId}`, {
                method: 'DELETE',
            });
            setMealPlans((prev) => prev.filter((mealPlan) => mealPlan.id !== mealPlanId)); // Update state
        } catch (error) {
            console.error('Error deleting meal plan:', error);
        }
    };

    return (
        <section className="min-h-screen dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-300">
            <div className="container mx-auto p-0">
                <h1 className="text-3xl font-bold mb-6">Your Meal Plans</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {mealPlans.map((mealPlan) => {
                        // Group recipes by meal type
                        const groupedRecipes: { [mealType: string]: RecipeType[] } = {};

                        mealPlan.mealPlanRecipes.forEach((mealPlanRecipe) => {
                            const { mealType, recipe } = mealPlanRecipe;
                            if (!groupedRecipes[mealType]) {
                                groupedRecipes[mealType] = [];
                            }
                            groupedRecipes[mealType].push(recipe);
                        });

                        return (
                            <div key={mealPlan.id} className="relative border border-slate-300 dark:border-none bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(mealPlan.id)}
                                    className="absolute top-0 right-0 p-3 dark:bg-slate-700 text-red-500 hover:text-red-600 rounded-tr-lg"
                                    aria-label="Delete meal plan"
                                >
                                    <Trash2Icon className="w-5 h-5" />
                                </button>

                                <h2 className="text-2xl font-semibold mb-6">
                                    {new Date(mealPlan.date).toLocaleDateString()}
                                </h2>
                                {Object.keys(groupedRecipes).map((mealType) => (
                                    <div key={mealType} className="mb-5">
                                        <h3 className="text-xl flex items-center gap-2 font-bold text-custom_orange mb-3">
                                            {getMealTypeIcon(mealType)}
                                            <span>{mealType}</span>
                                        </h3>
                                        <ul className="space-y-2">
                                            {groupedRecipes[mealType].map((recipe) => (
                                                <li key={recipe.id} className="flex items-center justify-between bg-slate-200 dark:bg-slate-700 rounded-md p-3">
                                                    <div>
                                                        <p className="font-medium">{recipe.title}</p>
                                                        <p className="flex gap-2 items-center text-sm text-slate-500 dark:text-slate-400">
                                                            <Clock10Icon className='w-4 h-4' /> <span>{recipe.preparationTime} mins</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Image src={recipe.image} width={100} height={100} alt={recipe.title} className='h-[50px] w-[50px] rounded-lg object-cover' />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default MealPlanPage;
