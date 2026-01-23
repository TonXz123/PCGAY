interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-black text-gray-800">{value}</p>
        </div>
    </div>
);

export default StatCard;
