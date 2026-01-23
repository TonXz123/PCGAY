/**
 * Footer Configuration
 * แก้ไขข้อมูล Footer ได้ที่นี่
 */

import { Facebook, Instagram, Youtube } from 'lucide-react';

// ข้อมูลแบรนด์
export const brandInfo = {
  name: 'PCGAY',
  fullName: 'PCGAY',
  description: 'สุดยอดร้านประกอบคอมพิวเตอร์ Gaming Gear และอุปกรณ์ IT ครบวงจร จัดสเปคเทพ เน้นคุณภาพ บริการด้วยใจ พร้อมประกันศูนย์ไทยแท้ 100%',
  logo: {
    icon: 'Monitor',
    gradient: 'from-cyan-500 to-blue-600',
  },
};

// Social Media Links
export const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/tonxz06',
    ariaLabel: 'ติดตามเราบน Facebook',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/',
    ariaLabel: 'ติดตามเราบน Instagram',
  },
  {
    name: 'Youtube',
    icon: Youtube,
    href: 'https://www.youtube.com/',
    ariaLabel: 'ติดตามเราบน Youtube',
  },
];

// สินค้าแนะนำ
export const featuredProducts = [
  { name: 'Graphic Cards', href: '/category/gpu', label: 'การ์ดจอ' },
  { name: 'Processors (CPU)', href: '/category/cpu', label: 'ซีพียู' },
  { name: 'Motherboards', href: '/category/mainboard', label: 'เมนบอร์ด' },
  { name: 'RAM / Memory', href: '/category/ram', label: 'แรม' },
  { name: 'Gaming Gear', href: '/category/gaming-gear', label: 'เกมมิ่งเกียร์' },
  { name: 'Computer Cases', href: '/category/case', label: 'เคสคอมพิวเตอร์' },
];

// บริการลูกค้า
export const customerServices = [
  { name: 'ตรวจสอบสถานะคำสั่งซื้อ', href: '/orders', label: 'ตรวจสอบสถานะคำสั่งซื้อ' },
  { name: 'การรับประกันสินค้า', href: '/warranty', label: 'การรับประกันสินค้า' },
  { name: 'นโยบายการคืนสินค้า', href: '/return-policy', label: 'นโยบายการคืนสินค้า' },
  { name: 'วิธีการชำระเงิน', href: '/payment', label: 'วิธีการชำระเงิน' },
  { name: 'คำถามที่พบบ่อย (FAQ)', href: '/faq', label: 'คำถามที่พบบ่อย' },
  { name: 'ติดต่อเรา', href: '/contact', label: 'ติดต่อเรา' },
];

// ข้อมูลติดต่อ
export const contactInfo = {
  address: {
    line1: '123 อาคารเกมมิ่งเซ็นเตอร์ ชั้น 10',
    line2: 'ถนนแถวบ้าน ศรีสะเกษ 33000',
    full: '123 อาคารเกมมิ่งเซ็นเตอร์ ชั้น 10 ถนนแถวบ้าน ศรีสะเกษ 33000',
  },
  phone: '080-348-XXXX',
  email: 'phathorn@gmail.com',
  businessHours: {
    weekdays: '09:00 - 20:00',
    weekends: '10:00 - 18:00',
  },
};

// Structured Data สำหรับ SEO
// รับ baseUrl เป็น parameter เพื่อใช้ใน server-side rendering
// สำหรับฝึกเล่น: ใช้ localhost:3000 หรือ environment variable
export const getStructuredData = (baseUrl: string = 'http://localhost:3000') => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: brandInfo.fullName,
    description: brandInfo.description,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contactInfo.address.line1,
      addressLocality: 'ศรีสะเกษ',
      postalCode: '33000',
      addressCountry: 'TH',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactInfo.phone,
      email: contactInfo.email,
      contactType: 'customer service',
    },
    sameAs: socialLinks.map(link => link.href),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '10:00',
        closes: '18:00',
      },
    ],
  };
};
