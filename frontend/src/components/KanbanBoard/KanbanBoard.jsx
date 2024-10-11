import { useState } from "react";
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Header from "./Header";
import Column from "../Column/Column.jsx";
import Task from "../Task/Task.jsx";

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    { id: "1", title: "To Do", tasks: [], color: "#9333ea" },
    { id: "2", title: "In Progress", tasks: [], color: "#eab308" },
    { id: "3", title: "Done", tasks: [], color: "#3b82f6" },
  ]);
  
  const [activeTask, setActiveTask] = useState(null);
  const [addTimer, setAddTimer] = useState(false);
  const [activeProject, setActiveProject] = useState("all");
  
  const projects = [
    { id: "1", name: "Mobile App" },
    { id: "2", name: "Website Redesign" },
    { id: "3", name: "Design System" },
  ];
  
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
    const activeColumn = findColumnByTaskId(active.id);
    const overColumn = findColumnByTaskId(over?.id) || columns.find(col => col.id === over?.id);
    
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }
    
    setColumns(prevColumns => {
      const activeItems = activeColumn.tasks;
      const overItems = overColumn.tasks;
      
      const activeIndex = activeItems.findIndex(item => item.id === active.id);
      const overIndex = overItems.findIndex(item => item.id === over?.id) + 1;
      
      return prevColumns.map(column => {
        if (column.id === activeColumn.id) {
          column.tasks = activeItems.filter(item => item.id !== active.id);
          return column;
        } else if (column.id === overColumn.id) {
          column.tasks = [
            ...overItems.slice(0, overIndex),
            activeItems[activeIndex],
            ...overItems.slice(overIndex)
          ];
          return column;
        } else {
          return column;
        }
      });
    });
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
      setColumns(prevColumns => {
        const activeTask = activeColumn.tasks.find(task => task.id === activeId);
        
        return prevColumns.map(column => {
          if (column.id === activeColumn.id) {
            return {
              ...column,
              tasks: column.tasks.filter(task => task.id !== activeId)
            };
          } else if (column.id === overColumn.id) {
            return {
              ...column,
              tasks: [...column.tasks, activeTask]
            };
          } else {
            return column;
          }
        });
      });
    } else {
      setColumns(prevColumns => {
        const columnIndex = prevColumns.indexOf(activeColumn);
        const oldIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
        const newIndex = activeColumn.tasks.findIndex(task => task.id === overId);
        
        const newColumns = [...prevColumns];
        newColumns[columnIndex] = {
          ...activeColumn,
          tasks: arrayMove(activeColumn.tasks, oldIndex, newIndex)
        };
        
        return newColumns;
      });
    }
  };
  
  const addNewTask = (columnId, newTask) => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, { ...newTask, id: Date.now().toString() }] }
          : column
      )
    );
  };
  
  return (
    <div className="kanban-container p-4">
      <Header
        addTimer={addTimer}
        setAddTimer={setAddTimer}
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
      />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex space-x-4 pb-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={column.tasks}
              addNewTask={(task) => addNewTask(column.id, task)}
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