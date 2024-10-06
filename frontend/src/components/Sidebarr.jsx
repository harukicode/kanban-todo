import React from 'react';
import { CiViewBoard } from "react-icons/ci";
import { RxLapTimer } from "react-icons/rx";
import { SlNote } from "react-icons/sl";
import { MdOutlineSettingsSuggest } from "react-icons/md";


import { Button } from '@nextui-org/react'
import './Sidebar.jsx.css';
const Sidebar = () => {
	return (
		<div className="sidebar">
			{/* SideBar panel */}
			<nav className="sidebar-nav">
				<h3 className='text-xl font-semibold tracking-tight'>Navigation</h3>
				<ul>
					<li>
						<Button className="button-hover-effect">
							<CiViewBoard size={22} />
							<h3 className=' text-l font-semibold tracking-tight'>Kanban Board</h3>
						</Button>
					</li>
					<li>
						<Button className="button-hover-effect">
							<RxLapTimer size={22} />
							<h3 className=' text-l font-semibold tracking-tight'>Timer</h3>
						</Button>
					</li>
					<li>
						<Button className="button-hover-effect">
							<SlNote size={22} />
							<h3 className=' text-l font-semibold tracking-tight'>Notes</h3>
						</Button>
					</li>
				</ul>
				<h3 className=' text-xl font-semibold tracking-tight'>Projects</h3>
				<ul className={'projects-nav'}>
					<li className="project-1"><h3 className='scroll-m-20 text-l font-semibold tracking-tight'>Project 1</h3></li>
					<li className="project-2"><h3 className='scroll-m-20 text-l font-semibold tracking-tight'>Project 2</h3></li>
					<li className="project-3"><h3 className='scroll-m-20 text-l font-semibold tracking-tight'>Project 3</h3></li>
					<li className="project-4"><h3 className='scroll-m-20 text-l font-semibold tracking-tight'>Project 4</h3></li>
				</ul>
			</nav>
			
			{/* New Project Button */}
			<div className='new-project'>
				<Button className={'new-project-button'}>New Project</Button>
			</div>
			
			{/* Settings */}
			<div className='sidebar-settings'>
				<Button color="primary" variant="ghost">
					<MdOutlineSettingsSuggest size={22} />
					Settings
				</Button>
			</div>
		</div>
	);
};

export default Sidebar;
