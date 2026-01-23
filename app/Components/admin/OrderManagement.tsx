import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { Order } from "@/app/type/order";

interface Props {
    orders: Order[];
}

const OrderManagement: React.FC<Props> = ({ orders }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">จัดการคำสั่งซื้อ (Orders)</h2>
                    <p className="text-gray-500 text-sm">ติดตามสถานะและการชำระเงินของลูกค้า</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-400 font-bold">
                        <tr>
                            <th className="px-6 py-4">ID / วันที่</th>
                            <th className="px-6 py-4">ลูกค้า</th>
                            <th className="px-6 py-4">รายการสินค้า</th>
                            <th className="px-6 py-4">ยอดรวม</th>
                            <th className="px-6 py-4">สถานะ</th>
                            <th className="px-6 py-4 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {orders.map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold">{o.id}</div>
                                    <div className="text-xs text-gray-400">{o.date}</div>
                                </td>
                                <td className="px-6 py-4 font-medium">{o.customer}</td>
                                <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{o.items}</td>
                                <td className="px-6 py-4 font-bold">฿{o.total.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={o.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1 ml-auto">
                                        <Eye size={18} />
                                        <span>ดูรายละเอียด</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
