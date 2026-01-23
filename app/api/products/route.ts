import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import {
    validateAndSanitizeString,
    validateNumber,
    validateInteger,
    validateCategory,
} from "@/lib/validation";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        const whereClause = category ? {
            category: {
                equals: category,
                mode: "insensitive" as const,
            },
        } : {};

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("PRODUCTS_GET_ERROR:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        // ตรวจสอบ authentication และ authorization
        const authResult = await requireAdminAuth();
        if (!authResult.success) {
            return authResult.errorResponse!;
        }

        const body = await request.json();
        const { name, description, price, salePrice, image, category, brand, stock } = body;

        // Validate และ sanitize inputs
        const nameResult = validateAndSanitizeString(name, "ชื่อสินค้า", {
            required: true,
            maxLength: 200,
            minLength: 1,
        });
        if (!nameResult.valid) {
            return NextResponse.json({ error: nameResult.error }, { status: 400 });
        }

        const descriptionResult = validateAndSanitizeString(description, "รายละเอียด", {
            required: true,
            maxLength: 2000,
        });
        if (!descriptionResult.valid) {
            return NextResponse.json({ error: descriptionResult.error }, { status: 400 });
        }

        const priceResult = validateNumber(price, "ราคา", {
            required: true,
            min: 0,
            max: 99999999,
        });
        if (!priceResult.valid) {
            return NextResponse.json({ error: priceResult.error }, { status: 400 });
        }

        let salePriceValue: number | null = null;
        if (salePrice !== null && salePrice !== undefined && salePrice !== "") {
            const salePriceResult = validateNumber(salePrice, "ราคาลด", {
                required: false,
                min: 0,
                max: 99999999,
            });
            if (!salePriceResult.valid) {
                return NextResponse.json({ error: salePriceResult.error }, { status: 400 });
            }
            salePriceValue = salePriceResult.value!;
            // ตรวจสอบว่าราคาลดต้องน้อยกว่าราคาปกติ
            if (salePriceValue >= priceResult.value!) {
                return NextResponse.json(
                    { error: "ราคาลดต้องน้อยกว่าราคาปกติ" },
                    { status: 400 }
                );
            }
        }

        const imageResult = validateAndSanitizeString(image, "รูปภาพ", {
            required: true,
            maxLength: 500,
        });
        if (!imageResult.valid) {
            return NextResponse.json({ error: imageResult.error }, { status: 400 });
        }

        const categoryResult = validateCategory(category);
        if (!categoryResult.valid) {
            return NextResponse.json({ error: categoryResult.error }, { status: 400 });
        }

        // Brand เป็น optional
        const brandResult = validateAndSanitizeString(brand, "ยี่ห้อ", {
            required: false,
            maxLength: 100,
        });
        if (!brandResult.valid) {
            return NextResponse.json({ error: brandResult.error }, { status: 400 });
        }

        const stockResult = validateInteger(stock, "จำนวนสินค้า", {
            required: true,
            min: 0,
            max: 999999,
        });
        if (!stockResult.valid) {
            return NextResponse.json({ error: stockResult.error }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name: nameResult.value!,
                description: descriptionResult.value!,
                price: priceResult.value!,
                salePrice: salePriceValue,
                image: imageResult.value!,
                category: categoryResult.value!,
                brand: brandResult.value || "ไม่ระบุ",
                stock: stockResult.value!,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("PRODUCTS_POST_ERROR:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการสร้างสินค้า" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        // ตรวจสอบ authentication และ authorization
        const authResult = await requireAdminAuth();
        if (!authResult.success) {
            return authResult.errorResponse!;
        }

        const body = await request.json();
        const { id, name, description, price, salePrice, image, category, brand, stock } = body;

        // Validate ID
        const idResult = validateAndSanitizeString(id, "ID สินค้า", {
            required: true,
            maxLength: 100,
        });
        if (!idResult.valid) {
            return NextResponse.json({ error: idResult.error }, { status: 400 });
        }

        // Validate และ sanitize inputs (เหมือน POST)
        const nameResult = validateAndSanitizeString(name, "ชื่อสินค้า", {
            required: true,
            maxLength: 200,
            minLength: 1,
        });
        if (!nameResult.valid) {
            return NextResponse.json({ error: nameResult.error }, { status: 400 });
        }

        const descriptionResult = validateAndSanitizeString(description, "รายละเอียด", {
            required: true,
            maxLength: 2000,
        });
        if (!descriptionResult.valid) {
            return NextResponse.json({ error: descriptionResult.error }, { status: 400 });
        }

        const priceResult = validateNumber(price, "ราคา", {
            required: true,
            min: 0,
            max: 99999999,
        });
        if (!priceResult.valid) {
            return NextResponse.json({ error: priceResult.error }, { status: 400 });
        }

        let salePriceValue: number | null = null;
        if (salePrice !== null && salePrice !== undefined && salePrice !== "") {
            const salePriceResult = validateNumber(salePrice, "ราคาลด", {
                required: false,
                min: 0,
                max: 99999999,
            });
            if (!salePriceResult.valid) {
                return NextResponse.json({ error: salePriceResult.error }, { status: 400 });
            }
            salePriceValue = salePriceResult.value!;
            if (salePriceValue >= priceResult.value!) {
                return NextResponse.json(
                    { error: "ราคาลดต้องน้อยกว่าราคาปกติ" },
                    { status: 400 }
                );
            }
        }

        const imageResult = validateAndSanitizeString(image, "รูปภาพ", {
            required: true,
            maxLength: 500,
        });
        if (!imageResult.valid) {
            return NextResponse.json({ error: imageResult.error }, { status: 400 });
        }

        const categoryResult = validateCategory(category);
        if (!categoryResult.valid) {
            return NextResponse.json({ error: categoryResult.error }, { status: 400 });
        }

        const brandResult = validateAndSanitizeString(brand, "ยี่ห้อ", {
            required: true,
            maxLength: 100,
        });
        if (!brandResult.valid) {
            return NextResponse.json({ error: brandResult.error }, { status: 400 });
        }

        const stockResult = validateInteger(stock, "จำนวนสินค้า", {
            required: true,
            min: 0,
            max: 999999,
        });
        if (!stockResult.valid) {
            return NextResponse.json({ error: stockResult.error }, { status: 400 });
        }

        // ตรวจสอบว่าสินค้ามีอยู่จริง
        const existingProduct = await prisma.product.findUnique({
            where: { id: idResult.value! },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
        }

        const product = await prisma.product.update({
            where: { id: idResult.value! },
            data: {
                name: nameResult.value!,
                description: descriptionResult.value!,
                price: priceResult.value!,
                salePrice: salePriceValue,
                image: imageResult.value!,
                category: categoryResult.value!,
                brand: brandResult.value || "ไม่ระบุ",
                stock: stockResult.value!,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("PRODUCTS_PUT_ERROR:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการอัปเดตสินค้า" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        // ตรวจสอบ authentication และ authorization
        const authResult = await requireAdminAuth();
        if (!authResult.success) {
            return authResult.errorResponse!;
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        const idResult = validateAndSanitizeString(id, "ID สินค้า", {
            required: true,
            maxLength: 100,
        });
        if (!idResult.valid) {
            return NextResponse.json({ error: idResult.error }, { status: 400 });
        }

        // ตรวจสอบว่าสินค้ามีอยู่จริง
        const existingProduct = await prisma.product.findUnique({
            where: { id: idResult.value! },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id: idResult.value! },
        });

        return NextResponse.json({ message: "ลบสินค้าสำเร็จ" });
    } catch (error) {
        console.error("PRODUCTS_DELETE_ERROR:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการลบสินค้า" },
            { status: 500 }
        );
    }
}
