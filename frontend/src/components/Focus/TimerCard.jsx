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
		<Card className="w-1/2 shadow-md flex flex-col min-h-0">
			<div className="flex justify-between items-center p-4 border-b">
				<h2 className="text-lg font-semibold">Timer ({timerMode === "normal" ? "Normal" : "Pomodoro"})</h2>
				<Button onClick={switchTimerMode} variant="outline" size="sm">
					Switch Mode
				</Button>
			</div>
			
			<Tabs defaultValue="timer" className="flex-1 flex flex-col min-h-0">
				<TabsList className="flex w-full border-b px-4">
					<TabsTrigger value="timer" className="flex-1">Timer</TabsTrigger>
					<TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
					<TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
				</TabsList>
				
				<div className="flex-1 min-h-0">
					<TabsContent value="timer" className="h-full p-4 m-0">
						<div className="flex flex-col items-center justify-center h-full space-y-6">
							<div className="text-5xl font-mono tracking-wider">
								{formatTime(time)}
							</div>
							<div className="flex gap-3">
								<Button
									size="lg"
									onClick={toggleTimer}
									variant={isRunning ? "destructive" : "default"}
									disabled={!activeTask}
								>
									{isRunning ? (
										<>
											<PauseCircle className="mr-2 h-5 w-5" />
											Stop
										</>
									) : (
										<>
											<PlayCircle className="mr-2 h-5 w-5" />
											Start
										</>
									)}
								</Button>
								<Button size="lg" variant="outline" onClick={resetTimer}>
									Reset
								</Button>
							</div>
							{activeTask && (
								<div className="w-full max-w-sm p-3 bg-secondary/20 rounded-lg border border-secondary/30">
									<h3 className="font-semibold mb-1">Active Task</h3>
									<p className="text-sm text-secondary-foreground/80">{activeTask.text}</p>
								</div>
							)}
						</div>
					</TabsContent>
					
					<TabsContent value="logs" className="h-full m-0">
						<ScrollArea className="h-full">
							<div className="p-4 space-y-2">
								{logs?.length > 0 ? [...logs].reverse().map(log => (
									<div key={log.logId}
									     className="flex items-center justify-between p-3 hover:bg-gray-50 border rounded-lg"
									>
										<div className="flex-1">
											<div className="font-medium">{log.taskName}</div>
											<div className="text-sm text-gray-500">
												{format(new Date(log.startTime), "MMM dd, yyyy HH:mm")} -{" "}
												{format(new Date(log.endTime), "HH:mm")}
											</div>
										</div>
										<div className="flex flex-col items-end gap-1">
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
					
					<TabsContent value="settings" className="h-full m-0">
						<ScrollArea className="h-full">
							<div className="p-4 space-y-4">
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
							</div>
						</ScrollArea>
					</TabsContent>
				</div>
			</Tabs>
		</Card>
	);
};

export default TimerCard;