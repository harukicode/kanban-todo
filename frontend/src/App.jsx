import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.jsx";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.jsx";
import "./App.css";
import SideBar from "./components/SideBar/SideBar.jsx";
import SideTimer from "./components/SideTimer/SideTimer.jsx";
import NotesPage from "./components/Notes/Notes.jsx";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <SidebarProvider>
          <SideBar />
          <main className="flex-grow p-4">
            <SidebarTrigger />
            <Routes>
              <Route path="/" element={<Navigate to="/kanban" />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/timer" element={<SideTimer />} />
              <Route path="/notes" element={<NotesPage />} />
            </Routes>
          </main>
        </SidebarProvider>
      </div>
    </Router>
  );
};

export default App;
