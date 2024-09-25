"use client"

import { ArticleWithTagsAndComments } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { formatDate } from '@/lib/functions'
import SectionHeader from '@/components/SectionHeader'
import { MessageSquareQuoteIcon, NotebookTextIcon } from 'lucide-react'
import Quote from '@/components/Quote'
import ArticleAuthor from '@/components/ArticleAuthor'
import CommentCard from '@/components/CommentCard'

import Image from 'next/image';

const ArticlePage = ({ params } : { params: { articleSlug: string }}) => {

    const [article, setArticle] = useState<ArticleWithTagsAndComments | null>(null)

    useEffect(() => {
        const fetchArticle = async () => {
            const response = await fetch(`/api/article/${params.articleSlug}`)
            const data: ArticleWithTagsAndComments | null = await response.json()
            setArticle(data)
        }

        fetchArticle()
    }, [params.articleSlug])

    const handleDelete = () => {

    }

    return (
        <section>
        {article ? (
        <>
            <div className='flex flex-col justify-center items-center p-6 h-[350px] w-full  relative rounded-md overflow-hidden bg-slate-300 dark:bg-transparent'>
                
                {/* Image background */}
                <div className='absolute inset-0'>
                    <Image 
                        src='https://res.cloudinary.com/dr3qz5dk3/image/upload/v1726650634/abstract-wave-background-minimal-white-geometric-wallpaper-free-png_z3nwwo.webp'
                        alt='Watermark Image'
                        layout='fill'
                        objectFit='cover'
                        className='opacity-50 dark:opacity-10'
                    />
                </div>
                {/* Content */}
                <div className='relative z-10 text-center'>
                    <div className='flex justify-center flex-wrap my-6 gap-2'>
                        {article?.tags.map((tagArticle) => (
                            <span 
                                className='px-3 py-2 bg-custom-orange text-[0.7rem] text-white rounded-full'
                                key={tagArticle.tag.name}
                            >
                                {tagArticle.tag.name}
                            </span>    
                        ))}
                    </div>
                    <h1 className='text-4xl mb-5 text-center'>{article?.title}</h1>
                    <p className='text-sm'>{formatDate(article?.createdAt ? new Date(article.createdAt) : undefined)}</p>
                </div>
            </div>

            <div className='flex flex-col w-full p-6 md:px-[10%]'>
                <SectionHeader icon={NotebookTextIcon} title="Introduction" />
                <div className='flex-col w-full'>
                    <p className='font-thin'>{article.text}</p>
                </div>
                <Quote text="Arrange whole nuts and ginger around top edge of cake. Chill 40 Minutes. (Can be made 1 day ahead. Cover with cake dome and chill. Let stand at room temperature 1 hour before serving.)" author='admin' />
            </div>
            {/* Section author */}
            <ArticleAuthor
                name="John Doe"
                bio="Mindfulness coach, writer, and speaker."
                avatarUrl="https://res.cloudinary.com/dr3qz5dk3/image/upload/v1726580432/png-transparent-avatar-computer-icons-blog-management-sina-weibo-avatar-woman-couch-cleaning-business-thumbnail_mxxhyp.webp" // Replace with actual avatar URL
                publishedDate="September 17, 2024"
            />

            <SectionHeader icon={MessageSquareQuoteIcon} title="Comments" count={article.comments.length} />
            {article.comments.length > 0 ? (
                <div className='flex flex-col gap-3'>
                    {article.comments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <p className='text-xs text-slate-400'>No comments</p>
            )}
        </>
        ) : (
            <p>Loading...</p>
        )}

        </section>
    )
}

export default ArticlePage