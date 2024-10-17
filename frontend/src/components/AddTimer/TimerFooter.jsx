import React from 'react';
import AddTimeDialog from './dialogs/AddTimeDialog';
import LogDialog from './dialogs/LogDialog';
import SettingsDialog from './dialogs/SettingsDialog';

const TimerFooter = ({ settings, onSettingsChange, isPomodoroMode }) => (
	<div className="flex justify-between w-full">
		<AddTimeDialog />
		<LogDialog />
		<SettingsDialog settings={settings} onSettingsChange={onSettingsChange} isPomodoroMode={isPomodoroMode} />
	</div>
);

export default TimerFooter;