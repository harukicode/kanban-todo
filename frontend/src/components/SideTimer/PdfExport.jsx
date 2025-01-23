import { format, startOfDay, endOfDay } from "date-fns"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const PRESET_RANGES = {
	day: { label: "Today", days: 1 },
	week: { label: "Week", days: 7 },
	month: { label: "Month", days: 30 },
	all: { label: "All Time", days: null },
}

export const PDFExport = ({ logs, projects, formatDuration, getProjectForTask }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
	const [selectedProject, setSelectedProject] = useState("all")
	const [preset, setPreset] = useState("day")
	const [isGenerating, setIsGenerating] = useState(false)
	const { toast } = useToast()
	
	const handlePresetChange = (value) => {
		setPreset(value)
		if (value === "all") {
			setDateRange({ from: null, to: null })
		} else {
			const today = new Date()
			const from = new Date()
			from.setDate(today.getDate() - PRESET_RANGES[value].days + 1)
			setDateRange({ from, to: today })
		}
	}
	
	const generatePDF = async () => {
		try {
			setIsGenerating(true)
			
			// Проверка наличия даты если не выбран "All Time"
			if (preset !== "all" && (!dateRange.from || !dateRange.to)) {
				toast({
					title: "Date range required",
					description: "Please select a date range for the report",
					variant: "destructive",
				})
				return
			}
			
			const filteredLogs = logs
				.filter((log) => {
					const logDate = new Date(log.startTime)
					const projectMatch = selectedProject === "all" || getProjectForTask(log.taskId)?.id === selectedProject
					
					const dateMatch =
						preset === "all" ||
						(dateRange.from &&
							dateRange.to &&
							logDate >= startOfDay(dateRange.from) &&
							logDate <= endOfDay(dateRange.to))
					
					return projectMatch && dateMatch
				})
				.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
			
			if (!filteredLogs.length) {
				// Более детальное сообщение в зависимости от фильтров
				let description = "No time logs found"
				if (preset !== "all") {
					description += ` for the selected date${preset === "day" ? "" : " range"}`
				}
				if (selectedProject !== "all") {
					const projectName = projects.find((p) => p.id === selectedProject)?.name
					description += ` in project "${projectName || "Unknown"}"`
				}
				
				toast({
					title: "No data",
					description,
					variant: "destructive",
				})
				return
			}
			
			const doc = new jsPDF()
			
			// Header
			doc.setFontSize(20)
			doc.text("Time Tracking Report", 14, 15)
			
			// Metadata
			doc.setFontSize(12)
			doc.text(`Generated on: ${format(new Date(), "MMMM d, yyyy")}`, 14, 25)
			
			// Period
			if (dateRange.from && dateRange.to && preset !== "all") {
				doc.text(`Period: ${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`, 14, 32)
			} else if (preset === "all") {
				doc.text("Period: All Time", 14, 32)
			}
			
			// Project filter
			if (selectedProject !== "all") {
				const projectName = projects.find((p) => p.id === selectedProject)?.name
				doc.text(`Project: ${projectName || "Unknown"}`, 14, 39)
			}
			
			// Total time
			const totalTime = filteredLogs.reduce((sum, log) => sum + (log.timeSpent || 0), 0)
			doc.text(`Total Time: ${formatDuration(totalTime)}`, 14, 46)
			
			// Prepare and sort table data
			const tableData = filteredLogs.map((log) => {
				const project = getProjectForTask(log.taskId)
				return [
					format(new Date(log.startTime), "MMM d, yyyy HH:mm"),
					format(new Date(log.endTime), "HH:mm"),
					log.taskName || "Unknown Task",
					project?.name || "No Project",
					formatDuration(log.timeSpent),
					log.mode === "pomodoro" ? `Pomodoro - ${log.currentMode}` : "Stopwatch",
					log.source === "focus" ? "Focus Mode" : "Timer",
				]
			})
			
			// Generate table
			autoTable(doc, {
				startY: 55,
				head: [["Start", "End", "Task", "Project", "Duration", "Mode", "Source"]],
				body: tableData,
				theme: "striped",
				styles: {
					fontSize: 8,
					cellPadding: 2,
				},
				headStyles: {
					fillColor: [71, 85, 105],
					textColor: [255, 255, 255],
					fontStyle: "bold",
				},
				columnStyles: {
					0: { cellWidth: 25 },
					1: { cellWidth: 15 },
					2: { cellWidth: 35 },
					3: { cellWidth: 25 },
					4: { cellWidth: 20 },
					5: { cellWidth: 25 },
					6: { cellWidth: 20 },
				},
				alternateRowStyles: {
					fillColor: [245, 247, 250],
				},
			})
			
			doc.save("time-tracking-report.pdf")
			setIsOpen(false)
			
			toast({
				title: "Success",
				description: "PDF report generated successfully",
			})
		} catch (error) {
			console.error("PDF generation error:", error)
			toast({
				title: "Error",
				description: "Failed to generate PDF report",
				variant: "destructive",
			})
		} finally {
			setIsGenerating(false)
		}
	}
	
	return (
		<>
			<Button onClick={() => setIsOpen(true)} className="w-full">
				Export to PDF
			</Button>
			
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="w-[95vw] max-w-[420px] p-4">
					<DialogHeader>
						<DialogTitle>Export PDF Report</DialogTitle>
					</DialogHeader>
					
					<div className="grid gap-4" onFocus={(e) => e.stopPropagation()}>
						<div className="space-y-2">
							<label className="text-sm font-medium">Time Range</label>
							<Select
								value={preset}
								onValueChange={handlePresetChange}
								onOpenChange={(open) => {
									// Предотвращаем всплытие события при открытии/закрытии Select
									if (!open) {
										setTimeout(() => {
											document.body.click()
										}, 0)
									}
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select time range" />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(PRESET_RANGES).map(([key, { label }]) => (
										<SelectItem key={key} value={key}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						
						{preset !== "all" && (
							<div className="space-y-2">
								<label className="text-sm font-medium">Custom Date Range</label>
								<div className="border rounded-lg p-3 w-full flex justify-center">
									<Calendar
										key={preset}
										mode={preset === "day" ? "single" : "range"}
										selected={preset === "day" ? dateRange.from : dateRange}
										onSelect={(value) => {
											if (preset === "day") {
												setDateRange({ from: value, to: value })
											} else {
												if (value?.from && value?.to) {
													setDateRange(value)
												}
											}
										}}
										numberOfMonths={1}
										disabled={(date) => date > new Date()}
										className="mx-auto [&_.rdp]:mx-auto [&_.rdp-month]:mx-auto [&_.rdp-table]:mx-auto"
										showOutsideDays={false}
										initialFocus
									/>
								</div>
							</div>
						)}
						
						<div className="space-y-2">
							<label className="text-sm font-medium">Project Filter</label>
							<Select value={selectedProject} onValueChange={setSelectedProject}>
								<SelectTrigger>
									<SelectValue placeholder="Select project" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Projects</SelectItem>
									{projects.map((project) => (
										<SelectItem key={project.id} value={project.id}>
											{project.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					
					<DialogFooter className="sm:justify-end">
						<Button variant="outline" onClick={() => setIsOpen(false)} className="mr-2">
							Cancel
						</Button>
						<Button onClick={generatePDF} disabled={isGenerating}>
							{isGenerating ? "Generating..." : "Generate PDF"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

