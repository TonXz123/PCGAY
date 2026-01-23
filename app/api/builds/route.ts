import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { validateAndSanitizeString } from "@/lib/validation";

/**
 * GET /api/builds
 * ดึง Build ทั้งหมดของ user
 */
export async function GET() {
    try {
        const authResult = await requireAuth();
        if (!authResult.success) {
            return authResult.errorResponse || NextResponse.json(
                { error: "ไม่ได้รับอนุญาต" },
                { status: 401 }
            );
        }

        const userId = authResult.user!.id;

        // ตรวจสอบว่า prisma.build มีอยู่จริง
        if (!prisma.build) {
            console.error("BUILDS_GET_ERROR: prisma.build is undefined");
            return NextResponse.json(
                { error: "Prisma client ไม่มี build model. กรุณาตรวจสอบ Prisma Client generation." },
                { status: 500 }
            );
        }

        const builds = await prisma.build.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ builds });
    } catch (error: any) {
        console.error("BUILDS_GET_ERROR:", {
            message: error?.message,
            code: error?.code,
            stack: error?.stack,
            prismaBuildAvailable: !!prisma.build,
        });
        return NextResponse.json(
            { 
                error: "เกิดข้อผิดพลาดในการดึงข้อมูล Build",
                details: process.env.NODE_ENV === 'development' ? error?.message : undefined
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/builds
 * สร้าง Build ใหม่
 * Body: { name?: string, items: Array<{ productId: string, partType: string }> }
 */
export async function POST(request: Request) {
    try {
        const authResult = await requireAuth();
        if (!authResult.success) {
            return authResult.errorResponse || NextResponse.json(
                { error: "ไม่ได้รับอนุญาต" },
                { status: 401 }
            );
        }

        const userId = authResult.user!.id;
        const body = await request.json();
        const { name, items } = body;

        // Validate name
        const nameResult = validateAndSanitizeString(name || "My PC Build", "ชื่อ Build", {
            required: false,
            maxLength: 200,
        });
        if (!nameResult.valid) {
            return NextResponse.json({ error: nameResult.error }, { status: 400 });
        }

        // Validate items
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "กรุณาเลือกชิ้นส่วนอย่างน้อย 1 ชิ้น" },
                { status: 400 }
            );
        }

        // Validate each item
        const validPartTypes = ['CPU', 'GPU', 'MAINBOARD', 'RAM', 'STORAGE', 'PSU', 'CASE', 'COOLING', 'MONITOR'];
        for (const item of items) {
            if (!item.productId || !item.partType) {
                return NextResponse.json(
                    { error: "ข้อมูลชิ้นส่วนไม่ครบถ้วน" },
                    { status: 400 }
                );
            }

            // ตรวจสอบว่า partType ถูกต้อง
            if (!validPartTypes.includes(item.partType.toUpperCase())) {
                return NextResponse.json(
                    { error: `Part type ไม่ถูกต้อง: ${item.partType}` },
                    { status: 400 }
                );
            }

            // ตรวจสอบว่าสินค้ามีอยู่จริง
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                return NextResponse.json(
                    { error: `ไม่พบสินค้า ID: ${item.productId}` },
                    { status: 404 }
                );
            }
        }

        // ตรวจสอบว่า prisma.build มีอยู่จริง
        if (!prisma.build) {
            console.error("BUILDS_POST_ERROR: prisma.build is undefined");
            return NextResponse.json(
                { error: "Prisma client ไม่มี build model. กรุณาตรวจสอบ Prisma Client generation." },
                { status: 500 }
            );
        }

        // Log สำหรับ debugging
        console.log("BUILDS_POST: Creating build with data:", {
            name: nameResult.value,
            userId,
            itemsCount: items.length,
            items: items.map((item: { productId: string; partType: string }) => ({
                productId: item.productId,
                partType: item.partType.toUpperCase(),
            })),
        });

        // สร้าง Build พร้อม BuildItems
        const build = await prisma.build.create({
            data: {
                name: nameResult.value!,
                userId,
                items: {
                    create: items.map((item: { productId: string; partType: string }) => ({
                        productId: item.productId,
                        partType: item.partType.toUpperCase(),
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        console.log("BUILDS_POST: Build created successfully:", build.id);
        return NextResponse.json({ build }, { status: 201 });
    } catch (error: any) {
        console.error("BUILDS_POST_ERROR:", {
            message: error?.message,
            code: error?.code,
            meta: error?.meta,
            stack: error?.stack,
            prismaBuildAvailable: !!prisma.build,
            errorName: error?.name,
        });

        // จัดการ unique constraint error
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "มีชิ้นส่วนซ้ำใน Build นี้" },
                { status: 400 }
            );
        }

        // จัดการ Prisma errors อื่นๆ
        if (error.code?.startsWith('P')) {
            console.error("BUILDS_POST_ERROR: Prisma error code:", error.code);
        }

        return NextResponse.json(
            { 
                error: "เกิดข้อผิดพลาดในการสร้าง Build",
                details: process.env.NODE_ENV === 'development' ? error?.message : undefined
            },
            { status: 500 }
        );
    }
}
