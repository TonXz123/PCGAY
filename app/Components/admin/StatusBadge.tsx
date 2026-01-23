import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
    status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const configs: Record<string, { bg: string; icon: React.ReactNode }> = {
        "สำเร็จ": { bg: "bg-green-50 text-green-600", icon: <CheckCircle size={14} /> },
        "รอดำเนินการ": { bg: "bg-yellow-50 text-yellow-600", icon: <Clock size={14} /> },
        "ยกเลิก": { bg: "bg-red-50 text-red-600", icon: <AlertCircle size={14} /> }
    };

    const config = configs[status] || configs["สำเร็จ"];

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg}`}>
            {config.icon}
            {status}
        </div>
    );
};

export default StatusBadge;
