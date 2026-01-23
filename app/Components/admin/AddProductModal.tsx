import { useEffect, useState, useRef } from "react";
import { Product } from "@/app/type/product";
import { X, Loader2, UploadCloud, CheckCircle } from "lucide-react";
import { convertImageToWebP } from "@/lib/image-utils";
import { useUploadThing } from "@/lib/uploadthing";

interface AddProductModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: Product | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSuccess, initialData }) => {
    // State สำหรับการจัดการ Loading และการอัปโหลดไฟล์
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    // เพิ่ม State เก็บไฟล์ที่เลือกและ Preview URL
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        salePrice: "",
        image: "",
        category: "CPU",
        brand: "",
        stock: "0",
    });

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description || "",
                price: initialData.price.toString(),
                salePrice: initialData.salePrice ? initialData.salePrice.toString() : "",
                image: initialData.image,
                category: initialData.category,
                brand: initialData.brand,
                stock: initialData.stock.toString(),
            });
            setSelectedFile(null); // Clear any selected file from previous session
            setPreviewUrl(null);   // Clear preview
        } else {
            // Reset form if switching to Add Mode
            setFormData({
                name: "",
                description: "",
                price: "",
                salePrice: "",
                image: "",
                category: "CPU",
                brand: "",
                stock: "0",
            });
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [initialData]);

    // Hook จาก UploadThing สำหรับการจัดการการอัปโหลด
    const { startUpload } = useUploadThing("imageUploader", {
        // ทำงานเมื่ออัปโหลดสำเร็จ
        onClientUploadComplete: (res) => {
            if (res && res.length > 0) {
                // บันทึก URL ของรูปภาพที่ได้จาก UploadThing ลงใน state ของฟอร์ม
                setFormData(prev => ({ ...prev, image: res[0].url }));
                setUploading(false);
                setUploadProgress(100);
            }
        },
        // ทำงานเมื่อเกิดข้อผิดพลาดในการอัปโหลด
        onUploadError: (error: Error) => {
            alert(`เกิดข้อผิดพลาดในการอัปโหลด: ${error.message}`);
            setUploading(false);
            setFormData(prev => ({ ...prev, image: "" })); // Clear image on error
        },
        // ใช้สำหรับแสดง Progress bar
        onUploadProgress: (p) => {
            setUploadProgress(p);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ฟังก์ชันจัดการเมื่อผู้ใช้เลือกไฟล์รูปภาพ
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // 1. แปลงรูปภาพเป็น .webp ทันทีเพื่อเตรียมไฟล์และสร้าง Preview
            const webpFile = await convertImageToWebP(file);

            // เก็บไฟล์ที่แปลงแล้วลง State รอการอัปโหลด
            setSelectedFile(webpFile);

            // สร้าง URL สำหรับ Preview
            const objectUrl = URL.createObjectURL(webpFile);
            setPreviewUrl(objectUrl);

            // อัปเดต state ของฟอร์ม (ยังไม่มี image URL จริง จนกว่าจะอัปโหลด)
            setFormData(prev => ({ ...prev, image: objectUrl })); // ใช้ Preview URL แสดงผลไปก่อน

        } catch (error) {
            console.error("Error converting image:", error);
            alert("เกิดข้อผิดพลาดในการแปลงไฟล์");
        }
    };

    // ฟังก์ชันสำหรับรีเซ็ตฟอร์ม (เรียกใช้เมื่อบันทึกสำเร็จเท่านั้น)
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            salePrice: "",
            image: "",
            category: "CPU",
            brand: "",
            stock: "0",
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ถ้ายังไม่ได้เลือกรูปภาพ (ทั้งแบบอัปโหลดใหม่ หรือ URL เดิม)
        if (!formData.image && !selectedFile) {
            alert("กรุณาอัปโหลดรูปภาพสินค้า");
            return;
        }

        setLoading(true);

        try {
            let finalImageUrl = formData.image;

            // ถ้ามีการเลือกไฟล์ใหม่ ให้ทำการอัปโหลดก่อนบันทึกข้อมูล
            if (selectedFile) {
                setUploading(true);
                // อัปโหลดไฟล์ไปยัง UploadThing
                const uploadRes = await startUpload([selectedFile]);

                if (uploadRes && uploadRes.length > 0) {
                    finalImageUrl = uploadRes[0].url;
                } else {
                    throw new Error("Upload failed");
                }
                setUploading(false);
            }

            // เตรียมข้อมูลสำหรับส่งไป API
            const submissionData = {
                ...formData,
                image: finalImageUrl,
                id: initialData?.id // Include ID if editing
            };

            const method = initialData ? "PUT" : "POST";

            const res = await fetch("/api/products", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            if (res.ok) {
                if (onSuccess) onSuccess();
                resetForm(); // รีเซ็ตฟอร์มเมื่อบันทึกสำเร็จ
                onClose();
            } else {
                alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อหรืออัปโหลดรูปภาพ");
            setUploading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">{initialData ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Loading / Uploading Overlay */}
                {(loading || uploading) && (
                    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                            <p className="text-gray-800 font-bold text-lg">กำลังบันทึกข้อมูล...</p>
                            {uploading && (
                                <div className="mt-2 w-full flex flex-col items-center">
                                    <p className="text-sm text-gray-500 mb-1">กำลังอัปโหลดรูปภาพ {Math.round(uploadProgress)}%</p>
                                    <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="p-8 max-h-[70vh] overflow-y-auto grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อสินค้า</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                type="text"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="เช่น Intel Core i9-14900K"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">รายละเอียดสินค้า</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="รายละเอียดสินค้า..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">ราคาปกติ (บาท)</label>
                            <input
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                type="number"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">ราคาลด (ถ้ามี)</label>
                            <input
                                name="salePrice"
                                value={formData.salePrice}
                                onChange={handleChange}
                                type="number"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">รูปภาพสินค้า</label>

                            {!previewUrl && !formData.image ? (
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <UploadCloud className="text-gray-400 mb-2" size={32} />
                                    <span className="text-sm text-gray-500">คลิกเพื่ออัปโหลดรูปภาพ</span>
                                    <span className="text-xs text-gray-400 mt-1">ระบบจะแปลงเป็น .webp ให้อัตโนมัติ</span>
                                </div>
                            ) : (
                                <div className="relative group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={previewUrl || formData.image}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded-full p-1 shadow-sm">
                                        <CheckCircle className="text-green-500" size={20} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, image: "" });
                                            setPreviewUrl(null);
                                            setSelectedFile(null);
                                        }}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-medium rounded-xl"
                                    >
                                        เปลี่ยนรูปภาพ
                                    </button>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">หมวดหมู่</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="cpu">ซีพียู (CPU)</option>
                                <option value="gpu">การ์ดจอ (GPU)</option>
                                <option value="mainboard">เมนบอร์ด (Mainboard)</option>
                                <option value="ram">แรม (RAM)</option>
                                <option value="storage">ฮาร์ดดิสก์ และ เอสเอสดี (Storage)</option>
                                <option value="psu">พาวเวอร์ซัพพลาย (PSU)</option>
                                <option value="case">เคส (Case)</option>
                                <option value="cooling">ชุดระบายความร้อน (Cooling)</option>
                                <option value="monitor">จอมอนิเตอร์ (Monitor)</option>
                                <option value="keyboard">คีย์บอร์ด (Keyboard)</option>
                                <option value="mouse">เมาส์ (Mouse)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                แบรนด์ <span className="text-gray-400 font-normal text-xs">(ไม่บังคับ)</span>
                            </label>
                            <select
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">ไม่ระบุแบรนด์</option>
                                <option value="Intel">Intel</option>
                                <option value="AMD">AMD</option>
                                <option value="ASUS">ASUS</option>
                                <option value="MSI">MSI</option>
                                <option value="Gigabyte">Gigabyte</option>
                                <option value="NVIDIA">NVIDIA</option>
                                <option value="Corsair">Corsair</option>
                                <option value="Kingston">Kingston</option>
                                <option value="Samsung">Samsung</option>
                                <option value="Western Digital">Western Digital</option>
                                <option value="Seagate">Seagate</option>
                                <option value="Cooler Master">Cooler Master</option>
                                <option value="Thermaltake">Thermaltake</option>
                                <option value="Razer">Razer</option>
                                <option value="Logitech">Logitech</option>
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">จำนวนสินค้าในสต็อก</label>
                            <input
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                type="number"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="px-8 py-6 bg-gray-50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition">ยกเลิก</button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="px-8 py-2.5 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
