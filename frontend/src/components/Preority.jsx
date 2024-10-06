import { Select, SelectItem } from "@nextui-org/select";

export default function SetPreority({ selectedPriority, setSelectedPriority }) {
	const priorities = ["None", "Low", "Secondary", "Hight"];
	const colorMapping = {
		None: "default",
		Low: "warning",
		Secondary: "primary",
		Hight: "danger",
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
					<SelectItem key={priority}>
						{priority}
					</SelectItem>
				))}
			</Select>
		</div>
	);
}