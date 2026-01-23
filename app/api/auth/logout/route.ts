import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        if (sessionId) {
            // ลบ Session ใน Database (Optional: ถ้าต้องการลบจริงๆ)
            await prisma.session.delete({
                where: { sessionToken: sessionId },
            }).catch(() => null); // ถ้าหาไม่เจอก็ข้ามไป
        }

        // ลบ Cookies
        cookieStore.delete("session_id");
        cookieStore.delete("user_role");

        return NextResponse.json({ message: "Logout successful" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error logging out" }, { status: 500 });
    }
}
