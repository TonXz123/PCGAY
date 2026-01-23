"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserData } from "../Components/navbar";

interface AuthContextType {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
    isLoading: boolean;
    authModal: "login" | "register" | null;
    setAuthModal: (modal: "login" | "register" | null) => void;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);

    const checkSession = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            window.location.reload(); // Reload to clear all states
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, authModal, setAuthModal, logout, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
