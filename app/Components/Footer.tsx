'use client';

import React, { useEffect } from 'react';
import { Monitor, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import {
  brandInfo,
  socialLinks,
  featuredProducts,
  customerServices,
  contactInfo,
  getStructuredData,
} from '@/app/data/footerConfig';

const Footer = () => {
  // ใช้ localhost สำหรับ development หรือ environment variable สำหรับ production
  // ไม่จำเป็นต้องมี domain จริง - ใช้ localhost:3000 สำหรับฝึกเล่นได้เลย
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const structuredData = getStructuredData(baseUrl);

  // Inject structured data script tag แบบ client-side only เพื่อหลีกเลี่ยง hydration mismatch
  useEffect(() => {
    // ลบ script tag เก่าถ้ามี
    const existingScript = document.getElementById('footer-structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // สร้าง script tag ใหม่
    const script = document.createElement('script');
    script.id = 'footer-structured-data';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById('footer-structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [structuredData]);

  return (
    <>

      <footer 
        className="w-full bg-[#0B0F19] pt-16 pb-8 border-t border-slate-800 relative overflow-hidden"
        role="contentinfo"
        aria-label="Footer"
      >
        {/* Decorative Top Glow (เหมือนแสงไฟเคสคอม) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" aria-hidden="true"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-6">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center gap-2 group cursor-pointer flex-none"
                aria-label={`${brandInfo.fullName} - กลับไปหน้าแรก`}
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <Monitor size={20} className="text-white" aria-hidden="true" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter">
                  PC<span className="text-white">GAY</span>
                </span>
              </Link>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                {brandInfo.description}
              </p>

              {/* Social Media Links */}
              <nav aria-label="Social media links">
                <ul className="flex gap-4" role="list">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <li key={social.name}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.ariaLabel}
                          className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300"
                        >
                          <Icon size={18} aria-hidden="true" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Column 2: Featured Products */}
            <nav aria-label="Featured products">
              <div>
                <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                  สินค้าแนะนำ
                  <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-cyan-500 rounded-full" aria-hidden="true"></span>
                </h3>
                <ul className="space-y-4" role="list">
                  {featuredProducts.map((product) => (
                    <li key={product.name}>
                      <Link
                        href={product.href}
                        className="text-slate-400 hover:text-cyan-400 hover:pl-2 transition-all duration-300 text-sm flex items-center gap-2"
                        aria-label={product.label}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 hover:bg-cyan-400 transition-colors" aria-hidden="true"></span>
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Column 3: Customer Service */}
            <nav aria-label="Customer service">
              <div>
                <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                  บริการลูกค้า
                  <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full" aria-hidden="true"></span>
                </h3>
                <ul className="space-y-4" role="list">
                  {customerServices.map((service) => (
                    <li key={service.name}>
                      <Link
                        href={service.href}
                        className="text-slate-400 hover:text-blue-400 hover:pl-2 transition-all duration-300 text-sm"
                        aria-label={service.label}
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Column 4: Contact Information */}
            <address className="not-italic">
              <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                ติดต่อสอบถาม
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-pink-500 rounded-full" aria-hidden="true"></span>
              </h3>
              <ul className="space-y-4 mb-8" role="list">
                <li className="flex items-start gap-3 text-slate-400 text-sm">
                  <MapPin className="w-5 h-5 text-cyan-500 shrink-0" aria-hidden="true" />
                  <div>
                    <span>{contactInfo.address.line1}</span>
                    <br />
                    <span>{contactInfo.address.line2}</span>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <Phone className="w-5 h-5 text-cyan-500 shrink-0" aria-hidden="true" />
                  <a 
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="hover:text-cyan-400 transition-colors"
                    aria-label={`โทรหาเรา ${contactInfo.phone}`}
                  >
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <Mail className="w-5 h-5 text-cyan-500 shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-cyan-400 transition-colors"
                    aria-label={`ส่งอีเมลหาเรา ${contactInfo.email}`}
                  >
                    {contactInfo.email}
                  </a>
                </li>
              </ul>
            </address>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> <span className="text-cyan-500 font-bold">{brandInfo.fullName}</span>. All Rights Reserved.
            </p>
            <nav aria-label="Footer links" className="flex gap-6 text-sm text-slate-500">
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                นโยบายความเป็นส่วนตัว
              </Link>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                ข้อกำหนดการใช้งาน
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;