import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { initSchema } from "./db/schema";
import usersRouter from "./routes/users";
import swaggerSpec from "./swagger";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

initSchema();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", usersRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
