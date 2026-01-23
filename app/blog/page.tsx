'use client';

/**
 * ไฟล์: app/blog/page.tsx
 * หน้าที่: หน้าบทความทั้งหมด (Route: `/blog`)
 */

import React, { useState, useEffect } from 'react';
import Navbar, { UserData } from '../Components/navbar';
import { BlogCard, BlogPost } from '../Components/blog';
import { Search, Filter, BookOpen } from 'lucide-react';
import Prism from '../Components/bg';

// ข้อมูลบทความตัวอย่าง (Mock Data)
const mockPosts: BlogPost[] = [
    {
        id: '1',
        title: 'วิธีเลือก CPU ให้คุ้มค่าในปี 2026',
        excerpt: 'รวมเทคนิคการเลือกซื้อ CPU ที่เหมาะกับการใช้งานของคุณ ทั้งเล่นเกม ตัดต่อวิดีโอ และทำงานทั่วไป พร้อมเปรียบเทียบ Intel vs AMD',
        coverImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
        category: 'CPU',
        author: 'TechAdmin',
        date: '22 ม.ค. 2026',
        readTime: '8 นาที',
        slug: 'how-to-choose-cpu-2026'
    },
    {
        id: '2',
        title: 'RTX 5090 vs RTX 5080 เลือกตัวไหนดี?',
        excerpt: 'เปรียบเทียบสเปคและประสิทธิภาพของการ์ดจอ NVIDIA รุ่นใหม่ล่าสุด พร้อมแนะนำว่าควรเลือกตัวไหนให้เหมาะกับงบประมาณ',
        coverImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
        category: 'GPU',
        author: 'GameMaster',
        date: '20 ม.ค. 2026',
        readTime: '10 นาที',
        slug: 'rtx-5090-vs-5080-comparison'
    },
    {
        id: '3',
        title: 'DDR5 RAM ยังจำเป็นไหมในปี 2026?',
        excerpt: 'วิเคราะห์ว่า DDR5 คุ้มค่ากับการอัพเกรดหรือไม่ เทียบกับ DDR4 ในแง่ของราคาและประสิทธิภาพการใช้งานจริง',
        coverImage: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
        category: 'RAM',
        author: 'TechAdmin',
        date: '18 ม.ค. 2026',
        readTime: '6 นาที',
        slug: 'ddr5-ram-worth-it-2026'
    },
    {
        id: '4',
        title: 'จัดสเปคคอมเล่นเกม 30,000 บาท',
        excerpt: 'แนะนำสเปคคอมเล่นเกมงบ 30,000 บาท เล่นได้ทุกเกม AAA ในปี 2026 พร้อมลิสต์อุปกรณ์และร้านค้าแนะนำ',
        coverImage: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
        category: 'Build Guide',
        author: 'BuildMaster',
        date: '15 ม.ค. 2026',
        readTime: '12 นาที',
        slug: 'gaming-pc-build-30k'
    },
    {
        id: '5',
        title: 'SSD NVMe Gen5 เร็วแค่ไหน?',
        excerpt: 'ทดสอบความเร็ว SSD NVMe Gen5 รุ่นใหม่ เทียบกับ Gen4 และ SATA มีความต่างกันมากน้อยแค่ไหน',
        coverImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
        category: 'Storage',
        author: 'TechAdmin',
        date: '12 ม.ค. 2026',
        readTime: '7 นาที',
        slug: 'nvme-gen5-speed-test'
    },
    {
        id: '6',
        title: 'วิธีประกอบคอมเองสำหรับมือใหม่',
        excerpt: 'คู่มือประกอบคอมแบบ Step-by-Step สำหรับคนที่ไม่เคยประกอบมาก่อน พร้อมวิดีโอและรูปภาพประกอบ',
        coverImage: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80',
        category: 'Tutorial',
        author: 'BuildMaster',
        date: '10 ม.ค. 2026',
        readTime: '15 นาที',
        slug: 'how-to-build-pc-beginner'
    }
];

// หมวดหมู่ทั้งหมด
const categories = ['ทั้งหมด', 'CPU', 'GPU', 'RAM', 'Storage', 'Build Guide', 'Tutorial'];

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

    // กรองบทความตาม search และ category
    const filteredPosts = mockPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'ทั้งหมด' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans relative overflow-hidden">
            {/* Background Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <Prism
                    height={3}
                    baseWidth={7}
                    glow={0.5}
                    noise={0.1}
                    transparent
                    scale={2.3}
                    hueShift={180}
                    colorFrequency={1.9}
                    hoverStrength={0.3}
                    inertia={0.05}
                    bloom={0.8}
                    timeScale={0.5}
                />
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="pt-28 pb-12 px-4 text-center">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-linear-to-r from-cyan-500/10 to-pink-500/10
                            border border-cyan-500/30 text-cyan-400 text-sm font-medium">
                            <BookOpen className="w-4 h-4" />
                            บทความและรีวิว
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                            <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-pink-500 
                                bg-clip-text text-transparent">
                                Tech Blog
                            </span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            รวมบทความ รีวิว และคู่มือเกี่ยวกับคอมพิวเตอร์ อุปกรณ์ไอที
                            อัพเดทข่าวสารใหม่ล่าสุดจากวงการเทคโนโลยี
                        </p>
                    </div>
                </section>

                {/* Search & Filter Section */}
                <section className="max-w-7xl mx-auto px-4 pb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="ค้นหาบทความ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl
                                    bg-slate-900/80 border border-slate-700/50
                                    focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20
                                    text-slate-200 placeholder:text-slate-500
                                    transition-all duration-300 outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            <Filter className="w-5 h-5 text-slate-500 shrink-0" />
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                                        transition-all duration-300
                                        ${selectedCategory === cat
                                            ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                                            : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Blog Grid */}
                <section className="max-w-7xl mx-auto px-4 pb-20">
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-slate-500 text-lg">ไม่พบบทความที่ค้นหา</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post, index) => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    featured={index === 0}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
