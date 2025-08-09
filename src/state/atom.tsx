import { Todo, FilterType, TodoFolder } from "../types";
import { atomWithStorage } from "jotai/utils";

export const todosAtom = atomWithStorage<Todo[]>("todos", []);
export const foldersAtom = atomWithStorage<TodoFolder[]>("folders", []);
export const filterAtom = atomWithStorage<FilterType>("filter", "all");
