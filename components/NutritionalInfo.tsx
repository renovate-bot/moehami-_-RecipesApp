"use client";

import { CompositionType, NutritionalInfoType } from '@/types/types';
import React, { useEffect, useState } from 'react';

interface NutritionalInfoProps {
    compositions: CompositionType[];
}

const NutritionalInfo = ({ compositions }: NutritionalInfoProps) => {
    const [loading, setLoading] = useState(true);
    const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfoType | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Format ingredients for API request
    const ingredients = compositions.map((comp) => `${comp.quantity} ${comp.measureUnity} ${comp.ingredient.name}`).join(',');
    const ingredientsString = encodeURIComponent(ingredients);

    const fetchNutritionalInfo = async () => {
        const apiKey = process.env.NEXT_PUBLIC_EDAMAM_API_KEY;
        const apiId = process.env.NEXT_PUBLIC_EDAMAM_API_ID;
    
        try {
            const response = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${apiId}&app_key=${apiKey}&nutrition-type=cooking&ingr=${ingredientsString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch nutritional information');
            }
    
            const data = await response.json();
            setNutritionalInfo(data);
        } catch (error) {
            setError('Error fetching nutritional information.');
            console.error('Error fetching nutritional information:', error);
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
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Nutritional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Calories</h3>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                        {nutritionalInfo.calories ? `${nutritionalInfo.calories} kcal` : 'N/A'}
                    </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{totalNutrients.PROCNT.label }</h3>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                        {totalNutrients.PROCNT ? `${totalNutrients.PROCNT.quantity} g` : 'N/A'}
                    </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{totalNutrients.CHOCDF.label }</h3>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                        {totalNutrients.CHOCDF ? `${totalNutrients.CHOCDF.quantity} g` : 'N/A'}
                    </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{totalNutrients.FAT.label }</h3>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                        {totalNutrients.FAT ? `${totalNutrients.FAT.quantity} g` : 'N/A'}
                    </p>
                </div>
                {/* Additional nutritional data */}
                {totalNutrients.SUGAR && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{totalNutrients.SUGAR.label }</h3>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                            {totalNutrients.SUGAR ? `${totalNutrients.SUGAR.quantity} g` : 'N/A'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NutritionalInfo;