"use client";

import { CompositionType, NutritionalInfoType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Apple, Drumstick, Wheat, Droplet, Candy } from "lucide-react"; // Lucide icons

interface NutritionalInfoProps {
    compositions: CompositionType[];
}

const NutritionalInfo = ({ compositions }: NutritionalInfoProps) => {
    const [loading, setLoading] = useState(true);
    const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfoType | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Format ingredients for API request
    const ingredients = compositions
        .map((comp) => `${comp.quantity} ${comp.measureUnity} ${comp.ingredient.name}`)
        .join(",");
    const ingredientsString = encodeURIComponent(ingredients);

    const fetchNutritionalInfo = async () => {
        const apiKey = process.env.NEXT_PUBLIC_EDAMAM_API_KEY;
        const apiId = process.env.NEXT_PUBLIC_EDAMAM_API_ID;

        try {
        const response = await fetch(
            `https://api.edamam.com/api/nutrition-data?app_id=${apiId}&app_key=${apiKey}&nutrition-type=cooking&ingr=${ingredientsString}`,
            {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch nutritional information");
        }

        const data = await response.json();
        setNutritionalInfo(data);
        } catch (error) {
        setError("Error fetching nutritional information.");
        console.error("Error fetching nutritional information:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchNutritionalInfo();
    }, [compositions]);

    if (loading) return <p className="text-center py-4">Loading nutritional information...</p>;
    if (error) return <p className="text-center py-4 text-red-600">{error}</p>;
    if (!nutritionalInfo) return <p className="text-center py-4">No nutritional information available.</p>;

    const totalNutrients = nutritionalInfo.totalNutrients || {};

    return (
        <div className="p-6 rounded-lg bg-white dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Calories */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col items-center">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <Apple className="text-green-600 dark:text-green-300 w-8 h-8" />
                </div>
                <h3 className="text-md text-gray-800 dark:text-gray-200 mt-3">Calories</h3>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                    {nutritionalInfo.calories ? `${nutritionalInfo.calories} kcal` : "N/A"}
                </p>
                </div>

                {/* Protein */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <Drumstick className="text-blue-600 dark:text-blue-300 w-8 h-8" />
                </div>
                <h3 className="text-md text-gray-800 dark:text-gray-200 mt-3">
                    {totalNutrients.PROCNT?.label || "Protein"}
                </h3>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                    {totalNutrients.PROCNT?.quantity ? `${totalNutrients.PROCNT.quantity.toFixed(1)} g` : "N/A"}
                </p>
                </div>

                {/* Carbs */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col items-center">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                    <Wheat className="text-yellow-600 dark:text-yellow-300 w-8 h-8" />
                </div>
                <h3 className="text-md text-gray-800 dark:text-gray-200 mt-3">
                    {totalNutrients.CHOCDF?.label || "Carbs"}
                </h3>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                    {totalNutrients.CHOCDF?.quantity ? `${totalNutrients.CHOCDF.quantity.toFixed(1)} g` : "N/A"}
                </p>
                </div>

                {/* Fats */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col items-center">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                    <Droplet className="text-red-600 dark:text-red-300 w-8 h-8" />
                </div>
                <h3 className="text-md text-gray-800 dark:text-gray-200 mt-3">
                    {totalNutrients.FAT?.label || "Fats"}
                </h3>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                    {totalNutrients.FAT?.quantity ? `${totalNutrients.FAT.quantity.toFixed(1)} g` : "N/A"}
                </p>
                </div>

                {/* Sugar */}
                {totalNutrients.SUGAR && (
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex flex-col items-center">
                    <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                    <Candy className="text-pink-600 dark:text-pink-300 w-8 h-8" />
                    </div>
                    <h3 className="text-md text-gray-800 dark:text-gray-200 mt-3">
                    {totalNutrients.SUGAR?.label || "Sugar"}
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                    {totalNutrients.SUGAR?.quantity ? `${totalNutrients.SUGAR.quantity.toFixed(1)} g` : "N/A"}
                    </p>
                </div>
                )}
            </div>
        </div>
    );
};

export default NutritionalInfo;
