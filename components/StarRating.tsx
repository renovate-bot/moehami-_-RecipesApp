import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {/* Render filled stars */}
            {[...Array(filledStars)].map((_, index) => (
                <Star key={index} className="w-6 h-6 text-yellow-500" />
            ))}

            {/* Render half star if applicable */}
            {hasHalfStar && <StarHalf className="w-6 h-6 text-yellow-500" />}

            {/* Render empty stars */}
            {[...Array(emptyStars)].map((_, index) => (
                <Star key={index} className="w-6 h-6 text-slate-300" />
            ))}
        </div>
    );
};

export default StarRating;