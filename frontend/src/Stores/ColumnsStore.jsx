import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useColumnsStore = create(
  persist(
    (set) => ({
      columns: [],
      
      setColumns: (newColumns) => set({ columns: newColumns }),
      
      addColumn: (newColumn) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { ...newColumn, id: Date.now().toString(), doneColumn: false },
          ],
        })),
      
      deleteColumn: (ColumnId) =>
        set((state) => ({
          columns: state.columns.filter((column) => column.id !== ColumnId),
        })),
      
      updateColumn: (updatedColumn) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === updatedColumn.id
              ? { ...column, ...updatedColumn }
              : column
          ),
        })),
    }),
    {
      name: "columns-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        columns: state.columns,
      }),
    }
  )
);

export default useColumnsStore;