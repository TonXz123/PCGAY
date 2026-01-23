// นำเข้า PrismaClient สำหรับใช้คุยกับฐานข้อมูลผ่าน Prisma
import { PrismaClient } from '@prisma/client';

// นำเข้า Pool จาก pg (PostgreSQL client)
// Pool = connection pool สำหรับ reuse connection
import { Pool } from 'pg';

// นำเข้า adapter ที่ทำให้ Prisma ใช้ pg Pool ได้
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * ประกาศ global variable สำหรับ Prisma
 * ใช้แก้ปัญหา Next.js / Bun / Hot Reload
 * ไม่ให้สร้าง PrismaClient ซ้ำหลายรอบ
 */
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

/**
 * ดึง DATABASE_URL จาก environment variable
 * ตัวอย่าง:
 * postgres://user:password@localhost:5432/dbname
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        'DATABASE_URL environment variable is not set. Please set it in your .env file.'
    );
}

/**
 * สร้าง PostgreSQL connection pool
 * Prisma จะไม่ connect เอง แต่ใช้ pool ตัวนี้แทน
 */
let pool: Pool;
try {
    pool = new Pool({ connectionString });
} catch (error) {
    console.error('Failed to create PostgreSQL pool:', error);
    throw error;
}

/**
 * สร้าง Prisma adapter โดยใช้ pg pool
 * Prisma v7 จะใช้ adapter แทน datasourceUrl
 */
let adapter: PrismaPg;
try {
    adapter = new PrismaPg(pool);
} catch (error) {
    console.error('Failed to create Prisma adapter:', error);
    throw error;
}

/**
 * แปลง global object ให้ TypeScript รู้จัก prisma
 * (เพราะ globalThis ไม่มี type prisma โดย default)
 */
const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

/**
 * สร้าง PrismaClient
 * - ถ้ามี prisma อยู่ใน global แล้ว → ใช้ตัวเดิม
 * - ถ้ายังไม่มี → สร้างใหม่
 */
let prismaInstance: PrismaClient;

try {
    prismaInstance =
        globalForPrisma.prisma ||
        new PrismaClient({
            adapter, // บอก Prisma ให้ใช้ pg adapter
        });

    // ตรวจสอบว่า PrismaClient มี build property หรือไม่ (สำหรับ debugging)
    if (process.env.NODE_ENV !== 'production') {
        if (!('build' in prismaInstance)) {
            console.warn(
                'WARNING: prisma.build is not available. This might indicate a Prisma Client generation issue.'
            );
        } else {
            console.log('✓ Prisma Client initialized successfully with build model');
        }
    }
} catch (error) {
    console.error('Failed to create PrismaClient:', error);
    throw error;
}

export const prisma = prismaInstance;

/**
 * ถ้าไม่ใช่ production
 * เก็บ prisma ไว้ใน global
 * เพื่อป้องกันการสร้าง client ซ้ำตอน hot reload
 */
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
