import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

// GET method to fetch meal plans for a logged-in user
export async function GET(req: NextRequest) {
    const { userId } = getAuth(req);

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        // Fetch meal plans for the logged-in user
        const mealPlans = await db.mealPlan.findMany({
            where: { userId },
            include: {
                recipes: true,
            },
        });

        return NextResponse.json(mealPlans, { status: 200 });
    } catch (error) {
        console.error("[MEAL_PLANS_GET]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// POST method to create a new meal plan for a logged-in user
export async function POST(req: NextRequest) {
    const { userId } = getAuth(req);
    
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const { date, starterId, mainId, dessertId } = await req.json();

    if (!date || !starterId || !mainId || !dessertId) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    try {
        // Create a new meal plan for the logged-in user
        const newMealPlan = await db.mealPlan.create({
        data: {
            date: new Date(date),
            userId,
        },
        });

        return NextResponse.json(newMealPlan, { status: 201 });
    } catch (error) {
        console.error("[MEAL_PLANS_POST]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
