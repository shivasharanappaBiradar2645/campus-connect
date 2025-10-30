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

const BASE = 'http://localhost:3000'
import Posts from "@/components/Posts.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Comments from "@/components/Comments.jsx";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [userData, setUserData] = useState();

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
            getUserProfile();
            getUserProfileExtended();
        }
    }, [token])

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow  flex justify-center">
                <Card className="w-full max-w-md shadow-md rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src={user?.imageUrl} alt="Profile"/>
                                    <AvatarFallback>{user?.username?.split("")[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                                    <p className="text-sm text-gray-500">{"@" + user?.username + " • " + user?.role} </p>
                                </div>
                            </div>

                            {/* Edit button */}
                            <Button variant="outline" size="sm">
                                Edit
                            </Button>
                        </div>

                        {/* bio */}
                        <div className="mt-5">
                            {/*<p>{user.email}</p>*/}
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
                            <TabsTrigger value="votes" className="flex-1 p-3 text-center">
                                Votes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="p-4">
                            {/* Render posts */}

                            {userData?.thread.length === 0
                                ? <p className="text-gray-500">Wow so empty</p>
                                : userData?.thread?.map((item, index) => (
                                    <Posts post={item} key={index}/>
                                ))
                            }

                        </TabsContent>

                        <TabsContent value="comments" className="p-4">
                            {/*Render comments */}
                            {userData?.comment.length === 0
                                ? <p className="text-gray-500">No comments yet.</p>
                                : userData?.comment?.map((item, index) => (
                                    <Comments comment={item} key={index} username={userData?.profile?.username} userImg={userData?.profile?.imageUrl}/>
                                ))
                            }
                        </TabsContent>

                        <TabsContent value="votes" className="p-4">
                            {/* Render votes */}

                            {userData?.vote.length === 0
                                ? <p className="text-gray-500">No votes yet.</p>
                                : <h1>you have votes</h1>
                            }


                        </TabsContent>
                    </Tabs>
                </Card>
            </div>

            {/* Mobile nav */}
            <MobileNav/>
        </div>
    )
}
