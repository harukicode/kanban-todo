// TimerControls.jsx
import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { PlayCircle, PauseCircle } from "lucide-react"; // Удаляем RotateCcw

const TimerControls = ({ isRunning, onStartStop, disabled }) => (
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
  </div>
);

export default TimerControls;
