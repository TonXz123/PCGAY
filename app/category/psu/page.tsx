"use client";
import ProductH from "@/app/Components/product";
import Prism from "@/app/Components/bg";

const PsuPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
            {/* relative z-10: เพื่อให้แสดงอยู่เหนือ background (ถ้ามี) */}
            <div className="relative z-10 max-10xl mx-auto px-5 py-16">
                <ProductH category="psu" title="PSU" />
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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
                    bloom={0.2}
                    timeScale={0.5}
                />
            </div>
        </div>
    );
};

export default PsuPage;
