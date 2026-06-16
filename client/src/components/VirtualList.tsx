import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { UserDTO } from "../types";
import UserCard from "./UserCard";

interface Props {
  users: UserDTO[];
  total: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
}

const CARD_HEIGHT = 104;

export default function VirtualList({
  users,
  total,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
  fetchNextPage,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // +1 for the loading sentinel row when there are more pages
  const count = hasNextPage ? users.length + 1 : users.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => containerRef.current,
    estimateSize: () => CARD_HEIGHT,
    overscan: 5,
    gap: 8,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Trigger next page when the sentinel row becomes visible
  useEffect(() => {
    const last = virtualItems[virtualItems.length - 1];
    if (!last) return;
    if (last.index >= users.length && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualItems, users.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-sm">Loading users…</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-red-500 space-y-1">
          <p className="font-medium">Failed to load users</p>
          <p className="text-sm text-gray-400">Check that the server is running</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400 space-y-1">
          <p className="font-medium">No users found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <p className="text-xs text-gray-400 px-4 py-2 border-b border-gray-100">
        {total.toLocaleString()} result{total !== 1 ? "s" : ""}
      </p>
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-2">
        <div
          style={{ height: virtualizer.getTotalSize(), position: "relative" }}
        >
          {virtualItems.map((item) => {
            const isSentinel = item.index >= users.length;

            return (
              <div
                key={item.key}
                data-index={item.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(${item.start}px)`,
                }}
              >
                {isSentinel ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <UserCard user={users[item.index]} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
