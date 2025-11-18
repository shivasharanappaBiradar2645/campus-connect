import {ArrowBigUp, ArrowBigDown, MessageCircle} from "lucide-react"
import {Ellipsis} from 'lucide-react';
import {Trash} from 'lucide-react';
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

export default function Posts({post, comments, fetchPosts, setFetchPosts, actions, userId}) {
    const BASE = 'http://localhost:3000'
    const [postComments, setPostComments] = useState([]);
    const [voteCount, setVoteCount] = useState(0);
    const [token, setToken] = useState("");
    const [reFetch, setReFetch] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [pageId, setPageId] = useState(1);
    const [vote, setVote] = useState(0);
    const [voteData, setVoteData] = useState([]);

    async function fetchVoteCount(Id) {
        try {
            const res = await fetch(`${BASE}/votes/${Id}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            })
            const data = await res.json()
            if (res.ok) {
                setVoteCount(data.upVote - data.downVote);
                setVoteData(data.voteThreads)
                console.log(data)

            } else {
                console.error(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function handleUpVote(Id) {
        try {
            const res = await fetch(`${BASE}/votes/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({threadId: Id, type: "upvote"})
            })


            const data = await res.json()
            if (res.ok) {
                setReFetch(!reFetch)
            } else if (res.status === 403) {
                localStorage.clear()
                navigate("/auth")
            } else if (res.status === 409) {
                await handleVoteDelete(Id)
                setReFetch(!reFetch)
            } else {
                console.error(data);
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function handleDownVote(Id) {
        try {
            const res = await fetch(`${BASE}/votes/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({threadId: Id, type: "downvote"})
            })

            const data = await res.json()

            if (res.ok) {
                setReFetch(!reFetch)
            } else if (res.status === 403) {
                localStorage.clear()
                navigate("/auth")
            } else if (res.status === 409) {
                await handleVoteDelete(Id)
                setReFetch(!reFetch)
            } else {
                console.error(data);
            }

        } catch (err) {
            console.error(err)
        }
    }

    async function handleVoteDelete(Id) {
        try {
            const res = await fetch(`${BASE}/votes/${Id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            })
            const data = await res.json()

            if (res.ok) {
                setReFetch(!reFetch)
            } else if (res.status === 403) {
                localStorage.clear()
                navigate("/auth")
            } else {
                console.error(data);
            }

        } catch (err) {
            console.error(err)
        }
    }

    async function handleDeletePost(threadId) {
        try {
            const res = await fetch(`${BASE}/threads/${threadId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            })
            const data = await res.json()

            if (res.ok) {
                console.log(data);
                setFetchPosts(!fetchPosts)
            } else {
                console.error(data);
            }

        } catch (err) {
            console.error(err)
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
        if (!comments || comments.length === 0) return;

        const filtered = comments.flat().filter(c => c.threadId === post.id);
        setPostComments(filtered);
    }, [comments, post]);

    useEffect(() => {
        fetchVoteCount(post.id)
    }, [post, reFetch])

    useEffect(() => {
        let foundVote = 0;

        voteData.forEach((item) => {
            if (item.userId === userId) {

                foundVote = item.type === "upvote" ? 1 : -1;
            }
        })

        setVote(foundVote);
    }, [voteData, userId, reFetch]);

    useEffect(() => {
        if (location.pathname === "/") {
            setPageId(1);
        } else {
            setPageId(2);
        }
    }, [location.pathname]);

    //TESTING PURPOSE ONLY

    // console.log("postComments:", postComments);
    // useEffect(() => {
    //     console.log("token: " + token);
    // }, [token]);

    // useEffect(() => {
    //     console.log(vote)
    // }, [vote]);
    //
    // useEffect(() => {
    //     console.log(voteData)
    // }, [voteData]);


    return (
        <div
            className="border border-gray-200 rounded-2xl shadow-sm p-4 m-4 bg-white hover:shadow-md transition-shadow"
        >

            <div
                onClick={() => {
                    navigate(`/post/${post.id}/${pageId}`);
                }}
                className="relative max-h-[25em] overflow-hidden ">

                <div className="flex flex-row justify-between items-center mb-2">
                    <h1 className="text-2xl font-semibold mb-2 font-[Header]">{post.title}</h1>

                    {actions ? <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Ellipsis className="h-5 w-5"/>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className={"bg-red-400"} onClick={() => handleDeletePost(post.id)}>
                                <Trash color={"black"}/> Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> : null}


                </div>
                <div className="editor-content" dangerouslySetInnerHTML={{__html: post?.content}}/>

                <div
                    className="absolute bottom-0 left-0 w-full h-[50%] bg-linear-[180deg,transparent_15%,white_85%] pointer-events-none"/>
            </div>
            {/*actions*/}

            <div className="flex justify-between items-center text-gray-600">
                {/*upvote downvote*/}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            handleUpVote(post.id)
                        }}
                        className="hover:text-orange-600 transition-colors">
                        <ArrowBigUp
                            fill={vote === 1 ? "#ff5b34" : "none"}
                            stroke={vote === 1 ? "#cc4b2c" : "#000"}
                            className={0 < vote ? "!size-7" : "!size-6"}
                        />

                    </button>
                    <h1>{voteCount}</h1>
                    <button
                        onClick={() => {
                            handleDownVote(post.id)
                        }}
                        className="hover:text-blue-500 transition-colors">
                        <ArrowBigDown
                            fill={vote === -1 ? "#5374E0" : "none"}
                            stroke={vote === -1 ? "#3d56a8" : "#000"}
                            className={0 > vote ? "!size-7" : "!size-6"}
                        />

                    </button>
                </div>

                {/*comments*/}
                <div onClick={() => {
                    navigate(`/post/${post.id}/${pageId}`);
                }}
                     className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-5 h-5"/>
                    <span className="text-sm font-medium">{postComments.length} Comments</span>
                </div>
            </div>


        </div>
    )
}
