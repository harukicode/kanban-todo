import { create } from 'zustand';

const useColumnsStore = create((set) => ({
	columns: [],
	
	setColumns: (newColumns) => set({ columns: newColumns }),
	
	addColumn: (newColumn) => set((state) => ({
		columns: [...state.columns, { ...newColumn, id: Date.now().toString() }]
	})),

	
	updateColumn: (updatedColumn) => set((state) => ({
		columns: state.columns.map(column =>
			column.id === updatedColumn.id ? updatedColumn : column
		)
	})),
	
	deleteColumn: (columnId) => set((state) => ({
		columns: state.columns.filter(column => column.id !== columnId)
	})),
}));

export default useColumnsStore;
