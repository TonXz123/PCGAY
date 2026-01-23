/**
 * ไฟล์: app/page.tsx
 * หน้าที่: หน้า Home (Route: `/`) ของ Next.js App Router
 *
 * Next.js:
 * - การวางไฟล์ `app/page.tsx` = สร้างหน้า `/` อัตโนมัติ
 * - `"use client"` ทำให้ไฟล์นี้เป็น Client Component (ใช้ useState/useEffect ได้)
 *
 * Flow Auth (ภาพรวม):
 * - ตอน mount จะ `fetch('/api/auth/me')` เพื่อเช็คว่า cookie session ยัง valid ใน database หรือไม่
 * - ถ้า valid จะ set `user` เพื่อให้ Navbar แสดงสถานะล็อกอิน
 *
 * ที่มาของสิ่งที่ import:
 * - `./Components/*` คือคอมโพเนนต์ UI ในโปรเจกต์นี้ (โฟลเดอร์ `app/Components/`)
 * - `/api/auth/me` ถูก implement ที่ `app/api/auth/me/route.ts`
 * - `/api/auth/logout` ถูก implement ที่ `app/api/auth/logout/route.ts`
 */

"use client"; // ระบุว่าเป็น Client Component
import React, { useState, useEffect } from 'react'; // React hooks (client-side state/effect)
import Navbar, { UserData } from './Components/navbar'; // Navbar + type UserData
import LoginModal from './Components/login'; // Modal เข้าสู่ระบบ
import RegisterModal from './Components/RegisterModal'; // Modal สมัครสมาชิก
import Prism from './Components/bg'; // พื้นหลังเอฟเฟกต์ (OGL) ใน `app/Components/bg.tsx`
import ProductH from './Components/product'; // แสดงรายการสินค้า
import CyberBanner from './Components/banner/banner'; // แบนเนอร์ด้านบน
import Footer from './Components/Footer'; // Footer

export default function Home() {
  return (
    // min-h-screen: ความสูงอย่างน้อยเท่ากับหน้าจอ, bg-slate-950: พื้นหวังสีเข้ม, selection:bg-cyan-500: สีไฮไลท์ข้อความ
    <header className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      <div className="relative z-10">
        <main>
          <div className="max-10xl mx-auto px-5 py-16">
            <CyberBanner />
            <ProductH />
          </div>
        </main>
      </div>

      {/* Background */}
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
    </header>
  );
}