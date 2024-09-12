export interface IngredientType {
    id: string;
    name: string;
    image: string;
}

export interface CompositionType {
    id: string;
    ingredient: IngredientType;
    quantity: number;
    measureUnity: string;
}

export interface RecipeType {
    id: string;
    title: string;
    category: { id: string, name: string };
    preparationTime: number;
    difficulty: number;
    instructions: string;
    image: string;
    compositions: CompositionType[]
    isHealthy: boolean;
    isVegan: boolean;
}