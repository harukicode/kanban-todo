import useTaskStore from '@/Stores/TaskStore.jsx'
import { create } from "zustand";
const API_URL = 'http://localhost:5000/api';

const useColumnsStore = create(
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
          // Validate columnId
          if (!columnId) {
            throw new Error('Column ID is required');
          }
          
          console.log('Starting column deletion:', columnId);
          
          const response = await fetch(`${API_URL}/columns/${columnId}`, {
            method: 'DELETE'
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to delete column');
          }
          
          console.log('Server response success:', data);
          
          // Get TaskStore instance
          const taskStore = useTaskStore.getState();
          if (!taskStore) {
            throw new Error('Failed to access task store');
          }
          
          // Update tasks state
          const updatedTasks = taskStore.tasks.filter(task => task.columnId !== columnId);
          taskStore.setTasks(updatedTasks);
          
          // Update columns state
          set(state => ({
            columns: state.columns.filter(column => column.id !== columnId),
            isLoading: false
          }));
          
          console.log('Column deletion completed successfully');
          
        } catch (error) {
          console.error('Error during column deletion:', error);
          set({
            error: error.message,
            isLoading: false
          });
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
);

export default useColumnsStore;