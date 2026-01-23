import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Monitor,
    LogOut,
    Home
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

type View = "/" | "dashboard" | "products" | "orders" | "customers";

interface SidebarProps {
    view: View;
    setView: (v: View) => void;
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    view,
    setView,
    isOpen,
}) => {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    const NavItem = ({
        icon,
        label,
        value,
    }: {
        icon: React.ReactNode;
        label: string;
        value: View;
    }) => (
        <button
            onClick={() => {
                if (value === '/') {
                    router.push('/');
                } else {
                    setView(value);
                }
            }}
            className={` 
                w-full flex items-center p-3 rounded-xl transition-all duration-200
                ${view === value
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
                ${!isOpen && 'justify-center'}
            `}
        >
            <span className="shrink-0">{icon}</span>
            {isOpen && <span className="ml-3 font-medium text-sm">{label}</span>}
        </button>
    );

    return (
        <aside
            className={`fixed h-full bg-[#0f172a] text-white transition-all duration-300 z-50 flex flex-col ${isOpen ? "w-64" : "w-20"
                }`}
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                    <Monitor size={20} />
                </div>
                {isOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap">COM-SHOP</span>}
            </div>

            <nav className="mt-4 px-4 space-y-1 flex-1">
                <NavItem icon={<Home size={20} />} label="หน้าแรก" value="/" />
                <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" value="dashboard" />
                <NavItem icon={<Package size={20} />} label="จัดการสินค้า" value="products" />
                <NavItem icon={<ShoppingCart size={20} />} label="คำสั่งซื้อ" value="orders" />
                <NavItem icon={<Users size={20} />} label="ลูกค้า" value="customers" />
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className={`
                        w-full flex items-center p-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-slate-800 hover:text-red-300
                        ${!isOpen && 'justify-center'}
                    `}
                >
                    <span className="shrink-0"><LogOut size={20} /></span>
                    {isOpen && <span className="ml-3 font-medium text-sm">ออกจากระบบ</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
