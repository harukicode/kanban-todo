import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, ChevronLeft, ChevronRight, MoreVertical, Clock, Calendar as CalendarIcon } from "lucide-react"
import { format, parseISO, startOfDay, endOfDay, addSeconds, differenceInSeconds, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import useTaskStore from "@/stores/TaskStore"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import FullTimer from './FullTimer'

export default function SideTimer() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isTracking, setIsTracking] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timelineData, setTimelineData] = useState([])
  const [showFullTimer, setShowFullTimer] = useState(false)
  const [periodType, setPeriodType] = useState("day")
  const [customDateRange, setCustomDateRange] = useState({ from: null, to: null })
  
  const timeLogs = useTaskStore((state) => state.timeLogs)
  const updateTimeLog = useTaskStore((state) => state.updateTimeLog)
  const deleteTimeLog = useTaskStore((state) => state.deleteTimeLog)
  
  const getPeriodDates = () => {
    switch (periodType) {
      case "day":
        return { start: startOfDay(selectedDate), end: endOfDay(selectedDate) }
      case "week":
        return { start: startOfWeek(selectedDate), end: endOfWeek(selectedDate) }
      case "month":
        return { start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) }
      case "custom":
        return { start: customDateRange.from, end: customDateRange.to }
      default:
        return { start: startOfDay(selectedDate), end: endOfDay(selectedDate) }
    }
  }
  
  const generateTimelineData = () => {
    const { start, end } = getPeriodDates()
    const data = []
    
    if (periodType === "day") {
      // For day view, create hourly data points
      for (let hour = 0; hour < 24; hour++) {
        const hourStart = new Date(selectedDate)
        hourStart.setHours(hour, 0, 0, 0)
        const hourEnd = new Date(selectedDate)
        hourEnd.setHours(hour, 59, 59, 999)
        
        const hourLogs = timeLogs.filter((log) => {
          const logStart = new Date(log.startTime)
          return logStart >= hourStart && logStart <= hourEnd
        })
        
        const value = hourLogs.reduce((total, log) => total + (log.timeSpent || 0), 0)
        
        data.push({
          date: format(hourStart, "HH:mm"),
          value: value / 60 // Convert seconds to minutes
        })
      }
    } else {
      // For week/month/custom, keep daily data points
      let currentDate = new Date(start)
      while (currentDate <= end) {
        const dayLogs = timeLogs.filter((log) => {
          const logStart = new Date(log.startTime)
          return isSameDay(logStart, currentDate)
        })
        
        const value = dayLogs.reduce((total, log) => total + (log.timeSpent || 0), 0)
        
        data.push({
          date: format(currentDate, "MMM dd"),
          value: value / 60
        })
        
        currentDate = addDays(currentDate, 1)
      }
    }
    
    return data
  }
  
  useEffect(() => {
    setTimelineData(generateTimelineData())
  }, [timeLogs, selectedDate, periodType, customDateRange])
  
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
    const { start, end } = getPeriodDates()
    return timeLogs
      .filter(log => new Date(log.startTime) >= start && new Date(log.endTime) <= end)
      .reduce((total, log) => total + (log.timeSpent || 0), 0)
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
  
  const filteredLogs = timeLogs.filter(log => {
    const { start, end } = getPeriodDates()
    const logDate = new Date(log.startTime)
    return logDate >= start && logDate <= end
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
  
  const handlePeriodChange = (newPeriod) => {
    setPeriodType(newPeriod)
    if (newPeriod === "custom") {
      setCustomDateRange({ from: selectedDate, to: selectedDate })
    }
  }
  
  const handleDateChange = (direction) => {
    setSelectedDate(prevDate => {
      switch (periodType) {
        case "day":
          return direction === "next" ? addDays(prevDate, 1) : addDays(prevDate, -1)
        case "week":
          return direction === "next" ? addDays(prevDate, 7) : addDays(prevDate, -7)
        case "month":
          return direction === "next" ? addDays(prevDate, 30) : addDays(prevDate, -30)
        default:
          return prevDate
      }
    })
  }
  
  return (
    <div className="w-full max-w-8xl mx-auto p-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">My Time</h2>
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => setShowFullTimer(!showFullTimer)}
          >
            <Clock className="mr-2 h-4 w-4" />
            {showFullTimer ? "Show Chart" : "Show Timer"}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={periodType} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {periodType === "custom" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateRange.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, "LLL dd, y")} -{" "}
                        {format(customDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(customDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={customDateRange.from}
                  selected={customDateRange}
                  onSelect={setCustomDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Button variant="outline" className="h-9 px-4 font-normal" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
              <div className="flex">
                <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => handleDateChange("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => handleDateChange("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      
        {showFullTimer ? (
          <FullTimer onClose={() => setShowFullTimer(false)} />
        ) : (
          <>
          <Card className="p-4 mb-6 border shadow-sm">
            <div className="flex justify-between mb-6">
              <div>
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-semibold">
                  {formatDuration(calculateTotalTime())}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Period</div>
                <div className="text-2xl font-semibold">
                  {periodType === "custom"
                    ? `${format(customDateRange.from, "MMM dd, yyyy")} - ${format(customDateRange.to, "MMM dd, yyyy")}`
                    : format(selectedDate, "MMM dd, yyyy")}
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
                    dataKey="date"
                    axisLine={true}
                    tickLine={true}
                    tick={{ fontSize: 12, fill: "#666" }}
                    interval={periodType === "day" ? 3 : "preserveStartEnd"}
                    tickFormatter={(value) => value}
                  />
                  <YAxis
                    axisLine={true}
                    tickLine={true}
                    tick={{ fontSize: 12, fill: "#666" }}
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="text-sm font-medium">
                              {periodType === "day" ? "Time" : "Date"}: {label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Minutes spent: {payload[0].value.toFixed(2)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
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
          </>
        )}
      
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" className="h-8 px-3 text-sm font-normal">
          Add time entry
        </Button>
        <Button variant="outline" className="h-8 px-3 text-sm font-normal">
          Add break
        </Button>
      </div>
      
      <div className="space-y-1">
        {filteredLogs.map((log) => (
          <div
            key={log.logId}
            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg group"
          >
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