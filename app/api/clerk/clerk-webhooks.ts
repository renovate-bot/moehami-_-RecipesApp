import { db } from '@/lib/db'; // Import Prisma client
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

// Handler for Clerk webhook events
export async function POST(req: NextRequest) {
    try {
        const event = await req.json(); // Parse JSON from the incoming request

        // Handle 'user.created' event
        if (event.type === 'user.created') {
        const { id, email_addresses } = event.data;

        const defaultPassword = await bcrypt.hash('', 10);

        // Create user in the database
        await db.user.create({
            data: {
                clerkId: id, // Clerk user ID
                email: email_addresses[0].email_address, // Main email address
                password: defaultPassword,
            },
        });

        // Return a success response
        return NextResponse.json({ message: 'User created' });
        
        // Handle 'user.updated' event
        } else if (event.type === 'user.updated') {
            const { id, email_addresses } = event.data;

            // Update user in the database
            await db.user.update({
                where: { clerkId: id },
                data: {
                    email: email_addresses[0].email_address,
                },
            });

            // Return a success response
            return NextResponse.json({ message: 'User updated' });
            
        // Unhandled event type
        } else {
            return NextResponse.json({ message: 'Unhandled event type' }, { status: 400 });
        }

    } catch (error) {
        // Log the error and return a 500 status
        console.error('Error handling Clerk webhook:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Handle methods other than POST
export function GET() {
    return new NextResponse('Method Not Allowed', { status: 405 });
}
