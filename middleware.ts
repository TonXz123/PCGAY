/**
 * ไฟล์: middleware.ts
 * หน้าที่: “ดัก” request ก่อนเข้า route ที่ match เพื่อทำ redirect/ตรวจสิทธิ์เบื้องต้น
 *
 * Next.js (สำคัญ):
 * - Middleware จะรันบน Edge Runtime (ไม่ใช่ Node runtime เต็มรูปแบบ)
 * - จึงไม่ควร/ไม่สามารถใช้หลาย Node.js APIs และ “ไม่ควร import Prisma” ในไฟล์นี้
 *
 * Flow ที่เกี่ยวกับ Auth ของโปรเจกต์นี้:
 * - ฝั่ง Client จะเรียก `/api/auth/me` เพื่อตรวจสอบ session ใน database (ดู `app/api/auth/me/route.ts`)
 * - Middleware ตัวนี้ทำแค่ “gate” เบื้องต้นจาก cookie เพื่อลดการเข้าหน้า protected แบบง่ายๆ
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // request.cookies: cookie ที่แนบมากับ request นี้ (อ่านได้ใน middleware)
    const sessionToken = request.cookies.get('session_id')?.value;
    const role = request.cookies.get('user_role')?.value;
    const pathname = request.nextUrl.pathname;

    // ตรวจ path เพื่อรู้ว่า request กำลังจะไปหน้าไหน
    const isAdminRoute = pathname.startsWith('/admin');
    const isDashboardRoute = pathname.startsWith('/dashboard');
    const isProtectedRoute = isAdminRoute || isDashboardRoute;

    // ถ้าเป็น protected route แต่ไม่มี session token ให้ redirect ทันที
    // หมายเหตุ: การตรวจสอบ session ในฐานข้อมูลจะทำที่ client-side (admin page) แทน
    // เพราะ Edge Runtime ไม่รองรับ Prisma
    if (isProtectedRoute && !sessionToken) {
        // NextResponse.redirect(): สั่งให้ browser ไป URL ใหม่ทันที
        return NextResponse.redirect(new URL('/', request.url));
    }

    // ตรวจสอบ role สำหรับ admin route (จาก cookie)
    if (isAdminRoute && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // NextResponse.next(): ปล่อยให้ request ไปทำงานต่อที่ route/page จริง
    return NextResponse.next();
}

export const config = {
    // matcher: กำหนดว่า middleware นี้จะทำงานเฉพาะ path ไหนบ้าง
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};