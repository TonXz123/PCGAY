"use client"; // ระบุว่าเป็น Client Component
import React, { useEffect, useState } from 'react';
import { X, User, Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'; // นำเข้าไอคอน

// Props ของ Login Modal
interface LoginModalProps {
    isOpen: boolean;    // สถานะเปิดปิด
    onClose: () => void; // ฟังก์ชันปิด
    onSwitchToRegister: () => void; // ฟังก์ชันสลับไปหน้าสมัครสมาชิก
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
    // State จัดการ Form และ Loading
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false); // สถานะโชว์/ซ่อนรหัสผ่าน
    const [formData, setFormData] = useState({ email: '', password: '' });

    // Effect: เมื่อ Modal เปิด/ปิด
    useEffect(() => {
        if (isOpen) {
            setError(null);
            setFormData({ email: '', password: '' }); // รีเซ็ตฟอร์ม
            setShowPassword(false);
            document.body.style.overflow = 'hidden'; // ปิด Scroll
        } else {
            document.body.style.overflow = 'unset'; // คืนค่า Scroll
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // จัดการการพิมพ์ใน Input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null); // เคลียร์ Error เมื่อเริ่มพิมพ์
    };

    // ส่งฟอร์ม Login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check ว่ากรอกครบไหม
        if (!formData.email || !formData.password) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        setIsLoading(true); // เริ่มโหลด
        try {
            // เรียก API Login
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            // ถ้า Error ให้ Throw ไปที่ Catch
            if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด');

            // สำเร็จ -> ปิด Modal -> Reload หน้า หรือ Redirect
            onClose();
            if (data.user?.role === 'ADMIN') {
                window.location.href = '/admin';
            } else {
                window.location.reload();
            }
        } catch (err: any) {
            setError(err.message); // โชว์ Error
        } finally {
            setIsLoading(false); // หยุดโหลด
        }
    };

    if (!isOpen) return null;

    return (
        // Overlay แบบเต็มหน้าจอ (Fixed Position)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop สีดำจางๆ กดแล้วปิดได้ */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>

            {/* กล่อง Modal ตรงกลาง */}
            <div className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 animate-in zoom-in-95 duration-300">

                {/* Decoration: แถบสี Cyan-Blue ด้านบน */}
                <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>

                {/* ปุ่มปิด */}
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-full transition-colors z-10">
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Header: ยินดีต้อนรับ */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-slate-700 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                            <User size={32} className="text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">ยินดีต้อนรับกลับมา</h2>
                        <p className="text-slate-400 text-sm">เข้าสู่ระบบเพื่อจัดการออเดอร์และสิทธิพิเศษ</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 ml-1">อีเมล / เบอร์โทรศัพท์</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input name='email' type="text" value={formData.email} onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 block pl-10 p-3 outline-none transition-all"
                                    placeholder="name@example.com" disabled={isLoading} />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 ml-1">รหัสผ่าน</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input name='password' type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 block pl-10 pr-10 p-3 outline-none transition-all"
                                    placeholder="••••••••" disabled={isLoading} />
                                {/* ปุ่มเปิดปิดรหัสผ่าน */}
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button Gradient Cyan-Blue */}
                        <button disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/20 transform active:scale-[0.98] transition-all mt-2 flex items-center justify-center disabled:opacity-70">
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    {/* Footer Link to Register */}
                    <div className="mt-8 text-center text-sm text-slate-400">
                        ยังไม่มีบัญชีใช่ไหม? <button onClick={onSwitchToRegister} className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline">สมัครสมาชิกฟรี</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;