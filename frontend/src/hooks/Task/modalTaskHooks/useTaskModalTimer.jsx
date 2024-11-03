import { useState, useEffect, useRef } from "react";

export function useTaskModalTimer(isOpen) {
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const dialogRef = useRef(null);
  const [timerPosition, setTimerPosition] = useState({ top: 0, left: 0 });
  const [timerVisible, setTimerVisible] = useState(false);

  useEffect(() => {
    if (isTimerOpen && dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setTimerPosition({
        top: rect.top,
        left: rect.right + 20, // 20px gap between modal and timer
      });
      setTimeout(() => setTimerVisible(true), 50);
    } else {
      setTimerVisible(false);
    }
  }, [isTimerOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsTimerOpen(false);
    }
  }, [isOpen]);

  return {
    isTimerOpen,
    setIsTimerOpen,
    timerPosition,
    timerVisible,
    dialogRef,
  };
}
