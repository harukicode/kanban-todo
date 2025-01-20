import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, PauseCircle } from 'lucide-react';
import { format } from "date-fns";

const TimerCard = ({
	                   timerMode,
	                   switchTimerMode,
	                   time,
	                   isRunning,
	                   toggleTimer,
	                   resetTimer,
	                   activeTask,
	                   formatTime,
	                   logs,
	                   focusTasks,
	                   pomodoroSettings,
	                   setPomodoroSettings,
                   }) => {
	return (
		<Card className="shadow-md flex flex-col h-[calc(100%-400px-1rem)]">
			<div className="flex items-center justify-between p-3 border-b">
				<div className="flex items-center gap-2">
					<h2 className="font-semibold text-sm">Timer ({timerMode === "normal" ? "Normal" : "Pomodoro"})</h2>
					<Button onClick={switchTimerMode} variant="outline" size="sm" className="h-7">
						Switch Mode
					</Button>
				</div>
			</div>
			
			<Tabs defaultValue="timer" className="flex-1 flex flex-col min-h-0">
				<TabsList className="flex border-b px-3">
					<TabsTrigger value="timer" className="flex-1">Timer</TabsTrigger>
					<TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
					<TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
				</TabsList>
				
				<div className="flex-1 min-h-0">
					<TabsContent value="timer" className="h-full p-4 m-0">
						<div className="flex flex-col items-center justify-center h-full space-y-4">
							<div className="text-4xl font-mono tracking-wider">
								{formatTime(time)}
							</div>
							<div className="flex gap-2">
								<Button
									onClick={toggleTimer}
									variant={isRunning ? "destructive" : "default"}
									disabled={!activeTask}
									className="w-24"
								>
									{isRunning ? (
										<>
											<PauseCircle className="mr-2 h-4 w-4" />
											Stop
										</>
									) : (
										<>
											<PlayCircle className="mr-2 h-4 w-4" />
											Start
										</>
									)}
								</Button>
								<Button variant="outline" onClick={resetTimer} className="w-24">
									Reset
								</Button>
							</div>
							{activeTask && (
								<div className="w-full p-3 bg-secondary/20 rounded-lg border border-secondary/30">
									<h3 className="font-medium text-sm mb-1">Active Task</h3>
									<p className="text-sm text-secondary-foreground/80">{activeTask.text}</p>
								</div>
							)}
						</div>
					</TabsContent>
					
					<TabsContent value="logs" className="h-full m-0 relative">
						<ScrollArea className="h-[calc(100%-1rem)] absolute inset-0 p-4">
							<div className="space-y-2">
								{logs?.length > 0 ? [...logs].reverse().map(log => (
									<div key={log.logId}
									     className="flex items-center justify-between p-3 hover:bg-gray-50 border rounded-lg"
									>
										<div className="flex-1 min-w-0">
											<div className="font-medium text-sm truncate">{log.taskName}</div>
											<div className="text-xs text-gray-500">
												{format(new Date(log.startTime), "MMM dd, yyyy HH:mm")} -{" "}
												{format(new Date(log.endTime), "HH:mm")}
											</div>
										</div>
										<div className="flex flex-col items-end gap-1 shrink-0">
											<div className="text-sm font-medium">
												{formatTime(log.timeSpent)}
											</div>
											<div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {log.mode === "pomodoro" ? `Pomodoro - ${log.currentMode}` : "Stopwatch"}
                        </span>
												<span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          Focus Mode
                        </span>
											</div>
										</div>
									</div>
								)) : (
									<div className="text-center py-8 text-gray-500">
										No logs yet
									</div>
								)}
							</div>
						</ScrollArea>
					</TabsContent>
					
					<TabsContent value="settings" className="h-full m-0 relative">
						<ScrollArea className="h-[calc(100%-1rem)] absolute inset-0 p-4">
							<div className="space-y-4">
								<div className="bg-white rounded-lg p-4 border">
									<label className="text-sm font-medium block mb-2">
										Work Duration (minutes)
									</label>
									<Input
										type="number"
										value={pomodoroSettings.workDuration}
										onChange={(e) => setPomodoroSettings(prev => ({
											...prev,
											workDuration: parseInt(e.target.value)
										}))}
										min="1"
										max="60"
									/>
								</div>
								
								<div className="bg-white rounded-lg p-4 border">
									<label className="text-sm font-medium block mb-2">
										Break Duration (minutes)
									</label>
									<Input
										type="number"
										value={pomodoroSettings.breakDuration}
										onChange={(e) => setPomodoroSettings(prev => ({
											...prev,
											breakDuration: parseInt(e.target.value)
										}))}
										min="1"
										max="30"
									/>
								</div>
								
								<div className="bg-white rounded-lg p-4 border">
									<label className="text-sm font-medium block mb-2">
										Long Break Duration (minutes)
									</label>
									<Input
										type="number"
										value={pomodoroSettings.longBreakDuration}
										onChange={(e) => setPomodoroSettings(prev => ({
											...prev,
											longBreakDuration: parseInt(e.target.value)
										}))}
										min="1"
										max="60"
									/>
								</div>
								
								<div className="bg-white rounded-lg p-4 border">
									<label className="text-sm font-medium block mb-2">
										Long Break Interval (sessions)
									</label>
									<Input
										type="number"
										value={pomodoroSettings.longBreakInterval}
										onChange={(e) => setPomodoroSettings(prev => ({
											...prev,
											longBreakInterval: parseInt(e.target.value)
										}))}
										min="1"
										max="10"
									/>
								</div>
							</div>
						</ScrollArea>
					</TabsContent>
				</div>
			</Tabs>
		</Card>
	);
};

export default TimerCard;