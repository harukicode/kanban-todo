import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { Clock, RotateCcw } from 'lucide-react';
import { Switch } from "@/components/ui/switch.jsx"
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TaskSelect from './TaskSelect';
import TimerFooter from './TimerFooter';
import { useTimer } from '@/hooks/timerHooks/useTimer.jsx';
import { useTimerMode } from '@/hooks/timerHooks/useTimerMode.jsx';


const AddTimer = () => {
	const { time, isRunning, handleStartStop, handleReset } = useTimer();
	const { timerMode, handleModeChange } = useTimerMode();
	

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
				<TimerDisplay time={time} />
				<TimerControls
					isRunning={isRunning}
					onStartStop={handleStartStop}
					onReset={handleReset}
				/>
				<TaskSelect />
			</CardContent>
			<CardFooter className="bg-gray-50 border-t border-gray-200 p-2">
				<TimerFooter />
			</CardFooter>
		</Card>
	);
};

export default AddTimer;