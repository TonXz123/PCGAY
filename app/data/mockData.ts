import { Customer } from "../type/customer";
import { Order } from "../type/order";

export const orders: Order[] = [
    {
        id: "ORD-9901",
        customer: "สมชาย ใจดี",
        items: "Intel i9-14900K x1",
        total: 22900,
        status: "สำเร็จ",
        date: "2024-03-20",
    },
];

export const customers: Customer[] = [
    {
        id: "CUST-001",
        name: "สมชาย ใจดี",
        email: "somchai.j@example.com",
        phone: "081-234-5678",
        ordersCount: 5,
        totalSpent: 125400,
        lastOrder: "2024-03-20",
    },
];
