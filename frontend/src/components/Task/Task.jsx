import React, { useEffect, useState } from 'react'
import { Trash, ChevronDown, ChevronUp } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useTaskStore from "@/Stores/TaskStore";
import useSubtaskStore from "@/Stores/SubtaskStore";
import { usePriorityColor } from "@/hooks/Task/usePriorityColor";
import TaskModal from "@/components/Task/TaskModal/TaskModal";
import { Progress } from "@/components/ui/progress";

export default function Task({ task, columnId, isDragging = false, showSubtasks }) {
  // Custom hooks and store access
  const priorityColorClass = usePriorityColor(task.priority);
  const { deleteTask, updateTask } = useTaskStore();
  const {
    getSubtasksForTask,
    getSubtaskStats,
    toggleSubtask,
    deleteSubtasksForTask
  } = useSubtaskStore();
  
  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTaskSubtasks, setShowTaskSubtasks] = useState(showSubtasks);
  
  useEffect(() => {
    setShowTaskSubtasks(showSubtasks);
  }, [showSubtasks]);
  
  
  // Get subtask data
  const subtasks = getSubtasksForTask(task.id);
  const { progress, total, completed } = getSubtaskStats(task.id);
  
  // DnD-kit sortable hook setup
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: {
      ...task,
      columnId,
    },
  });
  
  /**
   * Handles task deletion
   * Deletes both the task and its subtasks
   */
  const handleDeleteTask = (e) => {
    e.stopPropagation();
    deleteSubtasksForTask(task.id);
    deleteTask(columnId, task.id);
  };
  
  /**
   * Handles toggling subtask visibility
   */
  const handleToggleSubtasks = (e) => {
    e.stopPropagation();
    setShowTaskSubtasks(!showTaskSubtasks);
  };
  
  // Drag styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1,
    zIndex: isSortableDragging ? 1000 : 1,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      <Card
        className={`mb-2 ${priorityColorClass} ${isDragging ? "shadow-lg" : ""}`}
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate mr-2">
              {task.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {subtasks.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleSubtasks}
                  className="p-0 h-auto"
                >
                  {showSubtasks ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteTask}
                className="p-0 h-auto"
              >
                <Trash size={14} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showTaskSubtasks && subtasks.length > 0 && (
          <CardContent>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">
                Subtasks: {completed}/{total}
              </div>
              <Progress value={progress} className="h-1 mb-2" />
              <div className="mt-2 space-y-1 max-h-32 ">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  ><Checkbox
                    id={`subtask-${subtask.id}`}
                    checked={subtask.completed}
                    onCheckedChange={() => toggleSubtask(subtask.id)}
                    className="h-4 w-4"
                  />
                    <label
                      htmlFor={`subtask-${subtask.id}`}
                      className={`text-xs ${
                        subtask.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {subtask.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      
      {/* Task modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        onUpdate={(updatedTask) => updateTask(updatedTask, columnId)}
        onDelete={handleDeleteTask}
        columnId={columnId}
      />
    </div>
  );
}