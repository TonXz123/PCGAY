import { useState } from "react";
import { Product } from "@/app/type/product";
import { Plus, Search, Filter, Edit3, Trash2 } from "lucide-react";

interface Props {
    products: Product[];
    onAdd?: () => void;
    onEdit?: (product: Product) => void;
    onDelete?: (id: string) => void;
}

const ProductManagement: React.FC<Props> = ({ products, onAdd, onEdit, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ทุกหมวดหมู่");

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = categoryFilter === "ทุกหมวดหมู่" ||
            (product.category && product.category.toLowerCase() === categoryFilter.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    // แสดงรายการสินค้าในรูปแบบตาราง พร้อมฟังก์ชันกรองและค้นหา
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">คลังสินค้า (Products)</h2>
                    <p className="text-gray-500 text-sm">จัดการข้อมูลสินค้า ราคา และสต็อก</p>
                </div>
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-blue-200"
                >
                    <Plus size={18} />
                    เพิ่มสินค้าใหม่
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="ค้นชื่อสินค้า, แบรนด์ หรือ ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl text-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="ทุกหมวดหมู่">ทุกหมวดหมู่</option>
                    <option value="cpu">ซีพียู (CPU)</option>
                    <option value="gpu">การ์ดจอ (GPU)</option>
                    <option value="mainboard">เมนบอร์ด (Mainboard)</option>
                    <option value="ram">แรม (RAM)</option>
                    <option value="storage">ฮาร์ดดิสก์ และ เอสเอสดี (Storage)</option>
                    <option value="psu">พาวเวอร์ซัพพลาย (PSU)</option>
                    <option value="case">เคส (Case)</option>
                    <option value="cooling">ชุดระบายความร้อน (Cooling)</option>
                    <option value="monitor">จอมอนิเตอร์ (Monitor)</option>
                    <option value="gaming-gear">เกมมิ่งเกียร์ (Gaming Gear)</option>
                    <option value="keyboard">คีย์บอร์ด (Keyboard)</option>
                    <option value="mouse">เมาส์ (Mouse)</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition text-sm font-medium border border-gray-100">
                    <Filter size={16} />
                    ตัวกรอง
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">สินค้า</th>
                            <th className="px-6 py-4">หมวดหมู่/แบรนด์</th>
                            <th className="px-6 py-4">ราคา (ปกติ/ลด)</th>
                            <th className="px-6 py-4">สต็อก</th>
                            <th className="px-6 py-4 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition group text-sm">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                            <div>
                                                <p className="font-bold text-gray-800 line-clamp-1">{p.name}</p>
                                                <p className="text-xs text-gray-400 font-mono uppercase">{p.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-700">{p.category}</span>
                                            <span className="text-xs text-gray-400">{p.brand}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {p.salePrice ? (
                                            <div className="flex flex-col">
                                                <span className="text-red-500">฿{p.salePrice.toLocaleString()}</span>
                                                <span className="text-xs text-gray-400 line-through">฿{p.price.toLocaleString()}</span>
                                            </div>
                                        ) : (
                                            <span>฿{p.price.toLocaleString()}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${p.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {p.stock} ชิ้น
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={() => onEdit?.(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit3 size={18} /></button>
                                            <button onClick={() => onDelete?.(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    ไม่มีสินค้าที่ตรงกับเงื่อนไข
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagement;
