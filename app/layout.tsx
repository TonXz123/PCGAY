/**
 * ไฟล์: app/layout.tsx
 * หน้าที่: Root Layout ของ Next.js App Router (ครอบทุกหน้าในโฟลเดอร์ `app/`)
 *
 * Next.js:
 * - `app/layout.tsx` จะถูกใช้เป็น layout หลักอัตโนมัติ (ไม่ต้อง import เอง)
 * - `export const metadata` ใช้กำหนดข้อมูล SEO (title/description) สำหรับทั้งแอป
 * - ไฟล์นี้เป็น Server Component โดย default (ไม่มี `"use client"`)
 *
 * ที่มาของ import:
 * - `next` ให้ type `Metadata`
 * - `next/font/google` คือระบบโหลดฟอนต์แบบ optimize ของ Next.js
 * - `./globals.css` คือ global stylesheet ที่ถูก apply ทั้งแอป
 */

import type { Metadata } from "next"; // นำเข้า Type Metadata สำหรับทำ SEO
import { Geist, Geist_Mono } from "next/font/google"; // นำเข้า Font จาก Google Fonts
import "./globals.css"; // นำเข้า CSS Global

// กำหนด Font และ CSS Variables
const geistSans = Geist({
  variable: "--font-geist-sans", // ชื่อตัวแปร CSS
  subsets: ["latin"], // เลือก subset
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata: Server Component เท่านั้นที่ใช้ได้ ใช้สำหรับกำหนด <head> tags เช่น title, description (SEO)
export const metadata: Metadata = {
  title: "PC GAY Shop",
  description: "The best shop for PC GAY",
};

import { AuthProvider } from "./context/AuthContext";
import ClientLayout from "./context/ClientLayout";

// RootLayout: เป็น Layout หลักของทั้งโปรเจค ทุกหน้าจะถูก Render ภายใต้ <html> และ <body> นี้
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* นำ CSS Variable ของ Font มาใส่ใน ClassName ของ Body เพื่อให้ใช้ได้ทั่วทั้งเว็บ */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-cyan-500 selection:text-white`}
      >
        <AuthProvider>
          <ClientLayout>
            {children} {/* children คือ Component ของหน้าต่างๆ ที่จะถูกนำมาแสดงตรงนี้ */}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
