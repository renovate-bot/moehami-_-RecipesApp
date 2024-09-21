"use client";

import { CompositionType, NutritionalInfoType } from "@/types/types";
import React, { useEffect, useState } from "react";
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import ChartDataLabelsContext from 'chartjs-plugin-datalabels';

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartData, Align } from "chart.js";
import { Apple, Drumstick, Wheat, Droplet, Candy, Citrus } from "lucide-react"; // Lucide icons
import NutritionalCard from "./NutritionalCard";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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

    const fetchNutritionalInfo = async (ingredientsString: string) => {
        try {
            const response = await fetch(`/api/nutrition?ingredientsString=${encodeURIComponent(ingredientsString)}`);
    
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
        fetchNutritionalInfo(ingredientsString);
    }, [compositions]);

    if (loading) return <p className="text-center py-4">Loading nutritional information...</p>;
    if (error) return <p className="text-center py-4 text-red-600">{error}</p>;
    if (!nutritionalInfo) return <p className="text-center py-4">No nutritional information available.</p>;

    const totalNutrients = nutritionalInfo.totalNutrients || {};

    const protein = totalNutrients.PROCNT?.quantity || 0;
    const carbs = totalNutrients.CHOCDF?.quantity || 0;
    const fats = totalNutrients.FAT?.quantity || 0;

    const chartData: ChartData<'doughnut'> = {
        labels: ["Protein", "Carbs", "Fats"],
        datasets: [
            {
                label: "Nutrients (g)",
                data: [protein, carbs, fats],
                backgroundColor: ["#4F46E5", "#eab308", "#EF4444"], // Colors for protein, carbs, and fats
                hoverBackgroundColor: ["#6366F1", "#FCD34D", "#F87171"],
                borderWidth: 0,
                
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                color: '#fff',
                font: {
                    size: 16,
                },
                formatter: (value: number, context: Context) => {
                    const label = context.chart.data.labels?.[context.dataIndex]; // Get label (Protein, Carbs, Fats)
                    const quantity = value.toFixed(1); // Show value with one decimal
    
                    return `${label}\n${quantity}g`;
                },
                offset: 0,
                backgroundColor: (context: Context) => {
                    return 'rgba(0, 0, 0, 0.4)';
                },
                borderRadius: 4,
                padding: 8, 
                listeners: {
                    enter: () => false,  // Disable labels on hover
                    leave: () => false,    // Enable labels when not hovering
                },
            },
        },
        responsive: true,
        cutout: "75%",
        layout: {
            padding: {
                top: 10,
                bottom: 10,
            },
        },
    };

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
                        value={totalNutrients.PROCNT.quantity ? `${totalNutrients.PROCNT.quantity.toFixed(1)} ${totalNutrients.PROCNT.unit}` : "N/A"}
                        bgColor="bg-blue-100 dark:bg-blue-900"
                        iconColor="text-blue-600 dark:text-blue-300"
                    />
                )}

                {/* Carbs */}
                {totalNutrients.CHOCDF && (
                    <NutritionalCard
                        icon={Wheat}
                        title={totalNutrients.CHOCDF.label || "Carbs"}
                        value={totalNutrients.CHOCDF.quantity ? `${totalNutrients.CHOCDF.quantity.toFixed(1)} ${totalNutrients.CHOCDF.unit}` : "N/A"}
                        bgColor="bg-yellow-100 dark:bg-yellow-900"
                        iconColor="text-yellow-600 dark:text-yellow-300"
                    />
                )}

                {/* Fats */}
                {totalNutrients.FAT && (
                    <NutritionalCard
                        icon={Droplet}
                        title={totalNutrients.FAT.label || "Fats"}
                        value={totalNutrients.FAT.quantity ? `${totalNutrients.FAT.quantity.toFixed(1)} ${totalNutrients.FAT.unit}` : "N/A"}
                        bgColor="bg-red-100 dark:bg-red-900"
                        iconColor="text-red-600 dark:text-red-300"
                    />
                )}

                {/* Sugar */}
                {totalNutrients.SUGAR && (
                    <NutritionalCard
                        icon={Candy}
                        title={totalNutrients.SUGAR.label || "Sugar"}
                        value={totalNutrients.SUGAR.quantity ? `${totalNutrients.SUGAR.quantity.toFixed(1)} ${totalNutrients.SUGAR.unit}` : "N/A"}
                        bgColor="bg-pink-100 dark:bg-pink-900"
                        iconColor="text-pink-600 dark:text-pink-300"
                    />
                )}

                {/* Vitamine C */}
                {totalNutrients.VITC && (
                    <NutritionalCard
                        icon={Citrus}
                        title={totalNutrients.VITC.label || "Vitamine C"}
                        value={totalNutrients.VITC.quantity ? `${totalNutrients.VITC.quantity.toFixed(1)} ${totalNutrients.VITC.unit}` : "N/A"}
                        bgColor="bg-orange-100 dark:bg-orange-900"
                        iconColor="text-orange-600 dark:text-orange-300"
                    />
                )}
            </div>

            {/* Donut Chart for Protein, Carbs, and Fats */}
            <div className="p-6 flex justify-center flex-col mt-6 w-full md:w-[50%] xl:w-[33%]">
                <h3 className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Macronutrients Breakdown
                </h3>
                <Doughnut data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default NutritionalInfo;
