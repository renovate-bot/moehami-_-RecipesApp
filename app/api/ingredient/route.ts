import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET() {
    try {
        // Fetch ingredients from the database
        const ingredients = await db.ingredient.findMany({
            orderBy: {
                name: 'asc'
            },
        });

        // Return JSON response with the sorted list of ingredients
        return NextResponse.json(ingredients);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[INGREDIENTS]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
