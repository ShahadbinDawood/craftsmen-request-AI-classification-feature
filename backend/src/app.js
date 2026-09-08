import "dotenv/config";
import express from "express";
import cors from "cors";
import { classifyLimiter } from "./middleware/rateLimiter.js";

import classifyRoute from "./routes/classify.js";
import requestsRoute from "./routes/requests.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/classify", classifyLimiter, classifyRoute);
app.use("/api/requests", requestsRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
