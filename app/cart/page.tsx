'use client';

/**
 * ไฟล์: app/cart/page.tsx
 * หน้าที่: หน้าตระกร้าสินค้า (Route: `/cart`)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    ChevronRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import Prism from '../Components/bg';
import Link from 'next/link';

// Interface สำหรับสินค้าในหน้าตระกร้า
interface CartItem {
    id: string; // cartItemId
    productId: string;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
}

export default function CartPage() {
    const { user, isLoading: authLoading } = useAuth();

    // State สำหรับสินค้าในตระกร้า
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // โหลดข้อมูลตระกร้าจาก API
    const fetchCart = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/cart');

            if (!response.ok) {
                if (response.status === 401) {
                    setError("กรุณาเข้าสู่ระบบเพื่อดูตะกร้าสินค้า");
                    setCartItems([]);
                    return;
                }
                throw new Error('Failed to fetch cart');
            }

            const data = await response.json();
            setCartItems(data.items || []);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
            setError("เกิดข้อผิดพลาดในการโหลดตะกร้า");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            fetchCart();
        }
    }, [user, authLoading]);

    // คำนวณราคา
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 100 : 0; // ค่าจัดส่งคงที่ถ้ามีสินค้า
    const total = subtotal + shipping;

    // ฟังก์ชันลบสินค้า
    const removeItem = async (cartItemId: string) => {
        if (!user) return;

        try {
            setIsUpdating(cartItemId);
            setError(null);
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItemId }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to remove item');
            }

            const data = await response.json();
            setCartItems(data.items || []);
        } catch (err: any) {
            console.error("Failed to remove item:", err);
            setError(err.message || "เกิดข้อผิดพลาดในการลบสินค้า");
        } finally {
            setIsUpdating(null);
        }
    };

    // ฟังก์ชันอัพเดทจำนวนสินค้า
    const updateQuantity = async (cartItemId: string, currentQty: number, change: number) => {
        if (!user) return;

        const newQty = Math.max(1, currentQty + change);

        // ถ้าจำนวนเท่าเดิม ไม่ต้องอัพเดท
        if (newQty === currentQty) return;

        try {
            setIsUpdating(cartItemId);
            setError(null);
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItemId, quantity: newQty }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update quantity');
            }

            const data = await response.json();
            setCartItems(data.items || []);
        } catch (err: any) {
            console.error("Failed to update quantity:", err);
            setError(err.message || "เกิดข้อผิดพลาดในการอัพเดทจำนวนสินค้า");
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans relative overflow-hidden">
            {/* Background Effect */}
            <div className="fixed inset-0 z-0 pointer-events-none">
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
                <main className="max-w-7xl mx-auto px-4 pt-32 pb-24">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* 1. รายการสินค้าในตระกร้า */}
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold flex items-center gap-3">
                                    <ShoppingBag className="text-cyan-400" size={32} />
                                    ตระกร้าของคุณ
                                    <span className="text-base font-normal text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                                        {cartItems.length} รายการ
                                    </span>
                                </h1>
                            </div>

                            {error && (
                                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl">
                                    {error}
                                </div>
                            )}

                            {isLoading ? (
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-16 text-center shadow-2xl">
                                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                                    <p className="text-slate-400">กำลังโหลดตะกร้าสินค้า...</p>
                                </div>
                            ) : !user ? (
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-16 text-center shadow-2xl">
                                    <div className="bg-slate-900/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                                        <ShoppingBag size={48} className="text-slate-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">กรุณาเข้าสู่ระบบ</h2>
                                    <p className="text-slate-400 mb-10 max-w-sm mx-auto">
                                        คุณต้องเข้าสู่ระบบเพื่อดูตะกร้าสินค้าของคุณ
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all border border-cyan-400/20"
                                    >
                                        <ArrowLeft size={20} /> กลับไปหน้าแรก
                                    </Link>
                                </div>
                            ) : cartItems.length === 0 ? (
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-16 text-center shadow-2xl">
                                    <div className="bg-slate-900/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                                        <ShoppingBag size={48} className="text-slate-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">ตระกร้าของคุณยังว่างอยู่</h2>
                                    <p className="text-slate-400 mb-10 max-w-sm mx-auto">
                                        เริ่มเพิ่มไอเทมสุดเทพลงในตระกร้า และสร้างคอมพิวเตอร์ในฝันของคุณได้ทันที!
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all border border-cyan-400/20"
                                    >
                                        <ArrowLeft size={20} /> กลับไปเลือกซื้อสินค้า
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col sm:flex-row gap-6 hover:bg-white/8 transition-colors group relative overflow-hidden"
                                        >
                                            <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-slate-900/50 border border-white/5 shadow-inner shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded mb-2 inline-block">
                                                            {item.category}
                                                        </span>
                                                        <h3 className="text-xl font-bold text-white leading-tight line-clamp-1">{item.name}</h3>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={isUpdating === item.id}
                                                        className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isUpdating === item.id ? (
                                                            <Loader2 size={20} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={20} />
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="flex justify-between items-end mt-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-slate-400 font-medium">ราคาต่อชิ้น</p>
                                                        <p className="text-2xl font-black text-white">฿{item.price.toLocaleString()}</p>
                                                    </div>

                                                    <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-white/5">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity, -1)}
                                                            disabled={isUpdating === item.id || item.quantity <= 1}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isUpdating === item.id ? (
                                                                <Loader2 size={18} className="animate-spin" />
                                                            ) : (
                                                                <Minus size={18} />
                                                            )}
                                                        </button>
                                                        <span className="w-8 text-center text-lg font-bold text-white">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity, 1)}
                                                            disabled={isUpdating === item.id}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isUpdating === item.id ? (
                                                                <Loader2 size={18} className="animate-spin" />
                                                            ) : (
                                                                <Plus size={18} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. สรุปยอดเงิน */}
                        <div className="w-full lg:w-[400px]">
                            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl sticky top-32">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                    <CreditCard className="text-cyan-400" /> สรุปออเดอร์
                                </h2>

                                <div className="space-y-5 mb-10">
                                    <div className="flex justify-between text-slate-400 font-medium">
                                        <span>ยอดรวมสินค้า</span>
                                        <span className="text-white">฿{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 font-medium">
                                        <span>ค่าจัดส่ง (Standard)</span>
                                        <span className="text-white">฿{shipping.toLocaleString()}</span>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="flex justify-between items-end pt-2">
                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">ยอดรวมสุทธิ</p>
                                            <p className="text-4xl font-black text-white tracking-tighter">
                                                ฿{total.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        disabled={cartItems.length === 0}
                                        className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none group"
                                    >
                                        ชำระเงินตอนนี้
                                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-center text-[11px] text-slate-500 px-6 leading-relaxed">
                                        การคลิกชำระเงินแสดงว่าคุณยอมรับ <span className="text-slate-300 underline underline-offset-2">เงื่อนไขการให้บริการ</span> ของทางร้าน
                                    </p>
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5">
                                    <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Authenticated Session</p>
                                        {user ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase">
                                                    {user.email[0]}
                                                </div>
                                                <p className="text-xs font-mono text-slate-400 truncate">{user.id}</p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic">Guest Session</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
