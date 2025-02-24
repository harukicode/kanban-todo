import React, { useState} from 'react';
import { useTimer, useTimerStore } from '@/lib/TimerLib/timerLib.jsx';
import useColumnsStore from '@/Stores/ColumnsStore';
import useProjectStore from '@/Stores/ProjectsStore';
import useTaskStore from "@/stores/TaskStore";
import TimeHeader from './TimeHeader';
import TimelineCard from './TimelineCard';
import LogsList from './LogsList';
import FilterSortPanel from './FilterSortPanel';
import { useSideTimerData } from '@/hooks/SideTimer/useSideTimerData.js'


export default function SideTimer() {
  // Custom hook for timer functionality
  const {
    getFilteredLogs,
    updateTimeLog,
    deleteTimeLog,
  } = useTimer();
  
  // Global state
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const columns = useColumnsStore((state) => state.columns);
  const timeLogs = useTimerStore(state => state.timeLogs);
  
  // Local state
  const [showFullTimer, setShowFullTimer] = useState(false);
  
  // Custom hook for managing time data, filtering, and sorting
  const {
    selectedDate,
    setSelectedDate,
    periodType,
    setPeriodType,
    customDateRange,
    setCustomDateRange,
    timelineData,
    filteredAndSortedLogs,
    totalTime,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterTask,
    setFilterTask,
    groupBy,
    setGroupBy,
    selectedProject,
    setSelectedProject,
    isLoading,
    handleDateChange,
    handlePeriodChange,
    formatDuration,
    getProjectForTask,
    handleUpdateTimeLog,
    handleDeleteTimeLog,
    groupedLogs,
  } = useSideTimerData({
    tasks,
    projects,
    columns,
    timeLogs,
    getFilteredLogs,
    updateTimeLog,
    deleteTimeLog,
  });
  
  // Toggle between timer and chart view
  const toggleFullTimer = () => {
    setShowFullTimer(!showFullTimer);
  };
  
  // Export data to CSV
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
      {/* Header with period selection */}
      <TimeHeader
        periodType={periodType}
        selectedDate={selectedDate}
        customDateRange={customDateRange}
        onPeriodChange={handlePeriodChange}
        onDateChange={handleDateChange}
        onCustomDateRangeChange={setCustomDateRange}
        showFullTimer={showFullTimer}
        onToggleFullTimer={toggleFullTimer}
      />
      
      {/* Timeline/Chart or Timer view */}
      <TimelineCard
        showFullTimer={showFullTimer}
        periodType={periodType}
        selectedDate={selectedDate}
        customDateRange={customDateRange}
        totalTime={totalTime}
        timelineData={timelineData}
        formatDuration={formatDuration}
        onClose={() => setShowFullTimer(false)}
      />
      
      <div className="flex gap-4">
        {/* Log listings */}
        <LogsList
          groupedLogs={groupedLogs}
          groupBy={groupBy}
          getProjectForTask={getProjectForTask}
          formatDuration={formatDuration}
          onDeleteLog={handleDeleteTimeLog}
          onUpdateLog={handleUpdateTimeLog}
        />
        
        {/* Filters and sorting panel */}
        <FilterSortPanel
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          filterTask={filterTask}
          onFilterTaskChange={setFilterTask}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          selectedProject={selectedProject}
          onSelectedProjectChange={setSelectedProject}
          projects={projects}
          logs={timeLogs}
          formatDuration={formatDuration}
          getProjectForTask={getProjectForTask}
          exportData={exportData}
        />
      </div>
    </div>
  );
}