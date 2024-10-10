import React from 'react';

export default function TaskDescription({ description, timeSpent }) {
	return (
		<>
			<div>
				<h3 className="text-sm font-semibold mb-2">Description</h3>
				<div className="bg-gray-50 rounded-md p-3">
					<p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{description}</p>
				</div>
			</div>
			<div>
				<p className="text-sm text-muted-foreground">Time spent: {timeSpent || '0m'}</p>
			</div>
		</>
	);
}