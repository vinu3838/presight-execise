import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterValueDTO } from "../types";

interface Props {
  title: string;
  items: FilterValueDTO[];
  selected: string[];
  onToggle: (value: string) => void;
}

export default function FilterGroup({ title, items, selected, onToggle }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {title}
          </span>
          {selected.length > 0 && (
            <span className="text-xs bg-blue-600 text-white rounded-full px-1.5 py-0.5 leading-none">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="p-2">
          {items.length === 0 ? (
            <p className="text-xs text-gray-400 italic px-2 py-1">No results</p>
          ) : (
            <ul className="space-y-0.5">
              {items.map((item) => {
                const isSelected = selected.includes(item.value);
                return (
                  <li key={item.value}>
                    <button
                      onClick={() => onToggle(item.value)}
                      className={`w-full flex items-center justify-between text-sm px-2 py-1.5 rounded-md transition-colors text-left cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="truncate">{item.value}</span>
                      <span
                        className={`text-xs shrink-0 ml-2 rounded-full px-1.5 py-0.5 ${
                          isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
