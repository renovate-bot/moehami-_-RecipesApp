// Import necessary modules
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET(req: NextRequest, { params }: { params: { categoryId: string, currentRecipeId: string } }) {
    
    const { categoryId, currentRecipeId } = params;
    
    try {
        
        // Fetch the total number of available recipes in this category, excluding the current one
        const availableRecipesCount = await db.recipe.count({
            where: {
                categoryId: categoryId,
                NOT: { id: currentRecipeId },  // Exclude the current recipe
            },
        });

        // Determine how many recipes we can take. If there are fewer than 3 available, take what's available
        const numberOfRecipesToFetch = Math.min(3, availableRecipesCount);

        // If there are no recipes to suggest, return an empty array
        if (numberOfRecipesToFetch === 0) {
            return NextResponse.json([]);
        }

        // Randomly skip recipes if more than 1 recipe is available
        const skipValue = availableRecipesCount > 1 
            ? Math.floor(Math.random() * (availableRecipesCount - numberOfRecipesToFetch)) 
            : 0;

        // Fetch the random suggestions
        const suggestions = await db.recipe.findMany({
            take: numberOfRecipesToFetch, 
            skip: skipValue,
            where: {
                categoryId: categoryId,
                NOT: { id: currentRecipeId },  // Exclude the current recipe
            },
            include: {
                category: true,
            },
        });

        // Return JSON response with the sorted list of recipes
        return NextResponse.json(suggestions);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[SUGGESTIONS]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
