import {ArrowBigUp, ArrowBigDown, MessageCircle} from "lucide-react"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Posts({post, comments}) {
    const BASE = 'http://localhost:3000'
    const [postComments, setPostComments] = useState([]);
    const [voteCount, setVoteCount] = useState(0);
    const [token, setToken] = useState("");
    const [reFetch, setReFetch] = useState(true);
    const navigate = useNavigate();

    async function fetchVoteCount(Id) {
        try {
            const res = await fetch(`${BASE}/votes/${Id}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            })
            const data = await res.json()
            if (res.ok) {
                setVoteCount(data.downvote - data.upvote)
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
                body: JSON.stringify({threadId: Id, type:"upvote"})
            })
            const data = await res.json()

            if (res.ok) {
                console.log(data);
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

    async function handleDownVote(Id) {
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
                console.log(data);
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

    // console.log("postComments:", postComments);
    useEffect(() => {
        console.log("token: " + token);
    }, [token]);

    useEffect(() => {
        console.log("vote: " + voteCount)
    }, [voteCount]);

    return (
        <div
            className="border border-gray-200 rounded-2xl shadow-sm p-4 m-4 bg-white hover:shadow-md transition-shadow">
            <div>
                {/*main content*/}
                <h1 className="text-xl font-semibold mb-2">{post.title}</h1>
                <p className="text-gray-700 leading-relaxed">
                    {post.content}
                </p>
            </div>

            {/*actions*/}
            <div className="flex justify-between items-center mt-4 text-gray-600">
                {/*upvote downvote*/}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            handleUpVote(post.id)
                        }}
                        className="hover:text-blue-600 transition-colors">
                        <ArrowBigUp className="w-6 h-6"/>
                    </button>
                    <h1>{voteCount}</h1>
                    <button
                        onClick={() => {
                            handleDownVote(post.id)
                        }}
                        className="hover:text-red-500 transition-colors">
                        <ArrowBigDown className="w-6 h-6"/>
                    </button>
                </div>

                {/*comments*/}
                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-5 h-5"/>
                    <span className="text-sm font-medium">{postComments.length} Comments</span>
                </div>
            </div>
        </div>
    )
}
