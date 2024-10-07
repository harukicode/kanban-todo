import React from "react";

import Column from '@/components/Column/Column.jsx'

/**
 * ColumnList component displays all the columns in the Kanban board.
 * Handles editing and deleting columns based on edit mode.
 */
const ColumnList = ({ columns, editMode, handleEditClick, setColumns }) => {
	
	// Check if 'columns' is defined and is an array
	if (!columns || !Array.isArray(columns)) {
		console.error("ColumnList: 'columns' prop is undefined or not an array.");
		return null; // Prevent rendering if columns is undefined or not an array
	}
	
	return (
		<div className="flex space-x-4 overflow-x-auto pb-4">
			{columns.map((column) => (
				<Column
					key={column.id}
					column={column}
					editColumnTitle={editMode ? handleEditClick : null}
					addNewTask={(task) =>
						setColumns((prevColumns) =>
							prevColumns.map((col) =>
								col.id === column.id
									? { ...col, tasks: [...col.tasks, task] }
									: col
							)
						)
					}
				/>
			))}
		</div>
	);
};



export default ColumnList;
