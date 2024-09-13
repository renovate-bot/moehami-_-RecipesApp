// Import necessary modules
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET(req: NextRequest, { params }: { params: { recipeId: string } }) {
    
    const { recipeId } = params;
    
    try {
        // Fetch recipe from the database
        const recipe = await db.recipe.findUnique({
            where: {
                id: recipeId
            },
            include: {
                comments: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                category: true,
                compositions: {
                    include: {
                        ingredient: true
                    }
                }
            }
        });

        // Return JSON response with the sorted list of recipes
        return NextResponse.json(recipe);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[RECIPE]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
