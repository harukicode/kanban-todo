// src/App.jsx

import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import KanbanBoard from "./components/KanbanBoard/KanbanBoard";
import TimeTrackerNav from '@/components/TimeTrackerNav.jsx'
import "./App.css"; // Import CSS for styling
// Import other components like Timer and Notes when available

/**
 * App component serves as the root of the application.
 * It manages the active component/view based on sidebar navigation.
 */
const App = () => {
  // State to track the currently active component/view
  const [activeComponent, setActiveComponent] = useState("Kanban");
  
  // Function to render the active component based on the state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Kanban":
        return <KanbanBoard />;
      case "Timer":
        return <TimeTrackerNav/> ; // Placeholder for Timer component
      case "Notes":
        return <div>Notes Component</div>; // Placeholder for Notes component
      default:
        return <KanbanBoard />;
    }
  };
  
  return (
    <div className="flex">
      {/* Sidebar with navigation */}
      <Sidebar setActiveComponent={setActiveComponent} />
      
      {/* Main content area */}
      <main className="flex-grow p-4">
        {renderActiveComponent()}
      </main>
    </div>
  );
};

export default App;
