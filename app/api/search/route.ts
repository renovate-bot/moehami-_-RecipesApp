import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query || typeof query !== 'string') {
        return NextResponse.json({ message: "Query must be a string" }, { status: 400 });
    }

    try {
        // Perform case-insensitive search on recipe title
        const recipes = await db.recipe.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive' // Case-insensitive search
                }
            },
            include: {
                comments: true,
                category: true,
                compositions: {
                    include: {
                        ingredient: true
                    }
                }
            }
        });

        return NextResponse.json(recipes);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
