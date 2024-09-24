"use client";

import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { RecipeType } from "@/types/types";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import 'react-big-calendar/lib/css/react-big-calendar.css';

import Image from "next/image";

import { enUS } from "date-fns/locale";
import SectionHeader from "@/components/SectionHeader";

import { CalendarDaysIcon, CalendarPlusIcon } from 'lucide-react';

// Set up date-fns localizer for the calendar
const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

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

    const [events, setEvents] = useState<any[]>([]);

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

    useEffect(() => {
        if (mealPlans.length === 0) return;
    
        // Convert meal plans into calendar events for display
        const events = mealPlans.map((mealPlan) => {
            const start = new Date(mealPlan.date); // Start of the event (date)
            const end = new Date(mealPlan.date); 
        
            const title = mealPlan.mealPlanRecipes
                .map((mealPlanRecipe) => mealPlanRecipe.recipe.title)
                .join(", ");
        
            return {
                title,
                start,
                end,
            };
        });
    
        setEvents(events);
    }, [mealPlans]);

    if (!isLoaded) {
        return <p>Loading...</p>;
    }

    if (!userId) {
        return <p>You need to log in to view your meal planner.</p>;
    }

    return (
        <div className="meal-planner">
            <h1 className="text-4xl font-bold mb-5">Your Meal Planner</h1>

            {/* <Calendar
                localizer={localizer}
                events={events}
                defaultView="agenda"  // Set agenda view as default
                views={['agenda']}  // Limit views to agenda only
                style={{ height: 600, margin: "50px 0" }}
                startAccessor="start"
                endAccessor="end"
                defaultDate={new Date()}
            /> */}

            {/* Display Meal Plans for Logged-in User */}
            <div className="meal-plans mb-8">
                <SectionHeader icon={CalendarDaysIcon} title='Meal Plans' />
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {mealPlans.length > 0 ? (
                    mealPlans.map((mealPlan, index) => (
                        <div className="rounded-lg bg-white dark:bg-slate-800 shadow-md" key={index}>
                            <div className='flex flex-col md:flex-row justify-between bg-slate-200 dark:bg-slate-600 p-6'>
                                <h3 className="text-xl text-slate-800 dark:text-white">
                                    <p className='text-sm'>{new Date(mealPlan.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                    <p>{new Date(mealPlan.date).toLocaleDateString()}</p>
                                </h3>
                                <div className='my-3'>
                                    <button className='px-3 py-1 bg-red-500 rounded-lg text-white'>del</button>
                                </div>
                            </div>
                            <div className='p-6 flex flex-col gap-3'>
                                <div className="border border-slate-200 dark:border-slate-600 rounded-md p-3 shadow-md">
                                {mealPlan.mealPlanRecipes
                                        .filter((recipe: MealPlanRecipe) => recipe.recipe.category.name === 'Starter')
                                        .map((mealPlanRecipe, recipeIndex) => (
                                            <div className='flex gap-6 items-center'>
                                                <Image alt={mealPlanRecipe.recipe.title} src={mealPlanRecipe.recipe.image} width={100} height={100} className='object-cover h-[50px] w-[50px] rounded-lg' />
                                                <p key={recipeIndex} className="text-gray-600 dark:text-white">{mealPlanRecipe.recipe.title}</p>
                                            </div>
                                        ))}
                                </div>
                                <div className="border border-slate-200 dark:border-slate-600 rounded-md p-3 shadow-md">
                                {mealPlan.mealPlanRecipes
                                        .filter((recipe: MealPlanRecipe) => recipe.recipe.category.name === 'Main')
                                        .map((mealPlanRecipe, recipeIndex) => (
                                            <div className='flex gap-6 items-center'>
                                            <Image alt={mealPlanRecipe.recipe.title} src={mealPlanRecipe.recipe.image} width={100} height={100} className='object-cover h-[50px] w-[50px] rounded-lg' />
                                                <p key={recipeIndex} className="text-gray-600 dark:text-white">{mealPlanRecipe.recipe.title}</p>
                                            </div>
                                        ))}
                                </div>
                                <div className="border border-slate-200 dark:border-slate-600 rounded-md p-3 shadow-md">
                                    {mealPlan.mealPlanRecipes
                                        .filter((recipe: MealPlanRecipe) => recipe.recipe.category.name === 'Dessert')
                                        .map((mealPlanRecipe, recipeIndex) => (
                                            <div className='flex gap-6 items-center'>
                                            <Image alt={mealPlanRecipe.recipe.title} src={mealPlanRecipe.recipe.image} width={100} height={100} className='object-cover h-[50px] w-[50px] rounded-lg' />
                                                <p key={recipeIndex} className="text-gray-600 dark:text-white">{mealPlanRecipe.recipe.title}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No meal plans found for you.</p>
                )}
                </div>
            </div>

            {/* Form for Adding New Meal Plans */}
            <SectionHeader icon={CalendarPlusIcon} title='Add a New Meal Plan' />
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
                    className="w-full border p-4 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    required
                />
            </label>

            <label className="block mb-4">
                <span>Starter</span>
                <select
                    value={starter}
                    onChange={(e) => setStarter(e.target.value)}
                    className="w-full border p-4 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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
                    className="w-full border p-4 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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
                    className="w-full border p-4 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
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