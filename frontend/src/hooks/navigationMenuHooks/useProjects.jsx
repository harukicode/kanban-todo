import { useState } from "react";

export const useProjects = () => {
	const [activeProject, setActiveProject] = useState(null);
	
	const projects = [
		{ name: "Mobile App", color: "#9333ea" },
		{ name: "Website Redesign", color: "#eab308" },
		{ name: "Design System", color: "#3b82f6" },
		{ name: "Wireframes", color: "#6b7280" },
	];
	
	return { projects, activeProject, setActiveProject };
};