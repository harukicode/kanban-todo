import { Comments } from "@/components/Notes/Comments.jsx"
import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Pin, Tags, Copy, Printer, Trash2, MoreVertical, Folder, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import useNotesStore from "@/Stores/NotesStore.jsx"
import { useToast } from "@/hooks/use-toast"
import "quill/dist/quill.snow.css"
import { format, isToday, isYesterday } from "date-fns"

function NoteEditor({ noteId }) {
	const {
		getNoteById,
		updateNote,
		deleteNote,
		togglePinNote,
		addTagToNote,
		removeTagFromNote,
		duplicateNote,
		moveNoteToFolder,
		folders,
		isLoading,
		error,
		clearError
	} = useNotesStore()
	
	const { toast } = useToast()
	const note = useNotesStore((state) => getNoteById(noteId))
	const [editor, setEditor] = useState(null)
	const editorRef = useRef(null)
	const [editedNote, setEditedNote] = useState(note || { title: "", content: "", tags: [], attachments: [] })
	const [newTag, setNewTag] = useState("")
	const [isEditorReady, setIsEditorReady] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	
	// Обработка ошибок
	useEffect(() => {
		if (error) {
			toast({
				title: "Error",
				description: error,
				variant: "destructive",
			})
			clearError()
		}
	}, [error, toast, clearError])
	
	const saveContent = useCallback(
		async (content) => {
			if (!editedNote?.id) return
			
			setIsSaving(true)
			try {
				const updatedNote = {
					...editedNote,
					content: content,
					updatedAt: new Date().toISOString(),
				}
				await updateNote(updatedNote)
				setEditedNote(updatedNote)
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to save changes",
					variant: "destructive",
				})
			} finally {
				setIsSaving(false)
			}
		},
		[editedNote?.id, updateNote, toast],
	)
	
	// Инициализируем редактор при монтировании
	useEffect(() => {
		let quillInstance = null
		
		const initQuill = async () => {
			try {
				if (!editorRef.current || editor) return
				
				editorRef.current.innerHTML = ""
				const Quill = (await import("quill")).default
				
				// Добавляем обработчик для drop событий
				editorRef.current.addEventListener("dragover", (e) => {
					e.preventDefault()
				})
				
				editorRef.current.addEventListener("drop", async (e) => {
					e.preventDefault()
					const files = Array.from(e.dataTransfer.files)
					const imageFiles = files.filter((file) => file.type.startsWith("image/"))
					
					for (const file of imageFiles) {
						const reader = new FileReader()
						reader.onload = () => {
							const range = quillInstance.getSelection(true)
							quillInstance.insertEmbed(range.index, "image", reader.result)
						}
						reader.readAsDataURL(file)
					}
				})
				
				quillInstance = new Quill(editorRef.current, {
					theme: "snow",
					modules: {
						toolbar: [
							[{ size: ["small", false, "large"] }],
							["bold", "italic", "underline", "strike"],
							[{ color: [] }, { background: [] }],
							[{ align: [] }],
							[{ list: "ordered" }, { list: "bullet" }],
							["image"], // Добавляем кнопку для загрузки изображений
							["clean"],
						],
					},
					placeholder: "Start writing...",
				})
				
				// Добавляем обработчик клика по кнопке загрузки изображения
				const toolbar = quillInstance.getModule("toolbar")
				toolbar.addHandler("image", () => {
					const input = document.createElement("input")
					input.setAttribute("type", "file")
					input.setAttribute("accept", "image/*")
					input.click()
					
					input.onchange = () => {
						const file = input.files[0]
						if (file) {
							const reader = new FileReader()
							reader.onload = () => {
								const range = quillInstance.getSelection(true)
								quillInstance.insertEmbed(range.index, "image", reader.result)
							}
							reader.readAsDataURL(file)
						}
					}
				})
				
				setEditor(quillInstance)
				setIsEditorReady(true)
			} catch (error) {
				console.error("Failed to load Quill:", error)
			}
		}
		
		initQuill()
		
		return () => {
			if (quillInstance) {
				quillInstance.off("text-change")
			}
		}
	}, [])
	
	// Обновляем содержимое редактора при смене заметки
	useEffect(() => {
		if (!note) return
		
		setEditedNote(note)
		
		if (editor && isEditorReady) {
			const content = note.content || ""
			if (editor.root.innerHTML !== content) {
				editor.root.innerHTML = content
			}
		}
	}, [noteId, note, editor, isEditorReady])
	
	// Устанавливаем обработчик изменений после инициализации
	useEffect(() => {
		if (!editor || !isEditorReady) return
		
		let timeout
		const handleTextChange = () => {
			if (timeout) clearTimeout(timeout)
			timeout = setTimeout(() => {
				const content = editor.root.innerHTML
				saveContent(content)
			}, 1000)
		}
		
		editor.on("text-change", handleTextChange)
		
		return () => {
			if (timeout) clearTimeout(timeout)
			editor.off("text-change", handleTextChange)
		}
	}, [editor, isEditorReady, saveContent])
	
	const handleTitleChange = async (e) => {
		const title = e.target.value
		const updatedNote = { ...editedNote, title }
		try {
			await updateNote(updatedNote)
			setEditedNote(updatedNote)
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update title",
				variant: "destructive",
			})
		}
	}
	
	const handleAddTag = async () => {
		if (newTag.trim() && editedNote && !editedNote.tags.includes(newTag.trim())) {
			try {
				await addTagToNote(editedNote.id, newTag.trim())
				setNewTag("")
				toast({
					title: "Success",
					description: "Tag added successfully",
				})
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to add tag",
					variant: "destructive",
				})
			}
		}
	}
	
	const handleRemoveTag = async (tag) => {
		if (editedNote) {
			try {
				await removeTagFromNote(editedNote.id, tag)
				toast({
					title: "Success",
					description: "Tag removed successfully",
				})
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to remove tag",
					variant: "destructive",
				})
			}
		}
	}
	
	const handleTogglePin = async () => {
		if (editedNote) {
			try {
				await togglePinNote(editedNote.id)
				toast({
					title: "Success",
					description: editedNote.isPinned ? "Note unpinned" : "Note pinned",
				})
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to toggle pin",
					variant: "destructive",
				})
			}
		}
	}
	
	const handleDuplicateNote = async () => {
		if (editedNote) {
			try {
				const duplicated = await duplicateNote(editedNote.id);
				if (duplicated) {
					toast({
						title: "Success",
						description: "Note duplicated successfully",
					});
				}
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to duplicate note",
					variant: "destructive",
				});
			}
		}
	};
	
	const handleMoveToFolder = async (folderId) => {
		if (editedNote) {
			try {
				await moveNoteToFolder(editedNote.id, folderId)
				toast({
					title: "Success",
					description: "Note moved successfully",
				})
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to move note",
					variant: "destructive",
				})
			}
		}
	}
	
	const handleDeleteNote = async () => {
		try {
			await deleteNote(editedNote.id)
			toast({
				title: "Success",
				description: "Note deleted successfully",
			})
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete note",
				variant: "destructive",
			})
		}
	}
	
	if (!note || !editedNote) {
		return (
			<div className="flex-1 flex items-center justify-center text-muted-foreground">
				{isLoading ? (
					<div className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						Loading note...
					</div>
				) : (
					"Note not found"
				)}
			</div>
		)
	}
	
	return (
		<div className="flex-1 flex flex-col h-full relative">
			{isSaving && (
				<div
					className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded-md flex items-center gap-2 text-sm text-muted-foreground">
					<Loader2 className="h-3 w-3 animate-spin" />
					Saving...
				</div>
			)}
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleTogglePin} className="hover:bg-accent">
						<Pin className={`h-4 w-4 ${editedNote.isPinned ? "text-yellow-500" : ""}`} />
					</Button>
					<Separator orientation="vertical" className="h-4" />
					<Button variant="ghost" size="sm">
						{isToday(new Date(editedNote.createdAt))
							? "Today"
							: isYesterday(new Date(editedNote.createdAt))
								? "Yesterday"
								: format(new Date(editedNote.createdAt), "MMM d, yyyy")}
					</Button>
				</div>
				
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Note Actions</SheetTitle>
						</SheetHeader>
						<div className="grid gap-2 py-4">
							<Button variant="ghost" className="justify-start" onClick={handleTogglePin}>
								<Pin className="mr-2 h-4 w-4" />
								{editedNote.isPinned ? "Unpin" : "Pin"}
							</Button>
							
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="ghost" className="justify-start">
										<Tags className="mr-2 h-4 w-4" /> Tags
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Manage Tags</DialogTitle>
									</DialogHeader>
									<div className="flex items-center space-x-2">
										<Input
											value={newTag}
											onChange={(e) => setNewTag(e.target.value)}
											placeholder="New tag"
											className="flex-1"
										/>
										<Button onClick={handleAddTag}>Add</Button>
									</div>
									<div className="flex flex-wrap gap-2 mt-4">
										{editedNote.tags?.map((tag) => (
											<Badge key={tag} variant="secondary" className="px-2 py-1">
												{tag}
												<button className="ml-2 text-xs hover:text-destructive" onClick={() => handleRemoveTag(tag)}>
													×
												</button>
											</Badge>
										))}
									</div>
								</DialogContent>
							</Dialog>
							
							<Separator />
							
							<Button variant="ghost" className="justify-start" onClick={handleDuplicateNote}>
								<Copy className="mr-2 h-4 w-4" /> Duplicate
							</Button>
							
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="ghost" className="justify-start">
										<Folder className="mr-2 h-4 w-4" /> Move to Folder
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Select Folder</DialogTitle>
									</DialogHeader>
									<div className="grid gap-2 py-4">
										{folders.map((folder) => (
											<DialogClose asChild key={folder.id}>
												<Button variant="ghost" className="justify-start" onClick={() => handleMoveToFolder(folder.id)}>
													<Folder className="mr-2 h-4 w-4" /> {folder.name}
												</Button>
											</DialogClose>
										))}
									</div>
								</DialogContent>
							</Dialog>
							
							<Separator />
							
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="ghost" className="justify-start text-destructive hover:text-destructive">
										<Trash2 className="mr-2 h-4 w-4" /> Delete
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete the note.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={() => deleteNote(editedNote.id)}>Delete</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</SheetContent>
				</Sheet>
			</div>
			
			<div className="flex-1 p-4 flex flex-col overflow-hidden">
				<Input
					name="title"
					value={editedNote.title}
					onChange={handleTitleChange}
					className="text-xl font-bold mb-4 border-none bg-transparent focus-visible:ring-0"
					placeholder="Note title"
					disabled={isLoading}
				/>
				<div className="flex-1 overflow-auto">
					<div
						ref={editorRef}
						className="h-full min-h-[200px] quill-editor"
						style={{
							backgroundColor: "transparent",
							opacity: isLoading ? 0.7 : 1,
							pointerEvents: isLoading ? "none" : "auto"
						}}
					/>
				</div>
			</div>
			
			<Comments noteId={editedNote.id} />
		</div>
	)
}

export default NoteEditor

