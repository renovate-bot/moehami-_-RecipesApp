import { format } from "date-fns"

export function formatDate(date?: Date): string {
    if (!date) return 'Date not available';
    return format(new Date(date), 'MMMM do, yyyy HH:mm');
}
