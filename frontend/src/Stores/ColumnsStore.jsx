import { create } from 'zustand';

const useColumnsStore = create((set) => ({
	columns: [
		{ id: "1", title: "To Do", tasks: [], color: "#9333ea" },
		{ id: "2", title: "In Progress", tasks: [], color: "#eab308" },
		{ id: "3", title: "Done", tasks: [], color: "#3b82f6" },
	],
	
	// Установка новых колонок
	setColumns: (newColumns) => set({ columns: newColumns }),
	
	// Добавление новой колонки
	addColumn: (newColumn) => set((state) => ({
		columns: [...state.columns, { ...newColumn, id: Date.now().toString() }]
	})),
	
	// Обновление колонки
	updateColumn: (updatedColumn) => set((state) => ({
		columns: state.columns.map(col =>
			col.id === updatedColumn.id ? updatedColumn : col
		)
	})),
	
	// Удаление колонки
	deleteColumn: (columnId) => set((state) => ({
		columns: state.columns.filter(col => col.id !== columnId)
	})),
}));

export default useColumnsStore;
