import { CommentCard } from '@/components/Task/TaskModal/TaskComments.jsx'
import React, { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Clock, FileText, MoreHorizontal, Trash } from "lucide-react";
import { useTaskModal } from "@/hooks/Task/modalTaskHooks/useTaskModal.jsx";
import useSubtaskStore from "@/Stores/SubtaskStore";
import SubtaskList from "@/components/Task/TaskModal/SubtaskList.jsx";
import TaskDescription from "@/components/Task/TaskModal/TaskDescription.jsx";
import AddTimer from "@/components/AddTimer/AddTimer.jsx";
import MoveTaskDropdown from "@/components/Task/TaskModal/MoveTaskDropdown.jsx";
import { AddButton } from '@/components/Task/TaskModal/AddButton.jsx'


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
    onClose
  );
  const { getSubtaskStats } = useSubtaskStore();
  
  // Local state
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerPosition, setTimerPosition] = useState({ top: 0, left: 0 });
  
  // Get subtask statistics
  const { total, completed } = getSubtaskStats(task.id);
  
  // Refs
  const titleInputRef = useRef(null);
  const timerButtonRef = useRef(null);
  const timerRef = useRef(null);
  
  // Effects
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current.blur();
      }, 100);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isTimerOpen && timerRef.current) {
      const timerRect = timerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let { top, left } = timerPosition;
      
      // Adjust position to keep timer within viewport
      if (left + timerRect.width > viewportWidth) {
        left = viewportWidth - timerRect.width - 10;
      }
      if (left < 0) {
        left = 10;
      }
      if (top + timerRect.height > viewportHeight) {
        top = viewportHeight - timerRect.height - 10;
      }
      if (top < 0) {
        top = 10;
      }
      
      setTimerPosition({ top, left });
    }
  }, [isTimerOpen, timerPosition]);
  
  // Event handlers
  const handleDeleteTask = () => {
    onDelete(columnId, task.id);
    handleClose();
  };
  
  const handleTimerToggle = (e) => {
    e.stopPropagation();
    if (!isTimerOpen && timerButtonRef.current) {
      const rect = timerButtonRef.current.getBoundingClientRect();
      const timerHeight = 200;
      setTimerPosition({
        top: Math.max(rect.top + window.scrollY - timerHeight - 1000, 10),
        left: rect.left + window.scrollX,
      });
    }
    setIsTimerOpen(!isTimerOpen);
  };
  
  const handleDueDateChange = (newDate) => {
    setEditedTask({ ...editedTask, dueDate: newDate });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-white p-0 flex flex-col max-h-[90vh] ">
        {/* Modal content */}
        <div className="p-6 flex-grow overflow-y-auto scrollbar-hide" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <DialogHeader className="mb-4">
            <div className="flex items-center space-x-2 ">
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
          <div className="space-y-4">
            <TaskDescription
              description={editedTask.description}
              timeSpent={editedTask.timeSpent}
              onChange={(newDescription) =>
                setEditedTask({ ...editedTask, description: newDescription })
              }
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
                  author: 'Illia', // Замените на реальное имя пользователя
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
                  comments: editedTask.comments.map(comment =>
                    comment.id === commentId ? { ...comment, content: newContent } : comment
                  ),
                })
              }}
              onDeleteComment={(taskId, commentId) => {
                setEditedTask({
                  ...editedTask,
                  comments: editedTask.comments.filter(comment => comment.id !== commentId),
                })
              }}
            />
          </div>
        </div>
        
        {/* Modal footer */}
        <DialogFooter className="px-6 py-4 bg-gray-50 mt-auto">
          <div className="flex flex-wrap gap-2 justify-between w-full">
            <div className="flex flex-wrap gap-2">
              <AddButton description={task.description} dueDate={task.dueDate} comments={task.comments} onDueDateChange={handleDueDateChange}/>
              <MoveTaskDropdown task={editedTask} onClose={handleClose} />
              <Button
                ref={timerButtonRef}
                variant="outline"
                size="sm"
                onClick={handleTimerToggle}
              >
                <Clock size={16} className="mr-2" /> Timer
              </Button>
              <Button variant="outline" size="sm">
                <FileText size={16} className="mr-2" /> Reports
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal size={16} className="mr-2" /> More
              </Button>
            </div>
            <div className="flex gap-2">
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
            <AddTimer />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}