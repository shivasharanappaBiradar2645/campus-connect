import {Button} from "@/components/ui/button.jsx";
import {Home, PlusCircle, User} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/select"
import {useState} from "react";

export default function MobileNav({setCreatePost}) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [visibility, setVisibility] = useState("public")
    const navigate = useNavigate();
    const [currenticon, setCurrenticon] = useState("home")

    return (
        <div
            className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-white flex justify-around items-center py-3 z-50">

            <Button
                variant="ghost"
                className="p-4 hover:bg-gray-100"
                onClick={() => {
                    setCurrenticon("home");
                    setTimeout(() => navigate("/"), 0);
                }}

            >
                <Home  className="!size-6" fill={currenticon === "home" ? "black" : "none"} />

            </Button>

            <Button
                variant="ghost"
                className="p-4 hover:bg-gray-100"
                onClick={() => {setCreatePost(true);
                setCurrenticon("create")}}
            >
                <PlusCircle className="!size-7" fill={currenticon === "create" ? "black" : "none"} />
            </Button>

            <Button
                variant="ghost"
                className="p-4 hover:bg-gray-100"
                onClick={() => {    setCurrenticon("profile");
                    setTimeout(() => navigate("/profile"), 0);
              }}
            >
                <User  className="!size-6" fill={currenticon === "profile" ? "black" : "none"} />
            </Button>
        </div>

    )
}