// Import necessary modules
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET() {
    try {
        // Fetch articles from the database
        const articles = await db.article.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                comments: true
            }
        }) 

        // Return JSON response with the sorted list of recipes
        return NextResponse.json(articles);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[ARTICLES]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
