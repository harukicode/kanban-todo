import React, { useState } from "react"; // Import React and the useState hook for state management
import {
  Button,
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"; // Import UI components from NextUI
import { GrEdit } from "react-icons/gr"; // Import the edit icon from react-icons
import { ChevronDown } from "lucide-react"; // Import the ChevronDown icon from lucide-react
import Column from "./Column"; // Import the Column component
import EditColumnModal from "./EditColumnModal"; // Import the EditColumnModal component

// Header component for Kanban board with edit mode and project selection
const Header = ({
  editMode,
  setEditMode,
  projects,
  activeProject,
  setActiveProject,
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <h1 className="text-2xl font-bold">Kanban Board</h1> {/* Header title */}
      <Button
        color="primary"
        variant="light"
        onClick={() => setEditMode(!editMode)}
      >
        {" "}
        {/* Toggle edit mode */}
        <GrEdit size={25} /> {/* Edit icon */}
        {editMode ? "Disable Edit Mode" : "Enable Edit Mode"}{" "}
        {/* Toggle button text */}
      </Button>
    </div>
    {/* Dropdown for project selection */}
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" endContent={<ChevronDown size={16} />}>
          {activeProject === "all" ? "All Projects" : activeProject}{" "}
          {/* Display active project */}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Project selection" // Dropdown accessibility label
        onAction={(key) => setActiveProject(key)} // Set active project on selection
        selectedKeys={[activeProject]} // Highlight the selected project
      >
        <DropdownItem key="all">All Projects</DropdownItem>{" "}
        {/* Option to select all projects */}
        {projects.map((project) => (
          <DropdownItem key={project.name}>{project.name}</DropdownItem> // List of project options
        ))}
      </DropdownMenu>
    </Dropdown>
  </div>
);

// ColumnList component for displaying columns on the Kanban board
const ColumnList = ({ columns, editMode, handleEditClick, setColumns }) => (
  <div className="flex space-x-4 overflow-x-auto pb-4">
    {" "}
    {/* Flex container with horizontal scroll for columns */}
    {columns.map((column) => (
      <Column
        key={column.id} // Unique key for each column
        column={column} // Pass column data
        editColumnTitle={editMode ? handleEditClick : null} // Enable column title edit in edit mode
        deleteColumn={
          editMode
            ? (id) => setColumns(columns.filter((col) => col.id !== id))
            : null
        } // Allow column deletion in edit mode
        addTask={(columnId, task) =>
          setColumns(
            columns.map((col) =>
              col.id === columnId
                ? { ...col, tasks: [...col.tasks, task] }
                : col
            )
          )
        } // Add task to the selected column
      />
    ))}
  </div>
);

// Input component for adding a new column
const NewColumnInput = ({ newColumnTitle, setNewColumnTitle, addColumn }) => (
  <div className="flex-shrink-0 w-72">
    {" "}
    {/* Fixed width container for the input */}
    <Card>
      <CardBody>
        <Input
          placeholder="New Column Title" // Input placeholder
          value={newColumnTitle} // Bind input value to state
          onChange={(e) => setNewColumnTitle(e.target.value)} // Update state when the input value changes
          className="mb-2"
        />
        <Button fullWidth color="primary" onClick={addColumn}>
          {" "}
          {/* Button to add the new column */}
          Add Column
        </Button>
      </CardBody>
    </Card>
  </div>
);

// Main KanbanBoard component
const KanbanBoard = () => {
  // State for managing the columns
  const [columns, setColumns] = useState([
    { id: "1", title: "To Do", tasks: [], color: "#9333ea" }, // Default "To Do" column
    { id: "2", title: "On Progress", tasks: [], color: "#eab308" }, // Default "On Progress" column
    { id: "3", title: "Done", tasks: [], color: "#3b82f6" }, // Default "Done" column
  ]);

  // State for managing modal visibility, current column being edited, and new column input
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [currentColumn, setCurrentColumn] = useState(null); // Column being edited
  const [newColumnTitle, setNewColumnTitle] = useState(""); // Input for new column title
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [activeProject, setActiveProject] = useState("all"); // Active project selection

  // List of projects
  const projects = [
    { id: "1", name: "Mobile App" }, // Example project 1
    { id: "2", name: "Project 2" }, // Example project 2
    { id: "3", name: "Project 3" }, // Example project 3
  ];

  // Function to open the edit modal for a specific column
  const handleEditClick = (column) => {
    setCurrentColumn(column); // Set the current column to be edited
    setIsModalOpen(true); // Open the modal
  };

  // Function to save the edited column
  const handleSaveColumn = (updatedColumn) => {
    setColumns(
      columns.map((col) => (col.id === updatedColumn.id ? updatedColumn : col))
    ); // Update the column in the state
  };

  // Function to add a new column
  const addColumn = () => {
    const newColumn = {
      id: Date.now().toString(),
      title: newColumnTitle,
      tasks: [],
      color: "#10b981",
    }; // Create a new column with a unique ID
    setColumns([...columns, newColumn]); // Add the new column to the state
    setNewColumnTitle(""); // Reset the input field
  };

  return (
    <div className="kanban-container p-4">
      {" "}
      {/* Main container for the Kanban board */}
      {/* Header component for the Kanban board */}
      <Header
        editMode={editMode}
        setEditMode={setEditMode}
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
      />
      {/* List of columns */}
      <ColumnList
        columns={columns}
        editMode={editMode}
        handleEditClick={handleEditClick}
        setColumns={setColumns}
      />
      {/* Input for adding a new column, only visible in edit mode */}
      {editMode && (
        <NewColumnInput
          newColumnTitle={newColumnTitle}
          setNewColumnTitle={setNewColumnTitle}
          addColumn={addColumn}
        />
      )}
      {/* Modal for editing column */}
      <EditColumnModal
        isOpen={isModalOpen} // Modal open state
        onClose={() => setIsModalOpen(false)} // Close the modal
        column={currentColumn} // Column being edited
        onSave={handleSaveColumn} // Save the edited column
      />
    </div>
  );
};

export default KanbanBoard; // Export the KanbanBoard component
