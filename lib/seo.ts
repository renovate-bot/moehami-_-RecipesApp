// utils/seo.ts
export const setSEOAttributes = (title: string, description: string) => {
    // Update the document title
    document.title = title;

    // Update the meta description, or create it if it doesn't exist
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

    if (metaDescription) {
        metaDescription.content = description; // Update the description content
    } else {
        // Create and append the meta description tag if it doesn't exist
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
    }
};
