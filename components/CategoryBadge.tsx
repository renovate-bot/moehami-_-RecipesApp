import React from 'react'

interface CategoryBadgeProps {
    categoryName: string
}

const CategoryBadge = ({ categoryName }: CategoryBadgeProps) => {

    const getCategoryColor = ( categoryName: string ) => {
        switch (categoryName.toLowerCase()) {
            case 'starter':
                return 'bg-green-600/60';
            case 'main':
                return 'bg-blue-600/60';  
            case 'dessert':
                return 'bg-pink-600/60';  
            default:
                return 'bg-gray-600'; 
        }
    };

    return (
        <p className={`text-white rounded-full mb-2 inline-block px-3 py-1 ${getCategoryColor(categoryName)}`}>{categoryName}</p>
    )
}

export default CategoryBadge