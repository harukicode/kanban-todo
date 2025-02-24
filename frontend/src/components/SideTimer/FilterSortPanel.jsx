import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortAsc, SortDesc } from 'lucide-react';
import { PDFExport } from '@/components/SideTimer/PdfExport.jsx';

const FilterSortPanel = ({
	                         sortBy,
	                         onSortByChange,
	                         sortOrder,
	                         onSortOrderChange,
	                         filterTask,
	                         onFilterTaskChange,
	                         groupBy,
	                         onGroupByChange,
	                         selectedProject,
	                         onSelectedProjectChange,
	                         projects,
	                         logs,
	                         formatDuration,
	                         getProjectForTask,
	                         exportData
                         }) => {
	return (
		<Card className="w-1/3 p-4 mb-6 border shadow-sm">
			<Tabs defaultValue="sort" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="sort">Sort & Filter</TabsTrigger>
					<TabsTrigger value="analyze">Analyze & Export</TabsTrigger>
				</TabsList>
				
				{/* Sort & Filter Tab */}
				<TabsContent value="sort">
					<SortFilterTab
						sortBy={sortBy}
						onSortByChange={onSortByChange}
						sortOrder={sortOrder}
						onSortOrderChange={onSortOrderChange}
						filterTask={filterTask}
						onFilterTaskChange={onFilterTaskChange}
						groupBy={groupBy}
						onGroupByChange={onGroupByChange}
						selectedProject={selectedProject}
						onSelectedProjectChange={onSelectedProjectChange}
						projects={projects}
					/>
				</TabsContent>
				
				{/* Analyze & Export Tab */}
				<TabsContent value="analyze">
					<AnalyzeExportTab
						logs={logs}
						projects={projects}
						formatDuration={formatDuration}
						getProjectForTask={getProjectForTask}
						exportData={exportData}
					/>
				</TabsContent>
			</Tabs>
		</Card>
	);
};

/**
 * SortFilterTab component
 * Options for sorting and filtering time logs
 */
const SortFilterTab = ({
	                       sortBy,
	                       onSortByChange,
	                       sortOrder,
	                       onSortOrderChange,
	                       filterTask,
	                       onFilterTaskChange,
	                       groupBy,
	                       onGroupByChange,
	                       selectedProject,
	                       onSelectedProjectChange,
	                       projects
                       }) => {
	return (
		<div className="space-y-4">
			{/* Sort By */}
			<div>
				<label className="text-sm font-medium">Sort by:</label>
				<Select value={sortBy} onValueChange={onSortByChange}>
					<SelectTrigger className="w-full mt-1">
						<SelectValue placeholder="Select sort criteria" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="startTime">Start Time</SelectItem>
						<SelectItem value="duration">Duration</SelectItem>
						<SelectItem value="taskName">Task Name</SelectItem>
						<SelectItem value="project">Project</SelectItem>
					</SelectContent>
				</Select>
			</div>
			
			{/* Sort Order */}
			<div>
				<label className="text-sm font-medium">Order:</label>
				<div className="flex mt-1 space-x-2">
					<Button
						variant={sortOrder === "asc" ? "default" : "outline"}
						onClick={() => onSortOrderChange("asc")}
					>
						<SortAsc className="w-4 h-4 mr-2" />
						Ascending
					</Button>
					<Button
						variant={sortOrder === "desc" ? "default" : "outline"}
						onClick={() => onSortOrderChange("desc")}
					>
						<SortDesc className="w-4 h-4 mr-2" />
						Descending
					</Button>
				</div>
			</div>
			
			{/* Filter by task name */}
			<div>
				<label className="text-sm font-medium">
					Filter by task name:
				</label>
				<Input
					type="text"
					placeholder="Enter task name"
					value={filterTask}
					onChange={(e) => onFilterTaskChange(e.target.value)}
					className="mt-1"
				/>
			</div>
			
			{/* Group by */}
			<div>
				<label className="text-sm font-medium">Group by:</label>
				<Select value={groupBy} onValueChange={onGroupByChange}>
					<SelectTrigger className="w-full mt-1">
						<SelectValue placeholder="Select grouping" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">No Grouping</SelectItem>
						<SelectItem value="project">Project</SelectItem>
						<SelectItem value="date">Date</SelectItem>
					</SelectContent>
				</Select>
			</div>
			
			{/* Filter by project */}
			<div>
				<label className="text-sm font-medium">
					Filter by project:
				</label>
				<Select
					value={selectedProject}
					onValueChange={onSelectedProjectChange}
				>
					<SelectTrigger className="w-full mt-1">
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
	);
};

/**
 * AnalyzeExportTab component
 * Options for analyzing and exporting time logs
 */
const AnalyzeExportTab = ({
	                          logs,
	                          projects,
	                          formatDuration,
	                          getProjectForTask,
	                          exportData
                          }) => {
	return (
		<div className="space-y-4">
			{/* PDF Export */}
			<PDFExport
				logs={logs}
				projects={projects}
				formatDuration={formatDuration}
				getProjectForTask={getProjectForTask}
			/>
			
			{/* CSV Export */}
			<Button onClick={exportData} className="w-full mt-4">
				Export to CSV
			</Button>
		</div>
	);
};

export default FilterSortPanel;