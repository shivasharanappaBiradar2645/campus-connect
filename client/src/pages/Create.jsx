import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// import type { Editor } from '@tiptap/react'

// import { TextStyleKit } from '@tiptap/extension-text-style'
import React from "react"
import {EditorContent, useEditor, useEditorState} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
// import {Button} from "@/components/ui/button" // shadcn button

const extensions = [StarterKit]

function MenuBar({editor}) {
    const editorState = useEditorState({
        editor,
        selector: ctx => ({
            isBold: ctx.editor.isActive("bold"),
            isItalic: ctx.editor.isActive("italic"),
            isStrike: ctx.editor.isActive("strike"),
            isBulletList: ctx.editor.isActive("bulletList"),
            isOrderedList: ctx.editor.isActive("orderedList"),
            canUndo: ctx.editor.can().chain().undo().run(),
            canRedo: ctx.editor.can().chain().redo().run(),
        }),
    })

    if (!editor) return null

    const buttons = [
        {label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editorState.isBold},
        {label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editorState.isItalic},
        {label: "S", action: () => editor.chain().focus().toggleStrike().run(), active: editorState.isStrike},
        {label: "•", action: () => editor.chain().focus().toggleBulletList().run(), active: editorState.isBulletList},
        {
            label: "1.",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            active: editorState.isOrderedList
        },
        {label: "↩", action: () => editor.chain().focus().undo().run(), disabled: !editorState.canUndo},
        {label: "↪", action: () => editor.chain().focus().redo().run(), disabled: !editorState.canRedo},
    ]

    return (
        <div className="flex flex-wrap gap-2 bg-muted/50 rounded-lg p-2 mb-3">
            {buttons.map((btn, i) => (
                <Button
                    key={i}
                    variant={btn.active ? "default" : "ghost"}
                    size="sm"
                    disabled={btn.disabled}
                    onClick={btn.action}
                    className="w-8 h-8 p-0 font-bold"
                >
                    {btn.label}
                </Button>
            ))}
        </div>
    )
}

function TextEditor() {
    const editor = useEditor({
        extensions,
        content: "<p>Start writing your post...</p>",
    })

    return (
        <>
            <div className="flex flex-col h-full border rounded-lg">
                <MenuBar editor={editor}/>
                <div className="flex-1 overflow-hidden  rounded-lg">
                    <EditorContent
                        editor={editor}
                        className=" h-full p-3 outline-none focus:outline-none focus:border-none
                         focus-visible:outline-none focus-visible:border-none"
                    />
                </div>
            </div>
        </>
    )
}


export default function Create({setCreatePost}) {
    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <Button variant="ghost" onClick={() => setCreatePost(false)}>
                    ←
                </Button>
                <h1 className="text-lg font-semibold w-full text-center">Create New Post</h1>
                <div className="w-16" /> {/* spacer */}
            </div>

            {/* Form */}
            <div className="flex flex-col flex-1 p-4 space-y-6">
                {/* Visibility Dropdown */}
                <div className="max-w-sm">
                    <label className="block mb-1 text-sm font-medium">Visibility</label>
                    <Select defaultValue="public">
                        <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="max-w-2xl">
                    <label className="block mb-1 text-sm font-medium">Title</label>
                    <Input placeholder="Enter post title" />
                </div>

                <div className="flex-1 min-h-0 max-w-3xl">
                    <TextEditor className="h-full" />
                </div>

                {/* Submit Button */}
                <div className="max-w-3xl">
                    <Button className="w-full">Create Post</Button>
                </div>
            </div>
        </div>
    )



}
