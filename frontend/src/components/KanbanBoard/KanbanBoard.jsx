import { ColumnsList } from '@/components/Column/ColumnList.jsx'
import BoardHeader from '@/components/KanbanBoard/BoadrHeader.jsx'
import Task from '@/components/Task/Task.jsx'
import { useFilteredTasks } from '@/hooks/KanbanBoard/useFilteredTasks.jsx'
import { useKanbanDnD } from '@/hooks/KanbanBoard/useKanbanDnd.jsx'
import useColumnsStore from '@/Stores/ColumnsStore.jsx'
import useProjectStore from '@/Stores/ProjectsStore.jsx'
import useTaskStore from '@/Stores/TaskStore.jsx'
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core'
import { useCallback, useMemo, useState } from 'react'

export default function KanbanBoard() {
  const { columns, setColumns, addColumn, deleteColumn, updateColumn } =
    useColumnsStore();
  const { activeProjectId } = useProjectStore();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { moveTask, addTask } = useTaskStore();
  const [showSubtasksForAllColumns, setShowSubtasksForAllColumns] = useState(false);
  
  const toggleShowSubtasksForAllColumns = () => {
    setShowSubtasksForAllColumns(!showSubtasksForAllColumns);
  };
  
  const {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useKanbanDnD({
    columns,
    moveTask,
    reorderTasks: useCallback(
      (columnId, oldIndex, newIndex) => {
        const updatedColumns = columns.map((column) => {
          if (column.id === columnId) {
            const updatedTasks = Array.from(column.tasks);
            const [movedTask] = updatedTasks.splice(oldIndex, 1);
            updatedTasks.splice(newIndex, 0, movedTask);
            return { ...column, tasks: updatedTasks };
          }
          return column;
        });
        setColumns(updatedColumns);
      },
      [columns, setColumns]
    ),
  });
  
  const projectFilteredColumns = useMemo(() => {
    return columns.filter((column) => column.projectId === activeProjectId);
  }, [columns, activeProjectId]);
  
  const filteredColumns = useFilteredTasks(
    projectFilteredColumns,
    priorityFilter
  );
  
  const addNewColumn = useCallback(() => {
    addColumn({
      title: "New Column",
      tasks: [],
      color: "#6b7280",
      projectId: activeProjectId,
    });
  }, [addColumn, activeProjectId]);
  
  const handleAddNewTask = useCallback(
    (columnId, newTask) => {
      addTask(columnId, { ...newTask, projectId: activeProjectId });
    },
    [addTask, activeProjectId]
  );
  
  return (
    <div className="kanban-board p-4">
      <BoardHeader
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onAddColumn={addNewColumn}
        toggleShowAllSubtasks={toggleShowSubtasksForAllColumns}
        showAllSubtasks={showSubtasksForAllColumns}
      />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ColumnsList
          columns={filteredColumns}
          handleAddNewTask={handleAddNewTask}
          updateColumn={updateColumn}
          deleteColumn={deleteColumn}
          showSubtasksForAllColumns={showSubtasksForAllColumns}
        />
        <DragOverlay>
          {activeTask && (
            <Task
              task={activeTask}
              columnId={
                activeTask.columnId ||
                columns.find((col) =>
                  col.tasks.some((t) => t.id === activeTask.id)
                )?.id
              }
              isDragging
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}