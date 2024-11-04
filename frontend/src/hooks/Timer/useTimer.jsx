import { useState, useEffect, useCallback } from "react";

export const useTimer = (initialDuration, countUp = false) => {
  const [time, setTime] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);

  const handleStartStop = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTime(countUp ? 0 : initialDuration);
  }, [initialDuration, countUp]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (countUp) {
            return prevTime + 1;
          } else {
            if (prevTime <= 1) {
              clearInterval(interval);
              setIsRunning(false);
              return 0;
            }
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, countUp]);
  const clearAndResetTimer = useCallback(() => {
    setIsRunning(false); // Останавливаем таймер
    setTime(0); // Принудительно устанавливаем время на 0
    console.log("Таймер полностью сброшен до 0");
  }, []);

  const updateTime = useCallback((newTime) => {
    setTime(newTime);
  }, []);
  
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTime(0); // Установка времени на 0
    console.log("resetTimer устанавливает время на 0");
  }, []);


  return { time, isRunning, handleStartStop, handleReset, updateTime, resetTimer, clearAndResetTimer };
};
