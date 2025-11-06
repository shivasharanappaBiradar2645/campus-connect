import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArrowBigUp, ArrowBigDown, MessageCircle} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button.jsx";
import {useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea.jsx";

export default function Comments({comment, authorId}) {
    const BASE = 'https://campus-connect-98bf.onrender.com'
    const [author, setAuthor] = useState({});


    useEffect(() => {
        async function fetchAuthorData() {
            try {
                const res = await fetch(`${BASE}/comments/${authorId}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });

                const data = await res.json();

                if (res.ok) {
                    console.log(data[0])
                    setAuthor(data[0])
                } else {
                    console.log("fail")
                }

            } catch (err) {
                console.error(err);
            }
        }

        fetchAuthorData();
    }, [authorId])


    return (
        <Card className="shadow-sm rounded-xl p-0 my-2">
            <CardContent className="flex items-start gap-4 p-4">
                {/* Avatar */}
                <Avatar className="w-12 h-12">
                    <AvatarImage src={author.imageUrl} alt={author.username}/>
                    <AvatarFallback>
                        {author.username?.substring(0, 1).toUpperCase() || "?"}
                    </AvatarFallback>
                </Avatar>

                {/* Comment content + votes */}
                <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm">{author.username}</h4>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
                            {comment.createdAt
                                ? (() => {
                                    const diffMs = Date.now() - new Date(comment.createdAt).getTime();
                                    const diffSec = Math.floor(diffMs / 1000);
                                    const diffMin = Math.floor(diffSec / 60);
                                    const diffHr = Math.floor(diffMin / 60);
                                    const diffDay = Math.floor(diffHr / 24);

                                    if (diffSec < 60) return `${diffSec}s ago`;
                                    if (diffMin < 60) return `${diffMin}m ago`;
                                    if (diffHr < 24) return `${diffHr}h ago`;
                                    return `${diffDay}d ago`;
                                })()
                                : ""}
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
