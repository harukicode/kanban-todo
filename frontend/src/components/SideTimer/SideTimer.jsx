import { PDFExport } from '@/components/SideTimer/PdfExport.jsx'
import useColumnsStore from '@/Stores/ColumnsStore';
import useFocusTaskStore from '@/Stores/FocusTaskStore.jsx'
import useProjectStore from '@/Stores/ProjectsStore';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight, MoreVertical, Clock, CalendarIcon, Filter, Target, Download, SortAsc, SortDesc } from 'lucide-react';
import { format, parseISO, startOfDay, endOfDay, addSeconds, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart } from 'recharts';
import useTaskStore from "@/stores/TaskStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import FullTimer from './FullTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTimer, useTimerStore } from '@/lib/TimerLib/timerLib.jsx';

export default function SideTimer() {
  // Состояния из timerLib
  const {
    timeLogs,
    getFilteredLogs,
    updateTimeLog,
    deleteTimeLog,
  } = useTimer();
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours} h ${minutes.toString().padStart(2, '0')} min ${remainingSeconds.toString().padStart(2, '0')} sec`;
    } else if (minutes > 0) {
      return `${minutes} min ${remainingSeconds.toString().padStart(2, '0')} sec`;
    } else {
      return `${remainingSeconds} sec`;
    }
  };
  
  
  // Локальные состояния
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timelineData, setTimelineData] = useState([]);
  const [showFullTimer, setShowFullTimer] = useState(false);
  const [periodType, setPeriodType] = useState("day");
  const [customDateRange, setCustomDateRange] = useState({ from: null, to: null });
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterTask, setFilterTask] = useState("");
  const [groupBy, setGroupBy] = useState("none");
  const [selectedProject, setSelectedProject] = useState("all");
  
  // Store состояния
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const columns = useColumnsStore((state) => state.columns);
  
  const getPeriodDates = () => {
    switch (periodType) {
      case "day":
        return { start: startOfDay(selectedDate), end: endOfDay(selectedDate) };
      case "week":
        return { start: startOfWeek(selectedDate), end: endOfWeek(selectedDate) };
      case "month":
        return { start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) };
      case "custom":
        return { start: customDateRange.from, end: customDateRange.to };
      default:
        return { start: startOfDay(selectedDate), end: endOfDay(selectedDate) };
    }
  };
  
  const generateTimelineData = () => {
    const { start, end } = getPeriodDates();
    const filteredLogs = getFilteredLogs({
      startDate: start,
      endDate: end
    });
    
    if (periodType === "day") {
      return Array.from({ length: 24 }, (_, hour) => {
        const hourStart = new Date(selectedDate);
        hourStart.setHours(hour, 0, 0, 0);
        const hourEnd = new Date(selectedDate);
        hourEnd.setHours(hour, 59, 59, 999);
        
        const hourLogs = filteredLogs.filter(log => {
          const logStart = new Date(log.startTime);
          return logStart >= hourStart && logStart <= hourEnd;
        });
        
        return {
          date: format(hourStart, "HH:mm"),
          value: hourLogs.reduce((total, log) => total + (log.timeSpent || 0), 0) / 60
        };
      });
    } else {
      let currentDate = new Date(start);
      const data = [];
      while (currentDate <= end) {
        const dayLogs = filteredLogs.filter(log =>
          isSameDay(new Date(log.startTime), currentDate)
        );
        
        data.push({
          date: format(currentDate, "MMM dd"),
          value: dayLogs.reduce((total, log) => total + (log.timeSpent || 0), 0) / 60
        });
        
        currentDate = addDays(currentDate, 1);
      }
      return data;
    }
  };
  
  useEffect(() => {
    setTimelineData(generateTimelineData());
  }, [timeLogs, selectedDate, periodType, customDateRange]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTimeRange = (start, end) => {
    return `${format(new Date(start), "HH:mm")} - ${format(new Date(end), "HH:mm")}`;
  };
  
  const calculateTotalTime = () => {
    const { start, end } = getPeriodDates();
    return getFilteredLogs({ startDate: start, endDate: end })
      .reduce((total, log) => total + (log.timeSpent || 0), 0);
  };
  
  const getProjectForTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    const column = columns.find(c => c.id === task.columnId);
    if (!column) return null;
    
    return projects.find(p => p.id === column.projectId) || null;
  };
  
  const filteredAndSortedLogs = React.useMemo(() => {
    return getFilteredLogs()
      .filter(log => {
        const { start, end } = getPeriodDates();
        const logDate = new Date(log.startTime);
        const project = getProjectForTask(log.taskId);
        
        let taskName;
        if (log.source === 'focus') {
          // Получаем название задачи из FocusTaskStore
          const focusTaskStore = useFocusTaskStore.getState();
          const focusTask = focusTaskStore.getFocusTaskById(log.taskId);
          taskName = focusTask ? focusTask.text : log.taskName;
        } else {
          // Получаем название задачи из TaskStore
          taskName = log.taskName || tasks.find(t => t.id === log.taskId)?.title || "Unknown Task";
        }
        
        return logDate >= start && logDate <= end &&
          taskName.toLowerCase().includes(filterTask.toLowerCase()) &&
          (selectedProject === "all" || (project && project.id === selectedProject));
      })
      .sort((a, b) => {
        if (sortBy === "startTime") {
          return sortOrder === "asc"
            ? new Date(a.startTime) - new Date(b.startTime)
            : new Date(b.startTime) - new Date(a.startTime);
        } else if (sortBy === "duration") {
          return sortOrder === "asc"
            ? a.timeSpent - b.timeSpent
            : b.timeSpent - a.timeSpent;
        } else if (sortBy === "taskName") {
          let nameA, nameB;
          
          if (a.source === 'focus') {
            const focusTaskStore = useFocusTaskStore.getState();
            const focusTaskA = focusTaskStore.getFocusTaskById(a.taskId);
            nameA = focusTaskA ? focusTaskA.text : a.taskName;
          } else {
            nameA = a.taskName || tasks.find(t => t.id === a.taskId)?.title || "";
          }
          
          if (b.source === 'focus') {
            const focusTaskStore = useFocusTaskStore.getState();
            const focusTaskB = focusTaskStore.getFocusTaskById(b.taskId);
            nameB = focusTaskB ? focusTaskB.text : b.taskName;
          } else {
            nameB = b.taskName || tasks.find(t => t.id === b.taskId)?.title || "";
          }
          
          return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else if (sortBy === "project") {
          const projectA = getProjectForTask(a.taskId);
          const projectB = getProjectForTask(b.taskId);
          const nameA = projectA ? projectA.name : "";
          const nameB = projectB ? projectB.name : "";
          return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
      });
  }, [timeLogs, selectedDate, periodType, customDateRange, sortBy, sortOrder, filterTask, selectedProject]);
  
  const handleUpdateTimeLog = (logId, updatedData) => {
    const log = timeLogs.find(l => l.logId === logId);
    if (!log) return;
    
    try {
      const startTime = new Date(log.startTime);
      if (isNaN(startTime.getTime())) {
        throw new Error('Invalid start time');
      }
      
      const newTimeSpent = updatedData.timeSpent;
      const endTime = new Date(startTime.getTime() + (newTimeSpent * 1000));
      
      const updateData = {
        ...updatedData,
        endTime: endTime.toISOString()
      };
      
      // Обновляем в timerLib
      updateTimeLog(logId, updateData);
      
      // Обновляем в TaskStore
      const taskStore = useTaskStore.getState();
      taskStore.updateTimeLog(logId, updateData);
    } catch (error) {
      console.error('Error updating time log:', error);
    }
  };
  
  const handleDeleteTimeLog = (logId) => {
    try {
      // Используем deleteTimeLog из хука useTimer
      deleteTimeLog(logId);
      
      // И обновляем TaskStore
      const taskStore = useTaskStore.getState();
      taskStore.deleteTimeLog(logId);
    } catch (error) {
      console.error('Error deleting time log:', error);
    }
  };
  
  
  const handlePeriodChange = (newPeriod) => {
    setPeriodType(newPeriod);
    if (newPeriod === "custom") {
      setCustomDateRange({ from: selectedDate, to: selectedDate });
    }
  };
  
  const handleDateChange = (direction) => {
    setSelectedDate(prevDate => {
      switch (periodType) {
        case "day":
          return direction === "next" ? addDays(prevDate, 1) : addDays(prevDate, -1);
        case "week":
          return direction === "next" ? addDays(prevDate, 7) : addDays(prevDate, -7);
        case "month":
          return direction === "next" ? addDays(prevDate, 30) : addDays(prevDate, -30);
        default:
          return prevDate;
      }
    });
  };
  
  const groupedLogs = React.useMemo(() => {
    if (groupBy === "none") return { "All Tasks": filteredAndSortedLogs };
    return filteredAndSortedLogs.reduce((acc, log) => {
      const key = groupBy === "project"
        ? (getProjectForTask(log.taskId)?.name || "No Project")
        : format(new Date(log.startTime), "yyyy-MM-dd");
      if (!acc[key]) acc[key] = [];
      acc[key].push(log);
      return acc;
    }, {});
  }, [filteredAndSortedLogs, groupBy, getProjectForTask]);
  
  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Task Name,Start Time,End Time,Duration\n"
      + filteredAndSortedLogs.map(log =>
        `${log.taskName},${log.startTime},${log.endTime},${formatDuration(log.timeSpent)}`
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "time_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
 
  return (
    <div className="w-full max-w-8xl mx-auto p-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
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
                <Button
                  variant="outline"
                  className="w-[280px] justify-start text-left font-normal"
                >
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
              <div className="flex">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  onClick={() => handleDateChange("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  onClick={() => handleDateChange("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Card className="p-4 mb-6 border shadow-sm">
        {showFullTimer ? (
          <FullTimer onClose={() => setShowFullTimer(false)} />
        ) : (
          <>
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
                    label={{
                      value: "Minutes",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    domain={[0, "auto"]}
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
                        );
                      }
                      return null;
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
          </>
        )}
      </Card>

      <div className="flex gap-4">
        {/* Left side: Time log list */}
        <Card
          className="flex-1 p-4 mb-6 border shadow-sm overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 400px)" }}
        >
          <div className="space-y-1">
            {Object.entries(groupedLogs).map(([group, logs]) => (
              <div key={group}>
                {groupBy !== "none" && (
                  <h3 className="font-semibold text-lg mt-4 mb-2">{group}</h3>
                )}
                {logs.map((log) => {
                  const project = getProjectForTask(log.taskId);
                  
                  // Определяем название задачи в зависимости от источника
                  let taskName;
                  if (log.source === 'focus') {
                    const focusTaskStore = useFocusTaskStore.getState();
                    const focusTask = focusTaskStore.getFocusTaskById(log.taskId);
                    taskName = focusTask ? focusTask.text : log.taskName;
                  } else {
                    taskName = log.taskName || tasks.find(t => t.id === log.taskId)?.title || "Unknown Task";
                  }
                  
                  return (
                    <div
                      key={log.logId}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg group"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{taskName}</div>
                        <div className="text-xs text-gray-500">
                          {project ? project.name : "No Project"}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimeRange(log.startTime, log.endTime)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-sm font-medium">
                          {formatDuration(log.timeSpent)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {log.mode === "pomodoro"
                              ? `Pomodoro - ${log.currentMode}`
                              : "Stopwatch"}
                          </span>
                          {log.source === "focus" && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              Focus Mode
                            </span>
                          )}
                        </div>
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
                              <h4 className="font-medium leading-none">
                                Edit Time
                              </h4>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="Hours"
                                  min="0"
                                  max="23"
                                  defaultValue={Math.floor(
                                    log.timeSpent / 3600,
                                  )}
                                  onChange={(e) => {
                                    const hours = parseInt(e.target.value) || 0;
                                    const minutes = Math.floor(
                                      (log.timeSpent % 3600) / 60,
                                    );
                                    const seconds = log.timeSpent % 60;
                                    const newTimeSpent =
                                      hours * 3600 + minutes * 60 + seconds;

                                    handleUpdateTimeLog(log.logId, {
                                      timeSpent: newTimeSpent,
                                    });
                                  }}
                                />
                                <Input
                                  type="number"
                                  placeholder="Minutes"
                                  min="0"
                                  max="59"
                                  defaultValue={Math.floor(
                                    (log.timeSpent % 3600) / 60,
                                  )}
                                  onChange={(e) => {
                                    const hours = Math.floor(
                                      log.timeSpent / 3600,
                                    );
                                    const minutes =
                                      parseInt(e.target.value) || 0;
                                    const seconds = log.timeSpent % 60;
                                    updateTimeLog(log.logId, {
                                      timeSpent:
                                        hours * 3600 + minutes * 60 + seconds,
                                      endTime: new Date(
                                        new Date(log.startTime).getTime() +
                                          (hours * 3600 +
                                            minutes * 60 +
                                            seconds) *
                                            1000,
                                      ).toISOString(),
                                    });
                                  }}
                                />
                                <Input
                                  type="number"
                                  placeholder="Seconds"
                                  min="0"
                                  max="59"
                                  defaultValue={log.timeSpent % 60}
                                  onChange={(e) => {
                                    const hours = Math.floor(
                                      log.timeSpent / 3600,
                                    );
                                    const minutes = Math.floor(
                                      (log.timeSpent % 3600) / 60,
                                    );
                                    const seconds =
                                      parseInt(e.target.value) || 0;
                                    handleUpdateTimeLog(log.logId, {
                                      timeSpent:
                                        hours * 3600 + minutes * 60 + seconds,
                                      endTime: new Date(
                                        new Date(log.startTime).getTime() +
                                          (hours * 3600 +
                                            minutes * 60 +
                                            seconds) *
                                            1000,
                                      ).toISOString(),
                                    });
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
                  );
                })}
              </div>
            ))}
          </div>
        </Card>

        {/* Right side: Functions menu */}
        <Card className="w-1/3 p-4 mb-6 border shadow-sm">
          <Tabs defaultValue="sort" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sort">Sort & Filter</TabsTrigger>
              <TabsTrigger value="analyze">Analyze & Export</TabsTrigger>
            </TabsList>
            <TabsContent value="sort">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select sort criteria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startTime">Start Time</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="taskName">Task Name</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Order:</label>
                  <div className="flex mt-1 space-x-2">
                    <Button
                      variant={sortOrder === "asc" ? "default" : "outline"}
                      onClick={() => setSortOrder("asc")}
                    >
                      <SortAsc className="w-4 h-4 mr-2" />
                      Ascending
                    </Button>
                    <Button
                      variant={sortOrder === "desc" ? "default" : "outline"}
                      onClick={() => setSortOrder("desc")}
                    >
                      <SortDesc className="w-4 h-4 mr-2" />
                      Descending
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Filter by task name:
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter task name"
                    value={filterTask}
                    onChange={(e) => setFilterTask(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Group by:</label>
                  <Select value={groupBy} onValueChange={setGroupBy}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Grouping</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Filter by project:
                  </label>
                  <Select
                    value={selectedProject}
                    onValueChange={setSelectedProject}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analyze">
              <div className="space-y-4">
                <PDFExport
                  logs={timeLogs}
                  projects={projects}
                  formatDuration={formatDuration}
                  getProjectForTask={getProjectForTask}
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
    </div>
  );
}