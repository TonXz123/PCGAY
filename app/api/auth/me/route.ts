import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        // สร้าง response สำหรับกรณี error (จะใช้ลบ cookie)
        const createErrorResponse = (message: string, status: number = 401) => {
            const response = NextResponse.json(
                { message, user: null },
                { status }
            );
            // ลบ cookies ที่ไม่ถูกต้อง
            response.cookies.delete("session_id");
            response.cookies.delete("user_role");
            return response;
        };

        if (!sessionId) {
            return createErrorResponse("ไม่พบ Session", 401);
        }

        const session = await prisma.session.findUnique({
            where: { sessionToken: sessionId },
            include: { user: true },
        });

        if (!session) {
            // ลบ session ที่ไม่ถูกต้องออกจาก database (ถ้ามี)
            await prisma.session.deleteMany({
                where: { sessionToken: sessionId },
            }).catch(() => null);
            return createErrorResponse("Session ไม่ถูกต้อง", 401);
        }

        if (session.expires < new Date()) {
            // ลบ session ที่หมดอายุออกจาก database
            await prisma.session.delete({
                where: { sessionToken: sessionId },
            }).catch(() => null);
            return createErrorResponse("Session หมดอายุ", 401);
        }

        return NextResponse.json({
            user: {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role,
            },
        });
    } catch (error) {
        console.error("AUTH_ME_ERROR:", error);
        const response = NextResponse.json(
            { message: "Internal Server Error", user: null },
            { status: 500 }
        );
        // ลบ cookies ในกรณี error เพื่อความปลอดภัย
        response.cookies.delete("session_id");
        response.cookies.delete("user_role");
        return response;
    }
}
