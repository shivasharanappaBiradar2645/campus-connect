import {Button} from "@/components/ui/button.jsx";
import {Home, PlusCircle, User} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Label} from "@/components/ui/label"
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/select"
import {useState} from "react";

export default function MobileNav() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [visibility, setVisibility] = useState("public")
    const navigate = useNavigate();

    return (
        <div
            className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-white flex justify-around items-center  z-50">
            <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 p-2 h-auto w-auto"
                onClick={() => {
                    navigate("/")
                }}
            >
                <Home className="w-10 h-10"/>
                <span className="text-base font-semibold">Home</span>
            </Button>

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex flex-col items-center gap-1 p-2 h-auto w-auto"
                    >
                        <PlusCircle className="w-12 h-12"/>
                        <span className="text-base font-semibold">Create</span>
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                    </DialogHeader>

                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Write something..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label>Visibility</Label>
                            <Select value={visibility} onValueChange={setVisibility}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select visibility"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 p-2 h-auto w-auto"
                onClick={() => {
                    navigate("/profile")
                }}
            >
                <User className="w-10 h-10"/>
                <span className="text-base font-semibold">Profile</span>
            </Button>
        </div>
    )
}