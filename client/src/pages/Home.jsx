import {Bell, MessageCircle, Search, ChevronDown} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import MobileNav from "@/components/Dock.jsx";


export default function HomePage() {

    function TopBarHome() {
        return (
            <div className="h-fit flex justify-between items-center px-4 py-2 border-b border-gray-300">
                {/* Dropdown Section */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-lg font-semibold">
                            For You <ChevronDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>For You</DropdownMenuItem>
                        <DropdownMenuItem>Popular</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Icons Section */}
                <div className="flex gap-4 items-center">
                    <Button variant="outline" size="icon-lg">
                        <Search className="cursor-pointer"/>
                    </Button>
                    <Button variant="outline" size="icon-lg">
                        <MessageCircle className="cursor-pointer"/>
                    </Button>
                    <Button variant="outline" size="icon-lg">
                        <Bell className="cursor-pointer"/>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={"grid grid-cols-1 min-h-screen"}>
            <TopBarHome/>
            <div className={"border-1 border-red"}>

            </div>
            <MobileNav/>
        </div>
    )
}