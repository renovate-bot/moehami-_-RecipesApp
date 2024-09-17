"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { ArticleWithTagsAndComments } from '@/types/types'
import { formatDate } from '@/lib/functions'
import Link from 'next/link'


export const dynamic = 'force-dynamic' 

const BlogPage = () => {

    const [articles, setArticles] = useState<ArticleWithTagsAndComments[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        try {
            const fetchArticles = async () => {
                const response = await fetch('/api/article') 
                const data: ArticleWithTagsAndComments[] = await response.json()
                setArticles(data)
            }

            fetchArticles()
        } catch (error) {
            console.error(error)   
        }
        finally {
            setLoading(false)
        }
    },[])
    
    return (
        <div>
            <h1 className='text-4xl font-bold mb-5'>Blog</h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                {articles.map((article) => (
                    <div 
                        key={article.id} 
                        className='border border-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800'
                    >
                        {/* Article image */}
                        <div></div>
                        <div className='px-6 py-8 flex flex-col justify-between h-full'>
                            <div>
                                <div>
                                    {/* Article title + date */}
                                    <h2 className='text-2xl'>{article.title}</h2>
                                    <p className='text-xs my-2 dark:text-slate-400'>{formatDate(article.createdAt)}</p>
                                </div>
                                <div className='flex flex-wrap my-6 gap-2'>
                                    {article.tags.map((tagArticle) => (
                                        <span 
                                            className='px-3 py-2 bg-[#f26b5a] text-[0.7rem] text-white rounded-full'
                                            key={tagArticle.tag.name}
                                        >
                                            {tagArticle.tag.name}
                                        </span>    
                                    ))}
                                </div>
                                {/* Article text */}
                            </div>
                            {/* Read more */}
                            <div>
                                <div className=''>
                                    <p className='dark:text-slate-300 text-sm line-clamp-5'>{article.text}</p>
                                </div>
                                <Link className='block my-4' href={`/article/${article.slug}`}>
                                    Read more...
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BlogPage