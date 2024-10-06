import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { GrEdit } from 'react-icons/gr';
import { ChevronDown } from 'lucide-react';
import Column from './Column';
import EditColumnModal from './EditColumnModal';

const Header = ({ editMode, setEditMode, projects, activeProject, setActiveProject }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <h1 className="text-2xl font-bold">Kanban Board</h1>
      <Button color="primary" variant="light" onClick={() => setEditMode(!editMode)}>
        <GrEdit size={25} />
        {editMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
      </Button>
    </div>
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          endContent={<ChevronDown size={16} />}
        >
          {activeProject === 'all' ? 'All Projects' : activeProject}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Project selection"
        onAction={(key) => setActiveProject(key)}
        selectedKeys={[activeProject]}
      >
        <DropdownItem key="all">All Projects</DropdownItem>
        {projects.map(project => (
          <DropdownItem key={project.name}>{project.name}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  </div>
);

const ColumnList = ({ columns, editMode, handleEditClick, setColumns }) => (
  <div className="flex space-x-4 overflow-x-auto pb-4">
    {columns.map(column => (
      <Column
        key={column.id}
        column={column}
        editColumnTitle={editMode ? handleEditClick : null}
        deleteColumn={editMode ? (id) => setColumns(columns.filter(col => col.id !== id)) : null}
        addTask={(columnId, task) => setColumns(columns.map(col => col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col))}
      />
    ))}
  </div>
);

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

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    { id: '1', title: 'To Do', tasks: [], color: '#9333ea' },
    { id: '2', title: 'On Progress', tasks: [], color: '#eab308' },
    { id: '3', title: 'Done', tasks: [], color: '#3b82f6' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [activeProject, setActiveProject] = useState('all');
  
  const projects = [
    { id: '1', name: 'Mobile App' },
    { id: '2', name: 'Project 2' },
    { id: '3', name: 'Project 3' },
  ];
  
  const handleEditClick = (column) => {
    setCurrentColumn(column);
    setIsModalOpen(true);
  };
  
  const handleSaveColumn = (updatedColumn) => {
    setColumns(columns.map(col => col.id === updatedColumn.id ? updatedColumn : col));
  };
  
  const addColumn = () => {
    const newColumn = { id: Date.now().toString(), title: newColumnTitle, tasks: [], color: '#10b981' };
    setColumns([...columns, newColumn]);
    setNewColumnTitle('');
  };
  
  return (
    <div className="kanban-container p-4">
      <Header
        editMode={editMode}
        setEditMode={setEditMode}
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
      />
      <ColumnList
        columns={columns}
        editMode={editMode}
        handleEditClick={handleEditClick}
        setColumns={setColumns}
      />
      {editMode && (
        <NewColumnInput
          newColumnTitle={newColumnTitle}
          setNewColumnTitle={setNewColumnTitle}
          addColumn={addColumn}
        />
      )}
      <EditColumnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        column={currentColumn}
        onSave={handleSaveColumn}
      />
    </div>
  );
};

export default KanbanBoard;