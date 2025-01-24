import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_URL = 'http://localhost:5000/api';

const useColumnsStore = create(
  persist(
    (set, get) => ({
      columns: [],
      isLoading: false,
      error: null,
      
      // Загрузка колонок
      fetchColumns: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/columns`);
          if (!response.ok) throw new Error('Failed to fetch columns');
          const columns = await response.json();
          set({ columns, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      setColumns: (newColumns) => set({ columns: newColumns }),
      
      addColumn: async (newColumn) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/columns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newColumn)
          });
          
          if (!response.ok) throw new Error('Failed to add column');
          const column = await response.json();
          
          set(state => ({
            columns: [...state.columns, column],
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      deleteColumn: async (columnId) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/columns/${columnId}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) throw new Error('Failed to delete column');
          
          set(state => ({
            columns: state.columns.filter(column => column.id !== columnId),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      updateColumn: async (updatedColumn) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/columns/${updatedColumn.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedColumn)
          });
          
          if (!response.ok) throw new Error('Failed to update column');
          const column = await response.json();
          
          set(state => ({
            columns: state.columns.map(col =>
              col.id === updatedColumn.id ? column : col
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      }
    }),
    {
      name: "columns-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        columns: state.columns,
      }),
    }
  )
);

export default useColumnsStore;