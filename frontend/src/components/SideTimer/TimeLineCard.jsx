import React from 'react';
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import FullTimer from './FullTimer';


const TimelineCard = ({
	                      showFullTimer,
	                      periodType,
	                      selectedDate,
	                      customDateRange,
	                      totalTime,
	                      timelineData,
	                      formatDuration,
	                      onClose
                      }) => {
	return (
		<Card className="p-4 mb-6 border shadow-sm">
			{showFullTimer ? (
				<FullTimer onClose={onClose} />
			) : (
				<TimelineContent
					periodType={periodType}
					selectedDate={selectedDate}
					customDateRange={customDateRange}
					totalTime={totalTime}
					timelineData={timelineData}
					formatDuration={formatDuration}
				/>
			)}
		</Card>
	);
};

/**
 * TimelineContent component
 * Shows time statistics and chart visualization
 */
const TimelineContent = ({
	                         periodType,
	                         selectedDate,
	                         customDateRange,
	                         totalTime,
	                         timelineData,
	                         formatDuration
                         }) => (
	<>
		<div className="flex justify-between mb-6">
			<div>
				<div className="text-sm text-muted-foreground">Total</div>
				<div className="text-2xl font-semibold">
					{formatDuration(totalTime)}
				</div>
			</div>
			<div className="text-right">
				<div className="text-sm text-muted-foreground">Period</div>
				<div className="text-2xl font-semibold">
					{periodType === "custom"
						? `${format(customDateRange.from, "MMM dd, yyyy")} - ${format(customDateRange.to, "MMM dd, yyyy")}`
						: format(selectedDate, "MMM dd, yyyy")}
				</div>
			</div>
		</div>
		
		<div className="h-[200px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={timelineData}
					margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
						</linearGradient>
					</defs>
					<XAxis
						dataKey="date"
						axisLine={true}
						tickLine={true}
						tick={{ fontSize: 12, fill: "#666" }}
						interval={periodType === "day" ? 3 : "preserveStartEnd"}
						tickFormatter={(value) => value}
					/>
					<YAxis
						axisLine={true}
						tickLine={true}
						tick={{ fontSize: 12, fill: "#666" }}
						label={{
							value: "Minutes",
							angle: -90,
							position: "insideLeft",
						}}
						domain={[0, "auto"]}
					/>
					<Tooltip
						content={({ active, payload, label }) => {
							if (active && payload && payload.length) {
								return (
									<div className="bg-white p-2 border rounded shadow">
										<p className="text-sm font-medium">
											{periodType === "day" ? "Time" : "Date"}: {label}
										</p>
										<p className="text-sm text-muted-foreground">
											Minutes spent: {payload[0].value.toFixed(2)}
										</p>
									</div>
								);
							}
							return null;
						}}
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
	</>
);

export default TimelineCard;