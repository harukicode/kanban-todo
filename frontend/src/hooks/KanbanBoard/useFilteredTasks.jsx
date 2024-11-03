import { useMemo } from "react";

export const useFilteredTasks = (columns, priorityFilter) => {
  return useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter(
        (task) =>
          priorityFilter === "all" ||
          task.priority.toLowerCase() === priorityFilter,
      ),
    }));
  }, [columns, priorityFilter]);
};
