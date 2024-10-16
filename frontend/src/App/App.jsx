import { TimerProvider } from '@/components/KanbanBoard/AddTimer/TimerContext.jsx'
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Sidebar from "../components/SideBar/Sidebar.jsx";
import KanbanBoard from "../components/KanbanBoard/KanbanBoard.jsx";
import TimeTrackerNav from '@/components/TimeTrackerNav.jsx'
import "./App.css";
const App = () => {
  return (
    <Router>
      <TimerProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/timer" element={<TimeTrackerNav />} />
            <Route path="/notes" element={<div>Notes Component</div>} />
          </Routes>
        </main>
      </div>
      </TimerProvider>
    </Router>
  );
};

export default App;