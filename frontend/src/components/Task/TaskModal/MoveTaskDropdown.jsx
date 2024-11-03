import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoveRight } from "lucide-react";
import useProjectStore from "@/Stores/ProjectsStore";
import useColumnsStore from "@/Stores/ColumnsStore";
import useTaskStore from "@/Stores/TaskStore";

export default function MoveTaskDropdown({ task, onClose }) {
  const [selectedProject, setSelectedProject] = useState(task.projectId || "");
  const [selectedColumn, setSelectedColumn] = useState(task.columnId || "");
  const { projects } = useProjectStore();
  const { columns } = useColumnsStore();
  const { moveTask } = useTaskStore();

  // Фильтруем колонки для выбранного проекта
  const availableColumns = columns.filter(
    (column) => column.projectId === selectedProject,
  );

  // Обработчик изменения проекта
  const handleProjectChange = (newProjectId) => {
    setSelectedProject(newProjectId);

    // Получаем колонки для нового проекта
    const newProjectColumns = columns.filter(
      (column) => column.projectId === newProjectId,
    );

    // Если есть доступные колонки, выбираем первую
    if (newProjectColumns.length > 0) {
      setSelectedColumn(newProjectColumns[0].id);
    } else {
      setSelectedColumn(""); // Сбрасываем выбор колонки, если колонок нет
    }
  };

  // Обработчик изменения колонки
  const handleColumnChange = (newColumnId) => {
    setSelectedColumn(newColumnId);
  };

  const handleMove = () => {
    if (!selectedProject || !selectedColumn) {
      console.error("Project or column not selected", {
        selectedProject,
        selectedColumn,
        availableColumns,
      });
      return;
    }

    if (
      selectedProject !== task.projectId ||
      selectedColumn !== task.columnId
    ) {
      console.log("Moving task:", {
        taskId: task.id,
        fromColumnId: task.columnId,
        toColumnId: selectedColumn,
        toProjectId: selectedProject,
      });

      moveTask(
        task.timeSpent,
        task.description,
        task.comments,
        task.dueDate,
        task.id,
        task.columnId,
        selectedColumn,
        selectedProject,
      );
      onClose();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoveRight size={16} className="mr-2" /> Move
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Move task</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 space-y-2">
          <Select value={selectedProject} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedColumn}
            onValueChange={handleColumnChange}
            disabled={!selectedProject || availableColumns.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  availableColumns.length === 0
                    ? "No columns available"
                    : "Select column"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableColumns.map((column) => (
                <SelectItem key={column.id} value={column.id}>
                  {column.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            className="w-full cursor-pointer"
            onClick={handleMove}
            disabled={
              !selectedProject ||
              !selectedColumn ||
              availableColumns.length === 0
            }
          >
            Move
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
