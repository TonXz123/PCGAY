import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// สร้าง Helper functions สำหรับใช้งานฝั่ง Client (useUploadThing hook และ uploadFiles function)
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
