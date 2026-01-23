import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/cart
 * ดึงตะกร้าสินค้าของ user พร้อมรายการสินค้าและข้อมูลสินค้า
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

        // ดึงตะกร้าของ user พร้อม items และ product details
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                    orderBy: {
                        id: "asc",
                    },
                },
            },
        });

        // ถ้ายังไม่มีตะกร้า ให้สร้างใหม่
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId,
                    items: {
                        create: [],
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                        orderBy: {
                            id: "asc",
                        },
                    },
                },
            });
        }

        // แปลงข้อมูลให้ตรงกับ interface ที่ frontend ใช้
        const cartItems = cart.items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.salePrice || item.product.price,
            image: item.product.image,
            category: item.product.category,
            quantity: item.quantity,
        }));

        return NextResponse.json({
            cartId: cart.id,
            items: cartItems,
        });
    } catch (error) {
        console.error("CART_GET_ERROR:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/cart
 * เพิ่มสินค้าเข้า cart หรืออัพเดท quantity ถ้ามีอยู่แล้ว
 * Body: { productId: string, quantity?: number }
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
        const { productId, quantity = 1 } = body;

        if (!productId) {
            return NextResponse.json(
                { error: "กรุณาระบุ productId" },
                { status: 400 }
            );
        }

        // ตรวจสอบว่าสินค้ามีอยู่จริง
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: "ไม่พบสินค้า" },
                { status: 404 }
            );
        }

        // ตรวจสอบ stock
        if (product.stock < quantity) {
            return NextResponse.json(
                { error: `สินค้าเหลือเพียง ${product.stock} ชิ้น` },
                { status: 400 }
            );
        }

        // ดึงหรือสร้างตะกร้า
        let cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
        }

        // ตรวจสอบว่ามีสินค้านี้ในตะกร้าแล้วหรือยัง
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId,
                },
            },
        });

        if (existingItem) {
            // อัพเดท quantity
            const newQuantity = existingItem.quantity + quantity;

            // ตรวจสอบ stock อีกครั้ง
            if (product.stock < newQuantity) {
                return NextResponse.json(
                    { error: `สินค้าเหลือเพียง ${product.stock} ชิ้น` },
                    { status: 400 }
                );
            }

            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        } else {
            // เพิ่มสินค้าใหม่
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: productId,
                    quantity: quantity,
                },
            });
        }

        // ดึงข้อมูลตะกร้าล่าสุด
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const cartItems = updatedCart!.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.salePrice || item.product.price,
            image: item.product.image,
            category: item.product.category,
            quantity: item.quantity,
        }));

        return NextResponse.json({
            message: "เพิ่มสินค้าเข้าตะกร้าสำเร็จ",
            cartId: cart.id,
            items: cartItems,
        });
    } catch (error: any) {
        console.error("CART_POST_ERROR:", error);

        // จัดการ error จาก unique constraint
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "สินค้านี้มีอยู่ในตะกร้าแล้ว" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการเพิ่มสินค้าเข้าตะกร้า" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/cart
 * อัพเดท quantity ของสินค้าใน cart
 * Body: { cartItemId: string, quantity: number }
 */
export async function PUT(request: Request) {
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
        const { cartItemId, quantity } = body;

        if (!cartItemId || quantity === undefined) {
            return NextResponse.json(
                { error: "กรุณาระบุ cartItemId และ quantity" },
                { status: 400 }
            );
        }

        if (quantity < 1) {
            return NextResponse.json(
                { error: "จำนวนต้องมากกว่า 0" },
                { status: 400 }
            );
        }

        // ตรวจสอบว่า cartItem นี้เป็นของ user นี้จริง
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                cart: true,
                product: true,
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { error: "ไม่พบรายการสินค้าในตะกร้า" },
                { status: 404 }
            );
        }

        if (cartItem.cart.userId !== userId) {
            return NextResponse.json(
                { error: "ไม่ได้รับอนุญาต" },
                { status: 403 }
            );
        }

        // ตรวจสอบ stock
        if (cartItem.product.stock < quantity) {
            return NextResponse.json(
                { error: `สินค้าเหลือเพียง ${cartItem.product.stock} ชิ้น` },
                { status: 400 }
            );
        }

        // อัพเดท quantity
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });

        // ดึงข้อมูลตะกร้าล่าสุด
        const cart = await prisma.cart.findUnique({
            where: { id: cartItem.cartId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const cartItems = cart!.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.salePrice || item.product.price,
            image: item.product.image,
            category: item.product.category,
            quantity: item.quantity,
        }));

        return NextResponse.json({
            message: "อัพเดทจำนวนสินค้าสำเร็จ",
            items: cartItems,
        });
    } catch (error) {
        console.error("CART_PUT_ERROR:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการอัพเดทจำนวนสินค้า" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/cart
 * ลบสินค้าออกจาก cart
 * Body: { cartItemId: string }
 */
export async function DELETE(request: Request) {
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
        const { cartItemId } = body;

        if (!cartItemId) {
            return NextResponse.json(
                { error: "กรุณาระบุ cartItemId" },
                { status: 400 }
            );
        }

        // ตรวจสอบว่า cartItem นี้เป็นของ user นี้จริง
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                cart: true,
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { error: "ไม่พบรายการสินค้าในตะกร้า" },
                { status: 404 }
            );
        }

        if (cartItem.cart.userId !== userId) {
            return NextResponse.json(
                { error: "ไม่ได้รับอนุญาต" },
                { status: 403 }
            );
        }

        // ลบ cartItem
        await prisma.cartItem.delete({
            where: { id: cartItemId },
        });

        // ดึงข้อมูลตะกร้าล่าสุด
        const cart = await prisma.cart.findUnique({
            where: { id: cartItem.cartId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const cartItems = cart!.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.salePrice || item.product.price,
            image: item.product.image,
            category: item.product.category,
            quantity: item.quantity,
        }));

        return NextResponse.json({
            message: "ลบสินค้าออกจากตะกร้าสำเร็จ",
            items: cartItems,
        });
    } catch (error) {
        console.error("CART_DELETE_ERROR:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการลบสินค้าออกจากตะกร้า" },
            { status: 500 }
        );
    }
}
