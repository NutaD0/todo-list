
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  pinned: boolean;
  folderId: string | null;
}

export interface TodoFolder {
  id: string;
  title: string;
  pinned: boolean;
  createdAt: string;
}


export interface TodoFormProps {
  onAddTodo: (todoData: { text: string; folderId?: string | null }) => void;
  onAddFolder: (folderData: { title: string }) => string;
  folders: TodoFolder[];
}


export interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (id: number, newText: string) => void;
  onUpdateFolder: (id: string, newTitle: string) => void;
  onToggleFolderPin: (id: string) => void;
  editingFolderId: string | null;
  setEditingFolderId: (id: string | null) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  onToggleTodo: (id: number) => void;
  onTogglePin: (id: number) => void;
  folders: TodoFolder[];
  onDeleteFolder: (id: string) => void;
  onDeleteNoFolder: () => void;
}

export type FilterType = "all" | "active" | "completed";

export interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}
