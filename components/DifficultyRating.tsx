import { GaugeIcon, StarHalf } from 'lucide-react';

const DifficultyRating = ({ rating }: { rating: number }) => {

    const getDifficultyColor = (level: number) => {
    switch (true) {
        case (level === 5):
            return 'text-red-500'; 
        case (level >= 3):
            return 'text-orange-500';  
        default:
            return 'text-green-500'; 
    }
    };

    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {/* Render filled stars */}
            {[...Array(filledStars)].map((_, index) => (
                <GaugeIcon key={index} className={`w-6 h-6 ${getDifficultyColor(rating)}`} />
            ))}

            {/* Render half star if applicable */}
            {hasHalfStar && <StarHalf className="w-6 h-6 text-yellow-500" />}

            {/* Render empty stars */}
            {[...Array(emptyStars)].map((_, index) => (
                <GaugeIcon key={index} className="w-6 h-6 text-slate-300" />
            ))}
        </div>
    );
};

export default DifficultyRating;