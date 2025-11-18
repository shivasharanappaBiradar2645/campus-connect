import { Button } from "@/components/ui/button.jsx";
import { Home, BadgePlus, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MobileNav({ setCreatePost }) {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
        if (location.pathname === "/profile") return "profile";
        if (location.pathname === "/") return "home";
        return "";
    };

    const activeTab = getActiveTab();

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-white flex justify-around items-center py-3 z-50">
            <Button
                variant="ghost"
                className="p-4 hover:bg-gray-100"
                onClick={() => navigate("/")}
            >
                <Home className="!size-6" fill={activeTab === "home" ? "black" : "none"} />
            </Button>

            <Button
                variant="ghost"
                className="p-4 hover:bg-gray-100"
                onClick={() => setCreatePost(true)}
            >
                <BadgePlus className="!size-8" fill={activeTab === "create" ? "black" : "none"} />
            </Button>

            <Button
                variant="ghost"
                className="p-4 hover:bg-gray-100"
                onClick={() => navigate("/profile")}
            >
                <User className="!size-6" fill={activeTab === "profile" ? "black" : "none"} />
            </Button>
        </div>
    );
}
