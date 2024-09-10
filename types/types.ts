export interface IngredientType {
    id: string;
    name: string;
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
    category: { name: string };
    preparationTime: number;
    difficulty: number;
    instructions: string;
    compositions: CompositionType[]
}