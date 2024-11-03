import { Column } from "@/components/Column/Column.jsx";

export const ColumnsList = ({
  columns,
  handleAddNewTask,
  updateColumn,
  deleteColumn,
  showSubtasksForAllColumns,
}) => {
  return (
    <div className="flex space-x-4 pb-4 overflow-x-auto">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          columnId={column.id}
          tasks={column.tasks}
          addNewTask={(task) => handleAddNewTask(column.id, task)}
          updateColumn={updateColumn}
          deleteColumn={deleteColumn}
          showAllSubtasks={showSubtasksForAllColumns}
        />
      ))}
    </div>
  );
};
