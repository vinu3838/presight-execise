import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/users";
import type { SortField, SortDir, FilterValueDTO } from "../types";

const PAGE_SIZE = 20;

interface UseUsersParams {
  q: string;
  nationalities: string[];
  hobbies: string[];
  sortBy: SortField;
  sortDir: SortDir;
}

export function useUsers(params: UseUsersParams) {
  const query = useInfiniteQuery({
    queryKey: ["users", params],
    queryFn: ({ pageParam }) =>
      fetchUsers({
        ...params,
        page: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const allUsers = query.data?.pages.flatMap((p) => p.data) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;

  // Sidebar filters always come from the latest page so they reflect current state
  const latestFilters = query.data?.pages[query.data.pages.length - 1]?.filters ?? {
    hobbies: [] as FilterValueDTO[],
    nationalities: [] as FilterValueDTO[],
  };

  return {
    users: allUsers,
    total,
    filters: latestFilters,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
