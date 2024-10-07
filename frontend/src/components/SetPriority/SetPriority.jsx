import React from "react";
import { Select, SelectItem } from "@nextui-org/select";

/**
 * SetPriority component provides a dropdown to select the priority of a task.
 */
const SetPriority = ({ selectedPriority, setSelectedPriority }) => {
	const priorities = ["None", "Low", "Secondary", "High"]; // Corrected 'High'
	const colorMapping = {
		None: "default",
		Low: "warning",
		Secondary: "primary",
		High: "danger",
	};
	
	return (
		<div className="w-full flex flex-row flex-wrap gap-4">
			<Select
				color={colorMapping[selectedPriority]}
				label="Set Priority"
				placeholder="Select Priority"
				selectedKeys={[selectedPriority]}
				onSelectionChange={(keys) => setSelectedPriority(Array.from(keys)[0])}
				className="max-w-xs"
			>
				{priorities.map((priority) => (
					<SelectItem key={priority}>{priority}</SelectItem>
				))}
			</Select>
		</div>
	);
};



export default SetPriority;
