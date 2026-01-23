'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

// ประเภทข้อมูลบทความ
export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    slug: string;
}

interface BlogCardProps {
    post: BlogPost;
    featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`}>
            <article
                className={`
                    group relative overflow-hidden rounded-2xl h-full
                    bg-linear-to-br from-slate-900/80 to-slate-800/50
                    border border-slate-700/50 hover:border-cyan-500/50
                    transition-all duration-500 ease-out
                    hover:shadow-2xl hover:shadow-cyan-500/10
                    hover:-translate-y-2 flex flex-col
                    ${featured ? 'md:col-span-2 md:row-span-2' : ''}
                `}
            >
                {/* รูปภาพ Cover */}
                <div className="relative overflow-hidden h-48 flex-shrink-0">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                            bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30
                            text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                            <Tag className="w-3 h-3" />
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex flex-col flex-grow">
                    {/* Title */}
                    <h3 className="font-bold text-slate-100 leading-tight text-lg
                        group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-400 line-clamp-2 text-sm flex-grow">
                        {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {post.readTime}
                            </span>
                        </div>

                        {/* Read More Arrow */}
                        <span className="flex items-center gap-1 text-cyan-400 text-sm font-medium
                            opacity-0 group-hover:opacity-100 transition-all duration-300
                            translate-x-2 group-hover:translate-x-0">
                            อ่านต่อ
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                    transition-opacity duration-500 pointer-events-none
                    bg-linear-to-br from-cyan-500/5 via-transparent to-pink-500/5" />
            </article>
        </Link>
    );
}
