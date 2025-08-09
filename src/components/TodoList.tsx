import "../styles/TodoList.css";
import { Todo, TodoListProps, TodoFolder } from "../types";
import { Trash2, Edit2, Save, X, Pin, PinOff, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function TodoList({
  todos,
  onDeleteTodo,
  editingId,
  setEditingId,
  onUpdateTodo,
  onToggleTodo,
  onTogglePin,
  folders,
  onDeleteFolder,
  onDeleteNoFolder,
  onUpdateFolder,
  onToggleFolderPin,
  editingFolderId,
  setEditingFolderId,
}: TodoListProps) {
  const [editingText, setEditingText] = useState<string>("");
  const [editingFolderText, setEditingFolderText] = useState<string>("");

  const groupedTodos = useMemo(() => {
    const groups: { folder?: TodoFolder; todos: Todo[] }[] = [];

    // Сортируем папки: сначала закрепленные, потом обычные
    const sortedFolders = [...folders].sort((a, b) => {
      const pinnedA = a.pinned ? 1 : 0;
      const pinnedB = b.pinned ? 1 : 0;
      return pinnedB - pinnedA;
    });

    sortedFolders.forEach((folder) => {
      const folderTodos = todos.filter((todo) => todo.folderId === folder.id);

      groups.push({ folder, todos: folderTodos });
    });

    const noFolderTodos = todos.filter((todo) => todo.folderId === null);

    if (noFolderTodos.length > 0) {
      groups.push({ todos: noFolderTodos });
    }

    return groups;
  }, [todos, folders]);

  if (todos.length === 0 && folders.length === 0) {
    return (
      <div className="p-8 border border-gray-300 rounded-lg bg-white text-center">
        <p className="text-gray-500">No tasks yet. Add one above!</p>
      </div>
    );
  }

  if (todos.length === 0 && folders.length > 0) {
    // Сортируем папки: сначала закрепленные, потом обычные
    const sortedFolders = [...folders].sort((a, b) => {
      const pinnedA = a.pinned ? 1 : 0;
      const pinnedB = b.pinned ? 1 : 0;
      return pinnedB - pinnedA;
    });

    return (
      <div className="space-y-2">
        <div>
          {sortedFolders.map((folder) => (
            <div
              className="flex justify-between items-center p-4 border mb-2 border-gray-200 rounded-lg bg-white gap-3"
              key={folder.id}
            >
              <div className="flex flex-1 gap-3 items-center">
                <Folder className="w-6 h-6" />
                {editingFolderId === folder.id ? (
                  <input
                    type="text"
                    value={editingFolderText}
                    className="p-2 max-h-8 w-full border border-white bg-gray-100 rounded-md transition-all duration-200 focus:border-neutral-400 focus:outline-none focus:shadow-[0_0_0_4px_rgba(105,105,105,0.2)]"
                    onChange={(e) => setEditingFolderText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditingFolder();
                      if (e.key === "Escape") cancelEditingFolder();
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex items-center gap-3 duration-200 break-all ${
                      !folder.pinned
                        ? "text-black"
                        : "line-through text-gray-500"
                    }`}
                  >
                    {folder.title}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {editingFolderId === folder.id ? (
                  <>
                    <button
                      className="p-2 text-center rounded-lg hover:bg-neutral-200"
                      onClick={saveEditingFolder}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-center rounded-lg hover:bg-neutral-200"
                      onClick={cancelEditingFolder}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="p-2 text-center rounded-lg hover:bg-neutral-200 duration-200"
                      onClick={() => startEditingFolder(folder)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-center rounded-lg hover:bg-neutral-200"
                      onClick={() => onDeleteFolder(folder.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {folder.pinned === true ? (
                      <button
                        className="p-2 text-black duration-200 hover:bg-neutral-200 text-center rounded-lg"
                        onClick={() => onToggleFolderPin(folder.id)}
                      >
                        <PinOff className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        className="p-2 text-center rounded-lg duration-200 text-gray-400 hover:bg-neutral-200 hover:text-black"
                        onClick={() => onToggleFolderPin(folder.id)}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEditing = () => {
    if (editingId && editingText.trim()) {
      onUpdateTodo(editingId, editingText.trim());
      setEditingId(null);
      setEditingText("");
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  const startEditingFolder = (folder: TodoFolder) => {
    setEditingFolderId(folder.id);
    setEditingFolderText(folder.title);
  };

  const saveEditingFolder = () => {
    if (editingFolderId && editingFolderText.trim()) {
      onUpdateFolder(editingFolderId, editingFolderText.trim());
      setEditingFolderId(null);
      setEditingFolderText("");
    }
  };
  const cancelEditingFolder = () => {
    setEditingFolderId(null);
    setEditingFolderText("");
  };

  return (
    <div className="space-y-2">
      <div>
        {groupedTodos.length > 0 ? (
          groupedTodos.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2 mb-2">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-white gap-3">
                {group.folder && (
                  <>
                    <div className="flex flex-1 gap-3 items-center">
                      <Folder
                        className={`w-6 h-6 duration-200 ${
                          group.folder.pinned ? "text-blue-400" : "text-black"
                        }`}
                      />
                      {editingFolderId === group.folder.id ? (
                        <input
                          type="text"
                          value={editingFolderText}
                          className="p-2 max-h-8 w-full border border-white bg-gray-100 rounded-md transition-all duration-200 focus:border-neutral-400 focus:outline-none focus:shadow-[0_0_0_4px_rgba(105,105,105,0.2)]"
                          onChange={(e) => setEditingFolderText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditingFolder();
                            if (e.key === "Escape") cancelEditingFolder();
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="flex items-center gap-3 duration-200 break-all">
                            {group.folder.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({group.todos.length})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {editingFolderId === group.folder.id ? (
                        <>
                          <button
                            className="p-2 text-center rounded-lg hover:bg-neutral-200"
                            onClick={saveEditingFolder}
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-center rounded-lg hover:bg-neutral-200"
                            onClick={cancelEditingFolder}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="p-2 text-center rounded-lg hover:bg-neutral-200 duration-200"
                            onClick={() => {
                              if (group.folder) {
                                startEditingFolder(group.folder);
                              }
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-center rounded-lg hover:bg-neutral-200"
                            onClick={() => onDeleteFolder(group.folder!.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {group.folder.pinned === true ? (
                            <button
                              className="p-2 text-black duration-200 hover:bg-neutral-200 text-center rounded-lg"
                              onClick={() =>
                                onToggleFolderPin(group.folder!.id)
                              }
                            >
                              <PinOff className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              className="p-2 text-center rounded-lg duration-200 text-gray-400 hover:bg-neutral-200 hover:text-black"
                              onClick={() =>
                                onToggleFolderPin(group.folder!.id)
                              }
                            >
                              <Pin className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
                {!group.folder && (
                  <>
                    <div className="flex flex-1 gap-3 items-center">
                      <Folder className="w-6 h-6" />
                      <span className="text-gray-500">No folder</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="p-2 text-center rounded-lg hover:bg-neutral-200"
                        onClick={onDeleteNoFolder}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div>
                {group.todos.map((todo) => (
                  <div
                    className="flex justify-between items-center ml-8 mb-2 p-4 border border-gray-200 rounded-lg bg-white gap-3"
                    key={todo.id}
                  >
                    <div className="flex flex-1 gap-3 items-center">
                      <Checkbox
                        className="border border-gray-300 bg-gray-200"
                        checked={todo.completed}
                        onCheckedChange={() => onToggleTodo(todo.id)}
                      />

                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editingText}
                          className="p-2 max-h-8 w-full border border-white bg-gray-100 rounded-md transition-all duration-200 focus:border-neutral-400 focus:outline-none focus:shadow-[0_0_0_4px_rgba(105,105,105,0.2)]"
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditing();
                            if (e.key === "Escape") cancelEditing();
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`flex items-center gap-3 duration-200 break-all ${
                            !todo.completed
                              ? "text-black"
                              : "line-through text-gray-500"
                          }`}
                        >
                          {todo.text}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {editingId === todo.id ? (
                        <>
                          <button
                            className="p-2 text-center rounded-lg hover:bg-neutral-200"
                            onClick={saveEditing}
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-center rounded-lg hover:bg-neutral-200"
                            onClick={cancelEditing}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={`p-2 text-center rounded-lg hover:bg-neutral-200 duration-200 ${
                              !todo.completed
                                ? "hover:bg-neutral-200"
                                : "text-neutral-400"
                            }`}
                            onClick={() => {
                              startEditing(todo);
                            }}
                            disabled={todo.completed}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-center rounded-lg hover:bg-neutral-200"
                            onClick={() => onDeleteTodo(todo.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {todo.pinned === true ? (
                            <>
                              <button
                                className="p-2 text-black duration-200 hover:bg-neutral-200 text-center rounded-lg"
                                onClick={() => onTogglePin(todo.id)}
                              >
                                <PinOff className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              className="p-2 text-center rounded-lg duration-200 text-gray-400 hover:bg-neutral-200 hover:text-black"
                              onClick={() => onTogglePin(todo.id)}
                            >
                              <Pin className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 border border-gray-300 rounded-lg bg-white text-center">
            <p className="text-gray-500">No content to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
