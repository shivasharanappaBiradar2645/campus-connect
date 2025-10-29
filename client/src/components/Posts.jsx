import {ArrowBigUp, ArrowBigDown, MessageCircle} from "lucide-react"
import {useEffect, useState} from "react";

export default function Posts({post, comments}) {
    const [postComments, setPostComments] = useState([]);

    useEffect(() => {
        if (!comments || comments.length === 0) return;

        const filtered = comments.flat().filter(c => c.threadId === post.id);
        setPostComments(filtered);
    }, [comments, post]);

    // console.log("postComments:", postComments);

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
                    <button className="hover:text-blue-600 transition-colors">
                        <ArrowBigUp className="w-6 h-6"/>
                    </button>
                    <button className="hover:text-red-500 transition-colors">
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
