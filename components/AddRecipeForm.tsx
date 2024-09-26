"use client"

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CategoryType, IngredientType, RecipeType, ToolType, StepType } from "@/types/types"; 
import { Upload, PlusCircle, Trash2 } from "lucide-react"; 

const CLOUDINARY_UPLOAD_PRESET = "your_upload_preset";
const CLOUDINARY_CLOUD_NAME = "your_cloud_name";

const AddRecipeForm = () => {
    const { register, handleSubmit } = useForm();
    const [steps, setSteps] = useState<StepType[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("https://res.cloudinary.com/dr3qz5dk3/image/upload/v1726047897/recette-gateau-chocolat-hersheys-super-chocolate_afh12s.webp"); // To store the uploaded image URL
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [ingredients, setIngredients] = useState<IngredientType[]>([]);
    const [tools, setTools] = useState<ToolType[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState([{ ingredientId: '', quantity: '', measureUnity: '' }]);
    const [selectedTools, setSelectedTools] = useState([{ toolId: '', quantity: '' }]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch("/api/category");
            const data: CategoryType[] = await response.json();
            setCategories(data);
        };

        const fetchIngredients = async () => {
            const response = await fetch("/api/ingredient");
            const data: IngredientType[] = await response.json();
            setIngredients(data);
        };

        const fetchTools = async () => {
            const response = await fetch("/api/tool");
            const data: ToolType[] = await response.json();
            setTools(data);
        };

        fetchCategories();
        fetchIngredients();
        fetchTools();
    }, []);

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Image upload failed'); // Handle any errors
        }

        const data = await res.json();
        return data.secure_url;
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Safely access the first file
        if (file) {
            setImage(file); // Set the selected file to state

            try {
                const uploadedImageUrl = await handleImageUpload(file); // Upload the image
                setImageUrl(uploadedImageUrl); // Store the uploaded image URL
            } catch (error) {
                console.error("Image upload failed:", error);
            }
        } else {
            setImage(null); // Reset state to null if no file was selected
            setImageUrl("https://res.cloudinary.com/dr3qz5dk3/image/upload/v1726047897/recette-gateau-chocolat-hersheys-super-chocolate_afh12s.webp"); // Reset the image URL if no file was selected
        }
    };

    const addStep = () => {
        setSteps([...steps, { id: '', number: steps.length + 1, description: '', duration: 0, image: ''  }]);
    };

    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    // Ingredients handling
    const addIngredient = () => {
        setSelectedIngredients([...selectedIngredients, { ingredientId: '', quantity: '', measureUnity: '' }]);
    };

    const removeIngredient = (index: number) => {
        setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (
        index: number, 
        field: 'ingredientId' | 'quantity' | 'measureUnity', 
        value: string
    ) => {
        const newIngredients = [...selectedIngredients];
        newIngredients[index][field] = value;
        setSelectedIngredients(newIngredients);
    };

    // Tools handling
    const addTool = () => {
        setSelectedTools([...selectedTools, { toolId: '', quantity: '' }]);
    };

    const removeTool = (index: number) => {
        setSelectedTools(selectedTools.filter((_, i) => i !== index));
    };

    const handleToolChange = (
        index: number, 
        field: 'toolId' | 'quantity', 
        value: string
    ) => {
        const newTools = [...selectedTools];
        newTools[index][field] = value;
        setSelectedTools(newTools);
    };

    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index].description = value;
        setSteps(newSteps);
    };

    const onSubmit = async (data: any) => {
        
        const recipe = {
            title: data.title,
            category: data.category,
            preparationTime: data.preparationTime,
            difficulty: data.difficulty,
            instructions: data.instructions,
            image: imageUrl, // Use the uploaded image URL
            steps: steps.map((step, index) => ({
                id: step.id || `step-${index + 1}`, // Use a generated ID if not present
                number: step.number,
                description: step.description,
                duration: step.duration,
                image: step.image || "", // Assuming step.image can be optional
            })),
            // compositions: selectedIngredients.map(ingredient => ({
            //     ingredient: ingredient.ingredientId,
            //     quantity: ingredient.quantity,
            //     measureUnity: ingredient.measureUnity,
            // })),
            // tools: selectedTools.map(tool => ({
            //     toolId: tool.toolId,
            //     quantity: tool.quantity,
            // })),
        };


        // Send the recipe object to your API
        try {
            const response = await fetch("/api/recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipe),
            });

            if (!response.ok) {
                throw new Error('Failed to create recipe');
            }

            // Optionally handle successful creation (e.g., reset form or redirect)
            alert('Recipe created successfully!');
        } catch (error) {
            console.error("Error creating recipe:", error);
            alert('Failed to create recipe');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
            <h1 className="text-3xl font-semibold text-gray-700 dark:text-gray-200">Add New Recipe</h1>

            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Title</label>
                <input
                    type="text"
                    {...register('title')}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter recipe title"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Upload Image</label>
                <label className="flex w-full mt-2">
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden" // Hide the default file input
                    />
                    <button
                        type="button"
                        className="flex items-center bg-custom_orange text-white px-4 py-2 rounded-md hover:bg-custom_orange/90 transition duration-200"
                    >
                        <Upload className="mr-2" /> {/* Lucide Icon */}
                        Upload Image
                    </button>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
                <select {...register('categoryId')} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" required>
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Preparation Time (min)</label>
                <input
                    type="number"
                    min={1}
                    {...register('preparationTime', { min: 1 })}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter preparation time"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Difficulty (1 to 5)</label>
                <input
                    type="number"
                    min={1}
                    max={5}
                    {...register('difficulty', { min: 1, max: 5 })}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter difficulty level"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">Instructions</label>
                <textarea
                    {...register('instructions')}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter instructions"
                    required
                />
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Steps</h2>
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-2">
                        <input
                            type="number"
                            value={step.number}
                            readOnly
                            className="w-12 p-2 border border-gray-300 rounded-md bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
                        />
                        <textarea
                            value={step.description}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            placeholder="Step description"
                            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        />
                        <button type="button" onClick={() => removeStep(index)} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200">
                            <Trash2 className="w-5 h-5" /> {/* Trash icon for removal */}
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addStep} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">Add Step</button>
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Ingredients</h2>
                {selectedIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-4 mt-2">
                        <select
                            value={ingredient.ingredientId}
                            onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                            className="block w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                            <option value="" disabled>Select ingredient</option>
                            {ingredients.map((ingredient) => (
                                <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                            className="block w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            placeholder="Quantity"
                            required
                        />
                        <input
                            type="text"
                            value={ingredient.measureUnity}
                            onChange={(e) => handleIngredientChange(index, 'measureUnity', e.target.value)}
                            className="block w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            placeholder="Measure unity"
                            required
                        />
                        <button type="button" onClick={() => removeIngredient(index)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">Add Ingredient</button>
            </div>

            <div>
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Tools</h2>
                {selectedTools.map((tool, index) => (
                    <div key={index} className="flex items-center space-x-4 mt-2">
                        <select
                            value={tool.toolId}
                            onChange={(e) => handleToolChange(index, 'toolId', e.target.value)}
                            className="block w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                            <option value="" disabled>Select tool</option>
                            {tools.map((tool) => (
                                <option key={tool.id} value={tool.id}>{tool.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={tool.quantity}
                            onChange={(e) => handleToolChange(index, 'quantity', e.target.value)}
                            className="block w-full p-3 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            placeholder="Quantity"
                            required
                        />
                        <button type="button" onClick={() => removeTool(index)} className="bg-red-500 text-white px-4 py-2 rounded-md">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addTool} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">Add Tool</button>
            </div>

            <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-md">Submit Recipe</button>
        </form>
    );
};

export default AddRecipeForm;
