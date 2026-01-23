"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// ใส่ลิงก์รูปภาพแบนเนอร์ตรงนี้ (ใส่เป็น String URL ปกติ)
const bannerImages = [
    // รูปภาพ Local (ไฟล์อยู่ใน public folder)
    "/s1.png",
    "/s2.png",
    "/s3.png",
    // รูปภาพจาก URL ภายนอก (อย่าลืม Config next.config.ts ถ้าจะใช้ remote pattern)

];

const CyberBanner: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
    };

    return (
        <div className="relative container mx-auto w-full h-[200px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl group select-none bg-[#0a0a0a]">

            {/* Image Slider */}
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {bannerImages.map((src, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                        {/* ใช้ Next/Image เพื่อประสิทธิภาพที่ดีกว่า (แต่ต้อง config domain ใน next.config.ts ด้วยถ้าใช้รูปภายนอก) */}
                        <Image
                            src={src}
                            alt={`Banner ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0} // โหลดรูปแรกก่อน
                            unoptimized // ใช้ unoptimized ไปก่อนถ้ายังไม่ได้ config domain
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#e11d48] text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 z-10"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#e11d48] text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-[20px] group-hover:translate-x-0 z-10"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {bannerImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`transition-all duration-300 rounded-full ${currentIndex === index
                            ? 'w-8 h-2 bg-[#e11d48]'
                            : 'w-2 h-2 bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>

            {/* Decorative Corner Borders */}
            <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-[#e11d48]/50 rounded-tl-xl pointer-events-none z-10" />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-[#e11d48]/50 rounded-br-xl pointer-events-none z-10" />
        </div>
    );
};

export default CyberBanner;