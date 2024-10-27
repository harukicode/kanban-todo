import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.jsx'
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.jsx";
import "./App.css";
import SideBarS from "./components/SideBar/SideBarS.jsx";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <SidebarProvider>
        <SideBarS />
        <main className="flex-grow p-4">
          <SidebarTrigger />
          <Routes>
            <Route path="/" element={<Navigate to="/kanban" />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/timer" element={<div>Timer Component</div>} />
            <Route path="/notes" element={<div>Notes Component</div>} />
          </Routes>
        </main>
        </SidebarProvider>
      </div>
    </Router>
  );
};

export default App;
