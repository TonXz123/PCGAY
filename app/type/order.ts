export type OrderStatus = "สำเร็จ" | "รอดำเนินการ" | "ยกเลิก";

export interface Order {
    id: string;
    customer: string;
    items: string;
    total: number;
    status: OrderStatus;
    date: string;
}
