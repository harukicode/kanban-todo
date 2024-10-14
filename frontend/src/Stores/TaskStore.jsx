import { create } from 'zustand';
import useColumnsStore from '@/Stores/ColumnsStore';  // Подключаем колонок для взаимодействия

const useTaskStore = create(() => ({
	tasks: [],
	
	// Добавление новой задачи в конкретную колонку
	addTask: (columnId, newTask) => {
		const { columns, setColumns } = useColumnsStore.getState();
		const updatedColumns = columns.map(column =>
			column.id === columnId
				? { ...column, tasks: [...column.tasks, { ...newTask, id: Date.now().toString() }] }
				: column
		);
		setColumns(updatedColumns);  // Обновляем колонки с новой задачей
	},
	
	// Обновление задачи
	updateTask: (columnId, updatedTask) => {
		const { columns, setColumns } = useColumnsStore.getState();
		const updatedColumns = columns.map(column =>
			column.id === columnId
				? {
					...column,
					tasks: column.tasks.map(task =>
						task.id === updatedTask.id ? updatedTask : task
					),
				}
				: column
		);
		setColumns(updatedColumns);  // Обновляем колонку с обновленной задачей
	},
	
	// Удаление задачи
	deleteTask: (columnId, taskId) => {
		const { columns, setColumns } = useColumnsStore.getState();
		const updatedColumns = columns.map(column =>
			column.id === columnId
				? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
				: column
		);
		setColumns(updatedColumns);  // Обновляем колонку после удаления задачи
	},
	
	// Перемещение задачи между колонками
	moveTask: (fromColumnId, toColumnId, taskId) => {
		const { columns, setColumns } = useColumnsStore.getState();
		const fromColumn = columns.find(col => col.id === fromColumnId);
		const taskToMove = fromColumn.tasks.find(task => task.id === taskId);
		
		const updatedColumns = columns.map(column => {
			if (column.id === fromColumnId) {
				return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
			}
			if (column.id === toColumnId) {
				return { ...column, tasks: [...column.tasks, taskToMove] };
			}
			return column;
		});
		
		setColumns(updatedColumns);  // Обновляем колонки после перемещения задачи
	},
}));

export default useTaskStore;
