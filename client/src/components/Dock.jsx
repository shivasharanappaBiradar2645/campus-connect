import {Button} from "@/components/ui/button.jsx";
import {Home, PlusCircle, User} from "lucide-react";

export default function MobileNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-white flex justify-around items-center  z-50">
            <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 p-2 h-auto w-auto"
            >
                <Home className="w-10 h-10" />
                <span className="text-base font-semibold">Home</span>
            </Button>

            <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 p-2 h-auto w-auto"
            >
                <PlusCircle className="w-12 h-12" />
                <span className="text-base font-semibold">Create</span>
            </Button>

            <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 p-2 h-auto w-auto"
            >
                <User className="w-10 h-10" />
                <span className="text-base font-semibold">Profile</span>
            </Button>
        </div>
    )
}