import type { UsersParams, UsersResponseDTO } from "../types";

const API_BASE = "/users";

export async function fetchUsers(params: UsersParams): Promise<UsersResponseDTO> {
  const search = new URLSearchParams();

  if (params.q) search.set("q", params.q);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortDir) search.set("sortDir", params.sortDir);
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));

  if (params.nationalities?.length) {
    search.set("nationalities", params.nationalities.join(","));
  }
  if (params.hobbies?.length) {
    search.set("hobbies", params.hobbies.join(","));
  }

  const res = await fetch(`${API_BASE}?${search.toString()}`);

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
