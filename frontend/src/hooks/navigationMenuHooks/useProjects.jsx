// useProjects.jsx
import { useState } from "react";

export const useProjects = () => {
	const [projects, setProjects] = useState([
		{ id: "all", name: "All Projects", color: "#6b7280" },
		{ id: "1", name: "Mobile App", color: "#9333ea" },
		{ id: "2", name: "Website Redesign", color: "#eab308" },
		{ id: "3", name: "Design System", color: "#3b82f6" },
		{ id: "4", name: "Wireframes", color: "#6b7280" },
	]);
	const [activeProjectId, setActiveProjectId] = useState("all");
	
	const addProject = (newProject) => {
		const updatedProjects = [...projects, { ...newProject, id: Date.now().toString() }];
		setProjects(updatedProjects);
		return updatedProjects;
	};
	
	const getActiveProject = () => projects.find(p => p.id === activeProjectId) || projects[0];
	
	return {
		projects,
		setProjects,
		activeProjectId,
		setActiveProjectId,
		getActiveProject,
		addProject
	};
};