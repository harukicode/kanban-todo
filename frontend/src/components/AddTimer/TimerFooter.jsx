import useFocusTaskStore from '@/Stores/FocusTaskStore.jsx'
import useTaskStore from '@/Stores/TaskStore.jsx'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { List, Settings, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTimer, formatTime } from "@/lib/TimerLib/timerLib.js";
import { format } from "date-fns";

const LogDialog = ({ isOpen, onOpenChange }) => {
  const { getFilteredLogs, deleteTimeLog } = useTimer();
  const [logToDelete, setLogToDelete] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("all");
  
  // Получаем логи и фильтруем их в зависимости от выбранного фильтра
  const logs = getFilteredLogs()
    .filter(log => sourceFilter === "all" || log.source === sourceFilter)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
  
  const handleDeleteClick = (log) => {
    setLogToDelete(log);
    setIsDeleteAlertOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (logToDelete) {
      deleteTimeLog(logToDelete.logId);
    }
    setIsDeleteAlertOpen(false);
    setLogToDelete(null);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Timer Log</DialogTitle>
            <div className="flex gap-2 mt-2">
              <Button
                variant={sourceFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSourceFilter("all")}
              >
                All Logs
              </Button>
              <Button
                variant={sourceFilter === "timer" ? "default" : "outline"}
                size="sm"
                onClick={() => setSourceFilter("timer")}
              >
                Timer Logs
              </Button>
              <Button
                variant={sourceFilter === "focus" ? "default" : "outline"}
                size="sm"
                onClick={() => setSourceFilter("focus")}
              >
                Focus Mode Logs
              </Button>
            </div>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {logs.map((log) => {
              // Получаем название задачи в зависимости от источника
              let taskName = log.taskName;
              if (log.source === 'focus') {
                const focusTaskStore = useFocusTaskStore.getState();
                const focusTask = focusTaskStore.getFocusTaskById(log.taskId);
                if (focusTask) {
                  taskName = focusTask.text;
                }
              } else {
                const taskStore = useTaskStore.getState();
                const task = taskStore.tasks.find(t => t.id === log.taskId);
                if (task) {
                  taskName = task.title;
                }
              }
              
              return (
                <div
                  key={log.logId}
                  className="mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{taskName}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(log.startTime), 'MMM dd, yyyy HH:mm')} -
                        {format(new Date(log.endTime), 'HH:mm')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">
                          {formatTime(log.timeSpent)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.mode === 'pomodoro' ? `Pomodoro - ${log.currentMode}` : 'Stopwatch'}
                        </div>
                        {log.source === 'focus' && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1">
                            Focus Mode
                          </span>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(log)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {logs.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No logs found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the time log
              {logToDelete && ` for task "${logToDelete.taskName}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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