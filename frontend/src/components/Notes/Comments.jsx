'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smile, Edit, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import useNotesStore from '@/Stores/NotesStore.jsx'

export function Comments({ noteId }) {
	const [newComment, setNewComment] = useState('')
	const [editingCommentId, setEditingCommentId] = useState(null)
	const [editedCommentContent, setEditedCommentContent] = useState('')
	
	const note = useNotesStore(state => state.getNoteById(noteId))
	const addComment = useNotesStore(state => state.addComment)
	const editComment = useNotesStore(state => state.editComment)
	const deleteComment = useNotesStore(state => state.deleteComment)
	
	const handleSubmit = (e) => {
		e.preventDefault()
		if (newComment.trim() && noteId) {
			addComment(noteId, newComment)
			setNewComment('')
		}
	}
	
	const handleEdit = (commentId, content) => {
		setEditingCommentId(commentId)
		setEditedCommentContent(content)
	}
	
	const handleSaveEdit = (commentId) => {
		if (editedCommentContent.trim() && noteId) {
			editComment(noteId, commentId, editedCommentContent)
			setEditingCommentId(null)
			setEditedCommentContent('')
		}
	}
	
	const handleCancelEdit = () => {
		setEditingCommentId(null)
		setEditedCommentContent('')
	}
	
	const handleDelete = (commentId) => {
		if (noteId) {
			deleteComment(noteId, commentId)
		}
	}
	
	if (!note) return null
	
	const comments = note.comments || []
	
	return (
		<div className="border-t">
			<div className="p-4 border-b">
				<h4 className="font-medium">Comments ({comments.length})</h4>
			</div>
			
			<ScrollArea className="max-h-[300px]">
				{comments.map((comment) => (
					<div key={comment.id} className="flex gap-3 p-4 border-b">
						<Avatar className="h-8 w-8">
							<AvatarFallback>
								{comment.authorInitial || comment.author?.[0]?.toUpperCase() || 'A'}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="font-medium">{comment.author || 'Anonymous'}</span>
								<span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
							</div>
							{editingCommentId === comment.id ? (
								<div className="mt-1">
									<Input
										value={editedCommentContent}
										onChange={(e) => setEditedCommentContent(e.target.value)}
										className="mb-2"
									/>
									<div className="flex gap-2">
										<Button size="sm" onClick={() => handleSaveEdit(comment.id)}>Save</Button>
										<Button size="sm" variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
									</div>
								</div>
							) : (
								<p className="text-sm mt-1">{comment.content}</p>
							)}
						</div>
						{editingCommentId !== comment.id && (
							<div className="flex gap-2">
								<Button
									size="icon"
									variant="ghost"
									onClick={() => handleEdit(comment.id, comment.content)}
								>
									<Edit className="h-4 w-4" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => handleDelete(comment.id)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						)}
					</div>
				))}
			</ScrollArea>
			
			<form onSubmit={handleSubmit} className="p-4 flex gap-2">
				<Input
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder="Write a comment..."
					className="flex-1"
				/>
				<Button type="button" variant="ghost" size="icon">
					<Smile className="h-4 w-4" />
				</Button>
				<Button type="submit" disabled={!newComment.trim()}>Comment</Button>
			</form>
		</div>
	)
}