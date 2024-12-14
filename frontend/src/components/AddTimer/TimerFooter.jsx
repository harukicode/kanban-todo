// TimerFooter.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { List, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTimer } from "@/lib/timerLib";
import { format } from "date-fns";

// Вынесем функцию форматирования времени
const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const LogDialog = ({ isOpen, onOpenChange }) => {
  const { getFilteredLogs } = useTimer();
  const logs = getFilteredLogs();
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Timer Log</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.logId}
              className="mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{log.taskName}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(log.startTime), 'MMM dd, yyyy HH:mm')} -
                    {format(new Date(log.endTime), 'HH:mm')}
                  </div>
                </div>
                <div>
                  <div className="font-medium">
                    {formatTime(log.timeSpent)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {log.mode === 'pomodoro' ? `Pomodoro - ${log.currentMode}` : 'Stopwatch'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SettingsDialog = ({ isOpen, onOpenChange, settings, onSettingsSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  
  const handleSave = () => {
    onSettingsSave(localSettings);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="workTime">Work Time (min)</Label>
            <Input
              id="workTime"
              type="number"
              value={localSettings.workTime}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                workTime: parseInt(e.target.value)
              }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortBreak">Short Break (min)</Label>
            <Input
              id="shortBreak"
              type="number"
              value={localSettings.shortBreakTime}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                shortBreakTime: parseInt(e.target.value)
              }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longBreak">Long Break (min)</Label>
            <Input
              id="longBreak"
              type="number"
              value={localSettings.longBreakTime}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                longBreakTime: parseInt(e.target.value)
              }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longBreakInterval">Sessions until Long Break</Label>
            <Input
              id="longBreakInterval"
              type="number"
              value={localSettings.longBreakInterval}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                longBreakInterval: parseInt(e.target.value)
              }))}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TimerFooter = ({ isPomodoroMode }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const { pomodoroSettings, updatePomodoroSettings } = useTimer();
  
  return (
    <div className="flex justify-between w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsLogsOpen(true)}
      >
        <List className="mr-2 h-4 w-4" />
        Log
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSettingsOpen(true)}
        disabled={!isPomodoroMode}
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
      
      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={pomodoroSettings}
        onSettingsSave={updatePomodoroSettings}
      />
      
      <LogDialog
        isOpen={isLogsOpen}
        onOpenChange={setIsLogsOpen}
      />
    </div>
  );
};

export default TimerFooter;