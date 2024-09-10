// `prisma/seed.ts`

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Créer des catégories de recettes
    const entreeCategory = await prisma.category.create({
        data: {
            name: 'Starter',
        },
    });

    const mainCourseCategory = await prisma.category.create({
        data: {
            name: 'Main',
        },
    });

    const dessertCategory = await prisma.category.create({
        data: {
            name: 'Dessert',
        },
    });

    // 2. Créer des ingrédients
    const flour = await prisma.ingredient.create({
        data: {
            name: 'Flour',
        },
    });

    const sugar = await prisma.ingredient.create({
        data: {
            name: 'Sugar',
        },
    });

    const butter = await prisma.ingredient.create({
        data: {
            name: 'Butter',
        },
    });

    const chickenBreast = await prisma.ingredient.create({
        data: {
            name: 'Chicken Breast',
        },
    });

    const oliveOil = await prisma.ingredient.create({
        data: {
            name: 'Olive Oil',
        },
    });

  // 3. Créer des recettes
    const chocolateCake = await prisma.recipe.create({
        data: {
            title: 'Chocolate Cake',
            preparationTime: 60,
            instructions: 'Mix the flour, sugar, and butter. Add eggs and bake at 180°C for 30 minutes.',
            difficulty: 3,
            categoryId: dessertCategory.id,
            compositions: {
                create: [
                {
                    ingredientId: flour.id,
                    quantity: 200,
                    measureUnity: 'grams',
                },
                {
                    ingredientId: sugar.id,
                    quantity: 100,
                    measureUnity: 'grams',
                },
                {
                    ingredientId: butter.id,
                    quantity: 150,
                    measureUnity: 'grams',
                },
                ],
            },
        },
    });

    const caesarSalad = await prisma.recipe.create({
        data: {
            title: 'Caesar Salad',
            preparationTime: 20,
            instructions: 'Mix lettuce, grilled chicken breast, croutons, and Caesar dressing.',
            difficulty: 2,
            categoryId: entreeCategory.id,
            compositions: {
                create: [
                {
                    ingredientId: chickenBreast.id,
                    quantity: 1,
                    measureUnity: 'piece',
                },
                {
                    ingredientId: oliveOil.id,
                    quantity: 50,
                    measureUnity: 'milliliters',
                },
                ],
            },
        },
    });

    const roastChicken = await prisma.recipe.create({
        data: {
            title: 'Roast Chicken',
            preparationTime: 90,
            instructions: 'Rub the chicken with olive oil, salt, and roast for 1.5 hours at 200°C.',
            difficulty: 4,
            categoryId: mainCourseCategory.id,
            compositions: {
                create: [
                {
                    ingredientId: chickenBreast.id,
                    quantity: 2,
                    measureUnity: 'pieces',
                },
                {
                    ingredientId: oliveOil.id,
                    quantity: 30,
                    measureUnity: 'milliliters',
                },
                ],
            },
        },
    });

  // 4. Ajouter des commentaires pour une recette
    await prisma.comment.create({
        data: {
            text: 'This chocolate cake was amazing!',
            recipeId: chocolateCake.id,
            userId: 'user_123',  // Remplace par l'ID utilisateur
        },
    });

    await prisma.comment.create({
        data: {
            text: 'The Caesar salad was fresh and delicious!',
            recipeId: caesarSalad.id,
            userId: 'user_124',
        },
    });

    await prisma.comment.create({
        data: {
            text: 'The roast chicken was a bit dry, but still tasty.',
            recipeId: roastChicken.id,
            userId: 'user_125',
        },
    });
}

main()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
