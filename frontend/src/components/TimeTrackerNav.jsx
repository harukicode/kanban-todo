import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Progress, Input } from "@nextui-org/react";
import { Plus, Pause, Play } from 'lucide-react';

const TimeTrackerNav = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [task, setTask] = useState('');
  
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          setProgress((newTime % 3600) / 36); // Progress resets every hour
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  
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
    setIsRunning(!isRunning);
  };
  
  return (
    <div className="p-4 w-full flex justify-center items-start">
      <Card className="w-full max-w-8xl bg-white/80 backdrop-blur-md shadow-lg rounded-lg">
        <CardBody className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">My Time</h2>
            <div className="flex items-center space-x-2">
              <Button
                className={`rounded-full px-6 py-2 text-white transition-all duration-300 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                onPress={handleStartStop}
                startContent={isRunning ? <Pause size={24} /> : <Play size={24} />}
              >
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
            <Progress value={progress} className="h-2 rounded-full" color="success" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <Button
              className="flex-1 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-300 rounded-full"
              startContent={<Plus size={18} />}
            >
              Add Time Entry
            </Button>
            <Button
              className="flex-1 bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors duration-300 rounded-full"
              startContent={<Plus size={18} />}
            >
              Add Break
            </Button>
          </div>
          
          {/* Task Input */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
              <Input
                placeholder="What are you working on?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="flex-grow bg-transparent border-none focus:ring-0"
              />
              <div className="text-sm text-gray-500 min-w-[60px]">{formatTime(time)}</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TimeTrackerNav;
