import { NextResponse } from "next/server"; // นำเข้า NextResponse สำหรับสร้าง HTTP Response มาตรฐาน
import { prisma } from "@/lib/prisma"; // นำเข้า prisma client ที่เราสร้างไว้ใน lib เพื่อติดต่อ Database
import bcrypt from "bcryptjs"; // นำเข้า bcryptjs สำหรับการ Hash Password เพื่อความปลอดภัย
import { validateEmail, validatePassword, sanitizeString } from "@/lib/validation";

// export function POST หมายถึง Function นี้จะทำงานเมื่อมี Request แบบ POST เข้ามาที่ Route นี้
export async function POST(req: Request) {
    try {
        // req.json() เป็นคำสั่งสำหรับอ่านข้อมูลจาก Body ของ Request และแปลงเป็น JSON Object
        const body = await req.json();
        const { email, password } = body; // Destructuring เพื่อดึง email และ password ออกมา

        // 1. Validation เบื้องต้น: ตรวจสอบว่ามีข้อมูลครบหรือไม่
        if (!email || !password) {
            // ส่ง Response กลับไปพร้อม Status 400 (Bad Request)
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
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

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { message: passwordValidation.error },
                { status: 400 }
            );
        }

        // Sanitize email (trim และ lowercase)
        const sanitizedEmail = sanitizeString(email).toLowerCase();

        // 2. ตรวจสอบ User ซ้ำ: เช็คใน Database ว่ามี Email นี้อยู่แล้วหรือไม่
        const existingUser = await prisma.user.findUnique({
            where: { email: sanitizedEmail } // ค้นหาด้วย email ที่ sanitize แล้ว
        });

        // ถ้าเจอ User ที่มี Email นี้แล้ว
        if (existingUser) {
            return NextResponse.json(
                { message: "อีเมลนี้ถูกใช้งานไปแล้ว" },
                { status: 400 }
            );
        }

        // 3. Hash รหัสผ่านด้วย bcrypt: ไม่ควรเก็บรหัสผ่านเป็น Plain Text
        // 12 คือค่า Salt Rouds (ความซับซ้อนในการ Hash) ยิ่งมากยิ่งปลอดภัยแต่ใช้เวลาประมวลผลนานขึ้น
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4. บันทึกลง Database: สร้าง User ใหม่
        await prisma.user.create({
            data: {
                email: sanitizedEmail, // ใช้ email ที่ sanitize แล้ว
                password: hashedPassword, // เก็บ Password ที่ Hash แล้วเท่านั้น
            },
        });

        // ส่ง Response กลับไปบอกว่าสำเร็จ (Status 201 Created)
        return NextResponse.json(
            { message: "สมัครสมาชิกสำเร็จ" },
            { status: 201 }
        );

    } catch (error) {
        // ถ้ามี Error เกิดขึ้น (เช่น Database Down) ให้ Log Error และส่ง Status 500 (Internal Server Error)
        console.error("REGISTER_ERROR:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
            { status: 500 }
        );
    }
}