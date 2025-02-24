import ShortTimeAlert from '@/App/ShortTimeAlert.jsx'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { useTimerStore } from '@/lib/TimerLib/timerLib.jsx'
import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.jsx";
import "./App.css";
import SideBar from "./components/SideBar/SideBar.jsx";
import SideTimer from "./components/SideTimer/SideTimer.jsx";
import NotesPage from "./components/Notes/Notes.jsx";
import PageWrapper from "./App/PageWrapper.jsx";
import FocusPage from "./components/Focus/FocusPage.jsx";
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  
  useEffect(() => {
    useTimerStore.getState().initializeTimer();
  }, []);
  
  
  return (
    <Router>
      <div className="flex">
        <SidebarProvider>
          <SideBar />
          <main className="flex-grow p-4 pt-0">
            <AnimatePresence mode="wait">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/kanban" />}
                />
                <Route
                  path="/kanban"
                  element={
                    <PageWrapper>
                      <KanbanBoard />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/timer"
                  element={
                    <PageWrapper>
                      <SideTimer />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <PageWrapper>
                      <NotesPage />
                    </PageWrapper>
                  }
                />
                {/* Новый маршрут для страницы Focus */}
                <Route
                  path="/focus"
                  element={
                    <PageWrapper>
                      <FocusPage />
                    </PageWrapper>
                  }
                />
              </Routes>
            </AnimatePresence>
          </main>
          <ShortTimeAlert />
        
        </SidebarProvider>
        
      </div>
      <Toaster/>
    </Router>
  );
};

export default App;