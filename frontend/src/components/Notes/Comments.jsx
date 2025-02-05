'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smile, Edit, Trash2, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import useNotesStore from '@/Stores/NotesStore.jsx'

export function Comments({ noteId }) {
	const [newComment, setNewComment] = useState('')
	const [editingCommentId, setEditingCommentId] = useState(null)
	const [editedCommentContent, setEditedCommentContent] = useState('')
	const [loadingComments, setLoadingComments] = useState(new Set())
	const [isSubmitting, setIsSubmitting] = useState(false)
	
	const note = useNotesStore(state => state.getNoteById(noteId))
	const addComment = useNotesStore(state => state.addComment)
	const editComment = useNotesStore(state => state.editComment)
	const deleteComment = useNotesStore(state => state.deleteComment)

	

	
	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!newComment.trim() || !noteId || isSubmitting) return
		
		try {
			setIsSubmitting(true)
			await addComment(noteId, newComment)
			setNewComment('')
			
		} finally {
			setIsSubmitting(false)
		}
	}
	
	const handleEdit = (commentId, content) => {
		setEditingCommentId(commentId)
		setEditedCommentContent(content)
	}
	
	const handleSaveEdit = async (commentId) => {
		if (!editedCommentContent.trim() || !noteId) return
		
		try {
			setLoadingComments(prev => new Set([...prev, commentId]))
			await editComment(noteId, commentId, editedCommentContent)
			setEditingCommentId(null)
			setEditedCommentContent('')
			
		} finally {
			setLoadingComments(prev => {
				const next = new Set(prev)
				next.delete(commentId)
				return next
			})
		}
	}
	
	const handleCancelEdit = () => {
		setEditingCommentId(null)
		setEditedCommentContent('')
	}
	
	const handleDelete = async (commentId) => {
		if (!noteId) return
		
		try {
			setLoadingComments(prev => new Set([...prev, commentId]))
			await deleteComment(noteId, commentId)
			
		} finally {
			setLoadingComments(prev => {
				const next = new Set(prev)
				next.delete(commentId)
				return next
			})
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
				{comments.map((comment) => {
					const isLoading = loadingComments.has(comment.id)
					
					return (
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
											disabled={isLoading}
										/>
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={() => handleSaveEdit(comment.id)}
												disabled={isLoading}
											>
												{isLoading ? (
													<Loader2 className="h-4 w-4 animate-spin mr-2" />
												) : null}
												Save
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={handleCancelEdit}
												disabled={isLoading}
											>
												Cancel
											</Button>
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
										disabled={isLoading}
									>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Edit className="h-4 w-4" />
										)}
									</Button>
									<Button
										size="icon"
										variant="ghost"
										onClick={() => handleDelete(comment.id)}
										disabled={isLoading}
										className="text-destructive hover:text-destructive"
									>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Trash2 className="h-4 w-4" />
										)}
									</Button>
								</div>
							)}
						</div>
					);
				})}
			</ScrollArea>
			
			<form onSubmit={handleSubmit} className="p-4 flex gap-2">
				<Input
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder="Write a comment..."
					className="flex-1"
					disabled={isSubmitting}
				/>
				<Button
					type="submit"
					disabled={!newComment.trim() || isSubmitting}
				>
					{isSubmitting ? (
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
					) : null}
					Comment
				</Button>
			</form>
		</div>
	)
}