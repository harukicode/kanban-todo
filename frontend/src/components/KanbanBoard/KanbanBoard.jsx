import useProjectStore from '@/Stores/ProjectsStore.jsx'
import useColumnsStore from '@/Stores/ColumnsStore.jsx'
import { useCallback, useState, useMemo } from 'react'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import Header from "./Header";
import Column from "../Column/Column.jsx";
import Task from "../Task/Task.jsx";

const KanbanBoard = () => {
  const { columns, setColumns, addColumn, updateColumn, deleteColumn, addTask, moveTask, reorderTasks } = useColumnsStore();
  const [activeTask, setActiveTask] = useState(null);
  const [addTimer, setAddTimer] = useState(false);
  const { projects, activeProjectId, addProject, setActiveProjectId } = useProjectStore();
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  
  const findColumnByTaskId = (taskId) => {
    return columns.find(column => column.tasks.some(task => task.id === taskId));
  };
  
  const onDragStart = (event) => {
    const { active } = event;
    const activeColumn = findColumnByTaskId(active.id);
    if (activeColumn) {
      const activeTask = activeColumn.tasks.find(task => task.id === active.id);
      setActiveTask(activeTask);
    }
  };
  
  const onDragOver = ({ active, over }) => {
    if (!active || !over) return;
    
    const activeColumn = findColumnByTaskId(active.id);
    const overColumn = findColumnByTaskId(over.id) || columns.find(col => col.id === over.id);
    
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }
    
    moveTask(activeColumn.id, overColumn.id, active.id);
  };
  
  const onDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    
    if (!active || !over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    const activeColumn = findColumnByTaskId(activeId);
    const overColumn = findColumnByTaskId(overId) || columns.find(col => col.id === overId);
    
    if (!activeColumn || !overColumn) return;
    
    if (activeColumn !== overColumn) {
      moveTask(activeColumn.id, overColumn.id, activeId);
    } else {
      const oldIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
      const newIndex = activeColumn.tasks.findIndex(task => task.id === overId);
      reorderTasks(activeColumn.id, oldIndex, newIndex);
    }
  };
  
  const addNewColumn = useCallback(() => {
    const newColumn = {
      title: "New Column",
      tasks: [],
      color: "#6b7280" // default color
    };
    addColumn(newColumn);
  }, [addColumn]);
  
  const handleAddNewTask = useCallback((columnId, newTask) => {
    addTask(columnId, { ...newTask, projectId: activeProjectId });
  }, [addTask, activeProjectId]);
  
  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task =>
        (activeProjectId === "all" || task.projectId === activeProjectId) &&
        (priorityFilter === "all" || task.priority.toLowerCase() === priorityFilter)
      )
    }));
  }, [columns, activeProjectId, priorityFilter]);
  
  return (
    <div className="kanban-board p-4">
      <Header
        addTimer={addTimer}
        setAddTimer={setAddTimer}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onAddColumn={addNewColumn}
      />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex space-x-4 pb-4 overflow-x-auto">
          {filteredColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={column.tasks}
              addNewTask={(task) => handleAddNewTask(column.id, task)}
              updateColumn={updateColumn}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <Task task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;