import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: string;
}

export interface SessionValidationResult {
    success: boolean;
    user?: AuthenticatedUser;
    error?: string;
}

/**
 * ตรวจสอบ session ใน database และ return user data
 * @returns SessionValidationResult
 */
export async function validateSession(): Promise<SessionValidationResult> {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;

        if (!sessionId) {
            return {
                success: false,
                error: "ไม่พบ Session",
            };
        }

        const session = await prisma.session.findUnique({
            where: { sessionToken: sessionId },
            include: { user: true },
        });

        if (!session) {
            // ลบ session ที่ไม่ถูกต้องออกจาก database
            await prisma.session.deleteMany({
                where: { sessionToken: sessionId },
            }).catch(() => null);
            return {
                success: false,
                error: "Session ไม่ถูกต้อง",
            };
        }

        if (session.expires < new Date()) {
            // ลบ session ที่หมดอายุออกจาก database
            await prisma.session.delete({
                where: { sessionToken: sessionId },
            }).catch(() => null);
            return {
                success: false,
                error: "Session หมดอายุ",
            };
        }

        return {
            success: true,
            user: {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role,
            },
        };
    } catch (error) {
        console.error("SESSION_VALIDATION_ERROR:", error);
        return {
            success: false,
            error: "เกิดข้อผิดพลาดในการตรวจสอบ Session",
        };
    }
}

/**
 * สร้าง error response พร้อมลบ cookies
 */
export function createAuthErrorResponse(message: string, status: number = 401) {
    const response = NextResponse.json(
        { message, error: true },
        { status }
    );
    response.cookies.delete("session_id");
    response.cookies.delete("user_role");
    return response;
}

/**
 * ตรวจสอบว่าผู้ใช้มีสิทธิ์ ADMIN หรือไม่
 * ใช้ร่วมกับ validateSession()
 */
export function requireAdmin(user: AuthenticatedUser | undefined): boolean {
    return user?.role === "ADMIN";
}

/**
 * Helper function สำหรับ API routes ที่ต้องการ authentication
 * ใช้ในรูปแบบ: const authResult = await requireAuth(); if (!authResult.success) return createAuthErrorResponse(...)
 */
export async function requireAuth(): Promise<{
    success: boolean;
    user?: AuthenticatedUser;
    errorResponse?: NextResponse;
}> {
    const result = await validateSession();
    
    if (!result.success) {
        return {
            success: false,
            errorResponse: createAuthErrorResponse(
                result.error || "ไม่ได้รับอนุญาต",
                401
            ),
        };
    }

    return {
        success: true,
        user: result.user,
    };
}

/**
 * Helper function สำหรับ API routes ที่ต้องการ ADMIN role
 */
export async function requireAdminAuth(): Promise<{
    success: boolean;
    user?: AuthenticatedUser;
    errorResponse?: NextResponse;
}> {
    const authResult = await requireAuth();
    
    if (!authResult.success) {
        return authResult;
    }

    if (!requireAdmin(authResult.user)) {
        return {
            success: false,
            errorResponse: createAuthErrorResponse(
                "ต้องมีสิทธิ์ ADMIN",
                403
            ),
        };
    }

    return {
        success: true,
        user: authResult.user,
    };
}