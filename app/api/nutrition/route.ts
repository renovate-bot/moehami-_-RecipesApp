// Import necessary modules
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET(req: NextRequest, { params }: { params: { ingredientsString: string } }) {
        
    const { searchParams } = new URL(req.url);
    const ingredientsString = searchParams.get('ingredientsString');
    const apiKey = process.env.EDAMAM_API_KEY;
    const apiId = process.env.EDAMAM_API_ID;

    if (!ingredientsString) {
        return NextResponse.json({ error: 'Missing ingredients string' }, { status: 400 });
    }

    try {
        // Fetch nutritional information from Edamam API
        const response = await fetch(
            `https://api.edamam.com/api/nutrition-data?app_id=${apiId}&app_key=${apiKey}&nutrition-type=cooking&ingr=${ingredientsString}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch nutritional information");
        }

        const data = await response.json();

        // Return JSON response with nutritional information
        return NextResponse.json(data);

    } catch (error) {
        // Log any errors that occur during the execution
        console.error("[NUTRITION]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
