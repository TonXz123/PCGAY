import { MoreVertical } from "lucide-react";
import { Customer } from "@/app/type/customer";

interface Props {
    customers: Customer[];
}

const CustomerManagement: React.FC<Props> = ({ customers }) => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">ฐานข้อมูลลูกค้า (Customers)</h2>
                <p className="text-gray-500 text-sm">ข้อมูลติดต่อและประวัติการสั่งซื้อ</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-400 font-bold">
                            <tr>
                                <th className="px-6 py-4">ลูกค้า</th>
                                <th className="px-6 py-4">ติดต่อ</th>
                                <th className="px-6 py-4">จำนวนออเดอร์</th>
                                <th className="px-6 py-4">ยอดสั่งซื้อสะสม</th>
                                <th className="px-6 py-4">สั่งซื้อล่าสุด</th>
                                <th className="px-6 py-4 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {customers.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold">
                                            {c.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold">{c.name}</p>
                                            <p className="text-xs text-gray-400">{c.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-700">{c.email}</p>
                                        <p className="text-xs text-gray-400">{c.phone}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-bold text-slate-700">{c.ordersCount}</span> ครั้ง
                                    </td>
                                    <td className="px-6 py-4 font-bold text-blue-600">
                                        ฿{c.totalSpent.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {c.lastOrder}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-2"><MoreVertical size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerManagement;
