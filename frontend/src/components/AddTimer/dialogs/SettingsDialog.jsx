import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const SettingsDialog = ({ settings, onSettingsChange, isPomodoroMode }) => {
	const [localSettings, setLocalSettings] = useState(settings);
	const [isOpen, setIsOpen] = useState(false);
	
	useEffect(() => {
		setLocalSettings(settings);
	}, [settings]);
	
	const handleSettingChange = (setting, value) => {
		setLocalSettings(prev => ({ ...prev, [setting]: value }));
	};
	
	const handleCustomInputChange = (setting, value) => {
		const numValue = parseInt(value, 10);
		if (!isNaN(numValue) && numValue > 0) {
			handleSettingChange(setting, numValue);
		} else {
			handleSettingChange(setting, '');
		}
	};
	
	const handleSave = () => {
		const validatedSettings = Object.entries(localSettings).reduce((acc, [key, value]) => {
			acc[key] = typeof value === 'number' ? value : (parseInt(value, 10) || settings[key]);
			return acc;
		}, {});
		onSettingsChange(validatedSettings);
		setIsOpen(false);
	};
	
	const renderSelectWithCustom = (setting, options, label) => (
		<div className="grid grid-cols-4 items-center gap-4">
			<Label htmlFor={setting} className="text-right">
				{label}
			</Label>
			<Select
				value={localSettings[setting].toString()}
				onValueChange={(value) => {
					if (value === 'custom') {
						handleSettingChange(setting, '');
					} else {
						handleSettingChange(setting, parseInt(value, 10));
					}
				}}
			>
				<SelectTrigger className="col-span-3">
					<SelectValue placeholder={`Select ${label.toLowerCase()}`} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={option.toString()}>
							{option} {setting.includes('Interval') ? 'breaks' : 'minutes'}
						</SelectItem>
					))}
					<SelectItem value="custom">Custom</SelectItem>
				</SelectContent>
			</Select>
			{(localSettings[setting] === '' || !options.includes(localSettings[setting])) && (
				<Input
					type="number"
					value={localSettings[setting]}
					placeholder="Enter custom value"
					className="col-span-3 mt-2"
					onChange={(e) => handleCustomInputChange(setting, e.target.value)}
				/>
			)}
		</div>
	);
	
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
					<Settings className="mr-2 h-4 w-4" />
					Settings
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Timer Settings</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					{renderSelectWithCustom('workTime', [15, 20, 25, 30, 35, 40, 45, 50, 55, 60], 'Work time')}
					{renderSelectWithCustom('shortBreakTime', [3, 5, 7, 10], 'Short break')}
					{renderSelectWithCustom('longBreakInterval', [2, 3, 4, 5, 6], 'Long break interval')}
					{renderSelectWithCustom('longBreakTime', [10, 15, 20, 25, 30], 'Long break')}
				</div>
				<p className="text-sm text-gray-500 mb-4">
					{isPomodoroMode
						? "These settings apply to the Pomodoro mode."
						: "These settings will apply when you switch to Pomodoro mode."}
				</p>
				<Button onClick={handleSave}>Save Changes</Button>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsDialog;