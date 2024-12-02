'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Smile, Edit, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Comments({ noteId, comments = [], onAddComment, onEditComment, onDeleteComment }) {
	const [newComment, setNewComment] = useState('')
	const [editingCommentId, setEditingCommentId] = useState(null)
	const [editedCommentContent, setEditedCommentContent] = useState('')
	
	const handleSubmit = (e) => {
		e.preventDefault()
		if (newComment.trim()) {
			onAddComment(newComment)
			setNewComment('')
		}
	}
	
	const handleEdit = (commentId, content) => {
		setEditingCommentId(commentId)
		setEditedCommentContent(content)
	}
	
	const handleSaveEdit = (commentId) => {
		if (editedCommentContent.trim()) {
			onEditComment(commentId, editedCommentContent)
			setEditingCommentId(null)
			setEditedCommentContent('')
		}
	}
	
	const handleCancelEdit = () => {
		setEditingCommentId(null)
		setEditedCommentContent('')
	}
	
	return (
		<div className="border-t">
			{comments.length > 0 && (
				<div className="border-t">
					<div className="p-4 border-b">
						<h4 className="font-medium">Comments {comments.length}</h4>
					</div>
					<ScrollArea className="max-h-[300px]">
						{comments.map((comment) => (
							<div key={comment.id} className="flex gap-3 p-4 border-b">
								<Avatar className="h-8 w-8">
									<AvatarFallback>
										{(comment.author || 'Anonymous')[0].toUpperCase()}
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
										<Button size="icon" variant="ghost" onClick={() => handleEdit(comment.id, comment.content)}>
											<Edit className="h-4 w-4" />
										</Button>
										<Button size="icon" variant="ghost" onClick={() => onDeleteComment(comment.id)}>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								)}
							</div>
						))}
					</ScrollArea>
				</div>
			)}
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
				<Button type="submit">Comment</Button>
			</form>
		</div>
	)
}


