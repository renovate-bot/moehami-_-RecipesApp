"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, PlusCircle, Trash2 } from "lucide-react"; // Importing Lucide icons
import { CategoryType } from "@/types/types";

// Cloudinary upload preset and cloud name (replace with your values)
const CLOUDINARY_UPLOAD_PRESET = "your_upload_preset";
const CLOUDINARY_CLOUD_NAME = "your_cloud_name";

const AddRecipeForm = () => {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        preparationTime: 0,
        difficulty: 1,
        instructions: "",
        isHealthy: false,
        isVegan: false,
        categoryId: "",
        recipeImage: "",
        steps: [{ number: 1, description: "", duration: 0 }],
        tools: [{ name: "", quantity: 1, image: "" }],
        ingredients: [{ name: "", quantity: 0, measureUnity: "", image: "" }],
    });

    useEffect(() => {
        // Fetch categories from the API
        const fetchCategories = async () => {
            const response = await fetch("/api/categorie");
            const data: CategoryType[] = await response.json();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        return data.secure_url;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch("/api/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            router.push("/recipes");
        } else {
            alert("Error adding recipe.");
        }
    };

    const addStep = () => {
        setFormData((prev) => ({
            ...prev,
            steps: [...prev.steps, { number: prev.steps.length + 1, description: "", duration: 0 }],
        }));
    };

    const addIngredient = () => {
        setFormData((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: "", quantity: 0, measureUnity: "", image: "" }],
        }));
    };

    const addTool = () => {
        setFormData((prev) => ({
            ...prev,
            tools: [...prev.tools, { name: "", quantity: 1, image: "" }],
        }));
    };

    const deleteStep = (index: number) => {
        const updatedSteps = formData.steps.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            steps: updatedSteps,
        }));
    };

    const deleteIngredient = (index: number) => {
        const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            ingredients: updatedIngredients,
        }));
    };

    const deleteTool = (index: number) => {
        const updatedTools = formData.tools.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            tools: updatedTools,
        }));
    };

    const handleUploadImage = async (
        file: File,
        type: 'ingredient' | 'tool' | 'recipe',
        index?: number // index is optional here but must be handled appropriately
    ) => {
        const imageUrl = await handleImageUpload(file);
    
        if (type === 'ingredient' && index !== undefined) {
            const ingredients = [...formData.ingredients];
            ingredients[index].image = imageUrl; // Use index safely
            setFormData({ ...formData, ingredients });
        } else if (type === 'tool' && index !== undefined) {
            const tools = [...formData.tools];
            tools[index].image = imageUrl; // Use index safely
            setFormData({ ...formData, tools });
        } else if (type === 'recipe') {
            setFormData({ ...formData, recipeImage: imageUrl });
        } else {
            console.error('Index must be provided for ingredient and tool types');
        }
    };

    return (
        <div className="min-h-screen dark:text-white">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-8 shadow-md rounded-lg dark:bg-gray-900">
                <h2 className="text-2xl font-semibold">Add New Recipe</h2>

                {/* Recipe Title */}
                <div>
                    <label className="block font-medium">Recipe Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="p-3 mt-1 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block font-medium">Category</label>
                    <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="p-3 mt-1 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm"
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                {/* Recipe Image Upload */}
                <div>
                    <label className="block font-medium">Recipe Image</label>
                    <label className="mt-1 w-full h-12 rounded-md cursor-pointer bg-custom_orange border border-gray-600 shadow-sm flex items-center justify-center text-white">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]; // Use optional chaining to safely access the first file
                                if (file) {
                                    handleUploadImage(file, 'recipe');
                                }
                            }}
                            className="hidden"
                        />
                        <Upload className="mr-2" /> Upload Image
                    </label>
                </div>

                {/* Preparation Time & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">Preparation Time (minutes)</label>
                        <input
                            type="number"
                            value={formData.preparationTime}
                            onChange={(e) => setFormData({ ...formData, preparationTime: +e.target.value })}
                            className="p-3 mt-1 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Difficulty</label>
                        <input
                            type="number"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: +e.target.value })}
                            min="1" max="5"
                            className="p-3 mt-1 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Instructions */}
                <div>
                    <label className="block font-medium">Instructions</label>
                    <textarea
                        value={formData.instructions}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        rows={4}
                        className="p-3 mt-1 block w-full h-24 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Steps */}
                <div>
                    <label className="block font-medium">Steps</label>
                    {formData.steps.map((step, index) => (
                        <div key={index} className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Step description"
                                value={step.description}
                                onChange={(e) => {
                                    const updatedSteps = [...formData.steps];
                                    updatedSteps[index].description = e.target.value;
                                    setFormData({ ...formData, steps: updatedSteps });
                                }}
                                className="p-3 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Duration (min)"
                                value={step.duration}
                                onChange={(e) => {
                                    const updatedSteps = [...formData.steps];
                                    updatedSteps[index].duration = +e.target.value;
                                    setFormData({ ...formData, steps: updatedSteps });
                                }}
                                className="p-3 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button type="button" onClick={() => deleteStep(index)} className="text-red-500">
                                <Trash2 className="inline" /> Delete
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addStep} className="mt-2 flex items-center text-blue-500">
                        <PlusCircle className="mr-1" /> Add Step
                    </button>
                </div>

                {/* Ingredients */}
                <div>
                    <label className="block font-medium">Ingredients</label>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Ingredient name"
                                value={ingredient.name}
                                onChange={(e) => {
                                    const updatedIngredients = [...formData.ingredients];
                                    updatedIngredients[index].name = e.target.value;
                                    setFormData({ ...formData, ingredients: updatedIngredients });
                                }}
                                className="p-3 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) => {
                                    const updatedIngredients = [...formData.ingredients];
                                    updatedIngredients[index].quantity = +e.target.value;
                                    setFormData({ ...formData, ingredients: updatedIngredients });
                                }}
                                className="p-3 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {/* Image Upload for Ingredient */}
                            <label className="w-full h-12 rounded-md cursor-pointer bg-custom_orange border border-gray-600 shadow-sm flex items-center justify-center text-white">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]; // Use optional chaining to safely access the first file
                                        if (file) {
                                            handleUploadImage(file, 'ingredient', index);
                                        }
                                    }}
                                    className="hidden"
                                />
                                <Upload className="mr-2" /> Upload Image
                            </label>
                            <button type="button" onClick={() => deleteIngredient(index)} className="text-red-500">
                                <Trash2 className="inline" /> Delete
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addIngredient} className="mt-2 flex items-center text-blue-500">
                        <PlusCircle className="mr-1" /> Add Ingredient
                    </button>
                </div>

                {/* Tools */}
                <div>
                    <label className="block font-medium">Tools</label>
                    {formData.tools.map((tool, index) => (
                        <div key={index} className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Tool name"
                                value={tool.name}
                                onChange={(e) => {
                                    const updatedTools = [...formData.tools];
                                    updatedTools[index].name = e.target.value;
                                    setFormData({ ...formData, tools: updatedTools });
                                }}
                                className="p-3 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={tool.quantity}
                                onChange={(e) => {
                                    const updatedTools = [...formData.tools];
                                    updatedTools[index].quantity = +e.target.value;
                                    setFormData({ ...formData, tools: updatedTools });
                                }}
                                className="p-3 block w-full h-12 rounded-md dark:bg-gray-700 border border-gray-600 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {/* Image Upload for Tool */}
                            <label className="w-full h-12 rounded-md cursor-pointer bg-custom_orange border border-gray-600 shadow-sm flex items-center justify-center text-white">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]; // Use optional chaining to safely access the first file
                                        if (file) {
                                            handleUploadImage(file, 'tool', index);
                                        }
                                    }}
                                    className="hidden"
                                />
                                <Upload className="mr-2" /> Upload Image
                            </label>
                            <button type="button" onClick={() => deleteTool(index)} className="text-red-500">
                                <Trash2 className="inline" /> Delete
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addTool} className="mt-2 flex items-center text-blue-500">
                        <PlusCircle className="mr-1" /> Add Tool
                    </button>
                </div>

                {/* Submission Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full h-12 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150"
                    >
                        Add Recipe
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRecipeForm;
