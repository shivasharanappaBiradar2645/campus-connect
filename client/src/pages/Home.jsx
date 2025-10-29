import {Bell, MessageCircle, Search, ChevronDown} from "lucide-react";

import {Home, PlusCircle, User} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"

function MobileNav() {
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