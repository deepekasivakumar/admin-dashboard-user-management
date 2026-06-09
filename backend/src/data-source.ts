import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true, // Auto-creates tables based on entities
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [],
    ssl: {
        rejectUnauthorized: false, // Required for cloud databases like Neon
    }
});
