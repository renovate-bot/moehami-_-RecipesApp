"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the schema using Zod
const formSchema = z.object({
    text: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters." })
    .regex(/^[^<>]*$/, "Comment does not contain HTML tags"),
});

// Define the form's data type based on Zod schema
type FormData = z.infer<typeof formSchema>;

// Props for the CommentForm component
interface CommentFormProps {
  onSubmit: (data: FormData) => void;  // Callback to handle form submission
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),  // Apply Zod schema for validation
        defaultValues: { text: "" },        // Default empty comment text
    });

    const handleFormSubmit = (data: FormData) => {
        onSubmit(data);  // Trigger parent's submit handler
        reset();         // Reset form after submission
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
            <Controller
                name="text"
                control={control}
                render={({ field }) => (
                <textarea
                    {...field}
                    placeholder="Write your comment here..."
                    rows={4}
                    className="p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition duration-300"
                />
                )}
            />
            
            {/* Error Message */}
            {errors.text && (
                <div className="text-red-500">
                <p>{errors.text.message}</p>
                </div>
            )}

            <button
                type="submit"
                className="self-start bg-custom_orange/80 text-white px-4 py-2 rounded-lg hover:bg-custom_orange transition duration-300"
            >
                Post Comment
            </button>
        </form>
    );
};

export default CommentForm;
