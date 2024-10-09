import React, { useState } from "react";
import Header from "./Header";
import ColumnList from "../Column/ColumnList.jsx";
/**
 * KanbanBoard component serves as the main container for the Kanban board.
 * It manages the state of columns, edit mode, active project, and handles adding/editing columns.
 */
const KanbanBoard = () => {
  // State for managing the list of columns
  const [columns, setColumns] = useState([
    { id: "1", title: "To Do", tasks: [], color: "#9333ea" },
    { id: "2", title: "In Progress", tasks: [], color: "#eab308" },
    { id: "3", title: "Done", tasks: [], color: "#3b82f6" },
  ]);
  

  
  // State for managing new column input
  const [newColumnTitle, setNewColumnTitle] = useState("");
  
  // State for managing edit mode and active project selection
  const [addTimer, setAddTimer] = useState(false);
  const [activeProject, setActiveProject] = useState("all");
  
  // List of available projects
  const projects = [
    { id: "1", name: "Mobile App" },
    { id: "2", name: "Website Redesign" },
    { id: "3", name: "Design System" },
  ];
  
  
  /**
   * Adds a new column to the Kanban board.
   */
  const addColumn = () => {
    if (newColumnTitle.trim() === "") return; // Prevent adding empty titles
    
    const newColumn = {
      id: Date.now().toString(),
      title: newColumnTitle.trim(),
      tasks: [],
      color: "#10b981", // Default color for new columns
    };
    setColumns((prevColumns) => [...prevColumns, newColumn]);
    setNewColumnTitle("");
  };
  
  return (
    <div className="kanban-container p-4">
      {/* Header component with edit mode and project selection */}
      <Header
        addTimer={addTimer}
        setAddTimer={setAddTimer}
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
      />
      
      {/* List of columns */}
      <ColumnList
        columns={columns}
        setColumns={setColumns}
      />
      
    </div>
  );
};

export default KanbanBoard;
