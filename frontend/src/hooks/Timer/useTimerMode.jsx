import { useState } from "react";

export const useTimerMode = () => {
  const [timerMode, setTimerMode] = useState("stopwatch");

  const handleModeChange = (checked) => {
    setTimerMode(checked ? "pomodoro" : "stopwatch");
  };

  return { timerMode, handleModeChange };
};
