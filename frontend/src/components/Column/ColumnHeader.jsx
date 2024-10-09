import React from 'react';

const ColumnHeader = React.memo(({ column, children }) => {
	const colorIndicatorStyle = {
		width: '12px',
		height: '12px',
		borderRadius: '50%',
		backgroundColor: column.color,
		marginRight: '8px',
	};
	
	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center">
				<div style={colorIndicatorStyle}></div>
				<h3 className="text-lg font-semibold m-3">{column.title}</h3>
			</div>
			<div className="flex items-center">
				{children}
			</div>
		</div>
	);
});

ColumnHeader.displayName = 'ColumnHeader';

export default ColumnHeader;