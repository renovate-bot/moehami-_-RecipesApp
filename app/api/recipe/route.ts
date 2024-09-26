// Import necessary modules
import { db } from '@/lib/db';
import { StepType, CompositionType, ToolRecipeType, CategoryType } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {

    const {
        title,
        categoryId,
        preparationTime,
        difficulty,
        instructions,
        image,
        steps,
        compositions,
        tools,
    } : {
        title: string;
        categoryId: string;
        preparationTime: number;
        difficulty: number; // assuming it's initially string
        instructions: string;
        image: string;
        steps: StepType[]; // Adjust according to your step structure
        compositions: CompositionType[]; // Type for ingredients
        tools: ToolRecipeType[]; // Type for tools
    } = await req.json(); // Use await req.json() to parse the JSON body

    // Validate input data if necessary
    if (!title || !categoryId) {
        return new Response(JSON.stringify({ error: 'Title and categoryId are required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {

        const recipe = await db.recipe.create({
            data: {
                title,
                categoryId,
                preparationTime,
                difficulty,
                instructions,
                image,
                steps: {
                    create: steps,  // Create steps based on incoming data
                },
                // compositions: {
                //     create: ingredients,  // Create ingredients based on incoming data
                // },
                // toolsRecipe: {
                //     create: tools,  // Create tools based on incoming data
                // },
            },
        });

        return new Response(JSON.stringify(recipe), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });  // Respond with the created recipe
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create recipe' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
