import {Button} from "@/components/ui/button.jsx";
import {Toaster} from "@/components/ui/sonner.jsx";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {ArrowBigDown, ArrowBigUp, Ellipsis, MessageCircle, Trash} from "lucide-react";
import Comments from "@/components/Comments.jsx";


export default function PostPage() {
    const navigate = useNavigate();
    const BASE = 'http://localhost:3000'
    const {id, pageId} = useParams();
    const [prevPage, setPrevPage] = useState("");
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (pageId === "1") {
            setPrevPage("/")
        } else {
            setPrevPage("/profile")
        }
    }, [pageId])

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`${BASE}/threads/${id}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                })

                const resComments = await fetch(`${BASE}/threads/${id}/comments`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                })

                const comments = await resComments.json()
                const data = await res.json()
                if (res.ok) {
                    setPost(data)
                    console.log(data)
                    setComments(comments)
                    console.log(comments)
                } else {
                    console.log(data)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchPost()
    }, [id])

    return (
        <>
            {post && comments ?
                <div className="flex flex-col min-h-screen">

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
                        <Button variant="ghost"
                                onClick={() => navigate(`${prevPage}`)}
                        >
                            ←
                        </Button>
                        <h1 className="text-lg font-semibold w-full text-center">Create New Post</h1>
                        <div className="w-16"/>
                    </div>


                    <div className="flex flex-row justify-between items-center mb-2">
                        <h1 className="text-xl font-semibold mb-2">{post.title || ""}</h1>


                    </div>
                    <div className="editor-content" dangerouslySetInnerHTML={{__html: post.content || ""}}/>

                    {/*actions*/}

                    <div className="flex justify-between items-center text-gray-600">
                        {/*upvote downvote*/}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    // handleUpVote(post.id)
                                }}
                                className="hover:text-blue-600 transition-colors">
                                <ArrowBigUp className="w-6 h-6"/>
                            </button>
                            <h1>0</h1>
                            <button
                                onClick={() => {
                                    // handleDownVote(post.id)
                                }}
                                className="hover:text-red-500 transition-colors">
                                <ArrowBigDown className="w-6 h-6"/>
                            </button>
                        </div>

                        {/*comments*/}
                        <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                            <MessageCircle className="w-5 h-5"/>
                            <span className="text-sm font-medium">{comments?.length}Comments</span>
                        </div>
                    </div>

                    <div>
                        {comments.length === 0
                            ? <p className="text-gray-500">No comments yet.</p>
                            :
                            comments?.map((item, index) => (
                                <Comments comment={item} key={index} username={"username"}
                                          userImg={"notFound"}/>
                            ))
                        }
                    </div>

                    <Toaster richColors position="top-right"/>
                </div>
                : <h1></h1>
            }
        </>
    )
}