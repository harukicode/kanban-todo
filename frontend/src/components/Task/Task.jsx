import { format, parseISO } from "date-fns";
import { enGB, ru } from "date-fns/locale";
import React, { useEffect, useState } from "react";
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
import { Hourglass } from "lucide-react";

export default function Task({
  task,
  columnId,
  isDragging = false,
  showSubtasks,
  doneColumn,
}) {
  // Custom hooks and store access
  const priorityColorClass = usePriorityColor(task.priority);
  const { deleteTask, updateTask, startTimeForTask, isTaskFindActive, setSelectedTaskId } = useTaskStore();
  const {
    getSubtasksForTask,
    getSubtaskStats,
    toggleSubtask,
    deleteSubtasksForTask,
  } = useSubtaskStore();
  
  
  

  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTaskSubtasks, setShowTaskSubtasks] = useState(showSubtasks);
  
  const {isLoading } = useSubtaskStore();

  const handleClick = (e) => {
    e.stopPropagation();
    if (isTaskFindActive) {
      setSelectedTaskId(task.id);  // Сначала устанавливаем ID задачи
    } else {
      setIsModalOpen(true);
    }
  };
  
  useEffect(() => {
    setShowTaskSubtasks(showSubtasks);
  }, [showSubtasks]);

  // Get subtask data
  const subtasks = getSubtasksForTask(task.id);
  const { progress, total, completed } = getSubtaskStats(task.id);

  // Determine if layout changes should be animated
  const shouldAnimateLayoutChanges = ({ isSorting, wasDragging }) =>
    isSorting || wasDragging;

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
    animateLayoutChanges: ({ isSorting, wasDragging }) => {
      return shouldAnimateLayoutChanges({ isSorting, wasDragging });
    },
    transition: {
      duration: 300,
      easing: "ease-in-out", // Плавная анимация
    },
  });

  /**
   * Handles task deletion
   * Deletes both the task and its subtasks
   */
  const handleDeleteTask = async (e) => {
    e.stopPropagation();
    try {
      await deleteSubtasksForTask(task.id);
      await deleteTask(columnId, task.id);
    } catch (error) {
      console.error('Error deleting task and subtasks:', error);
    }
  };

  /**
   * Handles toggling subtask visibility
   */
  const handleToggleSubtasks = (e) => {
    e.stopPropagation();
    setShowTaskSubtasks(!showTaskSubtasks);
  };
  
  const handleTimerClick = (e) =>{
    e.stopPropagation();
    startTimeForTask(task.id);
  }
  

  // Drag styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 1000ms ease", // Добавляем более плавный переход
    opacity: isSortableDragging ? 0 : 1,
    zIndex: isSortableDragging ? 1000 : 1,
  };

  // Стиль для зачеркнутого текста (если задача завершена)
  const taskStyle = doneColumn ? "line-through text-muted-foreground" : "";
  
  

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
        onClick={(e) => handleClick(e)}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className={`text-sm truncate mr-2 ${taskStyle}`}>
              {task.title}
            </CardTitle>

            <div className="flex items-center space-x-2">
              
              {task.dueDate && (
                <div className="text-xs text-muted-foreground justify-end">
                  <p className="text-red-500 text-sm">Due date: </p>
                  {format(parseISO(task.dueDate), "d MMM yyyy", {
                    locale: enGB,
                  })}
                </div>
              )}
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
              <div className="mt-2 space-y-1 max-h-32">
                {isLoading ? (
                  <div className="text-center text-sm text-muted-foreground">
                    Loading subtasks...
                  </div>
                ) : (
                  subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      id={`subtask-${subtask.id}`}
                      checked={doneColumn || subtask.completed}
                      onCheckedChange={() => toggleSubtask(subtask.id)}
                      className="h-4 w-4"
                      // disabled={doneColumn}
                    />
                    <label
                      htmlFor={`subtask-${subtask.id}`}
                      className={`text-xs ${doneColumn || subtask.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {subtask.title}
                    </label>
                  </div>
                  ))
                )}
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
