"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"
import { useState, useEffect } from "react"
import { format, parseISO, startOfDay, endOfDay, addSeconds, differenceInSeconds, addDays } from "date-fns"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import useTaskStore from "@/stores/TaskStore"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export default function SideTimer() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isTracking, setIsTracking] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timelineData, setTimelineData] = useState([])
  
  const timeLogs = useTaskStore((state) => state.timeLogs)
  const updateTimeLog = useTaskStore((state) => state.updateTimeLog)
  const deleteTimeLog = useTaskStore((state) => state.deleteTimeLog)
  
  // Generate timeline data for the chart
  useEffect(() => {
    const data = []
    const dayStart = startOfDay(selectedDate)
    const nextDayStart = addDays(dayStart, 1)
    
    for (let hour = 0; hour < 24; hour++) {
      const hourStart = addSeconds(dayStart, hour * 3600)
      const hourEnd = addSeconds(hourStart, 3600)
      
      const hourLogs = timeLogs.filter((log) => {
        const logStart = new Date(log.startTime)
        const logEnd = new Date(log.endTime)
        return logStart < hourEnd && logEnd > hourStart
      })
      
      const value = hourLogs.reduce((total, log) => {
        const logStart = new Date(log.startTime)
        const logEnd = new Date(log.endTime)
        const overlapStart = logStart < hourStart ? hourStart : logStart
        const overlapEnd = logEnd > hourEnd ? hourEnd : logEnd
        const overlapSeconds = differenceInSeconds(overlapEnd, overlapStart)
        return total + overlapSeconds
      }, 0)
      
      data.push({
        time: format(hourStart, "HH:mm"),
        value: value / 60 // Convert seconds to minutes for better visualization
      })
    }
    setTimelineData(data)
  }, [timeLogs, selectedDate])
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])
  
  const formatTimeRange = (start, end) => {
    return `${format(new Date(start), "HH:mm")} - ${format(new Date(end), "HH:mm")}`
  }
  
  const calculateTotalTime = () => {
    return timeLogs.reduce((total, log) => total + (log.timeSpent || 0), 0)
  }
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours} h ${minutes.toString().padStart(2, '0')} min ${remainingSeconds.toString().padStart(2, '0')} sec`
    } else if (minutes > 0) {
      return `${minutes} min ${remainingSeconds.toString().padStart(2, '0')} sec`
    } else {
      return `${remainingSeconds} sec`
    }
  }
  
  const todayLogs = timeLogs.filter(log => {
    const logDate = new Date(log.startTime)
    return logDate >= startOfDay(selectedDate) && logDate < endOfDay(selectedDate)
  })
  
  const handleUpdateTimeLog = (logId, newTimeSpent) => {
    const log = timeLogs.find(log => log.logId === logId)
    if (log) {
      const newEndTime = addSeconds(new Date(log.startTime), newTimeSpent)
      updateTimeLog(logId, {
        timeSpent: newTimeSpent,
        endTime: newEndTime.toISOString()
      });
    }
  };
  
  const handleDeleteTimeLog = (logId) => {
    deleteTimeLog(logId);
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="label">{`Time: ${label}`}</p>
          <p className="intro">{`Minutes spent: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full max-w-8xl mx-auto p-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">My Time</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 px-4 font-normal">
            Today
          </Button>
          <div className="flex">
            <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="p-4 mb-6 border shadow-sm">
        <div className="flex justify-between mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-semibold">
              {formatDuration(calculateTotalTime())}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="text-2xl font-semibold">
              {format(selectedDate, "MMM dd, yyyy")}
            </div>
          </div>
        </div>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12, fill: "#666" }}
                interval={3}
              />
              <YAxis
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12, fill: "#666" }}
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#60a5fa"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <div className="flex items-center gap-2 mb-4">
        <input type="checkbox" className="rounded border-gray-300" />
        <Button variant="outline" className="h-8 px-3 text-sm font-normal">
          Add time entry
        </Button>
        <Button variant="outline" className="h-8 px-3 text-sm font-normal">
          Add break
        </Button>
      </div>
      
      <div className="space-y-1">
        {todayLogs.map((log) => (
          <div
            key={log.logId}
            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg group"
          >
            <input type="checkbox" className="rounded border-gray-300" />
            <div className="flex-1">
              <div className="font-medium text-sm">{log.taskName}</div>
              <div className="flex gap-2 mt-1"></div>
            </div>
            <div className="text-sm text-gray-500">
              {formatTimeRange(log.startTime, log.endTime)}
            </div>
            <div className="text-sm font-medium">
              {formatDuration(log.timeSpent)}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Edit Time</h4>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Hours"
                        min="0"
                        max="23"
                        defaultValue={Math.floor(log.timeSpent / 3600)}
                        onChange={(e) => {
                          const hours = parseInt(e.target.value) || 0
                          const minutes = Math.floor((log.timeSpent % 3600) / 60)
                          const seconds = log.timeSpent % 60
                          handleUpdateTimeLog(log.logId, hours * 3600 + minutes * 60 + seconds)
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Minutes"
                        min="0"
                        max="59"
                        defaultValue={Math.floor((log.timeSpent % 3600) / 60)}
                        onChange={(e) => {
                          const hours = Math.floor(log.timeSpent / 3600)
                          const minutes = parseInt(e.target.value) || 0
                          const seconds = log.timeSpent % 60
                          handleUpdateTimeLog(log.logId, hours * 3600 + minutes * 60 + seconds)
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Seconds"
                        min="0"
                        max="59"
                        defaultValue={log.timeSpent % 60}
                        onChange={(e) => {
                          const hours = Math.floor(log.timeSpent / 3600)
                          const minutes = Math.floor((log.timeSpent % 3600) / 60)
                          const seconds = parseInt(e.target.value) || 0
                          handleUpdateTimeLog(log.logId, hours * 3600 + minutes * 60 + seconds)
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteTimeLog(log.logId)}
                  >
                    Delete Log
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
    </div>
  )
}