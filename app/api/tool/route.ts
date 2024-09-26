import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET() {
    try {
        // Fetch tools from the database
        const tools = await db.tool.findMany({
            orderBy: {
                name: 'asc'
            },
        });

        // Return JSON response with the sorted list of tools
        return NextResponse.json(tools);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[TOOLS]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
