import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.jsx"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Switch } from "@/components/ui/switch.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx"
import { Input } from "@/components/ui/input.jsx"
import { Label } from "@/components/ui/label.jsx"
import { Calendar } from "@/components/ui/calendar.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx"
import { CalendarIcon, PlayCircle, PauseCircle, RotateCcw, Clock, Plus, Settings, List, Pencil, Trash } from 'lucide-react';
import { format } from "date-fns"

export default function AddTimer() {
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [timerMode, setTimerMode] = useState('stopwatch');
	const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
	const [selectedTask, setSelectedTask] = useState(null);
	const [isAddTimeOpen, setIsAddTimeOpen] = useState(false);
	const [isLogOpen, setIsLogOpen] = useState(false);
	const [date, setDate] = useState(new Date());
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
	const [logs, setLogs] = useState([]);
	
	useEffect(() => {
		let interval;
		if (isRunning) {
			interval = setInterval(() => {
				if (timerMode === 'stopwatch') {
					setTime(prevTime => prevTime + 1);
				} else {
					setTime(prevTime => {
						if (prevTime > 0) {
							return prevTime - 1;
						} else {
							clearInterval(interval);
							setIsRunning(false);
							return 0;
						}
					});
				}
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [isRunning, timerMode]);
	
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
	
	const formatTime = (timeInSeconds) => {
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60);
		const seconds = timeInSeconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};
	
	const handleStartStop = () => {
		if (!isRunning && timerMode === 'pomodoro') {
			setTime(pomodoroTime);
		}
		setIsRunning(!isRunning);
	};
	
	const handleReset = () => {
		setIsRunning(false);
		setTime(timerMode === 'stopwatch' ? 0 : pomodoroTime);
	};
	
	const handleModeChange = (checked) => {
		const newMode = checked ? 'pomodoro' : 'stopwatch';
		setTimerMode(newMode);
		setIsRunning(false);
		setTime(newMode === 'stopwatch' ? 0 : pomodoroTime);
	};
	
	const handleAddTime = () => {
		const newLog = {
			date: format(date, "yyyy-MM-dd"),
			task: selectedTask || "Unnamed Task",
			startTime,
			endTime,
			duration: `${duration.hours}h ${duration.minutes}m`
		};
		setLogs([...logs, newLog]);
		setIsAddTimeOpen(false);
	};
	
	const handleDeleteLog = (index) => {
		const newLogs = [...logs];
		newLogs.splice(index, 1);
		setLogs(newLogs);
	};
	
	const handleTimeChange = (e, setter) => {
		const value = e.target.value;
		if (value.length <= 5) {
			setter(value);
		}
	};
	
	return (
		<Card className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
			<CardHeader className="bg-gray-100 border-b border-gray-200">
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-semibold text-gray-800">Timer</CardTitle>
					<div className="flex items-center space-x-2 bg-white rounded-full px-2 py-1 shadow-sm">
						<Clock className="h-4 w-4 text-gray-500" />
						<Switch
							checked={timerMode === 'pomodoro'}
							onCheckedChange={handleModeChange}
							className="data-[state=checked]:bg-green-500"
						/>
						<RotateCcw className="h-4 w-4 text-gray-500" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-4">
				<div className="text-center mb-4">
					<span className="text-4xl font-light text-gray-700">{formatTime(time)}</span>
				</div>
				<div className="flex justify-center space-x-2 mb-4">
					<Button
						variant={isRunning ? "destructive" : "default"}
						onClick={handleStartStop}
						className="w-24"
					>
						{isRunning ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
						{isRunning ? 'Stop' : 'Start'}
					</Button>
					<Button variant="outline" onClick={handleReset} className="w-24">
						<RotateCcw className="mr-2 h-4 w-4" />
						Reset
					</Button>
				</div>
				<Select onValueChange={setSelectedTask}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select Task" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="task1">Task 1</SelectItem>
						<SelectItem value="task2">Task 2</SelectItem>
						<SelectItem value="task3">Task 3</SelectItem>
					</SelectContent>
				</Select>
			</CardContent>
			<CardFooter className="bg-gray-50 border-t border-gray-200 p-2">
				<div className="flex justify-between w-full">
					<Dialog open={isAddTimeOpen} onOpenChange={setIsAddTimeOpen}>
						<DialogTrigger asChild>
							<Button variant="ghost" size="sm">
								<Plus className="mr-2 h-4 w-4" />
								Add Time
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Add Time Manually</DialogTitle>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="date" className="text-right">
										Date
									</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={`w-[280px] justify-start text-left font-normal`}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date ? format(date, "PPP") : <span>Pick a date</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={date}
												onSelect={setDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="startTime" className="text-right">
										From
									</Label>
									<Input
										id="startTime"
										type="time"
										value={startTime}
										onChange={(e) => handleTimeChange(e, setStartTime)}
										className="col-span-3"
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="endTime" className="text-right">
										To
									</Label>
									<Input
										id="endTime"
										type="time"
										value={endTime}
										onChange={(e) => handleTimeChange(e, setEndTime)}
										className="col-span-3"
									/>
								</div>
								<div className="text-center">
									Duration: {duration.hours}h {duration.minutes}m
								</div>
							</div>
							<Button onClick={handleAddTime}>Add</Button>
						</DialogContent>
					</Dialog>
					<Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
						<DialogTrigger asChild>
							<Button variant="ghost" size="sm">
								<List className="mr-2 h-4 w-4" />
								Log
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[625px]">
							<DialogHeader>
								<DialogTitle>Timer Log</DialogTitle>
							</DialogHeader>
							<div className="max-h-[400px] overflow-y-auto">
								{logs.map((log, index) => (
									<div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
										<div className="font-semibold">{log.date}</div>
										<div>{log.task}</div>
										<div>{log.startTime} - {log.endTime}</div>
										<div>{log.duration}</div>
										<div className="mt-2">
											<Button variant="ghost"  size="sm" className="mr-2">
												<Pencil className="h-4 w-4" />
											</Button>
											<Button variant="ghost" size="sm" onClick={() => handleDeleteLog(index)}>
												<Trash className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
					 		</div>
						</DialogContent>
					</Dialog>
					<Button variant="ghost" size="sm">
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}