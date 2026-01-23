import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ดึงข้อมูลหมวดหมู่ทั้งหมดจาก database (ดึงจาก category ที่มีใน products)
export async function GET() {
    try {
        // ดึง categories ที่ไม่ซ้ำกันจากตาราง Product
        const products = await prisma.product.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
        });

        // นับจำนวนสินค้าในแต่ละหมวดหมู่
        const categoriesWithCount = await Promise.all(
            products.map(async (p: any) => {
                const count = await prisma.product.count({
                    where: { category: p.category }
                });
                return {
                    id: p.category.toLowerCase().replace(/\s+/g, '-'),
                    name: p.category,
                    productCount: count
                };
            })
        );

        return NextResponse.json(categoriesWithCount);
    } catch (error) {
        console.error("CATEGORIES_GET_ERROR:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่" },
            { status: 500 }
        );
    }
}
