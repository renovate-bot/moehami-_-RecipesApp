"use client";

import { RecipeType } from '@/types/types';
import { useState, useEffect } from 'react';

interface ModalProps {
    onSubmit: (recipe: RecipeType) => void; 
    onClose: () => void;          
}

export const Modal = ({ onSubmit, onClose }: ModalProps) => {
    const [recipes, setRecipes] = useState<RecipeType[]>([]);

    useEffect(() => {
        // Fetch all available recipes from the API
        fetch('/api/recipe')
            .then((response) => response.json())
            .then((data) => setRecipes(data));
    }, []);

    return (
        <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Add Recipe</h3>
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.id} className="mb-2">
                            <button
                                className="text-blue-500"
                                onClick={() => onSubmit(recipe)}
                            >
                                {recipe.title}
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};