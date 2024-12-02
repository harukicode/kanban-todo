import { Comments } from '@/components/Notes/Comments.jsx'
import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {  Pin, Tags, Paperclip, LayoutTemplateIcon as Template, Copy, Printer, Trash2, MoreVertical, Folder } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"

function NoteEditor({ note, onUpdateNote, onDeleteNote, onTogglePin, onAddTag, onRemoveTag, onDuplicateNote, onMoveToFolder, onAttachFile, folders, onAddComment, onEditComment, onDeleteComment }) {
	const [editedNote, setEditedNote] = useState(note || { title: '', content: '', tags: [], attachments: [] })
	const [newTag, setNewTag] = useState('')
	const fileInputRef = useRef(null)
	
	useEffect(() => {
		if (note) {
			setEditedNote(note);
		} else {
			setEditedNote({ title: '', content: '', tags: [], attachments: [] });
		}
	}, [note])
	
	if (!note) {
		return (
			<div className="flex-1 flex items-center justify-center text-muted-foreground">
				Select a note or create a new one
			</div>
		)
	}
	
	const handleChange = (e) => {
		const { name, value } = e.target
		setEditedNote(prev => ({ ...prev, [name]: value }))
	}
	
	const handleBlur = () => {
		if (editedNote) {
			onUpdateNote(editedNote)
		}
	}
	
	const handleAddTag = () => {
		if (newTag && !editedNote.tags.includes(newTag)) {
			const updatedNote = { ...editedNote, tags: [...editedNote.tags, newTag] };
			setEditedNote(updatedNote);
			onAddTag(editedNote.id, newTag);
			setNewTag('');
		}
	}
	
	const handleRemoveTag = (tag) => {
		const updatedNote = { ...editedNote, tags: editedNote.tags.filter(t => t !== tag) };
		setEditedNote(updatedNote);
		onRemoveTag(editedNote.id, tag);
	}
	
	const handleFileAttachment = (e) => {
		const file = e.target.files[0]
		if (file) {
			onAttachFile(editedNote.id, file)
		}
	}
	
	const handleAddComment = (newComment) => {
		const updatedNote = {
			...editedNote,
			comments: [...(editedNote.comments || []), {
				id: Date.now(),
				content: newComment,
				createdAt: new Date().toISOString(),
				author: 'Current User',
			}]
		};
		
		setEditedNote(updatedNote);
		onUpdateNote(updatedNote);
	};
	
	const handleEditComment = (commentId, newContent) => {
		const updatedComments = (editedNote.comments || []).map(comment =>
			comment.id === commentId ? { ...comment, content: newContent } : comment
		);
		
		const updatedNote = {
			...editedNote,
			comments: updatedComments
		};
		
		setEditedNote(updatedNote);
		onUpdateNote(updatedNote);
	}
	
	const handleDeleteComment = (commentId) => {
		const updatedComments = (editedNote.comments || []).filter(
			comment => comment.id !== commentId
		);
		
		const updatedNote = {
			...editedNote,
			comments: updatedComments
		};
		
		setEditedNote(updatedNote);
		onUpdateNote(updatedNote);
	}
	return (
		<div className="flex-1 flex flex-col">
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={() => onTogglePin(editedNote.id)}>
						<Pin className={`h-4 w-4 ${editedNote.isPinned ? 'text-yellow-500' : ''}`} />
					</Button>
					<Separator orientation="vertical" className="h-4" />
					<Button variant="ghost" size="sm">Today</Button>
				</div>
				<div className="flex items-center gap-2">
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
								<Button variant="ghost" className="justify-start" onClick={() => onTogglePin(editedNote.id)}>
									<Pin className="mr-2 h-4 w-4" /> {editedNote.isPinned ? 'Unpin' : 'Pin'}
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
											/>
											<Button onClick={handleAddTag}>Add</Button>
										</div>
										<div className="flex flex-wrap gap-2 mt-4">
											{editedNote.tags && editedNote.tags.map(tag => (
												<Badge key={tag} variant="secondary" className="px-2 py-1">
													{tag}
													<button
														className="ml-2 text-xs"
														onClick={() => handleRemoveTag(tag)}
													>
														×
													</button>
												</Badge>
											))}
										</div>
									</DialogContent>
								</Dialog>
								<Button variant="ghost" className="justify-start" onClick={() => fileInputRef.current.click()}>
									<Paperclip className="mr-2 h-4 w-4" /> Attach File
								</Button>
								<input
									type="file"
									ref={fileInputRef}
									style={{ display: 'none' }}
									onChange={handleFileAttachment}
								/>
								<Separator />
								<Button variant="ghost" className="justify-start">
									<Template className="mr-2 h-4 w-4" /> Save as Template
								</Button>
								<Button variant="ghost" className="justify-start" onClick={() => onDuplicateNote(editedNote.id)}>
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
											{folders.map(folder => (
												<DialogClose asChild key={folder.id}>
													<Button
														variant="ghost"
														className="justify-start"
														onClick={() => onMoveToFolder(editedNote.id, folder.id)}
													>
														<Folder className="mr-2 h-4 w-4" /> {folder.name}
													</Button>
												</DialogClose>
											))}
										</div>
									</DialogContent>
								</Dialog>
								<Button variant="ghost" className="justify-start">
									<Printer className="mr-2 h-4 w-4" /> Print
								</Button>
								<Separator />
								<Button variant="ghost" className="justify-start text-destructive" onClick={() => onDeleteNote(editedNote.id)}>
									<Trash2 className="mr-2 h-4 w-4" /> Delete
								</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
			
			<div className="flex-1 p-4">
				<Input
					name="title"
					value={editedNote.title}
					onChange={handleChange}
					onBlur={handleBlur}
					className="text-xl font-bold mb-4 border-none bg-transparent"
					placeholder="Note title"
				/>
				<textarea
					name="content"
					value={editedNote.content}
					onChange={handleChange}
					onBlur={handleBlur}
					className="w-full h-[calc(100%-4rem)] resize-none border-none bg-transparent focus:outline-none"
					placeholder="Start writing..."
				/>
			</div>
			{editedNote.attachments && editedNote.attachments.length > 0 && (
				<div className="p-4 border-t">
					<h3 className="font-medium mb-2">Attachments:</h3>
					<ul className="list-disc pl-5">
						{editedNote.attachments.map((file, index) => (
							<li key={index}>{file.name}</li>
						))}
					</ul>
				</div>
			)}
			
			<Comments
				noteId={editedNote.id}
				comments={editedNote.comments || []}
				onAddComment={handleAddComment}
				onEditComment={handleEditComment}
				onDeleteComment={handleDeleteComment}
			/>
		</div>
	)
}

export default NoteEditor

