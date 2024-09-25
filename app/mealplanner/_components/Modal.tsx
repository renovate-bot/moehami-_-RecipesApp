"use client";

import { RecipeType } from "@/types/types";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ModalProps {
    onSubmit: (recipe: RecipeType[]) => void;
    onClose: () => void;
}

export const Modal = ({ onSubmit, onClose }: ModalProps) => {
    const [recipes, setRecipes] = useState<RecipeType[]>([]);
    const [selectedRecipes, setSelectedRecipes] = useState<RecipeType[]>([]);

    useEffect(() => {
        // Fetch all available recipes from the API
        fetch("/api/recipe")
        .then((response) => response.json())
        .then((data: RecipeType[]) => {
            const sortedData = data.sort((a: RecipeType, b: RecipeType) =>
            a.title.localeCompare(b.title)
            );
            setRecipes(sortedData);
        });
    }, []);

    const toggleSelection = (recipe: RecipeType) => {
        setSelectedRecipes((prevSelected) => {
            if (prevSelected.find((r) => r.id === recipe.id)) {
                return prevSelected.filter((r) => r.id !== recipe.id); // Deselect
            } else {
                return [...prevSelected, recipe]; // Select
            }
        });
    };

    const handleSubmit = () => {
        onSubmit(selectedRecipes); // Pass selected recipes to parent component
        onClose(); // Close the modal
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Select Recipes
                </h3>

                {/* Scrollable container for recipes */}
                <div className="h-56 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                {recipes.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No recipes available</p>
                ) : (
                    recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            onClick={() => toggleSelection(recipe)}
                            className={`flex items-center mb-3 p-2 cursor-pointer transition-all rounded-lg 
                            ${
                                selectedRecipes.some((r) => r.id === recipe.id)
                                ? "bg-blue-100 dark:bg-custom-orange border border-custom-orange/90"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                            >
                                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {recipe.title}
                                </span>
                        </div>
                    ))
                )}
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Selected
                    </button>
                </div>
            </div>
        </div>
    );
};
