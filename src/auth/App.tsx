// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./utils/auth-routes";
import tokenRoutes from "./api/token-routes";

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Logger

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Authentication API is running" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
