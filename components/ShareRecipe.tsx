import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

interface ShareRecipeProps {
    recipeTitle: string;
}

const ShareRecipe = ({ recipeTitle }: ShareRecipeProps) => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Function to share the recipe on Facebook
    const shareOnFacebook = () => {
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
    };

    // Function to copy the recipe link for sharing on Instagram or anywhere
    const copyRecipeLink = () => {
        navigator.clipboard.writeText(currentUrl);
        alert('Recipe link copied to clipboard!');
    };

    return (
        <div className="flex flex-col my-10">
            <h2 className="text-lg font-bold mb-4">Share this Recipe</h2>
            <div className="flex gap-4">
                {/* Facebook Share Button */}
                <button
                    aria-label='Facebook'
                    onClick={shareOnFacebook}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
                    >
                    <Facebook />
                </button>

                {/* Instagram Link Button (Copy Link) */}
                <button
                    aria-label='Instagram'
                    onClick={copyRecipeLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-all"
                >
                    <Instagram />
                </button>
            </div>
        </div>
    );
};

export default ShareRecipe;