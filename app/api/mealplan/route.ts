import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { userId } = getAuth(req);
    
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const { date, mealPlanRecipes } = await req.json();

    try {
        const mealPlan = await db.mealPlan.create({
            data: {
                date: new Date(date),
                userId: userId,
                mealPlanRecipes: {
                    create: mealPlanRecipes,
                },
            },
        });

        return NextResponse.json(mealPlan, { status: 200 });
    } catch (error) {
        console.error("[MEAL_PLANS_POST]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { userId } = getAuth(req);
    
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        const mealPlans = await db.mealPlan.findMany({
            where: {
                userId
            },
            include: {
                mealPlanRecipes: {
                    include: {
                        recipe: true
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        console.log(mealPlans);

        return NextResponse.json(mealPlans, { status: 200 });
    } catch (error) {
        console.error("[MEAL_PLANS_GET]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { userId } = getAuth(req); // Extract user ID from Clerk authentication

    // Check if user is authenticated
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Extract the mealPlanId from the query parameters
    const { searchParams } = new URL(req.url);
    const mealPlanId = searchParams.get('mealPlanId');

    // Check if mealPlanId is provided
    if (!mealPlanId) {
        return NextResponse.json({ message: "Meal plan ID is required" }, { status: 400 });
    }

    try {
        // Attempt to delete the meal plan that belongs to the user
        const deletedMealPlan = await db.mealPlan.delete({
            where: {
                id: mealPlanId,
                userId: userId, // Ensure the meal plan belongs to the authenticated user
            },
        });

        // If no meal plan is found or deleted, return an error response
        if (!deletedMealPlan) {
            return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Meal plan deleted successfully!" }, { status: 200 });
    } catch (error) {
        console.error("[MEAL_PLAN_DELETE_ERROR]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}