"use client";

import React from "react";
import Link from "next/link";
import { MoveLeft, LucideIcon } from "lucide-react";
import ProductH from "./product";

interface StatusPageProps {
    title: string;
    message: string;
    icon?: LucideIcon;
    buttonText?: string;
    buttonLink?: string;
    showRecommendations?: boolean;
}

const StatusPage: React.FC<StatusPageProps> = ({
    title,
    message,
    icon: Icon,
    buttonText = "กลับไปหน้าหลัก",
    buttonLink = "/",
    showRecommendations = true
}) => {
    return (
        <div className="relative min-h-screen flex flex-col pt-24">
            {/* Main Status Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden group">
                    {/* Decorative Gradient Glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px] group-hover:bg-cyan-500/30 transition-colors duration-700"></div>
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-[80px] group-hover:bg-rose-500/30 transition-colors duration-700"></div>

                    {/* Icon/Illustration Area */}
                    {Icon ? (
                        <div className="mb-8 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
                                <div className="relative bg-slate-900/50 p-6 rounded-full border border-white/10 shadow-inner">
                                    <Icon size={64} className="text-cyan-400" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/20 select-none">
                            404
                        </div>
                    )}

                    {/* Text Content */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-slate-950 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                        {message}
                    </p>

                    {/* Action Button */}
                    <Link
                        href={buttonLink}
                        className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-1 active:scale-95"
                    >
                        <MoveLeft size={20} />
                        {buttonText}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
