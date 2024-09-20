import { clerkClient } from '@clerk/nextjs/server'; // Import the Clerk client for server-side operations
import { NextRequest, NextResponse } from 'next/server'; // Import request and response types for Next.js API

export async function GET(req: NextRequest) {
    // Check if the request URL is valid
    if (!req.url) {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 }); // Respond with error if the URL is invalid
    }

    // Parse the URL to extract search parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // Get the userId from the query parameters

    // Check if userId is provided
    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 }); // Respond with error if userId is missing
    }

    try {
        // Fetch the user information from Clerk using the userId
        const user = await clerkClient().users.getUser(userId as string);
        
        // Respond with the user's avatar URL
        return NextResponse.json({ avatarUrl: user.imageUrl }, { status: 200 });
    } catch (error) {
        // Log any errors encountered while fetching the user
        console.error('Error fetching user avatar:', error);
        // Respond with a server error status
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}