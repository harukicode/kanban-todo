import Header from '@/components/KanbanBoard/Header.jsx'

const BoardHeader = ({
	                     priorityFilter,
	                     setPriorityFilter,
	                     onAddColumn,
	                     toggleShowAllSubtasks,
	                     showAllSubtasks
                     }) => {
	return (
		<Header
			priorityFilter={priorityFilter}
			setPriorityFilter={setPriorityFilter}
			onAddColumn={onAddColumn}
			toggleShowAllSubtasks={toggleShowAllSubtasks}
			showAllSubtasks={showAllSubtasks}
		/>
	);
};


export default BoardHeader;