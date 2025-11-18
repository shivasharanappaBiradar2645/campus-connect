import MobileNav from "@/components/Dock.jsx";
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Posts from "@/components/Posts.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Comments from "@/components/Comments.jsx";
import Create from "@/pages/Create.jsx";
import {Ghost} from 'lucide-react';
import {Settings} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";

export default function ProfilePage() {
    const BASE = 'http://localhost:3000'
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [userData, setUserData] = useState();
    const [userId, setUserId] = useState()
    const [createPost, setCreatePost] = useState(false)


    function ProfileTopBar() {
        const navigate = useNavigate();

        return (
            <div className="flex items-center justify-between py-2 px-5 border-b bg-white sticky top-0 ">
                <h1 className="text-xl font-semibold">Profile</h1>

                <Button
                    variant="ghost"
                    size="icon-lg"
                    className="hover:bg-gray-100"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-lg" className="hover:bg-gray-100">
                                <Settings className="!size-6"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                                localStorage.clear();
                                navigate('/auth')
                            }}>
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Button>
            </div>
        );
    }

    function EmptyProfile() {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-gray-400">
                <Ghost className="w-20 h-20 mb-4"/>
                <h2 className="text-lg font-semibold text-center">
                    Zero content. Impressive… in a sad way
                </h2>
            </div>
        );
    }

    async function getUserProfile() {
        if (token) {
            try {
                const res = await fetch(`${BASE}/profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })
                const data = await res.json()

                if (res.ok) {
                    console.log(data);
                    setUser(data);
                } else if (res.status === 401) {
                    localStorage.clear()
                    navigate("/auth")
                } else {
                    console.error(data);
                }

            } catch (err) {
                console.error(err)
            }
        }
    }

    async function getUserProfileExtended() {
        if (token) {
            try {
                const res = await fetch(`${BASE}/profileextend`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })
                const data = await res.json()

                if (res.ok) {
                    console.log(data);
                    setUserData(data);
                } else if (res.status === 401) {
                    localStorage.clear()
                    navigate("/auth")
                } else {
                    console.error(data);
                }

            } catch (err) {
                console.error(err)
            }
        }
    }

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

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (!storedToken) {
            navigate("/auth");
        } else {
            setToken(storedToken);
        }
    }, [navigate]);

    useEffect(() => {
        if (token) {
            getUserId()
            getUserProfile();
            getUserProfileExtended();
        }
    }, [token])


    if (createPost) {
        return <Create setCreatePost={setCreatePost}/>
    } else {
        return (
            <div className="min-h-screen flex flex-col">
                <div className="flex-grow flex-row justify-center">
                    <ProfileTopBar/>
                    <Card className="w-full max-w-md shadow-none border-none">
                        <CardContent className="p-5 py-0">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16 border-1">
                                        <AvatarImage src={user?.imageUrl} alt="Profile"/>
                                        <AvatarFallback>{user?.username?.split("")[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="text-xl font-[header]">{user?.name}</h2>
                                        <p className="text-sm text-gray-500">{"@" + user?.username + " • " + user?.role} </p>
                                    </div>
                                </div>

                                {/* Edit button */}
                                <Button variant="outline" size="sm">
                                    Edit
                                </Button>
                            </div>

                            {/* bio */}
                            <div className="mt-6 font-[Header] text-xl">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div>
                        </CardContent>

                        <Tabs defaultValue="posts" className="w-full">
                            <TabsList className="w-full flex justify-evenly border-t border-b">
                                <TabsTrigger value="posts" className="flex-1 p-3 text-center">
                                    Posts
                                </TabsTrigger>
                                <TabsTrigger value="comments" className="flex-1 p-3 text-center">
                                    Comments
                                </TabsTrigger>
                                {/*<TabsTrigger value="votes" className="flex-1 p-3 text-center">*/}
                                {/*    Votes*/}
                                {/*</TabsTrigger>*/}
                            </TabsList>

                            <TabsContent value="posts" className="p-2">
                                {/* Render posts */}

                                {userData?.thread.length === 0
                                    ? <EmptyProfile/>
                                    : userData?.thread?.map((item, index) => (
                                        <Posts post={item} key={index} actions={true} userId={userId}/>
                                    ))
                                }

                            </TabsContent>

                            <TabsContent value="comments" className="p-2">
                                {/*Render comments */}
                                {userData?.comment.length === 0
                                    ? <EmptyProfile/>
                                    : userData?.comment?.map((item, index) => (
                                        <Comments comment={item} key={index} authorId={item.authorId}/>
                                    ))
                                }
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>

                {/*spacer*/}
                <div className="h-[5rem]"/>

                {/* Mobile nav */}
                <MobileNav setCreatePost={setCreatePost}/>
            </div>
        )
    }
}
