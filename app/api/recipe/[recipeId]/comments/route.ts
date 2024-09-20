import { db } from '@/lib/db';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import sanitizeHtml from 'sanitize-html';

// Define a POST function that handles incoming requests
export async function POST(req: NextRequest, { params }: { params: { recipeId: string } }) {
    
    const { recipeId } = params;
    const { userId } = getAuth(req);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { text } = await req.json();

        const sanitizedText = sanitizeHtml(text, {
            allowedTags: [], // Disable any HTML tags if don't want any HTML in the comments
            allowedAttributes: {}
        });

        // Get Clerk user informations
        const user = await clerkClient().users.getUser(userId);
        const username = user.firstName ? user.firstName : user.username;

        // Vérifier que le nom d'utilisateur n'est pas null
        if (!username) {
            return NextResponse.json({
                error: 'Please set a username to comment.',
                instructions: 'You can set your username in your profile settings.'
            }, { status: 400 });
        }

        // Create a new comment in the database
        const newComment = await db.comment.create({
            data: {
                text: sanitizedText,
                recipeId: recipeId,
                userId: userId,
                username: username, 
            },
        });

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