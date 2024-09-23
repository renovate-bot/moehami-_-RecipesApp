import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Define a GET function that handles incoming requests with a category query
export async function GET(req: Request) {
    // Parse the query parameters from the request
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    if (!category) {
        // If no category is provided, return a bad request response
        return new NextResponse('Category is required', { status: 400 });
    }

    try {
        // Fetch recipes by category from the database
        const recipes = await db.recipe.findMany({
            where: {
                category: {
                    name: {
                        equals: category, // Match category name
                        mode: 'insensitive', // Case-insensitive search
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                comments: true,
                category: true,
                compositions: {
                include: {
                    ingredient: true,
                },
                },
            },
        });

        // If no recipes are found, return a 404 response
        if (recipes.length === 0) {
        return new NextResponse('No recipes found for this category', { status: 404 });
        }

        // Return the filtered recipes in JSON format
        return NextResponse.json(recipes);

    } catch (error) {
        console.log('[CATEGORY_RECIPES]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
