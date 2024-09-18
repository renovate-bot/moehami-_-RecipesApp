import React from 'react';
import { ArticleWithTagsAndComments } from '@/types/types';
import Link from 'next/link';
import { formatDate } from '@/lib/functions';

interface ArticleCardProps {
    article: ArticleWithTagsAndComments;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
    return (
        <div className='border border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800'>
            {/* Article image - if an image is available */}
            <div></div>
            
            <div className='px-6 py-8 flex flex-col justify-between h-full'>
                <div>
                    {/* Article title + date */}
                    <div>
                        <h2 className='text-2xl'>{article.title}</h2>
                        <p className='text-xs my-2 dark:text-slate-400'>{formatDate(article.createdAt)}</p>
                    </div>

                    {/* Article tags */}
                    <div className='flex flex-wrap my-6 gap-2'>
                        {article.tags.map((tagArticle) => (
                            <span
                                key={tagArticle.tag.name}
                                className='px-3 py-2 bg-custom-orange text-[0.7rem] text-white rounded-full'
                            >
                                {tagArticle.tag.name}
                            </span>
                        ))}
                    </div>

                    {/* Article text */}
                    <p className='dark:text-slate-300 text-sm line-clamp-5'>{article.text}</p>
                </div>

                {/* Read more link */}
                <div className='mt-4'>
                    <Link className='block my-4 text-custom-orange' href={`/blog/${article.slug}`}>
                        Read more...
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;