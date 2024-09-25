import React from 'react';
import { Quote as QuoteIcon } from 'lucide-react'; // Import the Quote icon

interface QuoteProps {
    text: string;
    author?: string;
}

const Quote = ({ text, author }: QuoteProps) => {
    return (
        <blockquote className="relative border-l-4 border-custom_orange pl-6 italic my-8 bg-slate-100 dark:bg-slate-800 p-6 rounded-md shadow-md">
            {/* Opening quote icon */}
            <QuoteIcon 
                size={40} 
                className="absolute text-custom_orange -top-4 -left-5"
            />
            
            {/* Quote text */}
            <p className="text-xl font-thin dark:text-slate-400">“{text}”</p>
            
            {/* Quote author */}
            {author && <footer className="mt-2 text-right text-gray-600">— {author}</footer>}
            
            {/* Closing quote icon (rotated) */}
            <QuoteIcon 
                size={40} 
                className="absolute text-custom_orange -bottom-4 -right-5 transform rotate-180"
            />
        </blockquote>
    );
};

export default Quote;
