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

interface Recipe {
    id: string;
    title: string;
}

interface MealSectionProps {
    mealType: string;
    onRecipesUpdate: (mealType: string, recipes: Recipe[]) => void;
}

const SortableRecipeItem = ({ id, title, onDelete }: { id: string; title: string; onDelete: () => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '5px',
        background: 'none',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span>{title}</span>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }} 
                className="text-red-500 ml-2"
            >
                Delete
            </button>
        </div>
    );
};

const MealSection = ({ mealType, onRecipesUpdate }: MealSectionProps) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]); 
    const [isModalOpen, setModalOpen] = useState(false); 
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
    const { userId } = useAuth();

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

    const addRecipe = (recipe: Recipe) => {
        const newRecipe: Recipe = {
            id: recipe.id,
            title: recipe.title,
        };
        setRecipes((prev) => [...prev, newRecipe]);
        setModalOpen(false); 
    };

    const deleteRecipe = (id: string) => {
        setRecipes((prev) => prev.filter(recipe => recipe.id !== id)); 
    };

    useEffect(() => {
        console.log("Recipes updated:", recipes);
        onRecipesUpdate(mealType, recipes);
    }, [recipes, mealType, onRecipesUpdate]);

    return (
        <div className="meal-section">
            <h2 className="text-2xl font-bold">{mealType}</h2>
            <button onClick={() => setModalOpen(true)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
                Add Recipe
            </button>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext items={recipes.map(recipe => recipe.id)} strategy={verticalListSortingStrategy}>
                    {recipes.map((recipe) => (
                        <SortableRecipeItem 
                            key={recipe.id} 
                            id={recipe.id} 
                            title={recipe.title} 
                            onDelete={() => deleteRecipe(recipe.id)}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {isModalOpen && (
                <Modal onSubmit={addRecipe} onClose={() => setModalOpen(false)} />
            )}
        </div>
    );
};

export default MealSection;
