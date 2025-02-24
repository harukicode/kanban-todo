import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar.jsx';
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const TimeHeader = ({
	                    periodType,
	                    selectedDate,
	                    customDateRange,
	                    onPeriodChange,
	                    onDateChange,
	                    onCustomDateRangeChange,
	                    showFullTimer,
	                    onToggleFullTimer
                    }) => {
	return (
		<div className="flex items-center justify-between mb-4">
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-4">
					<SidebarTrigger />
					<h2 className="text-lg font-medium">My Time</h2>
				</div>
				<Button
					variant="outline"
					className="ml-2"
					onClick={onToggleFullTimer}
				>
					<Clock className="mr-2 h-4 w-4" />
					{showFullTimer ? "Show Chart" : "Show Timer"}
				</Button>
			</div>
			
			<div className="flex items-center gap-2">
				{/* Period type selector */}
				<Select value={periodType} onValueChange={onPeriodChange}>
					<SelectTrigger className="w-[120px]">
						<SelectValue placeholder="Select period" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="day">Day</SelectItem>
						<SelectItem value="week">Week</SelectItem>
						<SelectItem value="month">Month</SelectItem>
						<SelectItem value="custom">Custom</SelectItem>
					</SelectContent>
				</Select>
				
				{/* Custom date range selector or navigation buttons */}
				{periodType === "custom" ? (
					<CustomDateRangePicker
						dateRange={customDateRange}
						onDateRangeChange={onCustomDateRangeChange}
					/>
				) : (
					<DateNavigationButtons onDateChange={onDateChange} />
				)}
			</div>
		</div>
	);
};

/**
 * Custom date range picker component
 */
const CustomDateRangePicker = ({ dateRange, onDateRangeChange }) => (
	<Popover>
		<PopoverTrigger asChild>
			<Button
				variant="outline"
				className="w-[280px] justify-start text-left font-normal"
			>
				<CalendarIcon className="mr-2 h-4 w-4" />
				{dateRange.from ? (
					dateRange.to ? (
						<>
							{format(dateRange.from, "LLL dd, y")} -{" "}
							{format(dateRange.to, "LLL dd, y")}
						</>
					) : (
						format(dateRange.from, "LLL dd, y")
					)
				) : (
					<span>Pick a date range</span>
				)}
			</Button>
		</PopoverTrigger>
		<PopoverContent className="w-auto p-0" align="start">
			<Calendar
				initialFocus
				mode="range"
				defaultMonth={dateRange.from}
				selected={dateRange}
				onSelect={onDateRangeChange}
				numberOfMonths={2}
			/>
		</PopoverContent>
	</Popover>
);

/**
 * Date navigation buttons for period navigation
 */
const DateNavigationButtons = ({ onDateChange }) => (
	<div className="flex">
		<Button
			size="icon"
			variant="ghost"
			className="h-9 w-9"
			onClick={() => onDateChange("prev")}
		>
			<ChevronLeft className="h-4 w-4" />
		</Button>
		<Button
			size="icon"
			variant="ghost"
			className="h-9 w-9"
			onClick={() => onDateChange("next")}
		>
			<ChevronRight className="h-4 w-4" />
		</Button>
	</div>
);

export default TimeHeader;