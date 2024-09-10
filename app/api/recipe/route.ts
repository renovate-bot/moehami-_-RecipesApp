// Import necessary modules
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET() {
    try {
        // Fetch recipes from the database
        const recipes = await db.recipe.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                comments: true,
                category: true,
                compositions: {
                    include: {
                        ingredient: true
                    }
                }
            }
        });

        // Return JSON response with the sorted list of recipes
        return NextResponse.json(recipes);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[RECIPES]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
