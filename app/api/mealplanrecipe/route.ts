import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { userId } = getAuth(req);
    
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const { mealPlanId, recipeId, mealType, order } = await req.json();

    try {
        const newMealPlanRecipe = await db.mealPlanRecipe.create({
            data: {
                mealPlanId,
                recipeId,
                mealType,
                order,
            },
        });

        return NextResponse.json(newMealPlanRecipe, { status: 200 });
    } catch (error) {
        console.error("[MEAL_PLANS_POST]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { userId } = getAuth(req);
    
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const { mealPlanRecipeId } = await req.json();

    try {
        await db.mealPlanRecipe.delete({
            where: { id: mealPlanRecipeId },
        });

        return NextResponse.json({ message: "Recipe deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("[MEAL_PLANS_DELETE]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { userId } = getAuth(req);
    
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const { mealPlanRecipeId, mealType, order } = await req.json();

    try {
        const updatedRecipe = await db.mealPlanRecipe.update({
            where: { id: mealPlanRecipeId },
            data: {
                mealType,
                order,
            },
        });

        return NextResponse.json(updatedRecipe, { status: 200 });
    } catch (error) {
        console.error("[MEAL_PLANS_UPDATE]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
    