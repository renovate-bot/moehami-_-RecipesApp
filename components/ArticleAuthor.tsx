// components/AuthorCard.tsx
import React from 'react';

interface ArticleAuthorProps {
    name: string;
    bio?: string;
    avatarUrl: string;
    publishedDate?: string;
}

const ArticleAuthor = ({ name, bio, avatarUrl, publishedDate }: ArticleAuthorProps) => {
    return (
        <div className="flex items-center bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md my-8">
        <img 
            src={avatarUrl} 
            alt={name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">{name}</h3>
            {bio && <p className="text-sm text-gray-600 dark:text-slate-400">{bio}</p>}
            {publishedDate && (
            <p className="text-sm text-gray-500 dark:text-slate-500">
                Published on {publishedDate}
            </p>
            )}
        </div>
        </div>
    );
};

export default ArticleAuthor;
