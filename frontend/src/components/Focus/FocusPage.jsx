import ShortTimeAlert from '@/App/ShortTimeAlert.jsx'
import MindMap from '@/components/Focus/MindMap.jsx'
import TimerCard from '@/components/Focus/TimerCard.jsx'
import { useTimer, useTimerStore } from '@/lib/timerLib.js'
import useFocusTaskStore from '@/Stores/FocusTaskStore.jsx'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Clock, PlayCircle, PauseCircle } from 'lucide-react';
import { format } from "date-fns";

const FocusPage = () => {
	const navigate = useNavigate();
	const {
		focusTasks,
		addFocusTask,
		deleteFocusTask,
		updateFocusTask,
	} = useFocusTaskStore();
	
	const {
		startTimer,
		stopTimer,
		setSelectedTask,
		getFilteredLogs
	} = useTimer();
	
	const [timerMode, setTimerMode] = useState(() => {
		return localStorage.getItem('timerMode') || 'normal';
	});
	const showShortTimeAlert = useTimerStore((state) => state.showShortTimeAlert);
	const setShowShortTimeAlert = useTimerStore((state) => state.setShowShortTimeAlert);
	const [newTask, setNewTask] = useState('');
	const [editingTask, setEditingTask] = useState(null);
	const [time, setTime] = useState(() => {
		return timerMode === 'normal' ? 0 : 25 * 60;
	});
	const [isRunning, setIsRunning] = useState(false);
	const [activeTask, setActiveTask] = useState(null);
	const [pomodoroSettings, setPomodoroSettings] = useState({
		workDuration: 25,
		breakDuration: 5,
		longBreakDuration: 15,
		longBreakInterval: 4
	});
	const [pomodoroState, setPomodoroState] = useState({
		currentSession: 'work',
		sessionsCompleted: 0
	});
	
	useEffect(() => {
		if (activeTask) {
			setSelectedTask(activeTask.id);
		}
	}, [activeTask, setSelectedTask]);
	
	useEffect(() => {
		let interval;
		if (isRunning) {
			interval = setInterval(() => {
				if (timerMode === 'normal') {
					setTime(prevTime => prevTime + 1);
				} else {
					setTime(prevTime => {
						if (prevTime > 0) {
							return prevTime - 1;
						} else {
							handlePomodoroStateChange();
							return 0;
						}
					});
				}
				if (activeTask) {
					updateFocusTask(activeTask.id, {
						...activeTask,
						timeSpent: (activeTask.timeSpent || 0) + 1,
						sessions: activeTask.sessions.map((session, index) =>
							index === activeTask.sessions.length - 1
								? (typeof session === 'number' ? session + 1 : { ...session, duration: session.duration + 1 })
								: session
						)
					});
				}
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRunning, timerMode, activeTask, updateFocusTask]);
	
	const handlePomodoroStateChange = () => {
		setPomodoroState(prevState => {
			const newState = { ...prevState };
			if (prevState.currentSession === 'work') {
				newState.sessionsCompleted += 1;
				if (newState.sessionsCompleted % pomodoroSettings.longBreakInterval === 0) {
					newState.currentSession = 'longBreak';
					setTime(pomodoroSettings.longBreakDuration * 60);
				} else {
					newState.currentSession = 'break';
					setTime(pomodoroSettings.breakDuration * 60);
				}
			} else {
				newState.currentSession = 'work';
				setTime(pomodoroSettings.workDuration * 60);
			}
			return newState;
		});
	};
	
	const addTask = () => {
		if (newTask.trim()) {
			addFocusTask({
				text: newTask,
				timeSpent: 0,
				sessions: []
			});
			setNewTask('');
		}
	};
	
	const deleteTask = (id) => {
		deleteFocusTask(id);
		if (activeTask && activeTask.id === id) {
			setActiveTask(null);
		}
	};
	
	const startEditing = (task) => {
		setEditingTask({ ...task });
	};
	
	const saveEdit = () => {
		if (editingTask) {
			updateFocusTask(editingTask.id, editingTask);
			setEditingTask(null);
		}
	};
	
	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};
	
	useEffect(() => {
		if (activeTask) {
			setSelectedTask(activeTask.id);  // Используем функцию из хука useTimer
		}
	}, [activeTask, setSelectedTask]);
	
	const toggleTimer = () => {
		if (!isRunning && activeTask) {
			console.log('Starting timer for active task:', activeTask);
			
			// Сначала устанавливаем активную задачу
			setSelectedTask(activeTask.id);
			
			// Запускаем таймер с правильными опциями
			startTimer({
				source: 'focus',
				taskId: activeTask.id,
				taskName: activeTask.text
			});
			
			console.log('Timer started with options:', {
				source: 'focus',
				taskId: activeTask.id,
				taskName: activeTask.text
			});
			
			setIsRunning(true);
		} else {
			console.log('Stopping timer');
			stopTimer();
			setIsRunning(false);
		}
	};
	
	const resetTimer = () => {
		setTime(timerMode === 'normal' ? 0 : pomodoroSettings.workDuration * 60);
		setIsRunning(false);
		setPomodoroState({ currentSession: 'work', sessionsCompleted: 0 });
	};
	
	const switchTimerMode = () => {
		setTimerMode(prevMode => {
			const newMode = prevMode === 'normal' ? 'pomodoro' : 'normal';
			setTime(newMode === 'normal' ? 0 : pomodoroSettings.workDuration * 60);
			setIsRunning(false);
			setPomodoroState({ currentSession: 'work', sessionsCompleted: 0 });
			return newMode;
		});
	};
	
	return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/kanban")}
        >
          <ArrowLeft size={20} />
          Back to Kanban
        </Button>
        <h1 className="text-2xl font-semibold">Focus Mode</h1>
      </div>

      <div className="flex gap-4 h-[calc(40vh-2rem)]">
        {/* Tasks Card */}
        <Card className="w-1/2 shadow-md">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="Add a new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-grow mr-2"
              />
              <Button onClick={addTask}>
                <Plus size={20} />
              </Button>
            </div>
            <ScrollArea className="h-[calc(40vh-12rem)]">
              {focusTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between mb-2 p-2 bg-gray-100 rounded"
                >
                  {editingTask && editingTask.id === task.id ? (
                    <Input
                      value={editingTask.text}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, text: e.target.value })
                      }
                      onBlur={saveEdit}
                      autoFocus
                    />
                  ) : (
                    <div className="flex flex-col">
                      <span>{task.text}</span>
                      <span className="text-sm text-gray-500">
                        Time spent: {formatTime(task.timeSpent || 0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(task)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveTask(task)}
                    >
                      <Clock size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Timer Card */}
	      <TimerCard
		      timerMode={timerMode}
		      switchTimerMode={switchTimerMode}
		      time={time}
		      isRunning={isRunning}
		      toggleTimer={toggleTimer}
		      resetTimer={resetTimer}
		      activeTask={activeTask}
		      formatTime={formatTime}
		      logs={getFilteredLogs().filter(log => log.source === "focus")}
		      focusTasks={focusTasks}
		      pomodoroSettings={pomodoroSettings}
		      setPomodoroSettings={setPomodoroSettings}
	      />
      </div>

      {/* Mind Map */}
      <Card className="mt-4 shadow-md h-[calc(50vh-2rem)]">
        <MindMap
          onAddToTaskList={(taskText) => {
            addFocusTask({
              text: taskText,
              timeSpent: 0,
              sessions: [],
            });
          }}
        />
      </Card>

      {/* Alert */}
      <ShortTimeAlert
        isVisible={showShortTimeAlert}
        onClose={() => setShowShortTimeAlert(false)}
      />
    </div>
  );
}

export default FocusPage;