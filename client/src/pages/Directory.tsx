import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import type { SortField, SortDir } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { useUsers } from "../hooks/useUsers";
import SearchInput from "../components/SearchInput";
import SortControls from "../components/SortControls";
import Sidebar from "../components/Sidebar";
import VirtualList from "../components/VirtualList";

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function Directory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Read state from URL
  const searchText = searchParams.get("q") ?? "";
  const selectedHobbies = searchParams.getAll("hobbies").flatMap((v) => v.split(",")).filter(Boolean);
  const selectedNationalities = searchParams.getAll("nationalities").flatMap((v) => v.split(",")).filter(Boolean);
  const sortBy = (searchParams.get("sortBy") as SortField) ?? "first_name";
  const sortDir = (searchParams.get("sortDir") as SortDir) ?? "asc";

  // Debounce the search text before it hits the API
  const debouncedSearch = useDebounce(searchText, 300);

  // Write state to URL
  const setParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const handleToggleHobby = useCallback(
    (value: string) => {
      const next = toggle(selectedHobbies, value);
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.delete("hobbies");
        if (next.length) p.set("hobbies", next.join(","));
        return p;
      });
    },
    [selectedHobbies, setSearchParams]
  );

  const handleToggleNationality = useCallback(
    (value: string) => {
      const next = toggle(selectedNationalities, value);
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.delete("nationalities");
        if (next.length) p.set("nationalities", next.join(","));
        return p;
      });
    },
    [selectedNationalities, setSearchParams]
  );

  const handleClearAllFilters = useCallback(() => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete("hobbies");
      p.delete("nationalities");
      return p;
    });
  }, [setSearchParams]);

  const { users, total, filters, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useUsers({
      q: debouncedSearch,
      nationalities: selectedNationalities,
      hobbies: selectedHobbies,
      sortBy,
      sortDir,
    });

  const activeFilterCount = selectedHobbies.length + selectedNationalities.length;

  return (
    <div className="flex h-screen bg-blue-50 overflow-hidden">
      <Sidebar
        hobbies={filters.hobbies}
        nationalities={filters.nationalities}
        selectedHobbies={selectedHobbies}
        selectedNationalities={selectedNationalities}
        onToggleHobby={handleToggleHobby}
        onToggleNationality={handleToggleNationality}
        onClearAll={handleClearAllFilters}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 bg-blue-50 border-b border-blue-200 shrink-0">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SearchInput
            value={searchText}
            onChange={(v) => setParam("q", v)}
          />

          <SortControls
            sortBy={sortBy}
            sortDir={sortDir}
            onSortByChange={(v) => setParam("sortBy", v)}
            onSortDirChange={(v) => setParam("sortDir", v)}
          />
        </header>

        <VirtualList
          users={users}
          total={total}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          isError={isError}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
}
