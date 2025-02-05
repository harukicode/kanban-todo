import React, { useState, useEffect } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Loader2 } from "lucide-react"
import useNotesStore from "@/Stores/NotesStore"
import { useToast } from "@/hooks/use-toast"

export function TaskNoteModal({ isOpen, onClose, task }) {
	const [title, setTitle] = useState(`Note for: ${task.title}`)
	const [content, setContent] = useState("")
	const [isSaving, setIsSaving] = useState(false)
	const [isEditorReady, setIsEditorReady] = useState(false)
	const { toast } = useToast()
	
	const createTaskNote = useNotesStore((state) => state.createTaskNote)
	const updateNote = useNotesStore((state) => state.updateNote)
	const error = useNotesStore((state) => state.error)
	const clearError = useNotesStore((state) => state.clearError)
	
	// Обработка ошибок
	useEffect(() => {
		if (error) {
			toast({
				title: "Error",
				description: error,
				variant: "destructive",
			});
			clearError();
		}
	}, [error, toast, clearError]);
	
	// Сброс состояния при открытии/закрытии
	useEffect(() => {
		if (isOpen) {
			setTitle(`Note for: ${task.title}`)
			setContent("")
			setIsEditorReady(false)
		}
	}, [isOpen, task.title]);
	
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
	
	const handleSave = async () => {
		if (isSaving) return;
		
		try {
			setIsSaving(true);
			
			// Создаем заметку
			const newNote = await createTaskNote(task, content);
			if (!newNote) {
				throw new Error("Failed to create note");
			}
			
			// Обновляем заголовок
			await updateNote({
				...newNote,
				title: title,
			});
			
			toast({
				title: "Success",
				description: "Note created successfully",
			});
			
			handleClose();
		} catch (error) {
			toast({
				title: "Error",
				description: error.message || "Failed to create note",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	}
	
	const handleClose = () => {
		if (isSaving) return;
		setContent("");
		setTitle(`Note for: ${task.title}`);
		setIsEditorReady(false);
		onClose();
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
							disabled={isSaving}
						/>
					</div>
				</DialogHeader>
				
				<div className="flex-grow overflow-hidden px-6 py-4 relative">
					{!isEditorReady && (
						<div className="absolute inset-0 flex items-center justify-center bg-background/80">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					)}
					<div className="h-full rounded-md border">
						<ReactQuill
							theme="snow"
							value={content}
							onChange={setContent}
							modules={modules}
							className="h-[calc(100%-42px)]"
							placeholder="Start writing your note..."
							onLoad={() => setIsEditorReady(true)}
							readOnly={isSaving}
							style={{ opacity: isSaving ? 0.7 : 1 }}
						/>
					</div>
				</div>
				
				<DialogFooter className="px-6 py-4 border-t">
					<div className="flex justify-between items-center w-full">
						{isSaving && (
							<div className="text-sm text-muted-foreground flex items-center">
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Saving note...
							</div>
						)}
						<div className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={handleClose}
								className="px-8"
								disabled={isSaving}
							>
								Cancel
							</Button>
							<Button
								onClick={handleSave}
								className="px-8"
								disabled={isSaving || !content.trim() || !title.trim()}
							>
								{isSaving ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
										Creating...
									</>
								) : (
									"Create"
								)}
							</Button>
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}