'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { AlignLeft, Calendar as CalendarIcon, MessageCircle, Plus } from 'lucide-react'
import { format, parseISO } from "date-fns"

export function AddButton({ dueDate, comments, description, onDueDateChange }) {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState(dueDate)
	
	useEffect(() => {
		setSelectedDate(dueDate || null)
	}, [dueDate])
	
	const handleDateSelect = (date) => {
		const formattedDate = date ? date.toISOString() : null;
		setSelectedDate(formattedDate);
		setIsCalendarOpen(false);
		onDueDateChange(formattedDate);
	}
	
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm">
					<Plus size={16} className="mr-2" /> Add
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<div className="grid gap-2">
					<Button variant="ghost" className="justify-start">
						<AlignLeft className="mr-2 h-4 w-4" />
						Description
					</Button>
					<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
						<PopoverTrigger asChild>
							<Button variant="ghost" className="justify-start" onClick={() => setIsCalendarOpen(true)}>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{selectedDate ? format(parseISO(selectedDate), "PPP") : "Due date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={selectedDate ? parseISO(selectedDate) : undefined}
								onSelect={handleDateSelect}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					<Button variant="ghost" className="justify-start">
						<MessageCircle className="mr-2 h-4 w-4" />
						Comment
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}