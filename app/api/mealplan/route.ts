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
            }
        });

        console.log(mealPlans);

        return NextResponse.json(mealPlans, { status: 200 });
    } catch (error) {
        console.error("[MEAL_PLANS_GET]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}