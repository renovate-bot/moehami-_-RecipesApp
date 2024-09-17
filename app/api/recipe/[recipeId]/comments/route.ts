import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';

// Define a POST function that handles incoming requests
export async function POST(req: NextRequest, { params }: { params: { recipeId: string } }) {
    
    const { recipeId } = params;

    try {
        const { text } = await req.json();

        const sanitizedText = sanitizeHtml(text, {
            allowedTags: [], // Disable any HTML tags if don't want any HTML in the comments
            allowedAttributes: {}
        });

        // Create a new comment in the database
        const newComment = await db.comment.create({
            data: {
                text: sanitizedText,
                recipeId: recipeId,
                userId: 'user_add',
            },
        });

        console.log(newComment);

        // Fetch updated list of comments for the recipe
        const updatedComments = await db.comment.findMany({
            where: {
                recipeId: recipeId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Return JSON response with the updated list of comments
        return NextResponse.json(updatedComments);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[COMMENT]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}