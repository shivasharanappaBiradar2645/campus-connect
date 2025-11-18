import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import React, {useEffect, useRef, useState} from 'react'

import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Checklist from '@editorjs/checklist'
import Quote from '@editorjs/quote'
import Delimiter from '@editorjs/delimiter'
import editorjsHTML from 'editorjs-html'
import {useNavigate} from "react-router-dom";
import {Toaster} from "@/components/ui/sonner.jsx"
import {toast} from "sonner"
import {ArrowLeft} from "lucide-react";


    function TextEditor({editorInstance, editorId}) {

        // console.log(editorId.current)

        useEffect(() => {
            if (editorInstance.current) return

            editorInstance.current = new EditorJS({
                holder: editorId.current,
                placeholder: 'Start writing your content here...',
                minHeight: 0,
                tools: {
                    header: {
                        class: Header,
                        config: {
                            placeholder: 'Enter a header',
                            levels: [1, 2, 3, 4, 5],
                            defaultLevel: 2,
                        },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        config: {
                            quotePlaceholder: 'Enter a quote',
                            captionPlaceholder: 'Quote author',
                        },
                    },
                    delimiter: Delimiter,
                },
            });


            return () => {
                if (editorInstance.current && editorInstance.current.destroy) {
                    editorInstance.current.destroy()
                    editorInstance.current = null
                }
            }
        }, [])

        return (
            <div
                id={editorId.current}
                className="border rounded-lg bg-card shadow-sm p-4 focus-within:ring-2 focus-within:ring-ring transition-all h-[55vh] overflow-y-auto"
            />
        )
    }

export default function Create({setCreatePost}) {
    const BASE = 'http://localhost:3000'
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const editorInstance = useRef(null)
    const editorId = useRef(`editor-${Math.random().toString(36).substr(2, 9)}`)

    const [postHeader, setPostHeader] = useState("")
    const [postBody, setPostBody] = useState("")
    const [postType, setPostType] = useState("")

    const edjsParser = editorjsHTML()

    async function handleSave() {
        if (editorInstance.current) {
            const data = await editorInstance.current.save()
            console.log(data)
            const htmlBlock = edjsParser.parse(data)
            setPostBody(htmlBlock)
        }
    }

    async function handleSubmit() {
        await handleSave()

        if (postHeader.length > 0 && postBody.length > 0) {
            try {
                const body = {title: postHeader, content: postBody}
                console.log(body)

                const res = await fetch(`${BASE}/threads`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body),
                })

                const data = await res.json()

                if (res.status === 201) {
                    console.log("Success")
                    toast.success("Post successfully created!");
                    setCreatePost(false)
                } else {
                    toast.error("Something Went Wrong!");
                    console.log("failed")
                }
            } catch (e) {
                console.log(e)
                toast.error("Something Went Wrong!");
            }
        } else {
            toast.error("Must Enter Content");
            console.log("enter header and body")
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

    return (
        <div className="flex flex-col min-h-screen ">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-(--accent) sticky top-0 z-10">
                <Button variant="outline" size="icon-lg" onClick={() => navigate(-1)}>
                    <ArrowLeft/>
                </Button>
                <h1 className="text-lg font-semibold w-full text-center">Create New Post</h1>
                <div className="w-16"/>
            </div>

            {/* Form */}
            <div className="flex flex-col flex-1 p-4 space-y-6 max-w-4xl w-full mx-auto">
                {/* Visibility Dropdown */}
                <div className="max-w-sm">
                    <label className="block mb-1 text-sm font-medium">Visibility</label>
                    <Select defaultValue="public" onValueChange={(value) => setPostType(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select visibility"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                {/* Title */}
                <div className="max-w-2xl">
                    <label className="block mb-1 text-sm font-medium">Title</label>
                    <Input placeholder="Enter post title"
                           value={postHeader}
                           onChange={(e) => setPostHeader(e.target.value)}
                    />
                </div>

                {/* Editor */}
                <div className="max-w-3xl">
                    <TextEditor editorInstance={editorInstance} editorId={editorId}/>
                </div>

                {/* Submit Button */}
                <div className="max-w-3xl">
                    <Button className="w-full" onClick={() => {
                        handleSubmit()
                    }}>Create Post</Button>
                </div>
            </div>
            <Toaster richColors position="top-right"/>
        </div>
    )
}
