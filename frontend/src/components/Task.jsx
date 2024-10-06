import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, Button } from "@nextui-org/react";

export default function Task({ task }) {
	const colorMapping = {
		None: "default",
		Low: "warning",
		Secondary: "primary",
		Hight: "danger",
	};
	
	return (
		<Card className={'mb-8'} style={{ backgroundColor: "#e1f4fa" }}>
			<CardHeader>
				<div className=" flex items-center justify-start mb-2">
					<Tooltip color={colorMapping[task.priority]} content={task.priority} className="capitalize">
						<Button
							variant="flat"
							color={colorMapping[task.priority]}
							className="capitalize text-xs px-1 py-0 min-w-14 h-7"
						>
							{task.priority}
						</Button>
					</Tooltip>
				</div>
				<CardTitle className="text-lg font-bold">{task.title}</CardTitle>
				<CardDescription className="text-sm">{task.description}</CardDescription>
			</CardHeader>
		</Card>
	);
}