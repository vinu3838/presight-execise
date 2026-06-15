// Raw row returned from the users table (no joined data)
export interface UserRow {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
}

// Shape sent to the client — includes assembled hobbies array
export interface UserDTO {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

// Single item in a top-20 filter list
export interface FilterValueDTO {
  value: string;
  count: number;
}

// Full API response for GET /users
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

// Validated and parsed query params (inferred from zod schema in controller)
export interface UsersQueryDTO {
  q?: string;
  nationalities?: string[];
  hobbies?: string[];
  sortBy: "first_name" | "last_name" | "age" | "nationality";
  sortDir: "asc" | "desc";
  page: number;
  limit: number;
}
