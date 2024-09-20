import { db } from '@/lib/db'; 
import { NextRequest, NextResponse } from 'next/server';

// Define a GET function that handles incoming requests
export async function GET(req: NextRequest, { params }: { params: { ingredientsString: string } }) {
    // Extract search parameters from the request URL
    const { searchParams } = new URL(req.url);
    const ingredientsString = searchParams.get('ingredientsString'); // Get the ingredients string from the query parameters
    const apiKey = process.env.EDAMAM_API_KEY; // Retrieve Edamam API key from environment variables
    const apiId = process.env.EDAMAM_API_ID; // Retrieve Edamam API ID from environment variables

    // Check if the ingredientsString is provided
    if (!ingredientsString) {
        return NextResponse.json({ error: 'Missing ingredients string' }, { status: 400 }); // Respond with an error if missing
    }

    try {
        // Fetch nutritional information from Edamam API
        const response = await fetch(
            `https://api.edamam.com/api/nutrition-data?app_id=${apiId}&app_key=${apiKey}&nutrition-type=cooking&ingr=${ingredientsString}`,
            {
                method: "GET", // Specify the method as GET
                headers: {
                    "Content-Type": "application/json", // Set content type for the request
                },
            }
        );

        // Check if the response is okay
        if (!response.ok) {
            throw new Error("Failed to fetch nutritional information"); // Throw an error if the response is not okay
        }

        const data = await response.json(); // Parse the response JSON

        // Return JSON response with nutritional information
        return NextResponse.json(data);

    } catch (error) {
        // Log any errors that occur during the execution
        console.error("[NUTRITION]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}