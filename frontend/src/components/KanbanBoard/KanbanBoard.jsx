import useKanbanDnD from '@/hooks/KanbanHooks/useKanbanDND.jsx';
import useProjectStore from '@/Stores/ProjectsStore.jsx';
import useColumnsStore from '@/Stores/ColumnsStore.jsx';
import useTaskStore from '@/Stores/TaskStore';  // Новый TaskStore
import useFilteredTasks from '@/hooks/KanbanHooks/useFilteredTasks.jsx';  // Хук для фильтрации по приоритету
import { useCallback, useState, useMemo } from 'react';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import Header from './Header';
import Column from '../Column/Column.jsx';
import Task from '../Task/Task.jsx';

const KanbanBoard = () => {
  const { columns, addColumn, updateColumn, deleteColumn } = useColumnsStore();
  const { activeProjectId, filterByProject } = useProjectStore();  // Получаем метод фильтрации по проекту
  const { addTask, moveTask } = useTaskStore();  // Используем TaskStore для работы с задачами
  const [priorityFilter, setPriorityFilter] = useState('all');  // Локальный фильтр по приоритету
  const { sensors, activeTask, handleDragStart, handleDragOver, handleDragEnd } = useKanbanDnD({
    columns,
    moveTask,
  });
  
  // Фильтрация задач по проекту
  const projectFilteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      tasks: filterByProject(column.tasks, activeProjectId),  // Фильтрация задач по проекту
    }));
  }, [columns, activeProjectId, filterByProject]);
  
  
  // Фильтрация задач по приоритету
  const filteredColumns = useFilteredTasks(projectFilteredColumns, priorityFilter);
  
  // Добавление новой колонки
  const addNewColumn = useCallback(() => {
    const newColumn = {
      title: 'New Column',
      tasks: [],
      color: '#6b7280',
    };
    addColumn(newColumn);  // Используем функцию из ColumnsStore
  }, [addColumn]);
  
  // Добавление новой задачи
  const handleAddNewTask = useCallback((columnId, newTask) => {
    addTask(columnId, { ...newTask, projectId: activeProjectId });  // Привязываем задачу к проекту
  }, [addTask, activeProjectId]);
  
  return (
    <div className="kanban-board p-4">
      <Header
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onAddColumn={addNewColumn}
      />
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
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
