import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArrowBigUp, ArrowBigDown, MessageCircle} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button.jsx";

export default function Comments({comment, username, userImg}) {
    return (
        <Card className="shadow-sm rounded-xl p-0">
            <CardContent className="flex items-start gap-4 p-4">
                {/* Avatar */}
                <Avatar className="w-12 h-12">
                    <AvatarImage src={userImg} alt={username}/>
                    <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                {/* Comment content + votes */}
                <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm">{username}</h4>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                            time
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{comment?.content}</p>

                    <div className="flex items-center gap-2 mt-2">
                        <Button variant="ghost" size="icon">
                            <ArrowBigUp className="w-5 h-5"/>
                        </Button>
                        <span className="text-sm">0</span>
                        <Button variant="ghost" size="icon">
                            <ArrowBigDown className="w-5 h-5"/>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
