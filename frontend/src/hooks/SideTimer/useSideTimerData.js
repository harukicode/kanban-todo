import { useState, useEffect, useCallback, useMemo } from 'react';
import { format, startOfDay, endOfDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import useFocusTaskStore from '@/Stores/FocusTaskStore.jsx';

export const useSideTimerData = ({
	                                 tasks,
	                                 projects,
	                                 columns,
	                                 timeLogs,
	                                 getFilteredLogs,
	                                 updateTimeLog,
	                                 deleteTimeLog
                                 }) => {
	// Date and period state
	const [currentTime, setCurrentTime] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [timelineData, setTimelineData] = useState([]);
	const [periodType, setPeriodType] = useState("day");
	const [customDateRange, setCustomDateRange] = useState({ from: null, to: null });
	
	// Filter and sort state
	const [sortBy, setSortBy] = useState("startTime");
	const [sortOrder, setSortOrder] = useState("desc");
	const [filterTask, setFilterTask] = useState("");
	const [groupBy, setGroupBy] = useState("none");
	const [selectedProject, setSelectedProject] = useState("all");
	
	// Results state
	const [isLoading, setIsLoading] = useState(false);
	const [filteredAndSortedLogs, setFilteredAndSortedLogs] = useState([]);
	const [totalTime, setTotalTime] = useState(0);
	
	/**
	 * Format time duration in seconds to human-readable format
	 */
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
	
	/**
	 * Format time range for display
	 */
	const formatTimeRange = (start, end) => {
		return `${format(new Date(start), "HH:mm")} - ${format(new Date(end), "HH:mm")}`;
	};
	
	/**
	 * Get date range for the current period type
	 */
	const getPeriodDates = useCallback(() => {
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
	}, [periodType, selectedDate, customDateRange]);
	
	/**
	 * Generate timeline data for chart
	 */
	const generateTimelineData = useCallback(async () => {
		const { start, end } = getPeriodDates();
		try {
			const filteredLogs = await getFilteredLogs({
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
		} catch (error) {
			console.error('Failed to generate timeline data:', error);
			return [];
		}
	}, [getFilteredLogs, getPeriodDates, periodType, selectedDate]);
	
	/**
	 * Update timeline data when period changes
	 */
	const updateTimelineData = useCallback(async () => {
		setIsLoading(true);
		try {
			const newData = await generateTimelineData();
			setTimelineData(newData);
		} catch (error) {
			console.error('Failed to update timeline data:', error);
		} finally {
			setIsLoading(false);
		}
	}, [generateTimelineData]);
	
	/**
	 * Get project for a task
	 */
	const getProjectForTask = useCallback((taskId) => {
		const task = tasks.find(t => t.id === taskId);
		if (!task) return null;
		
		const column = columns.find(c => c.id === task.columnId);
		if (!column) return null;
		
		return projects.find(p => p.id === column.projectId) || null;
	}, [tasks, columns, projects]);
	
	/**
	 * Get task name based on source (focus or regular)
	 */
	const getTaskName = useCallback((log) => {
		if (log.source === "focus") {
			const focusTaskStore = useFocusTaskStore.getState();
			const focusTask = focusTaskStore.getFocusTaskById(log.taskId);
			return focusTask ? focusTask.text : log.taskName;
		}
		return log.taskName || tasks.find(t => t.id === log.taskId)?.title || "Unknown Task";
	}, [tasks]);
	
	/**
	 * Change date based on direction (prev/next)
	 */
	const handleDateChange = useCallback((direction) => {
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
	}, [periodType]);
	
	/**
	 * Change period type
	 */
	const handlePeriodChange = useCallback((newPeriod) => {
		setPeriodType(newPeriod);
		if (newPeriod === "custom") {
			setCustomDateRange({ from: selectedDate, to: selectedDate });
		}
	}, [selectedDate]);
	
	/**
	 * Handle updating a time log
	 */
	const handleUpdateTimeLog = useCallback(async (logId, updatedData) => {
		setIsLoading(true);
		try {
			await updateTimeLog(logId, updatedData);
		} catch (error) {
			console.error('Failed to update time log:', error);
		} finally {
			setIsLoading(false);
		}
	}, [updateTimeLog]);
	
	/**
	 * Handle deleting a time log
	 */
	const handleDeleteTimeLog = useCallback(async (logId) => {
		setIsLoading(true);
		try {
			await deleteTimeLog(logId);
		} catch (error) {
			console.error('Error deleting time log:', error);
		} finally {
			setIsLoading(false);
		}
	}, [deleteTimeLog]);
	
	/**
	 * Process and filter logs based on current filters
	 */
	const processedLogs = useMemo(() => {
		if (!timeLogs.length) return [];
		
		const { start, end } = getPeriodDates();
		
		return timeLogs
			.filter(log => {
				const logDate = new Date(log.startTime);
				const project = getProjectForTask(log.taskId);
				const taskName = getTaskName(log);
				
				return logDate >= start && logDate <= end &&
					taskName.toLowerCase().includes(filterTask.toLowerCase()) &&
					(selectedProject === "all" || (project && project.id === selectedProject));
			})
			.sort((a, b) => {
				if (sortBy === "taskName") {
					const taskNameA = getTaskName(a);
					const taskNameB = getTaskName(b);
					
					return sortOrder === "asc"
						? taskNameA.localeCompare(taskNameB)
						: taskNameB.localeCompare(taskNameA);
				}
				if (sortBy === "startTime") {
					const timeA = new Date(a.startTime).getTime();
					const timeB = new Date(b.startTime).getTime();
					return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
				}
				return 0;
			});
	}, [
		timeLogs,
		getPeriodDates,
		getProjectForTask,
		getTaskName,
		filterTask,
		selectedProject,
		sortBy,
		sortOrder
	]);
	
	/**
	 * Group logs by the selected grouping criteria
	 */
	const groupedLogs = useMemo(() => {
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
	
	// Update timeline data when period changes
	useEffect(() => {
		updateTimelineData();
	}, [selectedDate, periodType, customDateRange, updateTimelineData]);
	
	// Update filtered logs and total time when processed logs change
	useEffect(() => {
		setFilteredAndSortedLogs(processedLogs);
		
		const total = processedLogs.reduce((sum, log) => sum + (log.timeSpent || 0), 0);
		setTotalTime(total);
	}, [processedLogs]);
	
	// Clock update effect
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);
		return () => clearInterval(timer);
	}, []);
	
	// Initial data load
	useEffect(() => {
		const loadInitialData = async () => {
			setIsLoading(true);
			try {
				const logs = await getFilteredLogs();
				const initialData = await generateTimelineData();
				setTimelineData(initialData);
			} catch (error) {
				console.error('Failed to load initial data:', error);
			} finally {
				setIsLoading(false);
			}
		};
		
		loadInitialData();
	}, [getFilteredLogs, generateTimelineData]);
	
	return {
		currentTime,
		selectedDate,
		setSelectedDate,
		timelineData,
		periodType,
		setPeriodType,
		customDateRange,
		setCustomDateRange,
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
		filteredAndSortedLogs,
		totalTime,
		formatDuration,
		formatTimeRange,
		getPeriodDates,
		handleDateChange,
		handlePeriodChange,
		getProjectForTask,
		getTaskName,
		handleUpdateTimeLog,
		handleDeleteTimeLog,
		groupedLogs,
	};
};