import React, { useCallback } from "react";
import Column from '@/components/Column/Column.jsx'

const ColumnList = ({ columns, setColumns }) => {
	const addNewTask = useCallback((columnId, task) => {
		setColumns((prevColumns) =>
			prevColumns.map((col) =>
				col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
			)
		);
	}, [setColumns]);
	
	const updateColumnColor = useCallback((columnId, newColor) => {
		setColumns((prevColumns) =>
			prevColumns.map((col) =>
				col.id === columnId ? { ...col, color: newColor } : col
			)
		);
	}, [setColumns]);
	
	const deleteTask = useCallback((columnId, taskId) => {
		setColumns((prevColumns) =>
			prevColumns.map((col) =>
				col.id === columnId
					? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
					: col
			)
		);
	}, [setColumns]);
	
	if (!Array.isArray(columns)) {
		console.error("ColumnList: 'columns' prop is undefined or not an array.");
		return null;
	}
	
	return (
		<div className="flex space-x-4 overflow-x-auto pb-4">
			{columns.map((column) => (
				<Column
					key={column.id}
					column={column}
					addNewTask={addNewTask}
					updateColumnColor={updateColumnColor}
					deleteTask={deleteTask}
				/>
			))}
		</div>
	);
};

export default React.memo(ColumnList);