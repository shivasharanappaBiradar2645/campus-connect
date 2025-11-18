import {useEffect, useState} from "react"
import {Bell, MessageCircle, Search, ChevronDown} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import MobileNav from "@/components/Dock.jsx"
import Posts from "@/components/Posts.jsx"
import Create from "@/pages/Create.jsx";
import {useNavigate} from "react-router-dom";

export default function HomePage() {
    const BASE = 'http://localhost:3000'
    const [postData, setPostData] = useState([])
    const [comments, setComments] = useState([])
    const [token, setToken] = useState("")
    const [fetchPosts, setFetchPosts] = useState(true)
    const [createPost, setCreatePost] = useState(false)
    const [userId, setUserId] = useState()
    const navigate = useNavigate();

    function TopBarHome() {
        return (
            <div className="h-fit flex justify-between items-center px-4 py-2 border-b border-gray-300 bg-(--accent)">
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

                <div className="flex gap-4 items-center">
                    {/*<Button variant="outline" size="icon-lg">*/}
                    {/*    <Search/>*/}
                    {/*</Button>*/}
                    {/*<Button variant="outline" size="icon-lg">*/}
                    {/*    <MessageCircle/>*/}
                    {/*</Button>*/}
                    {/*<Button variant="outline" size="icon-lg">*/}
                    {/*    <Bell/>*/}
                    {/*</Button>*/}

                    <span className={"font-[Header] text-2xl"}>Campus Connect</span>
                </div>
            </div>
        )
    }

    useEffect(() => {

        async function getUserId() {
            try {
                const res = await fetch(`${BASE}/userId`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })
                const data = await res.json()
                if (res.ok) {
                    // console.log("userId: "+data.userId)
                    setUserId(data.userId);
                } else {
                    console.error(data)
                }
            } catch (err) {
                console.error(err)
            }
        }

        if (token) {
            getUserId()
        }
    }, [token])

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`${BASE}/threads`, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                })
                const data = await res.json()
                if (res.ok) {
                    setPostData(data)
                    console.log(data)
                } else {
                    console.log(data)
                }
            } catch (err) {
                console.log(err)
            }
        }

        fetchPost()
    }, [fetchPosts])

    useEffect(() => {
        if (postData.length === 0) return

        async function fetchCommentsForAll() {
            try {
                const results = await Promise.all(
                    postData.map((post) =>
                        fetch(`${BASE}/threads/${post.id}/comments`, {
                            method: "GET",
                            headers: {"Content-Type": "application/json"},
                        }).then((r) => r.json())
                    )
                )
                setComments(results)
            } catch (err) {
                console.log(err)
            }
        }

        fetchCommentsForAll()
    }, [postData])

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (!storedToken) {
            navigate("/auth");
        } else {
            setToken(storedToken);
        }
    }, [navigate]);


    //TODO remove after testing

    useEffect(() => {
        console.log("user Id: " + userId);
    }, [userId])
    // useEffect(() => {
    //     console.log(comments)
    // }, [comments])
    // useEffect(() => {
    //     console.log(postData)
    // }, [postData])


    if (createPost) {
        return <Create setCreatePost={setCreatePost}/>
    } else {

        return (
            <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
                <TopBarHome/>

                <div className="overflow-y-scroll flex flex-col">
                    {postData.map((post, index) => (
                        <Posts
                            post={post}
                            key={index}
                            comments={comments}
                            fetchPosts={fetchPosts}
                            setFetchPosts={setFetchPosts}
                            userId={userId}
                            actions={false}
                        />
                    ))}
                </div>

                {/*spacer*/}
                <div className="h-[3rem]"/>

                <MobileNav setCreatePost={setCreatePost}/>
            </div>
        )
    }

}
