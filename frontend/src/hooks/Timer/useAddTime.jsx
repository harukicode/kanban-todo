import { useState, useEffect } from "react";
import { format } from "date-fns";

export const useAddTime = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      let diff = (end - start) / 1000; // difference in seconds
      if (diff < 0) diff += 24 * 60 * 60; // handle crossing midnight
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      setDuration({ hours, minutes });
    }
  }, [startTime, endTime]);

  const handleAddTime = () => {
    // Logic to add time
    console.log("Time added:", {
      date: format(date, "yyyy-MM-dd"),
      startTime,
      endTime,
      duration,
    });
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    duration,
    handleAddTime,
  };
};
