import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import { CheckSquare } from "lucide-react";
import "./App.css";
import TodoList from "./components/TodoList";
import { Todo, FilterType, TodoFolder } from "./types";
import TodoFilter from "./components/TodoFilter";
import { useAtom } from "jotai";
import { todosAtom, filterAtom, foldersAtom } from "./state/atom";
import CookiesPanel from "./components/CookiesPanel";

export default function App() {
  const [todos, setTodos] = useAtom(todosAtom);
  const [currentFilter, setCurrentFilter] = useAtom(filterAtom);
  const [folders, setFolders] = useAtom(foldersAtom);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [showCookiesPanel, setShowCookiesPanel] = useState<boolean>(false);

  useEffect(() => {
    const cookieChoice = localStorage.getItem("cookieConsent");
    if (!cookieChoice) {
      const timer = setTimeout(() => {
        setShowCookiesPanel(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowCookiesPanel(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowCookiesPanel(false);
  };

  const addTodo = (todoData: {
    text: string;
    folderId?: string | null;
  }): void => {
    const newTodo: Todo = {
      id: Date.now(),
      text: todoData.text,
      completed: false,
      createdAt: new Date().toISOString(),
      pinned: false,
      folderId: todoData.folderId || null,
    };
    setTodos([...todos, newTodo]);
  };

  const addFolder = (folderData: { title: string }): string => {
    const newFolder: TodoFolder = {
      id: Date.now().toString(),
      title: folderData.title,
      pinned: false,
      createdAt: new Date().toISOString(),
    };
    setFolders([...folders, newFolder]);
    return newFolder.id;
  };

  const deleteFolder = (id: string): void => {
    setFolders(folders.filter((folder) => folder.id !== id));
    setTodos(todos.filter((todo) => todo.folderId !== id));
  };

  const deleteNoFolder = (): void => {
    setTodos(todos.filter((todo) => todo.folderId !== null));
  };

  const handleFilterChange = (filter: FilterType) => {
    setCurrentFilter(filter);
  };

  const getCounts = () => {
    return {
      all: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    };
  };

  const getFilteredTodos = () => {
    let filtered = todos;
    switch (currentFilter) {
      case "active":
        filtered = todos.filter((todo) => !todo.completed);
        break;
      case "completed":
        filtered = todos.filter((todo) => todo.completed);
        break;
      default:
        break;
    }
    return [...filtered].sort((a, b) => {
      const pinnedA = a.pinned ? 1 : 0;
      const pinnedB = b.pinned ? 1 : 0;
      return pinnedB - pinnedA;
    });
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    setEditingId(null);
  };

  const updateFolder = (id: string, newTitle: string) => {
    setFolders(
      folders.map((folder) =>
        folder.id === id ? { ...folder, title: newTitle } : folder
      )
    );
    setEditingFolderId(null);
  };

  const toggleFolderPin = (id: string) => {
    setFolders(
      folders.map((folder) =>
        folder.id === id ? { ...folder, pinned: !folder.pinned } : folder
      )
    );
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  const togglePin = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, pinned: !todo.pinned } : todo
      )
    );
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-4 border border-gray-300 rounded-lg bg-white text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckSquare className="w-8 h-8 text-black" />
            <h1 className="text-3xl">Todo List</h1>
          </div>
          <p className="text-gray-600">Keep track of your tasks</p>
        </div>

        {/* Todo Form */}
        <TodoForm
          onAddTodo={addTodo}
          onAddFolder={addFolder}
          folders={folders}
        />

        {/* Todo Filter */}
        <TodoFilter
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
          counts={getCounts()}
        />

        {/* Todo List */}
        <TodoList
          todos={getFilteredTodos()}
          onDeleteTodo={deleteTodo}
          onUpdateTodo={updateTodo}
          editingId={editingId}
          setEditingId={setEditingId}
          onToggleTodo={toggleTodo}
          onTogglePin={togglePin}
          folders={folders}
          onDeleteFolder={deleteFolder}
          onDeleteNoFolder={deleteNoFolder}
          onUpdateFolder={updateFolder}
          onToggleFolderPin={toggleFolderPin}
          editingFolderId={editingFolderId}
          setEditingFolderId={setEditingFolderId}
        />
      </div>
      <CookiesPanel
        isVisible={showCookiesPanel}
        onAccept={handleAcceptCookies}
        onReject={handleRejectCookies}
      />
    </div>
  );
}
