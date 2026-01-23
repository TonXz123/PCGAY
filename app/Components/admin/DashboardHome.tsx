import { Package, ShoppingCart, Zap } from "lucide-react";
import StatCard from "./StatCard";

interface Props {
    products: any[];
    orders: any[];
}

const DashboardHome: React.FC<Props> = ({ products, orders }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800">ภาพรวมระบบ</h2>
                <p className="text-gray-500">ยินดีต้อนรับกลับมา, ข้อมูลล่าสุดของวันนี้</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="สินค้าทั้งหมด" value={products.length} icon={<Package className="text-blue-600" />} color="bg-blue-50" />
                <StatCard title="ยอดขายเดือนนี้" value="฿2,450,000" icon={<Zap className="text-yellow-600" />} color="bg-yellow-50" />
                <StatCard title="คำสั่งซื้อรอนุมัติ" value={orders.filter(o => o.status === 'รอดำเนินการ').length} icon={<ShoppingCart className="text-red-600" />} color="bg-red-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">คำสั่งซื้อล่าสุด</h3>
                    <div className="space-y-4">
                        {orders.slice(0, 3).map(o => (
                            <div key={o.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                        <ShoppingCart size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{o.customer}</p>
                                        <p className="text-xs text-gray-400">{o.id}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold">฿{o.total.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 italic">
                    พื้นที่สำหรับกราฟสรุปยอดขาย (Chart.js)
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
