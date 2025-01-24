import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ChevronDown, ChevronUp, MoreVertical, Pencil, Trash } from 'lucide-react'

export function CommentCard({
                              taskId,
                              comments,
                              onAddComment,
                              onUpdateComment,
                              onDeleteComment,
                            }) {
  const [newComment, setNewComment] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedContent, setEditedContent] = useState("")
  const [contentHeight, setContentHeight] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCommentId, setSelectedCommentId] = useState(null)
  const contentRef = useRef(null)
  
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    } else {
      setContentHeight(0)
    }
  }, [isOpen, comments])
  
  const handleAddComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment(taskId, newComment)
      setNewComment("")
    }
  }
  
  const handleEditClick = (commentId, content) => {
    setEditingCommentId(commentId)
    setEditedContent(content)
  }
  
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (editedContent.trim() && editingCommentId) {
      onUpdateComment(taskId, editingCommentId, editedContent)
      setEditingCommentId(null)
      setEditedContent("")
    }
  }
  
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditedContent("")
  }
  
  const handleDeleteClick = (commentId) => {
    setSelectedCommentId(commentId)
    setDeleteDialogOpen(true)
  }
  
  const handleConfirmDelete = async () => {
    if (selectedCommentId) {
      try {
        await onDeleteComment(taskId, selectedCommentId);
        setDeleteDialogOpen(false);
        setSelectedCommentId(null);
      } catch (error) {
        console.error('Error deleting comment:', error);
        // Здесь можно добавить отображение ошибки пользователю
      }
    }
  };
  
  return (
    <>
      <Card className="w-full mb-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
            <CardTitle className="text-sm font-medium">Comments ({comments.length})</CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">{isOpen ? "Close comments" : "Open comments"}</span>
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent
            style={{ maxHeight: `${contentHeight}px` }}
            className="transition-all duration-300 ease-in-out overflow-hidden"
          >
            <CardContent className="p-0" ref={contentRef}>
              <div className="max-h-[200px] overflow-y-auto px-4">
                {comments.map((comment) => (
                  <div key={`comment-${comment.id}`} className="py-2 border-b last:border-b-0">
                    <div key={`comment-content-${comment.id}`} className="flex items-start space-x-2">
                      <Avatar key={`comment-avatar-${comment.id}`} className="w-6 h-6">
                        <AvatarImage
                          key={`comment-avatar-img-${comment.id}`}
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`}
                        />
                        <AvatarFallback key={`comment-avatar-fallback-${comment.id}`}>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div key={`comment-body-${comment.id}`} className="flex-1 min-w-0">
                        <div key={`comment-header-${comment.id}`} className="flex items-center justify-between">
                          <h4 key={`comment-author-${comment.id}`} className="text-xs font-semibold truncate">{comment.author}</h4>
                          <div key={`comment-meta-${comment.id}`} className="flex items-center space-x-2">
                            <span key={`comment-date-${comment.id}`} className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                            <div key={`comment-actions-${comment.id}`} className="flex space-x-1">
                              <Button
                                key={`comment-edit-${comment.id}`}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEditClick(comment.id, comment.content)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                key={`comment-delete-${comment.id}`}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive"
                                onClick={() => handleDeleteClick(comment.id)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="mt-2">
                            <Textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="w-full mb-2 text-xs"
                              rows={2}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button size="sm" className="h-6 text-xs" onClick={handleSaveEdit}>
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-1 text-xs">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-2 pt-1">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full text-xs"
                  rows={2}
                />
                <Button onClick={handleAddComment} className="mt-1.5 h-7 text-xs">
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}