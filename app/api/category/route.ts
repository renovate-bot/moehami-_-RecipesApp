import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET() {
    try {
        // Fetch categories from the database
        const categories = await db.category.findMany({
            orderBy: {
                id: 'asc'
            },
        });

        // Return JSON response with the sorted list of recipes
        return NextResponse.json(categories);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[CATEGORIES]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
