import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTimerStore } from '@/lib/TimerLib/timerLib.jsx';

const formatDuration = (seconds) => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;
	
	if (hours > 0) {
		return `${hours}h ${minutes.toString().padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
	} else {
		return `${remainingSeconds}s`;
	}
};

export const generateTaskPDF = async (task) => {
	try {
		// Получаем логи только для текущей задачи
		const store = useTimerStore.getState();
		const taskLogs = store.timeLogs
			.filter(log => log.taskId === task.id)
			.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
		
		if (!taskLogs.length) {
			throw new Error("No time logs found for this task");
		}
		
		const doc = new jsPDF();
		
		// Header
		doc.setFontSize(20);
		doc.text("Task Time Report", 14, 15);
		
		// Task Info
		doc.setFontSize(12);
		doc.text(`Task: ${task.title}`, 14, 25);
		doc.text(`Generated on: ${format(new Date(), "MMMM d, yyyy")}`, 14, 32);
		
		// Total time
		const totalTime = taskLogs.reduce((sum, log) => sum + (log.timeSpent || 0), 0);
		doc.text(`Total Time Spent: ${formatDuration(totalTime)}`, 14, 39);
		
		if (task.dueDate) {
			doc.text(`Due Date: ${format(new Date(task.dueDate), "MMM d, yyyy")}`, 14, 46);
		}
		
		// Description if present
		let startY = task.dueDate ? 55 : 48;
		if (task.description) {
			doc.text("Description:", 14, startY);
			doc.setFontSize(10);
			const splitDescription = doc.splitTextToSize(task.description, 180);
			doc.text(splitDescription, 14, startY + 7);
			startY += 10 + (splitDescription.length * 5);
		}
		
		// Prepare table data
		const tableData = taskLogs.map((log) => [
			format(new Date(log.startTime), "MMM d, yyyy HH:mm"),
			format(new Date(log.endTime), "HH:mm"),
			formatDuration(log.timeSpent),
			log.mode === "pomodoro" ? `Pomodoro - ${log.currentMode}` : "Stopwatch",
			log.source === "focus" ? "Focus Mode" : "Timer"
		]);
		
		// Generate table
		autoTable(doc, {
			startY: startY,
			head: [["Start", "End", "Duration", "Mode", "Source"]],
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
				0: { cellWidth: 35 },
				1: { cellWidth: 20 },
				2: { cellWidth: 25 },
				3: { cellWidth: 35 },
				4: { cellWidth: 25 },
			},
			alternateRowStyles: {
				fillColor: [245, 247, 250],
			},
		});
		
		doc.save(`task-report-${task.id}.pdf`);
		return true;
	} catch (error) {
		console.error("PDF generation error:", error);
		throw error;
	}
};