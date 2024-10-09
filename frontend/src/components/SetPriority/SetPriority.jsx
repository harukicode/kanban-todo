import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

/**
 * SetPriority component provides a dropdown to select the priority of a task.
 */
const SetPriority = ({ selectedPriority, setSelectedPriority }) => {
	const priorities = ["None", "Low", "Secondary", "High"];
	const colorMapping = {
		None: "bg-gray-100 text-gray-900",
		Low: "bg-yellow-100 text-yellow-900",
		Secondary: "bg-blue-100 text-blue-900",
		High: "bg-red-100 text-red-900",
	};
	
	return (
		<div className="w-full flex flex-row flex-wrap gap-4">
			<Select value={selectedPriority} onValueChange={setSelectedPriority}>
				<SelectTrigger className={`w-[180px] ${colorMapping[selectedPriority]}`}>
					<SelectValue placeholder="Select Priority" />
				</SelectTrigger>
				<SelectContent>
					{priorities.map((priority) => (
						<SelectItem key={priority} value={priority}>
							{priority}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

export default SetPriority;