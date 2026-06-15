import { Request, Response } from "express";
import { z } from "zod";
import { getUsers } from "../services/users";

const querySchema = z.object({
  q: z.string().optional(),
  nationalities: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : v.split(",").filter(Boolean)))
    .optional(),
  hobbies: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : v.split(",").filter(Boolean)))
    .optional(),
  sortBy: z.enum(["first_name", "last_name", "age", "nationality"]).default("first_name"),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export function getUsersController(req: Request, res: Response): void {
  const parsed = querySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const result = getUsers(parsed.data);
  res.json(result);
}
