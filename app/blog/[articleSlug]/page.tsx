"use client"

import { ArticleWithTagsAndComments } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { formatDate } from '@/lib/functions'
import SectionHeader from '@/components/SectionHeader'
import { MessageSquareQuoteIcon, NotebookTextIcon, Trash2Icon, UserCircleIcon } from 'lucide-react'
import Quote from '@/components/Quote'
import ArticleAuthor from '@/components/ArticleAuthor'

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

    return (
        <div>
        {article ? (
        <>
            <div className='flex flex-col justify-center items-center p-6 h-[350px] w-full bg-slate-200 dark:bg-slate-800'>
            <div className='flex flex-wrap my-6 gap-2'>
                {article?.tags.map((tagArticle) => (
                    <span 
                        className='px-3 py-2 bg-[#f26b5a] text-[0.7rem] text-white rounded-full'
                        key={tagArticle.tag.name}
                    >
                        {tagArticle.tag.name}
                    </span>    
                ))}
            </div>
            <h1 className='text-4xl mb-5 text-center'>{article?.title}</h1>
            <p className='text-sm'>{formatDate(article?.createdAt ? new Date(article.createdAt) : undefined)}</p>
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
                        <div key={comment.id} className='flex flex-col sm:flex-row sm:justify-between p-8 rounded-lg border border-slate-300 dark:border-slate-700'>
                            <div>
                                <div className='flex space-x-2 text-slate-400'> 
                                    <UserCircleIcon />
                                    <p>
                                        {comment.userId} 
                                    </p>
                                </div>
                                <p className='text-slate-400'>
                                    {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
                                </p>
                                <p>
                                    {comment.text}
                                </p> 
                            </div>
                            <div>
                                <button className='mt-5 sm:my-0 px-3 py-2 text-white rounded-lg text-xs bg-red-500 hover:bg-red-600 transition duration-300 flex items-center gap-2'><Trash2Icon className='h-4 w-4' />Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-xs text-slate-400'>No comments</p>
            )}
        </>
        ) : (
            <p>Loading...</p>
        )}

        </div>
    )
}

export default ArticlePage