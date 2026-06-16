import { Router } from "express";
import { getUsersController } from "../controllers/users";

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users
 *     description: Returns a paginated, searchable, filterable, sortable list of users, along with top-20 hobby and nationality facets scoped to the current filters.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Case-insensitive search across first/last name.
 *       - in: query
 *         name: nationalities
 *         schema:
 *           type: string
 *         description: Comma-separated list of nationalities to filter by (OR semantics).
 *         example: Finland,Sweden
 *       - in: query
 *         name: hobbies
 *         schema:
 *           type: string
 *         description: Comma-separated list of hobbies to filter by (AND semantics).
 *         example: chess,hiking
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [first_name, last_name, age, nationality]
 *           default: first_name
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersResponse"
 *       400:
 *         description: Invalid query parameters.
 */
router.get("/", getUsersController);

export default router;
