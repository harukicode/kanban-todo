import { ColumnPropertiesButton } from '@/components/Column/ColumnPropertiesButton.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'

export const ColumnControls = ({
	                        onAddTask,
	                        onToggleSubtasks,
	                        showAllSubtasks,
	                        propertiesOpen,
	                        setPropertiesOpen,
	                        ...propertiesProps
                        }) => {
	return (
		<div className="flex items-center space-x-1">
			<Button variant="ghost" size="icon" onClick={onAddTask}>
				<Plus className="h-4 w-4" />
			</Button>
			<Button onClick={onToggleSubtasks} variant="ghost">
				{showAllSubtasks ? (
					<ChevronUp size={14} />
				) : (
					<ChevronDown size={14} />
				)}
			</Button>
			<ColumnPropertiesButton
				open={propertiesOpen}
				setOpen={setPropertiesOpen}
				handleOpenModal={onAddTask}
				{...propertiesProps}
			/>
		</div>
	);
};