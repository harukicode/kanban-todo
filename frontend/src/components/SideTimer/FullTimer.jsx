import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw } from 'lucide-react'
import useTaskStore from "@/stores/TaskStore"
import { GiTomato } from "react-icons/gi";
export default function FullTimer({ onClose }) {
	const [isRunning, setIsRunning] = useState(false)
	const [time, setTime] = useState(0)
	const [isPomodoro, setIsPomodoro] = useState(false)
	const [pomodoroLength, setPomodoroLength] = useState(25)
	const [currentLogId, setCurrentLogId] = useState(null)
	
	const tasks = useTaskStore((state) => state.tasks)
	const selectedTaskId = useTaskStore((state) => state.selectedTaskId)
	const setSelectedTaskId = useTaskStore((state) => state.setSelectedTaskId)
	const updateTimeSpent = useTaskStore((state) => state.updateTimeSpent)
	const addTimeLog = useTaskStore((state) => state.addTimeLog)
	const updateTimeLog = useTaskStore((state) => state.updateTimeLog)
	
	const selectedTask = tasks.find(task => task.id === selectedTaskId)
	
	useEffect(() => {
		let interval = null
		if (isRunning) {
			interval = setInterval(() => {
				setTime((prevTime) => {
					const newTime = prevTime + 1
					if (selectedTaskId && currentLogId) {
						updateTimeLog(currentLogId, {
							timeSpent: newTime,
							endTime: new Date().toISOString()
						})
						updateTimeSpent(selectedTaskId, (selectedTask?.timeSpent || 0) + 1)
					}
					if (isPomodoro && newTime >= pomodoroLength * 60) {
						setIsRunning(false)
						return pomodoroLength * 60
					}
					return newTime
				})
			}, 1000)
		}
		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isRunning, isPomodoro, pomodoroLength, selectedTaskId, selectedTask, updateTimeSpent, currentLogId, updateTimeLog])
	
	const toggleTimer = () => {
		if (!isRunning && selectedTaskId) {
			const newLogId = Date.now().toString()
			setCurrentLogId(newLogId)
			addTimeLog({
				logId: newLogId,
				taskId: selectedTaskId,
				taskName: selectedTask.title,
				startTime: new Date().toISOString(),
				endTime: new Date().toISOString(),
				timeSpent: 0
			})
			setIsRunning(true)
		} else {
			if (currentLogId) {
				updateTimeLog(currentLogId, {
					endTime: new Date().toISOString(),
					timeSpent: time
				})
			}
			setIsRunning(false)
		}
	}
	
	const resetTimer = () => {
		setIsRunning(false)
		setTime(0)
		if (currentLogId) {
			updateTimeLog(currentLogId, {
				endTime: new Date().toISOString(),
				timeSpent: time
			})
			setCurrentLogId(null)
		}
	}
	
	const formatTime = (timeInSeconds) => {
		const hours = Math.floor(timeInSeconds / 3600)
		const minutes = Math.floor((timeInSeconds % 3600) / 60)
		const seconds = timeInSeconds % 60
		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}
	
	return (
		<Card className=" mb-6 w-full h-[180px] flex flex-col justify-between p-4 bg-background">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold text-foreground">Timer</h2>
				<div className="flex items-center space-x-2">
					<GiTomato className="w-4 h-4" />
					<Switch
						checked={isPomodoro}
						onCheckedChange={setIsPomodoro}
					/>
				</div>
				<Button variant="ghost" size="icon" onClick={onClose}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
					<span className="sr-only">Close</span>
				</Button>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<div className="text-4xl font-bold text-foreground">
						{formatTime(time)}
					</div>
					{selectedTask && (
						<div className="text-sm text-muted-foreground mt-1">
							Total: {formatTime(selectedTask.timeSpent || 0)}
						</div>
					)}
				</div>
				<div className="flex flex-col space-y-2">
					<Button
						onClick={toggleTimer}
						variant={isRunning ? "destructive" : "default"}
						size="sm"
						className="w-20"
						disabled={!selectedTaskId}
					>
						{isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
						{isRunning ? "Pause" : "Start"}
					</Button>
					<Button
						onClick={resetTimer}
						variant="outline"
						size="sm"
						className="w-20"
					>
						<RotateCcw className="w-4 h-4 mr-1" />
						Reset
					</Button>
				</div>
			</div>
			<div className="flex items-center space-x-2 mt-2">
				<Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a task" />
					</SelectTrigger>
					<SelectContent>
						{tasks.map(task => (
							<SelectItem key={task.id} value={task.id}>{task.title}</SelectItem>
						))}
					</SelectContent>
				</Select>
				{isPomodoro && (
					<div className="flex items-center space-x-2 flex-1">
						<Slider
							value={[pomodoroLength]}
							onValueChange={(value) => setPomodoroLength(value[0])}
							max={60}
							min={1}
							step={1}
							className="w-full"
						/>
						<span className="text-sm font-medium w-12 text-right">{pomodoroLength} min</span>
					</div>
				)}
			</div>
		</Card>
	)
}