"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { RecipeType } from "@/types/types";

interface MealPlanRecipe {
    recipe: RecipeType;
}

interface MealPlan {
    date: string;
    mealPlanRecipes: MealPlanRecipe[];
}

const MealPlannerPage = () => {
    const { userId, isLoaded } = useAuth();
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [starters, setStarters] = useState<RecipeType[]>([]);
    const [mains, setMains] = useState<RecipeType[]>([]);
    const [desserts, setDesserts] = useState<RecipeType[]>([]);

    useEffect(() => {
        if (!isLoaded || !userId) return;

        const fetchMealPlans = async () => {
            const res = await fetch(`/api/mealplan?userId=${userId}`);
            const data = await res.json();

            setMealPlans(data);
        };

        const fetchRecipes = async () => {
            const [startersRes, mainsRes, dessertsRes] = await Promise.all([
                fetch("/api/recipe/category?category=starter"),
                fetch("/api/recipe/category?category=main"),
                fetch("/api/recipe/category?category=dessert"),
            ]);

            const startersData = await startersRes.json();
            const mainsData = await mainsRes.json();
            const dessertsData = await dessertsRes.json();

            setStarters(startersData);
            setMains(mainsData);
            setDesserts(dessertsData);
        };

        fetchMealPlans();
        fetchRecipes();
    }, [isLoaded, userId]);

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    if (!userId) {
        return <p>You need to log in to view your meal planner.</p>;
    }

    return (
        <div className="meal-planner">
            <h1 className="text-4xl font-bold mb-5">Your Meal Planner</h1>

            {/* Display Meal Plans for Logged-in User */}
            <div className="meal-plans mb-8">
                <h2 className="text-2xl font-bold mb-4">Meal Plans</h2>
                {mealPlans.length > 0 ? (
                    mealPlans.map((mealPlan, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                            <h3 className="text-xl font-semibold">
                                Date: {new Date(mealPlan.date).toLocaleDateString()}
                            </h3>
                            <div className="mt-2 flex gap-2">
                                <h4 className="font-semibold">-- Starter : </h4>
                                {mealPlan.mealPlanRecipes
                                    .filter(recipe => recipe.recipe.category.name === 'Starter')
                                    .map((mealPlanRecipe, recipeIndex) => (
                                        <p key={recipeIndex}>{mealPlanRecipe.recipe.title}</p>
                                    ))}
                            </div>
                            <div className="mt-2 flex gap-2">
                                <h4 className="font-semibold">-- Main : </h4>
                                {mealPlan.mealPlanRecipes
                                    .filter(recipe => recipe.recipe.category.name === 'Main')
                                    .map((mealPlanRecipe, recipeIndex) => (
                                        <p key={recipeIndex}>{mealPlanRecipe.recipe.title}</p>
                                    ))}
                            </div>
                            <div className="mt-2 flex gap-2">
                                <h4 className="font-semibold">-- Dessert : </h4>
                                {mealPlan.mealPlanRecipes
                                    .filter(recipe => recipe.recipe.category.name === 'Dessert')
                                    .map((mealPlanRecipe, recipeIndex) => (
                                        <p key={recipeIndex}>{mealPlanRecipe.recipe.title}</p>
                                    ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No meal plans found for you.</p>
                )}
            </div>

            {/* Form for Adding New Meal Plans */}
            <h2 className="text-2xl font-bold mb-4">Add a New Meal Plan</h2>
            <MealPlanForm 
                starters={starters} 
                mains={mains} 
                desserts={desserts} 
                userId={userId} 
                setMealPlans={setMealPlans} 
            />
        </div>
    );
};

const MealPlanForm = ({ starters, mains, desserts, userId, setMealPlans }: { starters: RecipeType[], mains: RecipeType[], desserts: RecipeType[], userId: string, setMealPlans: React.Dispatch<React.SetStateAction<MealPlan[]>> }) => {
    const [date, setDate] = useState("");
    const [starter, setStarter] = useState("");
    const [main, setMain] = useState("");
    const [dessert, setDessert] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(`/api/mealplan?userId=${userId}`);
        const existingMealPlans = await res.json();

        const formattedInputDate = new Date(date).toISOString().split('T')[0];
        const mealPlanForDate = existingMealPlans.find((mealPlan: MealPlan) => {
            const formattedMealPlanDate = new Date(mealPlan.date).toISOString().split('T')[0];
            return formattedMealPlanDate === formattedInputDate;
        });

        if (mealPlanForDate) {
            alert("A meal plan already exists for this date. Please select a different date.");
            return;
        }

        const newMealPlan = {
            date,
            starterId: starter,
            mainId: main,
            dessertId: dessert,
            userId,
        };

        // Send the new meal plan to the backend
        const mealPlanRes = await fetch("/api/mealplan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMealPlan),
        });

        if (mealPlanRes.ok) {
            const { id: mealPlanId } = await mealPlanRes.json(); // Get the created meal plan ID

            // Create an array of MealPlanRecipe entries for the selected recipes
            const mealPlanRecipes = [
                { mealPlanId, recipeId: starter },
                { mealPlanId, recipeId: main },
                { mealPlanId, recipeId: dessert },
            ].filter(recipe => recipe.recipeId); // Filter out any empty selections

            // Refresh the meal plans
            const updatedMealPlans = await fetch(`/api/mealplan?userId=${userId}`);
            const data = await updatedMealPlans.json();
            setMealPlans(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="meal-plan-form">
            <label className="block mb-4">
                <span>Date</span>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                />
            </label>

            <label className="block mb-4">
                <span>Starter</span>
                <select
                    value={starter}
                    onChange={(e) => setStarter(e.target.value)}
                    className="w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                >
                    <option value="">Select Starter</option>
                    {starters.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                            {recipe.title}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block mb-4">
                <span>Main</span>
                <select
                    value={main}
                    onChange={(e) => setMain(e.target.value)}
                    className="w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                >
                    <option value="">Select Main</option>
                    {mains.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                            {recipe.title}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block mb-4">
                <span>Dessert</span>
                <select
                    value={dessert}
                    onChange={(e) => setDessert(e.target.value)}
                    className="w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                >
                    <option value="">Select Dessert</option>
                    {desserts.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                            {recipe.title}
                        </option>
                    ))}
                </select>
            </label>

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Save Meal Plan
            </button>
        </form>
    );
};

export default MealPlannerPage;