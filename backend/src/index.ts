import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

AppDataSource.initialize()
    .then(() => console.log("Connected to PostgreSQL (Neon) via TypeORM!"))
    .catch(error => console.log("Database connection error: ", error));

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;
