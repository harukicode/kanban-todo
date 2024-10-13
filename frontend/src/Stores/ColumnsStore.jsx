import { create } from 'zustand';

const useColumnsStore = create((set) => ({
	columns: [
		{ id: "1", title: "To Do", tasks: [], color: "#9333ea" },
		{ id: "2", title: "In Progress", tasks: [], color: "#eab308" },
		{ id: "3", title: "Done", tasks: [], color: "#3b82f6" },
	],
	
	setColumns: (newColumns) => set({ columns: newColumns }),
	
	addColumn: (newColumn) => set((state) => ({
		columns: [...state.columns, { ...newColumn, id: Date.now().toString() }]
	})),
	
	updateColumn: (updatedColumn) => set((state) => ({
		columns: state.columns.map(col =>
			col.id === updatedColumn.id ? updatedColumn : col
		)
	})),
	
	deleteColumn: (columnId) => set((state) => ({
		columns: state.columns.filter(col => col.id !== columnId)
	})),
	
	addTask: (columnId, newTask) => set((state) => ({
		columns: state.columns.map(column =>
			column.id === columnId
				? { ...column, tasks: [...column.tasks, { ...newTask, id: Date.now().toString() }] }
				: column
		)
	})),
	
	moveTask: (fromColumnId, toColumnId, taskId) => set((state) => {
		const fromColumn = state.columns.find(col => col.id === fromColumnId);
		const toColumn = state.columns.find(col => col.id === toColumnId);
		const taskToMove = fromColumn.tasks.find(task => task.id === taskId);
		
		return {
			columns: state.columns.map(column => {
				if (column.id === fromColumnId) {
					return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
				}
				if (column.id === toColumnId) {
					return { ...column, tasks: [...column.tasks, taskToMove] };
				}
				return column;
			})
		};
	}),
	
	reorderTasks: (columnId, startIndex, endIndex) => set((state) => {
		const column = state.columns.find(col => col.id === columnId);
		const newTasks = Array.from(column.tasks);
		const [reorderedItem] = newTasks.splice(startIndex, 1);
		newTasks.splice(endIndex, 0, reorderedItem);
		
		return {
			columns: state.columns.map(col =>
				col.id === columnId ? { ...col, tasks: newTasks } : col
			)
		};
	}),
}));

export default useColumnsStore;