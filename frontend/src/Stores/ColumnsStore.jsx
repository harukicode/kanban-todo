import { create } from "zustand";

const useColumnsStore = create((set) => ({
  columns: [],

  setColumns: (newColumns) => set({ columns: newColumns }), // устанавливаю колонки

  // добавление новой колонки
  addColumn: (newColumn) =>
    set((state) => ({
      columns: [...state.columns, { ...newColumn, id: Date.now().toString(), doneColumn: false }], // добавляю новую колонку в массив колонок
    })),

  // удаление колонки
  deleteColumn: (ColumnId) =>
    set((state) => ({
      columns: state.columns.filter((column) => column.id !== ColumnId), // удаляю колонку по id
    })),

  // изменение колонки
  updateColumn: (updatedColumn) =>
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === updatedColumn.id
          ? { ...column, ...updatedColumn }
          : column
      ), // изменяю колонку по id
    })),
}));

export default useColumnsStore;
