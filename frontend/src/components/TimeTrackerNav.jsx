import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pause, Play, Calendar, ChevronDown } from 'lucide-react';

const TimeTrackerNav = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  
  useEffect(() => {
    let interval;
    if (isRunning && currentTask) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          setProgress((newTime % 3600) / 36); // Progress resets every hour
          return newTime;
        });
        
        // Update task time
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === currentTask.id
              ? { ...task, timeSpent: (task.timeSpent || 0) + 1 }
              : task
          )
        );
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTask]);
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const generateTimelineMarkers = () => {
    const markers = [];
    for (let i = 0; i < 13; i++) {
      markers.push(
        <div key={i} className="flex flex-col items-center">
          <div className="h-2 w-px bg-gray-300 mb-1"></div>
          <span className="text-xs text-gray-400">{i * 30}</span>
        </div>
      );
    }
    return markers;
  };
  
  const handleStartStop = () => {
    if (!currentTask && !isRunning) {
      // If no task is selected, don't start the timer
      return;
    }
    setIsRunning(!isRunning);
  };
  
  const handleTaskSelect = (task) => {
    setCurrentTask(task);
    setTime(task.timeSpent || 0);
    setProgress((task.timeSpent % 3600) / 36);
  };
  
  const handleAddTask = () => {
    if (newTaskName.trim()) {
      const newTask = { id: Date.now(), name: newTaskName, timeSpent: 0, date: new Date() };
      setTasks([...tasks, newTask]);
      setNewTaskName('');
      setIsAddTaskModalOpen(false);
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= dateRange.start && taskDate <= dateRange.end;
  });
  
  return (
    <div className="p-4 w-full flex justify-center items-start">
      <Card className="w-full max-w-8xl bg-white/80 backdrop-blur-md shadow-lg rounded-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">My Timer</h2>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px]">
                    {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-4">
                  <div className="flex flex-col space-y-4">
                    <Input
                      type="date"
                      value={dateRange.start.toISOString().split('T')[0]}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
                    />
                    <Input
                      type="date"
                      value={dateRange.end.toISOString().split('T')[0]}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
                    />
                    <Button onClick={() => setDateRange({ start: new Date(), end: new Date() })}>
                      Reset to Today
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                className={`rounded-full px-6 py-2 text-white transition-all duration-300 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                onClick={handleStartStop}
              >
                {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isRunning ? 'Stop' : 'Start'}
              </Button>
            </div>
          </div>
          
          {/* Timer */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-6xl font-light text-gray-800">{formatTime(time)}</div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {generateTimelineMarkers()}
            </div>
            <Progress value={progress} className="h-2 rounded-full" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <Button
              className="flex-1 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-300 rounded-full"
              onClick={() => setIsAddTaskModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
            <Button
              className="flex-1 bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-300 rounded-full"
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>
          
          {/* Current Task */}
          {currentTask && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <Input
                  aria-label="Current task"
                  placeholder="What are you working on?"
                  value={currentTask.name}
                  readOnly
                  className="flex-grow bg-transparent border-none focus:ring-0"
                />
                <div className="text-sm text-gray-500 min-w-[60px]">{formatTime(currentTask.timeSpent || 0)}</div>
              </div>
            </div>
          )}
          
          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <Button
                key={task.id}
                className="w-full justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                onClick={() => handleTaskSelect(task)}
              >
                <span>{task.name}</span>
                <span>{formatTime(task.timeSpent || 0)}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Add Task Modal */}
      <Dialog open={isAddTaskModalOpen} onOpenChange={setIsAddTaskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimeTrackerNav;