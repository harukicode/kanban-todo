import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "../components/SideBar/Sidebar.jsx";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard.jsx";
import "./App.css";
const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/kanban" />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/timer" element={<div>Timer Component</div>} />
            <Route path="/notes" element={<div>Notes Component</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
