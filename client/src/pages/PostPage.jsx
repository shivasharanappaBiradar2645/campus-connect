import {Button} from "@/components/ui/button.jsx";
import {Toaster} from "@/components/ui/sonner.jsx";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import {ArrowBigDown, ArrowBigUp, Ellipsis, MessageCircle, Trash} from "lucide-react";
import Comments from "@/components/Comments.jsx";
import {Textarea} from "@/components/ui/textarea.jsx";
import {toast} from "sonner";
import {ArrowLeft} from 'lucide-react';
import {SendHorizontal} from 'lucide-react';


export default function PostPage() {
    const navigate = useNavigate();
    const BASE = 'http://localhost:3000'
    const {id, pageId} = useParams();
    const [prevPage, setPrevPage] = useState("");
    const [post, setPost] = useState(null);
    const [fetchComments, setFetchComments] = useState(false);
    const [token, setToken] = useState("");

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    async function handleSubmitComment() {
        try {

            const body = {threadId: id, parentId: null, content: newComment};

            const res = await fetch(`${BASE}/comments/`, {
                method: "POST", headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),

            });

            if (res.ok) {
                toast.success("Comment add successfully!");
                setNewComment("");
                setFetchComments(!fetchComments);
            } else {
                toast.error("Something went wrong");
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (!storedToken) {
            navigate("/auth");
        } else {
            setToken(storedToken);
        }
    }, [navigate]);

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
    }, [id, fetchComments])

    return (
        <>
            {post && comments ? (
                <div className="flex flex-col min-h-screen bg-background">
                    {/* Header */}
                    <div
                        className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
                        <Button variant="outline" size="icon-lg" onClick={() => navigate(-1)}>
                            <ArrowLeft/>
                        </Button>
                        <h1 className="text-lg font-semibold w-full text-center text-gray-800">
                            Post Details
                        </h1>
                        <div className="w-16"/>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 w-full max-w-4xl mx-auto p-6 space-y-8">
                        {/* Post Section */}
                        <div className="bg-white border rounded-2xl shadow-sm p-6">
                            <h1 className="text-2xl font-semibold mb-4 text-gray-900 font-[Header]">
                                {post.title || ""}
                            </h1>

                            <div
                                className="editor-content prose max-w-none text-gray-800 mb-6"
                                dangerouslySetInnerHTML={{__html: post.content || ""}}
                            />

                            {/* Actions */}
                            <div className="flex justify-between items-center text-gray-600 border-t pt-4">
                                {/* Upvote/Downvote */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            // handleUpVote(post.id)
                                        }}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        <ArrowBigUp className="w-6 h-6"/>
                                    </button>
                                    <h1>0</h1>
                                    <button
                                        onClick={() => {
                                            // handleDownVote(post.id)
                                        }}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <ArrowBigDown className="w-6 h-6"/>
                                    </button>
                                </div>

                                {/* Comments */}
                                <div
                                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                                    <MessageCircle className="w-5 h-5"/>
                                    <span className="text-sm font-medium">
                                    {comments?.length} Comments
                                </span>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="rounded-2xl space-y-4">
                            <h2 className="text-lg font-semibold mb-3 text-gray-900  pt-3">Comments</h2>

                            {comments.length === 0 ? (
                                <p className="text-gray-500 italic">No comments yet.</p>
                            ) : (
                                comments.map((item, index) => (
                                    <Comments
                                        comment={item}
                                        key={index}
                                        username={"username"}
                                        userImg={"notFound"}
                                        authorId={item.authorId}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                    <div className="h-[5rem]"/>

                    <Toaster richColors position="top-right"/>

                    <div
                        className="flex gap-2 items-center p-4 fixed bottom-0 w-full bg-background border-t border-gray-200">
                        <Textarea
                            placeholder="Write a comment..."
                            className="flex-1 rounded-lg border border-gray-100 px-3 py-2 resize-none  focus:border-gray-400 text-sm"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={1}
                        />
                        <Button
                            varient="outline"
                            size="icon-lg"
                            onClick={handleSubmitComment}
                        >
                            <SendHorizontal/>
                        </Button>
                    </div>
                </div>

            ) : (
                <h1></h1>
            )}
        </>
    )

}