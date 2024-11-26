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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const contentRef = useRef(null)
  
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    } else {
      setContentHeight(0)
    }
  }, [isOpen, comments])
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(taskId, newComment)
      setNewComment("")
    }
  }
  
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId)
    setEditedContent(content)
  }
  
  const handleSaveEdit = (commentId) => {
    if (editedContent.trim()) {
      onUpdateComment(taskId, commentId, editedContent)
      setEditingCommentId(null)
      setEditedContent("")
    }
  }
  
  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditedContent("")
  }
  
  return (
    <Card className="w-full mb-0">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
          <CardTitle className="text-sm font-medium">Comments ({comments.length})</CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
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
                <div key={comment.id} className="py-2 border-b last:border-b-0">
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`} />
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold truncate">{comment.author}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="h-3 w-3" />
                                <span className="sr-only">Comment options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditComment(comment.id, comment.content)}>
                                <Pencil className="mr-2 h-3 w-3" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onDeleteComment(taskId, comment.id)}>
                                <Trash className="mr-2 h-3 w-3" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                            <Button size="sm" className="h-6 text-xs" onClick={() => handleSaveEdit(comment.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" className="h-6 text-xs" onClick={handleCancelEdit}>
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
  )
}

