"use client"; // ใช้ Client Side Rendering เพราะมีการใช้ Hook (useState, useEffect)

import { useEffect, useState } from "react";
import { Product } from "@/app/type/product"; // นำเข้า Type ของข้อมูลสินค้า
import { ShoppingCart, Loader2, Check, ChevronLeft, ChevronRight } from "lucide-react"; // นำเข้าไอคอนจาก lucide-react
import LogoTech from "./logo/logoloop"; // คอมโพเนนต์แสดงโลโก้แบรนด์ต่างๆ แบบเลื่อนได้
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface ProductHProps {
    category?: string;
    title?: string;
}

const ProductH = ({ category, title = "สินค้าทั้งหมด" }: ProductHProps) => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";
    const { user, setAuthModal } = useAuth();

    // State เก็บรายการสินค้าทั้งหมดที่ดึงมาจาก API
    const [products, setProducts] = useState<Product[]>([]);
    // State เก็บสถานะการโหลดข้อมูล (true = กำลังโหลด)
    const [loading, setLoading] = useState(true);
    // State เก็บ productId ที่กำลังเพิ่มเข้า cart
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    // State เก็บ productId ที่เพิ่มสำเร็จแล้ว (แสดง checkmark)
    const [addedToCart, setAddedToCart] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 2 แถว แถวละ 5 ชิ้น (บน Desktop)

    // ฟังก์ชันสำหรับดึงข้อมูลสินค้าจาก API
    const fetchProducts = async () => {
        try {
            // เรียกข้อมูลจาก api/products (Backend)
            const url = category
                ? `/api/products?category=${category}`
                : "/api/products";
            const res = await fetch(url);
            if (res.ok) {
                // แปลงข้อมูลที่ได้เป็น JSON
                const data = await res.json();
                setProducts(data); // นำข้อมูลไปเก็บใน state
            }
        } catch (error) {
            console.error("Failed to fetch products", error); // แสดง error หากดึงข้อมูลล้มเหลว
        } finally {
            setLoading(false); // ปิดสถานะ loading ไม่ว่าจะสำเร็จหรือล้มเหลว
        }
    };

    // useEffect ทำงานครั้งแรกเมื่อ component ถูกโหลด
    useEffect(() => {
        fetchProducts(); // เรียกฟังก์ชันดึงข้อมูล
    }, [category]); // Reload if category changes

    // รีเซ็ตหน้ากลับไปหน้า 1 เมื่อมีการค้นหา
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // กรองสินค้าตามคำค้นหา
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );

    // คำนวณจำนวนหน้าทั้งหมด
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // ดึงเฉพาะสินค้าในหน้านั้นๆ
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ฟังก์ชันเปลี่ยนหน้า
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // เลื่อนกลับขึ้นไปที่หัวข้อสินค้าเมื่อเปลี่ยนหน้า
        const element = document.getElementById('all-products-title');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // ฟังก์ชันเพิ่มสินค้าเข้า cart
    const addToCart = async (productId: string) => {
        if (!user) {
            setAuthModal("login");
            return;
        }

        try {
            setAddingToCart(productId);
            setAddedToCart(null);

            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity: 1 }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to add to cart');
            }

            // แสดง checkmark เมื่อเพิ่มสำเร็จ
            setAddedToCart(productId);
            setTimeout(() => {
                setAddedToCart(null);
            }, 2000);
        } catch (error: any) {
            console.error("Failed to add to cart:", error);
            alert(error.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้าเข้าตะกร้า");
        } finally {
            setAddingToCart(null);
        }
    };

    // ถ้ายังโหลดไม่เสร็จ ให้แสดง Spinner หมุนๆ
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                {/* animate-spin: class ของ tailwind ทำให้หมุนตลอดเวลา */}
                <Loader2 className="animate-spin text-white" size={48} />
            </div>
        );
    }

    return (
        // Container พื้นที่หลัก
        // relative z-10: เพื่อให้แสดงอยู่เหนือ background (ถ้ามี)
        <div className="container mx-auto px-4 py-8 relative z-10">

            {/* หัวข้อหมวดหมู่สินค้า */}
            {/* flex items-center justify-between: จัดหัวข้อให้อยู่คนละฝั่งกับ LogoTech */}
            <h2 id="all-products-title" className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* ขีดสีแดงแนวตั้งหน้าหัวข้อ */}
                    <span className="w-1 h-8 bg-[#e11d48] rounded-full"></span>
                    <span className="text-base sm:text-sm md:text-base lg:text-2xl">{title}</span>
                </div>
                {/* แถบโลโก้แบรนด์ต่างๆ ทางขวา */}
                <LogoTech />
            </h2>

            {/* Grid แสดงการ์ดสินค้า */}
            {/* grid-cols-2: มือถือแสดง 2 คอลัมน์ */}
            {/* md:grid-cols-3: แท็บเล็ตแสดง 3 คอลัมน์ */}
            {/* lg:grid-cols-5: จอใหญ่แสดง 5 คอลัมน์ */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
                {paginatedProducts.map(product => (
                    // การ์ดสินค้าแต่ละชิ้น
                    // group: เพื่อใช้ group-hover ในลูกๆ
                    // hover:-translate-y-1: เมาส์ชี้แล้วลอยขึ้นเล็กน้อย
                    // backdrop-blur: พื้นหลังเบลอ (Glassmorphism)
                    <div key={product.id} className="bg-[#13151a]/80 backdrop-blur-md rounded-xl overflow-hidden group border border-white/5 hover:border-[#e11d48]/50 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_20px_rgba(225,29,72,0.15)] hover:-translate-y-1">
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#1c1f26]">
                            <img
                                src={product.image}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                alt={product.name}
                            />
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {product.category && (
                                    <span className="bg-black/60 backdrop-blur text-white text-[9px] font-bold px-2 py-1 rounded-md border border-white/10">
                                        {product.category}
                                    </span>
                                )}
                            </div>
                            {product.salePrice && (
                                <span className="absolute top-2 right-2 bg-[#e11d48] text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-lg shadow-rose-500/20">
                                    SALE
                                </span>
                            )}
                        </div>

                        <div className="p-3 flex flex-col flex-1">
                            <h3 className="text-sm font-semibold text-gray-200 line-clamp-2 leading-snug mb-2 h-[2.5rem] overflow-hidden" title={product.name}>
                                {product.name}
                            </h3>

                            <div className="mt-auto pt-2 border-t border-dashed border-white/5">
                                {product.salePrice ? (
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-500 line-through">
                                                ฿{product.price.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-green-400 font-medium bg-green-400/10 px-1.5 py-0.5 rounded">
                                                -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-base font-bold text-white tracking-tight">
                                                ฿{product.salePrice.toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() => addToCart(product.id)}
                                                disabled={addingToCart === product.id}
                                                className="bg-[#e11d48] p-1.5 rounded-lg text-white hover:bg-[#be123c] transition-all duration-300 shadow-lg shadow-rose-900/20 active:scale-95 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {addingToCart === product.id ? (
                                                    <Loader2 size={18} className="animate-spin" />
                                                ) : addedToCart === product.id ? (
                                                    <Check size={18} />
                                                ) : (
                                                    <ShoppingCart size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-base font-bold text-white tracking-tight">
                                            ฿{product.price.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => addToCart(product.id)}
                                            disabled={addingToCart === product.id}
                                            className="bg-[#e11d48] p-1.5 rounded-lg text-white hover:bg-[#be123c] transition-all duration-300 shadow-lg shadow-rose-900/20 active:scale-95 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {addingToCart === product.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : addedToCart === product.id ? (
                                                <Check size={18} />
                                            ) : (
                                                <ShoppingCart size={18} />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-[#1c1f26] border border-white/5 text-gray-400 hover:text-white hover:border-[#e11d48]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all border ${currentPage === i + 1
                                ? 'bg-[#e11d48] text-white border-[#e11d48] shadow-lg shadow-rose-900/20'
                                : 'bg-[#1c1f26] text-gray-400 border-white/5 hover:text-white hover:border-[#e11d48]/50'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-[#1c1f26] border border-white/5 text-gray-400 hover:text-white hover:border-[#e11d48]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductH;
