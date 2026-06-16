import type { FilterValueDTO } from "../types";
import FilterGroup from "./FilterGroup";

interface Props {
  hobbies: FilterValueDTO[];
  nationalities: FilterValueDTO[];
  selectedHobbies: string[];
  selectedNationalities: string[];
  onToggleHobby: (value: string) => void;
  onToggleNationality: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  hobbies,
  nationalities,
  selectedHobbies,
  selectedNationalities,
  onToggleHobby,
  onToggleNationality,
  isOpen,
  onClose,
}: Props) {
  const hasActiveFilters = selectedHobbies.length > 0 || selectedNationalities.length > 0;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-blue-100 border-r border-blue-200 z-40 flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto lg:flex
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-200">
          <h2 className="font-semibold text-gray-800">Filters</h2>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={() => {
                  selectedHobbies.forEach(onToggleHobby);
                  selectedNationalities.forEach(onToggleNationality);
                }}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <FilterGroup
            title="Hobbies"
            items={hobbies}
            selected={selectedHobbies}
            onToggle={onToggleHobby}
          />
          <FilterGroup
            title="Nationality"
            items={nationalities}
            selected={selectedNationalities}
            onToggle={onToggleNationality}
          />
        </div>
      </aside>
    </>
  );
}
