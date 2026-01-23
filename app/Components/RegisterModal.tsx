"use client"; // "use client" บอก Next.js ว่าไฟล์นี้คือ Client Component (มีการใช้ React Hook เช่น useState, useEffect)
import React, { useEffect, useState } from 'react';
import { X, UserPlus, Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'; // นำเข้าไอคอนจาก Lucide React

// กำหนด Props ที่ Component นี้รับเข้ามา
interface RegisterModalProps {
    isOpen: boolean;    // สถานะเปิด/ปิด Modal (true = เปิด)
    onClose: () => void; // ฟังก์ชันที่จะเรียกเมื่อต้องการปิด Modal
    onSwitchToLogin: () => void; // ฟังก์ชันสำหรับสลับไปหน้าเข้าสู่ระบบ
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
    // useState ใช้สำหรับเก็บสถานะภายใน Component
    const [isLoading, setIsLoading] = useState(false); // สถานะกำลังโหลด (แสดง Spinner Button)
    const [error, setError] = useState<string | null>(null); // เก็บข้อความ Error
    const [showPassword, setShowPassword] = useState(false); // ควบคุมการแสดง/ซ่อนรหัสผ่าน
    const [showRePassword, setShowRePassword] = useState(false); // ควบคุมการแสดง/ซ่อนยืนยันรหัสผ่าน
    const [formData, setFormData] = useState({ email: '', password: '', repassword: '' }); // เก็บข้อมูลฟอร์ม

    // useEffect จะทำงานเมื่อค่าใน [isOpen] เปลี่ยนแปลง
    useEffect(() => {
        if (isOpen) {
            // เมื่อ Modal เปิด ให้ Reset ค่าต่างๆ
            setError(null);
            setFormData({ email: '', password: '', repassword: '' });
            setShowPassword(false);
            setShowRePassword(false);
            // ซ่อน Scrollbar ของ Body เพื่อไม่ให้เลื่อนหน้าหลังได้ขณะเปิด Modal
            document.body.style.overflow = 'hidden';
        } else {
            // เมื่อปิด Modal ให้คืนค่า Scrollbar
            document.body.style.overflow = 'unset';
        }
        // cleanup function: ทำงานเมื่อ Component ถูกทำลายหรือ effect run ใหม่
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // ฟังก์ชันจัดการการเปลี่ยนค่าใน Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // อัปเดต state formData ตาม name ของ input
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null); // เคลียร์ error เมื่อเริ่มพิมพ์ใหม่
    };

    // ฟังก์ชันจัดการเมื่อกด Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // ป้องกัน Refresh หน้า
        // Validation ฝั่ง Client
        if (!formData.email || !formData.password || !formData.repassword) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
        if (formData.password !== formData.repassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setIsLoading(true); // เริ่มโหลด
        try {
            // ส่ง Request ไปยัง API
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const data = await res.json();

            // ถ้า Status ไม่ใช่ OK (200-299) ให้ throw error
            if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

            // ถ้าสำเร็จ ให้ปิด Modal และ Reload หน้า (เพื่อให้สถานะ Login อัปเดต ถ้ามีการ Auto-login ในอนาคต)
            onClose();
            window.location.reload();
        } catch (err: any) {
            setError(err.message); // แสดง Error ที่ได้จาก Server
        } finally {
            setIsLoading(false); // หยุดโหลดไม่ว่าจะสำเร็จหรือล้มเหลว
        }
    };

    // ถ้า isOpen เป็น false ไม่ต้องแสดงอะไรเลย
    if (!isOpen) return null;

    return (
        // z-50: ให้ modal อยู่ชั้นบนสุด, fixed inset-0: ตรึงเต็มหน้าจอ
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop: พื้นหลังสีดำจางๆ กดแล้วปิด Modal ได้ */}
            {/* backdrop-blur-sm: เบลอฉากหลังเล็กน้อย, animate-in fade-in: อนิเมชั่นค่อยๆ ปรากฏ */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            {/* Modal Content Box */}
            {/* max-w-md: ความกว้างสูงสุด, bg-slate-900: พื้นหลังสีเข้มสวยๆ, zoom-in-95: อนิเมชั่นขยายขึ้นเล็กน้อย */}
            <div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-300">

                {/* Decorative Top Bar: แถบสีด้านบนไล่เฉด */}
                <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>

                {/* Close Button: ปุ่มปิดมุมขวาบน */}
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition-colors z-10">
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Header: โลโก้และข้อความต้อนรับ */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-slate-700 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
                            <UserPlus size={32} className="text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">สมัครสมาชิกใหม่</h2>
                        <p className="text-slate-400 text-sm">สร้างบัญชีเพื่อรับสิทธิพิเศษมากมาย</p>
                    </div>

                    {/* Error Message Display: แสดงเมื่อมี Error */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form Input Fields */}
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 ml-1">อีเมล</label>
                            <div className="relative group">
                                {/* Icon ด้านซ้าย */}
                                <Mail size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input name='email' type="email" value={formData.email} onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-10 p-3 outline-none transition-all"
                                    placeholder="name@example.com" disabled={isLoading} />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 ml-1">รหัสผ่าน</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input name='password' type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-10 pr-10 p-3 outline-none transition-all"
                                    placeholder="••••••••" disabled={isLoading} />
                                {/* ปุ่มเปิด/ปิดตา (Show Password) */}
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 ml-1">ยืนยันรหัสผ่าน</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <input name='repassword' type={showRePassword ? "text" : "password"} value={formData.repassword} onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-10 pr-10 p-3 outline-none transition-all"
                                    placeholder="••••••••" disabled={isLoading} />
                                <button type="button" onClick={() => setShowRePassword(!showRePassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-500/20 transform active:scale-[0.98] transition-all mt-2 flex items-center justify-center disabled:opacity-70">
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'สมัครสมาชิก'}
                        </button>
                    </form>

                    {/* Footer: ลิงก์ไปหน้าเข้าสู่ระบบ */}
                    <div className="mt-8 text-center text-sm text-slate-400">
                        มีบัญชีอยู่แล้ว? <button onClick={onSwitchToLogin} className="text-purple-400 font-semibold hover:text-purple-300 hover:underline">เข้าสู่ระบบ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;