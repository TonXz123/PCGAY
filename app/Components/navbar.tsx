'use client';
import React, { useState, useEffect } from 'react';
import { Monitor, User, Search, Home, Grid, Wrench, ShoppingBag, LogOut, LayoutDashboard, Filter, Cpu, CircuitBoard, MemoryStick, HardDrive, Zap, Box, Fan, Gamepad2, Keyboard, Mouse, Gpu } from 'lucide-react'; // นำเข้าไอคอน
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export interface UserData {
    id: string;
    email: string;
    role: string;
}

// Props ของ Navbar
interface NavbarProps {
    isScrolled: boolean;    // เช็คว่า User เลื่อนหน้าจอลงมาหรือยัง (เพื่อเปลี่ยนสี Navbar)
    isLoading?: boolean;    // สถานะกำลังโหลดข้อมูล
    onLoginClick: () => void; // ฟังก์ชันเรียกเมื่อกดปุ่ม Login
    user?: UserData | null;   // ข้อมูลผู้ใช้
    onLogout?: () => void;    // ฟังก์ชัน Logout
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, isLoading, onLoginClick, user, onLogout }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // ข้อมูลหมวดหมู่สินค้า   
    const categories = [
        { name: 'ซีพียู', icon: Cpu, slug: 'cpu' },
        { name: 'การ์ดจอ', icon: Gpu, slug: 'gpu' },
        { name: 'เมนบอร์ด', icon: CircuitBoard, slug: 'mainboard' },
        { name: 'แรม', icon: MemoryStick, slug: 'ram' },
        { name: 'ฮาร์ดดิสก์ และ เอสเอสดี', icon: HardDrive, slug: 'storage' },
        { name: 'พาวเวอร์ซัพพลาย', icon: Zap, slug: 'psu' },
        { name: 'เคส', icon: Box, slug: 'case' },
        { name: 'ชุดระบายความร้อน', icon: Fan, slug: 'cooling' },
        { name: 'จอมอนิเตอร์', icon: Monitor, slug: 'monitor' },
        { name: 'เกมมิ่งเกียร์', icon: Gamepad2, slug: 'gaming-gear' },
        { name: 'คีย์บอร์ด', icon: Keyboard, slug: 'keyboard' },
        { name: 'เมาส์', icon: Mouse, slug: 'mouse' },
    ];

    const handleSearch = () => {
        if (isLoading) return; // ป้องกันการค้นหาขณะกำลังโหลด
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push('/');
        }
    };

    // ฟังก์ชันดึงจำนวนสินค้าในตะกร้า
    const fetchCartCount = async () => {
        if (!user) {
            setCartCount(0);
            return;
        }

        try {
            const response = await fetch('/api/cart', {
                cache: 'no-store',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                const count = Array.isArray(data.items) ? data.items.length : 0;
                setCartCount(count);
            } else if (response.status === 401) {
                // ไม่ได้ login
                setCartCount(0);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error("Failed to fetch cart count:", error);
            setCartCount(0);
        }
    };

    // ดึงจำนวนสินค้าในตะกร้าเมื่อ user เปลี่ยน
    useEffect(() => {
        if (!isLoading && user) {
            fetchCartCount();
        } else if (!user) {
            setCartCount(0);
        }
    }, [user?.id, isLoading]);

    // อัพเดท cart count เมื่อ focus window (เมื่อกลับมาหน้าเว็บ)
    useEffect(() => {
        const handleFocus = () => {
            if (user && !isLoading) {
                fetchCartCount();
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user?.id, isLoading]);

    // อัพเดท cart count เมื่อมีการ navigate (เช่น กลับมาจากหน้า cart)
    useEffect(() => {
        if (!user || isLoading) return;

        // อัพเดททุก 2 วินาทีเมื่อ user login อยู่
        const interval = setInterval(() => {
            fetchCartCount();
        }, 2000);

        return () => clearInterval(interval);
    }, [user?.id, isLoading]);

    // ฟังก์ชันจัดการเมื่อกดปุ่มตะกร้า
    const handleCartClick = () => {
        if (isLoading) return; // ป้องกันการกดเมื่อกำลังโหลด

        // ถ้ายังไม่ได้ล็อกอิน ให้เปิดฟอร์มล็อกอิน
        if (!user) {
            onLoginClick();
        } else {
            router.push('/cart');
        }
    };
    return (
        <>
            {/* ==========================================
           1. HEADER SECTION (Navbar ด้านบน)
       ========================================== */}
            {/* 
                fixed top-0 w-full z-40: ติดด้านบนตลอดเวลา, อยู่ชั้น z-index 40
                transition-all duration-300: อนิเมชั่นเปลี่ยนสีสมูทๆ
                ${isScrolled ? ... : ...}: ถ้าเลื่อนหน้าจอลงมา จะเปลี่ยนพื้นหลังเป็นสีเข้ม (bg-slate-900/90) พร้อมเบลอ (backdrop-blur-md)
            */}
            <nav className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-cyan-500/30 py-2 shadow-lg shadow-cyan-900/20' : 'bg-transparent border-transparent py-4'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4">

                        {/* Logo: โลโก้เว็บไซต์ */}
                        <div className="flex items-center gap-2 group cursor-pointer flex-none">
                            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                                <Monitor size={20} className="text-white" />
                            </div>
                            <span className="hidden sm:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter">
                                PC<span className="text-white">GAY</span>
                            </span>
                        </div>

                        {/* Search Input: ช่องค้นหา */}
                        {/* hidden on small screens, visible on lg */}
                        <div className="flex items-center gap-2 flex-1 max-w-xl mx-auto lg:mx-8">
                            <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-3 flex items-center">
                                    <Search className="w-4 h-4 text-slate-500" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="ค้นหาสินค้า..."
                                    value={searchQuery}
                                    disabled={isLoading}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full py-2 pl-10 pr-4 bg-slate-950/50 border border-slate-700 rounded-full focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-slate-200 text-sm placeholder:text-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => !isLoading && setIsFilterOpen(!isFilterOpen)}
                                    disabled={isLoading}
                                    className={`hidden lg:flex p-2 hover:bg-slate-700/50 rounded-full transition-colors border shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${isFilterOpen ? 'bg-slate-700/50 border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50'}`}
                                >
                                    <Filter className="w-5 h-5" />
                                </button>

                                {/* Dropdown Menu */}
                                {isFilterOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        {/* หัวข้อ (ถ้าต้องการ) หรือเริ่มรายการเลย */}
                                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                                            {categories.map((cat, index) => (
                                                <Link
                                                    href={`/category/${cat.slug}`}
                                                    key={index}
                                                    onClick={() => setIsFilterOpen(false)}
                                                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0"
                                                >
                                                    <div className="flex items-center gap-3 text-slate-700 group-hover:text-cyan-600">
                                                        <cat.icon className="w-5 h-5" strokeWidth={1.5} />
                                                        <span className="text-sm font-medium">{cat.name}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Icons/Menu: เมนูขวาบน (เฉพาะจอใหญ่) */}
                        <div className="flex items-center gap-4">
                            {/* เมนูลิงก์ (ซ่อนบนมือถือ show on lg) */}
                            <div className="hidden lg:flex gap-6 text-sm font-medium text-slate-400 mr-4">
                                <Link href="/" className="hover:text-cyan-400 transition-colors">หน้าแรก</Link>
                                <Link href="/spec" className="hover:text-cyan-400 transition-colors">จัดสเปคคอม</Link>
                                <Link href="/blog" className="hover:text-cyan-400 transition-colors">บทความ</Link>
                            </div>

                            {/* ปุ่มตะกร้าสินค้า */}
                            <button
                                onClick={handleCartClick}
                                className="hidden md:flex p-2 hover:bg-slate-800 rounded-full transition-colors relative group"
                            >
                                <ShoppingBag size={20} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
                                {/* Badge แจ้งเตือนจำนวนสินค้า - แสดงเฉพาะเมื่อมีสินค้า */}
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-cyan-500 text-[10px] flex items-center justify-center text-black font-bold rounded-full px-1 z-10 shadow-lg">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </button>

                            {/* ปุ่มเข้าสู่ระบบ / User Menu */}
                            {isLoading ? (
                                <div className="hidden md:block w-32 h-10 bg-slate-800/30 animate-pulse rounded-full border border-slate-700/50"></div>
                            ) : user ? (
                                <div className="hidden md:flex items-center gap-3">
                                    {/* ถ้าเป็น Admin ให้โชว์ปุ่มไปหน้า Admin */}
                                    {user.role === 'ADMIN' && (
                                        <a href="/admin" className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors">
                                            <LayoutDashboard size={18} />
                                            Admin
                                        </a>
                                    )}

                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full">
                                        <User size={16} className="text-cyan-400" />
                                        <span className="text-sm font-medium text-white max-w-[100px] truncate">{user.email.split('@')[0]}</span>
                                    </div>

                                    <button
                                        onClick={onLogout}
                                        className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                                        title="ออกจากระบบ"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="hidden md:flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-full transition-all duration-300 group"
                                >
                                    <User size={16} className="text-cyan-400 group-hover:text-cyan-300" />
                                    <span className="text-sm font-medium">เข้าสู่ระบบ</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* mobile category menu overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-[#f8faff] flex flex-col pt-20 pb-20 overflow-y-auto">
                    {/* search bar in menu */}
                    <div className="px-4 py-3 fixed top-0 w-full bg-white z-50 border-b border-slate-100 shadow-sm">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center">
                                <Search className="w-5 h-5 text-slate-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="ค้นหาสินค้า"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 pl-12 pr-4 bg-white border border-slate-200 rounded-full text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* category grid */}
                    <div className="grid grid-cols-3 gap-y-10 py-10 px-2">
                        {categories.map((cat, index) => (
                            <Link
                                key={index}
                                href={`/category/${cat.slug}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-700 shadow-sm group-hover:shadow-md group-hover:border-cyan-200 group-hover:text-cyan-600 transition-all">
                                    <cat.icon size={32} strokeWidth={1.5} />
                                </div>
                                <span className="text-[11px] font-medium text-slate-500 text-center leading-tight px-1 group-hover:text-slate-900">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* ==========================================
           2. MOBILE BOTTOM NAVIGATION (เมนูล่างสำหรับมือถือ)
       ========================================== */}
            {/* md:hidden คือซ่อนเมื่อหน้าจอใหญ่กว่า Medium (iPad ขึ้นไป) แสดงเฉพาะมือถือ */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
                <div className="flex justify-around items-center">
                    {/* ปุ่มหน้าแรก */}
                    <button className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-cyan-400">
                        <Home className="w-5 h-5" />
                        <Link href="/"><span className="text-[10px] font-medium">หน้าแรก</span></Link>
                    </button>
                    {/* ปุ่มหมวดหมู่ */}
                    <button
                        onClick={() => !isLoading && setIsMobileMenuOpen(!isMobileMenuOpen)}
                        disabled={isLoading}
                        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${isMobileMenuOpen ? 'text-red-500' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Grid className="w-5 h-5" />
                        <span className="text-[10px] font-medium">หมวดหมู่</span>
                    </button>
                    {/* ปุ่มจัดสเปค */}
                    <Link href="/spec" className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-slate-400 hover:text-slate-200 transition-colors">
                        <Wrench className="w-5 h-5" />
                        <span className="text-[10px]">จัดสเปค</span>
                    </Link>
                    {/* ปุ่มตะกร้า */}
                    <button
                        onClick={handleCartClick}
                        className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-slate-400 hover:text-slate-200 transition-colors relative"
                    >
                        <div className="relative">
                            <ShoppingBag className="w-5 h-5" />
                            {/* Badge แจ้งเตือนจำนวนสินค้า - แสดงเฉพาะเมื่อมีสินค้า */}
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-cyan-500 text-[9px] flex items-center justify-center text-black font-bold rounded-full px-0.5 z-10 shadow-lg">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px]">ตะกร้า</span>
                    </button>
                    {/* ปุ่มบัญชี (กดแล้ว Login ได้) */}
                    <button
                        onClick={isLoading || user ? undefined : onLoginClick}
                        className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-slate-400 hover:text-slate-200 transition-colors group"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 bg-slate-800 animate-pulse rounded-full"></div>
                        ) : user ? (
                            <div className="relative">
                                <User className="w-5 h-5 text-cyan-400" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-slate-900"></span>
                            </div>
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                        <span className="text-[10px]">
                            {isLoading ? '...' : user ? 'บัญชี' : 'เข้าสู่ระบบ'}
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
