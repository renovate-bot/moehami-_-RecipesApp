import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

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
                mealPlanRecipes: {
                    include: {
                        recipe: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
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

    if (!date || (!starterId && !mainId && !dessertId)) {
        return NextResponse.json({ message: "Date and at least one recipe ID are required" }, { status: 400 });
    }

    try {
        // Create a new meal plan for the logged-in user
        const newMealPlan = await db.mealPlan.create({
            data: {
                date: new Date(date),
                userId,
            },
        });

        // Prepare an array of MealPlanRecipe entries
        const mealPlanRecipes = [];

        if (starterId) {
            mealPlanRecipes.push({
                mealPlanId: newMealPlan.id,
                recipeId: starterId,
            });
        }
        if (mainId) {
            mealPlanRecipes.push({
                mealPlanId: newMealPlan.id,
                recipeId: mainId,
            });
        }
        if (dessertId) {
            mealPlanRecipes.push({
                mealPlanId: newMealPlan.id,
                recipeId: dessertId,
            });
        }

        // Create MealPlanRecipe entries
        await Promise.all(mealPlanRecipes.map(recipe => {
            return db.mealPlanRecipe.create({
                data: recipe,
            });
        }));

        return NextResponse.json(newMealPlan, { status: 201 });
    } catch (error) {
        console.error("[MEAL_PLANS_POST]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
