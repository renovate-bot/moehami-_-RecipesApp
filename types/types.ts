export interface NutritionalInfoType {
    calories: number; // Total calories
    totalNutrients: {
        [key: string]: Nutrient;
    };
    totalDaily: {
        [key: string]: Nutrient;
    };
}

export interface TotalNutrientType {
    label: string;
    quantity: number;
    unit: string;
}

export interface TotalDailyType {
    label: string;
    quantity: number;
    unit: string;
}

export interface Nutrient {
    label: string;
    quantity: number;
    unit: string;
}

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

export interface CommentType {
    id: string;
    text: string;
    userId: string;
    createdAt: Date;
}

export interface StepType {
    id: string;
    number: number;
    description: string;
}

export interface ToolType {
    id: string;
    name: string;
    image: string;
}

export interface ToolRecipeType {
    id: string;
    tool: ToolType;
    recipe: RecipeType;
    quantity: number;
}

export interface RecipeType {
    id: string;
    title: string;
    category: { id: string, name: string };
    preparationTime: number;
    difficulty: number;
    instructions: string;
    image: string;
    compositions: CompositionType[];
    comments: CommentType[];
    isHealthy: boolean;
    isVegan: boolean;
    steps: StepType[];
    toolsRecipe: ToolRecipeType[];
    nutritionalInfo?: NutritionalInfoType;
    mealPlanRecipes?: { id: string; recipe: RecipeType; mealType: string};
}

export interface CategoryType {
    id: string;
    name: string;
}

export interface TagType {
    id: string;
    name: string;
}

export interface TagArticleType {
    id: string;
    tag: TagType;
}

export interface ArticleCommentType {
    id: string;
    text: string;
    userId: string;
    createdAt: Date;
}

export interface ArticleWithTagsAndComments {
    id: string;
    title: string;
    text: string;
    slug: string;
    createdAt: Date;
    tags: TagArticleType[];
    comments: ArticleCommentType[];
}

export interface MealPlan {
    id: string;
    date: Date;
    mealPlanRecipes: MealPlanRecipe[];
}

export interface MealPlanRecipe {
    id: string;
    mealType: string;
    recipe: RecipeType;
}