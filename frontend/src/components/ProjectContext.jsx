// ProjectContext.jsx
import  { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
	const [projects, setProjects] = useState([
		{ id: "all", name: "All Projects", color: "#6b7280" },
	]);
	const [activeProjectId, setActiveProjectId] = useState("all");
	
	const addProject = (newProject) => {
		setProjects(prevProjects => [...prevProjects, { ...newProject, id: Date.now().toString() }]);
	};
	
	return (
		<ProjectContext.Provider value={{ projects, setProjects, activeProjectId, setActiveProjectId, addProject }}>
			{children}
		</ProjectContext.Provider>
	);
};

export const useProjects = () => useContext(ProjectContext);