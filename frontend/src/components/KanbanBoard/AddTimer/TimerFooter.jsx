import React from 'react';
import { Button } from "@/components/ui/button.jsx"
import { Settings } from 'lucide-react';
import AddTimeDialog from './dialogs/AddTimeDialog';
import LogDialog from './dialogs/LogDialog';

const TimerFooter = () => (
	<div className="flex justify-between w-full">
		<AddTimeDialog />
		<LogDialog />
		<Button variant="ghost" size="sm">
			<Settings className="mr-2 h-4 w-4" />
			Settings
		</Button>
	</div>
);

export default TimerFooter;