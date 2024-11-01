"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { format, addHours, parseISO, formatDistance } from "date-fns"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function Component() {
	const [currentTime, setCurrentTime] = useState(new Date())
	const [isTracking, setIsTracking] = useState(false)
	const [selectedDate, setSelectedDate] = useState(new Date())
	const [timelineData, setTimelineData] = useState([])
	
	// Generate timeline data for the chart
	useEffect(() => {
		const data = []
		let startHour = 6
		let endHour = 18
		
		for (let hour = startHour; hour <= endHour; hour++) {
			data.push({
				time: `${hour}:00`,
				value: entries.filter(entry => {
					const [startTime] = entry.time.split(" - ")
					const entryHour = parseInt(startTime.split(":")[0])
					return entryHour === hour
				}).length * 30
			})
		}
		setTimelineData(data)
	}, [])
	
	const [entries] = useState([
		{
			title: "Make marketing banners",
			category: "Design",
			time: "6:00 - 9:00",
			duration: "3h 00m",
			inProgress: false
		},
		{
			title: "Quick Bug fixes",
			category: "Dev",
			time: "9:00 - 10:00",
			duration: "1h 00m",
			inProgress: false
		},
		{
			title: "Create design of dashboard filters",
			category: "Design",
			time: "11:00 - 14:00",
			duration: "3h 00m",
			inProgress: false
		},
		{
			title: "Video campaign preparation",
			category: "Awesome",
			time: "14:00 - 17:00",
			duration: "3h 00m",
			inProgress: false
		},
		{
			title: "Create new design for the time editor",
			category: "Development",
			time: "17:00 - 18:00",
			duration: "1h 00m",
			inProgress: true
		}
	])
	
	// Update current time every minute
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date())
		}, 60000)
		return () => clearInterval(timer)
	}, [])
	
	const formatTimeRange = (start, end) => {
		return `${format(parseISO(start), "HH:mm")} - ${format(parseISO(end), "HH:mm")}`
	}
	
	return (
		<div className="w-full max-w-8xl mx-auto p-4 font-sans">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Button
						size="icon"
						variant="ghost"
						className="rounded-full bg-green-50 hover:bg-green-100 text-green-600"
						onClick={() => setIsTracking(!isTracking)}
					>
						<Play className="h-5 w-5" />
					</Button>
					<Button size="icon" variant="ghost">
						<Plus className="h-4 w-4" />
					</Button>
					<h2 className="text-lg font-medium">My Time</h2>
				</div>
				
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="h-9 px-4 font-normal"
					>
						Today
					</Button>
					<div className="flex">
						<Button size="icon" variant="ghost" className="h-9 w-9">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button size="icon" variant="ghost" className="h-9 w-9">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
			
			<Card className="p-4 mb-6 border shadow-sm">
				<div className="flex justify-between mb-6">
					<div>
						<div className="text-sm text-muted-foreground">Total</div>
						<div className="text-2xl font-semibold">12 h 00 min</div>
					</div>
					<div className="text-right">
						<div className="text-sm text-muted-foreground">Monthly balance</div>
						<div className="text-2xl font-semibold text-green-500">+4 h 00 min</div>
					</div>
				</div>
				
				<div className="h-[120px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={timelineData}
							margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#f0f9ff" stopOpacity={0.8}/>
									<stop offset="95%" stopColor="#f0f9ff" stopOpacity={0}/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="time"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: '#666' }}
								interval={2}
							/>
							<Area
								type="monotone"
								dataKey="value"
								stroke="#60a5fa"
								fillOpacity={1}
								fill="url(#colorValue)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</Card>
			
			<div className="flex items-center gap-2 mb-4">
				<input type="checkbox" className="rounded border-gray-300" />
				<Button
					variant="outline"
					className="h-8 px-3 text-sm font-normal"
				>
					Add time entry
				</Button>
				<Button
					variant="outline"
					className="h-8 px-3 text-sm font-normal"
				>
					Add break
				</Button>
			</div>
			
			<div className="space-y-1">
				{entries.map((entry, index) => (
					<div
						key={index}
						className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg group"
					>
						<input type="checkbox" className="rounded border-gray-300" />
						<div className="flex-1">
							<div className="font-medium text-sm">{entry.title}</div>
							<div className="flex gap-2 mt-1">
							</div>
						</div>
						<div className="text-sm text-gray-500">{entry.time}</div>
						<div className="text-sm font-medium">{entry.duration}</div>
						<Button
							size="icon"
							variant="ghost"
							className="opacity-0 group-hover:opacity-100 h-8 w-8"
						>
							<Play className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
		</div>
	)
}