import { ColumnControls } from '@/components/Column/ColumnControls.jsx'

export const ColumnHeader = ({
	                      column,
	                      tasksCount,
	                      onAddTask,
	                      onToggleSubtasks,
	                      showAllSubtasks,
	                      propertiesOpen,
	                      setPropertiesOpen,
	                      onColorChange,
	                      onNameChange,
	                      onDeleteColumn,
	                      onToggleDoneColumn
                      }) => {
	return (
		<div className="flex items-center justify-between mb-2 pb-2 relative">
			<div className="flex items-center">
				<div
					className="w-3 h-3 rounded-full mr-2"
					style={{ backgroundColor: column.color || "inherit" }}
				/>
				<h3
					className="text-sm font-semibold"
					style={{ color: column.color || "inherit" }}
				>
					{column.title} ({tasksCount})
				</h3>
			</div>
			<ColumnControls
				onAddTask={onAddTask}
				onToggleSubtasks={onToggleSubtasks}
				showAllSubtasks={showAllSubtasks}
				propertiesOpen={propertiesOpen}
				setPropertiesOpen={setPropertiesOpen}
				onColorChange={onColorChange}
				onNameChange={onNameChange}
				columnName={column.title}
				onDeleteColumn={onDeleteColumn}
				doneColumn={column.doneColumn}
				onToggleDoneColumn={onToggleDoneColumn}
			/>
			<div
				className="absolute bottom-0 left-0 right-0 h-0.5"
				style={{ backgroundColor: column.color || "inherit" }}
			/>
		</div>
	);
};