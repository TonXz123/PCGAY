import { MoreVertical } from "lucide-react";

interface TopbarProps {
    onToggle?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onToggle }) => {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
            <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-100 rounded-lg"
            >
                <MoreVertical size={20} />
            </button>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold">Administrator</p>
                    <p className="text-xs text-gray-400">SUPER ADMIN</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">
                    A
                </div>
            </div>
        </header>
    );
};

export default Topbar;
