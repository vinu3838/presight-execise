import type { SortField, SortDir } from "../types";

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "age", label: "Age" },
  { value: "nationality", label: "Nationality" },
];

interface Props {
  sortBy: SortField;
  sortDir: SortDir;
  onSortByChange: (field: SortField) => void;
  onSortDirChange: (dir: SortDir) => void;
}

export default function SortControls({ sortBy, sortDir, onSortByChange, onSortDirChange }: Props) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as SortField)}
        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {SORT_FIELDS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={sortDir === "asc" ? "Ascending" : "Descending"}
      >
        {sortDir === "asc" ? (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        )}
      </button>
    </div>
  );
}
