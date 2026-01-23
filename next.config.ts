import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io', // เพิ่มอันนี้เพื่อให้แสดงรูปจาก Uploadthing ได้
      },
    ],
  },
  // เพิ่ม Security Headers ตามคำแนะนำของ Audit Report
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // ป้องกันการเอาเว็บไปใส่ใน iframe (Anti-Clickjacking)
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // ป้องกัน Browser เดาประเภทไฟล์เอง
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload', // บังคับ HTTPS (HSTS)
          },
        ],
      },
    ];
  },
};

export default nextConfig;