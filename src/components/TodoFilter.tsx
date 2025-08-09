import { TodoFilterProps } from "../types";

export default function TodoFilter({
  currentFilter,
  onFilterChange,
  counts,
}: TodoFilterProps) {
  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white text-sm mb-6">
      <div className="flex gap-2 flex-wrap">
        <button
          className={`flex items-center border border-gray-300 rounded-md px-4 py-2 justify-center transition-all duration-300 font-medium ${
            currentFilter === "all"
              ? "bg-black text-white hover:bg-neutral-800"
              : "bg-white text-gray-700 hover:bg-neutral-200"
          }`}
          onClick={() => onFilterChange("all")}
        >
          All({counts.all})
        </button>
        <button
          className={`flex items-center border border-gray-300 rounded-md px-4 py-2 justify-center transition-all duration-300 font-medium ${
            currentFilter === "active"
              ? "bg-black text-white hover:bg-neutral-800"
              : "bg-white text-gray-700 hover:bg-neutral-200"
          }`}
          onClick={() => onFilterChange("active")}
        >
          Active({counts.active})
        </button>
        <button
          className={`flex items-center border border-gray-300 rounded-md px-4 py-2 justify-center transition-all duration-300 font-medium ${
            currentFilter === "completed"
              ? "bg-black text-white hover:bg-neutral-800"
              : "bg-white text-gray-700 hover:bg-neutral-200"
          }`}
          onClick={() => onFilterChange("completed")}
        >
          Completed({counts.completed})
        </button>
      </div>
    </div>
  );
}
