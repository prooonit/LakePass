import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import marinaRoutes from "./routes/marina.routes.js";
import boatRoutes from "./routes/boat.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/marinas", marinaRoutes ,boatRoutes);


app.use(errorHandler);

export default app;
