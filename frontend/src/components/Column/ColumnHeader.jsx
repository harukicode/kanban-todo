import React from 'react';
import { Button } from '@nextui-org/react';
import PropTypes from "prop-types";

/**
 * ColumnHeader component displays the column title and edit/delete buttons.
 */
const ColumnHeader = ({ column, editColumnTitle }) => (
	<div className="flex items-center">
		{/* Color indicator circle */}
		<div
			style={{
				width: '12px',
				height: '12px',
				borderRadius: '50%',
				backgroundColor: column.color,
				marginRight: '8px',
			}}
		></div>
		
		{/* Column title */}
		<h3 className="text-lg font-semibold m-3">{column.title}</h3>
		
		{/* Edit button, visible if editColumnTitle prop is provided */}
		{editColumnTitle && (
			<Button auto flat onClick={() => editColumnTitle(column)}>
				Edit
			</Button>
		)}
	</div>
);



export default ColumnHeader;
