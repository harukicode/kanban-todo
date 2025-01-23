// AddTimer.jsx
import ShortTimeAlert from '@/App/ShortTimeAlert.jsx'
import { TimerModeChangeAlert } from '@/hooks/TimerModeChangeAlert.jsx'
import React, { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Timer } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import TimerFooter from "./TimerFooter";
import { useTimer, useTimerStore } from '@/lib/TimerLib/timerLib.js'
import useTaskStore from "@/stores/TaskStore";

export default function AddTimer({ defaultTaskId }) {
  const {
    time,
    isRunning,
    mode,
    setMode,
    startTimer,
    stopTimer,
    setSelectedTask,
    resetPomodoro,
    showModeChangeAlert,
    setShowModeChangeAlert,
    handleConfirmModeChange,
    pendingMode
  } = useTimer();
  
  const tasks = useTaskStore((state) => state.tasks);
  const startFind = useTaskStore((state) => state.startFind);
  const isTaskFindActive = useTaskStore((state) => state.isTaskFindActive);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);
  const showShortTimeAlert = useTimerStore((state) => state.showShortTimeAlert);
  const setShowShortTimeAlert = useTimerStore((state) => state.setShowShortTimeAlert);
  // Находим выбранную задачу
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  
  useEffect(() => {
    if (defaultTaskId) {
      const selectedTask = tasks.find(task => task.id === defaultTaskId);
      if (selectedTask) {
        useTaskStore.getState().setSelectedTaskId(defaultTaskId);
        setSelectedTask(defaultTaskId);
      }
    }
  }, [defaultTaskId, tasks, setSelectedTask]);
  
  // Синхронизируем выбранную задачу с таймером
  useEffect(() => {
    if (selectedTaskId) {
      setSelectedTask(selectedTaskId);
    }
  }, [selectedTaskId, setSelectedTask]);
  
  const handleTimerAction = () => {
    if (isRunning) {
      stopTimer();
    } else if (selectedTaskId) {
      // Находим задачу и запускаем таймер с правильными параметрами
      const task = tasks.find((task) => task.id === selectedTaskId);
      startTimer({
        source: 'timer',
        taskId: selectedTaskId,
        taskName: task?.title
      });
    }
  };
  
  const handleTimerModeChange = (isPomodoroMode) => {
    setMode(isPomodoroMode ? "pomodoro" : "stopwatch");
  };
  
  // Обработчик для кнопки Find
  const handleFindClick = () => {
    startFind();
  };
  
  const handleResetPomodoro = () => {
    resetPomodoro();
  };
  
  return (
    <>
    <Card className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-100 border-b border-gray-200">
        <Button
          className="w-fit"
          variant={isTaskFindActive ? "default" : "outline"}
          onClick={handleFindClick}
        >
          {isTaskFindActive ? "Finding..." : "Find"}
        </Button>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <p>{selectedTask?.title || "Select Task"}</p>
          </CardTitle>
          <div className="flex items-center space-x-2 bg-white rounded-full px-2 py-1 shadow-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <Switch
              checked={mode === "pomodoro"}
              onCheckedChange={handleTimerModeChange}
              className="data-[state=checked]:bg-green-500"
            />
            <Timer className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <TimerDisplay time={time} />
        <TimerControls
          isRunning={isRunning}
          onStartStop={handleTimerAction}
          onReset={handleResetPomodoro}
          disabled={!selectedTaskId}
          showReset={true}
          isPomodoroMode={mode === "pomodoro"}
        />
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t border-gray-200 p-2">
        <TimerFooter
          isPomodoroMode={mode === "pomodoro"}
        />
      </CardFooter>
    </Card>
      <TimerModeChangeAlert
        isOpen={showModeChangeAlert}
        onOpenChange={setShowModeChangeAlert}
        onConfirm={handleConfirmModeChange}
        currentMode={mode}
        newMode={pendingMode}
      />
      
      <ShortTimeAlert
        isVisible={showShortTimeAlert}
        onClose={() => setShowShortTimeAlert(false)}
      />
    </>
  );
}