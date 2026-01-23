'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../type/product';
import { Cpu, Gpu, CircuitBoard, MemoryStick, HardDrive, Zap, Box, Fan, Monitor, Save, Loader2, X, Trash2, Search, Plus, CheckCircle2 } from 'lucide-react';
import Prism from '../Components/bg';
import { useAlert } from '../Components/AlertToast';
import ConfirmDialog from '../Components/ConfirmDialog';

interface BuildPart {
    partType: string;
    product: Product | null;
}

const partTypes = [
    { key: 'CPU', label: 'ซีพียู (CPU)', icon: Cpu, category: 'cpu' },
    { key: 'GPU', label: 'การ์ดจอ (GPU)', icon: Gpu, category: 'gpu' },
    { key: 'MAINBOARD', label: 'เมนบอร์ด', icon: CircuitBoard, category: 'mainboard' },
    { key: 'RAM', label: 'แรม (RAM)', icon: MemoryStick, category: 'ram' },
    { key: 'STORAGE', label: 'ฮาร์ดดิสก์/SSD', icon: HardDrive, category: 'storage' },
    { key: 'PSU', label: 'พาวเวอร์ซัพพลาย', icon: Zap, category: 'psu' },
    { key: 'CASE', label: 'เคส', icon: Box, category: 'case' },
    { key: 'COOLING', label: 'ระบบระบายความร้อน', icon: Fan, category: 'cooling' },
    { key: 'MONITOR', label: 'จอมอนิเตอร์', icon: Monitor, category: 'monitor' },
];

export default function SpecPage() {
    const { user } = useAuth();
    const { showAlert, AlertContainer } = useAlert();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [buildParts, setBuildParts] = useState<BuildPart[]>(
        partTypes.map(pt => ({ partType: pt.key, product: null }))
    );
    const [activePartType, setActivePartType] = useState<string>('CPU'); // หมวดหมู่ที่กำลังแสดง
    const [buildName, setBuildName] = useState('My PC Build');
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // ดึงข้อมูลสินค้า
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // ฟังก์ชันเลือกสินค้า
    const selectProduct = (partType: string, product: Product) => {
        // ตรวจสอบ category จริงของสินค้าเพื่อกำหนด partType ที่ถูกต้อง
        const productCategory = product.category.toLowerCase();
        let actualPartType = partType;

        // ถ้าเลือกจากหมวด CPU/GPU ให้ตรวจสอบ category จริงของสินค้า
        if (partType === 'CPU') {
            // ตรวจสอบว่าเป็น CPU หรือ GPU ตาม category จริง
            if (productCategory === 'gpu') {
                actualPartType = 'GPU';
            } else if (productCategory === 'cpu') {
                actualPartType = 'CPU';
            }
        } else if (partType === 'GPU') {
            // ถ้าเลือกจาก GPU แต่สินค้าเป็น CPU ก็ให้ใส่เป็น CPU
            if (productCategory === 'cpu') {
                actualPartType = 'CPU';
            } else if (productCategory === 'gpu') {
                actualPartType = 'GPU';
            }
        }

        setBuildParts(prev =>
            prev.map(part =>
                part.partType === actualPartType
                    ? { ...part, product }
                    : part
            )
        );
        showAlert(`เลือก ${product.name} แล้ว`, 'success');
    };

    // ฟังก์ชันลบสินค้าที่เลือก
    const removeProduct = (partType: string) => {
        setBuildParts(prev =>
            prev.map(part =>
                part.partType === partType
                    ? { ...part, product: null }
                    : part
            )
        );
    };

    // ฟังก์ชันบันทึก Build
    const handleSave = async () => {
        if (!user) {
            showAlert('กรุณาเข้าสู่ระบบเพื่อบันทึก Build', 'warning');
            return;
        }

        const selectedItems = buildParts
            .filter(part => part.product !== null)
            .map(part => ({
                productId: part.product!.id,
                partType: part.partType,
            }));

        if (selectedItems.length === 0) {
            showAlert('กรุณาเลือกชิ้นส่วนอย่างน้อย 1 ชิ้น', 'warning');
            return;
        }

        setSaving(true);
        try {
            // 1. บันทึก Build ก่อน
            const res = await fetch('/api/builds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: buildName,
                    items: selectedItems,
                }),
            });

            if (res.ok) {
                // 2. เพิ่มสินค้าทั้งหมดลงตะกร้า (ถ้ามีอยู่แล้วจะ +1 อัตโนมัติจาก API)
                const cartPromises = selectedItems.map(item =>
                    fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            productId: item.productId,
                            quantity: 1,
                        }),
                    })
                );

                const cartResults = await Promise.all(cartPromises);
                const allCartSuccess = cartResults.every(r => r.ok);

                if (allCartSuccess) {
                    showAlert('บันทึก Build และเพิ่มลงตะกร้าสำเร็จ!', 'success');
                } else {
                    showAlert('บันทึก Build สำเร็จ แต่บางรายการไม่สามารถเพิ่มลงตะกร้าได้', 'warning');
                }

                setBuildParts(partTypes.map(pt => ({ partType: pt.key, product: null })));
                setBuildName('My PC Build');
                setShowSaveDialog(false);
            } else {
                const data = await res.json();
                showAlert(data.error || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
            }
        } catch (error) {
            console.error('Failed to save build:', error);
            showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        } finally {
            setSaving(false);
        }
    };

    // คำนวณราคารวม
    const totalPrice = buildParts.reduce((sum, part) => {
        if (part.product) {
            return sum + (part.product.salePrice || part.product.price);
        }
        return sum;
    }, 0);

    // กรองสินค้าตาม activePartType และ search
    const getFilteredProducts = () => {
        const activePart = partTypes.find(pt => pt.key === activePartType);
        if (!activePart) return [];

        // กรองสินค้าตาม category ที่ตรงกับ activePartType เท่านั้น
        let filtered = products.filter(p => {
            const productCategory = p.category.toLowerCase();
            const targetCategory = activePart.category.toLowerCase();
            return productCategory === targetCategory;
        });

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredProducts = getFilteredProducts();
    const activePartInfo = partTypes.find(pt => pt.key === activePartType);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-cyan-400" size={48} />
            </div>
        );
    }

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
                <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 pt-24 lg:pt-32 pb-24">
                    {/* Left Sidebar - Build Summary */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:sticky top-32 space-y-6">
                            {/* Header */}
                            <div>
                                <h2 className="text-2xl font-bold mb-2">ยอดรวมทั้งสิ้น</h2>
                                <p className="text-4xl font-black text-cyan-400">
                                    ฿{totalPrice.toLocaleString()}
                                </p>
                            </div>

                            {/* Build Parts List */}
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-white/10
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:border
    [&::-webkit-scrollbar-thumb]:border-white/5
    hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
                            >
                                {partTypes.map((partType) => {
                                    const part = buildParts.find(p => p.partType === partType.key);
                                    const Icon = partType.icon;
                                    const isActive = activePartType === partType.key;

                                    return (
                                        <div
                                            key={partType.key}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${isActive
                                                ? 'bg-cyan-500/20 border-cyan-500/50'
                                                : 'bg-white/5 border-white/10 hover:bg-white/8'
                                                }`}
                                            onClick={() => setActivePartType(partType.key)}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <Icon className={`${isActive ? 'text-cyan-400' : 'text-slate-400'}`} size={24} />
                                                <h3 className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                    {partType.label}
                                                </h3>
                                            </div>

                                            {part?.product ? (
                                                <div className="space-y-3">
                                                    <div className="flex gap-3">
                                                        <img
                                                            src={part.product.image}
                                                            alt={part.product.name}
                                                            className="w-16 h-16 rounded-xl object-cover"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-white line-clamp-2">
                                                                {part.product.name}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                x 1
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-lg font-bold text-cyan-400">
                                                            ฿{(part.product.salePrice || part.product.price).toLocaleString()}
                                                        </p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeProduct(partType.key);
                                                            }}
                                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-slate-500 text-sm">
                                                    ยังไม่ได้เลือก
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={() => setShowSaveDialog(true)}
                                disabled={saving || buildParts.every(p => !p.product)}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        กำลังบันทึก...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        บันทึก Build
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Product List */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-2">
                                {activePartInfo?.label || 'เลือกชิ้นส่วน'}
                            </h1>
                            <p className="text-slate-400">เลือกสินค้าจากหมวดหมู่นี้</p>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="ค้นหาสินค้า..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => {
                                    // ตรวจสอบว่าเลือกแล้วหรือไม่ โดยดูจาก category จริงของสินค้า
                                    const productCategory = product.category.toLowerCase();
                                    let checkPartType = activePartType;

                                    // ถ้า activePartType เป็น CPU/GPU ให้ตรวจสอบ category จริง
                                    if (activePartType === 'CPU' && productCategory === 'gpu') {
                                        checkPartType = 'GPU';
                                    } else if (activePartType === 'GPU' && productCategory === 'cpu') {
                                        checkPartType = 'CPU';
                                    }

                                    const isSelected = buildParts.some(
                                        part => part.partType === checkPartType && part.product?.id === product.id
                                    );

                                    return (
                                        <div
                                            key={product.id}
                                            className={`bg-white/5 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all group ${isSelected
                                                ? 'border-cyan-500/50 ring-2 ring-cyan-500/20'
                                                : 'border-white/10 hover:border-cyan-500/30'
                                                }`}
                                        >
                                            {/* Product Image */}
                                            <div className="relative aspect-square overflow-hidden bg-slate-900">
                                                {product.salePrice && (
                                                    <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                        -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                                                    </div>
                                                )}
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-5">
                                                <h3 className="font-bold text-white mb-2 line-clamp-2 min-h-[3rem]">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-slate-400 mb-3">{product.brand}</p>

                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        {product.salePrice ? (
                                                            <div>
                                                                <p className="text-2xl font-black text-cyan-400">
                                                                    ฿{product.salePrice.toLocaleString()}
                                                                </p>
                                                                <p className="text-sm text-slate-500 line-through">
                                                                    ฿{product.price.toLocaleString()}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-2xl font-black text-cyan-400">
                                                                ฿{product.price.toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Add Button */}
                                                <button
                                                    onClick={() => selectProduct(activePartType, product)}
                                                    disabled={isSelected}
                                                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isSelected
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                                                        : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl'
                                                        }`}
                                                >
                                                    {isSelected ? (
                                                        <>
                                                            <CheckCircle2 size={18} />
                                                            เลือกแล้ว
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus size={18} />
                                                            เพิ่ม
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-400">
                                <p className="text-xl mb-2">ไม่พบสินค้า</p>
                                <p className="text-sm">ลองค้นหาด้วยคำอื่นหรือเปลี่ยนหมวดหมู่</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Save Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showSaveDialog}
                title="บันทึก Build"
                message={`คุณต้องการบันทึก Build "${buildName}" ใช่หรือไม่?`}
                type="info"
                confirmText="บันทึก"
                cancelText="ยกเลิก"
                onConfirm={handleSave}
                onCancel={() => setShowSaveDialog(false)}
            />

            <AlertContainer />
        </div>
    );
}
