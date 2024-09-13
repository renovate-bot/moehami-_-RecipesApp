"use client"

import React, { useEffect, useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    // Debounce search to avoid making too many API requests while typing
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim().length === 0) {
                // Fetch all recipes if the query is empty
                onSearch('');
            } else if (query.trim().length >= 3) {
                // Perform the search if query is at least 3 characters
                onSearch(query.trim());
                setLoading(true);
            }
        }, 300); // 300ms debounce delay

        // Cleanup the timeout when query changes or component unmounts
        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className="search-bar">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search for recipes... (at least 3 characters)"
                className="w-full px-5 py-3 rounded-lg border dark:bg-slate-800 border-gray-300 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-200 transition duration-300 shadow-sm text-lg mb-4"
            />
        </div>
    );
};

export default SearchBar;