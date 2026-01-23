"use client";

import { useState, useEffect } from "react";
import { orders, customers } from "@/app/data/mockData";
import ProductManagement from "../Components/admin/ProductManagement";
import OrderManagement from "../Components/admin/OrderManagement";
import CustomerManagement from "../Components/admin/CustomerManagement";
import DashboardHome from "../Components/admin/DashboardHome";
import Sidebar from "../Components/admin/Sidebar";
import Topbar from "../Components/admin/Topbar";
import AddProductModal from "../Components/admin/AddProductModal";
import ConfirmDialog from "../Components/ConfirmDialog";
import { useAlert } from "../Components/AlertToast";

import { Product } from "@/app/type/product";

type View = "/" | "dashboard" | "products" | "orders" | "customers";

const AdminPage = () => {
    // State จัดการ View ปัจจุบัน (Dashboard, Products, Orders, Customers)
    const [view, setView] = useState<View>("dashboard");
    // State จัดการการเปิด-ปิด Sidebar
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
    // State ควบคุมการแสดง Modal เพิ่มสินค้า
    const [showAddModal, setShowAddModal] = useState(false);
    // State เก็บข้อมูลสินค้าที่กำลังแก้ไข (ถ้ามี)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    // State เก็บข้อมูลสินค้าที่ดึงมาจาก API
    const [products, setProducts] = useState<any[]>([]);
    // State สำหรับ Confirm Dialog
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
    });
    // Alert Toast Hook
    const { showAlert, AlertContainer } = useAlert();

    // ฟังก์ชันดึงข้อมูลสินค้าจาก API
    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    // ฟังก์ชันเปิด Modal สำหรับแก้ไขสินค้า
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setShowAddModal(true);
    };

    // ฟังก์ชันลบสินค้า
    const handleDeleteProduct = async (id: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'ยืนยันการลบสินค้า',
            message: 'คุณแน่ใจว่าต้องการลบสินค้านี้? การกระทำนี้ไม่สามารถย้อนกลับได้',
            onConfirm: async () => {
                setConfirmDialog({ ...confirmDialog, isOpen: false });
                try {
                    const res = await fetch(`/api/products?id=${id}`, {
                        method: "DELETE",
                    });
                    if (res.ok) {
                        showAlert("ลบสินค้าเรียบร้อยแล้ว", "success");
                        fetchProducts();
                    } else {
                        const data = await res.json();
                        showAlert(data.error || "เกิดข้อผิดพลาดในการลบสินค้า", "error");
                    }
                } catch (error) {
                    console.error("Error deleting product:", error);
                    showAlert("เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
                }
            },
        });
    };

    // ตรวจสอบ Session เมื่อ Component ถูกโหลดครั้งแรก
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch('/api/auth/me');
                // ถ้า session ไม่ถูกต้อง (status 401) ให้ redirect ทันที
                if (!res.ok) {
                    window.location.href = '/';
                    return;
                }
                const data = await res.json();
                // ถ้าไม่มี user หรือ role ไม่ใช่ ADMIN ให้ redirect
                if (!data.user || data.user.role !== 'ADMIN') {
                    window.location.href = '/';
                    return;
                }
            } catch (error) {
                console.error('Session check failed:', error);
                // ถ้าเกิด error ให้ redirect เพื่อความปลอดภัย
                window.location.href = '/';
            }
        };
        checkSession();
    }, []);

    // ดึงข้อมูลสินค้าเมื่อ Component ถูกโหลดครั้งแรก
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
            <Sidebar view={view} setView={setView} isOpen={isSidebarOpen} />

            <main className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
                <Topbar onToggle={() => setSidebarOpen(!isSidebarOpen)} />

                <div className="p-8">
                    {view === "dashboard" && <DashboardHome products={products} orders={orders} />}
                    {view === "products" && (
                        <ProductManagement
                            products={products}
                            onAdd={() => {
                                setEditingProduct(null); // เคลียร์สถานะการแก้ไขเพื่อเป็นการเพิ่มใหม่
                                setShowAddModal(true);
                            }}
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    )}
                    {view === "orders" && <OrderManagement orders={orders} />}
                    {view === "customers" && <CustomerManagement customers={customers} />}
                </div>
            </main>

            {/* Modals */}
            <div style={{ display: showAddModal ? 'block' : 'none' }}>
                <AddProductModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={fetchProducts}
                    initialData={editingProduct}
                />
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type="danger"
                confirmText="ลบสินค้า"
                cancelText="ยกเลิก"
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            />

            {/* Alert Toast Container */}
            <AlertContainer />
        </div>
    );
};

export default AdminPage;
