import React from "react";
import { formatTime } from "@/lib/TimerLib/timerLib.js";

const TimerDisplay = ({ time }) => (
  <div className="text-center mb-4">
    <span className="text-4xl font-light text-gray-700">
      {formatTime(time)}
    </span>
  </div>
);

export default TimerDisplay;