import React from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, RotateCcw } from "lucide-react";

const TimerControls = ({ isRunning, onStartStop, onReset, disabled, showReset, isPomodoroMode }) => (
  <div className="flex justify-center space-x-2 mb-4">
    <Button
      variant={isRunning ? "destructive" : "default"}
      onClick={onStartStop}
      disabled={disabled}
      className={`w-24 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isRunning ? (
        <PauseCircle className="mr-2 h-4 w-4" />
      ) : (
        <PlayCircle className="mr-2 h-4 w-4" />
      )}
      {isRunning ? "Stop" : "Start"}
    </Button>
    {showReset && isPomodoroMode && (
      <Button
        variant="outline"
        onClick={onReset}
        className="w-24"
        title="Reset Pomodoro"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    )}
  </div>
);

export default TimerControls;