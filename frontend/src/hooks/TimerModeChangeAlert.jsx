import React from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const TimerModeChangeAlert = ({
	                                     isOpen,
	                                     onOpenChange,
	                                     onConfirm,
	                                     currentMode,
	                                     newMode
                                     }) => {
	const getModeText = (mode) => mode === 'pomodoro' ? 'Pomodoro' : 'Stopwatch';
	
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Change Timer Mode?</AlertDialogTitle>
					<AlertDialogDescription>
						You are currently running a {getModeText(currentMode)} timer.
						Switching to {getModeText(newMode)} mode will:
						<ul className="list-disc pl-6 mt-2 space-y-1">
							<li>Stop the current timer session</li>
							<li>Reset the timer to 0</li>
							<li>Save the current progress to logs</li>
						</ul>
						Are you sure you want to switch modes?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						Switch to {getModeText(newMode)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};