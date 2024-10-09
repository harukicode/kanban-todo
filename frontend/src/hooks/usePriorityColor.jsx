export const usePriorityColor = (priority) => {
	const colorMapping = {
		None: "bg-gray-100 text-gray-900",
		Low: "bg-yellow-100 text-yellow-900",
		Secondary: "bg-blue-100 text-blue-900",
		High: "bg-red-100 text-red-900",
	};
	
	return colorMapping[priority];
};