"use client";

import React from "react";
import StatusPage from "./Components/StatusPage";
import { Ghost } from "lucide-react";
import Prism from "./Components/bg";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
            {/* Background Effect stays constant */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Prism
                    height={3}
                    baseWidth={7}
                    glow={0.7}
                    noise={0.1}
                    transparent
                    scale={2.3}
                    hueShift={0}
                    colorFrequency={1.9}
                    hoverStrength={0.5}
                    inertia={0.05}
                    bloom={1}
                    timeScale={0.9}
                />
            </div>

            <div className="relative z-10">
                <StatusPage
                    title="We're Sorry..."
                    message="ขออภัยครับ เราไม่พบหน้าจอนี้ในระบบ"
                    icon={Ghost}
                    buttonText="กลับสู่หน้าหลัก"
                    buttonLink="/"
                />
            </div>
        </div>
    );
}
