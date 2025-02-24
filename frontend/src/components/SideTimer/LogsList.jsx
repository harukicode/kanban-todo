import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreVertical } from 'lucide-react';
import { format } from "date-fns";
import useFocusTaskStore from '@/Stores/FocusTaskStore.jsx';
import useTaskStore from "@/stores/TaskStore";

const LogsList = ({
	                  groupedLogs,
	                  groupBy,
	                  getProjectForTask,
	                  formatDuration,
	                  onDeleteLog,
	                  onUpdateLog
                  }) => {
	// Global states for task access
	const tasks = useTaskStore((state) => state.tasks);
	
	return (
		<Card
			className="flex-1 p-4 mb-6 border shadow-sm overflow-y-auto"
			style={{ maxHeight: "calc(100vh - 400px)" }}
		>
			<div className="space-y-1">
				{Object.entries(groupedLogs).map(([group, logs]) => (
					<div key={`group-${group}`}>
						{/* Group header (if grouping is enabled) */}
						{groupBy !== "none" && (
							<h3 className="font-semibold text-lg mt-4 mb-2">{group}</h3>
						)}
						
						{/* Logs within this group */}
						{logs.map((log) => (
							<LogItem
								key={`${log.logId}-${new Date(log.startTime).getTime()}`}
								log={log}
								getProjectForTask={getProjectForTask}
								formatDuration={formatDuration}
								onDeleteLog={onDeleteLog}
								onUpdateLog={onUpdateLog}
							/>
						))}
					</div>
				))}
			</div>
		</Card>
	);
};

/**
 * LogItem component
 * Individual log entry with edit/delete capabilities
 */
const LogItem = ({ log, getProjectForTask, formatDuration, onDeleteLog, onUpdateLog }) => {
	// Get project information
	const project = getProjectForTask(log.taskId);
	
	// Get task name based on source (focus or regular task)
	const taskName = useGetTaskName(log);
	
	// Format time range for display
	const timeRange = formatTimeRange(log.startTime, log.endTime);
	
	return (
		<div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg group">
			<div className="flex-1">
				<div className="font-medium text-sm">{taskName}</div>
				<div className="text-xs text-gray-500">
					{project ? project.name : "No Project"}
				</div>
			</div>
			
			<div className="text-sm text-gray-500">
				{timeRange}
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
			
			<LogActions
				log={log}
				onDeleteLog={onDeleteLog}
				onUpdateLog={onUpdateLog}
			/>
		</div>
	);
};

/**
 * LogActions component
 * Edit/delete controls for a log item
 */
const LogActions = ({ log, onDeleteLog, onUpdateLog }) => {
	return (
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
								defaultValue={Math.floor(log.timeSpent / 3600)}
								onChange={(e) => {
									const hours = parseInt(e.target.value) || 0;
									const minutes = Math.floor((log.timeSpent % 3600) / 60);
									const seconds = log.timeSpent % 60;
									const newTimeSpent = hours * 3600 + minutes * 60 + seconds;
									
									onUpdateLog(log.logId, {
										timeSpent: newTimeSpent,
									});
								}}
							/>
							<Input
								type="number"
								placeholder="Minutes"
								min="0"
								max="59"
								defaultValue={Math.floor((log.timeSpent % 3600) / 60)}
								onChange={(e) => {
									const hours = Math.floor(log.timeSpent / 3600);
									const minutes = parseInt(e.target.value) || 0;
									const seconds = log.timeSpent % 60;
									const newTimeSpent = hours * 3600 + minutes * 60 + seconds;
									
									// Calculate new end time based on start time and duration
									const endTime = new Date(
										new Date(log.startTime).getTime() + newTimeSpent * 1000
									).toISOString();
									
									onUpdateLog(log.logId, {
										timeSpent: newTimeSpent,
										endTime
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
									const hours = Math.floor(log.timeSpent / 3600);
									const minutes = Math.floor((log.timeSpent % 3600) / 60);
									const seconds = parseInt(e.target.value) || 0;
									const newTimeSpent = hours * 3600 + minutes * 60 + seconds;
									
									// Calculate new end time based on start time and duration
									const endTime = new Date(
										new Date(log.startTime).getTime() + newTimeSpent * 1000
									).toISOString();
									
									onUpdateLog(log.logId, {
										timeSpent: newTimeSpent,
										endTime
									});
								}}
							/>
						</div>
					</div>
					<Button
						variant="destructive"
						onClick={() => onDeleteLog(log.logId)}
					>
						Delete Log
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

/**
 * Custom hook to get task name based on source (focus or regular task)
 */
function useGetTaskName(log) {
	const tasks = useTaskStore((state) => state.tasks);
	
	if (log.source === "focus") {
		const focusTaskStore = useFocusTaskStore.getState();
		const focusTask = focusTaskStore.getFocusTaskById(log.taskId);
		return focusTask ? focusTask.text : log.taskName;
	}
	
	return log.taskName || tasks.find((t) => t.id === log.taskId)?.title || "Unknown Task";
}

/**
 * Format time range for display
 */
function formatTimeRange(start, end) {
	return `${format(new Date(start), "HH:mm")} - ${format(new Date(end), "HH:mm")}`;
}

export default LogsList;