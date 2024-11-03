"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";

export function CommentCard({
  taskId,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) {
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(taskId, newComment);
      setNewComment("");
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  const handleSaveEdit = (commentId) => {
    if (editedContent.trim()) {
      onUpdateComment(taskId, commentId, editedContent);
      setEditingCommentId(null);
      setEditedContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Comments</CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <ScrollArea className="h-[200px] pr-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="mb-4 flex items-start space-x-4"
                >
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`}
                    />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        {comment.author}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleEditComment(comment.id, comment.content)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onDeleteComment(taskId, comment.id)
                              }
                            >
                              <Trash className="mr-2 h-4 w-4" />
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
                          className="w-full mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(comment.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm">{comment.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleAddComment} className="self-end">
              Add Comment
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
