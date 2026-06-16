import db from "../db/connection";
import type { UserRow, UserDTO, FilterValueDTO, UsersResponseDTO, UsersQueryDTO } from "../types";

interface WhereClause {
  sql: string;
  params: unknown[];
}

function buildWhere(query: UsersQueryDTO): WhereClause {
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (query.q?.trim()) {
    clauses.push("(u.first_name LIKE ? OR u.last_name LIKE ?)");
    const pattern = `%${query.q.trim()}%`;
    params.push(pattern, pattern);
  }

  if (query.nationalities && query.nationalities.length > 0) {
    const placeholders = query.nationalities.map(() => "?").join(", ");
    clauses.push(`u.nationality IN (${placeholders})`);
    params.push(...query.nationalities);
  }

  if (query.hobbies && query.hobbies.length > 0) {
    const placeholders = query.hobbies.map(() => "?").join(", ");
    clauses.push(`
      u.id IN (
        SELECT uh.user_id
        FROM user_hobbies uh
        JOIN hobbies h ON h.id = uh.hobby_id
        WHERE h.name IN (${placeholders})
        GROUP BY uh.user_id
        HAVING COUNT(DISTINCT h.id) = ?
      )
    `);
    params.push(...query.hobbies, query.hobbies.length);
  }

  return {
    sql: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

function attachHobbies(userRows: UserRow[]): UserDTO[] {
  if (userRows.length === 0) return [];

  const placeholders = userRows.map(() => "?").join(", ");
  const ids = userRows.map((u) => u.id);

  const hobbyRows = db
    .prepare(
      `SELECT uh.user_id, h.name
       FROM user_hobbies uh
       JOIN hobbies h ON h.id = uh.hobby_id
       WHERE uh.user_id IN (${placeholders})`
    )
    .all(...ids) as { user_id: number; name: string }[];

  const hobbyMap: Record<number, string[]> = {};
  for (const row of hobbyRows) {
    if (!hobbyMap[row.user_id]) hobbyMap[row.user_id] = [];
    hobbyMap[row.user_id].push(row.name);
  }

  return userRows.map((u) => ({ ...u, hobbies: hobbyMap[u.id] ?? [] }));
}

export function getUsers(query: UsersQueryDTO): UsersResponseDTO {
  const { sql: whereSQL, params } = buildWhere(query);
  // Exclude same-type filter from aggregations so multi-select remains possible
  const { sql: hobbiesWhereSQL, params: hobbiesParams } = buildWhere({ ...query, hobbies: [] });
  const { sql: nationalitiesWhereSQL, params: nationalitiesParams } = buildWhere({ ...query, nationalities: [] });
  const { sortBy, sortDir, page, limit } = query;
  const offset = (page - 1) * limit;
  const direction = sortDir === "desc" ? "DESC" : "ASC";

  const { total } = db
    .prepare(`SELECT COUNT(*) as total FROM users u ${whereSQL}`)
    .get(...params) as { total: number };

  const userRows = db
    .prepare(
      `SELECT u.id, u.avatar, u.first_name, u.last_name, u.age, u.nationality
       FROM users u
       ${whereSQL}
       ORDER BY u.${sortBy} ${direction}, u.id ASC
       LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset) as UserRow[];

  const data = attachHobbies(userRows);

  const topHobbies = db
    .prepare(
      `SELECT h.name as value, COUNT(DISTINCT uh.user_id) as count
       FROM hobbies h
       JOIN user_hobbies uh ON uh.hobby_id = h.id
       JOIN users u ON u.id = uh.user_id
       ${hobbiesWhereSQL}
       GROUP BY h.id
       ORDER BY count DESC, h.name ASC
       LIMIT 20`
    )
    .all(...hobbiesParams) as FilterValueDTO[];

  const topNationalities = db
    .prepare(
      `SELECT u.nationality as value, COUNT(*) as count
       FROM users u
       ${nationalitiesWhereSQL}
       GROUP BY u.nationality
       ORDER BY count DESC, u.nationality ASC
       LIMIT 20`
    )
    .all(...nationalitiesParams) as FilterValueDTO[];

  return {
    data,
    total,
    page,
    limit,
    hasMore: offset + data.length < total,
    filters: {
      hobbies: topHobbies,
      nationalities: topNationalities,
    },
  };
}
