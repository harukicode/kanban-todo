import { Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useTaskStore from "@/Stores/TaskStore";
import { usePriorityColor } from "@/hooks/Task/usePriorityColor";
import { useState } from "react";
import TaskModal from "@/components/Task/TaskModal/TaskModal";
import AddTimer from "@/components/AddTimer/AddTimer";

export default function Task({ task, columnId, isDragging = false }) {
  const priorityColorClass = usePriorityColor(task.priority);
  const { deleteTask, updateTask } = useTaskStore();
  const actualColumnId = columnId || task.columnId;
  const [showTimer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDeleteTask = () => {
    deleteTask(actualColumnId, task.id);
  };

  const handleUpdateTask = (updatedTask) => {
    updateTask(updatedTask, actualColumnId);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1,
    zIndex: isSortableDragging ? 1000 : 1,
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      {showTimer && (
        <div className="absolute right-full mr-2 top-0">
          <AddTimer />
        </div>
      )}
      <Card
        className={`mb-2 ${priorityColorClass} ${
          isDragging ? "shadow-lg" : ""
        }`}
        onClick={handleOpenModal}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm truncate mr-2">
              {task.title}
            </CardTitle>
            <Button
              variant="ghost"
              onClick={handleDeleteTask}
              className="p-0 h-auto"
            >
              <Trash size={14} />
            </Button>
          </div>
        </CardHeader>
      </Card>
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
