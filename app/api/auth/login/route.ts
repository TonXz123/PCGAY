import { NextResponse } from "next/server"; // นำเข้า NextResponse สำหรับจัดการ Response
import { prisma } from "@/lib/prisma"; // นำเข้า Prisma Client
import bcrypt from "bcryptjs"; // นำเข้า bcrypt สำหรับตรวจสอบรหัสผ่าน
import { cookies } from "next/headers"; // 1. นำเข้า cookies จาก next/headers เพื่อจัดการ Cookie ใน Server Component/Route Handler
import crypto from "crypto"; // นำเข้า crypto (Module มาตรฐานของ Node.js) สำหรับสร้าง Session Token แบบสุ่ม
import { validateEmail, validatePassword } from "@/lib/validation";

// Function นี้รับ Request Method POST
export async function POST(req: Request) {
    try {
        // อ่านข้อมูล JSON จาก Body ของ Request
        const body = await req.json();
        const { email, password } = body; // ดึง email และ password ออกมา

        // Validation: ตรวจสอบว่าส่งข้อมูลมาครบหรือไม่
        if (!email || !password) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 } // Bad Request
            );
        }

        // Validate email format
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return NextResponse.json(
                { message: emailValidation.error },
                { status: 400 }
            );
        }

        // Validate password (basic check)
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { message: passwordValidation.error },
                { status: 400 }
            );
        }

        // ค้นหา User ใน Database ด้วย Email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // ถ้าไม่เจอ User
        if (!user) {
            return NextResponse.json(
                { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 } // Unauthorized
            );
        }

        // ตรวจสอบรหัสผ่าน: เปรียบเทียบรหัสผ่านที่ส่งมา (password) กับรหัสผ่านที่ Hash ไว้ใน DB (user.password)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // ถ้ารหัสผ่านไม่ตรงกัน
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            );
        }

        // --- เริ่มต้นส่วนการสร้าง Session (Login สำเร็จ) ---

        // 1. สร้าง Token สุ่มขึ้นมา: crypto.randomUUID() สร้าง UUID v4 (Unique ID)
        const sessionToken = crypto.randomUUID();
        // กำหนดวันหมดอายุ: 1 วันนับจากปัจจุบัน (1000ms * 60s * 60m * 24h)
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

        // 2. บันทึกลงตาราง Session ใน Database เพื่อใช้ตรวจสอบภายหลังว่า Token นี้เป็นของ User คนไหน
        await prisma.session.create({
            data: {
                sessionToken: sessionToken,
                userId: user.id, // ผูกกับ User ที่ Login
                expires: expires,
            },
        });

        // 3. ตั้งค่า Cookie ใน Browser ของผู้ใช้
        const cookieStore = await cookies();

        // cookieStore.set() ใช้กำหนดค่า Cookie
        cookieStore.set("session_id", sessionToken, {
            httpOnly: true, // สำคัญ: ป้องกัน Script (JavaScript ฝั่ง Client) แอบอ่านค่า Cookie นี้ช่วยป้องกัน XSS
            secure: process.env.NODE_ENV === "production", // ถ้าเป็น Production ให้ใช้ Secure (ส่งผ่าน HTTPS เท่านั้น)
            expires: expires, // วันหมดอายุ
            sameSite: "lax", // ป้องกัน CSRF ระดับหนึ่ง (Lax คือส่ง Cookie ไปกับ Top-level navigation ได้)
            path: "/", // ให้ Cookie นี้ใช้ได้กับทุก Path ในเว็บ
        });

        // ตั้งค่า Cookie สำหรับ Role (เพื่อให้ Middleware ตรวจสอบสิทธิ์เบื้องต้นได้โดยไม่ต้อง Query DB ทุกครั้ง)
        cookieStore.set("user_role", user.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: expires,
            sameSite: "lax",
            path: "/",
        });

        // --- จบส่วน Session ---

        // ส่ง Response กลับไปบอกว่า Login สำเร็จ พร้อมข้อมูล User บางส่วน (ไม่ควรส่ง Password กลับไป)
        return NextResponse.json(
            {
                message: "เข้าสู่ระบบสำเร็จ",
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }
            },
            { status: 200 } // OK
        );

    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
            { status: 500 } // Internal Server Error
        );
    }
}