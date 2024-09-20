"use client"

import React, { useEffect, useState } from 'react';
import { Trash2 as TrashIcon, UserCircle as UserCircleIcon } from 'lucide-react';
import { useUser } from "@clerk/nextjs"; // Import useUser hook
import Image from 'next/image';

interface CommentCardProps {
    comment: {
        id: string;
        userId: string;
        createdAt: Date;
        text: string;
        username?: string;
    };
    onDelete: (id: string) => void;
}

const fetchAvatar = async (userId: string) => {
    // Check if userId is defined
    if (!userId) {
        console.error('User ID is required');
        return null; // or handle it as you prefer
    }

    try {
        const response = await fetch(`/api/clerk/avatar/?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch avatar');
        }

        const data = await response.json();
        return data.avatarUrl;
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return null; // or handle the error as needed
    }
};

const CommentCard = ({ comment, onDelete }: CommentCardProps) => {

    const { user } = useUser(); // Get the currently logged-in user
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        const getAvatar = async () => {
            const url = await fetchAvatar(comment.userId);
            if (url) {
                setAvatarUrl(url);
            }
        };

        // Only call getAvatar if comment.userId is defined
        if (comment.userId) {
            getAvatar();
        }
    }, [comment.userId]);

    const isAuthor = user?.id === comment.userId;

    return (
        <div className="relative flex flex-col sm:flex-row sm:justify-between p-6 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-shadow duration-300">
            {/* User info and comment details */}
            <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2 text-slate-500 dark:text-slate-400">
                {avatarUrl ? (
                    <Image width={100} height={100} src={avatarUrl} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                    <UserCircleIcon className="h-8 w-8 text-custom-orange/60" />
                )}
                    <p className="font-semibold text-sm">{comment?.username}</p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                    {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-base">
                    {comment.text}
                </p>
            </div>
            
            {/* Delete button */}
            {isAuthor && (
                <div className="flex items-center ml-0 sm:ml-4 mt-4 sm:mt-0">
                    <button
                        className="flex items-center px-4 py-2 text-white bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition duration-300"
                        onClick={() => onDelete(comment.id)}
                    >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentCard;
