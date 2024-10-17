import { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  MoveRight,
  Clock,
  FileText,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { useTaskModal } from "@/hooks/Task/modalTaskHooks/useTaskModal.jsx";
import { useSubtasks } from "@/hooks/Task/modalTaskHooks/useSubtasks.jsx";
import SubtaskList from "@/components/Task/TaskModal/SubtaskList.jsx";
import TaskDescription from "@/components/Task/TaskModal/TaskDescription.jsx";
import AddTimer from "@/components/AddTimer/AddTimer.jsx";

export default function TaskModal({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
  columnId,
}) {
  const { editedTask, setEditedTask, handleSave, handleClose } = useTaskModal(
    task,
    onUpdate,
    onClose
  );
  const {
    subtasks,
    completedSubtasks,
    newSubtask,
    setNewSubtask,
    handleSubtaskToggle,
    handleAddSubtask,
  } = useSubtasks(editedTask, setEditedTask);

  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [timerPosition, setTimerPosition] = useState({ top: 0, left: 0 });

  const titleInputRef = useRef(null);
  const timerButtonRef = useRef(null);
  const timerRef = useRef(null);

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

      // Проверяем и корректируем позицию по горизонтали
      if (left + timerRect.width > viewportWidth) {
        left = viewportWidth - timerRect.width - 10; // 10px отступ от края
      }
      if (left < 0) {
        left = 10; // 10px отступ от левого края
      }

      // Проверяем и корректируем позицию по вертикали
      if (top + timerRect.height > viewportHeight) {
        top = viewportHeight - timerRect.height - 10; // 10px отступ от низа
      }
      if (top < 0) {
        top = 10; // 10px отступ от верха
      }

      setTimerPosition({ top, left });
    }
  }, [isTimerOpen, timerPosition]);

  const handleDeleteTask = () => {
    onDelete(columnId, task.id);
    handleClose();
  };

  const handleTimerToggle = (e) => {
    e.stopPropagation();
    if (!isTimerOpen && timerButtonRef.current) {
      const rect = timerButtonRef.current.getBoundingClientRect();
      const timerHeight = 200; // Примерная высота таймера, уточните это значение
      setTimerPosition({
        top: Math.max(rect.top + window.scrollY - timerHeight - 1000, 10), // Размещаем над кнопкой, но не выше верха экрана
        left: rect.left + window.scrollX,
      });
    }
    setIsTimerOpen(!isTimerOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-white p-0 flex flex-col max-h-[90vh]">
        <div className="p-6 flex-grow overflow-y-auto">
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
          <div className="space-y-4">
            <TaskDescription
              description={editedTask.description}
              timeSpent={editedTask.timeSpent}
              onChange={(newDescription) =>
                setEditedTask({ ...editedTask, description: newDescription })
              }
            />
            <Separator />
            <SubtaskList
              subtasks={subtasks}
              completedSubtasks={completedSubtasks}
              newSubtask={newSubtask}
              setNewSubtask={setNewSubtask}
              onSubtaskToggle={handleSubtaskToggle}
              onAddSubtask={handleAddSubtask}
            />
          </div>
        </div>
        <DialogFooter className="px-6 py-4 bg-gray-50 mt-auto">
          <div className="flex flex-wrap gap-2 justify-between w-full">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Plus size={16} className="mr-2" /> Add
              </Button>
              <Button variant="outline" size="sm">
                <MoveRight size={16} className="mr-2" /> Move
              </Button>
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
