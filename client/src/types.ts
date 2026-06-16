export interface UserDTO {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface FilterValueDTO {
  value: string;
  count: number;
}

export interface UsersResponseDTO {
  data: UserDTO[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: {
    hobbies: FilterValueDTO[];
    nationalities: FilterValueDTO[];
  };
}

export type SortField = "first_name" | "last_name" | "age" | "nationality";
export type SortDir = "asc" | "desc";

export interface UsersParams {
  q?: string;
  nationalities?: string[];
  hobbies?: string[];
  sortBy?: SortField;
  sortDir?: SortDir;
  page: number;
  limit: number;
}
