import React from "react";
import { Button, Card, CardBody, Input } from "@nextui-org/react";

const NewColumnInput = ({ newColumnTitle, setNewColumnTitle, addColumn }) => (
	<div className="flex-shrink-0 w-72">
		<Card>
			<CardBody>
				<Input
					placeholder="New Column Title"
					value={newColumnTitle}
					onChange={(e) => setNewColumnTitle(e.target.value)}
					className="mb-2"
				/>
				<Button fullWidth color="primary" onClick={addColumn}>
					Add Column
				</Button>
			</CardBody>
		</Card>
	</div>
);


export default NewColumnInput;
