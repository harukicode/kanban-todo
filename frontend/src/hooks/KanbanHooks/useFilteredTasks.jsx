import { useMemo } from 'react';

const useFilteredTasks = (columns, priorityFilter) => {
	return useMemo(() => {
		return columns.map(column => ({
			...column,
			tasks: column.tasks.filter(task =>
				priorityFilter === 'all' || task.priority.toLowerCase() === priorityFilter
			)
		}));
	}, [columns, priorityFilter]);
};

export default useFilteredTasks;