import { CommentCard } from "@/components/Task/TaskModal/TaskComments.jsx"
import { TaskNoteModal } from '@/components/Task/TaskNoteModal.jsx'
import React, { useRef, useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Clock, FileText, MoreHorizontal, Trash } from 'lucide-react'
import { useTaskModal } from "@/hooks/Task/modalTaskHooks/useTaskModal.jsx"
import useSubtaskStore from "@/Stores/SubtaskStore"
import SubtaskList from "@/components/Task/TaskModal/SubtaskList.jsx"
import TaskDescription from "@/components/Task/TaskModal/TaskDescription.jsx"
import AddTimer from "@/components/AddTimer/AddTimer.jsx"
import MoveTaskDropdown from "@/components/Task/TaskModal/MoveTaskDropdown.jsx"
import { AddButton } from "@/components/Task/TaskModal/AddButton.jsx"
import { useToast } from "@/hooks/use-toast";

export default function TaskModal({
                                    isOpen,
                                    onClose,
                                    task,
                                    onUpdate,
                                    onDelete,
                                    columnId,
                                  }) {
  // Custom hooks and store access
  const { editedTask, setEditedTask, handleSave, handleClose } = useTaskModal(
    task,
    onUpdate,
    onClose,
  )
  const { getSubtaskStats } = useSubtaskStore()
  
  // Local state
  const [isTimerOpen, setIsTimerOpen] = useState(false)
  const [timerPosition, setTimerPosition] = useState({ top: 0, left: 0 })
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  
  // Get subtask statistics
  const { total, completed } = getSubtaskStats(task.id)
  const { toast } = useToast();
  
  // Refs
  const titleInputRef = useRef(null)
  const timerButtonRef = useRef(null)
  const timerRef = useRef(null)
  
  // Effects
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current.blur()
      }, 100)
    }
  }, [isOpen])
  
  useEffect(() => {
    if (isTimerOpen && timerRef.current) {
      const timerRect = timerRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      let { top, left } = timerPosition
      
      // Adjust position to keep timer within viewport
      if (left + timerRect.width > viewportWidth) {
        left = viewportWidth - timerRect.width - 10
      }
      if (left < 0) {
        left = 10
      }
      if (top + timerRect.height > viewportHeight) {
        top = viewportHeight - timerRect.height - 10
      }
      if (top < 0) {
        top = 10
      }
      
      setTimerPosition({ top, left })
    }
  }, [isTimerOpen, timerPosition])
  
  // Event handlers
  const handleDeleteTask = () => {
    onDelete(columnId, task.id)
    handleClose()
  }
  
  const handleTimerToggle = (e) => {
    e.stopPropagation()
    if (!isTimerOpen && timerButtonRef.current) {
      const rect = timerButtonRef.current.getBoundingClientRect()
      const timerHeight = 200
      setTimerPosition({
        top: Math.max(rect.top + window.scrollY - timerHeight - 1000, 10),
        left: rect.left + window.scrollX,
      })
    }
    setIsTimerOpen(!isTimerOpen)
  }
  
  const handleDueDateChange = (newDate) => {
    setEditedTask({ ...editedTask, dueDate: newDate })
  }
  
  const handleDescriptionChange = () => {
    setIsEditingDescription(true)
  }
  
  const handleDescriptionSave = (newDescription) => {
    setEditedTask({ ...editedTask, description: newDescription })
    setIsEditingDescription(false)
  }
  const handleNoteCreate = () => {
    setIsNoteModalOpen(true);
  };
  
  
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[750px] bg-white p-0 flex flex-col max-h-[90vh]"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}>
        {/* Modal content */}
        <div
          className="p-6 pb-3 flex-grow overflow-y-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <DialogHeader className="mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <input
                ref={titleInputRef}
                className="text-2xl font-bold w-full bg-transparent border-b-2 border-gray-200 focus:outline-none"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                tabIndex="-1"
              />
            </div>
          </DialogHeader>
          
          {/* Task details */}
          <div className="space-y-2">
            <TaskDescription
              description={editedTask.description}
              timeSpent={editedTask.timeSpent}
              isEditing={isEditingDescription}
              onSave={handleDescriptionSave}
              onCancel={() => setIsEditingDescription(false)}
            />
            <Separator />
            <SubtaskList taskId={task.id} />
            <Separator />
            <CommentCard
              taskId={task.id}
              comments={editedTask.comments}
              onAddComment={(taskId, content) => {
                const newComment = {
                  id: Date.now().toString(),
                  author: "Illia",
                  content,
                  createdAt: new Date().toISOString(),
                }
                setEditedTask({
                  ...editedTask,
                  comments: [...editedTask.comments, newComment],
                })
              }}
              onUpdateComment={(taskId, commentId, newContent) => {
                setEditedTask({
                  ...editedTask,
                  comments: editedTask.comments.map((comment) =>
                    comment.id === commentId
                      ? { ...comment, content: newContent }
                      : comment,
                  ),
                })
              }}
              onDeleteComment={(taskId, commentId) => {
                setEditedTask({
                  ...editedTask,
                  comments: editedTask.comments.filter(
                    (comment) => comment.id !== commentId,
                  ),
                })
              }}
            />
          </div>
        </div>
        
        {/* Modal footer */}
        <DialogFooter className="px-6 py-3 bg-gray-50 mt-auto">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <AddButton
                description={task.description}
                dueDate={task.dueDate}
                comments={task.comments}
                onDueDateChange={handleDueDateChange}
                onDescriptionChange={handleDescriptionChange}
                onNoteCreate={handleNoteCreate}
              />
              <MoveTaskDropdown task={editedTask} onClose={handleClose} />
              <Button
                ref={timerButtonRef}
                variant="outline"
                size="sm"
                onClick={handleTimerToggle}
              >
                <Clock size={16} className="mr-2" /> Timer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const { generateTaskPDF } = await import('@/components/Task/TaskModal/TaskPDFExport');
                    await generateTaskPDF(editedTask);
                    toast({
                      title: "Success",
                      description: "PDF report generated successfully",
                    });
                  } catch (error) {
                    console.error('Error generating PDF:', error);
                    toast({
                      title: "Error",
                      description: error.message || "Failed to generate PDF report",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <FileText size={16} className="mr-2" /> Reports
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteTask}
              >
                <Trash size={16} className="mr-2" /> Delete
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogFooter>
        
        <TaskNoteModal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          task={task}
        />
        
        
        {/* Timer overlay */}
        {isTimerOpen && (
          <div
            ref={timerRef}
            style={{
              position: "fixed",
              top: `${timerPosition.top}px`,
              left: `${timerPosition.left}px`,
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AddTimer
              defaultTaskId={task.id}
              onTimerClose={() => setIsTimerOpen(false)}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

