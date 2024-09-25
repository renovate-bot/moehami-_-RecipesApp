import React, { useEffect, useState } from 'react';
import {
    DndContext,
    useSensors,
    useSensor,
    MouseSensor,
    TouchSensor,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Modal } from './Modal';
import { useAuth } from '@clerk/nextjs';
import { GripVerticalIcon, Plus, Trash2 } from 'lucide-react'; // Importing icons from Lucide React

interface Recipe {
    id: string;
    title: string;
}

interface MealSectionProps {
    mealType: string;
    onRecipesUpdate: (mealType: string, recipes: Recipe[]) => void;
}

// Sortable Recipe Item Component
const SortableRecipeItem = ({ id, title, onDelete }: { id: string; title: string; onDelete: () => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className="bg-white dark:bg-slate-700 shadow-md p-4 rounded-md flex justify-between items-center mb-3 transition-transform duration-150 ease-in-out"
        >
            <div className='flex gap-3'>
                <GripVerticalIcon className='text-slate-500' />
                <span className="text-gray-800 dark:text-white">{title}</span>
            </div>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }} 
                className="text-red-500 hover:text-red-700 transition-colors"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
};

// Main Meal Section Component
const MealSection = ({ mealType, onRecipesUpdate }: MealSectionProps) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]); 
    const [isModalOpen, setModalOpen] = useState(false); 
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
    const { userId } = useAuth();

    // Drag End Handler for Recipe Reordering
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setRecipes((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Add Selected Recipes to Meal Section
    const addRecipes = (selectedRecipes: Recipe[]) => {
        setRecipes((prev) => [...prev, ...selectedRecipes]); 
        setModalOpen(false);
    };

    // Delete Recipe from List
    const deleteRecipe = (id: string) => {
        setRecipes((prev) => prev.filter(recipe => recipe.id !== id)); 
    };

    // Update Parent Component with Recipes
    useEffect(() => {
        onRecipesUpdate(mealType, recipes);
    }, [recipes, mealType, onRecipesUpdate]);

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {mealType}
                </h2>
                <button 
                    onClick={() => setModalOpen(true)} 
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext items={recipes.map(recipe => recipe.id)} strategy={verticalListSortingStrategy}>
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <SortableRecipeItem 
                                key={recipe.id} 
                                id={recipe.id} 
                                title={recipe.title} 
                                onDelete={() => deleteRecipe(recipe.id)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">No recipes added yet.</p>
                    )}
                </SortableContext>
            </DndContext>

            {isModalOpen && (
                <Modal onSubmit={addRecipes} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
};

export default MealSection;
