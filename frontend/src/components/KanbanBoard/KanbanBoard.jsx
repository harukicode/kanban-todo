import useFilteredTasks from '@/hooks/KanbanHooks/useFilteredTasks.jsx';
import useKanbanDnD from '@/hooks/KanbanHooks/useKanbanDND.jsx';
import { useTimer } from '@/hooks/timerHooks/useTimer.jsx'
import useColumnsStore from '@/Stores/ColumnsStore.jsx';
import useProjectStore from '@/Stores/ProjectsStore.jsx';
import useTaskStore from '@/Stores/TaskStore';
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import { useCallback, useMemo, useState } from 'react';
import Column from '../Column/Column.jsx';
import Task from '../Task/Task.jsx';
import Header from './Header';

const KanbanBoard = () => {
  const { columns, setColumns, addColumn, updateColumn, deleteColumn } = useColumnsStore(); // Теперь setColumns импортирован
  const { activeProjectId } = useProjectStore();  // Получаем активный проект
  const { addTask, moveTask } = useTaskStore();  // Работа с задачами
  const [priorityFilter, setPriorityFilter] = useState('all');  // Фильтр по приоритету
  const { isSelectingTaskForTimer, setSelectedTask, setIsSelectingTaskForTimer, setAddTimer } = useTimer();
  
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setIsSelectingTaskForTimer(false);
    setAddTimer(true);
  };
  
  // Функция reorderTasks для перемещения задач в колонке
  const reorderTasks = useCallback((columnId, oldIndex, newIndex) => {
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        const updatedTasks = Array.from(column.tasks);
        const [movedTask] = updatedTasks.splice(oldIndex, 1);
        updatedTasks.splice(newIndex, 0, movedTask);
        return { ...column, tasks: updatedTasks };
      }
      return column;
    });
    setColumns(updatedColumns);  // Обновляем состояние колонок
  }, [columns, setColumns]);
  
  // Инициализация DnD
  const { sensors, activeTask, handleDragStart, handleDragOver, handleDragEnd } = useKanbanDnD({
    columns,
    moveTask,
    reorderTasks,  // Передаем функцию reorderTasks
  });
  
  // Фильтрация колонок по проекту
  const projectFilteredColumns = useMemo(() => {
    return columns.filter(column => column.projectId === activeProjectId);
  }, [columns, activeProjectId]);
  
  // Фильтрация задач по приоритету
  const filteredColumns = useFilteredTasks(projectFilteredColumns, priorityFilter);
  
  // Добавление новой колонки
  const addNewColumn = useCallback(() => {
    const newColumn = {
      title: 'New Column',
      tasks: [],
      color: '#6b7280',
      projectId: activeProjectId,
    };
    addColumn(newColumn);
  }, [addColumn, activeProjectId]);
  
  // Добавление новой задачи
  const handleAddNewTask = useCallback((columnId, newTask) => {
    addTask(columnId, { ...newTask, projectId: activeProjectId });
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
              columnId={column.id}
              tasks={column.tasks}
              addNewTask={(task) => handleAddNewTask(column.id, task)}
              updateColumn={updateColumn}
              deleteColumn={deleteColumn}
              isSelectingTaskForTimer={isSelectingTaskForTimer}
              onTaskSelect={handleTaskSelect}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <Task
              task={activeTask}
              columnId={activeTask.columnId || columns.find(col =>
                col.tasks.some(t => t.id === activeTask.id)
              )?.id}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
