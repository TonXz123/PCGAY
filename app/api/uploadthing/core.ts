import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { validateSession, requireAdmin } from "@/lib/auth";

const f = createUploadthing();

// FileRouter สำหรับแอปพลิเคชัน (สามารถมีได้หลาย Route)
export const ourFileRouter = {
    // กำหนด Route ชื่อ imageUploader
    imageUploader: f({
        image: {
            /**
             * ดูรายละเอียดขนาดไฟล์สูงสุดได้ที่: https://docs.uploadthing.com/api-reference/server#files-options
             */
            maxFileSize: "4MB", // จำกัดขนาดไฟล์ที่ 4MB
            maxFileCount: 1, // อัปโหลดได้ทีละ 1 ไฟล์
        },
    })
        // Middleware นี้จะทำงานก่อนการอัปโหลดเริ่มขึ้น
        .middleware(async ({ req }) => {
            // ตรวจสอบ session ใน database และสิทธิ์ Admin
            const sessionResult = await validateSession();

            // ถ้าไม่มี session หรือ session ไม่ถูกต้อง
            if (!sessionResult.success || !sessionResult.user) {
                throw new UploadThingError("Unauthorized: Session invalid or expired");
            }

            // ตรวจสอบว่าผู้ใช้มีสิทธิ์ ADMIN
            if (!requireAdmin(sessionResult.user)) {
                throw new UploadThingError("Unauthorized: Admin access required");
            }

            // ส่งข้อมูล user ไปยัง onUploadComplete
            return { userId: sessionResult.user.id, userRole: sessionResult.user.role };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // โค้ดส่วนนี้จะทำงานบน Server หลังจากอัปโหลดเสร็จสิ้น
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);

            // ค่าที่ return ตรงนี้จะถูกส่งกลับไปยัง client ผ่าน onClientUploadComplete
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
