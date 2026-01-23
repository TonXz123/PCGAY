"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../Components/navbar";
import LoginModal from "../Components/login";
import RegisterModal from "../Components/RegisterModal";
import Footer from "../Components/Footer";
import { useAuth } from "./AuthContext";

/**
 * ClientLayout: จัดการ UI ที่เป็น Client-side ใน Layout หลัก
 * เช่น Navbar, Modals และ Global Effects
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {

    const { user, isLoading, authModal, setAuthModal, logout } = useAuth();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    // Check if current route is admin
    const isAdminRoute = pathname?.startsWith('/admin');

    // จัดการ Effect การ Scroll สำหรับ Navbar
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const closeModals = () => setAuthModal(null);

    return (
        <>

            {!isAdminRoute && (
                <Navbar
                    isScrolled={isScrolled}
                    isLoading={isLoading}
                    onLoginClick={() => setAuthModal("login")}
                    user={user}
                    onLogout={logout}
                />
            )}

            {children}

            {!isAdminRoute && <Footer />}

            {/* Global Modals */}
            <LoginModal
                isOpen={authModal === "login"}
                onClose={closeModals}
                onSwitchToRegister={() => setAuthModal("register")}
            />
            <RegisterModal
                isOpen={authModal === "register"}
                onClose={closeModals}
                onSwitchToLogin={() => setAuthModal("login")}
            />
        </>
    );
}
