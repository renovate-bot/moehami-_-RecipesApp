"use client"

import React, { useEffect, useState } from 'react'
import { ArticleWithTagsAndComments } from '@/types/types'
import ArticleCard from '@/components/ArticleCard'

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
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    )
}

export default BlogPage