"use client";

import { CompositionType, NutritionalInfoType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Apple, Drumstick, Wheat, Droplet, Candy } from "lucide-react"; // Lucide icons
import NutritionalCard from "./NutritionalCard";

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
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Calories */}
                {nutritionalInfo.calories && (
                    <NutritionalCard
                        icon={Apple}
                        title="Calories"
                        value={nutritionalInfo.calories ? `${nutritionalInfo.calories} kcal` : "N/A"}
                        bgColor="bg-green-100 dark:bg-green-900"
                        iconColor="text-green-600 dark:text-green-300"
                    />
                )}
                        
                {/* Protein */}
                {totalNutrients.PROCNT && (
                    <NutritionalCard
                        icon={Drumstick}
                        title={totalNutrients.PROCNT.label || "Protein"}
                        value={totalNutrients.PROCNT.quantity ? `${totalNutrients.PROCNT.quantity.toFixed(1)} g` : "N/A"}
                        bgColor="bg-blue-100 dark:bg-blue-900"
                        iconColor="text-blue-600 dark:text-blue-300"
                    />
                )}

                {/* Carbs */}
                {totalNutrients.CHOCDF && (
                    <NutritionalCard
                        icon={Wheat}
                        title={totalNutrients.CHOCDF.label || "Carbs"}
                        value={totalNutrients.CHOCDF.quantity ? `${totalNutrients.CHOCDF.quantity.toFixed(1)} g` : "N/A"}
                        bgColor="bg-yellow-100 dark:bg-yellow-900"
                        iconColor="text-yellow-600 dark:text-yellow-300"
                    />
                )}

                {/* Fats */}
                {totalNutrients.FAT && (
                    <NutritionalCard
                        icon={Droplet}
                        title={totalNutrients.FAT.label || "Fats"}
                        value={totalNutrients.FAT.quantity ? `${totalNutrients.FAT.quantity.toFixed(1)} g` : "N/A"}
                        bgColor="bg-red-100 dark:bg-red-900"
                        iconColor="text-red-600 dark:text-red-300"
                    />
                )}

                {/* Sugar */}
                {totalNutrients.SUGAR && (
                    <NutritionalCard
                        icon={Candy}
                        title={totalNutrients.SUGAR.label || "Sugar"}
                        value={totalNutrients.SUGAR.quantity ? `${totalNutrients.SUGAR.quantity.toFixed(1)} g` : "N/A"}
                        bgColor="bg-pink-100 dark:bg-pink-900"
                        iconColor="text-pink-600 dark:text-pink-300"
                    />
                )}
            </div>
        </div>
    );
};

export default NutritionalInfo;
