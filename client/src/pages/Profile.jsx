import MobileNav from "@/components/Dock.jsx";
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import Posts from "@/components/Posts.jsx";

export default function ProfilePage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* main */}
            <div className="flex-grow  flex justify-center">
                {/* grid */}
                <Card className="w-full max-w-md shadow-md rounded-2xl">
                    <CardContent className="p-6">
                        {/* flex: Profile photo + edit button */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-4">
                                {/* Profile photo */}
                                <Avatar className="w-16 h-16">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Profile"/>
                                    <AvatarFallback>SN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-semibold">Swapnil Naik</h2>
                                    <p className="text-sm text-gray-500">@swapnil</p>
                                </div>
                            </div>

                            {/* Edit button */}
                            <Button variant="outline" size="sm">
                                Edit
                            </Button>
                        </div>

                        {/* bio */}
                        <div className="mt-5">
                            <p>Computer enthusiast • Loves coding • Skyrim enjoyer • Loves coding</p>

                        </div>
                    </CardContent>

                    <div className={"flex flex-row justify-evenly border-t border-b"}>
                        <div className={"p-3"}>Posts</div>
                        <div className={"p-3"}>Comments</div>
                        {/*<div className={"p-3"}>Upvotes</div>*/}
                        {/*<div className={"p-3"}>Downvotes</div>*/}
                    </div>

                    {/* main section to display posts and comments*/}
                    <div>

                    </div>
                </Card>


            </div>

            {/* Mobile nav */}
            <MobileNav/>
        </div>
    )
}
