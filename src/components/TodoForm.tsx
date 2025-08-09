import { useState } from "react";
import { Plus, Folder } from "lucide-react";
import "../styles/TodoForm.css";
import { TodoFormProps } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TodoForm({
  onAddTodo,
  folders,
  onAddFolder,
}: TodoFormProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [folderOption, setFolderOption] = useState<string>("new-folder");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
    setIsValid(e.target.value.trim().length > 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue.trim()) {
      let folderId: string | null = null;

      if (folderOption === "new-folder" && newFolderName.trim()) {
        const newFolderId = onAddFolder({ title: newFolderName.trim() });
        folderId = newFolderId;
        setNewFolderName("");
      } else if (folderOption === "existing" && selectedFolderId) {
        folderId = selectedFolderId;
      } else if (folderOption === "no-folder") {
        folderId = null;
      }
      onAddTodo({ text: inputValue.trim(), folderId });
      setInputValue("");
      setIsValid(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  const handleFolderOptionChange = (value: string) => {
    setFolderOption(value);
    if (value === "existing" && folders.length > 0) {
      setSelectedFolderId(folders[0].id);
    }
  };
  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white text-sm mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className=" flex-1 p-2 max-h-8 border border-white bg-gray-100 rounded-md transition-all duration-200 focus:border-neutral-400 focus:outline-none focus:shadow-[0_0_0_4px_rgba(105,105,105,0.2)]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`flex items-center rounded-md justify-center pr-2 pl-2 pt-0 pb-0 transition-all duration-300 font-medium ${
              isValid
                ? `bg-black text-white hover:bg-neutral-800`
                : `bg-zinc-500 text-white`
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 ml-2">
            <Folder className="w-4 h-4 text-gray-500" />
            <Select
              value={folderOption}
              onValueChange={handleFolderOptionChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-folder">No folder</SelectItem>
                <SelectItem value="new-folder">Create new folder</SelectItem>
                {folders.length > 0 && (
                  <SelectItem value="existing">
                    Select existing folder
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* New folder name input */}
        {folderOption === "new-folder" && (
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter folder name..."
            className="ml-8 max-w-48 flex-1 p-2 max-h-8 border border-white bg-gray-100 rounded-md transition-all duration-200 focus:border-neutral-400 focus:outline-none focus:shadow-[0_0_0_4px_rgba(105,105,105,0.2)]"
          />
        )}

        {/* Existing folder selection */}
        {folderOption === "existing" && folders.length > 0 && (
          <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
            <SelectTrigger className="ml-8 w-48">
              <SelectValue placeholder="Select a folder" />
            </SelectTrigger>
            <SelectContent>
              {folders
                .sort((a, b) => {
                  // Sort pinned folders first, then by name
                  if (a.pinned && !b.pinned) return -1;
                  if (!a.pinned && b.pinned) return 1;
                  return a.title.localeCompare(b.title);
                })
                .map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.pinned ? "📌 " : ""}
                    {folder.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </form>
    </div>
  );
}
