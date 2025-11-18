import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArrowBigUp, ArrowBigDown, MessageCircle} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Comments({comment, authorId}) {
    const BASE = 'http://localhost:3000'
    const [author, setAuthor] = useState({});
    const [token, setToken] = useState("");
    const [reFetch, setReFetch] = useState(true);
    const navigate = useNavigate();
    const [vote, setVote] = useState(0);
    const [voteCount, setVoteCount] = useState(0);
    const [voteData, setVoteData] = useState([]);

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
                    console.log("failed")
                }

            } catch (err) {
                console.error(err);
            }
        }

        fetchAuthorData();
    }, [authorId])

    useEffect(() => {
        async function fetchVotes() {
            try {
                const res = await fetch(`${BASE}/votes/${comment.id}`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });

                const data = await res.json();

                if (res.ok) {
                    setVoteCount(data.upVote - data.downVote);
                    setVoteData(data.voteThreads);
                }
            } catch (e) {
                console.error(e);
            }
        }

        fetchVotes();
    }, [comment.id, reFetch]);

    useEffect(() => {
        let found = false;

        voteData.map((v) => {
            if (v.userId === authorId) {
                found = true;
                v.type === "upvote" ? setVote(1) : setVote(-1);
            }
        });

        if (!found) setVote(0);
    }, [voteData, authorId, reFetch]);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (!storedToken) {
            navigate("/auth");
        } else {
            setToken(storedToken);
        }
    }, [navigate]);

    return (
        <Card className="shadow-sm rounded-xl mx-4 my-2">
            <CardContent className="flex items-start gap-4 px-4">
                {/* Avatar */}
                <Avatar className="w-12 h-12">
                    <AvatarImage src={author.imageUrl} alt={author.username}/>
                    <AvatarFallback>
                        {author?.username?.substring(0, 1).toUpperCase() || "?"}
                    </AvatarFallback>
                </Avatar>

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
                        <Button variant="ghost" size="icon" onClick={() => handleUpVote(comment.id)}>
                            <ArrowBigUp
                                fill={vote === 1 ? "#ff5b34" : "none"}
                                stroke={vote === 1 ? "#cc4b2c" : "#000"}
                                className={0 < vote ? "!size-6" : "!size-5"}
                            />
                        </Button>

                        <span className="text-sm">{voteCount}</span>

                        <Button variant="ghost" size="icon" onClick={() => handleDownVote(comment.id)}>
                            <ArrowBigDown
                                fill={vote === -1 ? "#5374E0" : "none"}
                                stroke={vote === -1 ? "#3d56a8" : "#000"}
                                className={0 > vote ? "!size-6" : "!size-5"}
                            />
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
