import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

    if (!req.url) {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        const user = await clerkClient().users.getUser(userId as string);
        console.log(user)
        return NextResponse.json({ avatarUrl: user.imageUrl }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user avatar:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}