import React, { useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"
import useNotesStore from "@/Stores/NotesStore"

export function TaskNoteModal({ isOpen, onClose, task }) {
	const [title, setTitle] = useState(`Note for: ${task.title}`)
	const [content, setContent] = useState("")
	const createTaskNote = useNotesStore((state) => state.createTaskNote)
	
	// Toolbar configuration with improved formatting options
	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			["bold", "italic", "underline", "strike"],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ color: [] }, { background: [] }],
			[{ align: [] }],
			["link"],
			["clean"],
		],
	}
	
	const handleSave = () => {
		const noteData = {
			title: title,
			content: content,
		}
		const newNote = createTaskNote(task, content)
		if (newNote) {
			useNotesStore.getState().updateNote({
				...newNote,
				title: title,
			})
		}
		setContent("")
		setTitle(`Note for: ${task.title}`)
		onClose()
	}
	
	const handleClose = () => {
		setContent("")
		setTitle(`Note for: ${task.title}`)
		onClose()
	}
	
	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0 gap-0 bg-background">
				<DialogHeader className="px-6 py-4 border-b">
					<DialogTitle className="flex items-center gap-2 text-xl font-semibold">
						<Pencil className="w-5 h-5" />
						Create Note
					</DialogTitle>
					<div className="mt-4">
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="text-lg font-medium bg-muted/50 border-0 focus-visible:ring-1"
							placeholder="Enter note title..."
						/>
					</div>
				</DialogHeader>
				
				<div className="flex-grow overflow-hidden px-6 py-4">
					<div className="h-full rounded-md border">
						<ReactQuill
							theme="snow"
							value={content}
							onChange={setContent}
							modules={modules}
							className="h-[calc(100%-42px)]"
							placeholder="Start writing your note..."
						/>
					</div>
				</div>
				
				<DialogFooter className="px-6 py-4 border-t">
					<div className="flex justify-end gap-2 w-full">
						<Button variant="outline" onClick={handleClose} className="px-8">
							Cancel
						</Button>
						<Button onClick={handleSave} className="px-8">
							Create
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

