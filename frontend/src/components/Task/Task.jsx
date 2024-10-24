import React, { useState } from "react";
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
import AddTimer from "@/components/AddTimer/AddTimer";
import { Progress } from "@/components/ui/progress";

/**
 * Task Component
 * Represents a single task card in the kanban board
 *
 * @param {Object} task - Task data object
 * @param {string} columnId - ID of the column containing this task
 * @param {boolean} isDragging - Whether the task is currently being dragged
 */
export default function Task({ task, columnId, isDragging = false }) {
  // Custom hooks and store access
  const priorityColorClass = usePriorityColor(task.priority);
  const { deleteTask, updateTask } = useTaskStore();
  const { getSubtasksForTask, toggleSubtask } = useSubtaskStore();
  
  // Local state
  const actualColumnId = columnId || task.columnId;
  const [showTimer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  
  // Get subtasks and calculate progress
  const subtasks = getSubtasksForTask(task.id);
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  const subtaskProgress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
  
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
      columnId: actualColumnId,
    },
  });
  
  // Event handlers
  const handleDeleteTask = (e) => {
    e.stopPropagation();
    deleteTask(actualColumnId, task.id);
  };
  
  const handleUpdateTask = (updatedTask) => {
    updateTask(updatedTask, actualColumnId);
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleToggleSubtasks = (e) => {
    e.stopPropagation();
    setShowSubtasks(!showSubtasks);
  };
  
  const handleSubtaskToggle = (e, subtaskId) => {
    e.stopPropagation();
    toggleSubtask(subtaskId);
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
      {/* Timer overlay */}
      {showTimer && (
        <div className="absolute right-full mr-2 top-0">
          <AddTimer />
        </div>
      )}
      
      {/* Task card */}
      <Card
        className={`mb-2 ${priorityColorClass} ${isDragging ? "shadow-lg" : ""}`}
        onClick={handleOpenModal}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate mr-2">
              {task.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {/* Subtasks toggle button */}
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
              {/* Delete button */}
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
        
        {/* Subtasks section */}
        {showSubtasks && subtasks.length > 0 && (
          <CardContent>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">
                Subtasks: {completedSubtasks}/{subtasks.length}
              </div>
              <Progress value={subtaskProgress} className="h-1 mb-2" />
              <div className="mt-2 space-y-1 overflow-hidden">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subtask-${subtask.id}`}
                      checked={subtask.completed}
                      onCheckedChange={(e) => handleSubtaskToggle(e, subtask.id)}
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
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        columnId={actualColumnId}
      />
    </div>
  );
}