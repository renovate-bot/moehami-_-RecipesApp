import { format } from "date-fns"
import { jsPDF } from 'jspdf';
import { RecipeType } from '@/types/types'; // Make sure to adjust the import path based on your project structure

export function formatDate(date?: Date): string {
    if (!date) return 'Date not available';
    return format(new Date(date), 'MMMM do, yyyy HH:mm');
}

export const generatePDF = (recipe: RecipeType | null) => {
    if (!recipe) return;

    const pdf = new jsPDF();

    // Add the recipe title
    pdf.setFontSize(22);
    pdf.text(recipe.title, 10, 20);

    // Add the preparation time
    pdf.setFontSize(12);
    pdf.text(`Preparation time: ${recipe.preparationTime} min`, 10, 30);

    // Add the difficulty
    pdf.text(`Difficulty: ${recipe.difficulty}/5`, 10, 35);

    // Add ingredients
    pdf.setFontSize(16);
    pdf.text('Ingredients:', 10, 50);

    pdf.setFontSize(12);
    let yPosition = 60;
    recipe.compositions.forEach((composition) => {
        pdf.text(`${composition.ingredient.name} - ${composition.quantity} ${composition.measureUnity}`, 10, yPosition);
        yPosition += 5;
    });

    // Add instructions
    pdf.setFontSize(16);
    pdf.text('Instructions:', 10, yPosition + 10);

    pdf.setFontSize(12);
    let instructionsYPosition = yPosition + 20;
    const instructions = pdf.splitTextToSize(recipe.instructions, 180);
    pdf.text(instructions, 10, instructionsYPosition);

    // Save the PDF
    pdf.save(`${recipe.title}.pdf`);
};

